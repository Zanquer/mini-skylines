import {
  GRID_SIZE,
  HALF_GRID,
  CORNER_STRIDE,
  SEA_LEVEL,
  inBounds,
  idx,
  cIdx,
  hash2D,
  smoothNoise
} from './mapgen.js';

function clamp01(v) {
  return v < 0 ? 0 : (v > 1 ? 1 : v);
}

function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function periodicHash(ix, iy, period, seed) {
  const px = ((ix % period) + period) % period;
  const py = ((iy % period) + period) % period;
  return hash2D(px, py, seed);
}

function periodicSmoothNoise(x, y, period, seed) {
  const sx = x * period;
  const sy = y * period;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = periodicHash(ix, iy, period, seed);
  const b = periodicHash(ix + 1, iy, period, seed);
  const c = periodicHash(ix, iy + 1, period, seed);
  const d = periodicHash(ix + 1, iy + 1, period, seed);

  return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy;
}

/**
 * Procedural seamless 256x256 CanvasTexture providing subtle organic grass/soil/rock grain
 * so terrain never looks like flat plastic while preserving vibrant vertex colors.
 */
export function createTerrainDetailTexture(THREE) {
  if (typeof document === 'undefined') return null;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      // Multi-octave seamless periodic grain (macro patch + turf fiber + mineral micro-speckle)
      const nMacro = periodicSmoothNoise(u, v, 8, 101);
      const nMid = periodicSmoothNoise(u, v, 24, 211);
      const nFine = periodicSmoothNoise(u, v, 64, 307);
      const speck = periodicHash(x, y, size, 409);

      // Subtle directional grass-blade / rock-cleavage micro-streak
      const streak = periodicSmoothNoise(u * 0.7 + v * 0.3, v * 1.4 - u * 0.2, 48, 521);

      const grain =
        (nMacro - 0.5) * 0.085 +
        (nMid - 0.5) * 0.075 +
        (nFine - 0.5) * 0.065 +
        (streak - 0.5) * 0.045 +
        (speck - 0.5) * 0.045;

      // Keep mean brightness near 0.94 so multiplying with vertexColors stays rich & luminous
      const base = 0.945 + grain;
      const r = clamp01(base + (nMid - 0.5) * 0.018);
      const g = clamp01(base + (nMacro - 0.5) * 0.014);
      const b = clamp01(base - (nMid - 0.5) * 0.020);

      const p = (y * size + x) * 4;
      data[p] = (r * 255) | 0;
      data[p + 1] = (g * 255) | 0;
      data[p + 2] = (b * 255) | 0;
      data[p + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (THREE.SRGBColorSpace) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Marks corners belonging to surface-graded tiles (ground roads, rails, ramps, buildings, dams)
 * so road/rail tiles use exact bilinear interpolation of their 4 corners (forming smooth continuous
 * ramps with zero bicubic overshoot) while building/dam tiles stay level and C0-watertight!
 */
function buildCornerFlatMask(sim) {
  const mask = new Float32Array(CORNER_STRIDE * CORNER_STRIDE);
  const grid = sim.grid;
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t = grid[idx(x, z)];
      // Note: roadGround === 4 is an underground mountain tunnel, so leave mountain ridge natural above it!
      const isBilinearOrPinned =
        (t.roadGround > 0 && t.roadGround !== 4) ||
        t.rail > 0 ||
        t.ramp ||
        t.dam ||
        t.building !== null;
      if (isBilinearOrPinned) {
        mask[cIdx(x, z)] = 1;
        mask[cIdx(x + 1, z)] = 1;
        mask[cIdx(x, z + 1)] = 1;
        mask[cIdx(x + 1, z + 1)] = 1;
      }
    }
  }
  return mask;
}

function cornerClamped(corners, cx, cz) {
  const x = cx < 0 ? 0 : (cx >= CORNER_STRIDE ? CORNER_STRIDE - 1 : cx);
  const z = cz < 0 ? 0 : (cz >= CORNER_STRIDE ? CORNER_STRIDE - 1 : cz);
  return corners[cIdx(x, z)];
}

function evaluateSmoothTerrainHeight(sim, flatMask, u, v) {
  const corners = sim.corners;
  const grid = sim.grid;
  const tx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(u === GRID_SIZE ? GRID_SIZE - 0.0001 : u)));
  const tz = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(v === GRID_SIZE ? GRID_SIZE - 0.0001 : v)));
  const tu = clamp01(u - tx);
  const tv = clamp01(v - tz);

  const i00 = cIdx(tx, tz);
  const i10 = cIdx(tx + 1, tz);
  const i01 = cIdx(tx, tz + 1);
  const i11 = cIdx(tx + 1, tz + 1);

  const c00 = corners[i00];
  const c10 = corners[i10];
  const c01 = corners[i01];
  const c11 = corners[i11];

  const hBilinear =
    (c00 * (1 - tu) + c10 * tu) * (1 - tv) +
    (c01 * (1 - tu) + c11 * tu) * tv;

  const tile = grid[idx(tx, tz)];

  // Keep building & dam foundations level in their interior while keeping shared edges C0-watertight
  if ((tile.building !== null || tile.dam) && (tile.roadGround === 0 || tile.roadGround === 4) && tile.rail === 0 && !tile.ramp) {
    const avgH = (c00 + c10 + c01 + c11) * 0.25;
    const padPin = Math.sin(Math.PI * tu) * Math.sin(Math.PI * tv);
    return hBilinear * (1 - padPin) + avgH * padPin;
  }

  // Sloped/surface roads (roadGround === 1, 2, 3), rails (rail >= 1), and ramps (without buildings):
  // Use exact bilinear interpolation of the 4 corner elevations so terrain forms a smooth continuous ramp!
  if ((tile.roadGround >= 1 && tile.roadGround <= 3) || tile.rail >= 1 || tile.ramp) {
    return hBilinear;
  }

  const flatW =
    (flatMask[i00] * (1 - tu) + flatMask[i10] * tu) * (1 - tv) +
    (flatMask[i01] * (1 - tu) + flatMask[i11] * tu) * tv;

  if (flatW >= 0.999) {
    return hBilinear;
  }

  // 4x4 Catmull-Rom bicubic interpolation across natural hills & riverbanks
  const r0 = catmullRom(
    cornerClamped(corners, tx - 1, tz - 1),
    cornerClamped(corners, tx, tz - 1),
    cornerClamped(corners, tx + 1, tz - 1),
    cornerClamped(corners, tx + 2, tz - 1),
    tu
  );
  const r1 = catmullRom(
    cornerClamped(corners, tx - 1, tz),
    c00,
    c10,
    cornerClamped(corners, tx + 2, tz),
    tu
  );
  const r2 = catmullRom(
    cornerClamped(corners, tx - 1, tz + 1),
    c01,
    c11,
    cornerClamped(corners, tx + 2, tz + 1),
    tu
  );
  const r3 = catmullRom(
    cornerClamped(corners, tx - 1, tz + 2),
    cornerClamped(corners, tx, tz + 2),
    cornerClamped(corners, tx + 1, tz + 2),
    cornerClamped(corners, tx + 2, tz + 2),
    tu
  );

  let hBicubic = catmullRom(r0, r1, r2, r3, tv);

  // Guard against cubic overshoot on sharp terraces/cliffs
  const min4 = Math.min(c00, c10, c01, c11) - 0.09;
  const max4 = Math.max(c00, c10, c01, c11) + 0.09;
  if (hBicubic < min4) hBicubic = min4;
  else if (hBicubic > max4) hBicubic = max4;

  return hBilinear * flatW + hBicubic * (1 - flatW);
}

/**
 * Builds a 168 x 168 (3x per tile!) subdivided smooth terrain THREE.Mesh with:
 * - Bicubic/Hermite natural hills, exact bilinear sloped road/rail ramps, and flat-pinned building/dam pads
 * - Stratified slate & warm ochre cliff bands, flat-weighted peak snow, lush multi-tone grass,
 *   dark damp riparian soil along water shorelines, golden coastal sand, and data overlays!
 */
