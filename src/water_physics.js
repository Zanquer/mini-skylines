import { GRID_SIZE, CORNER_STRIDE, inBounds, cIdx, idx, SEA_LEVEL } from './mapgen.js';

export class WaterPhysics {
  constructor(sim) {
    this.sim = sim;
    const N = GRID_SIZE * GRID_SIZE;
    this.cellElev = new Float32Array(N);
    this.nextWater = new Float32Array(N);
    this.nextPoll = new Float32Array(N);
    this.flowMag = new Float32Array(N);
    this.flowDirX = new Float32Array(N);
    this.flowDirZ = new Float32Array(N);
    this._instFlowX = new Float32Array(N);
    this._instFlowZ = new Float32Array(N);
    this.tsunamiTimer = 0;

    const CN = CORNER_STRIDE * CORNER_STRIDE;
    this._cornerField = {
      surfY: new Float32Array(CN),
      depth: new Float32Array(CN),
      poll: new Float32Array(CN),
      foam: new Float32Array(CN),
      flowX: new Float32Array(CN),
      flowZ: new Float32Array(CN)
    };
    this._cornerSurfTmp = new Float32Array(CN);
    this._cornerWetMask = new Uint8Array(CN);
    this._cornerWetCount = new Uint8Array(CN);
    this._smoothCornerSurf = new Float32Array(CN);
    this._smoothCornerFoam = new Float32Array(CN);
    this._smoothCornerInit = false;

    this.refreshCellElevations();
    this._seedInitialFlowVectors();
  }

  refreshCellElevations() {
    this._smoothCornerInit = false;
    const c = this.sim.corners;
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        this.cellElev[idx(x, z)] =
          (c[cIdx(x, z)] +
           c[cIdx(x + 1, z)] +
           c[cIdx(x, z + 1)] +
           c[cIdx(x + 1, z + 1)]) * 0.25;
      }
    }
  }

  _seedInitialFlowVectors() {
    const w = this.sim.waterDepth;
    const elev = this.cellElev;
    if (!w) return;
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        if (w[i] < 0.02) continue;
        const sC = elev[i] + w[i];
        const sE = x + 1 < GRID_SIZE ? elev[idx(x + 1, z)] + w[idx(x + 1, z)] : sC;
        const sW = x - 1 >= 0 ? elev[idx(x - 1, z)] + w[idx(x - 1, z)] : sC;
        const sS = z + 1 < GRID_SIZE ? elev[idx(x, z + 1)] + w[idx(x, z + 1)] : sC;
        const sN = z - 1 >= 0 ? elev[idx(x, z - 1)] + w[idx(x, z - 1)] : sC;
        const gx = (sW - sE) * 1.8;
        const gz = (sN - sS) * 1.8;
        const mag = Math.hypot(gx, gz);
        this.flowDirX[i] = mag > 1.0 ? gx / mag : gx;
        this.flowDirZ[i] = mag > 1.0 ? gz / mag : gz;
        this.flowMag[i] = Math.min(1.0, mag * 0.65);
      }
    }
  }

  triggerTsunami() {
    this.tsunamiTimer = 6.5;
  }

  /**
   * Geomorphological & Hydraulic Survey for candidate Hydroelectric Dam span [{x, z}, ...].
   * Evaluates river crossing wetness, bank abutment containment height, and longitudinal slope drop.
   */
  evaluateDamSite(tiles) {
    const FLAT_WARN = '两岸地势过平，蓄水将绕坝漫流且缺乏发电落差！建议建在西北高山V型峡谷';
    if (!Array.isArray(tiles) || tiles.length === 0) {
      return {
        valid: false,
        rating: '差·平地低岸(易漫堤0发电)',
        estHead: 0,
        estMW: 0,
        warning: FLAT_WARN
      };
    }

    const pts = [];
    const seen = new Set();
    for (let i = 0; i < tiles.length; i++) {
      const p = tiles[i];
      if (!p || !inBounds(p.x, p.z)) continue;
      const key = idx(p.x, p.z);
      if (!seen.has(key)) {
        seen.add(key);
        pts.push({ x: p.x, z: p.z, i: key });
      }
    }

    if (pts.length < 2) {
      return {
        valid: false,
        rating: '差·平地低岸(易漫堤0发电)',
        estHead: 0,
        estMW: 0,
        warning: FLAT_WARN
      };
    }

    const corners = this.sim.corners;
    const w = this.sim.waterDepth;
    const elev = this.cellElev;

    let wetCount = 0;
    let minBedElev = Infinity;
    let wetCenterX = 0;
    let wetCenterZ = 0;

    for (let k = 0; k < pts.length; k++) {
      const { x, z, i } = pts[k];
      const e = elev[i];
      if (e < minBedElev) minBedElev = e;

      let localWet = w[i] > 0.04;
      if (!localWet) {
        // Also check immediate orthogonal neighbors for thick/diagonal brush lines
        const nbs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let d = 0; d < 4; d++) {
          const nx = x + nbs[d][0];
          const nz = z + nbs[d][1];
          if (inBounds(nx, nz) && w[idx(nx, nz)] > 0.08) {
            localWet = true;
            minBedElev = Math.min(minBedElev, elev[idx(nx, nz)]);
          }
        }
      }
      if (localWet) {
        wetCount++;
        wetCenterX += x;
        wetCenterZ += z;
      }
    }

    if (wetCount === 0) {
      return {
        valid: false,
        rating: '差·平地低岸(易漫堤0发电)',
        estHead: 0,
        estMW: 0,
        warning: FLAT_WARN
      };
    }

    wetCenterX /= wetCount;
    wetCenterZ /= wetCount;

    // Endpoint shoulder containment: inspect first & last endpoints + up to 2 tiles outward along dam axis
    const pFirst = pts[0];
    const pLast = pts[pts.length - 1];
    const spanDx = pLast.x - pFirst.x;
    const spanDz = pLast.z - pFirst.z;
    const spanLen = Math.max(1, Math.hypot(spanDx, spanDz));
    const ux = spanDx / spanLen;
    const uz = spanDz / spanLen;

    const sampleShoulderMax = (px, pz, dirSign) => {
      let maxH = elev[idx(px, pz)];
      for (let step = 0; step <= 2; step++) {
        const sx = Math.round(px + ux * dirSign * step);
        const sz = Math.round(pz + uz * dirSign * step);
        if (!inBounds(sx, sz)) continue;
        maxH = Math.max(
          maxH,
          elev[idx(sx, sz)],
          corners[cIdx(sx, sz)],
          corners[cIdx(sx + 1, sz)],
          corners[cIdx(sx, sz + 1)],
          corners[cIdx(sx + 1, sz + 1)]
        );
      }
      return maxH;
    };

    const bankA = sampleShoulderMax(pFirst.x, pFirst.z, -1);
    const bankB = sampleShoulderMax(pLast.x, pLast.z, 1);
    const maxBankElev = Math.max(bankA, bankB);
    const minBankElev = Math.min(bankA, bankB);
    // Both abutments must contain the reservoir; an unanchored end in low floodplain leaks water around!
    const effectiveBankElev = minBankElev * 0.78 + maxBankElev * 0.22;
    const abutmentDrop = Math.max(0, effectiveBankElev - minBedElev);

    // Perpendicular river gradient (upstream vs downstream over 1..5 tiles normal to dam line)
    const nx = -uz;
    const nz = ux;
    let sidePosSum = 0, sidePosCnt = 0;
    let sideNegSum = 0, sideNegCnt = 0;

    for (let dist = 1; dist <= 5; dist++) {
      const ax = Math.round(wetCenterX + nx * dist);
      const az = Math.round(wetCenterZ + nz * dist);
      if (inBounds(ax, az)) {
        const ai = idx(ax, az);
        sidePosSum += elev[ai] + w[ai] * 0.65;
        sidePosCnt++;
      }
      const bx = Math.round(wetCenterX - nx * dist);
      const bz = Math.round(wetCenterZ - nz * dist);
      if (inBounds(bx, bz)) {
        const bi = idx(bx, bz);
        sideNegSum += elev[bi] + w[bi] * 0.65;
        sideNegCnt++;
      }
    }

    const avgPos = sidePosCnt > 0 ? sidePosSum / sidePosCnt : minBedElev;
    const avgNeg = sideNegCnt > 0 ? sideNegSum / sideNegCnt : minBedElev;
    const slopeDrop = Math.abs(avgPos - avgNeg);

    // Flat plains / low bank containment -> water spills around dam with 0 ~ 30 MW!
    if (abutmentDrop < 0.48) {
      const estHead = +(Math.min(0.18, Math.max(0, abutmentDrop * 0.36))).toFixed(2);
      const estMW = Math.round(Math.min(28, Math.max(0, (abutmentDrop - 0.30) * 140 * Math.min(1, slopeDrop * 5))));
      return {
        valid: true,
        rating: '差·平地低岸(易漫堤0发电)',
        estHead,
        estMW,
        warning: FLAT_WARN
      };
    }

    // Deep NW V-Gorge -> high hydraulic head & gigawatt hydro output!
    if (abutmentDrop >= 0.85 && slopeDrop >= 0.08) {
      const rawHead = Math.min(1.80, Math.max(0.92, abutmentDrop * 0.68 + slopeDrop * 0.65));
      const estHead = +rawHead.toFixed(2);
      const activeGates = Math.min(6, Math.max(2.5, wetCount));
      const estMW = Math.round(Math.min(1600, Math.max(660, estHead * (540 + activeGates * 82))));
      return {
        valid: true,
        rating: '优·深谷高落差',
        estHead,
        estMW,
        warning: ''
      };
    }

    // Moderate valley foothills
    const rawHead = Math.min(0.86, Math.max(0.34, abutmentDrop * 0.56 + slopeDrop * 0.45));
    const estHead = +rawHead.toFixed(2);
    const estMW = Math.round(Math.min(610, Math.max(120, estHead * (360 + Math.min(5, wetCount) * 52))));
    return {
      valid: true,
      rating: '良·河谷缓坡',
      estHead,
      estMW,
      warning: '河谷岸坡中等，可蓄水发电；特大山洪时需留意漫坝风险'
    };
  }

  /**
   * 💥 Catastrophic Dam Breach: collapses weakened dam span around (bx, bz),
   * unleashing an immediate high-velocity reservoir flood wave downstream!
   */
  breachDamSpan(bx, bz) {
    if (!inBounds(bx, bz)) return;
    const grid = this.sim.grid;
    const elev = this.cellElev;
    const w = this.sim.waterDepth;

    // 8-way BFS to collapse (bx, bz) and connected dam tiles within radius 3
    const collapsed = [];
    const visited = new Set([idx(bx, bz)]);
    const queue = [{ x: bx, z: bz }];

    while (queue.length > 0) {
      const cur = queue.shift();
      const ci = idx(cur.x, cur.z);
      const ct = grid[ci];
      if (!ct.dam && !(cur.x === bx && cur.z === bz)) continue;

      ct.dam = false;
      ct.damCrest = 0;
      ct.roadGround = 0;
      ct.roadBridge = false;
      ct.damOutputMW = 0;
      ct.damHealth = 100;
      ct.damStress = 0;
      collapsed.push(cur);

      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cur.x + dx;
          const nz = cur.z + dz;
          if (!inBounds(nx, nz)) continue;
          if (Math.hypot(nx - bx, nz - bz) > 3.15) continue;
          const ni = idx(nx, nz);
          if (visited.has(ni)) continue;
          visited.add(ni);
          if (grid[ni].dam) {
            queue.push({ x: nx, z: nz });
          }
        }
      }
    }

    // Immediate flood-wave surge from impounded reservoir into breached gap & downstream tailrace!
    for (let k = 0; k < collapsed.length; k++) {
      const { x, z } = collapsed[k];
      const ci = idx(x, z);
      let maxUpSurf = elev[ci];
      let upSrcIdx = -1;
      let minDnSurf = 999;
      let dnX = x, dnZ = z;

      for (let dz = -2; dz <= 2; dz++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const nz = z + dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (grid[ni].dam) continue;
          const nwVal = Math.max(w[ni], this.nextWater[ni]);
          const s = elev[ni] + nwVal;
          if (nwVal > 0.25 && s > maxUpSurf) {
            maxUpSurf = s;
            upSrcIdx = ni;
          }
          if (s < minDnSurf) {
            minDnSurf = s;
            dnX = nx;
            dnZ = nz;
          }
        }
      }

      if (upSrcIdx !== -1 && maxUpSurf > elev[ci] + 0.2) {
        const surgeDepth = Math.min(this.nextWater[upSrcIdx] * 0.45, (maxUpSurf - elev[ci]) * 0.55);
        if (surgeDepth > 0.05) {
          this.nextWater[upSrcIdx] = Math.max(0, this.nextWater[upSrcIdx] - surgeDepth * 0.65);
          this.nextWater[ci] = Math.max(this.nextWater[ci], surgeDepth);
          w[ci] = this.nextWater[ci];
        }
      }

      const vx = dnX - x;
      const vz = dnZ - z;
      const vLen = Math.max(1, Math.hypot(vx, vz));
      const dirX = vx / vLen;
      const dirZ = vz / vLen;

      // Velocity kick across breach zone so downstream waves & whitewater foam surge immediately
      for (let oz = -3; oz <= 3; oz++) {
        for (let ox = -3; ox <= 3; ox++) {
          const rx = x + ox;
          const rz = z + oz;
          if (!inBounds(rx, rz)) continue;
          const ri = idx(rx, rz);
          this.flowMag[ri] = 1.0;
          this._instFlowX[ri] += dirX * 1.25;
          this._instFlowZ[ri] += dirZ * 1.25;
          this.flowDirX[ri] = dirX;
          this.flowDirZ[ri] = dirZ;
        }
      }
    }

    this.sim.meshDirty = true;
    this.sim.traffic?.refreshRoadGraph?.();
    this.sim.onDamBreach?.(bx, bz);
  }

  step() {
    const N = GRID_SIZE * GRID_SIZE;
    const w = this.sim.waterDepth;
    const poll = this.sim.waterPoll;
    const grid = this.sim.grid;
    const elev = this.cellElev;

    this.nextWater.set(w);
    this.nextPoll.set(poll);
    this.flowMag.fill(0);
    this._instFlowX.fill(0);
    this._instFlowZ.fill(0);

    // 1. Mountain Springs, Rain/Evaporation & Sea-Bay Boundary
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        const t = grid[i];

        if (t.waterSpring > 0 && !t.dam) {
          // Alpine headwater inflow: flows briskly downhill when un-dammed, and can impound high head (or overtop if overloaded!)
          const maxSpringDepth = 1.55;
          if (this.nextWater[i] < maxSpringDepth) {
            const rate = 0.048 * Math.max(0.5, t.waterSpring / 0.54);
            const add = Math.min(rate, maxSpringDepth - this.nextWater[i]);
            const oldV = this.nextWater[i];
            this.nextWater[i] += add;
            // Fresh spring dilutes pollution
            this.nextPoll[i] = (this.nextPoll[i] * oldV) / Math.max(0.001, this.nextWater[i]);
          }
        }

        // Southeast ocean boundary (drains river outflow cleanly to SEA_LEVEL)
        const isSeaEdge = (x === GRID_SIZE - 1 && z >= 38) || (z === GRID_SIZE - 1 && x >= 38);
        if (isSeaEdge && elev[i] < SEA_LEVEL) {
          if (this.tsunamiTimer > 0) {
            this.nextWater[i] = Math.max(this.nextWater[i], (SEA_LEVEL + 1.45) - elev[i]);
            this._instFlowX[i] -= 0.75;
            this._instFlowZ[i] -= 0.75;
            this.flowMag[i] = Math.max(this.flowMag[i], 0.9);
          } else {
            const targetDepth = Math.max(0, SEA_LEVEL - elev[i]);
            this.nextWater[i] = this.nextWater[i] * 0.65 + targetDepth * 0.35;
            this.nextPoll[i] *= 0.85;
          }
        }
      }
    }

    if (this.tsunamiTimer > 0) {
      this.tsunamiTimer = Math.max(0, this.tsunamiTimer - 0.12);
    }

    // 2. Hydroelectric Dam Turbine Head Physics, Overtopping Stress & Catastrophic Breach
    let totalHydroMW = 0;
    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const dirs8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    const pwrBudget = this.sim.budgets?.power ?? 100;

    for (let z = 1; z < GRID_SIZE - 1; z++) {
      for (let x = 1; x < GRID_SIZE - 1; x++) {
        const i = idx(x, z);
        const t = grid[i];
        if (!t.dam) {
          t.damOutputMW = 0;
          t.damStress = 0;
          continue;
        }

        if (typeof t.damHealth !== 'number') t.damHealth = 100;
        if (typeof t.damStress !== 'number') t.damStress = 0;

        // Find highest water surface neighbor (upstream reservoir) and lowest surface neighbor (downstream tailrace)
        // Use 8 directions up to 2 steps so diagonal NW->SE canyon dams couple directly across the gorge!
        let upIdx = -1;
        let maxSurf = -999;
        let downIdx = -1;
        let minSurf = 999;

        for (const [dx, dz] of dirs8) {
          for (let step = 1; step <= 2; step++) {
            const nx = x + dx * step;
            const nz = z + dz * step;
            if (nx < 0 || nx >= GRID_SIZE || nz < 0 || nz >= GRID_SIZE) continue;
            const ni = idx(nx, nz);
            if (grid[ni].dam) continue;
            const surf = elev[ni] + this.nextWater[ni];
            if (this.nextWater[ni] > 0.06 && surf > maxSurf) {
              maxSurf = surf;
              upIdx = ni;
            }
            if (surf < minSurf) {
              minSurf = surf;
              downIdx = ni;
            }
            break;
          }
        }

        const hasReservoir = upIdx !== -1 && downIdx !== -1 && upIdx !== downIdx;
        const head = hasReservoir ? Math.max(0, maxSurf - minSurf) : 0;
        const overtop = (upIdx !== -1) ? Math.max(0, maxSurf - (t.damCrest + 0.05)) : 0;
        const headRatio = Math.max(0, head / 1.6);

        // Overtopping crest spill flux & structural stress
        if (overtop > 0) {
          t.damStress = Math.min(1.5, 0.75 + overtop * 2.5);
          if (hasReservoir) {
            const spill = Math.min(this.nextWater[upIdx] * 0.018, overtop * 0.022);
            if (spill > 0.0005) {
              this.nextWater[upIdx] -= spill;
              const dOld = Math.max(0, this.nextWater[downIdx]);
              this.nextWater[downIdx] = dOld + spill;
              this.nextPoll[downIdx] =
                (this.nextPoll[downIdx] * dOld + this.nextPoll[upIdx] * spill) /
                Math.max(0.001, this.nextWater[downIdx]);
              this.flowMag[downIdx] = 1.0;
            }
          }
        } else {
          t.damStress = Math.min(1.5, headRatio * 0.72);
        }

        const prevHp = t.damHealth;
        // Structural health degradation from overtopping erosion OR underfunded power maintenance
        if (overtop > 0.02) {
          t.damHealth -= overtop * 9.5;
        }
        if (pwrBudget < 65 && headRatio > 0.45) {
          t.damHealth -= (65 - pwrBudget) * 0.018;
          t.damStress = Math.max(t.damStress, Math.min(1.5, 0.62 + (65 - pwrBudget) * 0.014));
        } else if (overtop === 0 && pwrBudget >= 85 && t.damHealth < 100) {
          t.damHealth = Math.min(100, t.damHealth + 0.06);
        }
        if ((prevHp >= 65 && t.damHealth < 65) || (prevHp < 65 && t.damHealth >= 65)) {
          this.sim.meshDirty = true;
        }

        if (t.damHealth <= 0) {
          this.breachDamSpan(x, z);
          continue;
        }

        // Authentic Hydroelectric Turbine Power: requires BOTH real hydraulic head (> 0.26m) AND impounded reservoir depth!
        // On flat plains, water spills sideways over low banks or tailrace backs up -> head <= 0.26 -> 0 MW!
        if (hasReservoir && head > 0.26 && this.nextWater[upIdx] > 0.36) {
          // Impound reservoir toward operating pool (min(damCrest - 0.12, 1.88)) before opening full turbine gates!
          const targetPool = Math.min(t.damCrest - 0.12, 1.88);
          const poolFill = Math.max(0, Math.min(1.0, (maxSurf - (targetPool - 0.18)) / 0.18));
          const overtopThrottle = overtop > 0 ? 0.35 : 1.0;
          const fillRatio = (0.02 + poolFill * 0.98) * overtopThrottle;
          const discharge = Math.min(this.nextWater[upIdx] * 0.10, 0.015 * fillRatio);
          if (discharge > 0.0006) {
            this.nextWater[upIdx] -= discharge;
            const upX = upIdx % GRID_SIZE;
            const upZ = (upIdx / GRID_SIZE) | 0;
            const dnX = downIdx % GRID_SIZE;
            const dnZ = (downIdx / GRID_SIZE) | 0;
            const tLen = Math.max(1, Math.hypot(dnX - upX, dnZ - upZ));
            const dirDx = (dnX - upX) / tLen;
            const dirDz = (dnZ - upZ) / tLen;

            // Distribute tailrace discharge gently across downIdx (70%) + lower non-dam neighbors (30%) to prevent single-cell height strobing!
            const tailTargets = [];
            const dnSurf = elev[downIdx] + Math.max(0, this.nextWater[downIdx]);
            for (let k = 0; k < 4; k++) {
              const nx = dnX + dirs4[k][0];
              const nz = dnZ + dirs4[k][1];
              if (nx < 0 || nx >= GRID_SIZE || nz < 0 || nz >= GRID_SIZE) continue;
              const ni = idx(nx, nz);
              if (ni === upIdx || grid[ni].dam) continue;
              if (elev[ni] <= elev[downIdx] + 0.14 || (elev[ni] + Math.max(0, this.nextWater[ni])) <= dnSurf + 0.08) {
                tailTargets.push(ni);
              }
            }
            const mainShare = tailTargets.length > 0 ? discharge * 0.70 : discharge;
            const sideShare = tailTargets.length > 0 ? (discharge * 0.30) / tailTargets.length : 0;

            const dOld = Math.max(0, this.nextWater[downIdx]);
            this.nextWater[downIdx] = dOld + mainShare;
            this.nextPoll[downIdx] =
              (this.nextPoll[downIdx] * dOld + this.nextPoll[upIdx] * mainShare) /
              Math.max(0.001, this.nextWater[downIdx]);
            this.flowMag[downIdx] = Math.min(1, this.flowMag[downIdx] + 0.78);
            this._instFlowX[downIdx] += dirDx * 0.85;
            this._instFlowZ[downIdx] += dirDz * 0.85;

            for (let k = 0; k < tailTargets.length; k++) {
              const ti = tailTargets[k];
              const tOld = Math.max(0, this.nextWater[ti]);
              this.nextWater[ti] = tOld + sideShare;
              this.nextPoll[ti] =
                (this.nextPoll[ti] * tOld + this.nextPoll[upIdx] * sideShare) /
                Math.max(0.001, this.nextWater[ti]);
              this.flowMag[ti] = Math.min(1, this.flowMag[ti] + 0.42);
              this._instFlowX[ti] += dirDx * 0.50;
              this._instFlowZ[ti] += dirDz * 0.50;
            }

            // Mass-conserving P = eta * Q * dH: ~900-1550 MW across NW canyon dam, 0 MW on flat plains!
            const budgetEff = 0.55 + Math.min(1.25, pwrBudget / 100) * 0.45;
            const mw = Math.min(620, Math.round(discharge * 16500 * head * (0.65 + head * 0.45) * budgetEff));
            t.damOutputMW = mw;
            totalHydroMW += mw;
          } else {
            t.damOutputMW = 0;
          }
        } else {
          t.damOutputMW = 0;
        }
      }
    }
    this.sim.hydroPowerMW = totalHydroMW;

    // 3. 2D Shallow-Water Flux Relaxation + Downstream Sewage Advection + Flow Velocity Tracking
    const DAMP = 0.21; // Courant-stable < 0.25 for 4-neighbors!
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        if (grid[i].dam) continue;
        const wi = w[i];
        if (wi < 0.002) continue;

        const surfI = elev[i] + wi;

        let maxDrop = 0;
        let outVx = 0;
        let outVz = 0;

        for (let d = 0; d < 4; d++) {
          const dx = dirs4[d][0];
          const dz = dirs4[d][1];
          const nx = x + dx;
          const nz = z + dz;
          if (nx < 0 || nx >= GRID_SIZE || nz < 0 || nz >= GRID_SIZE) continue;
          const ni = idx(nx, nz);
          if (grid[ni].dam) continue;
          const surfN = elev[ni] + w[ni];
          const diff = surfI - surfN;
          if (diff > 0.003) {
            const flux = Math.min(wi * 0.23, diff * DAMP);
            this.nextWater[i] -= flux;
            const prevDestW = Math.max(0, this.nextWater[ni]);
            this.nextWater[ni] = prevDestW + flux;

            // Accumulate directional flux on source & destination cells
            const velWeight = flux * 14.0;
            outVx += dx * velWeight;
            outVz += dz * velWeight;
            this._instFlowX[ni] += dx * velWeight * 0.55;
            this._instFlowZ[ni] += dz * velWeight * 0.55;

            // Advect sewage pollution downstream!
            if (flux > 0.0005) {
              this.nextPoll[ni] =
                (this.nextPoll[ni] * prevDestW + poll[i] * flux) /
                Math.max(0.0005, prevDestW + flux);
            }
            if (diff > maxDrop) maxDrop = diff;
          }
        }

        this._instFlowX[i] += outVx;
        this._instFlowZ[i] += outVz;
        this.flowMag[i] = Math.min(1.0, this.flowMag[i] + maxDrop * 1.8);
      }
    }

    // 4. Commit clamped water, smooth flow vectors & subtle evaporation of tiny <4mm puddles on dry land
    for (let i = 0; i < N; i++) {
      let nw = this.nextWater[i];
      if (nw < 0.005 && elev[i] > SEA_LEVEL + 0.04) {
        nw = Math.max(0, nw - 0.0015);
      }
      w[i] = Math.max(0, Math.min(4.5, nw));
      poll[i] = nw > 0.01 ? Math.max(0, Math.min(1, this.nextPoll[i] * 0.997)) : 0;

      if (w[i] > 0.012 && !grid[i].dam) {
        let fx = this._instFlowX[i];
        let fz = this._instFlowZ[i];
        const mag = Math.hypot(fx, fz);
        if (mag > 1.0) {
          fx /= mag;
          fz /= mag;
        }
        this.flowDirX[i] = this.flowDirX[i] * 0.62 + fx * 0.38;
        this.flowDirZ[i] = this.flowDirZ[i] * 0.62 + fz * 0.38;
      } else {
        this.flowDirX[i] *= 0.5;
        this.flowDirZ[i] *= 0.5;
      }

      // Mark flooded status on ground buildings if water > 0.22m!
      const b = grid[i].building;
      if (b) {
        b.flooded = w[i] > 0.24 && b.type !== 'water_pump' && b.type !== 'sewage_out' && b.type !== 'water_treat';
      }
    }
  }

  /**
   * Computes smooth per-corner (57 x 57) hydrological surface & attribute fields:
   * { surfY, depth, poll, foam, flowX, flowZ }
   * Eliminates stair-stepped square water tiles by averaging wet surface elevations
   * and smoothly extending shoreline water planes to intersect sloped terrain banks!
   */
  computeCornerWaterField() {
    const corners = this.sim.corners;
    const w = this.sim.waterDepth;
    const pollArr = this.sim.waterPoll;
    const grid = this.sim.grid;
    const elev = this.cellElev;

    const { surfY, depth, poll, foam, flowX, flowZ } = this._cornerField;
    const surfTmp = this._cornerSurfTmp;
    const wetMask = this._cornerWetMask;
    const wetCountArr = this._cornerWetCount;

    wetMask.fill(0);
    wetCountArr.fill(0);

    // Pass 1: Average water surface & fluid attributes across adjacent wet non-dam cells (waterDepth > 0.02)
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        let surfSum = 0;
        let pollSum = 0;
        let fxSum = 0;
        let fzSum = 0;
        let fmagSum = 0;
        let wgtSum = 0;
        let wetCells = 0;
        let dryCells = 0;
        let hasDam = false;
        let springBoost = 0;

        for (let dz = -1; dz <= 0; dz++) {
          const tz = cz + dz;
          if (tz < 0 || tz >= GRID_SIZE) continue;
          for (let dx = -1; dx <= 0; dx++) {
            const tx = cx + dx;
            if (tx < 0 || tx >= GRID_SIZE) continue;
            const ni = idx(tx, tz);
            const tile = grid[ni];
            if (tile.dam) {
              hasDam = true;
              continue;
            }
            const wi = w[ni];
            if (wi > 0.02) {
              wetCells++;
              const wgt = 0.22 + Math.min(0.78, wi * 2.4);
              surfSum += (elev[ni] + wi) * wgt;
              pollSum += pollArr[ni] * wgt;
              fxSum += this.flowDirX[ni] * wgt;
              fzSum += this.flowDirZ[ni] * wgt;
              fmagSum += this.flowMag[ni] * wgt;
              wgtSum += wgt;
              if (tile.waterSpring > 0) springBoost = 0.36;
            } else {
              dryCells++;
            }
          }
        }

        if (wetCells > 0 && wgtSum > 0) {
          wetMask[ci] = 1;
          wetCountArr[ci] = wetCells;
          const rawSurf = surfSum / wgtSum;
          const avgMag = fmagSum / wgtSum;
          const localDepthEst = Math.max(0, rawSurf - corners[ci]);

          surfTmp[ci] = rawSurf;
          poll[ci] = pollSum / wgtSum;
          flowX[ci] = fxSum / wgtSum;
          flowZ[ci] = fzSum / wgtSum;

          let fVal = avgMag * 1.15 + springBoost;
          if (localDepthEst < 0.28 && avgMag > 0.16) fVal += 0.24;
          if (hasDam && avgMag > 0.12) fVal += 0.65;
          if (dryCells > 0) fVal += 0.20;
          if (this.tsunamiTimer > 0) fVal += avgMag * 0.45;
          foam[ci] = Math.min(1.0, fVal);
        } else {
          surfTmp[ci] = corners[ci] - 0.05;
          poll[ci] = 0;
          flowX[ci] = 0;
          flowZ[ci] = 0;
          foam[ci] = 0;
        }
      }
    }

    // Pass 2: Gentle Laplacian smoothing of surfY across connected wet corners (preserving dam head jumps!)
    const ortho = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        if (!wetMask[ci]) {
          surfY[ci] = surfTmp[ci];
          continue;
        }
        const centerS = surfTmp[ci];
        let nbSum = 0;
        let nbCnt = 0;
        for (let k = 0; k < 4; k++) {
          const nx = cx + ortho[k][0];
          const nz = cz + ortho[k][1];
          if (nx < 0 || nx >= CORNER_STRIDE || nz < 0 || nz >= CORNER_STRIDE) continue;
          const nci = cIdx(nx, nz);
          if (wetMask[nci] && Math.abs(surfTmp[nci] - centerS) < 0.42) {
            nbSum += surfTmp[nci];
            nbCnt++;
          }
        }
        surfY[ci] = nbCnt > 0 ? centerS * 0.66 + (nbSum / nbCnt) * 0.34 : centerS;
      }
    }

    // Pass 3: Shoreline bank extension — extend water surface 1 corner into rising dry riverbanks/beaches
    // so depth = max(0, surfY - terrainH) feathers smoothly to 0 right along natural terrain contours!
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        if (wetMask[ci]) {
          depth[ci] = Math.max(0, surfY[ci] - corners[ci]);
          continue;
        }

        let extSurf = 0;
        let extPoll = 0;
        let extFx = 0;
        let extFz = 0;
        let extFoam = 0;
        let wSum = 0;

        for (let oz = -1; oz <= 1; oz++) {
          const nz = cz + oz;
          if (nz < 0 || nz >= CORNER_STRIDE) continue;
          for (let ox = -1; ox <= 1; ox++) {
            if (ox === 0 && oz === 0) continue;
            const nx = cx + ox;
            if (nx < 0 || nx >= CORNER_STRIDE) continue;
            const nci = cIdx(nx, nz);
            if (!wetMask[nci]) continue;

            // Check that shared tile(s) between (cx,cz) and (nx,nz) are not dam walls
            const minTx = Math.max(0, Math.min(cx, nx) - (ox === 0 ? 1 : 0));
            const maxTx = Math.min(GRID_SIZE - 1, Math.min(cx, nx));
            const minTz = Math.max(0, Math.min(cz, nz) - (oz === 0 ? 1 : 0));
            const maxTz = Math.min(GRID_SIZE - 1, Math.min(cz, nz));
            let blockedByDam = false;
            for (let tz = minTz; tz <= maxTz; tz++) {
              for (let tx = minTx; tx <= maxTx; tx++) {
                if (grid[idx(tx, tz)].dam) blockedByDam = true;
              }
            }
            if (blockedByDam) continue;

            const wgt = (ox === 0 || oz === 0) ? 1.0 : 0.65;
            extSurf += surfY[nci] * wgt;
            extPoll += poll[nci] * wgt;
            extFx += flowX[nci] * wgt;
            extFz += flowZ[nci] * wgt;
            extFoam += foam[nci] * wgt;
            wSum += wgt;
          }
        }

        const terrainH = corners[ci];
        if (wSum > 0) {
          const targetSurf = extSurf / wSum;
          if (terrainH >= targetSurf - 0.004) {
            surfY[ci] = targetSurf - 0.012;
          } else {
            surfY[ci] = terrainH - 0.012;
          }
          depth[ci] = Math.max(0, surfY[ci] - terrainH);
          poll[ci] = extPoll / wSum;
          flowX[ci] = (extFx / wSum) * 0.55;
          flowZ[ci] = (extFz / wSum) * 0.55;
          foam[ci] = Math.max(0.26, (extFoam / wSum) * 0.85);
        } else {
          surfY[ci] = terrainH - 0.05;
          depth[ci] = 0;
        }
      }
    }

    // Pass 4: Temporal exponential smoothing on surfY & foam so turbulent dam tailrace water never strobes between 0.09s mesh rebuilds!
    const CN = CORNER_STRIDE * CORNER_STRIDE;
    const prevSurf = this._smoothCornerSurf;
    const prevFoam = this._smoothCornerFoam;
    if (!this._smoothCornerInit) {
      prevSurf.set(surfY);
      prevFoam.set(foam);
      this._smoothCornerInit = true;
    } else {
      for (let ci = 0; ci < CN; ci++) {
        const targetS = surfY[ci];
        const diffS = targetS - prevSurf[ci];
        // Snap immediately on major sudden events (dam breach/tsunami/terrain edit), otherwise blend smoothly
        const nextS = Math.abs(diffS) > 0.45 ? targetS : (prevSurf[ci] + diffS * 0.36);
        prevSurf[ci] = nextS;
        surfY[ci] = nextS;
        depth[ci] = Math.max(0, nextS - corners[ci]);

        const nextF = prevFoam[ci] + (foam[ci] - prevFoam[ci]) * 0.32;
        prevFoam[ci] = nextF;
        foam[ci] = nextF;
      }
    }

    return this._cornerField;
  }
}