export function buildHighResTerrainMesh(THREE, sim, overlayMode, detailTex, sharedMat = null) {
  const SUB = 3;
  const SEG = GRID_SIZE * SUB; // 168
  const STRIDE = SEG + 1;      // 169
  const VCOUNT = STRIDE * STRIDE;

  const corners = sim.corners;
  const grid = sim.grid;
  const waterDepth = sim.waterDepth;
  const waterPoll = sim.waterPoll;
  const flatMask = buildCornerFlatMask(sim);

  // Precompute per-corner moisture & local water surface height for damp riparian shoreline soil
  const cornerMoist = new Float32Array(CORNER_STRIDE * CORNER_STRIDE);
  const cornerWaterSurf = new Float32Array(CORNER_STRIDE * CORNER_STRIDE);
  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      let wetCnt = 0;
      let surfAcc = 0;
      for (let dz = -1; dz <= 0; dz++) {
        const tz = cz + dz;
        if (tz < 0 || tz >= GRID_SIZE) continue;
        for (let dx = -1; dx <= 0; dx++) {
          const tx = cx + dx;
          if (tx < 0 || tx >= GRID_SIZE) continue;
          const ti = idx(tx, tz);
          const wd = waterDepth[ti];
          if (wd > 0.02 && !grid[ti].dam) {
            wetCnt++;
            const cellH = (
              corners[cIdx(tx, tz)] +
              corners[cIdx(tx + 1, tz)] +
              corners[cIdx(tx, tz + 1)] +
              corners[cIdx(tx + 1, tz + 1)]
            ) * 0.25;
            surfAcc += cellH + wd;
          }
        }
      }
      const ci = cIdx(cx, cz);
      if (wetCnt > 0) {
        cornerMoist[ci] = 1.0;
        cornerWaterSurf[ci] = surfAcc / wetCnt;
      } else {
        cornerMoist[ci] = 0.0;
        cornerWaterSurf[ci] = corners[ci] - 1.0;
      }
    }
  }

  // Dilate moisture 1 corner outward so damp riparian soil hugs the water's edge smoothly
  const cornerMoistBlur = new Float32Array(CORNER_STRIDE * CORNER_STRIDE);
  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      let mSum = 0;
      let wSum = 0;
      let sMax = -999;
      for (let oz = -1; oz <= 1; oz++) {
        const nz = cz + oz;
        if (nz < 0 || nz >= CORNER_STRIDE) continue;
        for (let ox = -1; ox <= 1; ox++) {
          const nx = cx + ox;
          if (nx < 0 || nx >= CORNER_STRIDE) continue;
          const wgt = (ox === 0 && oz === 0) ? 2.0 : ((ox === 0 || oz === 0) ? 1.0 : 0.6);
          const nci = cIdx(nx, nz);
          mSum += cornerMoist[nci] * wgt;
          wSum += wgt;
          if (cornerMoist[nci] > 0 && cornerWaterSurf[nci] > sMax) {
            sMax = cornerWaterSurf[nci];
          }
        }
      }
      const ci = cIdx(cx, cz);
      cornerMoistBlur[ci] = mSum / wSum;
      if (cornerMoist[ci] === 0 && sMax > -900) {
        cornerWaterSurf[ci] = sMax;
      }
    }
  }

  // Pass 1: Sample 169 x 169 smooth heightfield
  const heights = new Float32Array(VCOUNT);
  for (let gz = 0; gz < STRIDE; gz++) {
    const v = gz / SUB;
    for (let gx = 0; gx < STRIDE; gx++) {
      const u = gx / SUB;
      heights[gz * STRIDE + gx] = evaluateSmoothTerrainHeight(sim, flatMask, u, v);
    }
  }

  // Detect active data overlay mode & scale normalization
  const activeOverlay = (overlayMode && overlayMode !== 'none' && overlayMode !== 'off') ? String(overlayMode) : null;
  let pollScale = 1;
  let waterPollScale = 1;
  let trashScale = 1;
  let servScale = 1;
  let eduScale = 1;
  let hasEduField = false;
  let fireScale = 1;
  let congScale = 1;
  let noiseScale = 1;

  let pollField = null;
  let eduField = null;
  let noiseField = null;
  let quietField = null;

  const getBuildingTypeStr = (b) => {
    if (!b) return '';
    if (typeof b === 'string') return b;
    if (typeof b === 'object') return String(b.type || b.kind || b.id || b.name || '');
    return '';
  };

  const sampleTileField = (field, u, v) => {
    const tx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(u === GRID_SIZE ? GRID_SIZE - 0.001 : u)));
    const tz = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(v === GRID_SIZE ? GRID_SIZE - 0.001 : v)));
    const exact = field[idx(tx, tz)];

    const fx = Math.min(GRID_SIZE - 1.0001, Math.max(0, u - 0.5));
    const fz = Math.min(GRID_SIZE - 1.0001, Math.max(0, v - 0.5));
    const x0 = Math.floor(fx);
    const z0 = Math.floor(fz);
    const x1 = Math.min(GRID_SIZE - 1, x0 + 1);
    const z1 = Math.min(GRID_SIZE - 1, z0 + 1);
    const sx = fx - x0;
    const sz = fz - z0;
    const smooth =
      (field[idx(x0, z0)] * (1 - sx) + field[idx(x1, z0)] * sx) * (1 - sz) +
      (field[idx(x0, z1)] * (1 - sx) + field[idx(x1, z1)] * sx) * sz;

    return exact * 0.45 + smooth * 0.55;
  };

  if (activeOverlay) {
    let maxP = 0, maxWP = 0, maxTr = 0, maxS = 0, maxEdu = 0, maxF = 0, maxCg = 0, maxN = 0;
    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      const tp = Number.isFinite(t.pollution) ? t.pollution : 0;
      const wp = (waterPoll && Number.isFinite(waterPoll[i])) ? waterPoll[i] : 0;
      const tr = Number.isFinite(t.trash) ? t.trash : 0;
      const sv = Number.isFinite(t.serviceScore) ? t.serviceScore : 0;
      const fv = Number.isFinite(t.fireSafety) ? t.fireSafety : 0;
      const cg = Number.isFinite(t.congestion) ? t.congestion : 0;
      const nv = Number.isFinite(t.noise) ? t.noise : 0;
      if (tp > maxP) maxP = tp;
      if (wp > maxWP) maxWP = wp;
      if (tr > maxTr) maxTr = tr;
      if (sv > maxS) maxS = sv;
      if (fv > maxF) maxF = fv;
      if (cg > maxCg) maxCg = cg;
      if (nv > maxN) maxN = nv;
      if (typeof t.education === 'number' && Number.isFinite(t.education)) {
        if (t.education > 0) hasEduField = true;
        if (t.education > maxEdu) maxEdu = t.education;
      }
    }
    pollScale = maxP > 1.05 ? 0.01 : 1.0;
    waterPollScale = maxWP > 1.05 ? 0.01 : 1.0;
    trashScale = maxTr > 1.05 ? 0.01 : 1.0;
    servScale = maxS > 1.05 ? 0.01 : 1.0;
    eduScale = maxEdu > 1.05 ? 0.01 : 1.0;
    fireScale = maxF > 1.05 ? 0.01 : 1.0;
    congScale = maxCg > 1.05 ? 0.01 : 1.0;
    noiseScale = maxN > 1.05 ? 0.01 : 1.0;

    if (activeOverlay === 'pollution') {
      pollField = new Float32Array(GRID_SIZE * GRID_SIZE);
      for (let i = 0; i < grid.length; i++) {
        const t = grid[i];
        const gp = clamp01((Number.isFinite(t.pollution) ? t.pollution : 0) * pollScale);
        const wp = clamp01(((waterPoll && Number.isFinite(waterPoll[i])) ? waterPoll[i] : 0) * waterPollScale);
        const combined = clamp01(Math.max(gp, wp) + 0.35 * Math.min(gp, wp));
        pollField[i] = combined > 0 ? Math.pow(combined, 0.85) : 0;
      }
    } else if (activeOverlay === 'education' || activeOverlay === 'edu') {
      eduField = new Float32Array(GRID_SIZE * GRID_SIZE);
      for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const i = idx(x, z);
          const t = grid[i];
          const rawServ = clamp01((Number.isFinite(t.serviceScore) ? t.serviceScore : 0) * servScale);
          const rawEdu = (typeof t.education === 'number' && Number.isFinite(t.education))
            ? clamp01(t.education * eduScale)
            : -1;
          let ev = (rawEdu >= 0 && hasEduField)
            ? clamp01(Math.max(rawEdu, rawEdu * 0.72 + rawServ * 0.28))
            : rawServ;
          const bType = getBuildingTypeStr(t.building);
          if (bType) {
            if (/school|univ|college|lib|edu|campus/i.test(bType)) {
              ev = Math.max(ev, 0.96);
            } else if (/civic|museum|landmark|city_?hall|hospital|police|fire|park|plaza|stadium|station/i.test(bType)) {
              ev = clamp01(Math.max(ev, rawServ + 0.18));
            }
          }
          eduField[i] = ev;
        }
      }
      // Radiate warm civic education coverage halos from schools / universities / libraries
      for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const bType = getBuildingTypeStr(grid[idx(x, z)].building);
          if (!bType || !/school|univ|college|lib|edu|campus/i.test(bType)) continue;
          const rad = /univ|college|campus/i.test(bType) ? 6 : 4;
          for (let dz = -rad; dz <= rad; dz++) {
            const nz = z + dz;
            if (nz < 0 || nz >= GRID_SIZE) continue;
            for (let dx = -rad; dx <= rad; dx++) {
              const nx = x + dx;
              if (nx < 0 || nx >= GRID_SIZE) continue;
              const dist = Math.hypot(dx, dz);
              if (dist > rad) continue;
              const halo = (1.0 - dist / (rad + 0.5)) * 0.88;
              const ni = idx(nx, nz);
              if (halo > eduField[ni]) eduField[ni] = halo;
            }
          }
        }
      }
    } else if (activeOverlay === 'noise' || activeOverlay === 'acoustic') {
      noiseField = new Float32Array(GRID_SIZE * GRID_SIZE);
      quietField = new Float32Array(GRID_SIZE * GRID_SIZE);
      const fallbackNoise = new Float32Array(GRID_SIZE * GRID_SIZE);

      // Pass A: Direct & radiated acoustic fallback sources (traffic, highways, HSR, industry, airport) + quiet shields
      for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const i = idx(x, z);
          const t = grid[i];
          const cg = clamp01((Number.isFinite(t.congestion) ? t.congestion : 0) * congScale);
          const bType = getBuildingTypeStr(t.building);
          let src = 0;

          if (t.roadElevated > 0) {
            const ecg = clamp01((Number.isFinite(t.elevCongestion) ? t.elevCongestion : cg) * congScale);
            src = Math.max(src, 0.42 + ecg * 0.45);
          }
          if (t.roadGround >= 1 && t.roadGround !== 4) {
            const rBase = t.roadGround >= 2 ? (0.24 + cg * 0.48) : (0.12 + cg * 0.36);
            src = Math.max(src, t.banTrucks ? rBase * 0.40 : rBase);
          }
          if (t.rail > 0) {
            src = Math.max(src, 0.36);
          }
          if (t.zone === 'I') {
            src = Math.max(src, 0.52);
          } else if (t.zone === 'CH') {
            src = Math.max(src, 0.28);
          }
          if (bType) {
            if (/airport|runway/i.test(bType)) src = Math.max(src, 0.88);
            else if (/power_plant|waste_plant|coal|oil|incinerator|factory|industry|seaport|port|freight/i.test(bType)) src = Math.max(src, 0.64);
            else if (/station|stadium|amusement|mall|power_wind/i.test(bType)) src = Math.max(src, 0.42);
          }

          if (src > fallbackNoise[i]) fallbackNoise[i] = src;

          // Radiate industrial / airport / heavy-highway acoustic bleed into surrounding tiles
          const isHeavyNoiseSource =
            t.zone === 'I' ||
            (bType && /airport|runway|power_plant|waste_plant|coal|oil|incinerator|factory|industry|seaport|port/i.test(bType));
          if (isHeavyNoiseSource) {
            const rad = (bType && /airport|runway/i.test(bType)) ? 3 : 2;
            for (let dz = -rad; dz <= rad; dz++) {
              const nz = z + dz;
              if (nz < 0 || nz >= GRID_SIZE) continue;
              for (let dx = -rad; dx <= rad; dx++) {
                if (dx === 0 && dz === 0) continue;
                const nx = x + dx;
                if (nx < 0 || nx >= GRID_SIZE) continue;
                const dist = Math.hypot(dx, dz);
                if (dist > rad + 0.2) continue;
                const bleed = src * Math.max(0, 1.0 - dist / (rad + 0.9)) * 0.62;
                const ni = idx(nx, nz);
                if (bleed > fallbackNoise[ni]) fallbackNoise[ni] = bleed;
              }
            }
          }

          // Mark quiet green zones where banTrucks, quiet parks, or dense forest reduce noise
          const isPark = Boolean(bType && !/amusement/i.test(bType) && /park|plaza|garden|botanic|forest/i.test(bType));
          if (t.banTrucks || isPark) {
            quietField[i] = 1.0;
            const qBuf = t.banTrucks ? 0.68 : 0.58;
            for (let dz = -1; dz <= 1; dz++) {
              const nz = z + dz;
              if (nz < 0 || nz >= GRID_SIZE) continue;
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dz === 0) continue;
                const nx = x + dx;
                if (nx < 0 || nx >= GRID_SIZE) continue;
                const ni = idx(nx, nz);
                const nt = grid[ni];
                if (nt.zone === 'I') continue;
                const atten = (dx === 0 || dz === 0) ? qBuf : qBuf * 0.55;
                if (atten > quietField[ni]) quietField[ni] = atten;
              }
            }
          } else if ((t.trees || 0) >= 3 && t.roadGround === 0 && t.roadElevated === 0 && t.zone !== 'I') {
            if (quietField[i] < 0.42) quietField[i] = 0.42;
          }
        }
      }

      // Pass B: Combine live t.noise (when > 0) with fallback estimate & acoustic dampening
      for (let i = 0; i < grid.length; i++) {
        const t = grid[i];
        const bType = getBuildingTypeStr(t.building);
        const isPark = Boolean(bType && !/amusement/i.test(bType) && /park|plaza|garden|botanic|forest/i.test(bType));
        const liveNoise = (Number.isFinite(t.noise) && t.noise > 0) ? clamp01(t.noise * noiseScale) : -1;
        let nv = liveNoise >= 0 ? liveNoise : clamp01(fallbackNoise[i]);
        if (liveNoise < 0) {
          if (t.banTrucks) nv *= 0.45;
          if (isPark) nv *= 0.35;
          else if ((t.trees || 0) > 0) nv *= (1.0 - Math.min(0.28, t.trees * 0.06));
        }
        noiseField[i] = clamp01(nv);
      }
    }
  }

  const useLinear = !!(THREE.ColorManagement && THREE.ColorManagement.enabled);
  const toOutChannel = (c) => {
    const v = clamp01(c);
    if (!useLinear) return v;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  // Pass 2: Positions, analytical finite-difference normals, UVs & rich geological vertex colors
  const positions = new Float32Array(VCOUNT * 3);
  const normals = new Float32Array(VCOUNT * 3);
  const uvs = new Float32Array(VCOUNT * 2);
  const colors = new Float32Array(VCOUNT * 3);
  const stepWorld = 1 / SUB;

  for (let gz = 0; gz < STRIDE; gz++) {
    const v = gz / SUB;
    const wz = v - HALF_GRID;
    const tz = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(v === GRID_SIZE ? GRID_SIZE - 0.001 : v)));
    const cz0 = Math.min(GRID_SIZE - 1, Math.floor(v));
    const tv = clamp01(v - cz0);

    for (let gx = 0; gx < STRIDE; gx++) {
      const u = gx / SUB;
      const wx = u - HALF_GRID;
      const vi = gz * STRIDE + gx;
      const h = heights[vi];

      const p3 = vi * 3;
      positions[p3] = wx;
      positions[p3 + 1] = h;
      positions[p3 + 2] = wz;

      const p2 = vi * 2;
      uvs[p2] = u / 3.5;
      uvs[p2 + 1] = v / 3.5;

      // Central-difference gradient & surface normal
      const hL = heights[gz * STRIDE + Math.max(0, gx - 1)];
      const hR = heights[gz * STRIDE + Math.min(SEG, gx + 1)];
      const hD = heights[Math.max(0, gz - 1) * STRIDE + gx];
      const hU = heights[Math.min(SEG, gz + 1) * STRIDE + gx];
      const dxSpan = (gx === 0 || gx === SEG) ? stepWorld : 2 * stepWorld;
      const dzSpan = (gz === 0 || gz === SEG) ? stepWorld : 2 * stepWorld;
      const dhdx = (hR - hL) / dxSpan;
      const dhdz = (hU - hD) / dzSpan;

      const invLen = 1 / Math.sqrt(dhdx * dhdx + 1.0 + dhdz * dhdz);
      const nx = -dhdx * invLen;
      const ny = invLen;
      const nz = -dhdz * invLen;
      normals[p3] = nx;
      normals[p3 + 1] = ny;
      normals[p3 + 2] = nz;

      const slope = Math.sqrt(dhdx * dhdx + dhdz * dhdz);
      const flatness = ny;

      // Broader concavity sample (~1.3 tiles radius) for subtle gorge ambient occlusion
      const hFarL = heights[gz * STRIDE + Math.max(0, gx - 4)];
      const hFarR = heights[gz * STRIDE + Math.min(SEG, gx + 4)];
      const hFarD = heights[Math.max(0, gz - 4) * STRIDE + gx];
      const hFarU = heights[Math.min(SEG, gz + 4) * STRIDE + gx];
      const macroAvg = (hFarL + hFarR + hFarD + hFarU) * 0.25;
      const cavityAO = 1.0 - clamp01((macroAvg - h) * 0.32) * 0.14;

      // World-space multi-scale botanical & geological noise
      const nMacro = smoothNoise(u * 0.11, v * 0.11, 701);
      const nPatch = smoothNoise(u * 0.31, v * 0.31, 809);
      const nFine = smoothNoise(u * 0.77, v * 0.77, 919);

      // Bilinear moisture & nearby water surface lookup
      const cx0 = Math.min(GRID_SIZE - 1, Math.floor(u));
      const tu = clamp01(u - cx0);
      const mc00 = cIdx(cx0, cz0);
      const mc10 = cIdx(cx0 + 1, cz0);
      const mc01 = cIdx(cx0, cz0 + 1);
      const mc11 = cIdx(cx0 + 1, cz0 + 1);
      const moist =
        (cornerMoistBlur[mc00] * (1 - tu) + cornerMoistBlur[mc10] * tu) * (1 - tv) +
        (cornerMoistBlur[mc01] * (1 - tu) + cornerMoistBlur[mc11] * tu) * tv;
      const localSurf =
        (cornerWaterSurf[mc00] * (1 - tu) + cornerWaterSurf[mc10] * tu) * (1 - tv) +
        (cornerWaterSurf[mc01] * (1 - tu) + cornerWaterSurf[mc11] * tu) * tv;

      // 1. Lush Multi-Tone Valley & Alpine Grass
      const oliveMix = smoothstep(0.32, 0.72, nMacro * 0.65 + nPatch * 0.35 + nz * 0.12);
      const altTint = smoothstep(0.65, 2.05, h);
      let r = 0.27 + oliveMix * 0.14 - altTint * 0.06 + (nFine - 0.5) * 0.035;
      let g = 0.54 + oliveMix * 0.04 - altTint * 0.10 + (nFine - 0.5) * 0.040;
      let b = 0.22 + oliveMix * 0.03 - altTint * 0.02 + (nFine - 0.5) * 0.025;

      // 2. Coastal Sand & Submerged Sea/River Bed
      const coastalRegion = smoothstep(30.0, 37.5, u) * smoothstep(32.0, 39.5, v);
      const beachElev = 1.0 - smoothstep(SEA_LEVEL - 0.15, SEA_LEVEL + 0.23 + coastalRegion * 0.08, h);
      const sandFlat = 1.0 - smoothstep(0.38, 0.75, slope);
      const sandMask = clamp01(beachElev * sandFlat * (0.35 + 0.65 * coastalRegion));
      if (sandMask > 0.001) {
        const wetBeach = 1.0 - smoothstep(SEA_LEVEL - 0.02, SEA_LEVEL + 0.09, h);
        const sandR = 0.86 - wetBeach * 0.20 + (nFine - 0.5) * 0.04;
        const sandG = 0.78 - wetBeach * 0.19 + (nFine - 0.5) * 0.035;
        const sandB = 0.57 - wetBeach * 0.15 + (nFine - 0.5) * 0.03;
        r = r * (1 - sandMask) + sandR * sandMask;
        g = g * (1 - sandMask) + sandG * sandMask;
        b = b * (1 - sandMask) + sandB * sandMask;
      }

      // Deep submerged riverbed & seabed silt/pebbles
      const submerge = smoothstep(0.02, 0.48, localSurf - h) * smoothstep(0.08, 0.45, moist);
      if (submerge > 0.001) {
        const bedR = 0.34 - coastalRegion * 0.06 + (nFine - 0.5) * 0.04;
        const bedG = 0.35 - coastalRegion * 0.03 + (nFine - 0.5) * 0.04;
        const bedB = 0.31 + coastalRegion * 0.03 + (nFine - 0.5) * 0.03;
        r = r * (1 - submerge) + bedR * submerge;
        g = g * (1 - submerge) + bedG * submerge;
        b = b * (1 - submerge) + bedB * submerge;
      }

      // 3. Dark Damp Riparian Soil & Riverbank Loam right along inland water shorelines
      const aboveShore = h - localSurf;
      const riparianBand =
        smoothstep(0.06, 0.52, moist) *
        (1.0 - smoothstep(0.03, 0.24, Math.abs(aboveShore - 0.03))) *
        (1.0 - coastalRegion * 0.78);
      if (riparianBand > 0.001) {
        const ripMix = clamp01(riparianBand * 0.88);
        const soilR = 0.31 + (nPatch - 0.5) * 0.05;
        const soilG = 0.28 + (nPatch - 0.5) * 0.05;
        const soilB = 0.21 + (nFine - 0.5) * 0.04;
        r = r * (1 - ripMix) + soilR * ripMix;
        g = g * (1 - ripMix) + soilG * ripMix;
        b = b * (1 - ripMix) + soilB * ripMix;
      }

      // 4. Stratified Cliff & Canyon Rock Bands on Steep Slopes (slope + sin(h * 14.0) strata!)
      const rockSlopeBias = slope + smoothstep(1.55, 2.45, h) * 0.16 + (nFine - 0.5) * 0.10;
      const rockMask = smoothstep(0.44, 0.88, rockSlopeBias);
      if (rockMask > 0.001) {
        const strataArg = h * 14.0 + nMacro * 2.4 + nPatch * 0.9;
        const sWave = Math.sin(strataArg);
        const sDetail = Math.sin(strataArg * 2.6 + 1.4);

        const lightBand = smoothstep(-0.35, 0.35, sWave);
        const ochreBand = smoothstep(0.28, 0.78, sWave) * smoothstep(-0.25, 0.45, sDetail);

        let rockR = 0.31 + lightBand * 0.24;
        let rockG = 0.33 + lightBand * 0.22;
        let rockB = 0.36 + lightBand * 0.17;

        rockR = rockR * (1 - ochreBand * 0.75) + 0.64 * (ochreBand * 0.75);
        rockG = rockG * (1 - ochreBand * 0.75) + 0.50 * (ochreBand * 0.75);
        rockB = rockB * (1 - ochreBand * 0.75) + 0.36 * (ochreBand * 0.75);

        r = r * (1 - rockMask) + rockR * rockMask;
        g = g * (1 - rockMask) + rockG * rockMask;
        b = b * (1 - rockMask) + rockB * rockMask;
      }

      // 5. Alpine Snow Accumulation on High Peaks (h > 2.35) weighted by flatness
      const snowElev = smoothstep(2.22, 2.62, h + (nPatch - 0.5) * 0.20);
      if (snowElev > 0.001) {
        const flatHold = smoothstep(0.48, 0.84, flatness);
        const snowMask = clamp01(snowElev * (0.24 + 0.76 * flatHold));
        const sunWarmth = clamp01((nx * 0.5 + nz * 0.5) * 0.5 + 0.5);
        const snowR = 0.88 + sunWarmth * 0.08;
        const snowG = 0.92 + sunWarmth * 0.05;
        const snowB = 0.98;
        r = r * (1 - snowMask) + snowR * snowMask;
        g = g * (1 - snowMask) + snowG * snowMask;
        b = b * (1 - snowMask) + snowB * snowMask;
      }

      r *= cavityAO;
      g *= cavityAO;
      b *= cavityAO;

      // 6. Optional City Data Overlay Blending (preserves 3D relief shading!)
      if (activeOverlay) {
        const tx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(u === GRID_SIZE ? GRID_SIZE - 0.001 : u)));
        const tile = grid[idx(tx, tz)];
        const lum = r * 0.30 + g * 0.59 + b * 0.11;
        let or = lum * 0.85 + 0.10;
        let og = lum * 0.85 + 0.11;
        let ob = lum * 0.85 + 0.13;
        let oWeight = 0.76;

        if (activeOverlay === 'power' || activeOverlay === 'electricity') {
          if (tile.powered || tile.pylon) {
            or = 0.22; og = 0.86; ob = 0.52;
          } else if (tile.zone || tile.building) {
            or = 0.86; og = 0.32; ob = 0.28;
          }
        } else if (activeOverlay === 'water' || activeOverlay === 'pipes') {
          if (tile.pipeBroken) {
            or = 0.94; og = 0.26; ob = 0.20;
          } else if (tile.watered || tile.pipe) {
            or = 0.20; og = 0.68; ob = 0.95;
          }
        } else if (activeOverlay === 'pollution') {
          // Clean emerald green -> toxic amber -> deep violet-red blending t.pollution + waterPoll
          const pv = clamp01(pollField ? sampleTileField(pollField, u, v) : 0);
          if (pv <= 0.48) {
            const k = pv / 0.48;
            or = 0.14 + (0.95 - 0.14) * k;
            og = 0.72 + (0.64 - 0.72) * k;
            ob = 0.42 + (0.12 - 0.42) * k;
          } else {
            const k = (pv - 0.48) / 0.52;
            or = 0.95 + (0.58 - 0.95) * k;
            og = 0.64 + (0.09 - 0.64) * k;
            ob = 0.12 + (0.38 - 0.12) * k;
          }
          oWeight = 0.82;
        } else if (activeOverlay === 'education' || activeOverlay === 'edu') {
          // Deep navy -> vibrant cyan -> royal gold driven by t.education / t.serviceScore & civic coverage
          const ev = clamp01(eduField ? sampleTileField(eduField, u, v) : 0);
          if (ev <= 0.50) {
            const k = ev / 0.50;
            or = 0.08 + (0.09 - 0.08) * k;
            og = 0.14 + (0.76 - 0.14) * k;
            ob = 0.34 + (0.90 - 0.34) * k;
          } else {
            const k = (ev - 0.50) / 0.50;
            or = 0.09 + (0.99 - 0.09) * k;
            og = 0.76 + (0.81 - 0.76) * k;
            ob = 0.90 + (0.18 - 0.90) * k;
          }
          oWeight = 0.82;
        } else if (activeOverlay === 'noise' || activeOverlay === 'acoustic') {
          // Calm dark teal -> warm amber -> bright magenta-red, with quiet green zones where banTrucks / parks dampen noise
          const nv = clamp01(noiseField ? sampleTileField(noiseField, u, v) : 0);
          const qv = clamp01(quietField ? sampleTileField(quietField, u, v) : 0);
          if (nv <= 0.50) {
            const k = nv / 0.50;
            or = 0.07 + (0.96 - 0.07) * k;
            og = 0.32 + (0.64 - 0.32) * k;
            ob = 0.36 + (0.14 - 0.36) * k;
          } else {
            const k = (nv - 0.50) / 0.50;
            or = 0.96 + (0.96 - 0.96) * k;
            og = 0.64 + (0.12 - 0.64) * k;
            ob = 0.14 + (0.42 - 0.14) * k;
          }
          const qMix = clamp01(qv * (1.0 - smoothstep(0.18, 0.58, nv))) * 0.88;
          if (qMix > 0.001) {
            or = or * (1 - qMix) + 0.16 * qMix;
            og = og * (1 - qMix) + 0.74 * qMix;
            ob = ob * (1 - qMix) + 0.42 * qMix;
          }
          oWeight = 0.82;
        } else if (activeOverlay === 'landValue' || activeOverlay === 'land_value' || activeOverlay === 'value') {
          const lv = clamp01(tile.landValue * 0.01);
          or = 0.45 - lv * 0.28;
          og = 0.44 + lv * 0.46;
          ob = 0.42 + lv * 0.42;
        } else if (activeOverlay === 'traffic' || activeOverlay === 'congestion') {
          if (tile.roadGround > 0 || tile.roadElevated > 0) {
            const cv = clamp01(tile.congestion * congScale);
            or = 0.20 + cv * 0.76;
            og = 0.84 - cv * 0.64;
            ob = 0.24 - cv * 0.12;
            oWeight = 0.86;
          }
        } else if (activeOverlay === 'transit') {
          if (tile.busStop) {
            or = 0.10; og = 0.88; ob = 0.96; oWeight = 0.88;
          } else if (tile.building && (tile.building.type === 'metro_station' || tile.building.type === 'hsr_station' || tile.building.type === 'airport' || tile.building.type === 'seaport')) {
            or = 0.88; og = 0.34; ob = 0.98; oWeight = 0.88;
          } else if (tile.roadGround > 0) {
            or = 0.34; og = 0.42; ob = 0.54; oWeight = 0.78;
          }
        } else if (activeOverlay === 'fire' || activeOverlay === 'fireSafety' || activeOverlay === 'fire_safety') {
          const fv = clamp01(tile.fireSafety * fireScale);
          or = 0.88 - fv * 0.64;
          og = 0.28 + fv * 0.58;
          ob = 0.24 + fv * 0.42;
        } else if (activeOverlay === 'service' || activeOverlay === 'services' || activeOverlay === 'serviceScore') {
          const sv = clamp01(tile.serviceScore * servScale);
          or = 0.42 - sv * 0.24;
          og = 0.44 + sv * 0.44;
          ob = 0.48 + sv * 0.40;
        } else if (activeOverlay === 'trash' || activeOverlay === 'garbage' || activeOverlay === 'waste') {
          const tvVal = clamp01((tile.trash || 0) * trashScale);
          or = 0.28 + tvVal * 0.62;
          og = 0.74 - tvVal * 0.46;
          ob = 0.34 - tvVal * 0.20;
        }

        r = r * (1 - oWeight) + or * oWeight;
        g = g * (1 - oWeight) + og * oWeight;
        b = b * (1 - oWeight) + ob * oWeight;
      }

      colors[p3] = toOutChannel(r);
      colors[p3 + 1] = toOutChannel(g);
      colors[p3 + 2] = toOutChannel(b);
    }
  }

  // Pass 3: Adaptive diagonal quad triangulation (aligns splits with ridges & curved riverbanks)
  const indices = new Uint16Array(SEG * SEG * 6);
  let ptr = 0;
  for (let gz = 0; gz < SEG; gz++) {
    const row0 = gz * STRIDE;
    const row1 = (gz + 1) * STRIDE;
    for (let gx = 0; gx < SEG; gx++) {
      const v00 = row0 + gx;
      const v10 = row0 + gx + 1;
      const v01 = row1 + gx;
      const v11 = row1 + gx + 1;

      if (Math.abs(heights[v00] - heights[v11]) <= Math.abs(heights[v10] - heights[v01])) {
        indices[ptr++] = v00;
        indices[ptr++] = v01;
        indices[ptr++] = v11;
        indices[ptr++] = v00;
        indices[ptr++] = v11;
        indices[ptr++] = v10;
      } else {
        indices[ptr++] = v00;
        indices[ptr++] = v01;
        indices[ptr++] = v10;
        indices[ptr++] = v10;
        indices[ptr++] = v01;
        indices[ptr++] = v11;
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.computeBoundingSphere();

  const mat = sharedMat || new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: detailTex || null,
    roughness: 0.88,
    metalness: 0.02
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.userData = { ownGeo: true, ownMat: !sharedMat };
  return mesh;
}

/**
 * Creates a custom physical GLSL water ShaderMaterial featuring:
 * - Depth-scaled multi-directional vertex waves
 * - Dual-scrolling / dual-phase flow-advected procedural wave normals along vFlow
 * - Schlick Fresnel sky reflection + Beer's Law depth absorption (turquoise -> sapphire -> sewage olive)
 * - Crisp Blinn-Phong sun/moon sparkle + animated whitewater/shoreline foam + feathered shoreline alpha
 */
export function createPhysicalWaterMaterial(THREE) {
  const hasToneChunk = !!(THREE.ShaderChunk && THREE.ShaderChunk.tonemapping_fragment);
  const hasColorChunk = !!(THREE.ShaderChunk && THREE.ShaderChunk.colorspace_fragment);

  const vertexShader = /* glsl */ `
    uniform float uTime;

    attribute float aDepth;
    attribute float aPoll;
    attribute float aFoam;
    attribute vec2 aFlow;

    varying vec3 vWorldPos;
    varying float vDepth;
    varying float vPoll;
    varying float vFoam;
    varying vec2 vFlow;

    void main() {
      vDepth = aDepth;
      vPoll = aPoll;
      vFoam = aFoam;
      vFlow = aFlow;

      vec3 pos = position;
      vec4 baseWorld = modelMatrix * vec4(pos, 1.0);

      // Gentle multi-directional wave displacement scaled by depth (pinned to 0 at shoreline!)
      float waveAmp = clamp(aDepth * 0.042, 0.0, 0.026);
      float flowBoost = 1.0 + min(1.0, length(aFlow)) * 0.45;
      float w1 = sin(baseWorld.x * 2.35 + baseWorld.z * 1.65 - uTime * 2.15);
      float w2 = cos(baseWorld.x * 1.55 - baseWorld.z * 2.65 + uTime * 1.72);
      float w3 = sin((baseWorld.x - baseWorld.z) * 4.10 + uTime * 3.10) * 0.45;

      pos.y += (w1 * 0.45 + w2 * 0.38 + w3 * 0.25) * waveAmp * flowBoost;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uSkyColor;
    uniform vec3 uCamPos;
    uniform float uNight;

    varying vec3 vWorldPos;
    varying float vDepth;
    varying float vPoll;
    varying float vFoam;
    varying vec2 vFlow;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float valueNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Multi-octave capillary & gravity wave height at world XZ
    float waveField(vec2 xz, float t) {
      mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
      float h = 0.0;
      h += valueNoise(xz * 1.85 + vec2(t * 0.42, -t * 0.31)) * 0.52;
      vec2 p2 = rot * xz * 3.90 + vec2(-t * 0.68, t * 0.54);
      h += valueNoise(p2) * 0.31;
      vec2 p3 = rot * (rot * xz) * 8.20 + vec2(t * 1.05, t * 0.82);
      h += valueNoise(p3) * 0.17;
      return h;
    }

    // Dual-phase flow-advected height sample so spatially varying vFlow never stretches UVs over time
    float advectedWaves(vec2 xz, vec2 flow, float t) {
      float speed = length(flow);
      vec2 advVel = speed > 0.02 ? flow * 1.35 : vec2(0.08, 0.06);
      float cycle = t * 0.32;
      float ph0 = fract(cycle);
      float ph1 = fract(cycle + 0.5);
      float blend = abs(1.0 - 2.0 * ph0);

      float w0 = waveField(xz - advVel * ph0 * 2.2, t);
      float w1 = waveField(xz - advVel * ph1 * 2.2 + vec2(17.3, 9.1), t);
      return mix(w0, w1, blend);
    }

    void main() {
      // Smooth shoreline alpha feathering right into sloped riverbanks & beaches
      float shoreAlpha = smoothstep(0.010, 0.115, vDepth);
      if (shoreAlpha <= 0.002) discard;

      vec2 xz = vWorldPos.xz;
      float flowSpeed = clamp(length(vFlow), 0.0, 1.2);

      // Finite-difference perturbed wave normal
      float eps = 0.075;
      float hC = advectedWaves(xz, vFlow, uTime);
      float hX = advectedWaves(xz + vec2(eps, 0.0), vFlow, uTime);
      float hZ = advectedWaves(xz + vec2(0.0, eps), vFlow, uTime);

      float normScale = (0.34 + flowSpeed * 0.28) * smoothstep(0.008, 0.16, vDepth);
      vec3 N = normalize(vec3((hC - hX) / eps * normScale, 1.0, (hC - hZ) / eps * normScale));

      vec3 V = normalize(uCamPos - vWorldPos);
      vec3 L = normalize(uSunDir);

      // Beer's Law depth absorption: shallowTurquoise -> deepSapphire -> sewageOliveBrown
      float beer = 1.0 - exp(-vDepth * 2.45);
      float deepMix = clamp(beer, 0.0, 1.0);

      ${hasColorChunk ? `
      vec3 shallowTurquoise = vec3(0.026, 0.45, 0.49);
      vec3 deepSapphire     = vec3(0.007, 0.058, 0.20);
      vec3 sewageShallow    = vec3(0.17, 0.155, 0.038);
      vec3 sewageDeep       = vec3(0.075, 0.064, 0.018);
      vec3 cleanFoamColor   = vec3(0.90, 0.95, 0.98);
      vec3 dirtyFoamColor   = vec3(0.55, 0.50, 0.34);
      ` : `
      vec3 shallowTurquoise = vec3(0.17, 0.70, 0.73);
      vec3 deepSapphire     = vec3(0.08, 0.27, 0.48);
      vec3 sewageShallow    = vec3(0.45, 0.43, 0.22);
      vec3 sewageDeep       = vec3(0.30, 0.28, 0.15);
      vec3 cleanFoamColor   = vec3(0.95, 0.97, 0.99);
      vec3 dirtyFoamColor   = vec3(0.74, 0.70, 0.56);
      `}

      vec3 cleanBody = mix(shallowTurquoise, deepSapphire, deepMix);
      vec3 pollBody  = mix(sewageShallow, sewageDeep, deepMix);
      float pollFactor = smoothstep(0.03, 0.68, vPoll);
      vec3 waterBody = mix(cleanBody, pollBody, pollFactor);

      // Diffuse sun/sky illumination & night dimming
      float NdotL = max(dot(N, L), 0.0);
      float dayLight = mix(0.38 + 0.62 * NdotL, 0.14 + 0.20 * NdotL, uNight);
      vec3 litBody = waterBody * (dayLight + uSkyColor * 0.28);

      // Schlick Fresnel reflection blending uSkyColor at grazing angles
      float NdotV = max(dot(N, V), 0.0);
      float fresnel = 0.035 + 0.965 * pow(1.0 - NdotV, 4.2);
      fresnel = clamp(fresnel * mix(0.80, 0.52, uNight), 0.03, 0.76);
      vec3 reflColor = uSkyColor * mix(0.95, 0.55, pollFactor * 0.5);
      vec3 col = mix(litBody, reflColor, fresnel);

      // Animated whitewater rapids/tailrace foam (vFoam > 0.35) & shoreline lap foam (vDepth < 0.09)
      vec2 foamUV = xz * 4.6 - vFlow * uTime * 1.45;
      float fNoise1 = valueNoise(foamUV + vec2(uTime * 0.35, -uTime * 0.25));
      float fNoise2 = valueNoise(foamUV * 2.3 - vec2(uTime * 0.55, uTime * 0.42));
      float foamPattern = fNoise1 * 0.62 + fNoise2 * 0.38;

      float rapidFoam = smoothstep(0.36, 0.80, vFoam + (foamPattern - 0.48) * 0.32) * smoothstep(0.016, 0.068, vDepth);
      float shoreRipple = 0.5 + 0.5 * sin(vDepth * 58.0 - uTime * 2.6 + foamPattern * 4.0);
      float shoreFoam =
        smoothstep(0.09, 0.020, vDepth) *
        smoothstep(0.008, 0.024, vDepth) *
        smoothstep(0.48, 0.82, foamPattern * 0.75 + shoreRipple * 0.35);

      float totalFoam = clamp(max(rapidFoam, shoreFoam * 0.76), 0.0, 1.0);

      // Soft anti-aliased sun / moon Blinn-Phong specular highlight (damped in turbulent whitewater foam to stop sparkle strobing!)
      vec3 H = normalize(L + V);
      float NdotH = max(dot(N, H), 0.0);
      float specBroad = pow(NdotH, 48.0) * 0.20;
      float specSparkle = pow(NdotH, 160.0) * 0.92 * (1.0 - totalFoam * 0.72);
      float specMask = smoothstep(0.018, 0.095, vDepth) * (1.0 - pollFactor * 0.45);
      col += uSunColor * (specBroad + specSparkle) * specMask * mix(1.0, 0.45, uNight);

      vec3 foamTint = mix(cleanFoamColor, dirtyFoamColor, pollFactor) * mix(1.0, 0.32, uNight);
      col = mix(col, foamTint, totalFoam * 0.84);

      float baseOpacity = mix(0.85, 0.94, deepMix);
      float alpha = shoreAlpha * clamp(baseOpacity * 0.88 / 0.85 + totalFoam * 0.12 + specSparkle * 0.12, 0.0, 0.96);
      alpha = mix(shoreAlpha * 0.88, min(0.96, shoreAlpha * 0.95), clamp(deepMix * 0.65 + totalFoam + pollFactor * 0.4, 0.0, 1.0));

      gl_FragColor = vec4(col, alpha);
      ${hasToneChunk ? '#include <tonemapping_fragment>' : ''}
      ${hasColorChunk ? '#include <colorspace_fragment>' : ''}
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.55, 0.76, 0.34).normalize() },
      uSunColor: { value: new THREE.Color(0xfff5e0) },
      uSkyColor: { value: new THREE.Color(0x88c9f2) },
      uCamPos: { value: new THREE.Vector3(0, 26, 26) },
      uNight: { value: 0.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4
  });
}

function assignVec3Uniform(target, src) {
  if (!src || !target) return;
  if (Array.isArray(src)) {
    target.set(src[0] || 0, src[1] || 0, src[2] || 0);
  } else if (typeof src.x === 'number') {
    target.set(src.x, src.y, src.z);
  }
}

function assignColorUniform(target, src) {
  if (src == null || !target) return;
  if (typeof src === 'number' || typeof src === 'string') {
    target.set(src);
  } else if (typeof src.r === 'number') {
    target.setRGB(src.r, src.g, src.b);
  }
}

/**
 * Updates live lighting, camera, time & day/night uniforms on the physical water ShaderMaterial.
 */
export function updatePhysicalWaterUniforms(mat, clock, sunDir, sunColor, skyColor, camPos, night) {
  if (!mat || !mat.uniforms) return;
  const u = mat.uniforms;

  if (typeof clock === 'number') {
    u.uTime.value = clock;
  } else if (clock && typeof clock.getElapsedTime === 'function') {
    u.uTime.value = clock.getElapsedTime();
  } else if (clock && typeof clock.elapsedTime === 'number') {
    u.uTime.value = clock.elapsedTime;
  }

  if (sunDir) {
    assignVec3Uniform(u.uSunDir.value, sunDir);
    if (u.uSunDir.value.lengthSq() > 1e-6) {
      u.uSunDir.value.normalize();
    } else {
      u.uSunDir.value.set(0.55, 0.76, 0.34).normalize();
    }
  }

  assignColorUniform(u.uSunColor.value, sunColor);
  assignColorUniform(u.uSkyColor.value, skyColor);
  assignVec3Uniform(u.uCamPos.value, camPos);

  if (typeof night === 'boolean') {
    u.uNight.value = night ? 1.0 : 0.0;
  } else if (typeof night === 'number') {
    u.uNight.value = clamp01(night);
  }
}

/**
 * Builds a 112 x 112 (2x per tile!) smooth continuous water surface THREE.Mesh
 * sampling waterPhysics.computeCornerWaterField(), skipping dry quads & dam cells,
 * with per-vertex attributes aDepth, aPoll, aFoam, aFlow.
 */
export function buildSmoothWaterMesh(THREE, sim, waterPhysics, waterMat) {
  const WSUB = 2;
  const WSEG = GRID_SIZE * WSUB; // 112
  const WSTRIDE = WSEG + 1;      // 113
  const WVCOUNT = WSTRIDE * WSTRIDE;

  const field = waterPhysics.computeCornerWaterField();
  const { surfY, poll, foam, flowX, flowZ } = field;
  const grid = sim.grid;
  const flatMask = buildCornerFlatMask(sim);

  // Evaluate sub-grid (113 x 113) smooth water surface & exact curved terrain depth
  const subSurf = new Float32Array(WVCOUNT);
  const subDepth = new Float32Array(WVCOUNT);
  const subPoll = new Float32Array(WVCOUNT);
  const subFoam = new Float32Array(WVCOUNT);
  const subFx = new Float32Array(WVCOUNT);
  const subFz = new Float32Array(WVCOUNT);

  for (let gz = 0; gz < WSTRIDE; gz++) {
    const v = gz / WSUB;
    const cz0 = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(v)));
    const tv = clamp01(v - cz0);

    for (let gx = 0; gx < WSTRIDE; gx++) {
      const u = gx / WSUB;
      const cx0 = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(u)));
      const tu = clamp01(u - cx0);

      const i00 = cIdx(cx0, cz0);
      const i10 = cIdx(cx0 + 1, cz0);
      const i01 = cIdx(cx0, cz0 + 1);
      const i11 = cIdx(cx0 + 1, cz0 + 1);

      const w00 = (1 - tu) * (1 - tv);
      const w10 = tu * (1 - tv);
      const w01 = (1 - tu) * tv;
      const w11 = tu * tv;

      const sVal = surfY[i00] * w00 + surfY[i10] * w10 + surfY[i01] * w01 + surfY[i11] * w11;
      const terrH = evaluateSmoothTerrainHeight(sim, flatMask, u, v);
      const dVal = Math.max(0, sVal - terrH);

      const wi = gz * WSTRIDE + gx;
      // Smooth continuous clearance over sloped canyon riverbeds (eliminates 0.000 step jumps & tailrace Z-fighting!)
      const wetLift = dVal > 0 ? 0.016 * Math.min(1.0, dVal / 0.035) : 0;
      subSurf[wi] = dVal > 0 ? sVal + wetLift : Math.min(sVal, terrH - 0.014);
      subDepth[wi] = dVal;
      subPoll[wi] = poll[i00] * w00 + poll[i10] * w10 + poll[i01] * w01 + poll[i11] * w11;
      subFoam[wi] = foam[i00] * w00 + foam[i10] * w10 + foam[i01] * w01 + foam[i11] * w11;
      subFx[wi] = flowX[i00] * w00 + flowX[i10] * w10 + flowX[i01] * w01 + flowX[i11] * w11;
      subFz[wi] = flowZ[i00] * w00 + flowZ[i10] * w10 + flowZ[i01] * w01 + flowZ[i11] * w11;
    }
  }

  // Compact active wet & shoreline quads into welded indexed BufferGeometry
  const vertRemap = new Int32Array(WVCOUNT);
  vertRemap.fill(-1);

  const activeVerts = [];
  const triIndices = [];

  const getVertIndex = (wi) => {
    let idxOut = vertRemap[wi];
    if (idxOut === -1) {
      idxOut = activeVerts.length;
      vertRemap[wi] = idxOut;
      activeVerts.push(wi);
    }
    return idxOut;
  };

  for (let gz = 0; gz < WSEG; gz++) {
    const tz = (gz / WSUB) | 0;
    const r0 = gz * WSTRIDE;
    const r1 = (gz + 1) * WSTRIDE;

    for (let gx = 0; gx < WSEG; gx++) {
      const tx = (gx / WSUB) | 0;
      if (grid[idx(tx, tz)].dam) continue;

      const q00 = r0 + gx;
      const q10 = r0 + gx + 1;
      const q01 = r1 + gx;
      const q11 = r1 + gx + 1;

      const d00 = subDepth[q00];
      const d10 = subDepth[q10];
      const d01 = subDepth[q01];
      const d11 = subDepth[q11];

      if (d00 <= 0.007 && d10 <= 0.007 && d01 <= 0.007 && d11 <= 0.007) continue;

      const a = getVertIndex(q00);
      const b = getVertIndex(q10);
      const c = getVertIndex(q01);
      const d = getVertIndex(q11);

      // Fixed deterministic quad diagonal prevents 0.09s triangle-flip flickering on turbulent dam tailraces!
      triIndices.push(a, c, d, a, d, b);
    }
  }

  const count = activeVerts.length;
  const positions = new Float32Array(count * 3);
  const aDepth = new Float32Array(count);
  const aPoll = new Float32Array(count);
  const aFoam = new Float32Array(count);
  const aFlow = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    const wi = activeVerts[i];
    const gx = wi % WSTRIDE;
    const gz = (wi / WSTRIDE) | 0;

    const p3 = i * 3;
    positions[p3] = gx / WSUB - HALF_GRID;
    positions[p3 + 1] = subSurf[wi];
    positions[p3 + 2] = gz / WSUB - HALF_GRID;

    aDepth[i] = subDepth[wi];
    aPoll[i] = subPoll[wi];
    aFoam[i] = subFoam[wi];

    const p2 = i * 2;
    aFlow[p2] = subFx[wi];
    aFlow[p2 + 1] = subFz[wi];
  }

  const indices = new Uint16Array(triIndices);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aDepth', new THREE.BufferAttribute(aDepth, 1));
  geo.setAttribute('aPoll', new THREE.BufferAttribute(aPoll, 1));
  geo.setAttribute('aFoam', new THREE.BufferAttribute(aFoam, 1));
  geo.setAttribute('aFlow', new THREE.BufferAttribute(aFlow, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  if (count > 0) {
    geo.computeBoundingSphere();
  }

  const mesh = new THREE.Mesh(geo, waterMat || createPhysicalWaterMaterial(THREE));
  mesh.renderOrder = 2;
  mesh.frustumCulled = false;
  mesh.userData = { ownGeo: true };
  return mesh;
}

/* ============================================================================
 * CONTINUOUS CORNER-WELDED ROADS, BRIDGES, TUNNELS, ELEVATED VIADUCTS & HSR
 * ============================================================================ */

function detectStripesAlongV(mat) {
  if (!mat || !mat.map) return true;
  const tex = mat.map;
  if (typeof tex._stripesAlongV === 'boolean') return tex._stripesAlongV;
  let alongV = true;
  try {
    const img = tex.image;
    if (img && typeof img.getContext === 'function' && img.width > 4 && img.height > 4) {
      const ctx = img.getContext('2d');
      const w = img.width;
      const h = img.height;
      const d = ctx.getImageData(0, 0, w, h).data;
      let diffX = 0;
      let diffY = 0;
      for (let y = 1; y < h - 1; y += 2) {
        for (let x = 1; x < w - 1; x += 2) {
          const p = (y * w + x) * 4;
          const pR = p + 4;
          const pD = p + w * 4;
          const lum = d[p] + d[p + 1] + d[p + 2];
          const lumR = d[pR] + d[pR + 1] + d[pR + 2];
          const lumD = d[pD] + d[pD + 1] + d[pD + 2];
          diffX += Math.abs(lumR - lum);
          diffY += Math.abs(lumD - lum);
        }
      }
      // Sidewalks & center lines vary strongly across road width and weakly along travel axis
      alongV = diffX >= diffY;
    }
  } catch (_) {
    alongV = true;
  }
  tex._stripesAlongV = alongV;
  return alongV;
}

function getOrCreateInfraAuxMaterials(THREE, mats) {
  const host = mats || {};
  if (host._contInfraCache) return host._contInfraCache;
  const cache = {
    road2Fallback: host.road2 || new THREE.MeshStandardMaterial({ color: 0x3b4048, roughness: 0.85 }),
    road4Fallback: host.road4 || new THREE.MeshStandardMaterial({ color: 0x31363f, roughness: 0.82 }),
    roadHubFallback: host.roadHub || new THREE.MeshStandardMaterial({ color: 0x363b44, roughness: 0.84 }),
    concrete: new THREE.MeshStandardMaterial({
      vertexColors: true,
      color: 0xffffff,
      roughness: 0.82,
      metalness: 0.05
    }),
    tunnelDark: new THREE.MeshStandardMaterial({
      color: 0x0b0e14,
      roughness: 0.98,
      metalness: 0.0
    }),
    steelRail: new THREE.MeshStandardMaterial({
      color: 0xcfd6df,
      roughness: 0.34,
      metalness: 0.78
    }),
    trafficDeck: new THREE.MeshStandardMaterial({
      vertexColors: true,
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.04
    }),
    roadMarking: new THREE.MeshStandardMaterial({
      vertexColors: true,
      color: 0xffffff,
      roughness: 0.52,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4
    })
  };
  if (mats && typeof mats === 'object') {
    mats._contInfraCache = cache;
  }
  return cache;
}

function createGeoBatch(useColors = false) {
  const pos = [];
  const norm = [];
  const uv = [];
  const col = useColors ? [] : null;
  const ind = [];
  let vCount = 0;

  // Counter-clockwise quad (A -> B -> C -> D) when viewed from front/top:
  // Normal = normalize((B - A) x (D - A))
  function addQuad(
    ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz,
    ua = 0, va = 0, ub = 0, vb = 1, uc = 1, vc = 1, ud = 1, vd = 0,
    cr = 1, cg = 1, cb = 1
  ) {
    const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
    const e2x = dx - ax, e2y = dy - ay, e2z = dz - az;
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;

    const base = vCount;
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz);
    norm.push(nx, ny, nz, nx, ny, nz, nx, ny, nz, nx, ny, nz);
    uv.push(ua, va, ub, vb, uc, vc, ud, vd);
    if (col) {
      col.push(cr, cg, cb, cr, cg, cb, cr, cg, cb, cr, cg, cb);
    }
    ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
    vCount += 4;
  }

  // Counter-clockwise triangle (A -> B -> C) when viewed from front/top:
  // Normal = normalize((B - A) x (C - A))
  function addTri(
    ax, ay, az, bx, by, bz, cx, cy, cz,
    cr = 1, cg = 1, cb = 1
  ) {
    const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
    const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;

    const base = vCount;
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    norm.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    uv.push(0.5, 1, 0, 0, 1, 0);
    if (col) {
      col.push(cr, cg, cb, cr, cg, cb, cr, cg, cb);
    }
    ind.push(base, base + 1, base + 2);
    vCount += 3;
  }

  // Extruded 3D sloped beam / barrier / slab / rail from P0(p0x, p0z) to P1(p1x, p1z)
  function addBeam(
    p0x, p0z, y0L, y0R,
    p1x, p1z, y1L, y1R,
    halfW, upH, downH,
    capStart = true, capEnd = true, includeBottom = true,
    cr = 0.80, cg = 0.81, cb = 0.83
  ) {
    const dx = p1x - p0x;
    const dz = p1z - p0z;
    const segLen = Math.hypot(dx, dz);
    if (segLen < 1e-5) return;
    const dirX = dx / segLen;
    const dirZ = dz / segLen;
    // Left unit vector (CCW 90 deg from +Y): (dirZ, -dirX)
    const lx = dirZ * halfW;
    const lz = -dirX * halfW;

    const x0L = p0x + lx, z0L = p0z + lz;
    const x0R = p0x - lx, z0R = p0z - lz;
    const x1L = p1x + lx, z1L = p1z + lz;
    const x1R = p1x - lx, z1R = p1z - lz;

    const t0L = y0L + upH, t0R = y0R + upH, t1L = y1L + upH, t1R = y1R + upH;
    const b0L = y0L - downH, b0R = y0R - downH, b1L = y1L - downH, b1R = y1R - downH;

    // Top face (+Y)
    addQuad(x1L, t1L, z1L, x0L, t0L, z0L, x0R, t0R, z0R, x1R, t1R, z1R, 0, 0, 0, 1, 1, 1, 1, 0, cr, cg, cb);
    // Bottom soffit (-Y)
    if (includeBottom) {
      addQuad(x0L, b0L, z0L, x1L, b1L, z1L, x1R, b1R, z1R, x0R, b0R, z0R, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.82, cg * 0.82, cb * 0.84);
    }
    // Left vertical face (+left)
    addQuad(x1L, t1L, z1L, x1L, b1L, z1L, x0L, b0L, z0L, x0L, t0L, z0L, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.93, cg * 0.93, cb * 0.94);
    // Right vertical face (+right)
    addQuad(x0R, t0R, z0R, x0R, b0R, z0R, x1R, b1R, z1R, x1R, t1R, z1R, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.90, cg * 0.90, cb * 0.92);
    // Start cap (-dir)
    if (capStart) {
      addQuad(x0L, t0L, z0L, x0L, b0L, z0L, x0R, b0R, z0R, x0R, t0R, z0R, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.88, cg * 0.88, cb * 0.90);
    }
    // End cap (+dir)
    if (capEnd) {
      addQuad(x1R, t1R, z1R, x1R, b1R, z1R, x1L, b1L, z1L, x1L, t1L, z1L, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.88, cg * 0.88, cb * 0.90);
    }
  }

  // Smooth cylindrical concrete pier from yBot to yTop
  function addCylinder(cx, cz, yBot, yTop, rBot, rTop, segs = 10, cr = 0.74, cg = 0.75, cb = 0.78) {
    if (yTop - yBot < 0.02) return;
    const base = vCount;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      // Top ring then bottom ring
      pos.push(cx + ca * rTop, yTop, cz + sa * rTop);
      norm.push(ca, 0, sa);
      uv.push(i / segs, 0);
      if (col) col.push(cr, cg, cb);

      pos.push(cx + ca * rBot, yBot, cz + sa * rBot);
      norm.push(ca, 0, sa);
      uv.push(i / segs, 1);
      if (col) col.push(cr * 0.9, cg * 0.9, cb * 0.92);
    }
    for (let i = 0; i < segs; i++) {
      const t0 = base + i * 2;
      const b0 = t0 + 1;
      const t1 = t0 + 2;
      const b1 = t0 + 3;
      ind.push(t1, b1, b0, t1, b0, t0);
    }
    vCount += (segs + 1) * 2;
  }

  // Smooth capped cylinder / domed planter island (side wall + upward +Y disk/dome cap)
  function addCappedCylinder(cx, cz, yBot, yTop, rBot, rTop, crownH = 0, segs = 16, cr = 0.80, cg = 0.81, cb = 0.83) {
    addCylinder(cx, cz, yBot, yTop, rBot, rTop, segs, cr * 0.92, cg * 0.92, cb * 0.94);
    const centerIdx = vCount;
    pos.push(cx, yTop + crownH, cz);
    norm.push(0, 1, 0);
    uv.push(0.5, 0.5);
    if (col) col.push(cr * 1.04, cg * 1.04, cb * 1.04);
    vCount++;

    const rimBase = vCount;
    const slopeN = crownH > 0.001 ? crownH / Math.max(0.02, rTop) : 0;
    const invN = 1 / Math.sqrt(1 + slopeN * slopeN);
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      pos.push(cx + ca * rTop, yTop, cz + sa * rTop);
      norm.push(ca * slopeN * invN, invN, sa * slopeN * invN);
      uv.push(0.5 + ca * 0.5, 0.5 + sa * 0.5);
      if (col) col.push(cr, cg, cb);
    }
    for (let i = 0; i < segs; i++) {
      ind.push(centerIdx, rimBase + i + 1, rimBase + i);
    }
    vCount += segs + 1;
  }

  // Subdivided welded bilinear deck quad (sub x sub) matching terrain triangulation
  function addBilinearDeck(
    x0, z0, x1, z1,
    y00, y10, y01, y11,
    sub, uvMode, stripesAlongV,
    cr = 1, cg = 1, cb = 1
  ) {
    const stride = sub + 1;
    const base = vCount;

    for (let sz = 0; sz <= sub; sz++) {
      const tv = sz / sub;
      const z = z0 + (z1 - z0) * tv;
      for (let sx = 0; sx <= sub; sx++) {
        const tu = sx / sub;
        const x = x0 + (x1 - x0) * tu;
        const y = (y00 * (1 - tu) + y10 * tu) * (1 - tv) + (y01 * (1 - tu) + y11 * tu) * tv;

        // Analytical bilinear normal
        const dhdx = (y10 - y00) * (1 - tv) + (y11 - y01) * tv;
        const dhdz = (y01 - y00) * (1 - tu) + (y11 - y10) * tu;
        const invL = 1 / Math.sqrt(dhdx * dhdx + 1 + dhdz * dhdz);

        let uCoord = tu;
        let vCoord = tv;
        if (uvMode === 'EW') {
          if (stripesAlongV) {
            uCoord = tv;
            vCoord = tu;
          } else {
            uCoord = tu;
            vCoord = tv;
          }
        } else if (uvMode === 'NS') {
          if (stripesAlongV) {
            uCoord = tu;
            vCoord = tv;
          } else {
            uCoord = tv;
            vCoord = 1 - tu;
          }
        }

        pos.push(x, y, z);
        norm.push(-dhdx * invL, invL, -dhdz * invL);
        uv.push(uCoord, vCoord);
        if (col) col.push(cr, cg, cb);
      }
    }

    for (let sz = 0; sz < sub; sz++) {
      const r0 = sz * stride;
      const r1 = (sz + 1) * stride;
      for (let sx = 0; sx < sub; sx++) {
        const i00 = base + r0 + sx;
        const i10 = i00 + 1;
        const i01 = base + r1 + sx;
        const i11 = i01 + 1;

        const h00 = pos[i00 * 3 + 1];
        const h10 = pos[i10 * 3 + 1];
        const h01 = pos[i01 * 3 + 1];
        const h11 = pos[i11 * 3 + 1];

        if (Math.abs(h00 - h11) <= Math.abs(h10 - h01)) {
          ind.push(i00, i01, i11, i00, i11, i10);
        } else {
          ind.push(i00, i01, i10, i10, i01, i11);
        }
      }
    }
    vCount += stride * stride;
  }

  function toMesh(THREE, material) {
    if (vCount === 0 || ind.length === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(norm), 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));
    if (col) {
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    }
    const IndexArray = vCount > 65535 ? Uint32Array : Uint16Array;
    geo.setIndex(new THREE.BufferAttribute(new IndexArray(ind), 1));
    geo.computeBoundingSphere();

    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.userData = { ownGeo: true };
    return mesh;
  }

  return { addQuad, addTri, addBeam, addCylinder, addCappedCylinder, addBilinearDeck, toMesh };
}

// Cardinal directions: 0:N(0,-1), 1:S(0,+1), 2:W(-1,0), 3:E(+1,0)
const RAMP_DIRS = [
  { dx: 0, dz: -1, opp: 1 },
  { dx: 0, dz: 1, opp: 0 },
  { dx: -1, dz: 0, opp: 3 },
  { dx: 1, dz: 0, opp: 2 }
];

/**
 * Shared Ramp Topology Resolver supporting contiguous collinear 1..K ramp chains
 * across all three real-world interchange modes:
 * - 'bridgehead': viaduct end-landing ramp (no through ground road under viaduct)
 * - 'median_split': narrow central median ramp descending between split ground avenue lanes!
 * - 'mid_slip': continuous overhead viaduct + parallel right-flank slip-ramp!
 */
export function resolveRampChainMeta(gridOrSim) {
  const grid = Array.isArray(gridOrSim) ? gridOrSim : (gridOrSim && gridOrSim.grid ? gridOrSim.grid : []);
  const waterDepth = (!Array.isArray(gridOrSim) && gridOrSim && gridOrSim.waterDepth) ? gridOrSim.waterDepth : null;
  const rampMeta = new Map();
  if (!grid || grid.length < GRID_SIZE * GRID_SIZE) return rampMeta;

  const tileAt = (x, z) => (inBounds(x, z) ? grid[idx(x, z)] : null);
  const hasElevViaduct = (nt) => Boolean(nt && nt.roadElevated > 0 && !nt.ramp);
  const isGroundPassableAt = (gx, gz) => {
    if (!inBounds(gx, gz)) return false;
    const nt = grid[idx(gx, gz)];
    if (!nt || !(nt.roadGround > 0)) return false;
    if (nt.dam) return true;
    const wd = waterDepth ? waterDepth[idx(gx, gz)] : 0;
    if (nt.roadBridge) return wd <= 1.35;
    return !(wd > 0.28);
  };
  const isValidRampAt = (rx, rz) => {
    if (!inBounds(rx, rz)) return false;
    const rt = grid[idx(rx, rz)];
    if (!rt || !rt.ramp) return false;
    if (rt.roadElevated !== undefined && !(rt.roadElevated > 0)) return false;
    if (rt.roadGround !== undefined && !isGroundPassableAt(rx, rz)) return false;
    return true;
  };

  const visited = new Uint8Array(GRID_SIZE * GRID_SIZE);

  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const startIdx = idx(x, z);
      if (visited[startIdx] || !isValidRampAt(x, z)) continue;

      const hasNSRamp = isValidRampAt(x, z - 1) || isValidRampAt(x, z + 1);
      const hasEWRamp = isValidRampAt(x - 1, z) || isValidRampAt(x + 1, z);

      let axisNS = false;
      if (hasNSRamp && !hasEWRamp) {
        axisNS = true;
      } else if (hasEWRamp && !hasNSRamp) {
        axisNS = false;
      } else {
        const eN = hasElevViaduct(tileAt(x, z - 1));
        const eS = hasElevViaduct(tileAt(x, z + 1));
        const eW = hasElevViaduct(tileAt(x - 1, z));
        const eE = hasElevViaduct(tileAt(x + 1, z));

        const gN = isGroundPassableAt(x, z - 1);
        const gS = isGroundPassableAt(x, z + 1);
        const gW = isGroundPassableAt(x - 1, z);
        const gE = isGroundPassableAt(x + 1, z);

        const nsScore =
          ((eN || eS) ? 6 : 0) +
          (((eN && gS) || (eS && gN)) ? 6 : 0) +
          (gN ? 1 : 0) + (gS ? 1 : 0);
        const ewScore =
          ((eW || eE) ? 6 : 0) +
          (((eW && gE) || (eE && gW)) ? 6 : 0) +
          (gW ? 1 : 0) + (gE ? 1 : 0);
        axisNS = nsScore >= ewScore;
      }

      const dirA = axisNS ? 0 : 2; // 0:N or 2:W
      const dirB = axisNS ? 1 : 3; // 1:S or 3:E
      const stepX = RAMP_DIRS[dirB].dx;
      const stepZ = RAMP_DIRS[dirB].dz;

      // Rewind to dirA-most tile of contiguous collinear ramp chain
      let sx = x;
      let sz = z;
      while (isValidRampAt(sx - stepX, sz - stepZ)) {
        const prevIdx = idx(sx - stepX, sz - stepZ);
        if (visited[prevIdx]) break;
        sx -= stepX;
        sz -= stepZ;
      }

      // Collect chain [c_0 .. c_{K-1}] from dirA end -> dirB end
      const chain = [];
      let cx = sx;
      let cz = sz;
      while (isValidRampAt(cx, cz)) {
        const ci = idx(cx, cz);
        if (visited[ci]) break;
        visited[ci] = 1;
        chain.push({ x: cx, z: cz, i: ci, t: grid[ci] });
        cx += stepX;
        cz += stepZ;
      }

      const K = chain.length;
      const first = chain[0];
      const last = chain[K - 1];
      const ax = first.x + RAMP_DIRS[dirA].dx;
      const az = first.z + RAMP_DIRS[dirA].dz;
      const bx = last.x + RAMP_DIRS[dirB].dx;
      const bz = last.z + RAMP_DIRS[dirB].dz;
      const nA = tileAt(ax, az);
      const nB = tileAt(bx, bz);

      const elevA = hasElevViaduct(nA);
      const elevB = hasElevViaduct(nB);
      const gndA = isGroundPassableAt(ax, az);
      const gndB = isGroundPassableAt(bx, bz);

      let mode = 'bridgehead';
      let highDir = dirA;
      let lowDir = dirB;
      let throughElev = false;
      let throughGround = false;

      if (elevA && elevB) {
        // Case 1: Mid-viaduct slip-ramp (overhead highway continues unbroken across both ends!)
        mode = 'mid_slip';
        highDir = dirA;
        lowDir = dirB;
        throughElev = true;
        throughGround = Boolean(gndA || gndB);
      } else if (elevA || elevB) {
        // Case 2: Single viaduct end -> check if ground road ALSO continues under nHigh!
        highDir = elevA ? dirA : dirB;
        lowDir = RAMP_DIRS[highDir].opp;
        throughElev = false;
        throughGround = Boolean(elevA ? gndA : gndB);
        mode = throughGround ? 'median_split' : 'bridgehead';
      } else {
        // Case 3: Fallback (no adjacent non-ramp viaduct yet) — matches traffic.js exactly
        lowDir = gndA ? dirA : dirB;
        highDir = RAMP_DIRS[lowDir].opp;
        mode = 'bridgehead';
        throughElev = false;
        throughGround = false;
      }

      // Order [p_0 .. p_{K-1}] strictly from lowDir end (k=0) to highDir end (k=K-1)
      const ordered = lowDir === dirA ? chain : chain.slice().reverse();
      for (let k = 0; k < K; k++) {
        rampMeta.set(ordered[k].i, {
          mode,
          highDir,
          lowDir,
          lowFrac: k / K,
          highFrac: (k + 1) / K,
          chainLen: K,
          throughGround,
          throughElev
        });
      }
    }
  }

  return rampMeta;
}

/**
 * Builds 100% continuous, corner-welded sloped 3D meshes for:
 * 1. Ground Roads & River Bridges (t.roadGround === 1, 2, 3 + throughGround ramp avenues)
 * 2. Mountain Tunnel Portals (t.roadGround === 4)
 * 3. Continuous Sloped Elevated Highway Viaducts (t.roadElevated > 0) & Ramps (t.ramp)
 * 4. Continuous Sloped High-Speed Rail Slab Track & Viaducts (t.rail > 0)
 */
export function buildContinuousRoadAndViaductGroup(THREE, sim, overlayMode, mats) {
  const group = new THREE.Group();
  const corners = sim.corners;
  const grid = sim.grid;
  const waterDepth = sim.waterDepth;
  const CN = CORNER_STRIDE * CORNER_STRIDE;

  const auxMats = getOrCreateInfraAuxMaterials(THREE, mats);
  const matRoad2 = (mats && mats.road2) || auxMats.road2Fallback;
  const matRoad4 = (mats && mats.road4) || auxMats.road4Fallback;
  const matRoadHub = (mats && mats.roadHub) || auxMats.roadHubFallback;
  const stripesV2 = detectStripesAlongV(matRoad2);
  const stripesV4 = detectStripesAlongV(matRoad4);

  const isTrafficOverlay = overlayMode === 'traffic' || overlayMode === 'congestion';
  let congScale = 1.0;
  if (isTrafficOverlay) {
    let maxCg = 0;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].congestion > maxCg) maxCg = grid[i].congestion;
      if ((grid[i].elevCongestion || 0) > maxCg) maxCg = grid[i].elevCongestion;
    }
    congScale = maxCg > 1.05 ? 0.01 : 1.0;
  }

  const useLinear = !!(THREE.ColorManagement && THREE.ColorManagement.enabled);
  const toCol = (c) => {
    const v = clamp01(c);
    if (!useLinear) return v;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  // Precompute per-cell average terrain elevation & water surface
  const cellElev = new Float32Array(GRID_SIZE * GRID_SIZE);
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cellElev[idx(x, z)] = (
        corners[cIdx(x, z)] +
        corners[cIdx(x + 1, z)] +
        corners[cIdx(x, z + 1)] +
        corners[cIdx(x + 1, z + 1)]
      ) * 0.25;
    }
  }

  const DIRS = RAMP_DIRS;
  // Facing dir d (0:N, 1:S, 2:W, 3:E) -> left & right cardinal directions
  const LEFT_DIR = [2, 3, 1, 0];
  const RIGHT_DIR = [3, 2, 0, 1];

  // --- 0. Resolve Collinear Ramp Chains (bridgehead / median_split / mid_slip) ---
  const rampMeta = resolveRampChainMeta(sim);

  const hasRampGroundDeck = (t, rm) => Boolean(
    rm && (rm.throughGround || (rm.mode === 'mid_slip' && t.roadGround >= 1 && t.roadGround <= 3 && !t.dam))
  );

  const isSurfRoadTile = (x, z) => {
    if (!inBounds(x, z)) return false;
    const i = idx(x, z);
    const t = grid[i];
    if (t.dam) return false;
    if (t.ramp) {
      const rm = rampMeta.get(i);
      return hasRampGroundDeck(t, rm);
    }
    return t.roadGround === 1 || t.roadGround === 2 || t.roadGround === 3;
  };

  const hasGroundFlareTaperInto = (rx, rz, intoDir, sideDir) => {
    if (!inBounds(rx, rz)) return false;
    const ri = idx(rx, rz);
    const rt = grid[ri];
    if (!rt.ramp) return false;
    const rm = rampMeta.get(ri);
    if (!hasRampGroundDeck(rt, rm)) return false;
    if (rm.mode !== 'median_split' && rm.mode !== 'mid_slip') return false;
    const isLowEnd = intoDir === rm.lowDir && rm.lowFrac < 0.001;
    const isHighEnd = intoDir === rm.highDir && rm.highFrac > 0.999;
    if (!isLowEnd && !isHighEnd) return false;
    if (sideDir !== LEFT_DIR[rm.highDir] && sideDir !== RIGHT_DIR[rm.highDir]) return false;
    const tx = rx + DIRS[intoDir].dx;
    const tz = rz + DIRS[intoDir].dz;
    return isSurfRoadTile(tx, tz) && !grid[idx(tx, tz)].ramp;
  };

  const hasElevSlipGoreInto = (rx, rz, intoDir, sideDir) => {
    if (!inBounds(rx, rz)) return false;
    const ri = idx(rx, rz);
    const rt = grid[ri];
    if (!rt.ramp) return false;
    const rm = rampMeta.get(ri);
    if (!rm || rm.mode !== 'mid_slip' || !(rm.highFrac > 0.999) || intoDir !== rm.highDir) return false;
    if (sideDir !== LEFT_DIR[rm.highDir] && sideDir !== RIGHT_DIR[rm.highDir]) return false;
    const tx = rx + DIRS[intoDir].dx;
    const tz = rz + DIRS[intoDir].dz;
    if (!inBounds(tx, tz)) return false;
    const ti = idx(tx, tz);
    const nt = grid[ti];
    if (nt.roadElevated > 0 && !nt.ramp) return true;
    const nrm = nt.ramp ? rampMeta.get(ti) : null;
    return Boolean(nrm && nrm.throughElev);
  };

  // --- 1. Compute Shared Ground Road & Bridge Corner Heights: roadCornerY[57 x 57] ---
  const roadCornerY = new Float32Array(CN);
  const bridgeCornerMask = new Uint8Array(CN);
  const bridgeCornerTarget = new Float32Array(CN);

  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      const ci = cIdx(cx, cz);
      const landY = corners[ci] + 0.028;
      let wetBridge = false;
      let maxWaterSurf = SEA_LEVEL;

      for (let dz = -1; dz <= 0; dz++) {
        const tz = cz + dz;
        if (tz < 0 || tz >= GRID_SIZE) continue;
        for (let dx = -1; dx <= 0; dx++) {
          const tx = cx + dx;
          if (tx < 0 || tx >= GRID_SIZE) continue;
          const ti = idx(tx, tz);
          const wd = waterDepth[ti];
          if (wd > 0.08 && isSurfRoadTile(tx, tz) && grid[ti].roadBridge) {
            wetBridge = true;
            const ws = Math.max(SEA_LEVEL, cellElev[ti] + wd);
            if (ws > maxWaterSurf) maxWaterSurf = ws;
          }
        }
      }

      if (wetBridge) {
        bridgeCornerMask[ci] = 1;
        bridgeCornerTarget[ci] = Math.max(landY, maxWaterSurf + 0.30);
        roadCornerY[ci] = bridgeCornerTarget[ci];
      } else {
        roadCornerY[ci] = landY;
      }
    }
  }

  // Smooth bridge deck heights across connected water corners & feather 1-corner bridge approaches
  const roadCornerTmp = new Float32Array(roadCornerY);
  for (let pass = 0; pass < 2; pass++) {
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        const landY = corners[ci] + 0.028;
        let bSum = 0;
        let bCnt = 0;
        for (let d = 0; d < 4; d++) {
          const nx = cx + DIRS[d].dx;
          const nz = cz + DIRS[d].dz;
          if (nx < 0 || nx >= CORNER_STRIDE || nz < 0 || nz >= CORNER_STRIDE) continue;
          const nci = cIdx(nx, nz);
          if (bridgeCornerMask[nci] || roadCornerY[nci] > corners[nci] + 0.08) {
            bSum += roadCornerY[nci];
            bCnt++;
          }
        }
        if (bridgeCornerMask[ci] && bCnt > 0) {
          roadCornerTmp[ci] = Math.max(bridgeCornerTarget[ci], roadCornerY[ci] * 0.55 + (bSum / bCnt) * 0.45);
        } else if (!bridgeCornerMask[ci] && bCnt > 0 && pass === 0) {
          // Smooth bridge approach transition so roads ramp onto bridges with zero vertical step!
          const approachY = landY * 0.58 + (bSum / bCnt) * 0.42;
          roadCornerTmp[ci] = Math.max(landY, approachY);
        } else {
          roadCornerTmp[ci] = roadCornerY[ci];
        }
      }
    }
    roadCornerY.set(roadCornerTmp);
  }

  // --- 2. Compute Smoothed Shared Elevated Highway Corner Heights: elevCornerY[57 x 57] ---
  const elevMinFloor = new Float32Array(CN);
  const elevCornerY = new Float32Array(CN);
  const elevTmp = new Float32Array(CN);

  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      const ci = cIdx(cx, cz);
      let maxSurf = corners[ci];
      for (let dz = -1; dz <= 0; dz++) {
        const tz = cz + dz;
        if (tz < 0 || tz >= GRID_SIZE) continue;
        for (let dx = -1; dx <= 0; dx++) {
          const tx = cx + dx;
          if (tx < 0 || tx >= GRID_SIZE) continue;
          const ti = idx(tx, tz);
          if (waterDepth[ti] > 0.04) {
            maxSurf = Math.max(maxSurf, cellElev[ti] + waterDepth[ti]);
          }
        }
      }
      maxSurf = Math.max(maxSurf, roadCornerY[ci] - 0.028);
      elevMinFloor[ci] = maxSurf + 0.82;
      elevCornerY[ci] = maxSurf + 1.15;
    }
  }

  // 4 passes of spatial smoothing so elevated highways sweep over hills in graceful grades
  for (let pass = 0; pass < 4; pass++) {
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        let sum = elevCornerY[ci] * 2.0;
        let wgt = 2.0;
        for (let oz = -1; oz <= 1; oz++) {
          const nz = cz + oz;
          if (nz < 0 || nz >= CORNER_STRIDE) continue;
          for (let ox = -1; ox <= 1; ox++) {
            if (ox === 0 && oz === 0) continue;
            const nx = cx + ox;
            if (nx < 0 || nx >= CORNER_STRIDE) continue;
            const w = (ox === 0 || oz === 0) ? 1.0 : 0.6;
            sum += elevCornerY[cIdx(nx, nz)] * w;
            wgt += w;
          }
        }
        elevTmp[ci] = Math.max(elevMinFloor[ci], sum / wgt);
      }
    }
    elevCornerY.set(elevTmp);
  }

  // --- 3. Compute Smoothed Shared High-Speed Rail Corner Heights: railCornerY[57 x 57] ---
  const railCornerY = new Float32Array(CN);
  const railMinFloor = new Float32Array(CN);
  const railTmp = new Float32Array(CN);

  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      const ci = cIdx(cx, cz);
      const baseH = corners[ci];
      let needOverpass = false;
      let overBase = baseH;

      for (let dz = -1; dz <= 0; dz++) {
        const tz = cz + dz;
        if (tz < 0 || tz >= GRID_SIZE) continue;
        for (let dx = -1; dx <= 0; dx++) {
          const tx = cx + dx;
          if (tx < 0 || tx >= GRID_SIZE) continue;
          const ti = idx(tx, tz);
          const t = grid[ti];
          if (t.rail <= 0) continue;
          if (waterDepth[ti] > 0.06) {
            needOverpass = true;
            overBase = Math.max(overBase, cellElev[ti] + waterDepth[ti]);
          }
          if ((t.roadGround >= 1 && t.roadGround <= 3) || t.ramp) {
            needOverpass = true;
            overBase = Math.max(overBase, roadCornerY[ci]);
          }
        }
      }

      if (needOverpass) {
        railMinFloor[ci] = overBase + 0.76;
        railCornerY[ci] = overBase + 0.82;
      } else {
        railMinFloor[ci] = baseH + 0.085;
        railCornerY[ci] = baseH + 0.09;
      }
    }
  }

  // Smooth rail grades across 3 passes so HSR bridges/overpasses ramp smoothly up from +0.09 to +0.82
  for (let pass = 0; pass < 3; pass++) {
    for (let cz = 0; cz < CORNER_STRIDE; cz++) {
      for (let cx = 0; cx < CORNER_STRIDE; cx++) {
        const ci = cIdx(cx, cz);
        let sum = railCornerY[ci] * 1.8;
        let wgt = 1.8;
        let maxNb = railCornerY[ci];
        for (let d = 0; d < 4; d++) {
          const nx = cx + DIRS[d].dx;
          const nz = cz + DIRS[d].dz;
          if (nx < 0 || nx >= CORNER_STRIDE || nz < 0 || nz >= CORNER_STRIDE) continue;
          const nv = railCornerY[cIdx(nx, nz)];
          sum += nv;
          wgt += 1.0;
          if (nv > maxNb) maxNb = nv;
        }
        // Pull approach corners smoothly up toward nearby overpasses
        const blended = (sum / wgt) * 0.72 + maxNb * 0.28;
        railTmp[ci] = Math.max(railMinFloor[ci], blended);
      }
    }
    railCornerY.set(railTmp);
  }

  // Publish the exact rendered deck surfaces so trains & vehicles ride ON the meshes (zero clipping!)
  sim.infraHeights = {
    roadCornerY: new Float32Array(roadCornerY),
    elevCornerY: new Float32Array(elevCornerY),
    railCornerY: new Float32Array(railCornerY),
    version: ((sim.infraHeights && sim.infraHeights.version) || 0) + 1
  };

  // --- Geometry Batches ---
  const bRoad2 = createGeoBatch(false);
  const bRoad4 = createGeoBatch(false);
  const bRoadHub = createGeoBatch(false);
  const bTraffic = createGeoBatch(true);
  const bConcrete = createGeoBatch(true);
  const bTunnelDark = createGeoBatch(false);
  const bSteel = createGeoBatch(false);
  const bMarkings = createGeoBatch(true);

  const cCurb = [toCol(0.73), toCol(0.74), toCol(0.76)];
  const cParapet = [toCol(0.82), toCol(0.83), toCol(0.85)];
  const cGirder = [toCol(0.66), toCol(0.68), toCol(0.71)];
  const cPier = [toCol(0.62), toCol(0.64), toCol(0.67)];
  const cPortal = [toCol(0.76), toCol(0.77), toCol(0.79)];
  const cSlab = [toCol(0.78), toCol(0.79), toCol(0.81)];
  const cArrowWhite = [toCol(0.96), toCol(0.97), toCol(0.99)];
  const cBanCrimson = [toCol(0.89), toCol(0.24), toCol(0.16)];
  const cBanAmber = [toCol(0.95), toCol(0.49), toCol(0.14)];
  const cBusGold = [toCol(0.98), toCol(0.79), toCol(0.14)];

  const trafficColorFor = (cong) => {
    const cv = clamp01(cong * congScale);
    const r = cv < 0.5 ? (0.18 + cv * 1.50) : 0.93;
    const g = cv < 0.5 ? 0.82 : (0.82 - (cv - 0.5) * 1.32);
    const b = 0.22 - cv * 0.08;
    return [toCol(r), toCol(g), toCol(b)];
  };

  // Exact world-coordinate bilinear sampler on a 57x57 corner height grid
  function sampleCornerGrid(heightGrid, wx, wz) {
    const gx = Math.min(GRID_SIZE, Math.max(0, wx + HALF_GRID));
    const gz = Math.min(GRID_SIZE, Math.max(0, wz + HALF_GRID));
    const tx = Math.min(GRID_SIZE - 1, Math.floor(gx));
    const tz = Math.min(GRID_SIZE - 1, Math.floor(gz));
    const tu = gx - tx;
    const tv = gz - tz;
    const h00 = heightGrid[cIdx(tx, tz)];
    const h10 = heightGrid[cIdx(tx + 1, tz)];
    const h01 = heightGrid[cIdx(tx, tz + 1)];
    const h11 = heightGrid[cIdx(tx + 1, tz + 1)];
    return (h00 * (1 - tu) + h10 * tu) * (1 - tv) + (h01 * (1 - tu) + h11 * tu) * tv;
  }

  // Flush corner-welded road pavement decal helpers (local frame: F=(fx,fz), R=(-fz,fx) -> guaranteed +Y normal)
  function addRoadDecalQuad(cx, cz, fx, fz, rx, rz, s0, s1, u0, u1, yLift, cr, cg, cb) {
    const ax = cx + fx * s1 + rx * u0, az = cz + fz * s1 + rz * u0;
    const bx = cx + fx * s0 + rx * u0, bz = cz + fz * s0 + rz * u0;
    const cxp = cx + fx * s0 + rx * u1, czp = cz + fz * s0 + rz * u1;
    const dx = cx + fx * s1 + rx * u1, dz = cz + fz * s1 + rz * u1;
    bMarkings.addQuad(
      ax, sampleCornerGrid(roadCornerY, ax, az) + yLift, az,
      bx, sampleCornerGrid(roadCornerY, bx, bz) + yLift, bz,
      cxp, sampleCornerGrid(roadCornerY, cxp, czp) + yLift, czp,
      dx, sampleCornerGrid(roadCornerY, dx, dz) + yLift, dz,
      0, 0, 0, 1, 1, 1, 1, 0,
      cr, cg, cb
    );
  }

  function addRoadDecalTri(cx, cz, fx, fz, rx, rz, sa, ua, sb, ub, sc, uc, yLift, cr, cg, cb) {
    const ax = cx + fx * sa + rx * ua, az = cz + fz * sa + rz * ua;
    const bx = cx + fx * sb + rx * ub, bz = cz + fz * sb + rz * ub;
    const cxp = cx + fx * sc + rx * uc, czp = cz + fz * sc + rz * uc;
    bMarkings.addTri(
      ax, sampleCornerGrid(roadCornerY, ax, az) + yLift, az,
      bx, sampleCornerGrid(roadCornerY, bx, bz) + yLift, bz,
      cxp, sampleCornerGrid(roadCornerY, cxp, czp) + yLift, czp,
      cr, cg, cb
    );
  }

  // Edge endpoint helper for tile (x, z) and dir d in 0:N, 1:S, 2:W, 3:E
  // Ordered so moving P0 -> P1 has the tile's OUTER side on its RIGHT (+right faces outward!)
  function getTileEdgeEndpoints(x, z, d, heightGrid) {
    const x0 = x - HALF_GRID;
    const x1 = x0 + 1;
    const z0 = z - HALF_GRID;
    const z1 = z0 + 1;
    const y00 = heightGrid[cIdx(x, z)];
    const y10 = heightGrid[cIdx(x + 1, z)];
    const y01 = heightGrid[cIdx(x, z + 1)];
    const y11 = heightGrid[cIdx(x + 1, z + 1)];

    if (d === 0) return { p0x: x0, p0z: z0, y0: y00, p1x: x1, p1z: z0, y1: y10 }; // N: W->E, right=North
    if (d === 1) return { p0x: x1, p0z: z1, y0: y11, p1x: x0, p1z: z1, y1: y01 }; // S: E->W, right=South
    if (d === 2) return { p0x: x0, p0z: z1, y0: y01, p1x: x0, p1z: z0, y1: y00 }; // W: S->N, right=West
    return { p0x: x1, p0z: z0, y0: y10, p1x: x1, p1z: z1, y1: y11 };              // E: N->S, right=East
  }

  // Exact-height streetlamp, live traffic signal & bus shelter placement registries for InstancedMesh rendering
  const lamps = [];
  const signals = [];
  const busStops = [];
  const pylonFootprints = [];
  const cPylon = [toCol(0.89), toCol(0.90), toCol(0.92)];

  // Tapered 3D concrete pylon shaft segment where sVec = (fz, -fx) guarantees (f x sVec)_y = +1
  function addPylonSegment(
    x0, y0, z0, wF0, wS0,
    x1, y1, z1, wF1, wS1,
    fx, fz, sx, sz,
    cr, cg, cb, capTop = false
  ) {
    if (y1 - y0 < 1e-4) return;
    const b0x = x0 - fx * wF0 - sx * wS0, b0z = z0 - fz * wF0 - sz * wS0;
    const b1x = x0 + fx * wF0 - sx * wS0, b1z = z0 + fz * wF0 - sz * wS0;
    const b2x = x0 + fx * wF0 + sx * wS0, b2z = z0 + fz * wF0 + sz * wS0;
    const b3x = x0 - fx * wF0 + sx * wS0, b3z = z0 - fz * wF0 + sz * wS0;

    const t0x = x1 - fx * wF1 - sx * wS1, t0z = z1 - fz * wF1 - sz * wS1;
    const t1x = x1 + fx * wF1 - sx * wS1, t1z = z1 + fz * wF1 - sz * wS1;
    const t2x = x1 + fx * wF1 + sx * wS1, t2z = z1 + fz * wF1 + sz * wS1;
    const t3x = x1 - fx * wF1 + sx * wS1, t3z = z1 - fz * wF1 + sz * wS1;

    bConcrete.addQuad(t0x, y1, t0z, b0x, y0, b0z, b1x, y0, b1z, t1x, y1, t1z, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.94, cg * 0.94, cb * 0.95);
    bConcrete.addQuad(t1x, y1, t1z, b1x, y0, b1z, b2x, y0, b2z, t2x, y1, t2z, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.98, cg * 0.98, cb * 0.99);
    bConcrete.addQuad(t2x, y1, t2z, b2x, y0, b2z, b3x, y0, b3z, t3x, y1, t3z, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.92, cg * 0.92, cb * 0.94);
    bConcrete.addQuad(t3x, y1, t3z, b3x, y0, b3z, b0x, y0, b0z, t0x, y1, t0z, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.96, cg * 0.96, cb * 0.97);
    if (capTop) {
      bConcrete.addQuad(t0x, y1, t0z, t1x, y1, t1z, t2x, y1, t2z, t3x, y1, t3z, 0, 0, 1, 0, 1, 1, 0, 1, cr, cg, cb);
    }
  }

  // Variable-depth curved concrete box-girder haunch / arch rib web under bridge spans
  function addHaunchWeb(
    x0, z0, yTop0, yBot0,
    x1, z1, yTop1, yBot1,
    halfW, sx, sz,
    cr, cg, cb
  ) {
    const p0Lx = x0 - sx * halfW, p0Lz = z0 - sz * halfW;
    const p0Rx = x0 + sx * halfW, p0Rz = z0 + sz * halfW;
    const p1Lx = x1 - sx * halfW, p1Lz = z1 - sz * halfW;
    const p1Rx = x1 + sx * halfW, p1Rz = z1 + sz * halfW;

    bConcrete.addQuad(p0Lx, yTop0, p0Lz, p0Lx, yBot0, p0Lz, p1Lx, yBot1, p1Lz, p1Lx, yTop1, p1Lz, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.93, cg * 0.93, cb * 0.95);
    bConcrete.addQuad(p1Rx, yTop1, p1Rz, p1Rx, yBot1, p1Rz, p0Rx, yBot0, p0Rz, p0Rx, yTop0, p0Rz, 0, 0, 0, 1, 1, 1, 1, 0, cr * 0.90, cg * 0.90, cb * 0.92);
    bConcrete.addQuad(p0Lx, yBot0, p0Lz, p0Rx, yBot0, p0Rz, p1Rx, yBot1, p1Rz, p1Lx, yBot1, p1Lz, 0, 0, 1, 0, 1, 1, 0, 1, cr * 0.82, cg * 0.82, cb * 0.85);
  }

  // --- Pre-Scan & Emit Modern Twin-Tower Cable-Stayed Bridges (斜拉桥, L >= 3 water spans) ---
  const N_CELLS = GRID_SIZE * GRID_SIZE;
  const groundCableSpanMask = new Uint8Array(N_CELLS);
  const elevCableSpanMask = new Uint8Array(N_CELLS);

  const evalGroundConnFlags = (x, z) => {
    let ns = false, ew = false;
    const t = grid[idx(x, z)];
    for (let d = 0; d < 4; d++) {
      const nx = x + DIRS[d].dx;
      const nz = z + DIRS[d].dz;
      let c = false;
      if (!inBounds(nx, nz)) {
        if (d === 1 && z === GRID_SIZE - 1 && t.roadGround === 3) c = true;
      } else {
        const ni = idx(nx, nz);
        const nt = grid[ni];
        if (nt.roadGround >= 1 && nt.roadGround <= 4 && !nt.dam && !nt.ramp) {
          c = true;
        } else if (nt.ramp) {
          const nrm = rampMeta.get(ni);
          if (nrm) {
            if (hasRampGroundDeck(nt, nrm)) {
              if (d === nrm.highDir || d === nrm.lowDir || nrm.lowDir === DIRS[d].opp || nrm.highDir === DIRS[d].opp) c = true;
            } else if (nrm.lowDir === DIRS[d].opp && nrm.lowFrac < 0.001) {
              c = true;
            }
          }
        }
      }
      if (c) {
        if (d < 2) ns = true;
        else ew = true;
      }
    }
    return { ns, ew };
  };

  const evalElevConnFlags = (x, z) => {
    let ns = false, ew = false;
    for (let d = 0; d < 4; d++) {
      const nx = x + DIRS[d].dx;
      const nz = z + DIRS[d].dz;
      if (!inBounds(nx, nz)) continue;
      const ni = idx(nx, nz);
      const nt = grid[ni];
      let c = false;
      if (nt.roadElevated > 0 && !nt.ramp) {
        c = true;
      } else if (nt.ramp) {
        const nrm = rampMeta.get(ni);
        if (nrm) {
          if (nrm.throughElev && (d === nrm.highDir || d === nrm.lowDir)) c = true;
          else if (nrm.highDir === DIRS[d].opp && nrm.highFrac > 0.999) c = true;
        }
      }
      if (c) {
        if (d < 2) ns = true;
        else ew = true;
      }
    }
    return { ns, ew };
  };

  const isGroundCableCand = (x, z, wantEW) => {
    if (!isSurfRoadTile(x, z)) return false;
    const i = idx(x, z);
    const t = grid[i];
    if (t.roadGround < 2 || !t.roadBridge || waterDepth[i] <= 0.08 || t.ramp || t.dam || t.roadElevated > 0) return false;
    const { ns, ew } = evalGroundConnFlags(x, z);
    return wantEW ? (ew && !ns) : (ns && !ew);
  };

  const isElevCableCand = (x, z, wantEW) => {
    const i = idx(x, z);
    const t = grid[i];
    if (!(t.roadElevated > 0) || t.ramp || t.dam || waterDepth[i] <= 0.12) return false;
    const { ns, ew } = evalElevConnFlags(x, z);
    return wantEW ? (ew && !ns) : (ns && !ew);
  };

  const emitCableStayedSpan = (orgX, orgZ, fx, fz, L, heightGrid, soffThick, isElev) => {
    const sx = fz;
    const sz = -fx;
    const towerH = 2.05;
    const sTowers = L <= 4 ? [L * 0.5] : [L * 0.25, L * 0.75];

    // 1. Continuous variable-depth concrete box-girder haunch spine ribs & transverse diaphragms under span
    const HSEG = L * 2;
    const evalHaunchDepth = (sVal) => {
      let minDist = L;
      for (let k = 0; k < sTowers.length; k++) {
        const d = Math.abs(sVal - sTowers[k]);
        if (d < minDist) minDist = d;
      }
      return 0.085 + 0.135 * Math.exp(-minDist * 1.15);
    };

    for (let m = 0; m < HSEG; m++) {
      const sA = (m / HSEG) * L;
      const sB = ((m + 1) / HSEG) * L;
      const ax = orgX + fx * sA, az = orgZ + fz * sA;
      const bx = orgX + fx * sB, bz = orgZ + fz * sB;
      const ySoffA = sampleCornerGrid(heightGrid, ax, az) - soffThick + 0.008;
      const ySoffB = sampleCornerGrid(heightGrid, bx, bz) - soffThick + 0.008;
      const dA = evalHaunchDepth(sA);
      const dB = evalHaunchDepth(sB);

      for (const ribSign of [-1, 1]) {
        const uOff = 0.27 * ribSign;
        addHaunchWeb(
          ax + sx * uOff, az + sz * uOff, ySoffA, ySoffA - dA,
          bx + sx * uOff, bz + sz * uOff, ySoffB, ySoffB - dB,
          0.044, sx, sz,
          cGirder[0], cGirder[1], cGirder[2]
        );
      }

      // Transverse floor-beam diaphragm rib every 1.0m along the span
      if (m % 2 === 1 && m < HSEG - 1) {
        const dRib = dB * 0.85;
        bConcrete.addBeam(
          bx - sx * 0.43, bz - sz * 0.43, ySoffB, ySoffB,
          bx + sx * 0.43, bz + sz * 0.43, ySoffB, ySoffB,
          0.034, 0.0, dRib, true, true, true,
          cGirder[0], cGirder[1], cGirder[2]
        );
      }
    }

    // 2. Sleek A-Frame / Diamond White-Concrete Pylon Towers + Fan Stay Cables
    const hAnchors = [1.05, 1.33, 1.62, 1.90];
    for (let tIdx = 0; tIdx < sTowers.length; tIdx++) {
      const sT = sTowers[tIdx];
      const tx = orgX + fx * sT;
      const tz = orgZ + fz * sT;
      const deckY = sampleCornerGrid(heightGrid, tx, tz);
      const bedY = sampleCornerGrid(corners, tx, tz) - 0.22;
      const soffY = deckY - soffThick;

      // Record footprint on both flanks so streetlamps never collide with tower legs
      pylonFootprints.push(
        { x: tx - sx * 0.49, z: tz - sz * 0.49, isElev },
        { x: tx + sx * 0.49, z: tz + sz * 0.49, isElev }
      );

      // Underwater / sub-deck tapered pylon foundation legs (±0.52m at riverbed -> ±0.49m at deck)
      for (const sideSign of [-1, 1]) {
        addPylonSegment(
          tx + sx * (0.52 * sideSign), bedY, tz + sz * (0.52 * sideSign), 0.105, 0.082,
          tx + sx * (0.49 * sideSign), deckY + 0.01, tz + sz * (0.49 * sideSign), 0.068, 0.052,
          fx, fz, sx, sz,
          cPier[0], cPier[1], cPier[2], false
        );
      }

      // Sub-deck pier-table crosshead girder cradling the box-girder soffit
      bConcrete.addBeam(
        tx - sx * 0.56, tz - sz * 0.56, soffY + 0.01, soffY + 0.01,
        tx + sx * 0.56, tz + sz * 0.56, soffY + 0.01, soffY + 0.01,
        0.082, 0.0, 0.18, true, true, true,
        cGirder[0], cGirder[1], cGirder[2]
      );

      // Above-deck A-Frame white-concrete legs (±0.49m at deck angling inward to ±0.26m at deckY + 2.05m!)
      for (const sideSign of [-1, 1]) {
        addPylonSegment(
          tx + sx * (0.49 * sideSign), deckY, tz + sz * (0.49 * sideSign), 0.064, 0.048,
          tx + sx * (0.26 * sideSign), deckY + towerH, tz + sz * (0.26 * sideSign), 0.044, 0.036,
          fx, fz, sx, sz,
          cPylon[0], cPylon[1], cPylon[2], true
        );
        // Subtle architectural pinnacle spire cap above towerH
        addPylonSegment(
          tx + sx * (0.26 * sideSign), deckY + towerH, tz + sz * (0.26 * sideSign), 0.038, 0.032,
          tx + sx * (0.245 * sideSign), deckY + towerH + 0.15, tz + sz * (0.245 * sideSign), 0.020, 0.018,
          fx, fz, sx, sz,
          cPylon[0], cPylon[1], cPylon[2], true
        );
      }

      // Mid-upper & upper architectural concrete portal cross-beams + crown coping
      const uMid = 0.49 + (0.26 - 0.49) * (1.22 / towerH);
      bConcrete.addBeam(
        tx - sx * uMid, tz - sz * uMid, deckY + 1.22, deckY + 1.22,
        tx + sx * uMid, tz + sz * uMid, deckY + 1.22, deckY + 1.22,
        0.036, 0.040, 0.040, false, false, true,
        cPylon[0], cPylon[1], cPylon[2]
      );
      const uTop = 0.49 + (0.26 - 0.49) * (1.92 / towerH);
      bConcrete.addBeam(
        tx - sx * (uTop + 0.03), tz - sz * (uTop + 0.03), deckY + 1.92, deckY + 1.92,
        tx + sx * (uTop + 0.03), tz + sz * (uTop + 0.03), deckY + 1.92, deckY + 1.92,
        0.042, 0.052, 0.048, true, true, true,
        cPylon[0], cPylon[1], cPylon[2]
      );

      // 3. Taut Diagonal Harp/Fan Stay Cables (4 pairs per side, clamped strictly inside [0.12, L - 0.12])
      for (const dirSign of [-1, 1]) {
        const distToEnd = dirSign < 0 ? (sT - 0.12) : ((L - 0.12) - sT);
        const isInnerSpan = (sTowers.length === 2) && ((tIdx === 0 && dirSign > 0) || (tIdx === 1 && dirSign < 0));
        const maxReach = Math.min(2.20, distToEnd, isInnerSpan ? (L * 0.235) : 2.20);
        if (maxReach < 0.35) continue;

        for (let c = 0; c < 4; c++) {
          const hA = hAnchors[c];
          const uLeg = 0.49 + (0.26 - 0.49) * (hA / towerH);
          const reach = maxReach * ((c + 1) / 4);
          const sDeck = Math.min(L - 0.12, Math.max(0.12, sT + dirSign * reach));
          if (Math.abs(sDeck - sT) < 0.20) continue;

          const dCx = orgX + fx * sDeck;
          const dCz = orgZ + fz * sDeck;

          for (const flankSign of [-1, 1]) {
            const ax = tx + sx * (uLeg * flankSign);
            const az = tz + sz * (uLeg * flankSign);
            const ay = deckY + hA;

            const bx = dCx + sx * (0.475 * flankSign);
            const bz = dCz + sz * (0.475 * flankSign);
            const by = sampleCornerGrid(heightGrid, bx, bz) + 0.056;

            bSteel.addBeam(
              ax, az, ay, ay,
              bx, bz, by, by,
              0.011, 0.010, 0.010, false, false, true
            );
          }
        }
      }
    }
  };

  // Scan N-S & E-W qualifying spans (L >= 3) for Ground 4-Lane Bridges & Elevated Water Viaducts
  for (let passElev = 0; passElev <= 1; passElev++) {
    const isElev = passElev === 1;
    const candFn = isElev ? isElevCableCand : isGroundCableCand;
    const spanMask = isElev ? elevCableSpanMask : groundCableSpanMask;
    const hGrid = isElev ? elevCornerY : roadCornerY;
    const soffT = isElev ? 0.082 : 0.085;

    // N-S straight spans along columns x
    for (let x = 0; x < GRID_SIZE; x++) {
      let z = 0;
      while (z < GRID_SIZE) {
        if (!candFn(x, z, false)) { z++; continue; }
        const zStart = z;
        while (z < GRID_SIZE && candFn(x, z, false)) z++;
        const L = z - zStart;
        if (L >= 3) {
          for (let kz = zStart; kz < z; kz++) spanMask[idx(x, kz)] = 1;
          emitCableStayedSpan(x - HALF_GRID + 0.5, zStart - HALF_GRID, 0, 1, L, hGrid, soffT, isElev);
        }
      }
    }

    // E-W straight spans along rows z
    for (let z = 0; z < GRID_SIZE; z++) {
      let x = 0;
      while (x < GRID_SIZE) {
        if (!candFn(x, z, true)) { x++; continue; }
        const xStart = x;
        while (x < GRID_SIZE && candFn(x, z, true)) x++;
        const L = x - xStart;
        if (L >= 3) {
          for (let kx = xStart; kx < x; kx++) spanMask[idx(kx, z)] = 1;
          emitCableStayedSpan(xStart - HALF_GRID, z - HALF_GRID + 0.5, 1, 0, L, hGrid, soffT, isElev);
        }
      }
    }
  }

  // --- LAYER A: Ground Roads & River Bridges (t.roadGround === 1, 2, 3 + throughGround / mid_slip ramps) ---
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!isSurfRoadTile(x, z)) continue;
      const i = idx(x, z);
      const t = grid[i];
      const rmSelf = t.ramp ? rampMeta.get(i) : null;

      const x0 = x - HALF_GRID;
      const x1 = x0 + 1;
      const z0 = z - HALF_GRID;
      const z1 = z0 + 1;

      const y00 = roadCornerY[cIdx(x, z)];
      const y10 = roadCornerY[cIdx(x + 1, z)];
      const y01 = roadCornerY[cIdx(x, z + 1)];
      const y11 = roadCornerY[cIdx(x + 1, z + 1)];

      const conn = [false, false, false, false];
      for (let d = 0; d < 4; d++) {
        const nx = x + DIRS[d].dx;
        const nz = z + DIRS[d].dz;
        if (!inBounds(nx, nz)) {
          // Highway south border portal continues cleanly to map edge
          if (d === 1 && z === GRID_SIZE - 1 && t.roadGround === 3) conn[d] = true;
          continue;
        }
        const ni = idx(nx, nz);
        const nt = grid[ni];
        if (nt.roadGround >= 1 && nt.roadGround <= 4 && !nt.dam && !nt.ramp) {
          conn[d] = true;
        } else if (nt.ramp) {
          const nrm = rampMeta.get(ni);
          if (nrm) {
            if (hasRampGroundDeck(nt, nrm)) {
              // Continuous ground avenue through median_split / mid_slip ramp on BOTH highDir & lowDir!
              if (d === nrm.highDir || d === nrm.lowDir || nrm.lowDir === DIRS[d].opp || nrm.highDir === DIRS[d].opp) {
                conn[d] = true;
              }
            } else if (nrm.lowDir === DIRS[d].opp && nrm.lowFrac < 0.001) {
              conn[d] = true;
            }
          }
        }
      }

      // On a ramp tile, transverse side roads do not cross through the ramp barriers unless throughGround is perpendicular
      if (rmSelf) {
        conn[LEFT_DIR[rmSelf.highDir]] = false;
        conn[RIGHT_DIR[rmSelf.highDir]] = false;
      }

      const hasNS = conn[0] || conn[1];
      const hasEW = conn[2] || conn[3];
      const connCount = (conn[0] ? 1 : 0) + (conn[1] ? 1 : 0) + (conn[2] ? 1 : 0) + (conn[3] ? 1 : 0);
      const isJunctionOrTurn = !rmSelf && (connCount >= 3 || (hasNS && hasEW));
      const uvMode = isJunctionOrTurn
        ? 'HUB'
        : (rmSelf ? ((rmSelf.highDir === 2 || rmSelf.highDir === 3) ? 'EW' : 'NS') : (hasEW ? 'EW' : 'NS'));

      // Emit 3x3 bilinear sub-grid welded road deck (matches 3x3 terrain so zero grass pokes through!)
      const isAvenueClass = t.roadGround >= 2 || Boolean(rmSelf && hasRampGroundDeck(t, rmSelf));
      if (isTrafficOverlay) {
        const [tr, tg, tb] = trafficColorFor(t.congestion || 0);
        bTraffic.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 3, uvMode, true, tr, tg, tb);
      } else if (isJunctionOrTurn) {
        bRoadHub.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 3, 'HUB', true);
      } else if (isAvenueClass) {
        bRoad4.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 3, uvMode, stripesV4);
      } else {
        bRoad2.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 3, uvMode, stripesV2);
      }

      const avgDeckY = (y00 + y10 + y01 + y11) * 0.25;
      const isWaterBridge = (Boolean(t.roadBridge) && waterDepth[i] > 0.08) || (avgDeckY - cellElev[i] > 0.14);

      // Flared auxiliary ground split-lane wings around median_split (±0.64) & mid_slip (±0.90 parallel merge strips)
      const suppressCurbDir = [false, false, false, false];
      if (rmSelf && hasRampGroundDeck(t, rmSelf)) {
        const hd = rmSelf.highDir;
        const ld = rmSelf.lowDir;
        let lLX, lLZ, lRX, lRZ, hLX, hLZ;
        if (hd === 0) {
          lLX = x0; lLZ = z1; lRX = x1; lRZ = z1; hLX = x0; hLZ = z0;
        } else if (hd === 1) {
          lLX = x1; lLZ = z0; lRX = x0; lRZ = z0; hLX = x1; hLZ = z1;
        } else if (hd === 2) {
          lLX = x1; lLZ = z1; lRX = x1; lRZ = z0; hLX = x0; hLZ = z1;
        } else {
          lLX = x0; lLZ = z0; lRX = x0; lRZ = z1; hLX = x1; hLZ = z0;
        }
        const fx = hLX - lLX, fz = hLZ - lLZ;
        const rx = lRX - lLX, rz = lRZ - lLZ;
        const wingBatch = isTrafficOverlay ? bTraffic : bRoad4;
        const [wr, wg, wb] = isTrafficOverlay ? trafficColorFor(t.congestion || 0) : [1, 1, 1];
        const ptAt = (s, u) => {
          const wx = lLX + fx * s + rx * u;
          const wz = lLZ + fz * s + rz * u;
          const yWorld = sampleCornerGrid(roadCornerY, wx, wz);
          if (u >= 0 && u <= 1) {
            return [wx, yWorld + 0.002, wz];
          }
          const uClamped = clamp01(u);
          const yBase = sampleCornerGrid(roadCornerY, lLX + fx * s + rx * uClamped, lLZ + fz * s + rz * uClamped);
          return [wx, Math.max(yBase, yWorld) + 0.002, wz];
        };

        const emitFlankWing = (isRight, flareW, sideDir) => {
          suppressCurbDir[sideDir] = true;
          const uIn = isRight ? 1.0 : -flareW;
          const uOut = isRight ? 1.0 + flareW : 0.0;
          const A = ptAt(1, uIn), B = ptAt(0, uIn), C = ptAt(0, uOut), D = ptAt(1, uOut);
          wingBatch.addQuad(
            A[0], A[1], A[2], B[0], B[1], B[2], C[0], C[1], C[2], D[0], D[1], D[2],
            0.05, 0, 0.05, 1, 0.22, 1, 0.22, 0, wr, wg, wb
          );

          const uEdge = isRight ? 1.0 + flareW : -flareW;
          const E0 = ptAt(0, uEdge), E1 = ptAt(1, uEdge);
          bConcrete.addBeam(
            E0[0], E0[2], E0[1], E0[1], E1[0], E1[2], E1[1], E1[1],
            0.020, 0.010, 0.095, false, false, false,
            cCurb[0], cCurb[1], cCurb[2]
          );

          // Diagonal asphalt & curb tapers onto nLow (at chain start) & nHigh (at chain end)
          const tLen = 0.38;
          const uBase = isRight ? 1.0 : 0.0;
          if (rmSelf.lowFrac < 0.001) {
            const TIn0 = ptAt(0, uBase), TOut0 = ptAt(0, uEdge);
            if (hasGroundFlareTaperInto(x, z, ld, sideDir)) {
              const TTipIn = ptAt(-tLen, isRight ? 0.98 : 0.02);
              const TTipOut = ptAt(-tLen, uBase);
              if (isRight) {
                wingBatch.addQuad(
                  TIn0[0], TIn0[1], TIn0[2], TTipIn[0], TTipIn[1], TTipIn[2],
                  TTipOut[0], TTipOut[1], TTipOut[2], TOut0[0], TOut0[1], TOut0[2],
                  0.05, 0, 0.05, 0.4, 0.2, 0.4, 0.2, 0, wr, wg, wb
                );
              } else {
                wingBatch.addQuad(
                  TOut0[0], TOut0[1], TOut0[2], TTipOut[0], TTipOut[1], TTipOut[2],
                  TTipIn[0], TTipIn[1], TTipIn[2], TIn0[0], TIn0[1], TIn0[2],
                  0.05, 0, 0.05, 0.4, 0.2, 0.4, 0.2, 0, wr, wg, wb
                );
              }
              const diagSideRoad = isSurfRoadTile(x + DIRS[ld].dx + DIRS[sideDir].dx, z + DIRS[ld].dz + DIRS[sideDir].dz);
              if (!diagSideRoad) {
                bConcrete.addBeam(
                  TTipOut[0], TTipOut[2], TTipOut[1], TTipOut[1], TOut0[0], TOut0[2], TOut0[1], TOut0[1],
                  0.020, 0.010, 0.090, false, false, false, cCurb[0], cCurb[1], cCurb[2]
                );
              }
            } else {
              bConcrete.addBeam(
                TIn0[0], TIn0[2], TIn0[1], TIn0[1], TOut0[0], TOut0[2], TOut0[1], TOut0[1],
                0.020, 0.010, 0.090, true, true, false, cCurb[0], cCurb[1], cCurb[2]
              );
            }
          }
          if (rmSelf.highFrac > 0.999) {
            const TIn1 = ptAt(1, uBase), TOut1 = ptAt(1, uEdge);
            if (hasGroundFlareTaperInto(x, z, hd, sideDir)) {
              const TTipIn = ptAt(1 + tLen, isRight ? 0.98 : 0.02);
              const TTipOut = ptAt(1 + tLen, uBase);
              if (isRight) {
                wingBatch.addQuad(
                  TTipIn[0], TTipIn[1], TTipIn[2], TIn1[0], TIn1[1], TIn1[2],
                  TOut1[0], TOut1[1], TOut1[2], TTipOut[0], TTipOut[1], TTipOut[2],
                  0.05, 0, 0.05, 0.4, 0.2, 0.4, 0.2, 0, wr, wg, wb
                );
              } else {
                wingBatch.addQuad(
                  TTipOut[0], TTipOut[1], TTipOut[2], TOut1[0], TOut1[1], TOut1[2],
                  TIn1[0], TIn1[1], TIn1[2], TTipIn[0], TTipIn[1], TTipIn[2],
                  0.05, 0, 0.05, 0.4, 0.2, 0.4, 0.2, 0, wr, wg, wb
                );
              }
              const diagSideRoad = isSurfRoadTile(x + DIRS[hd].dx + DIRS[sideDir].dx, z + DIRS[hd].dz + DIRS[sideDir].dz);
              if (!diagSideRoad) {
                bConcrete.addBeam(
                  TOut1[0], TOut1[2], TOut1[1], TOut1[1], TTipOut[0], TTipOut[2], TTipOut[1], TTipOut[1],
                  0.020, 0.010, 0.090, false, false, false, cCurb[0], cCurb[1], cCurb[2]
                );
              }
            } else {
              bConcrete.addBeam(
                TOut1[0], TOut1[2], TOut1[1], TOut1[1], TIn1[0], TIn1[2], TIn1[1], TIn1[1],
                0.020, 0.010, 0.090, true, true, false, cCurb[0], cCurb[1], cCurb[2]
              );
            }
          }
        };

        if (rmSelf.mode === 'median_split') {
          // ±0.64m total half-width (+0.14m auxiliary wings on BOTH flanks so ±0.39 outer lanes pass cleanly!)
          emitFlankWing(false, 0.14, LEFT_DIR[hd]);
          emitFlankWing(true, 0.14, RIGHT_DIR[hd]);
        } else if (rmSelf.mode === 'mid_slip') {
          // ±0.90m widened ground merge strips beneath BOTH symmetric parallel side slip-ramps!
          emitFlankWing(false, 0.40, LEFT_DIR[hd]);
          emitFlankWing(true, 0.40, RIGHT_DIR[hd]);
        }
      }

      // 3D Roundabout Central Island & Yield Intersection Approach Markings (deg >= 3, non-dam, non-ramp)
      if (!rmSelf && connCount >= 3) {
        const jMode = t.junctionMode || 'signal';
        const wx = x0 + 0.5;
        const wz = z0 + 0.5;

        if (jMode === 'roundabout') {
          // Outer painted circulatory apron ring
          bConcrete.addCappedCylinder(
            wx, wz, avgDeckY - 0.005, avgDeckY + 0.006, 0.258, 0.255, 0.0, 18,
            toCol(0.89), toCol(0.90), toCol(0.91)
          );
          // Circular stone/concrete curb ring (radius 0.22, height 0.055)
          bConcrete.addCappedCylinder(
            wx, wz, avgDeckY - 0.015, avgDeckY + 0.055, 0.224, 0.220, 0.002, 18,
            cParapet[0], cParapet[1], cParapet[2]
          );
          // Lush emerald green landscaped planter mound (0x2f8544, radius 0.17) + central topiary crown
          bConcrete.addCappedCylinder(
            wx, wz, avgDeckY + 0.050, avgDeckY + 0.068, 0.172, 0.170, 0.032, 18,
            toCol(0x2f / 255), toCol(0x85 / 255), toCol(0x44 / 255)
          );
          bConcrete.addCappedCylinder(
            wx, wz, avgDeckY + 0.092, avgDeckY + 0.118, 0.056, 0.048, 0.024, 12,
            toCol(0.13), toCol(0.42), toCol(0.21)
          );
        } else if (jMode === 'yield') {
          // Identify minor yielding road approaches vs priority main-road approaches
          const nbClass = [0, 0, 0, 0];
          let hasAvenue = false;
          let hasStreet = false;
          for (let d = 0; d < 4; d++) {
            if (!conn[d]) continue;
            const nx = x + DIRS[d].dx;
            const nz = z + DIRS[d].dz;
            const cls = inBounds(nx, nz) && grid[idx(nx, nz)].roadGround >= 2 ? 2 : 1;
            nbClass[d] = cls;
            if (cls >= 2) hasAvenue = true;
            else hasStreet = true;
          }

          const yieldDirs = [false, false, false, false];
          if (hasAvenue && hasStreet) {
            for (let d = 0; d < 4; d++) {
              if (conn[d] && nbClass[d] === 1) yieldDirs[d] = true;
            }
          } else if (connCount === 3) {
            // T-junction: perpendicular branch yields to straight through-road
            if (conn[0] && conn[1]) {
              if (conn[2]) yieldDirs[2] = true;
              if (conn[3]) yieldDirs[3] = true;
            } else if (conn[2] && conn[3]) {
              if (conn[0]) yieldDirs[0] = true;
              if (conn[1]) yieldDirs[1] = true;
            }
          } else {
            // Equal-class 4-way crossroads: East-West approaches yield to North-South priority road
            yieldDirs[2] = conn[2];
            yieldDirs[3] = conn[3];
          }

          const mR = toCol(0.95), mG = toCol(0.96), mB = toCol(0.97);
          for (let d = 0; d < 4; d++) {
            if (!yieldDirs[d]) continue;
            const e = getTileEdgeEndpoints(x, z, d, roadCornerY);
            const inX = -DIRS[d].dx;
            const inZ = -DIRS[d].dz;
            const ex = e.p1x - e.p0x;
            const ez = e.p1z - e.p0z;

            // 3 crisp dashed white yield / give-way pavement bars set slightly inside minor approach
            for (const s of [0.22, 0.50, 0.78]) {
              const s0 = s - 0.075;
              const s1 = s + 0.075;
              const py0 = e.y0 + (e.y1 - e.y0) * s0 + 0.006;
              const py1 = e.y0 + (e.y1 - e.y0) * s1 + 0.006;
              const ax = e.p0x + ex * s0 + inX * 0.07;
              const az = e.p0z + ez * s0 + inZ * 0.07;
              const bx = e.p0x + ex * s1 + inX * 0.07;
              const bz = e.p0z + ez * s1 + inZ * 0.07;
              bConcrete.addBeam(
                ax, az, py0, py0, bx, bz, py1, py1,
                0.026, 0.003, 0.002, true, true, false,
                mR, mG, mB
              );
            }
          }
        } else if (jMode === 'signal') {
          // 2 diagonally opposite cantilever traffic light poles on ±0.44m sidewalk corners (NS & EW)
          const sx1 = wx + 0.44, sz1 = wz - 0.44;
          const sx2 = wx - 0.44, sz2 = wz + 0.44;
          signals.push(
            { x: sx1, y: sampleCornerGrid(roadCornerY, sx1, sz1), z: sz1, tx: x, tz: z, axis: 'NS', yaw: 0 },
            { x: sx2, y: sampleCornerGrid(roadCornerY, sx2, sz2), z: sz2, tx: x, tz: z, axis: 'EW', yaw: -Math.PI * 0.5 }
          );
        }
      }

      // Exact-height LED streetlamps along non-junction straight 4-lane avenues & river bridges (every 2 tiles)
      if (!rmSelf && !isJunctionOrTurn && (t.roadGround >= 2 || isWaterBridge) && ((x + z) % 2 === 0)) {
        const cx = x0 + 0.5;
        const cz = z0 + 0.5;
        const lampSides = isWaterBridge ? [-1, 1] : [(((x + z) >> 1) & 1) ? 1 : -1];
        const runEW = hasEW && !hasNS;

        for (let sIdx = 0; sIdx < lampSides.length; sIdx++) {
          const side = lampSides[sIdx];
          if (runEW) {
            const sideDir = side < 0 ? 0 : 1;
            if (conn[sideDir]) continue;
            if (hasGroundFlareTaperInto(x - 1, z, 3, sideDir) || hasGroundFlareTaperInto(x + 1, z, 2, sideDir)) continue;
            const lx = cx;
            const lz = cz + side * 0.46;
            if (pylonFootprints.some((p) => !p.isElev && Math.hypot(p.x - lx, p.z - lz) < 0.42)) continue;
            lamps.push({
              x: lx,
              y: sampleCornerGrid(roadCornerY, lx, lz),
              z: lz,
              yaw: side > 0 ? Math.PI : 0,
              isElev: false
            });
          } else {
            const sideDir = side < 0 ? 2 : 3;
            if (conn[sideDir]) continue;
            if (hasGroundFlareTaperInto(x, z - 1, 1, sideDir) || hasGroundFlareTaperInto(x, z + 1, 0, sideDir)) continue;
            const lx = cx + side * 0.46;
            const lz = cz;
            if (pylonFootprints.some((p) => !p.isElev && Math.hypot(p.x - lx, p.z - lz) < 0.42)) continue;
            lamps.push({
              x: lx,
              y: sampleCornerGrid(roadCornerY, lx, lz),
              z: lz,
              yaw: side > 0 ? -Math.PI * 0.5 : Math.PI * 0.5,
              isElev: false
            });
          }
        }
      }

      // 1. One-Way Street Directional Pavement Chevron Arrow (t.roadDir in 0..3, flush on roadCornerY + 0.014)
      if (t.roadGround >= 1 && t.roadGround !== 4 && !t.dam && typeof t.roadDir === 'number' && t.roadDir >= 0 && t.roadDir <= 3) {
        const cx = x0 + 0.5;
        const cz = z0 + 0.5;
        const fx = DIRS[t.roadDir].dx;
        const fz = DIRS[t.roadDir].dz;
        const rx = -fz;
        const rz = fx;
        // Shaft + swept-back chevron arrowhead centered on tile
        addRoadDecalQuad(cx, cz, fx, fz, rx, rz, -0.30, 0.09, -0.052, 0.052, 0.014, cArrowWhite[0], cArrowWhite[1], cArrowWhite[2]);
        addRoadDecalTri(cx, cz, fx, fz, rx, rz, 0.32, 0.0, 0.00, -0.195, 0.08, 0.0, 0.014, cArrowWhite[0], cArrowWhite[1], cArrowWhite[2]);
        addRoadDecalTri(cx, cz, fx, fz, rx, rz, 0.32, 0.0, 0.08, 0.0, 0.00, 0.195, 0.014, cArrowWhite[0], cArrowWhite[1], cArrowWhite[2]);
      }

      // 2. Heavy-Truck Ban Curb Restriction Dashes (t.banTrucks === true, flush on roadCornerY + 0.013 at ±0.34m)
      if (t.banTrucks === true && t.roadGround >= 1 && t.roadGround !== 4 && !t.dam) {
        const cx = x0 + 0.5;
        const cz = z0 + 0.5;
        if (!isJunctionOrTurn) {
          const runEW = hasEW ? !hasNS : (t.roadDir === 2 || t.roadDir === 3);
          const fx = runEW ? 1 : 0;
          const fz = runEW ? 0 : 1;
          const rx = -fz;
          const rz = fx;
          const dashSpans = [[-0.44, -0.22], [-0.11, 0.11], [0.22, 0.44]];
          for (const side of [-1, 1]) {
            const u0 = side * 0.34 - 0.022;
            const u1 = side * 0.34 + 0.022;
            for (let di = 0; di < dashSpans.length; di++) {
              const cDash = (di === 1) ? cBanAmber : cBanCrimson;
              addRoadDecalQuad(cx, cz, fx, fz, rx, rz, dashSpans[di][0], dashSpans[di][1], u0, u1, 0.013, cDash[0], cDash[1], cDash[2]);
            }
          }
        } else if (connCount < 4) {
          for (let d = 0; d < 4; d++) {
            if (conn[d]) continue;
            const outX = DIRS[d].dx;
            const outZ = DIRS[d].dz;
            const efx = -outZ;
            const efz = outX;
            const erx = -outX;
            const erz = -outZ;
            addRoadDecalQuad(cx, cz, efx, efz, erx, erz, -0.31, -0.06, -0.362, -0.318, 0.013, cBanCrimson[0], cBanCrimson[1], cBanCrimson[2]);
            addRoadDecalQuad(cx, cz, efx, efz, erx, erz, 0.06, 0.31, -0.362, -0.318, 0.013, cBanAmber[0], cBanAmber[1], cBanAmber[2]);
          }
        } else {
          // 4-way crossroads: compact crimson-amber L-curb ticks around all 4 sidewalk corners (±0.34m)
          for (const sx of [-1, 1]) {
            for (const sz of [-1, 1]) {
              const xs0 = sx > 0 ? 0.32 : -0.45;
              const xs1 = sx > 0 ? 0.45 : -0.32;
              const zu0 = sz * 0.34 - 0.022;
              const zu1 = sz * 0.34 + 0.022;
              addRoadDecalQuad(cx, cz, 1, 0, 0, 1, xs0, xs1, zu0, zu1, 0.013, cBanCrimson[0], cBanCrimson[1], cBanCrimson[2]);

              const zs0 = sx * 0.34 - 0.022;
              const zs1 = sx * 0.34 + 0.022;
              const xu0 = sz > 0 ? 0.32 : -0.45;
              const xu1 = sz > 0 ? 0.45 : -0.32;
              addRoadDecalQuad(cx, cz, 1, 0, 0, 1, zs0, zs1, xu0, xu1, 0.013, cBanAmber[0], cBanAmber[1], cBanAmber[2]);
            }
          }
        }
      }

      // 3. Bus Stop Curb Bay Outline (0.64m x 0.16m golden-yellow at roadCornerY + 0.014) & Exact-Height Shelter Placement
      if (t.busStop === true && t.roadGround >= 1 && t.roadGround !== 4 && !t.dam && !t.ramp) {
        const cx = x0 + 0.5;
        const cz = z0 + 0.5;
        let candOrder;
        if (typeof t.roadDir === 'number' && t.roadDir >= 0 && t.roadDir <= 3) {
          candOrder = [RIGHT_DIR[t.roadDir], LEFT_DIR[t.roadDir], t.roadDir, DIRS[t.roadDir].opp];
        } else if (hasEW && !hasNS) {
          candOrder = [1, 0, 3, 2];
        } else if (hasNS && !hasEW) {
          candOrder = [3, 2, 1, 0];
        } else {
          candOrder = [1, 3, 0, 2];
        }

        let busEdgeDir = -1;
        let fallbackDir = -1;
        for (let k = 0; k < 4; k++) {
          const d = candOrder[k];
          if (conn[d]) continue;
          if (fallbackDir < 0) fallbackDir = d;
          const testX = cx + DIRS[d].dx * 0.45;
          const testZ = cz + DIRS[d].dz * 0.45;
          let blocked = false;
          for (let li = lamps.length - 1; li >= Math.max(0, lamps.length - 4); li--) {
            const lp = lamps[li];
            if (!lp.isElev && Math.hypot(lp.x - testX, lp.z - testZ) < 0.25) {
              blocked = true;
              break;
            }
          }
          if (!blocked && pylonFootprints.some((p) => !p.isElev && Math.hypot(p.x - testX, p.z - testZ) < 0.38)) {
            blocked = true;
          }
          if (!blocked) {
            busEdgeDir = d;
            break;
          }
        }
        if (busEdgeDir < 0) busEdgeDir = fallbackDir;

        if (busEdgeDir >= 0) {
          const outX = DIRS[busEdgeDir].dx;
          const outZ = DIRS[busEdgeDir].dz;
          const inwardX = -outX;
          const inwardZ = -outZ;

          // Emit exact-height shelter anchor on outer sidewalk curb (±0.45m) facing road centerline
          const bx = cx + outX * 0.45;
          const bz = cz + outZ * 0.45;
          const by = sampleCornerGrid(roadCornerY, bx, bz);
          const yaw = Math.atan2(inwardX, inwardZ);
          busStops.push({ x: bx, y: by, z: bz, tx: x, tz: z, yaw });

          // Golden-yellow rectangular curb bus-bay outline (0.64m x 0.16m) flush at roadCornerY + 0.014
          const bfx = -outZ;
          const bfz = outX;
          const brx = inwardX;
          const brz = inwardZ;
          const bw = 0.026;
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, -0.32, 0.32, -0.38, -0.38 + bw, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, -0.32, 0.32, -0.22 - bw, -0.22, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, -0.32, -0.32 + bw, -0.38 + bw, -0.22 - bw, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, 0.32 - bw, 0.32, -0.38 + bw, -0.22 - bw, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, -0.18, -0.04, -0.312, -0.288, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
          addRoadDecalQuad(cx, cz, bfx, bfz, brx, brz, 0.04, 0.18, -0.312, -0.288, 0.014, cBusGold[0], cBusGold[1], cBusGold[2]);
        }
      }

      // Continuous side curb skirts (0.085m deep) & bridge parapets along non-connected edges
      // Trim 0.38m where adjacent median_split / mid_slip diagonal flare tapers merge into nLow / nHigh!
      for (let d = 0; d < 4; d++) {
        if (conn[d] || suppressCurbDir[d]) continue;
        const e = getTileEdgeEndpoints(x, z, d, roadCornerY);
        const inset = 0.022;
        const dx = e.p1x - e.p0x;
        const dz = e.p1z - e.p0z;
        // Pull inward by inset along left vector (dz, -dx) so outer face sits flush on tile boundary!
        const p0x = e.p0x + dz * inset;
        const p0z = e.p0z - dx * inset;
        const p1x = e.p1x + dz * inset;
        const p1z = e.p1z - dx * inset;

        let s0 = 0.0;
        let s1 = 1.0;
        if (!rmSelf) {
          const d0 = LEFT_DIR[d];
          const d1 = RIGHT_DIR[d];
          if (hasGroundFlareTaperInto(x + DIRS[d0].dx, z + DIRS[d0].dz, DIRS[d0].opp, d)) s0 = 0.38;
          if (hasGroundFlareTaperInto(x + DIRS[d1].dx, z + DIRS[d1].dz, DIRS[d1].opp, d)) s1 = 0.62;
        }
        if (s1 - s0 <= 0.02) continue;

        const q0x = p0x + (p1x - p0x) * s0;
        const q0z = p0z + (p1z - p0z) * s0;
        const q1x = p0x + (p1x - p0x) * s1;
        const q1z = p0z + (p1z - p0z) * s1;
        const q0y = e.y0 + (e.y1 - e.y0) * s0;
        const q1y = e.y0 + (e.y1 - e.y0) * s1;

        if (isWaterBridge) {
          bConcrete.addBeam(
            q0x, q0z, q0y, q0y, q1x, q1z, q1y, q1y,
            0.024, 0.068, 0.095, s0 > 0, s1 < 1, true,
            cParapet[0], cParapet[1], cParapet[2]
          );
        } else {
          bConcrete.addBeam(
            q0x, q0z, q0y, q0y, q1x, q1z, q1y, q1y,
            0.020, 0.008, 0.085, false, false, false,
            cCurb[0], cCurb[1], cCurb[2]
          );
        }
      }

      // Bridge soffit slab, underside box-girder haunch ribs & cylindrical underwater piers
      if (isWaterBridge) {
        bConcrete.addQuad(
          x0 + 0.03, y00 - 0.085, z0 + 0.03,
          x1 - 0.03, y10 - 0.085, z0 + 0.03,
          x1 - 0.03, y11 - 0.085, z1 - 0.03,
          x0 + 0.03, y01 - 0.085, z1 - 0.03,
          0, 0, 1, 0, 1, 1, 0, 1,
          cGirder[0], cGirder[1], cGirder[2]
        );
        if (!groundCableSpanMask[i]) {
          const cx = x0 + 0.5;
          const cz = z0 + 0.5;
          // Anchor underwater bridge piers deep into ocean/riverbed so piers NEVER float over deep basins!
          const bedY = Math.min(cellElev[i] - 0.36, -1.25);
          const topY = avgDeckY - 0.07;

          // Subtle twin longitudinal arched haunch ribs under 1-2 tile bridges
          if (!isJunctionOrTurn) {
            const runEW = hasEW && !hasNS;
            const fx = runEW ? 1 : 0, fz = runEW ? 0 : 1;
            const sx = fz, sz = -fx;
            const orgX = runEW ? x0 : cx;
            const orgZ = runEW ? cz : z0;
            for (const [sA, sB, dA, dB] of [[0.0, 0.5, 0.095, 0.145], [0.5, 1.0, 0.145, 0.095]]) {
              const ax = orgX + fx * sA, az = orgZ + fz * sA;
              const bx = orgX + fx * sB, bz = orgZ + fz * sB;
              const yA = sampleCornerGrid(roadCornerY, ax, az) - 0.078;
              const yB = sampleCornerGrid(roadCornerY, bx, bz) - 0.078;
              for (const ribSign of [-1, 1]) {
                const uOff = 0.25 * ribSign;
                addHaunchWeb(
                  ax + sx * uOff, az + sz * uOff, yA, yA - dA,
                  bx + sx * uOff, bz + sz * uOff, yB, yB - dB,
                  0.038, sx, sz,
                  cGirder[0], cGirder[1], cGirder[2]
                );
              }
            }
          }

          if (t.roadGround >= 2) {
            const offX = hasEW ? 0 : 0.26;
            const offZ = hasEW ? 0.26 : 0;
            bConcrete.addCylinder(cx - offX, cz - offZ, bedY, topY, 0.072, 0.065, 10, cPier[0], cPier[1], cPier[2]);
            bConcrete.addCylinder(cx + offX, cz + offZ, bedY, topY, 0.072, 0.065, 10, cPier[0], cPier[1], cPier[2]);
          } else {
            bConcrete.addCylinder(cx, cz, bedY, topY, 0.082, 0.072, 10, cPier[0], cPier[1], cPier[2]);
          }
        }
      }
    }
  }

  // --- LAYER B: Mountain Tunnel Portals (t.roadGround === 4) ---
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t = grid[idx(x, z)];
      if (t.roadGround !== 4) continue;

      for (let d = 0; d < 4; d++) {
        const nx = x + DIRS[d].dx;
        const nz = z + DIRS[d].dz;
        if (!inBounds(nx, nz)) continue;
        const nt = grid[idx(nx, nz)];
        if (nt.roadGround < 1 || nt.roadGround > 3 || nt.dam) continue;

        // Build concrete arch portal at shared edge facing neighbor (nx, nz)
        const e = getTileEdgeEndpoints(x, z, d, roadCornerY);
        const fdx = DIRS[d].dx;
        const fdz = DIRS[d].dz;
        // Inward direction into mountain tunnel tile = (-fdx, -fdz)
        const inX = -fdx;
        const inZ = -fdz;

        // Short asphalt throat entering tunnel mouth (0.24m deep, CCW +Y upward normal!)
        const ax0 = e.p0x, az0 = e.p0z;
        const ax1 = e.p1x, az1 = e.p1z;
        const bx0 = ax0 + inX * 0.24, bz0 = az0 + inZ * 0.24;
        const bx1 = ax1 + inX * 0.24, bz1 = az1 + inZ * 0.24;
        bRoad4.addQuad(ax0, e.y0, az0, bx0, e.y0, bz0, bx1, e.y1, bz1, ax1, e.y1, az1, 0, 0, 0, 0.25, 1, 0.25, 1, 0);

        const baseY = Math.min(e.y0, e.y1);
        const topArchY = Math.max(e.y0, e.y1) + 0.44;
        const midX = (ax0 + ax1) * 0.5 + inX * 0.14;
        const midZ = (az0 + az1) * 0.5 + inZ * 0.14;
        const sideVx = ax1 - ax0;
        const sideVz = az1 - az0;

        // Left & right concrete retaining piers
        for (const s of [-0.41, 0.41]) {
          const px = midX + sideVx * s;
          const pz = midZ + sideVz * s;
          bConcrete.addBeam(
            px - inX * 0.11, pz - inZ * 0.11, baseY, baseY,
            px + inX * 0.13, pz + inZ * 0.13, baseY, baseY,
            0.085, topArchY - baseY, 0.12, true, true, false,
            cPortal[0], cPortal[1], cPortal[2]
          );
        }

        // Top arched headwall lintel + cornice coping
        const pL0x = midX - sideVx * 0.49, pL0z = midZ - sideVz * 0.49;
        const pR0x = midX + sideVx * 0.49, pR0z = midZ + sideVz * 0.49;
        bConcrete.addBeam(
          pL0x, pL0z, topArchY - 0.11, topArchY - 0.11,
          pR0x, pR0z, topArchY - 0.11, topArchY - 0.11,
          0.12, 0.15, 0.0, true, true, true,
          cPortal[0], cPortal[1], cPortal[2]
        );

        // Dark recessed tunnel bore opening facing outward (+fdx, +fdz)
        const boreCenterX = midX + inX * 0.07;
        const boreCenterZ = midZ + inZ * 0.07;
        const bLx = boreCenterX - sideVx * 0.33;
        const bLz = boreCenterZ - sideVz * 0.33;
        const bRx = boreCenterX + sideVx * 0.33;
        const bRz = boreCenterZ + sideVz * 0.33;
        bTunnelDark.addQuad(
          bRx, topArchY - 0.09, bRz,
          bRx, baseY - 0.01, bRz,
          bLx, baseY - 0.01, bLz,
          bLx, topArchY - 0.09, bLz
        );
      }
    }
  }

  // --- LAYER C: Continuous Sloped Elevated Highway Viaducts & Welded Ramps ---
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const i = idx(x, z);
      const t = grid[i];
      const rmSelf = t.ramp ? rampMeta.get(i) : null;

      // C1. Non-ramp Elevated Highway Viaduct Tiles + Mid-Viaduct Continuous Overhead Decks (mid_slip)
      const renderOverheadViaduct = (t.roadElevated > 0 && !t.ramp) || Boolean(rmSelf && rmSelf.throughElev);
      if (renderOverheadViaduct) {
        const x0 = x - HALF_GRID;
        const x1 = x0 + 1;
        const z0 = z - HALF_GRID;
        const z1 = z0 + 1;

        const y00 = elevCornerY[cIdx(x, z)];
        const y10 = elevCornerY[cIdx(x + 1, z)];
        const y01 = elevCornerY[cIdx(x, z + 1)];
        const y11 = elevCornerY[cIdx(x + 1, z + 1)];

        const eConn = [false, false, false, false];
        const neckMedianSplit = [false, false, false, false];
        let adjacentToFlaredRamp = Boolean(rmSelf && rmSelf.throughElev);

        for (let d = 0; d < 4; d++) {
          const nx = x + DIRS[d].dx;
          const nz = z + DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          const nt = grid[ni];
          if (nt.roadElevated > 0 && !nt.ramp) {
            eConn[d] = true;
          } else if (nt.ramp) {
            const nrm = rampMeta.get(ni);
            if (nrm) {
              if (nrm.throughElev && (d === nrm.highDir || d === nrm.lowDir)) {
                eConn[d] = true;
                adjacentToFlaredRamp = true;
              } else if (nrm.highDir === DIRS[d].opp && nrm.highFrac > 0.999) {
                eConn[d] = true;
                if (nrm.mode === 'median_split') {
                  neckMedianSplit[d] = true;
                  adjacentToFlaredRamp = true;
                }
              }
            }
          }
        }

        const hasNS = eConn[0] || eConn[1];
        const hasEW = eConn[2] || eConn[3];
        const connCount = (eConn[0] ? 1 : 0) + (eConn[1] ? 1 : 0) + (eConn[2] ? 1 : 0) + (eConn[3] ? 1 : 0);
        const isJunctionOrTurn = connCount >= 3 || (hasNS && hasEW);
        const uvMode = isJunctionOrTurn ? 'HUB' : (hasEW ? 'EW' : 'NS');

        // Full 1.000 x 1.000 welded sloped asphalt deck (uses t.elevCongestion in Traffic Overlay!)
        if (isTrafficOverlay) {
          const [tr, tg, tb] = trafficColorFor(t.elevCongestion ?? t.congestion ?? 0);
          bTraffic.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 2, uvMode, true, tr, tg, tb);
        } else if (isJunctionOrTurn) {
          bRoadHub.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 2, 'HUB', true);
        } else {
          bRoad4.addBilinearDeck(x0, z0, x1, z1, y00, y10, y01, y11, 2, uvMode, stripesV4);
        }

        // Concrete box-girder soffit underside (-0.08m thick)
        const soff = 0.082;
        bConcrete.addQuad(
          x0 + 0.04, y00 - soff, z0 + 0.04,
          x1 - 0.04, y10 - soff, z0 + 0.04,
          x1 - 0.04, y11 - soff, z1 - 0.04,
          x0 + 0.04, y01 - soff, z1 - 0.04,
          0, 0, 1, 0, 1, 1, 0, 1,
          cGirder[0], cGirder[1], cGirder[2]
        );

        const midSlipRightDir = (rmSelf && rmSelf.mode === 'mid_slip') ? RIGHT_DIR[rmSelf.highDir] : -1;
        const midSlipLeftDir = (rmSelf && rmSelf.mode === 'mid_slip') ? LEFT_DIR[rmSelf.highDir] : -1;

        // Continuous side concrete crash-barrier parapets (+0.07m high) & median_split neck-down end-shoulders!
        for (let d = 0; d < 4; d++) {
          const e = getTileEdgeEndpoints(x, z, d, elevCornerY);
          const inset = 0.026;
          const dx = e.p1x - e.p0x;
          const dz = e.p1z - e.p0z;
          const p0x = e.p0x + dz * inset;
          const p0z = e.p0z - dx * inset;
          const p1x = e.p1x + dz * inset;
          const p1z = e.p1z - dx * inset;

          if (neckMedianSplit[d]) {
            // Viaduct necks cleanly down from 1.00m into central 0.44m [0.28..0.72] median ramp!
            for (const [s0, s1] of [[0.0, 0.27], [0.73, 1.0]]) {
              const ax = p0x + (p1x - p0x) * s0;
              const az = p0z + (p1z - p0z) * s0;
              const bx = p0x + (p1x - p0x) * s1;
              const bz = p0z + (p1z - p0z) * s1;
              const ay = e.y0 + (e.y1 - e.y0) * s0;
              const by = e.y0 + (e.y1 - e.y0) * s1;
              bConcrete.addBeam(
                ax, az, ay, ay, bx, bz, by, by,
                0.026, 0.072, soff, true, true, true,
                cParapet[0], cParapet[1], cParapet[2]
              );
            }
            continue;
          }

          if (eConn[d]) continue;

          let s0 = 0.0;
          let s1 = 1.0;
          const d0 = LEFT_DIR[d];
          const d1 = RIGHT_DIR[d];

          // On mid_slip flanks, leave upper merge gore (sGlobal > 0.65) open where parallel slip-ramps join viaduct!
          if ((d === midSlipRightDir || d === midSlipLeftDir) && rmSelf && rmSelf.highFrac > 0.65) {
            const span = Math.max(1e-4, rmSelf.highFrac - rmSelf.lowFrac);
            const openFrac = clamp01((rmSelf.highFrac - Math.max(0.65, rmSelf.lowFrac)) / span);
            if (d0 === rmSelf.highDir) s0 = Math.max(s0, openFrac);
            else if (d1 === rmSelf.highDir) s1 = Math.min(s1, 1.0 - openFrac);
          }

          // Trim 0.36m on nHigh viaduct parapet where mid_slip angled elevated gore taper merges into nHigh!
          if (!rmSelf) {
            if (hasElevSlipGoreInto(x + DIRS[d0].dx, z + DIRS[d0].dz, DIRS[d0].opp, d)) s0 = Math.max(s0, 0.36);
            if (hasElevSlipGoreInto(x + DIRS[d1].dx, z + DIRS[d1].dz, DIRS[d1].opp, d)) s1 = Math.min(s1, 0.64);
          }

          if (s1 - s0 <= 0.02) continue;

          const q0x = p0x + (p1x - p0x) * s0;
          const q0z = p0z + (p1z - p0z) * s0;
          const q1x = p0x + (p1x - p0x) * s1;
          const q1z = p0z + (p1z - p0z) * s1;
          const q0y = e.y0 + (e.y1 - e.y0) * s0;
          const q1y = e.y0 + (e.y1 - e.y0) * s1;

          bConcrete.addBeam(
            q0x, q0z, q0y, q0y, q1x, q1z, q1y, q1y,
            0.026, 0.072, soff, s0 > 0, s1 < 1, true,
            cParapet[0], cParapet[1], cParapet[2]
          );
        }

        // Exact-height LED streetlamps along straight non-ramp elevated viaduct parapets (every 2 tiles)
        if (!rmSelf && !isJunctionOrTurn && ((x + z) % 2 === 0)) {
          const cx = x0 + 0.5;
          const cz = z0 + 0.5;
          const side = (((x + z) >> 1) & 1) ? 1 : -1;
          const runEW = hasEW && !hasNS;
          if (runEW) {
            const sideDir = side < 0 ? 0 : 1;
            if (!eConn[sideDir] && !hasElevSlipGoreInto(x - 1, z, 3, sideDir) && !hasElevSlipGoreInto(x + 1, z, 2, sideDir)) {
              const lx = cx;
              const lz = cz + side * 0.46;
              if (!pylonFootprints.some((p) => p.isElev && Math.hypot(p.x - lx, p.z - lz) < 0.42)) {
                lamps.push({
                  x: lx,
                  y: sampleCornerGrid(elevCornerY, lx, lz),
                  z: lz,
                  yaw: side > 0 ? Math.PI : 0,
                  isElev: true
                });
              }
            }
          } else {
            const sideDir = side < 0 ? 2 : 3;
            if (!eConn[sideDir] && !hasElevSlipGoreInto(x, z - 1, 1, sideDir) && !hasElevSlipGoreInto(x, z + 1, 0, sideDir)) {
              const lx = cx + side * 0.46;
              const lz = cz;
              if (!pylonFootprints.some((p) => p.isElev && Math.hypot(p.x - lx, p.z - lz) < 0.42)) {
                lamps.push({
                  x: lx,
                  y: sampleCornerGrid(elevCornerY, lx, lz),
                  z: lz,
                  yaw: side > 0 ? -Math.PI * 0.5 : Math.PI * 0.5,
                  isElev: true
                });
              }
            }
          }
        }

        // Cylindrical support piers (portal straddle twin columns when ground road/rail/throughGround is underneath!)
        const isMidSlipSelf = Boolean(rmSelf && rmSelf.mode === 'mid_slip');
        const skipCableWaterPier = Boolean(elevCableSpanMask[i] && t.roadGround === 0 && t.rail === 0);
        const placePier = skipCableWaterPier
          ? false
          : (isMidSlipSelf
            ? (rmSelf.chainLen >= 2 && ((x + z) % 2 === 0))
            : (((x + z) % 2 === 0) || connCount <= 1 || isJunctionOrTurn));
        if (placePier) {
          const cx = x0 + 0.5;
          const cz = z0 + 0.5;
          const soffitCenterY = (y00 + y10 + y01 + y11) * 0.25 - soff;
          const groundY = cellElev[i] - 0.16;

          if (t.roadGround > 0 || t.rail > 0 || isMidSlipSelf || (rmSelf && rmSelf.throughGround) || adjacentToFlaredRamp) {
            // Portal straddle twin columns + overhead cap bent beam clear of both ground & slip-ramp vehicles!
            const spanAlongX = !hasEW;
            const halfSpan = isMidSlipSelf ? 0.46 : (adjacentToFlaredRamp ? 0.68 : 0.44);
            const colR = isMidSlipSelf ? 0.054 : 0.062;
            const ox = spanAlongX ? halfSpan : 0;
            const oz = spanAlongX ? 0 : halfSpan;
            bConcrete.addCylinder(cx - ox, cz - oz, groundY, soffitCenterY + 0.01, colR, colR * 0.92, 10, cPier[0], cPier[1], cPier[2]);
            bConcrete.addCylinder(cx + ox, cz + oz, groundY, soffitCenterY + 0.01, colR, colR * 0.92, 10, cPier[0], cPier[1], cPier[2]);
            bConcrete.addBeam(
              cx - ox, cz - oz, soffitCenterY, soffitCenterY,
              cx + ox, cz + oz, soffitCenterY, soffitCenterY,
              colR * 1.05, 0.01, 0.075, true, true, true,
              cGirder[0], cGirder[1], cGirder[2]
            );
          } else {
            // Central cylindrical pier + flared pier head
            bConcrete.addCylinder(cx, cz, groundY, soffitCenterY + 0.01, 0.092, 0.078, 10, cPier[0], cPier[1], cPier[2]);
            bConcrete.addCylinder(cx, cz, soffitCenterY - 0.09, soffitCenterY + 0.005, 0.082, 0.15, 10, cGirder[0], cGirder[1], cGirder[2]);
          }
        }
      }

      // C2. Smooth Welded Sloped Highway Ramps (bridgehead / median_split / mid_slip)
      if (t.ramp) {
        const rm = rmSelf || {
          mode: 'bridgehead',
          highDir: 0,
          lowDir: 1,
          lowFrac: 0.0,
          highFrac: 1.0,
          chainLen: 1,
          throughGround: false,
          throughElev: false
        };
        const { mode, highDir, lowFrac, highFrac } = rm;

        const x0 = x - HALF_GRID;
        const x1 = x0 + 1;
        const z0 = z - HALF_GRID;
        const z1 = z0 + 1;

        // Parameterize local tile along s in [0..1] (low -> high) and u in [0..1] (left -> right, CCW from +Y)
        let lowLX, lowLZ, lowRX, lowRZ;
        let highLX, highLZ, highRX, highRZ;
        let gLowL, gLowR, gHighL, gHighR;
        let eLowL, eLowR, eHighL, eHighR;

        if (highDir === 0) {
          // Low = South (z1), High = North (z0); Left = West (x0), Right = East (x1)
          lowLX = x0; lowLZ = z1; lowRX = x1; lowRZ = z1;
          highLX = x0; highLZ = z0; highRX = x1; highRZ = z0;
          gLowL = roadCornerY[cIdx(x, z + 1)]; gLowR = roadCornerY[cIdx(x + 1, z + 1)];
          gHighL = roadCornerY[cIdx(x, z)]; gHighR = roadCornerY[cIdx(x + 1, z)];
          eLowL = elevCornerY[cIdx(x, z + 1)]; eLowR = elevCornerY[cIdx(x + 1, z + 1)];
          eHighL = elevCornerY[cIdx(x, z)]; eHighR = elevCornerY[cIdx(x + 1, z)];
        } else if (highDir === 1) {
          // Low = North (z0), High = South (z1); Left = East (x1), Right = West (x0)
          lowLX = x1; lowLZ = z0; lowRX = x0; lowRZ = z0;
          highLX = x1; highLZ = z1; highRX = x0; highRZ = z1;
          gLowL = roadCornerY[cIdx(x + 1, z)]; gLowR = roadCornerY[cIdx(x, z)];
          gHighL = roadCornerY[cIdx(x + 1, z + 1)]; gHighR = roadCornerY[cIdx(x, z + 1)];
          eLowL = elevCornerY[cIdx(x + 1, z)]; eLowR = elevCornerY[cIdx(x, z)];
          eHighL = elevCornerY[cIdx(x + 1, z + 1)]; eHighR = elevCornerY[cIdx(x, z + 1)];
        } else if (highDir === 2) {
          // Low = East (x1), High = West (x0); Left = South (z1), Right = North (z0)
          lowLX = x1; lowLZ = z1; lowRX = x1; lowRZ = z0;
          highLX = x0; highLZ = z1; highRX = x0; highRZ = z0;
          gLowL = roadCornerY[cIdx(x + 1, z + 1)]; gLowR = roadCornerY[cIdx(x + 1, z)];
          gHighL = roadCornerY[cIdx(x, z + 1)]; gHighR = roadCornerY[cIdx(x, z)];
          eLowL = elevCornerY[cIdx(x + 1, z + 1)]; eLowR = elevCornerY[cIdx(x + 1, z)];
          eHighL = elevCornerY[cIdx(x, z + 1)]; eHighR = elevCornerY[cIdx(x, z)];
        } else {
          // Low = West (x0), High = East (x1); Left = North (z0), Right = South (z1)
          lowLX = x0; lowLZ = z0; lowRX = x0; lowRZ = z1;
          highLX = x1; highLZ = z0; highRX = x1; highRZ = z1;
          gLowL = roadCornerY[cIdx(x, z)]; gLowR = roadCornerY[cIdx(x, z + 1)];
          gHighL = roadCornerY[cIdx(x + 1, z)]; gHighR = roadCornerY[cIdx(x + 1, z + 1)];
          eLowL = elevCornerY[cIdx(x, z)]; eLowR = elevCornerY[cIdx(x, z + 1)];
          eHighL = elevCornerY[cIdx(x + 1, z)]; eHighR = elevCornerY[cIdx(x + 1, z + 1)];
        }

        const bOff = mode === 'median_split' ? 0.016 : (mode === 'mid_slip' ? 0.018 : 0.026);
        const bHalfW = mode === 'median_split' ? 0.017 : (mode === 'mid_slip' ? 0.018 : 0.025);
        const RSEG = 6;
        const targetDeckBatch = isTrafficOverlay ? bTraffic : bRoad4;
        const rampCg = Math.max(t.elevCongestion || 0, t.congestion || 0);
        const [tr, tg, tb] = isTrafficOverlay ? trafficColorFor(rampCg) : [1, 1, 1];
        const rVecX = lowRX - lowLX;
        const rVecZ = lowRZ - lowLZ;
        const fwdX = highLX - lowLX;
        const fwdZ = highLZ - lowLZ;
        const groundRefY = (gLowL + gLowR + gHighL + gHighR) * 0.25;

        // Emits a single C1-continuous Hermite sloped ramp ribbon spanning [spanU0 .. spanU1]:
        // - bridgehead: [0.00..1.00]
        // - median_split: central [0.28..0.72] (±0.22m, traffic.js ±0.10) between ±0.39 ground boulevard lanes!
        // - mid_slip: symmetric parallel flank slip-ramps [1.02..1.38] (+0.68 ascending) & [-0.38..-0.02] (-0.68 descending)!
        const emitRampStrip = (spanU0, spanU1, mergeSign, innerSide) => {
          const evalSlice = (sLocal) => {
            const sGlobal = lowFrac + (highFrac - lowFrac) * sLocal;
            const ease = sGlobal * sGlobal * (3 - 2 * sGlobal);
            const noseLift = (mode !== 'bridgehead') ? 0.005 * (1 - ease) : 0;

            const fXL = lowLX + fwdX * sLocal;
            const fZL = lowLZ + fwdZ * sLocal;

            const gL = gLowL + (gHighL - gLowL) * sLocal;
            const gR = gLowR + (gHighR - gLowR) * sLocal;
            const eL = eLowL + (eHighL - eLowL) * sLocal;
            const eR = eLowR + (eHighR - eLowR) * sLocal;

            const fullYL = gL * (1 - ease) + eL * ease + noseLift;
            const fullYR = gR * (1 - ease) + eR * ease + noseLift;

            // On mid_slip upper merge zone, smoothly close the 2cm gap so slip-ramps weld flush onto u=0.00 / u=1.00 viaduct edges!
            const mergePull = (mergeSign !== 0 && sGlobal > 0.65) ? smoothstep(0.65, 1.0, sGlobal) * 0.02 * mergeSign : 0;
            const u0 = spanU0 + mergePull;
            const u1 = spanU1 + mergePull;

            const u0Clamped = clamp01(u0);
            const u1Clamped = clamp01(u1);

            return {
              sGlobal,
              ease,
              xL: fXL + rVecX * u0,
              zL: fZL + rVecZ * u0,
              yL: fullYL + (fullYR - fullYL) * u0Clamped,
              xR: fXL + rVecX * u1,
              zR: fZL + rVecZ * u1,
              yR: fullYL + (fullYR - fullYL) * u1Clamped
            };
          };

          let prev = evalSlice(0);

          for (let sIdx = 1; sIdx <= RSEG; sIdx++) {
            const s = sIdx / RSEG;
            const sPrev = (sIdx - 1) / RSEG;
            const cur = evalSlice(s);

            const uSpan0 = mode === 'bridgehead' ? 0.0 : 0.16;
            const uSpan1 = mode === 'bridgehead' ? 1.0 : 0.84;
            const ua = stripesV4 ? uSpan0 : sPrev;
            const va = stripesV4 ? sPrev : uSpan1;
            const ub = stripesV4 ? uSpan0 : s;
            const vb = stripesV4 ? s : uSpan1;
            const uc = stripesV4 ? uSpan1 : s;
            const vc = stripesV4 ? s : uSpan0;
            const ud = stripesV4 ? uSpan1 : sPrev;
            const vd = stripesV4 ? sPrev : uSpan0;

            // Top deck quad: CCW from +Y is (curL -> prevL -> prevR -> curR) -> guaranteed ny > 0!
            targetDeckBatch.addQuad(
              cur.xL, cur.yL, cur.zL,
              prev.xL, prev.yL, prev.zL,
              prev.xR, prev.yR, prev.zR,
              cur.xR, cur.yR, cur.zR,
              ub, vb, ua, va, ud, vd, uc, vc,
              tr, tg, tb
            );

            // Underside concrete soffit quad (-Y)
            const soff0 = 0.045 + 0.032 * prev.ease;
            const soff1 = 0.045 + 0.032 * cur.ease;
            bConcrete.addQuad(
              prev.xL, prev.yL - soff0, prev.zL,
              cur.xL, cur.yL - soff1, cur.zL,
              cur.xR, cur.yR - soff1, cur.zR,
              prev.xR, prev.yR - soff0, prev.zR,
              0, 0, 0, 1, 1, 1, 1, 0,
              cGirder[0], cGirder[1], cGirder[2]
            );

            // Continuous side concrete crash barriers along ramp edges (omitting inner gore wall at sGlobal > 0.72)
            const fdx = cur.xL - prev.xL;
            const fdz = cur.zL - prev.zL;
            const fLen = Math.hypot(fdx, fdz) || 1;
            const rightX = -fdz / fLen;
            const rightZ = fdx / fLen;
            const barrierH = 0.066 * Math.min(1, cur.sGlobal * 2.4);

            if (!(innerSide === 'left' && cur.sGlobal > 0.72)) {
              bConcrete.addBeam(
                prev.xL + rightX * bOff, prev.zL + rightZ * bOff, prev.yL, prev.yL,
                cur.xL + rightX * bOff, cur.zL + rightZ * bOff, cur.yL, cur.yL,
                bHalfW, barrierH, soff1, false, false, false,
                cParapet[0], cParapet[1], cParapet[2]
              );
            }
            if (!(innerSide === 'right' && cur.sGlobal > 0.72)) {
              bConcrete.addBeam(
                prev.xR - rightX * bOff, prev.zR - rightZ * bOff, prev.yR, prev.yR,
                cur.xR - rightX * bOff, cur.zR - rightZ * bOff, cur.yR, cur.yR,
                bHalfW, barrierH, soff1, false, false, false,
                cParapet[0], cParapet[1], cParapet[2]
              );
            }

            prev = cur;
          }

          // On mid_slip high end, add angled elevated gore taper closing slip-ramp cleanly back into nHigh viaduct!
          if (mode === 'mid_slip' && highFrac > 0.999) {
            const topEnd = evalSlice(1.0);
            const gLen = 0.36;
            if (innerSide === 'left' && hasElevSlipGoreInto(x, z, highDir, RIGHT_DIR[highDir])) {
              const tipInX = highLX + fwdX * gLen + rVecX * 0.98;
              const tipInZ = highLZ + fwdZ * gLen + rVecZ * 0.98;
              const tipOutX = highLX + fwdX * gLen + rVecX * 1.00;
              const tipOutZ = highLZ + fwdZ * gLen + rVecZ * 1.00;
              const tipInY = sampleCornerGrid(elevCornerY, tipInX, tipInZ) + 0.001;
              const tipOutY = sampleCornerGrid(elevCornerY, tipOutX, tipOutZ) + 0.001;

              targetDeckBatch.addQuad(
                tipInX, tipInY, tipInZ,
                topEnd.xL, topEnd.yL, topEnd.zL,
                topEnd.xR, topEnd.yR, topEnd.zR,
                tipOutX, tipOutY, tipOutZ,
                0.2, 1, 0.2, 0.6, 0.8, 0.6, 0.8, 1,
                tr, tg, tb
              );
              bConcrete.addBeam(
                topEnd.xR, topEnd.zR, topEnd.yR, topEnd.yR,
                tipOutX, tipOutZ, tipOutY, tipOutY,
                bHalfW, 0.068, 0.075, false, true, true,
                cParapet[0], cParapet[1], cParapet[2]
              );
            } else if (innerSide === 'right' && hasElevSlipGoreInto(x, z, highDir, LEFT_DIR[highDir])) {
              const tipOutX = highLX + fwdX * gLen;
              const tipOutZ = highLZ + fwdZ * gLen;
              const tipInX = highLX + fwdX * gLen + rVecX * 0.02;
              const tipInZ = highLZ + fwdZ * gLen + rVecZ * 0.02;
              const tipOutY = sampleCornerGrid(elevCornerY, tipOutX, tipOutZ) + 0.001;
              const tipInY = sampleCornerGrid(elevCornerY, tipInX, tipInZ) + 0.001;

              targetDeckBatch.addQuad(
                tipOutX, tipOutY, tipOutZ,
                topEnd.xL, topEnd.yL, topEnd.zL,
                topEnd.xR, topEnd.yR, topEnd.zR,
                tipInX, tipInY, tipInZ,
                0.2, 1, 0.2, 0.6, 0.8, 0.6, 0.8, 1,
                tr, tg, tb
              );
              bConcrete.addBeam(
                tipOutX, tipOutZ, tipOutY, tipOutY,
                topEnd.xL, topEnd.zL, topEnd.yL, topEnd.yL,
                bHalfW, 0.068, 0.075, true, false, true,
                cParapet[0], cParapet[1], cParapet[2]
              );
            }
          }

          // Support column under elevated portion of ramp
          const midSlice = evalSlice(0.62);
          const midX = (midSlice.xL + midSlice.xR) * 0.5;
          const midZ = (midSlice.zL + midSlice.zR) * 0.5;
          const midSoffY = (midSlice.yL + midSlice.yR) * 0.5 - (0.045 + 0.032 * midSlice.ease);

          if (mode === 'median_split' && midSoffY > groundRefY + 0.16) {
            // Slim central column (r = 0.055) right in the avenue median between ±0.39 ground through-lanes!
            bConcrete.addCylinder(midX, midZ, cellElev[i] - 0.15, midSoffY + 0.008, 0.058, 0.052, 10, cPier[0], cPier[1], cPier[2]);
          } else if (mode === 'mid_slip' && midSoffY > groundRefY + 0.28) {
            // Slim outer cantilevered pier outside the ±0.90m ground merge strip
            const colX = innerSide === 'left' ? (midSlice.xR + rVecX * 0.04) : (midSlice.xL - rVecX * 0.04);
            const colZ = innerSide === 'left' ? (midSlice.zR + rVecZ * 0.04) : (midSlice.zL - rVecZ * 0.04);
            bConcrete.addCylinder(colX, colZ, cellElev[i] - 0.15, midSoffY + 0.008, 0.056, 0.050, 10, cPier[0], cPier[1], cPier[2]);
            const b0x = innerSide === 'left' ? midSlice.xL : colX;
            const b0z = innerSide === 'left' ? midSlice.zL : colZ;
            const b1x = innerSide === 'left' ? colX : midSlice.xR;
            const b1z = innerSide === 'left' ? colZ : midSlice.zR;
            bConcrete.addBeam(
              b0x, b0z, midSoffY, midSoffY,
              b1x, b1z, midSoffY, midSoffY,
              0.050, 0.008, 0.056, true, true, true,
              cGirder[0], cGirder[1], cGirder[2]
            );
          } else if (mode === 'bridgehead' && midSoffY > groundRefY + 0.16) {
            bConcrete.addCylinder(midX, midZ, cellElev[i] - 0.15, midSoffY + 0.008, 0.078, 0.068, 10, cPier[0], cPier[1], cPier[2]);
          }
        };

        if (mode === 'median_split') {
          emitRampStrip(0.28, 0.72, 0, 'none');
        } else if (mode === 'mid_slip') {
          emitRampStrip(-0.38, -0.02, 1, 'right');
          emitRampStrip(1.02, 1.38, -1, 'left');
        } else {
          emitRampStrip(0.00, 1.00, 0, 'none');
        }
      }
    }
  }

  // --- LAYER D: Continuous Sloped High-Speed Rail Track & Viaducts (t.rail > 0) ---
  const evalRailBilinear = (tx, tz, tu, tv) => {
    const y00 = railCornerY[cIdx(tx, tz)];
    const y10 = railCornerY[cIdx(tx + 1, tz)];
    const y01 = railCornerY[cIdx(tx, tz + 1)];
    const y11 = railCornerY[cIdx(tx + 1, tz + 1)];
    return (y00 * (1 - tu) + y10 * tu) * (1 - tv) + (y01 * (1 - tu) + y11 * tu) * tv;
  };

  // Emits a continuous HSR twin-track concrete slab + 4 steel rails along segment (u0,v0) -> (u1,v1) inside tile (x,z)
  const emitHsrSegment = (x, z, u0, v0, u1, v1, slabDown, capS, capE) => {
    const xBase = x - HALF_GRID;
    const zBase = z - HALF_GRID;
    const p0x = xBase + u0;
    const p0z = zBase + v0;
    const p1x = xBase + u1;
    const p1z = zBase + v1;

    const dx = u1 - u0;
    const dz = v1 - v0;
    const len = Math.hypot(dx, dz);
    if (len < 1e-4) return;
    const lx = (dz / len);
    const lz = (-dx / len);

    const SLAB_HALF_W = 0.34;
    const y0L = evalRailBilinear(x, z, clamp01(u0 + lx * SLAB_HALF_W), clamp01(v0 + lz * SLAB_HALF_W));
    const y0R = evalRailBilinear(x, z, clamp01(u0 - lx * SLAB_HALF_W), clamp01(v0 - lz * SLAB_HALF_W));
    const y1L = evalRailBilinear(x, z, clamp01(u1 + lx * SLAB_HALF_W), clamp01(v1 + lz * SLAB_HALF_W));
    const y1R = evalRailBilinear(x, z, clamp01(u1 - lx * SLAB_HALF_W), clamp01(v1 - lz * SLAB_HALF_W));

    // Prestressed concrete ballastless track slab
    bConcrete.addBeam(
      p0x, p0z, y0L, y0R, p1x, p1z, y1L, y1R,
      SLAB_HALF_W, 0.0, slabDown, capS, capE, true,
      cSlab[0], cSlab[1], cSlab[2]
    );

    // 4 continuous welded steel rails (twin HSR tracks at ±0.21 and ±0.09)
    const railOffsets = [-0.21, -0.09, 0.09, 0.21];
    for (let r = 0; r < 4; r++) {
      const off = railOffsets[r];
      const ru0 = u0 + lx * off;
      const rv0 = v0 + lz * off;
      const ru1 = u1 + lx * off;
      const rv1 = v1 + lz * off;
      const ry0 = evalRailBilinear(x, z, clamp01(ru0), clamp01(rv0));
      const ry1 = evalRailBilinear(x, z, clamp01(ru1), clamp01(rv1));
      bSteel.addBeam(
        xBase + ru0, zBase + rv0, ry0, ry0,
        xBase + ru1, zBase + rv1, ry1, ry1,
        0.013, 0.028, 0.002, false, false, false
      );
    }
  };

  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const i = idx(x, z);
      const t = grid[i];
      if (t.rail <= 0) continue;

      const rConn = [false, false, false, false];
      for (let d = 0; d < 4; d++) {
        const nx = x + DIRS[d].dx;
        const nz = z + DIRS[d].dz;
        if (!inBounds(nx, nz)) {
          if (d === 1 && z === GRID_SIZE - 1 && t.rail === 2) rConn[d] = true;
          continue;
        }
        if (grid[idx(nx, nz)].rail > 0) rConn[d] = true;
      }

      const avgRailY = (
        railCornerY[cIdx(x, z)] +
        railCornerY[cIdx(x + 1, z)] +
        railCornerY[cIdx(x, z + 1)] +
        railCornerY[cIdx(x + 1, z + 1)]
      ) * 0.25;
      const clearance = avgRailY - cellElev[i];
      const isViaduct = clearance > 0.22 || waterDepth[i] > 0.06 || t.roadGround > 0;
      const slabDown = isViaduct ? 0.095 : 0.115;

      const hasN = rConn[0], hasS = rConn[1], hasW = rConn[2], hasE = rConn[3];
      const rCount = (hasN ? 1 : 0) + (hasS ? 1 : 0) + (hasW ? 1 : 0) + (hasE ? 1 : 0);

      if (rCount === 2 && ((hasN && hasE) || (hasN && hasW) || (hasS && hasE) || (hasS && hasW))) {
        // Smooth 6-segment quarter-circle HSR arc welded exactly to shared edge midpoints!
        const pivotU = hasE ? 1.0 : 0.0;
        const pivotV = hasS ? 1.0 : 0.0;
        let aStart = 0;
        let aEnd = Math.PI * 0.5;
        if (hasN && hasE) { aStart = Math.PI; aEnd = Math.PI * 0.5; }
        else if (hasN && hasW) { aStart = 0; aEnd = Math.PI * 0.5; }
        else if (hasS && hasW) { aStart = 0; aEnd = -Math.PI * 0.5; }
        else if (hasS && hasE) { aStart = Math.PI; aEnd = Math.PI * 1.5; }

        const CSEG = 6;
        for (let s = 0; s < CSEG; s++) {
          const th0 = aStart + (aEnd - aStart) * (s / CSEG);
          const th1 = aStart + (aEnd - aStart) * ((s + 1) / CSEG);
          const u0 = pivotU + Math.cos(th0) * 0.5;
          const v0 = pivotV + Math.sin(th0) * 0.5;
          const u1 = pivotU + Math.cos(th1) * 0.5;
          const v1 = pivotV + Math.sin(th1) * 0.5;
          emitHsrSegment(x, z, u0, v0, u1, v1, slabDown, false, false);
        }
      } else {
        const doNS = (hasN || hasS) || (!hasW && !hasE);
        const doEW = hasW || hasE;
        if (doNS) {
          emitHsrSegment(x, z, 0.5, 0.0, 0.5, 0.5, slabDown, !hasN, false);
          emitHsrSegment(x, z, 0.5, 0.5, 0.5, 1.0, slabDown, false, !hasS);
        }
        if (doEW) {
          emitHsrSegment(x, z, 0.0, 0.5, 0.5, 0.5, slabDown, !hasW, false);
          emitHsrSegment(x, z, 0.5, 0.5, 1.0, 0.5, slabDown, false, !hasE);
        }
      }

      // Viaduct side acoustic parapets & bridge piers when HSR is elevated over water/roads
      if (isViaduct) {
        const cx = x - HALF_GRID + 0.5;
        const cz = z - HALF_GRID + 0.5;
        const soffitY = avgRailY - slabDown;
        const groundY = waterDepth[i] > 0.06 ? Math.min(cellElev[i] - 0.36, -1.25) : (cellElev[i] - 0.22);

        if ((t.roadGround >= 1 && t.roadGround <= 3) || t.ramp) {
          const spanAlongX = (hasN || hasS) && !(hasW && hasE && !hasN && !hasS);
          const ox = spanAlongX ? 0.44 : 0;
          const oz = spanAlongX ? 0 : 0.44;
          bConcrete.addCylinder(cx - ox, cz - oz, groundY, soffitY + 0.01, 0.062, 0.056, 10, cPier[0], cPier[1], cPier[2]);
          bConcrete.addCylinder(cx + ox, cz + oz, groundY, soffitY + 0.01, 0.062, 0.056, 10, cPier[0], cPier[1], cPier[2]);
          bConcrete.addBeam(
            cx - ox, cz - oz, soffitY, soffitY,
            cx + ox, cz + oz, soffitY, soffitY,
            0.062, 0.01, 0.068, true, true, true,
            cGirder[0], cGirder[1], cGirder[2]
          );
        } else {
          bConcrete.addCylinder(cx, cz, groundY, soffitY + 0.01, 0.080, 0.068, 10, cPier[0], cPier[1], cPier[2]);
        }
      }

      // Catenary overhead portal arch on HSR South border portal (t.rail === 2) or periodic stanchions
      if (t.rail === 2 || ((x + z) % 4 === 0 && rCount === 2 && ((hasN && hasS) || (hasW && hasE)))) {
        const cx = x - HALF_GRID + 0.5;
        const cz = z - HALF_GRID + 0.5;
        const spanX = (hasN || hasS) || (!hasW && !hasE);
        const gx = spanX ? 0.36 : 0;
        const gz = spanX ? 0 : 0.36;
        const mastTop = avgRailY + 0.44;
        bSteel.addCylinder(cx - gx, cz - gz, avgRailY - 0.02, mastTop, 0.018, 0.015, 6);
        bSteel.addCylinder(cx + gx, cz + gz, avgRailY - 0.02, mastTop, 0.018, 0.015, 6);
        bSteel.addBeam(
          cx - gx, cz - gz, mastTop, mastTop,
          cx + gx, cz + gz, mastTop, mastTop,
          0.016, 0.016, 0.016, true, true, true
        );
      }
    }
  }

  // Finalize compact merged meshes into returned THREE.Group
  const markMesh = bMarkings.toMesh(THREE, auxMats.roadMarking);
  if (markMesh) {
    markMesh.name = 'roadMarkings';
    markMesh.castShadow = false;
    markMesh.receiveShadow = true;
  }

  const meshes = [
    bRoad2.toMesh(THREE, matRoad2),
    bRoad4.toMesh(THREE, matRoad4),
    bRoadHub.toMesh(THREE, matRoadHub),
    bTraffic.toMesh(THREE, auxMats.trafficDeck),
    bConcrete.toMesh(THREE, auxMats.concrete),
    bTunnelDark.toMesh(THREE, auxMats.tunnelDark),
    bSteel.toMesh(THREE, auxMats.steelRail),
    markMesh
  ];

  for (let i = 0; i < meshes.length; i++) {
    if (meshes[i]) group.add(meshes[i]);
  }

  group.userData.streetProps = { lamps, signals, busStops };

  return group;
}
