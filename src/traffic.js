import { GRID_SIZE, inBounds, idx, tileToWorld, worldToTile } from './mapgen.js';

const CAR_COLORS = [
  [0.95, 0.96, 0.98],
  [0.22, 0.55, 0.95],
  [0.90, 0.24, 0.24],
  [0.72, 0.76, 0.82],
  [0.16, 0.75, 0.65],
  [0.25, 0.28, 0.34]
];

// Shared ramp cardinal directions matching terrain_water_shader.js: 0:N, 1:S, 2:W, 3:E
const RAMP_DIRS = [
  { dx: 0, dz: -1, opp: 1 },
  { dx: 0, dz: 1, opp: 0 },
  { dx: -1, dz: 0, opp: 3 },
  { dx: 1, dz: 0, opp: 2 }
];

function lerpAngle(a, b, t) {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}

export class TrafficManager {
  constructor(sim) {
    this.sim = sim;
    this.vehicles = [];
    this.trains = [];      // HSR multi-car bullet trains & underground metro trains!
    this.aircraft = [];    // 3D Wide-body Airliners approaching/landing/climbing at airports!
    this.ships = [];       // 3D Cargo Container Ships sailing SE Sea Bay <-> Seaport!
    this.busStops = [];    // Active roadside EV bus stop tiles collected during refreshRoadGraph!
    this.pedestrians = []; // Lightweight sidewalk pedestrians (<= 240, pure data, zero Three.js dependency)
    this._pedRoadPool = [];
    this._pedSpawnTimer = 0;
    this.spawnTimer = 0;
    this.trainTimer = 0;
    this.fireTimer = 0;
    this.aircraftTimer = 0;
    this.shipTimer = 2.0;
    this.signalClock = 0;
    this.modalTimer = 0;

    const N = GRID_SIZE * GRID_SIZE;
    this.roadDegree = new Uint8Array(N);
    this.tileOccupancy = new Uint8Array(N);
    this.elevOccupancy = new Uint8Array(N);
    this.rampMeta = new Map();
    this.lastRoadSignature = -1;
    this.lastGraphSignature = -1;

    // Preallocated 3-layer Dijkstra buffers (0..N-1 ground, N..2N-1 viaduct, 2N..3N-1 sloped ramp)
    this._dijkDist = new Float32Array(N * 3);
    this._dijkPrev = new Int32Array(N * 3);
    this._dijkClosed = new Uint8Array(N * 3);
    this._heapNodes = new Int32Array(N * 3 + 8);
    this._heapCosts = new Float32Array(N * 3 + 8);

    this.modalSplit = {
      rawCarDemand: 0,
      targetRoadVehicles: 0,
      metroSharePct: 0,
      busSharePct: 0,
      transitPolicyPct: 0,
      walkSharePct: 0,
      seaportFreightPct: 0,
      activeCommuters: 0,
      activeFreight: 0,
      activeService: 0,
      activeTransit: 0,
      gridlockTimeouts: 0,
      trafficPeriod: null
    };
  }

  reset() {
    this.vehicles.length = 0;
    this.trains.length = 0;
    this.aircraft.length = 0;
    this.ships.length = 0;
    this.busStops.length = 0;
    this.pedestrians.length = 0;
    this._pedRoadPool.length = 0;
    this._pedSpawnTimer = 0;
    this.aircraftTimer = 0;
    this.shipTimer = 2.0;
    this.modalTimer = 0;
    this.tileOccupancy.fill(0);
    this.elevOccupancy.fill(0);
    this.rampMeta.clear();
    this.lastRoadSignature = -1;
    this.lastGraphSignature = -1;
    this.modalSplit.rawCarDemand = 0;
    this.modalSplit.targetRoadVehicles = 0;
    this.modalSplit.metroSharePct = 0;
    this.modalSplit.busSharePct = 0;
    this.modalSplit.transitPolicyPct = 0;
    this.modalSplit.walkSharePct = 0;
    this.modalSplit.seaportFreightPct = 0;
    this.modalSplit.activeCommuters = 0;
    this.modalSplit.activeFreight = 0;
    this.modalSplit.activeService = 0;
    this.modalSplit.activeTransit = 0;
    this.modalSplit.gridlockTimeouts = 0;
    this.modalSplit.trafficPeriod = null;
  }

  findVehicleNearWorld(wx, wz, maxDist = 0.58) {
    let best = null;
    let bestD2 = maxDist * maxDist;
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (!v || v.inTunnel) continue;
      const dx = v.wx - wx;
      const dz = v.wz - wz;
      const d2 = dx * dx + dz * dz;
      if (d2 <= bestD2) {
        bestD2 = d2;
        best = v;
      }
    }
    return best;
  }

  getEndpointName(ep) {
    if (!ep) return '未知地点';
    if (ep.portalName) return ep.portalName;
    if (ep.building) {
      if (typeof this.sim.getBuildingDisplayName === 'function') {
        const custom = this.sim.getBuildingDisplayName(ep.building, ep.bx, ep.bz);
        if (custom) return custom;
      }
      const FALLBACK_NAMES = {
        RL: '低密花园住宅',
        RH: '高层公寓社区',
        CL: '街区商业店铺',
        CH: '摩天商业中心',
        I: '现代工业厂房',
        O: '甲级写字楼',
        waste_plant: '环保垃圾焚烧厂',
        fire_station: '消防总署',
        police: '警察总局',
        hospital: '综合医院',
        school: '市立理工大学',
        seaport: '深水海港',
        hsr_station: '复兴号高铁站',
        airport: '国际民航机场',
        metro_station: '地下地铁站',
        stadium: '奥体中心',
        amusement_park: '滨海摩天轮乐园',
        landmark: '星海摩天地标'
      };
      return FALLBACK_NAMES[ep.building.type] || ep.building.type || '城市建筑';
    }
    return '城际高速入口';
  }

  refreshActiveModalCounts() {
    let commuters = 0;
    let freight = 0;
    let service = 0;
    let transit = 0;
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (v.tripType === 'freight') freight++;
      else if (v.tripType === 'service') service++;
      else if (v.tripType === 'transit' || v.kind === 'bus') transit++;
      else commuters++;
    }
    this.modalSplit.activeCommuters = commuters;
    this.modalSplit.activeFreight = freight;
    this.modalSplit.activeService = service;
    this.modalSplit.activeTransit = transit;
  }

  refreshModalSplitDemand() {
    const grid = this.sim.grid;
    if (!grid || !grid.length) return;

    let hasAnyRoad = false;
    let indJobs = 0;
    let rCount = 0;
    let walkableR = 0;
    let poweredMetro = 0;
    let activeSeaports = 0;
    let activeBusStops = 0;

    this._pedRoadPool.length = 0;
    const pedAttractorTypes = new Set([
      'RL', 'RH', 'CL', 'CH', 'O', 'park', 'metro_station', 'hsr_station',
      'stadium', 'amusement_park', 'school', 'hospital', 'landmark'
    ]);

    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      const passGround = this.isGroundRoadPassable(t);
      if (!hasAnyRoad && (passGround || t.roadElevated > 0)) {
        hasAnyRoad = true;
      }
      if (t.busStop && passGround && !t.dam && !t.ramp && t.roadGround !== 3 && t.roadGround !== 4) {
        activeBusStops++;
      }

      // Collect sidewalk pedestrian spawn candidates near populated zones, parks, bus stops & rail stations
      if (passGround && (t.roadGround === 1 || t.roadGround === 2) && !t.dam && !t.ramp) {
        let pedHotspot = Boolean(t.busStop);
        if (!pedHotspot) {
          for (let dz = -2; dz <= 2 && !pedHotspot; dz++) {
            const nz = t.z + dz;
            if (nz < 0 || nz >= GRID_SIZE) continue;
            const span = 2 - Math.abs(dz);
            for (let dx = -span; dx <= span; dx++) {
              const nx = t.x + dx;
              if (nx < 0 || nx >= GRID_SIZE) continue;
              const nb = grid[idx(nx, nz)].building;
              if (nb && !nb.abandoned && !nb.underConstruction && !nb.flooded && pedAttractorTypes.has(nb.type)) {
                pedHotspot = true;
                break;
              }
            }
          }
        }
        if (pedHotspot) {
          this._pedRoadPool.push({ x: t.x, z: t.z });
        }
      }

      const b = t.building;
      if (!b || b.underConstruction || b.abandoned || b.flooded) continue;

      if (b.type === 'I') {
        indJobs += typeof b.jobs === 'number' ? b.jobs : (b.level || 1) * 18;
      } else if (b.type === 'metro_station' && t.powered) {
        poweredMetro++;
      } else if (b.type === 'seaport') {
        activeSeaports++;
      } else if (b.type === 'RL' || b.type === 'RH') {
        rCount++;
        let nearCO = false;
        for (let dz = -6; dz <= 6 && !nearCO; dz++) {
          const span = 6 - Math.abs(dz);
          const nz = t.z + dz;
          if (nz < 0 || nz >= GRID_SIZE) continue;
          for (let dx = -span; dx <= span; dx++) {
            const nx = t.x + dx;
            if (nx < 0 || nx >= GRID_SIZE) continue;
            const nb = grid[idx(nx, nz)].building;
            if (nb && !nb.underConstruction && !nb.abandoned &&
                (nb.type === 'CL' || nb.type === 'CH' || nb.type === 'O')) {
              nearCO = true;
              break;
            }
          }
        }
        if (nearCO) walkableR++;
      }
    }

    if (typeof this.sim.industrialJobs === 'number') {
      indJobs = this.sim.industrialJobs;
    }

    const pop = this.sim.population || 0;
    const rawDemand = hasAnyRoad
      ? Math.max(6, Math.min(165, Math.round(pop / 35 + indJobs / 28)))
      : 0;

    const walkSharePct = rCount > 0
      ? Math.min(22, Math.round((walkableR / rCount) * 22))
      : 0;

    let metroSharePct = 0;
    if (poweredMetro >= 2) {
      const neededStations = Math.max(4, 2 + pop / 2500);
      metroSharePct = Math.min(48, Math.round(Math.min(1, poweredMetro / neededStations) * 48));
    }

    const freeTransit = Boolean(this.sim.policies?.freeTransit);
    const busSharePct = activeBusStops >= 2
      ? Math.min(26, Math.round((6 + activeBusStops * 3.2) * (freeTransit ? 1.35 : 1.0)))
      : 0;

    // Free Public Transit policy reduces private road car traffic volume by -22%!
    const transitPolicyPct = freeTransit ? 22 : 0;
    const seaportFreightPct = (this.sim.hasSeaport || activeSeaports > 0) ? 35 : 0;

    const period = typeof this.sim.getTrafficPeriodInfo === 'function'
      ? this.sim.getTrafficPeriodInfo()
      : { id: 'normal', icon: '🌤️', label: '平峰顺畅', mult: 1.0, commuteBias: 'balanced' };

    const modalReduction = Math.min(0.68, (walkSharePct + metroSharePct + busSharePct) * 0.0075);
    const freeTransitMult = freeTransit ? 0.78 : 1.0; // Exact -22% road volume reduction!
    const baseTarget = rawDemand * (1 - modalReduction) * freeTransitMult;
    const minFleet = activeBusStops >= 2 ? 4 : 3;
    const targetRoadVehicles = hasAnyRoad
      ? Math.max(minFleet, Math.min(185, Math.round(baseTarget * (period.mult || 1.0))))
      : 0;

    this.modalSplit.rawCarDemand = rawDemand;
    this.modalSplit.targetRoadVehicles = targetRoadVehicles;
    this.modalSplit.walkSharePct = walkSharePct;
    this.modalSplit.metroSharePct = metroSharePct;
    this.modalSplit.busSharePct = busSharePct;
    this.modalSplit.transitPolicyPct = transitPolicyPct;
    this.modalSplit.seaportFreightPct = seaportFreightPct;
    this.modalSplit.trafficPeriod = period;
    this.refreshActiveModalCounts();
  }

  isGroundRoadPassable(tile) {
    if (!tile || !(tile.roadGround > 0)) return false;
    if (tile.dam) return true;
    const wd = this.sim.waterDepth ? this.sim.waterDepth[idx(tile.x, tile.z)] : 0;
    if (tile.roadBridge) {
      return wd <= 1.35;
    }
    return !(wd > 0.28);
  }

  isGroundStepAllowedByOneWay(curT, nxtT, stepDir) {
    // stepDir: 0=N(-Z), 1=S(+Z), 2=W(-X), 3=E(+X); oppDir = stepDir ^ 1
    if (!curT || !nxtT) return false;
    const oppDir = stepDir ^ 1;
    if (typeof curT.roadDir === 'number' && curT.roadDir >= 0 && curT.roadDir === oppDir) {
      return false;
    }
    if (typeof nxtT.roadDir === 'number' && nxtT.roadDir >= 0 && nxtT.roadDir === oppDir) {
      return false;
    }
    return true;
  }

  computeRoadSignature() {
    const grid = this.sim.grid;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      const flooded = t.roadGround > 0 && !this.isGroundRoadPassable(t);
      const dirBits = ((typeof t.roadDir === 'number' ? t.roadDir : -1) + 1) & 7;
      const code =
        (t.roadGround & 7) |
        ((t.roadElevated & 3) << 3) |
        (t.ramp ? 16 : 0) |
        ((t.rail & 3) << 5) |
        (t.metro ? 128 : 0) |
        (t.dam ? 256 : 0) |
        (t.roadBridge ? 512 : 0) |
        (flooded ? 1024 : 0) |
        (dirBits << 11) |
        (t.banTrucks ? 16384 : 0) |
        (t.busStop ? 32768 : 0);
      h ^= code;
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  ensureRampGraphFresh() {
    if (!this.sim.grid || !this.sim.grid.length) return;
    const sig = this.computeRoadSignature();
    if (sig !== this.lastGraphSignature) {
      this.lastGraphSignature = sig;
      this.buildRampAndDegreeGraph();
    }
  }

  buildRampAndDegreeGraph() {
    const grid = this.sim.grid;
    this.rampMeta.clear();
    this.busStops.length = 0;
    if (!grid || !grid.length) return;

    const N = GRID_SIZE * GRID_SIZE;
    for (let i = 0; i < N; i++) {
      const t = grid[i];
      if (t.busStop && this.isGroundRoadPassable(t) && !t.dam && !t.ramp && t.roadGround !== 3 && t.roadGround !== 4) {
        this.busStops.push({
          rx: t.x,
          rz: t.z,
          bx: t.x,
          bz: t.z,
          building: null,
          portalName: `智能公交站 (${t.x},${t.z})`
        });
      }
    }
    const visitedRamp = new Uint8Array(N);
    const isValidRampTile = (t) => Boolean(t && t.ramp && t.roadElevated > 0 && this.isGroundRoadPassable(t));

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const startIdx = idx(x, z);
        if (visitedRamp[startIdx] || !isValidRampTile(grid[startIdx])) continue;

        const hasNSRamp =
          (inBounds(x, z - 1) && isValidRampTile(grid[idx(x, z - 1)])) ||
          (inBounds(x, z + 1) && isValidRampTile(grid[idx(x, z + 1)]));
        const hasEWRamp =
          (inBounds(x - 1, z) && isValidRampTile(grid[idx(x - 1, z)])) ||
          (inBounds(x + 1, z) && isValidRampTile(grid[idx(x + 1, z)]));

        let axisNS = false;
        if (hasNSRamp && !hasEWRamp) {
          axisNS = true;
        } else if (hasEWRamp && !hasNSRamp) {
          axisNS = false;
        } else {
          const tN = this.sim.getTile(x, z - 1);
          const tS = this.sim.getTile(x, z + 1);
          const tW = this.sim.getTile(x - 1, z);
          const tE = this.sim.getTile(x + 1, z);

          const eN = Boolean(tN && tN.roadElevated > 0 && !tN.ramp);
          const eS = Boolean(tS && tS.roadElevated > 0 && !tS.ramp);
          const eW = Boolean(tW && tW.roadElevated > 0 && !tW.ramp);
          const eE = Boolean(tE && tE.roadElevated > 0 && !tE.ramp);

          const gN = this.isGroundRoadPassable(tN);
          const gS = this.isGroundRoadPassable(tS);
          const gW = this.isGroundRoadPassable(tW);
          const gE = this.isGroundRoadPassable(tE);

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

        let sx = x, sz = z;
        while (inBounds(sx + RAMP_DIRS[dirA].dx, sz + RAMP_DIRS[dirA].dz) &&
               isValidRampTile(grid[idx(sx + RAMP_DIRS[dirA].dx, sz + RAMP_DIRS[dirA].dz)])) {
          sx += RAMP_DIRS[dirA].dx;
          sz += RAMP_DIRS[dirA].dz;
        }

        const chain = [];
        let cx = sx, cz = sz;
        while (inBounds(cx, cz) && isValidRampTile(grid[idx(cx, cz)])) {
          const ci = idx(cx, cz);
          visitedRamp[ci] = 1;
          chain.push({ x: cx, z: cz, i: ci });
          cx += RAMP_DIRS[dirB].dx;
          cz += RAMP_DIRS[dirB].dz;
        }

        const first = chain[0];
        const last = chain[chain.length - 1];
        const nA = this.sim.getTile(first.x + RAMP_DIRS[dirA].dx, first.z + RAMP_DIRS[dirA].dz);
        const nB = this.sim.getTile(last.x + RAMP_DIRS[dirB].dx, last.z + RAMP_DIRS[dirB].dz);
        const elevA = Boolean(nA && nA.roadElevated > 0 && !nA.ramp);
        const elevB = Boolean(nB && nB.roadElevated > 0 && !nB.ramp);

        let mode = 'bridgehead';
        let highDir = dirA;
        let lowDir = dirB;
        let throughGround = false;
        let throughElev = false;

        if (elevA && elevB) {
          mode = 'mid_slip';
          highDir = dirA;
          lowDir = dirB;
          throughElev = true;
          throughGround = this.isGroundRoadPassable(nA) || this.isGroundRoadPassable(nB);
        } else if (elevA || elevB) {
          const dirH = elevA ? dirA : dirB;
          const nHigh = elevA ? nA : nB;
          highDir = dirH;
          lowDir = RAMP_DIRS[dirH].opp;
          throughElev = false;
          throughGround = this.isGroundRoadPassable(nHigh);
          mode = throughGround ? 'median_split' : 'bridgehead';
        } else {
          const gA = this.isGroundRoadPassable(nA);
          const gB = this.isGroundRoadPassable(nB);
          lowDir = gA ? dirA : (gB ? dirB : dirB);
          highDir = RAMP_DIRS[lowDir].opp;
          mode = 'bridgehead';
          throughGround = false;
          throughElev = false;
        }

        const ordered = lowDir === dirA ? chain : chain.slice().reverse();
        const K = ordered.length;
        const lowEnd = ordered[0];
        const highEnd = ordered[K - 1];
        const lowNb = this.sim.getTile(lowEnd.x + RAMP_DIRS[lowDir].dx, lowEnd.z + RAMP_DIRS[lowDir].dz);
        const highNb = this.sim.getTile(highEnd.x + RAMP_DIRS[highDir].dx, highEnd.z + RAMP_DIRS[highDir].dz);
        const lowRef = (lowNb && this.isGroundRoadPassable(lowNb))
          ? { x: lowNb.x, z: lowNb.z }
          : { x: lowEnd.x, z: lowEnd.z };
        const highRef = (highNb && highNb.roadElevated > 0)
          ? { x: highNb.x, z: highNb.z }
          : { x: highEnd.x, z: highEnd.z };

        for (let k = 0; k < K; k++) {
          this.rampMeta.set(ordered[k].i, {
            mode,
            highDir,
            lowDir,
            lowFrac: k / K,
            highFrac: (k + 1) / K,
            chainLen: K,
            throughGround,
            throughElev,
            lowRef,
            highRef
          });
        }
      }
    }

    // Compute ground road intersection degrees respecting ramp barriers & throughGround corridors
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        const ct = grid[i];
        if (!this.isGroundRoadPassable(ct)) {
          this.roadDegree[i] = 0;
          continue;
        }
        const crm = ct.ramp ? this.rampMeta.get(i) : null;
        if (ct.ramp && !crm) {
          this.roadDegree[i] = 0;
          continue;
        }
        let deg = 0;
        for (let d = 0; d < 4; d++) {
          if (crm) {
            if (crm.throughGround) {
              if (d !== crm.lowDir && d !== crm.highDir) continue;
            } else {
              if (!(crm.lowFrac === 0 && d === crm.lowDir)) continue;
            }
          }
          const nx = x + RAMP_DIRS[d].dx;
          const nz = z + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          const nt = grid[ni];
          if (!this.isGroundRoadPassable(nt)) continue;
          if (nt.ramp) {
            const nrm = this.rampMeta.get(ni);
            if (!nrm) continue;
            const oppD = RAMP_DIRS[d].opp;
            if (nrm.throughGround) {
              if (oppD !== nrm.lowDir && oppD !== nrm.highDir) continue;
            } else {
              if (!(nrm.lowFrac === 0 && oppD === nrm.lowDir)) continue;
            }
          }
          deg++;
        }
        this.roadDegree[i] = deg;
      }
    }
  }

  isValidRoadStep(node, nextNode = null) {
    if (!node) return false;
    const tile = this.sim.getTile(node.x, node.z);
    if (!tile) return false;

    if (node.onRamp) {
      if (!(tile.ramp === true && tile.roadElevated > 0 && this.isGroundRoadPassable(tile))) {
        return false;
      }
    } else if (node.layer === 0) {
      if (!this.isGroundRoadPassable(tile)) return false;
      if (node.onRamp === false && tile.ramp) {
        this.ensureRampGraphFresh();
        const rm = this.rampMeta.get(idx(node.x, node.z));
        if (!rm || !rm.throughGround) return false;
      }
    } else if (node.layer === 1) {
      if (!(tile.roadElevated > 0)) return false;
      if (node.onRamp === false && tile.ramp) {
        this.ensureRampGraphFresh();
        const rm = this.rampMeta.get(idx(node.x, node.z));
        if (!rm || !rm.throughElev) return false;
      }
    } else {
      return false;
    }

    if (nextNode) {
      if (!this.isValidRoadStep(nextNode, null)) return false;
      const nextTile = this.sim.getTile(nextNode.x, nextNode.z);
      if (!nextTile) return false;

      if (node.layer !== nextNode.layer) {
        if (tile.ramp !== true && nextTile.ramp !== true) return false;
      }

      // Strict one-way enforcement on ground-to-ground road steps
      if (!node.onRamp && !nextNode.onRamp && node.layer === 0 && nextNode.layer === 0) {
        const dx = nextNode.x - node.x;
        const dz = nextNode.z - node.z;
        if (Math.abs(dx) + Math.abs(dz) === 1) {
          const stepDir = dx === 1 ? 3 : (dx === -1 ? 2 : (dz === 1 ? 1 : 0));
          if (!this.isGroundStepAllowedByOneWay(tile, nextTile, stepDir)) return false;
        }
      }

      if (node.onRamp || nextNode.onRamp) {
        this.ensureRampGraphFresh();
        const dx = nextNode.x - node.x;
        const dz = nextNode.z - node.z;
        if (node.onRamp) {
          const rm = this.rampMeta.get(idx(node.x, node.z));
          if (!rm) return false;
          const hDir = RAMP_DIRS[rm.highDir];
          const lDir = RAMP_DIRS[rm.lowDir];
          if (nextNode.layer === 1) {
            if (!(dx === hDir.dx && dz === hDir.dz && Math.abs(rm.highFrac - 1.0) < 1e-5)) return false;
          } else if (!nextNode.onRamp && nextNode.layer === 0) {
            if (!(dx === lDir.dx && dz === lDir.dz && Math.abs(rm.lowFrac) < 1e-5)) return false;
          } else if (nextNode.onRamp) {
            if (!((dx === hDir.dx && dz === hDir.dz) || (dx === lDir.dx && dz === lDir.dz))) return false;
          }
        }
        if (nextNode.onRamp && !node.onRamp) {
          const nrm = this.rampMeta.get(idx(nextNode.x, nextNode.z));
          if (!nrm) return false;
          const hDir = RAMP_DIRS[nrm.highDir];
          const lDir = RAMP_DIRS[nrm.lowDir];
          if (node.layer === 1) {
            if (!(-dx === hDir.dx && -dz === hDir.dz && Math.abs(nrm.highFrac - 1.0) < 1e-5)) return false;
          } else if (node.layer === 0) {
            if (!(-dx === lDir.dx && -dz === lDir.dz && Math.abs(nrm.lowFrac) < 1e-5)) return false;
          }
        }
      }
    }
    return true;
  }

  getPhysicalVehicleNode(v, cur, nxt) {
    const useNext = (v.t || 0) >= 0.5;
    const physLayer = useNext ? nxt.layer : cur.layer;
    const physOnRamp = useNext ? Boolean(nxt.onRamp) : Boolean(cur.onRamp);

    const clampedT = Math.min(1, Math.max(0, v.t || 0));
    const w0 = tileToWorld(cur.x, cur.z);
    const w1 = tileToWorld(nxt.x, nxt.z);
    const cx = w0.wx + (w1.wx - w0.wx) * clampedT;
    const cz = w0.wz + (w1.wz - w0.wz) * clampedT;
    const offDist = Math.hypot((v.wx || 0) - cx, (v.wz || 0) - cz);

    // Snap physical check to cur/nxt within corridor width (0.72m covers median_split 0.39 & mid_slip 0.68 & diagonal dams)
    if (offDist <= 0.72) {
      const ref = useNext ? nxt : cur;
      return { x: ref.x, z: ref.z, layer: physLayer, onRamp: physOnRamp };
    }
    const pt = worldToTile(v.wx, v.wz);
    return { x: pt.x, z: pt.z, layer: physLayer, onRamp: physOnRamp };
  }

  isVehiclePathValidAhead(v) {
    if (!v || !v.path || v.seg >= v.path.length - 1) return false;
    const isHeavyTruck = v.kind === 'truck' || v.kind === 'garbagetruck';
    for (let k = v.seg; k < v.path.length - 1; k++) {
      if (!this.isValidRoadStep(v.path[k], v.path[k + 1])) return false;
      if (isHeavyTruck && k + 1 < v.path.length - 1) {
        const nxt = v.path[k + 1];
        if (nxt.layer === 0 && !nxt.onRamp) {
          const nt = this.sim.getTile(nxt.x, nxt.z);
          if (nt && nt.banTrucks === true) return false;
        }
      }
    }
    return true;
  }

  evalHalfTileHeight(node, towardNode, distFromCenter) {
    if (node.onRamp) {
      const rm = this.rampMeta.get(idx(node.x, node.z));
      if (rm) {
        const yGround = this.getRoadNodeY(rm.lowRef.x, rm.lowRef.z, 0);
        const yElev = this.getRoadNodeY(rm.highRef.x, rm.highRef.z, 1);
        const stepDx = towardNode.x - node.x;
        const stepDz = towardNode.z - node.z;
        const hDir = RAMP_DIRS[rm.highDir];
        const goingHigh = stepDx === hDir.dx && stepDz === hDir.dz;
        const s = Math.min(1, Math.max(0, goingHigh ? (0.5 + 0.5 * distFromCenter) : (0.5 - 0.5 * distFromCenter)));
        const f = rm.lowFrac + (rm.highFrac - rm.lowFrac) * s;
        const ease = f * f * (3.0 - 2.0 * f);
        return yGround + (yElev - yGround) * ease;
      }
    }

    const y0 = this.getRoadNodeY(node.x, node.z, node.layer);
    if (towardNode.onRamp) {
      return y0;
    }
    const y1 = this.getRoadNodeY(towardNode.x, towardNode.z, towardNode.layer);
    return y0 + 0.5 * (y1 - y0) * distFromCenter;
  }

  sampleSegmentHeight(p0, p1, t) {
    const ct = Math.min(1, Math.max(0, t));
    if (!p0.onRamp && !p1.onRamp) {
      const y0 = this.getRoadNodeY(p0.x, p0.z, p0.layer);
      const y1 = this.getRoadNodeY(p1.x, p1.z, p1.layer);
      return (1 - ct) * y0 + ct * y1;
    }
    this.ensureRampGraphFresh();
    if (ct <= 0.5) {
      return this.evalHalfTileHeight(p0, p1, ct * 2.0);
    }
    return this.evalHalfTileHeight(p1, p0, (1.0 - ct) * 2.0);
  }

  getTargetLaneOffset(v, p0, p1) {
    this.ensureRampGraphFresh();
    const i0 = idx(p0.x, p0.z);
    const i1 = idx(p1.x, p1.z);
    const t0 = this.sim.getTile(p0.x, p0.z);
    const t1 = this.sim.getTile(p1.x, p1.z);
    const clampedT = Math.min(1, Math.max(0, v.t || 0));

    const stdOffFor = (node, tile) => {
      const multi = node.layer === 1 || (tile && tile.roadGround >= 2 && tile.roadGround !== 4);
      return multi ? (v.laneSlot === 1 ? 0.24 : 0.11) : 0.17;
    };

    // 1. Sloped Ramp Deck vehicle: median_split=0.10, mid_slip=0.68, bridgehead=0.15
    if (p0.onRamp || p1.onRamp) {
      const rm = p0.onRamp ? this.rampMeta.get(i0) : this.rampMeta.get(i1);
      const rampOff = rm?.mode === 'median_split' ? 0.10 : (rm?.mode === 'mid_slip' ? 0.68 : 0.15);
      if (p0.onRamp && p1.onRamp) {
        return rampOff;
      }
      if (!p0.onRamp && p1.onRamp) {
        const base0 = stdOffFor(p0, t0);
        const blend = Math.min(1, clampedT * 1.85);
        return base0 + (rampOff - base0) * (blend * blend * (3 - 2 * blend));
      }
      if (rm?.mode === 'median_split') v.laneSlot = 0;
      else if (rm?.mode === 'mid_slip') v.laneSlot = 1;
      const base1 = stdOffFor(p1, t1);
      const blend = Math.max(0, (clampedT - 0.45) / 0.55);
      return rampOff + (base1 - rampOff) * (blend * blend * (3 - 2 * blend));
    }

    const isOneWayPair =
      p0.layer === 0 && p1.layer === 0 &&
      t0 && t1 &&
      typeof t0.roadDir === 'number' && t0.roadDir >= 0 &&
      typeof t1.roadDir === 'number' && t1.roadDir >= 0;
    if (isOneWayPair) {
      return v.laneSlot === 1 ? 0.18 : -0.16;
    }

    const isMultiLane =
      p0.layer === 1 ||
      p1.layer === 1 ||
      (t0 && t0.roadGround >= 2 && t0.roadGround !== 4) ||
      (t1 && t1.roadGround >= 2 && t1.roadGround !== 4);

    let laneOff = isMultiLane ? (v.laneSlot === 1 ? 0.24 : 0.11) : 0.17;

    // 2. Ground underpass boulevard flare (0.39) around central median_split ramp
    if (p0.layer === 0 && p1.layer === 0) {
      const rm0 = t0?.ramp ? this.rampMeta.get(i0) : null;
      const rm1 = t1?.ramp ? this.rampMeta.get(i1) : null;
      const split0 = Boolean(rm0 && rm0.throughGround && rm0.mode === 'median_split');
      const split1 = Boolean(rm1 && rm1.throughGround && rm1.mode === 'median_split');
      if (split0 || split1) {
        if (split0 && !split1 && isMultiLane) {
          v.laneSlot = 1;
          laneOff = 0.24;
        }
        if (split0 && split1) return 0.39;
        if (!split0 && split1) {
          const blend = Math.min(1, clampedT * 1.85);
          return laneOff + (0.39 - laneOff) * (blend * blend * (3 - 2 * blend));
        }
        const blend = Math.max(0, (clampedT - 0.45) / 0.55);
        return 0.39 + (laneOff - 0.39) * (blend * blend * (3 - 2 * blend));
      }
    }

    // 3. Smooth outward arc bulge (+0.08) around roundabout hub center (only when hub degree >= 3)
    const r0 = p0.layer === 0 && t0?.junctionMode === 'roundabout' && this.roadDegree[i0] >= 3;
    const r1 = p1.layer === 0 && t1?.junctionMode === 'roundabout' && this.roadDegree[i1] >= 3;
    if (r0 || r1) {
      let rWeight = 1.0;
      if (r0 && !r1) {
        rWeight = Math.cos(clampedT * Math.PI * 0.5);
      } else if (!r0 && r1) {
        rWeight = Math.sin(clampedT * Math.PI * 0.5);
      }
      laneOff += 0.08 * rWeight;
    }
    return Math.min(0.34, laneOff);
  }

  syncVehicleTransform(v, effDt = 0) {
    const p0 = v.path[v.seg];
    const p1 = v.path[v.seg + 1];
    if (!p0 || !p1) return;
    const w0 = tileToWorld(p0.x, p0.z);
    const w1 = tileToWorld(p1.x, p1.z);
    const vx = w1.wx - w0.wx;
    const vz = w1.wz - w0.wz;
    const len = Math.hypot(vx, vz);

    if (len > 0.01) {
      const targetDirX = vx / len;
      const targetDirZ = vz / len;
      if (effDt <= 0) {
        v.dirX = targetDirX;
        v.dirZ = targetDirZ;
      } else {
        // Smooth steering interpolation so corners & roundabouts turn gracefully instead of snapping!
        const steerRate = Math.min(1, effDt * 14);
        v.dirX += (targetDirX - v.dirX) * steerRate;
        v.dirZ += (targetDirZ - v.dirZ) * steerRate;
        const dl = Math.hypot(v.dirX, v.dirZ) || 1;
        v.dirX /= dl;
        v.dirZ /= dl;
      }
    }

    const rightX = -v.dirZ;
    const rightZ = v.dirX;
    const targetLaneOff = this.getTargetLaneOffset(v, p0, p1);
    if (effDt <= 0 || v.curLaneOff === undefined) {
      v.curLaneOff = targetLaneOff;
    } else {
      v.curLaneOff += (targetLaneOff - v.curLaneOff) * Math.min(1, effDt * 10.0);
    }
    const laneOff = v.curLaneOff;

    v.wx = w0.wx + vx * v.t + rightX * laneOff;
    v.wz = w0.wz + vz * v.t + rightZ * laneOff;
    v.wy = this.sampleSegmentHeight(p0, p1, v.t);

    // Finite-difference 3D slope pitch across exact Hermite ramp & terrain profile!
    const tLo = Math.max(0, (v.t || 0) - 0.05);
    const tHi = Math.min(1, (v.t || 0) + 0.05);
    const dtSpan = tHi - tLo;
    const dy = dtSpan > 1e-4 ? (this.sampleSegmentHeight(p0, p1, tHi) - this.sampleSegmentHeight(p0, p1, tLo)) : 0;
    const rawSlope = (len > 0.05 && dtSpan > 1e-4) ? Math.atan2(dy, dtSpan * len) : 0;
    v.pitch = effDt <= 0 ? rawSlope : ((v.pitch || 0) * 0.78 + rawSlope * 0.22);
    v.inTunnel = p0.layer === 0 && !p0.onRamp && this.sim.getTile(p0.x, p0.z)?.roadGround === 4;
  }

  tryRerouteVehicle(v) {
    const cur = v.path && v.path[v.seg];
    const nxt = v.path && v.path[v.seg + 1];
    if (!cur || !this.isValidRoadStep(cur, null)) return false;
    // Do not vertically snap an airborne ramp vehicle back to ground if its ramp was demolished mid-climb
    if (nxt && (cur.layer !== nxt.layer || Boolean(cur.onRamp) !== Boolean(nxt.onRamp)) && v.t > 0.35) {
      if (!this.isValidRoadStep(nxt, null)) return false;
    }
    const last = v.path[v.path.length - 1];
    if (!last) return false;

    const startOnRamp = Boolean(cur.onRamp);
    const startLayer = cur.layer || 0;
    const isHeavyTruck = v.kind === 'truck' || v.kind === 'garbagetruck';
    let newPath = this.findRoadPath(cur.x, cur.z, last.x, last.z, startOnRamp, startLayer, isHeavyTruck);
    if ((!newPath || newPath.length < 2) && v.kind === 'firetruck' && v.fireTargetIdx !== undefined) {
      const bt = this.sim.grid[v.fireTargetIdx];
      if (bt && bt.building && bt.building.fire > 0 && typeof this.sim.findRoadAccess === 'function') {
        const altAcc = this.sim.findRoadAccess(bt.x, bt.z);
        if (altAcc) {
          newPath = this.findRoadPath(cur.x, cur.z, altAcc.rx, altAcc.rz, startOnRamp, startLayer, false);
        }
      }
    }
    if (newPath && newPath.length >= 2) {
      v.path = newPath;
      v.seg = 0;
      v.t = 0;
      this.syncVehicleTransform(v, 0);
      return true;
    }
    return false;
  }

  isValidTrainSpan(tr) {
    if (!tr || !tr.path || tr.path.length < 2) return false;
    for (let k = 0; k < tr.path.length; k++) {
      const node = tr.path[k];
      if (!node) return false;
      const t = this.sim.getTile(node.x, node.z);
      if (!t) return false;
      if (tr.isMetro) {
        if (t.metro !== true) return false;
      } else {
        if (!(t.rail > 0)) return false;
      }
    }
    return true;
  }

  isNavigableShipPoint(wx, wz) {
    const pt = worldToTile(wx, wz);
    if (!inBounds(pt.x, pt.z)) return false;
    const si = idx(pt.x, pt.z);
    return this.sim.waterDepth[si] > 0.08 && !this.sim.grid[si].dam;
  }

  isValidShipState(ship) {
    if (!ship || !ship.waypoints || ship.waypoints.length < 2) return false;

    // Active non-abandoned seaport must still exist at (ship.portX, ship.portZ)
    const portTile = this.sim.getTile(ship.portX, ship.portZ);
    const portB = portTile?.building;
    if (!portB || portB.type !== 'seaport' || portB.abandoned || portB.underConstruction || portB.flooded) {
      return false;
    }
    if (typeof this.sim.hasNearbyWater === 'function' && !this.sim.hasNearbyWater(ship.portX, ship.portZ, 2).found) {
      return false;
    }

    // Center of 3D ship hull must remain in navigable water (waterDepth > 0.08 and no dam)
    if (!this.isNavigableShipPoint(ship.wx, ship.wz)) return false;
    const wps = ship.waypoints;
    const tryRerouteShip = () => {
      const dest = wps[wps.length - 1];
      if (!dest) return false;
      const curTile = worldToTile(ship.wx, ship.wz);
      const alt = this.findWaterPath(curTile.x, curTile.z, dest.x, dest.z);
      if (alt && alt.length >= 2) {
        alt[0].wx = ship.wx;
        alt[0].wz = ship.wz;
        ship.waypoints = alt;
        ship.seg = 0;
        ship.t = 0;
        const adx = alt[1].wx - alt[0].wx;
        const adz = alt[1].wz - alt[0].wz;
        if (adx !== 0 || adz !== 0) {
          ship.yaw = Math.atan2(adx, adz);
          ship.dirX = Math.sin(ship.yaw);
          ship.dirZ = Math.cos(ship.yaw);
        }
        return true;
      }
      return false;
    };

    const dx = ship.dirX || 0;
    const dz = ship.dirZ || 0;
    if ((dx !== 0 || dz !== 0) && ship.leg !== 'berth' && !(ship.dwell > 0)) {
      if (!this.isNavigableShipPoint(ship.wx - dx * 0.55, ship.wz - dz * 0.55)) return false;
      if (!this.isNavigableShipPoint(ship.wx + dx * 0.65, ship.wz + dz * 0.65)) {
        return tryRerouteShip();
      }
    }

    // Current and remaining waypoints must also remain navigable deep water (reroute around new islands if possible)
    if (ship.dwell > 0 || ship.leg === 'berth') {
      const berthWp = wps[wps.length - 1];
      if (!berthWp || !inBounds(berthWp.x, berthWp.z)) return false;
      const bi = idx(berthWp.x, berthWp.z);
      if (!(this.sim.waterDepth[bi] > 0.08) || this.sim.grid[bi].dam) return false;
    } else {
      const p0 = wps[ship.seg];
      const p1 = wps[Math.min(wps.length - 1, ship.seg + 1)];
      if (!p0 || !p1 || !inBounds(p0.x, p0.z) || !inBounds(p1.x, p1.z)) return false;
      const i0 = idx(p0.x, p0.z);
      const i1 = idx(p1.x, p1.z);
      if (!(this.sim.waterDepth[i0] > 0.08) || this.sim.grid[i0].dam) return false;
      if (!(this.sim.waterDepth[i1] > 0.08) || this.sim.grid[i1].dam) {
        return tryRerouteShip();
      }

      for (let k = ship.seg + 2; k < wps.length; k++) {
        const wp = wps[k];
        if (!wp || !inBounds(wp.x, wp.z)) return false;
        const wi = idx(wp.x, wp.z);
        if (!(this.sim.waterDepth[wi] > 0.08) || this.sim.grid[wi].dam) {
          return tryRerouteShip();
        }
      }
    }
    return true;
  }

  isRunwayIntact(ax, az) {
    const t = this.sim.getTile(ax, az);
    if (!t) return false;
    const b = t.building;
    if (!b || b.type !== 'airport' || b.abandoned || b.underConstruction || b.flooded) {
      return false;
    }
    if (this.sim.waterDepth && this.sim.waterDepth[idx(ax, az)] > 0.08) {
      return false;
    }
    return true;
  }

  purgeInvalidShipsAndAircraft() {
    for (let i = this.ships.length - 1; i >= 0; i--) {
      if (!this.isValidShipState(this.ships[i])) {
        this.ships.splice(i, 1);
        this.shipTimer = 0;
      }
    }

    let anyActiveAirport = false;
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      const b = t.building;
      if (b && b.type === 'airport' && !b.abandoned && !b.underConstruction && t.powered && !b.flooded &&
          !(this.sim.waterDepth && this.sim.waterDepth[i] > 0.08)) {
        anyActiveAirport = true;
        break;
      }
    }
    if (!anyActiveAirport) {
      this.aircraft.length = 0;
      this.aircraftTimer = 0;
      return;
    }

    for (let i = this.aircraft.length - 1; i >= 0; i--) {
      const plane = this.aircraft[i];
      const onGroundOrFinal = plane.phase === 'rollout' || (plane.progress >= 0.25 && plane.progress <= 0.72);
      if (onGroundOrFinal && !this.isRunwayIntact(plane.ax, plane.az)) {
        this.aircraft.splice(i, 1);
      }
    }
  }

  revalidateActiveTransport() {
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      const cur = v.path && v.path[v.seg];
      if (!cur || !this.isValidRoadStep(cur, null)) {
        this.vehicles.splice(i, 1);
        continue;
      }
      const nxt = v.path[v.seg + 1];
      if (!nxt) {
        this.vehicles.splice(i, 1);
        continue;
      }
      const physNode = this.getPhysicalVehicleNode(v, cur, nxt);
      if (!this.isValidRoadStep(physNode, null)) {
        this.vehicles.splice(i, 1);
        continue;
      }
      if (!this.isValidRoadStep(nxt, null) || !this.isValidRoadStep(cur, nxt) || !this.isVehiclePathValidAhead(v)) {
        if (!this.tryRerouteVehicle(v)) {
          this.vehicles.splice(i, 1);
        }
      }
    }

    for (let i = this.trains.length - 1; i >= 0; i--) {
      if (!this.isValidTrainSpan(this.trains[i])) {
        this.trains.splice(i, 1);
      }
    }

    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      const p = this.pedestrians[i];
      const pt = this.sim.getTile(p.tx, p.tz);
      if (!pt || !(pt.roadGround === 1 || pt.roadGround === 2) || !this.isGroundRoadPassable(pt) || pt.dam || pt.ramp) {
        this.pedestrians.splice(i, 1);
      }
    }

    this.purgeInvalidShipsAndAircraft();
  }

  revalidateVehicles() {
    return this.revalidateActiveTransport();
  }

  refreshRoadGraph(precomputedSig = null) {
    const sig = precomputedSig !== null ? precomputedSig : this.computeRoadSignature();
    this.lastGraphSignature = sig;
    this.buildRampAndDegreeGraph();

    if (sig !== this.lastRoadSignature || this.sim.meshDirty) {
      this.lastRoadSignature = sig;
      this.revalidateActiveTransport();
    }
    this.refreshModalSplitDemand();
  }

  groundStepCost(nt, ni) {
    let cost = 1.18;
    if (nt.roadGround === 3) {
      cost = 0.56;
    } else if (nt.dam) {
      cost = 0.85;
    } else if (nt.roadGround === 4) {
      cost = 0.78 + (nt.congestion || 0) * 1.8;
    } else if (nt.roadGround === 2) {
      cost = 0.82 + (nt.congestion || 0) * 2.4;
    } else if (typeof nt.roadDir === 'number' && nt.roadDir >= 0) {
      // Express one-way street: faster flow & lower friction than two-way street!
      cost = 0.94 + (nt.congestion || 0) * 2.4;
    } else {
      cost = 1.18 + (nt.congestion || 0) * 3.2;
    }

    if (this.roadDegree[ni] >= 3) {
      const jm = nt.junctionMode || 'signal';
      if (jm === 'roundabout') cost += 0.05;
      else if (jm === 'yield') cost += 0.10;
      else cost += 0.34;
    }
    return cost;
  }

  // 3-State Travel-Time Dijkstra (0..N-1 ground, N..2N-1 viaduct, 2N..3N-1 sloped ramp; zero len=0 hops!)
  // Enforces strict one-way streets (roadDir >= 0) and optional heavy-truck ban avoidance (avoidTruckBan)
  findRoadPath(sx, sz, ex, ez, startOnRamp = false, startLayer = 0, avoidTruckBan = false) {
    if (!inBounds(sx, sz) || !inBounds(ex, ez)) return null;
    if (sx === ex && sz === ez && !startOnRamp && startLayer === 0) return null;

    this.ensureRampGraphFresh();
    const grid = this.sim.grid;
    const N = GRID_SIZE * GRID_SIZE;
    const sIdx = idx(sx, sz);
    const eIdx = idx(ex, ez);

    if (!this.isGroundRoadPassable(grid[eIdx])) return null;
    if (startLayer === 1 && !startOnRamp) {
      if (!(grid[sIdx].roadElevated > 0)) return null;
    } else if (!this.isGroundRoadPassable(grid[sIdx])) {
      return null;
    }

    let startState = startOnRamp ? (2 * N + sIdx) : (startLayer === 1 ? (N + sIdx) : sIdx);
    if (!startOnRamp && startLayer === 0 && grid[sIdx].ramp && !this.rampMeta.get(sIdx)?.throughGround) {
      if (!this.rampMeta.has(sIdx)) return null;
      startState = 2 * N + sIdx;
    }

    let endState = eIdx;
    if (grid[eIdx].ramp && !this.rampMeta.get(eIdx)?.throughGround) {
      if (!this.rampMeta.has(eIdx)) return null;
      endState = 2 * N + eIdx;
    }
    if (startState === endState) return null;

    const dist = this._dijkDist;
    const prev = this._dijkPrev;
    const closed = this._dijkClosed;
    dist.fill(1e9);
    prev.fill(-1);
    closed.fill(0);

    const heapNodes = this._heapNodes;
    const heapCosts = this._heapCosts;
    let heapSize = 0;

    const pushHeap = (state, cost) => {
      let pos = ++heapSize;
      while (pos > 1) {
        const parent = pos >> 1;
        if (heapCosts[parent] <= cost) break;
        heapNodes[pos] = heapNodes[parent];
        heapCosts[pos] = heapCosts[parent];
        pos = parent;
      }
      heapNodes[pos] = state;
      heapCosts[pos] = cost;
    };

    const popHeap = () => {
      const top = heapNodes[1];
      const lastNode = heapNodes[heapSize];
      const lastCost = heapCosts[heapSize];
      heapSize--;
      if (heapSize > 0) {
        let pos = 1;
        const half = heapSize >> 1;
        while (pos <= half) {
          let child = pos << 1;
          if (child < heapSize && heapCosts[child + 1] < heapCosts[child]) {
            child++;
          }
          if (lastCost <= heapCosts[child]) break;
          heapNodes[pos] = heapNodes[child];
          heapCosts[pos] = heapCosts[child];
          pos = child;
        }
        heapNodes[pos] = lastNode;
        heapCosts[pos] = lastCost;
      }
      return top;
    };

    const relax = (nextState, newCost, fromState) => {
      if (closed[nextState]) return;
      if (newCost < dist[nextState]) {
        dist[nextState] = newCost;
        prev[nextState] = fromState;
        pushHeap(nextState, newCost);
      }
    };

    dist[startState] = 0;
    pushHeap(startState, 0);

    const diagDamDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    let found = false;
    let expanded = 0;
    const maxExpand = N * 3;

    while (heapSize > 0 && expanded++ < maxExpand) {
      const cur = popHeap();
      if (closed[cur]) continue;
      closed[cur] = 1;

      if (cur === endState) {
        found = true;
        break;
      }

      const curCost = dist[cur];
      const stateType = cur >= 2 * N ? 2 : (cur >= N ? 1 : 0);
      const bi = cur - stateType * N;
      const cx = bi % GRID_SIZE;
      const cz = (bi / GRID_SIZE) | 0;
      const ct = grid[bi];
      const crm = ct.ramp ? this.rampMeta.get(bi) : null;

      if (stateType === 0) {
        // Ground state (layer: 0, onRamp: false)
        if (ct.ramp && (!crm || !crm.throughGround)) continue;

        for (let d = 0; d < 4; d++) {
          if (crm && d !== crm.lowDir && d !== crm.highDir) continue;
          const nx = cx + RAMP_DIRS[d].dx;
          const nz = cz + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          const nt = grid[ni];

          // Enforce strict one-way street direction on ground steps
          if (!this.isGroundStepAllowedByOneWay(ct, nt, d)) continue;
          // Enforce heavy-truck ban on intermediate tiles (allow only if ni is the final destination itself)
          if (avoidTruckBan && nt.banTrucks === true && ni !== eIdx) continue;

          if (!nt.ramp) {
            if (this.isGroundRoadPassable(nt)) {
              relax(ni, curCost + this.groundStepCost(nt, ni), cur);
            }
          } else {
            const nrm = this.rampMeta.get(ni);
            if (!nrm) continue;
            const oppD = RAMP_DIRS[d].opp;
            // 1) Continue straight on ground underpass/boulevard if throughGround
            if (nrm.throughGround && this.isGroundRoadPassable(nt) && (oppD === nrm.lowDir || oppD === nrm.highDir)) {
              relax(ni, curCost + this.groundStepCost(nt, ni), cur);
            }
            // 2) Enter sloped ramp deck strictly from its lowDir mouth (lowFrac === 0)
            if (oppD === nrm.lowDir && Math.abs(nrm.lowFrac) < 1e-5) {
              relax(2 * N + ni, curCost + 0.68, cur);
            }
          }
        }

        // Allow 8-way diagonal traversal along diagonal hydro_dam crests
        if (!ct.ramp && ct.dam && this.isGroundRoadPassable(ct)) {
          for (let k = 0; k < 4; k++) {
            const nx = cx + diagDamDirs[k][0];
            const nz = cz + diagDamDirs[k][1];
            if (!inBounds(nx, nz)) continue;
            const ni = idx(nx, nz);
            const nt = grid[ni];
            if (!nt.ramp && nt.dam && this.isGroundRoadPassable(nt)) {
              relax(ni, curCost + 1.20, cur);
            }
          }
        }
      } else if (stateType === 1) {
        // Elevated viaduct state (layer: 1, onRamp: false)
        if (ct.ramp && (!crm || !crm.throughElev)) continue;

        for (let d = 0; d < 4; d++) {
          if (crm && d !== crm.lowDir && d !== crm.highDir) continue;
          const nx = cx + RAMP_DIRS[d].dx;
          const nz = cz + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          const nt = grid[ni];

          if (!nt.ramp) {
            if (nt.roadElevated > 0) {
              const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
              relax(N + ni, curCost + eCost, cur);
            }
          } else {
            const nrm = this.rampMeta.get(ni);
            if (!nrm) continue;
            const oppD = RAMP_DIRS[d].opp;
            // 1) Continue along continuous elevated viaduct deck (mid_slip throughElev)
            if (nrm.throughElev && nt.roadElevated > 0 && (oppD === nrm.lowDir || oppD === nrm.highDir)) {
              const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
              relax(N + ni, curCost + eCost, cur);
            }
            // 2) Enter sloped ramp deck strictly from its highDir crest (highFrac === 1.0)
            if (oppD === nrm.highDir && Math.abs(nrm.highFrac - 1.0) < 1e-5) {
              relax(2 * N + ni, curCost + 0.68, cur);
            }
          }
        }
      } else {
        // Sloped Ramp Deck state (2N + bi -> emitted as { x, z, layer: 0, onRamp: true })
        if (!crm) continue;

        // Step toward highDir
        {
          const hd = crm.highDir;
          const nx = cx + RAMP_DIRS[hd].dx;
          const nz = cz + RAMP_DIRS[hd].dz;
          if (inBounds(nx, nz)) {
            const ni = idx(nx, nz);
            const nt = grid[ni];
            if (Math.abs(crm.highFrac - 1.0) < 1e-5) {
              const nrm = nt.ramp ? this.rampMeta.get(ni) : null;
              if (nt.roadElevated > 0 && (!nt.ramp || nrm?.throughElev)) {
                const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
                relax(N + ni, curCost + eCost, cur);
              }
            } else if (nt.ramp && this.rampMeta.has(ni)) {
              relax(2 * N + ni, curCost + 0.68, cur);
            }
          }
        }

        // Step toward lowDir
        {
          const ld = crm.lowDir;
          const nx = cx + RAMP_DIRS[ld].dx;
          const nz = cz + RAMP_DIRS[ld].dz;
          if (inBounds(nx, nz)) {
            const ni = idx(nx, nz);
            const nt = grid[ni];
            if (Math.abs(crm.lowFrac) < 1e-5) {
              const nrm = nt.ramp ? this.rampMeta.get(ni) : null;
              const truckOk = !(avoidTruckBan && nt.banTrucks === true && ni !== eIdx);
              if (truckOk && this.isGroundStepAllowedByOneWay(ct, nt, ld) && this.isGroundRoadPassable(nt) && (!nt.ramp || nrm?.throughGround)) {
                relax(ni, curCost + this.groundStepCost(nt, ni), cur);
              }
            } else if (nt.ramp && this.rampMeta.has(ni)) {
              relax(2 * N + ni, curCost + 0.68, cur);
            }
          }
        }
      }
    }

    if (!found) return null;

    const path = [];
    let cur = endState;
    while (cur !== -1) {
      const st = cur >= 2 * N ? 2 : (cur >= N ? 1 : 0);
      const bi = cur - st * N;
      path.push({
        x: bi % GRID_SIZE,
        z: (bi / GRID_SIZE) | 0,
        layer: st === 1 ? 1 : 0,
        onRamp: st === 2
      });
      if (cur === startState) break;
      cur = prev[cur];
    }
    path.reverse();
    return path.length >= 2 ? path : null;
  }

  // Rail / Metro 1-layer pathfinder
  findTrackPath(sx, sz, ex, ez, isMetro = false) {
    if (sx === ex && sz === ez) return null;
    const grid = this.sim.grid;
    const N = GRID_SIZE * GRID_SIZE;
    const sIdx = idx(sx, sz), eIdx = idx(ex, ez);
    const hasTrack = (t) => isMetro ? t.metro : t.rail > 0;
    if (!hasTrack(grid[sIdx]) || !hasTrack(grid[eIdx])) return null;

    const prev = new Int16Array(N).fill(-1);
    const vis = new Uint8Array(N);
    const q = [sIdx];
    vis[sIdx] = 1;

    let head = 0, found = false;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (head < q.length && head < 1800) {
      const cur = q[head++];
      if (cur === eIdx) { found = true; break; }
      const cx = cur % GRID_SIZE, cz = (cur / GRID_SIZE) | 0;
      for (const [dx, dz] of dirs) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (!vis[ni] && hasTrack(grid[ni])) {
          vis[ni] = 1;
          prev[ni] = cur;
          q.push(ni);
        }
      }
    }
    if (!found) return null;

    const path = [];
    let cur = eIdx;
    while (cur !== -1) {
      path.push({ x: cur % GRID_SIZE, z: (cur / GRID_SIZE) | 0 });
      if (cur === sIdx) break;
      cur = prev[cur];
    }
    path.reverse();
    return path.length >= 3 ? path : null;
  }

  getRoadNodeY(x, z, layer) {
    const t = this.sim.getTile(x, z);
    if (!t) return 0.35;
    const groundH = this.sim.getTileElev(x, z);
    const waterSurf = groundH + this.sim.waterDepth[idx(x, z)];

    if (layer === 1) {
      // Generous +1.15m Elevated Expressway Viaduct clearance above ground/water!
      return Math.max(groundH, waterSurf) + 1.15;
    }
    if (t.dam) {
      return t.damCrest + 0.03;
    }
    if (t.roadGround === 4) {
      return Math.min(groundH - 0.18, 0.40);
    }
    if (t.roadBridge && this.sim.isWaterTile(x, z)) {
      return waterSurf + 0.30;
    }
    return groundH + 0.03;
  }

  getRailNodeY(x, z, isMetro) {
    if (isMetro) return -0.46;
    const groundH = this.sim.getTileElev(x, z);
    const waterSurf = groundH + this.sim.waterDepth[idx(x, z)];
    const t = this.sim.getTile(x, z);
    if (this.sim.isWaterTile(x, z) || (t && t.roadGround > 0)) {
      return Math.max(groundH, waterSurf) + 0.82; // Generous HSR Viaduct clearance over roads/rivers!
    }
    return groundH + 0.12;
  }

  tryDispatchFireTruck() {
    // Check if any building is burning and not already targeted
    let burningTile = null;
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.building && t.building.fire > 0.05) {
        const already = this.vehicles.some((v) => v.kind === 'firetruck' && v.fireTargetIdx === i);
        if (!already) {
          burningTile = t;
          break;
        }
      }
    }
    if (!burningTile) return;

    const destAcc = this.sim.findRoadAccess(burningTile.x, burningTile.z);
    if (!destAcc) return;

    // Find nearest Fire Station with road access
    let bestPath = null;
    let bestStation = null;
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.building && t.building.type === 'fire_station' && t.powered) {
        const srcAcc = this.sim.findRoadAccess(t.x, t.z);
        if (!srcAcc) continue;
        const p = this.findRoadPath(srcAcc.rx, srcAcc.rz, destAcc.rx, destAcc.rz);
        if (p && (!bestPath || p.length < bestPath.length)) {
          bestPath = p;
          bestStation = t;
        }
      }
    }
    if (!bestPath || !bestStation) return;

    const fromName = this.getEndpointName({
      bx: bestStation.x,
      bz: bestStation.z,
      building: bestStation.building
    });
    const toName = this.getEndpointName({
      bx: burningTile.x,
      bz: burningTile.z,
      building: burningTile.building
    });

    const w0 = tileToWorld(bestPath[0].x, bestPath[0].z);
    const v = {
      kind: 'firetruck',
      fireTargetIdx: idx(burningTile.x, burningTile.z),
      tripType: 'service',
      tripLabel: '🚒 消防紧急出警',
      fromName,
      toName,
      originTile: { x: bestStation.x, z: bestStation.z },
      destTile: { x: burningTile.x, z: burningTile.z },
      color: [0.95, 0.14, 0.14],
      length: 0.38,
      width: 0.15,
      height: 0.15,
      path: bestPath,
      seg: 0,
      t: 0,
      speed: 2.6,
      maxSpeed: 2.8,
      stuckTimer: 0,
      laneSlot: 0,
      laneChangeCooldown: 0,
      wx: w0.wx,
      wy: this.getRoadNodeY(bestPath[0].x, bestPath[0].z, 0),
      wz: w0.wz,
      dirX: 0,
      dirZ: -1,
      inTunnel: false
    };
    this.syncVehicleTransform(v, 0);
    this.vehicles.push(v);
    this.refreshActiveModalCounts();
  }

  trySpawnVehicle() {
    this.ensureRampGraphFresh();
    if (this.modalSplit.rawCarDemand === 0) {
      this.refreshModalSplitDemand();
    }
    const maxCars = this.modalSplit.targetRoadVehicles;
    if (maxCars <= 0) return;

    const nonEmergencyCount = this.vehicles.reduce(
      (acc, v) => acc + (v.kind === 'firetruck' ? 0 : 1),
      0
    );
    if (nonEmergencyCount >= maxCars) return;

    const freeTransit = Boolean(this.sim.policies?.freeTransit);
    const period = typeof this.sim.getTrafficPeriodInfo === 'function'
      ? this.sim.getTrafficPeriodInfo()
      : { id: 'normal', mult: 1.0, commuteBias: 'balanced' };

    // 0. Priority EV City Bus Fleet Spawner between road-connected Bus Stops!
    if (this.busStops.length >= 2) {
      const activeBuses = this.vehicles.filter((v) => v.kind === 'bus').length;
      const targetBuses = Math.min(12, Math.max(2, Math.ceil(this.busStops.length * (freeTransit ? 1.5 : 1.0))));
      if (activeBuses < targetBuses && (activeBuses < 2 || Math.random() < (freeTransit ? 0.42 : 0.28))) {
        for (let attempt = 0; attempt < 4; attempt++) {
          const idxA = (Math.random() * this.busStops.length) | 0;
          let idxB = (Math.random() * (this.busStops.length - 1)) | 0;
          if (idxB >= idxA) idxB++;
          const stopA = this.busStops[idxA];
          const stopB = this.busStops[idxB];
          const busPath = this.findRoadPath(stopA.rx, stopA.rz, stopB.rx, stopB.rz, false, 0, false);
          if (busPath && busPath.length >= 2) {
            const w0 = tileToWorld(busPath[0].x, busPath[0].z);
            const maxSpeed = 1.72;
            const bv = {
              kind: 'bus',
              tripType: 'transit',
              tripLabel: '🚌 城市新能源公交专线',
              fromName: stopA.portalName,
              toName: stopB.portalName,
              originTile: { x: stopA.bx, z: stopA.bz },
              destTile: { x: stopB.bx, z: stopB.bz },
              color: [0.10, 0.72, 0.88],
              length: 0.42,
              width: 0.15,
              height: 0.15,
              path: busPath,
              seg: 0,
              t: 0,
              speed: maxSpeed * 0.65,
              maxSpeed,
              stuckTimer: 0,
              laneSlot: 0,
              laneChangeCooldown: 0,
              wx: w0.wx,
              wy: this.getRoadNodeY(busPath[0].x, busPath[0].z, busPath[0].layer),
              wz: w0.wz,
              dirX: 0,
              dirZ: -1,
              inTunnel: false
            };
            this.syncVehicleTransform(bv, 0);
            this.vehicles.push(bv);
            this.refreshActiveModalCounts();
            return;
          }
        }
      }
    }

    const endpoints = { R: [], SHOP: [], WORK: [], IND: [], PORT: [], HW: [], GATEWAY: [], W: [] };
    if (this.isGroundRoadPassable(this.sim.getTile(22, GRID_SIZE - 1))) {
      const hwEp = {
        rx: 22,
        rz: GRID_SIZE - 1,
        bx: 22,
        bz: GRID_SIZE - 1,
        building: null,
        portalName: '城际高速入口'
      };
      endpoints.HW.push(hwEp);
      endpoints.GATEWAY.push(hwEp);
    }

    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      const b = t.building;
      if (!b || b.underConstruction || b.abandoned || b.flooded) continue;
      const acc = this.sim.findRoadAccess(t.x, t.z);
      if (!acc) continue;
      const ep = { rx: acc.rx, rz: acc.rz, bx: t.x, bz: t.z, building: b };

      if (b.type === 'RL' || b.type === 'RH') {
        endpoints.R.push(ep);
      } else if (
        b.type === 'CL' || b.type === 'CH' || b.type === 'landmark' ||
        b.type === 'stadium' || b.type === 'amusement_park'
      ) {
        endpoints.SHOP.push(ep);
      } else if (b.type === 'hsr_station' || b.type === 'airport') {
        endpoints.GATEWAY.push(ep);
        endpoints.SHOP.push(ep);
      } else if (b.type === 'I') {
        endpoints.IND.push(ep);
        endpoints.WORK.push(ep);
      } else if (b.type === 'O') {
        endpoints.WORK.push(ep);
      } else if (b.type === 'seaport') {
        endpoints.PORT.push({
          rx: acc.rx,
          rz: acc.rz,
          bx: t.x,
          bz: t.z,
          building: b,
          portalName: typeof this.sim.getBuildingDisplayName === 'function'
            ? (this.sim.getBuildingDisplayName(b, t.x, t.z) || '深水海港')
            : '深水海港'
        });
      } else if (b.type === 'waste_plant') {
        endpoints.W.push(ep);
      }
    }

    const activeGarbage = this.vehicles.filter((v) => v.kind === 'garbagetruck').length;
    const allZones = endpoints.R.concat(endpoints.SHOP, endpoints.WORK);
    const workAndShop = endpoints.WORK.concat(endpoints.SHOP);

    let origins = null;
    let dests = null;
    let kind = 'car';
    let tripType = 'commute';
    let tripLabel = '👷 通勤上班';

    const roll = Math.random();
    const isMorningRush = period.commuteBias === 'to_work';
    const isEveningRush = period.commuteBias === 'to_home';
    const isRush = isMorningRush || isEveningRush;
    const isMidday = period.commuteBias === 'commercial';
    const isQuietNight = period.commuteBias === 'quiet';

    // Non-overlapping cumulative probability thresholds so Service, Freight & Immigrant NEVER get shadowed during Rush Hour!
    const pService = isQuietNight ? 0.22 : (isRush ? 0.10 : 0.14);
    const pFreight = isQuietNight ? 0.58 : (isMidday ? 0.44 : (isRush ? 0.24 : 0.38));
    const pImmig   = isRush ? 0.33 : 0.50;
    const pShop    = isRush ? 0.45 : (isMidday ? 0.82 : 0.74);

    // 1. Municipal Sanitation Service Chain (Waste Plant <-> Zones)
    if (endpoints.W.length > 0 && allZones.length > 0 &&
        activeGarbage < Math.min(10, endpoints.W.length * 4) && roll < pService) {
      const outbound = Math.random() < 0.72;
      origins = outbound ? endpoints.W : allZones;
      dests = outbound ? allZones : endpoints.W;
      kind = 'garbagetruck';
      tripType = 'service';
      tripLabel = '🚛 环卫沿街收运垃圾';
    }
    // 2. Industrial Freight Supply Chain (Industry -> Retail Restock OR Industry <-> Seaport / Highway Export)
    else if (roll < pFreight && endpoints.IND.length > 0 &&
             (endpoints.SHOP.length > 0 || endpoints.PORT.length > 0 || endpoints.HW.length > 0)) {
      kind = 'truck';
      tripType = 'freight';
      const canRestock = endpoints.SHOP.length > 0;
      const exportHubs = endpoints.PORT.length > 0
        ? (Math.random() < 0.65 || endpoints.HW.length === 0 ? endpoints.PORT : endpoints.HW)
        : endpoints.HW;

      if (canRestock && (exportHubs.length === 0 || Math.random() < 0.55)) {
        origins = endpoints.IND;
        dests = endpoints.SHOP;
        tripLabel = '🚚 工业货运补货';
      } else if (exportHubs.length > 0) {
        // Seaport absorbs 35% of highway export truck traffic via container ships!
        if (exportHubs === endpoints.HW && this.modalSplit.seaportFreightPct > 0 &&
            Math.random() < this.modalSplit.seaportFreightPct / 100) {
          return;
        }
        const exportOut = Math.random() < 0.75;
        origins = exportOut ? endpoints.IND : exportHubs;
        dests = exportOut ? exportHubs : endpoints.IND;
        tripLabel = '📦 港口/高速出口货运';
      }
    }
    // 3. Intercity New Immigrants & Visitors (Highway / HSR / Airport -> Residential / CBD)
    else if (roll < pImmig && endpoints.GATEWAY.length > 0 &&
             (endpoints.R.length > 0 || endpoints.SHOP.length > 0)) {
      origins = endpoints.GATEWAY;
      if (endpoints.R.length > 0 && (endpoints.SHOP.length === 0 || Math.random() < 0.75)) {
        dests = endpoints.R;
        kind = 'car';
        tripType = 'immigrant';
        tripLabel = '🏡 城际新市民迁入';
      } else {
        dests = endpoints.SHOP;
        kind = Math.random() < 0.4 ? 'taxi' : 'car';
        tripType = 'immigrant';
        tripLabel = '🏡 城际商旅抵埠';
      }
    }
    // 4. Shopping & Leisure Chain (Residential <-> Commercial / Landmarks / Stadium)
    else if (roll < pShop && endpoints.R.length > 0 && endpoints.SHOP.length > 0) {
      tripType = 'shopping';
      const toShop = isEveningRush ? (Math.random() < 0.25) : (Math.random() < 0.62);
      origins = toShop ? endpoints.R : endpoints.SHOP;
      dests = toShop ? endpoints.SHOP : endpoints.R;
      if (freeTransit && Math.random() < 0.25) {
        kind = 'bus';
        tripLabel = '🛍️ 商圈购物';
      } else if (!toShop && Math.random() < 0.28) {
        kind = 'taxi';
        tripLabel = '🛍️ 商圈购物';
      } else {
        kind = 'car';
        tripLabel = '🛍️ 商圈购物';
      }
    }
    // 5. Daily & Rush-Hour Tidal Work Commute Chain (55% share during Morning/Evening Rush!)
    else if (endpoints.R.length > 0 && (isRush ? workAndShop.length > 0 : endpoints.WORK.length > 0)) {
      tripType = 'commute';
      const destPool = isRush ? workAndShop : endpoints.WORK;
      const toWork = isMorningRush ? (Math.random() < 0.88) : (isEveningRush ? (Math.random() < 0.12) : (Math.random() < 0.58));
      origins = toWork ? endpoints.R : destPool;
      dests = toWork ? destPool : endpoints.R;
      kind = (freeTransit && Math.random() < 0.28) ? 'bus' : 'car';
      tripLabel = isMorningRush
        ? (toWork ? '🌅 早高峰通勤上班' : '👷 通勤交班')
        : (isEveningRush ? (toWork ? '👷 晚班通勤' : '🌆 晚高峰下班返家') : (toWork ? '👷 通勤上班' : '🏠 下班返家'));
    }
    // Fallback when city only has R + SHOP or WORK + SHOP early in Lv.1
    else if (endpoints.R.length > 0 && endpoints.SHOP.length > 0) {
      tripType = 'shopping';
      origins = endpoints.R;
      dests = endpoints.SHOP;
      kind = freeTransit && Math.random() < 0.22 ? 'bus' : 'car';
      tripLabel = '🛍️ 商圈购物';
    } else if (endpoints.IND.length > 0 && (endpoints.HW.length > 0 || endpoints.PORT.length > 0)) {
      tripType = 'freight';
      kind = 'truck';
      origins = endpoints.IND;
      dests = endpoints.PORT.length > 0 ? endpoints.PORT : endpoints.HW;
      tripLabel = '📦 港口/高速出口货运';
    }

    if (!origins || !dests || !origins.length || !dests.length) return;

    const a = origins[(Math.random() * origins.length) | 0];
    const b = dests[(Math.random() * dests.length) | 0];
    const isHeavyTruck = kind === 'truck' || kind === 'garbagetruck';
    const path = this.findRoadPath(a.rx, a.rz, b.rx, b.rz, false, 0, isHeavyTruck);
    if (!path || path.length < 2) return;

    let color = CAR_COLORS[(Math.random() * CAR_COLORS.length) | 0];
    let length = 0.25, width = 0.13, height = 0.10, maxSpeed = 1.85 + Math.random() * 0.45;
    if (kind === 'taxi') { color = [0.98, 0.78, 0.12]; maxSpeed = 2.15; }
    else if (kind === 'truck') { color = [0.90, 0.46, 0.16]; length = 0.35; width = 0.15; height = 0.15; maxSpeed = 1.55; }
    else if (kind === 'garbagetruck') { color = [0.22, 0.74, 0.38]; length = 0.36; width = 0.15; height = 0.15; maxSpeed = 1.50; }
    else if (kind === 'bus') { color = [0.18, 0.58, 0.92]; length = 0.40; width = 0.15; height = 0.15; maxSpeed = 1.65; }

    const w0 = tileToWorld(path[0].x, path[0].z);
    const v = {
      kind,
      tripType,
      tripLabel,
      fromName: this.getEndpointName(a),
      toName: this.getEndpointName(b),
      originTile: { x: a.bx, z: a.bz },
      destTile: { x: b.bx, z: b.bz },
      color,
      length,
      width,
      height,
      path,
      seg: 0,
      t: 0,
      speed: maxSpeed * 0.6,
      maxSpeed,
      stuckTimer: 0,
      laneSlot: Math.random() < 0.5 ? 0 : 1,
      laneChangeCooldown: 0,
      wx: w0.wx,
      wy: this.getRoadNodeY(path[0].x, path[0].z, path[0].layer),
      wz: w0.wz,
      dirX: 0,
      dirZ: -1,
      inTunnel: false
    };
    this.syncVehicleTransform(v, 0);
    this.vehicles.push(v);
    this.refreshActiveModalCounts();
  }

  trySpawnTrains() {
    const activeHSR = this.trains.filter((tr) => !tr.isMetro).length;
    const activeMetro = this.trains.filter((tr) => tr.isMetro).length;

    // 1. High-Speed Bullet Train (Fuxing 5-car articulated consist!)
    if (activeHSR < 3) {
      const hsrNodes = [];
      if (this.sim.getTile(8, GRID_SIZE - 1)?.rail > 0) hsrNodes.push({ x: 8, z: GRID_SIZE - 1 });
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        if (t.building?.type === 'hsr_station' && t.powered) {
          hsrNodes.push({ x: t.x, z: t.z });
        }
      }
      if (hsrNodes.length >= 2) {
        const a = hsrNodes[(Math.random() * hsrNodes.length) | 0];
        const b = hsrNodes[(Math.random() * hsrNodes.length) | 0];
        const path = this.findTrackPath(a.x, a.z, b.x, b.z, false);
        if (path && path.length >= 5) {
          this.trains.push({
            isMetro: false,
            cars: 5,
            path,
            dist: 0,
            speed: 3.8, // Fast bullet train!
            dwell: 0
          });
        }
      }
    }

    // 2. Underground Metro Train (4-car consist)
    if (activeMetro < 4) {
      const mStations = [];
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        if (t.building?.type === 'metro_station' && t.powered) {
          mStations.push({ x: t.x, z: t.z });
        }
      }
      if (mStations.length >= 2) {
        const a = mStations[(Math.random() * mStations.length) | 0];
        const b = mStations[(Math.random() * mStations.length) | 0];
        const path = this.findTrackPath(a.x, a.z, b.x, b.z, true);
        if (path && path.length >= 4) {
          this.trains.push({
            isMetro: true,
            cars: 4,
            path,
            dist: 0,
            speed: 2.7,
            dwell: 0
          });
        }
      }
    }
  }

  isSignalRed(x, z, moveVertical) {
    if (this.roadDegree[idx(x, z)] < 3) return false;
    const tile = this.sim.getTile(x, z);
    if (tile && tile.junctionMode && tile.junctionMode !== 'signal') return false;
    const localPhase = (this.signalClock + (x + z) * 0.65) % 8.0;
    const nsGreen = localPhase < 4.0;
    return moveVertical ? !nsGreen : nsGreen;
  }

  isTurningRightAtNext(v) {
    const cur = v.path[v.seg];
    const nxt = v.path[v.seg + 1];
    const after = v.path[v.seg + 2];
    if (!cur || !nxt || !after) return false;
    const inDx = nxt.x - cur.x;
    const inDz = nxt.z - cur.z;
    const outDx = after.x - nxt.x;
    const outDz = after.z - nxt.z;
    return (-inDz * outDx + inDx * outDz) > 0;
  }

  getGroundRoadPriorityRank(tile) {
    if (!tile || !(tile.roadGround > 0)) return 0;
    if (tile.roadGround === 3) return 3;
    if (tile.roadGround === 2) return 2;
    return 1;
  }

  isMajorYieldApproach(curTile, nx, nz, moveVertical) {
    const myRank = this.getGroundRoadPriorityRank(curTile);
    let crossRank = 0;
    if (moveVertical) {
      crossRank = Math.max(
        this.getGroundRoadPriorityRank(this.sim.getTile(nx - 1, nz)),
        this.getGroundRoadPriorityRank(this.sim.getTile(nx + 1, nz))
      );
    } else {
      crossRank = Math.max(
        this.getGroundRoadPriorityRank(this.sim.getTile(nx, nz - 1)),
        this.getGroundRoadPriorityRank(this.sim.getTile(nx, nz + 1))
      );
    }
    if (myRank > crossRank) return true;
    if (myRank < crossRank) return false;
    return moveVertical;
  }

  canSwitchParallelLane(v, selfIdx, altSlot, safeGap) {
    const cur = v.path[v.seg];
    if (!cur || cur.onRamp) return false;
    const altOff = altSlot === 1 ? 0.24 : 0.11;
    const shiftLat = altOff - (v.curLaneOff !== undefined ? v.curLaneOff : (v.laneSlot === 1 ? 0.24 : 0.11));

    for (let k = 0; k < this.vehicles.length; k++) {
      if (k === selfIdx) continue;
      const o = this.vehicles[k];
      if (o.inTunnel !== v.inTunnel) continue;
      const oCur = o.path[o.seg];
      if (!oCur) continue;
      if (oCur.layer !== cur.layer && !cur.onRamp && !oCur.onRamp) continue;
      if (Math.abs((v.wy || 0) - (o.wy || 0)) > 0.18) continue;

      const rvx = o.wx - v.wx;
      const rvz = o.wz - v.wz;
      if (rvx * rvx + rvz * rvz > 0.49) continue;

      const sameDir = v.dirX * o.dirX + v.dirZ * o.dirZ;
      if (sameDir < 0.45) continue;

      const fwdDist = rvx * v.dirX + rvz * v.dirZ;
      const latDistToAlt = Math.abs((-rvx * v.dirZ + rvz * v.dirX) - shiftLat);
      if (latDistToAlt < 0.11 && fwdDist > -0.28 && fwdDist < safeGap + 0.14) {
        return false;
      }
    }
    return true;
  }

  rebuildTileOccupancy() {
    this.tileOccupancy.fill(0);
    this.elevOccupancy.fill(0);
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      const cur = v.path && v.path[v.seg];
      if (!cur) continue;
      const ci = idx(cur.x, cur.z);
      if (cur.layer === 1 || cur.onRamp) {
        if (this.elevOccupancy[ci] < 250) this.elevOccupancy[ci]++;
      } else if (cur.layer === 0) {
        if (this.tileOccupancy[ci] < 250) this.tileOccupancy[ci]++;
      }
    }
  }

  update(dt) {
    const sig = this.computeRoadSignature();
    if (this.sim.meshDirty || sig !== this.lastRoadSignature) {
      this.refreshRoadGraph(sig);
    }
    if (this.sim.speed === 0) {
      this.revalidateActiveTransport();
      this.refreshActiveModalCounts();
      return;
    }

    const speedMult = Math.min(2.4, 0.8 + this.sim.speed * 0.38);
    const effDt = Math.min(0.07, dt * speedMult);
    this.signalClock += effDt;

    this.modalTimer += effDt;
    if (this.modalTimer >= 1.0 || this.modalSplit.rawCarDemand === 0) {
      this.modalTimer = 0;
      this.refreshModalSplitDemand();
    }

    const period = typeof this.sim.getTrafficPeriodInfo === 'function'
      ? this.sim.getTrafficPeriodInfo()
      : { id: 'normal', mult: 1.0 };
    const spawnInterval = Math.max(0.11, Math.min(0.65, 0.26 / Math.max(0.35, period.mult || 1.0)));

    this.spawnTimer += effDt;
    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer = 0;
      this.trySpawnVehicle();
    }

    this.fireTimer += effDt;
    if (this.fireTimer >= 0.9) {
      this.fireTimer = 0;
      this.tryDispatchFireTruck();
    }

    this.trainTimer += effDt;
    if (this.trainTimer >= 1.8) {
      this.trainTimer = 0;
      this.trySpawnTrains();
    }

    // Snapshot ground tile occupancy so junction yield/roundabout/right-on-red see exact live density
    this.rebuildTileOccupancy();
    let gridlockTiles = null;

    // Update road vehicles with per-frame road validation, junction modes, 2-lane parallel flow & 12s anti-gridlock
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      let cur = v.path && v.path[v.seg];
      if (!cur || !this.isValidRoadStep(cur, null)) {
        this.vehicles.splice(i, 1);
        continue;
      }

      let nxt = v.path[v.seg + 1];
      if (!nxt) {
        if (v.kind === 'firetruck' && v.fireTargetIdx !== undefined) {
          const bt = this.sim.grid[v.fireTargetIdx];
          if (bt && bt.building) bt.building.fire = 0;
        }
        this.sim.onTripComplete?.(v);
        this.sim.onTripCompleted?.(v);
        this.vehicles.splice(i, 1);
        continue;
      }

      const physNode = this.getPhysicalVehicleNode(v, cur, nxt);
      if (!this.isValidRoadStep(physNode, null)) {
        this.vehicles.splice(i, 1);
        continue;
      }

      if (!this.isValidRoadStep(nxt, null) || !this.isValidRoadStep(cur, nxt) || !this.isVehiclePathValidAhead(v)) {
        if (!this.tryRerouteVehicle(v)) {
          this.vehicles.splice(i, 1);
          continue;
        }
        cur = v.path[v.seg];
        nxt = v.path[v.seg + 1];
      }

      const curTile = this.sim.getTile(cur.x, cur.z);
      const nxtTile = this.sim.getTile(nxt.x, nxt.z);
      if (!curTile || !nxtTile) {
        this.vehicles.splice(i, 1);
        continue;
      }

      if (v.laneChangeCooldown > 0) {
        v.laneChangeCooldown = Math.max(0, v.laneChangeCooldown - effDt);
      }

      const onRampSeg = Boolean(cur.onRamp || nxt.onRamp);
      const isElevated = cur.layer === 1 || nxt.layer === 1;
      const isOneWaySeg =
        !onRampSeg && !isElevated &&
        typeof curTile.roadDir === 'number' && curTile.roadDir >= 0 &&
        typeof nxtTile.roadDir === 'number' && nxtTile.roadDir >= 0;
      const isMultiLane =
        !onRampSeg && (
          isElevated ||
          isOneWaySeg ||
          (curTile.roadGround >= 2 && curTile.roadGround !== 4) ||
          (nxtTile.roadGround >= 2 && nxtTile.roadGround !== 4)
        );
      const allowOvertake = isMultiLane && !curTile.ramp && !nxtTile.ramp;

      const roadBoost = isElevated ? 1.55 : (onRampSeg ? 1.32 : (nxtTile.roadGround >= 2 ? 1.25 : (isOneWaySeg ? 1.12 : 1.0)));
      let targetSpeed = v.maxSpeed * roadBoost;

      // Ground Intersection Control: 'signal' | 'yield' | 'roundabout' (never halts mid-ramp!)
      if (!isElevated && !nxt.onRamp) {
        const nxtIdx = idx(nxt.x, nxt.z);
        const nxtDeg = this.roadDegree[nxtIdx];
        const curDeg = this.roadDegree[idx(cur.x, cur.z)];
        const inRoundaboutHub = !cur.onRamp && curDeg >= 3 && curTile.junctionMode === 'roundabout';
        const enteringRoundabout = nxtDeg >= 3 && nxtTile.junctionMode === 'roundabout';

        if (inRoundaboutHub || (enteringRoundabout && v.t > 0.30)) {
          targetSpeed = Math.min(targetSpeed, v.maxSpeed * 0.82);
        }

        if (v.kind !== 'firetruck' && nxtDeg >= 3) {
          const jMode = nxtTile.junctionMode || 'signal';
          const moveVertical = Math.abs(nxt.z - cur.z) > 0;

          if (jMode === 'roundabout') {
            // ZERO red-light stop! Enter roundabout whenever hub occupancy < 4
            if (v.t > 0.25 && v.t < 0.58 && !inRoundaboutHub && this.tileOccupancy[nxtIdx] >= 4) {
              targetSpeed = 0;
            }
          } else if (jMode === 'yield') {
            // Major road has ZERO signal stop; minor road yields only if intersection occupancy >= 2
            const isMajor = this.isMajorYieldApproach(curTile, nxt.x, nxt.z, moveVertical);
            if (!isMajor && v.t > 0.25 && v.t < 0.58 && this.tileOccupancy[nxtIdx] >= 2) {
              targetSpeed = 0;
            }
          } else {
            // 'signal' mode with Right-Turn-On-Red when intersection occupancy < 2
            if (v.t > 0.25 && v.t < 0.58 && this.isSignalRed(nxt.x, nxt.z, moveVertical)) {
              if (this.isTurningRightAtNext(v) && this.tileOccupancy[nxtIdx] < 2) {
                targetSpeed = Math.min(targetSpeed, v.maxSpeed * 0.78);
              } else {
                targetSpeed = 0;
              }
            }
          }
        }
      }

      // Real 3D Bumper-to-Bumper Collision Avoidance + 4-Lane Parallel Overtaking!
      const latLimit = isMultiLane ? 0.10 : 0.14;
      for (let j = 0; j < this.vehicles.length; j++) {
        if (i === j) continue;
        const o = this.vehicles[j];
        if (o.inTunnel !== v.inTunnel) continue;
        const oCur = o.path[o.seg];
        if (!oCur) continue;
        if (oCur.layer !== cur.layer && !cur.onRamp && !oCur.onRamp) continue;
        if (Boolean(cur.onRamp) !== Boolean(oCur.onRamp) && Math.abs((v.wy || 0) - (o.wy || 0)) > 0.18) continue;
        if (Math.abs((v.wy || 0) - (o.wy || 0)) > 0.22) continue;

        const rvx = o.wx - v.wx;
        const rvz = o.wz - v.wz;
        const distSq = rvx * rvx + rvz * rvz;
        if (distSq > 0.36) continue; // > 0.60 units away

        // Same general heading check
        const sameDir = v.dirX * o.dirX + v.dirZ * o.dirZ;
        if (sameDir < 0.45) continue;

        const fwdDist = rvx * v.dirX + rvz * v.dirZ;
        const latDist = Math.abs(-rvx * v.dirZ + rvz * v.dirX);
        const safeGap = (v.length + o.length) * 0.58 + 0.09;
        if (fwdDist > 0.01 && fwdDist < safeGap && latDist < latLimit) {
          // Attempt parallel lane-change overtake on 4-lane avenues / elevated expressways!
          if (allowOvertake && targetSpeed > 0 && o.speed < v.maxSpeed * 0.85 && !(v.laneChangeCooldown > 0)) {
            const altSlot = v.laneSlot === 1 ? 0 : 1;
            if (this.canSwitchParallelLane(v, i, altSlot, safeGap)) {
              v.laneSlot = altSlot;
              v.laneChangeCooldown = 1.2;
              continue;
            }
          }
          targetSpeed = 0;
          break;
        }
      }

      const accel = targetSpeed < v.speed ? 8.0 : 3.4;
      v.speed += (targetSpeed - v.speed) * Math.min(1, effDt * accel);
      if (v.speed < 0.01 && targetSpeed === 0) v.speed = 0;

      // 12-Second Gridlock Anti-Deadlock Timer (prevents permanent 4-way freezes & penalizes supply chain)
      v.stuckTimer = v.stuckTimer || 0;
      if (v.speed < 0.06) {
        v.stuckTimer += effDt;
      } else if (v.speed > 0.18) {
        v.stuckTimer = Math.max(0, v.stuckTimer - effDt * 2);
      }

      if (v.stuckTimer >= 12.0) {
        const oldIdx = idx(cur.x, cur.z);
        if (cur.layer === 0 && !cur.onRamp && this.tileOccupancy[oldIdx] > 0) {
          this.tileOccupancy[oldIdx]--;
        }
        this.modalSplit.gridlockTimeouts++;
        if (cur.layer === 1) {
          curTile.elevCongestion = 1.0;
        } else if (curTile.roadGround > 0) {
          curTile.congestion = 1.0;
          if (!gridlockTiles) gridlockTiles = new Set();
          gridlockTiles.add(oldIdx);
        }
        this.sim.onTripGridlockTimeout?.(v);
        this.vehicles.splice(i, 1);
        continue;
      }

      const prevSeg = v.seg;
      const segWorldLen = Math.hypot(nxt.x - cur.x, nxt.z - cur.z) || 1.0;
      v.t += (v.speed / segWorldLen) * effDt;

      while (v.t >= 1.0) {
        v.t -= 1.0;
        v.seg++;
        if (v.seg >= v.path.length - 1) break;
      }

      if (v.seg >= v.path.length - 1) {
        if (cur.layer === 0 && !cur.onRamp) {
          const oldIdx = idx(cur.x, cur.z);
          if (this.tileOccupancy[oldIdx] > 0) this.tileOccupancy[oldIdx]--;
        }
        if (v.kind === 'firetruck' && v.fireTargetIdx !== undefined) {
          const bt = this.sim.grid[v.fireTargetIdx];
          if (bt && bt.building && bt.building.fire > 0) {
            bt.building.fire = 0;
            this.sim.latestChirp = {
              user: '@消防总署播报',
              text: '🧯 消防救援车已抵达现场扑灭烈火，化险为夷！',
              mood: 'good'
            };
          }
        }
        if (v.kind === 'garbagetruck' && v.destTile) {
          const dtTile = this.sim.getTile(v.destTile.x, v.destTile.z);
          if (dtTile?.building && typeof dtTile.building.garbage === 'number') {
            dtTile.building.garbage = Math.max(0, dtTile.building.garbage - 0.4);
          }
        }
        this.sim.onTripComplete?.(v);
        this.sim.onTripCompleted?.(v);
        this.vehicles.splice(i, 1);
        continue;
      }

      // Live-update tileOccupancy mid-tick when entering a new ground tile
      if (v.seg !== prevSeg) {
        if (cur.layer === 0 && !cur.onRamp) {
          const oldIdx = idx(cur.x, cur.z);
          if (this.tileOccupancy[oldIdx] > 0) this.tileOccupancy[oldIdx]--;
        }
        const newCur = v.path[v.seg];
        if (newCur && newCur.layer === 0 && !newCur.onRamp) {
          const newIdx = idx(newCur.x, newCur.z);
          if (this.tileOccupancy[newIdx] < 250) this.tileOccupancy[newIdx]++;
        }
      }

      this.syncVehicleTransform(v, effDt);
    }

    // Refresh ground & elevated road occupancy + modal active vehicle counts
    this.rebuildTileOccupancy();
    this.refreshActiveModalCounts();

    // Update HSR Bullet Trains & Metro Trains with full coach-span track validation
    for (let i = this.trains.length - 1; i >= 0; i--) {
      const tr = this.trains[i];
      if (!this.isValidTrainSpan(tr)) {
        this.trains.splice(i, 1);
        continue;
      }
      if (tr.dwell > 0) {
        tr.dwell -= effDt;
        continue;
      }
      const prevSeg = Math.floor(tr.dist);
      tr.dist += tr.speed * effDt;
      const curSeg = Math.floor(tr.dist);

      if (curSeg >= tr.path.length - 1) {
        this.trains.splice(i, 1);
        continue;
      }

      if (!this.isValidTrainSpan(tr)) {
        this.trains.splice(i, 1);
        continue;
      }

      // Pause briefly if arriving at an intermediate station!
      if (curSeg !== prevSeg && curSeg > 1 && curSeg < tr.path.length - 2) {
        const node = tr.path[curSeg];
        const bType = this.sim.getTile(node.x, node.z)?.building?.type;
        if ((!tr.isMetro && bType === 'hsr_station') || (tr.isMetro && bType === 'metro_station')) {
          tr.dwell = 1.6;
        }
      }
    }

    // Smoothly update ground & elevated congestion metrics (preserving 1.0 gridlock spike on timeout frame)
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.roadElevated > 0) {
        const eRaw = Math.min(1, this.elevOccupancy[i] / 4.2);
        t.elevCongestion = (t.elevCongestion || 0) * 0.90 + eRaw * 0.10;
      } else {
        t.elevCongestion = 0;
      }

      if (t.roadGround === 0) {
        t.congestion = 0;
        continue;
      }
      if (gridlockTiles && gridlockTiles.has(i)) {
        t.congestion = 1.0;
        continue;
      }
      const cap = t.roadGround >= 2 ? 3.8 : 1.9;
      const raw = Math.min(1, this.tileOccupancy[i] / cap);
      t.congestion = t.congestion * 0.90 + raw * 0.10;
    }

    // Update 3D Airliners, Cargo Container Ships & Sidewalk Pedestrians
    this.updateAircraft(effDt);
    this.updateShips(effDt);
    this.updatePedestrians(effDt);
  }

  _isPedRoadTile(tx, tz) {
    if (!inBounds(tx, tz)) return false;
    const t = this.sim.grid[idx(tx, tz)];
    return Boolean(t && (t.roadGround === 1 || t.roadGround === 2) && !t.dam && !t.ramp && this.isGroundRoadPassable(t));
  }

  _pickPedNextTile(tx, tz, prevX, prevZ) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const forwardChoices = [];
    let backChoice = null;
    for (let k = 0; k < 4; k++) {
      const nx = tx + dirs[k][0];
      const nz = tz + dirs[k][1];
      if (!this._isPedRoadTile(nx, nz)) continue;
      if (nx === prevX && nz === prevZ) {
        backChoice = { x: nx, z: nz };
      } else {
        forwardChoices.push({ x: nx, z: nz });
      }
    }
    if (forwardChoices.length > 0) {
      return { ...forwardChoices[(Math.random() * forwardChoices.length) | 0], reversed: false };
    }
    if (backChoice) {
      return { ...backChoice, reversed: true };
    }
    return { x: tx, z: tz, reversed: true };
  }

  _syncPedTransform(p) {
    const w0 = tileToWorld(p.tx, p.tz);
    const w1 = tileToWorld(p.nx, p.nz);
    const dx = w1.wx - w0.wx;
    const dz = w1.wz - w0.wz;
    const len = Math.hypot(dx, dz);
    if (len > 0.01) {
      p.dirX = dx / len;
      p.dirZ = dz / len;
    }
    // Outer sidewalk offset (+-0.43m from road centerline)
    const swOff = 0.43 * p.side;
    const rightX = -p.dirZ;
    const rightZ = p.dirX;
    const frac = Math.min(1, Math.max(0, p.t));
    p.wx = w0.wx + dx * frac + rightX * swOff;
    p.wz = w0.wz + dz * frac + rightZ * swOff;

    const y0 = this.sim.isWaterTile(p.tx, p.tz)
      ? this.getRoadNodeY(p.tx, p.tz, 0)
      : (this.sim.getTileElev(p.tx, p.tz) + 0.04);
    const y1 = this.sim.isWaterTile(p.nx, p.nz)
      ? this.getRoadNodeY(p.nx, p.nz, 0)
      : (this.sim.getTileElev(p.nx, p.nz) + 0.04);
    p.wy = y0 + (y1 - y0) * frac;
  }

  updatePedestrians(effDt) {
    if (this._pedRoadPool.length === 0) {
      if (this.pedestrians.length > 0) this.pedestrians.length = 0;
      return;
    }

    const period = typeof this.sim.getTrafficPeriodInfo === 'function'
      ? this.sim.getTrafficPeriodInfo()
      : { id: 'normal' };
    const timeScale = period.id === 'late_night'
      ? 0.35
      : ((period.id === 'morning_rush' || period.id === 'evening_rush') ? 1.25 : 1.0);
    const pop = this.sim.population || 0;
    const baseCap = Math.min(240, Math.min(16, this._pedRoadPool.length * 0.55) + pop * 0.032);
    const targetPed = Math.min(240, Math.round(baseCap * timeScale));

    // Trim gracefully when transitioning into quiet late night
    while (this.pedestrians.length > targetPed + 8) {
      this.pedestrians.pop();
    }

    // Spawn batch along active sidewalks up to targetPed (<= 240 hard cap)
    let spawnBudget = Math.min(6, Math.max(0, targetPed - this.pedestrians.length));
    while (spawnBudget-- > 0 && this.pedestrians.length < 240) {
      const spot = this._pedRoadPool[(Math.random() * this._pedRoadPool.length) | 0];
      if (!spot || !this._isPedRoadTile(spot.x, spot.z)) continue;
      const next = this._pickPedNextTile(spot.x, spot.z, -1, -1);
      const p = {
        tx: spot.x,
        tz: spot.z,
        nx: next.x,
        nz: next.z,
        t: Math.random() * 0.6,
        side: Math.random() < 0.5 ? 1 : -1,
        wx: 0,
        wy: 0,
        wz: 0,
        dirX: 1,
        dirZ: 0,
        walkPhase: Math.random() * Math.PI * 2,
        colorIdx: (Math.random() * 8) | 0,
        speed: 0.24 + Math.random() * 0.14,
        ttl: 24 + Math.random() * 28
      };
      this._syncPedTransform(p);
      this.pedestrians.push(p);
    }

    // Advance sidewalk walkers
    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      const p = this.pedestrians[i];
      if (!this._isPedRoadTile(p.tx, p.tz)) {
        this.pedestrians.splice(i, 1);
        continue;
      }

      p.ttl -= effDt;
      p.t += p.speed * effDt;
      p.walkPhase = (p.walkPhase + p.speed * effDt * 18) % (Math.PI * 2);

      if (p.t >= 1.0) {
        if (p.ttl <= 0 && this.pedestrians.length > Math.floor(targetPed * 0.85)) {
          this.pedestrians.splice(i, 1);
          continue;
        }
        const prevX = p.tx;
        const prevZ = p.tz;
        p.tx = p.nx;
        p.tz = p.nz;
        p.t -= 1.0;
        if (!this._isPedRoadTile(p.tx, p.tz)) {
          this.pedestrians.splice(i, 1);
          continue;
        }
        const next = this._pickPedNextTile(p.tx, p.tz, prevX, prevZ);
        p.nx = next.x;
        p.nz = next.z;
        if (next.reversed) {
          p.side = -p.side;
        }
      }

      this._syncPedTransform(p);
    }
  }

  updateAircraft(effDt) {
    // First despawn any ground rollout / short-final aircraft whose runway was bulldozed or flooded
    for (let i = this.aircraft.length - 1; i >= 0; i--) {
      const plane = this.aircraft[i];
      if ((plane.phase === 'rollout' || (plane.progress >= 0.40 && plane.progress <= 0.60)) &&
          !this.isRunwayIntact(plane.ax, plane.az)) {
        this.aircraft.splice(i, 1);
      }
    }

    const airports = [];
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      const b = t.building;
      if (b && b.type === 'airport' && !b.abandoned && !b.underConstruction && t.powered && !b.flooded &&
          !(this.sim.waterDepth && this.sim.waterDepth[i] > 0.08)) {
        airports.push(t);
      }
    }

    if (airports.length === 0) {
      this.aircraft.length = 0;
      this.aircraftTimer = 0;
      return;
    }

    const maxPlanes = 2;
    this.aircraftTimer += effDt;

    if (this.aircraft.length === 0) {
      const ap = airports[0];
      const c = tileToWorld(ap.x, ap.z);
      const baseY = this.sim.getTileElev(ap.x, ap.z);
      const dirLen = Math.hypot(16, 14) || 1;
      const dx = 16 / dirLen, dz = 14 / dirLen;
      this.aircraft.push({
        ax: ap.x,
        az: ap.z,
        progress: 0.06,
        phase: 'approach',
        wx: c.wx - 16,
        wy: baseY + 8.5,
        wz: c.wz - 14,
        dirX: dx,
        dirZ: dz,
        yaw: Math.atan2(dx, dz),
        pitch: -0.18,
        roll: 0,
        scale: 1,
        variant: 0
      });
      this.aircraftTimer = 0;
    } else if (this.aircraft.length < maxPlanes && this.aircraftTimer >= 9.0) {
      const first = this.aircraft[0];
      if (first.progress >= 0.44 && first.progress <= 0.62) {
        const ap = airports[this.aircraft.length % airports.length];
        const c = tileToWorld(ap.x, ap.z);
        const baseY = this.sim.getTileElev(ap.x, ap.z);
        const dirLen = Math.hypot(16, 14) || 1;
        const dx = 16 / dirLen, dz = 14 / dirLen;
        this.aircraft.push({
          ax: ap.x,
          az: ap.z,
          progress: 0.0,
          phase: 'approach',
          wx: c.wx - 16,
          wy: baseY + 8.5,
          wz: c.wz - 14,
          dirX: dx,
          dirZ: dz,
          yaw: Math.atan2(dx, dz),
          pitch: -0.19,
          roll: 0,
          scale: 1,
          variant: 1
        });
        this.aircraftTimer = 0;
      }
    }

    for (let i = this.aircraft.length - 1; i >= 0; i--) {
      const plane = this.aircraft[i];
      let ap = airports.find((a) => a.x === plane.ax && a.z === plane.az);
      if (!ap) {
        if (!this.isRunwayIntact(plane.ax, plane.az)) {
          if (plane.phase === 'rollout' || (plane.progress >= 0.25 && plane.progress <= 0.72)) {
            this.aircraft.splice(i, 1);
            continue;
          }
          ap = airports[i % airports.length];
          plane.ax = ap.x;
          plane.az = ap.z;
        } else {
          // Runway is physically intact (e.g., temporary power outage while another airport is powered)
          ap = this.sim.getTile(plane.ax, plane.az);
        }
      }

      plane.progress += effDt * 0.045;
      let wrapped = false;
      if (plane.progress >= 1.0) {
        plane.progress -= 1.0;
        const nextAp = airports[(i + ((this.signalClock | 0) % airports.length)) % airports.length];
        plane.ax = nextAp.x;
        plane.az = nextAp.z;
        ap = nextAp;
        wrapped = true;
      }

      const p = plane.progress;
      if (p > 0.42 && p < 0.58 && !this.isRunwayIntact(plane.ax, plane.az)) {
        this.aircraft.splice(i, 1);
        continue;
      }

      const center = tileToWorld(ap.x, ap.z);
      const cx = center.wx;
      const cz = center.wz;
      const baseY = this.sim.getTileElev(ap.x, ap.z);

      let wx, wy, wz, tx, tz, targetPitch, targetRoll;

      if (p <= 0.42) {
        // Descending approach: (wx - 16, baseY + 8.5, wz - 14) -> runway threshold
        plane.phase = 'approach';
        const s = p / 0.42;
        const hs = 1 - Math.pow(1 - s, 1.25);
        wx = (cx - 16) + 15.48 * hs;
        wz = (cz - 14) + 13.56 * hs;
        wy = (baseY + 0.16) + 8.34 * Math.pow(1 - s, 1.55);
        tx = 15.48;
        tz = 13.56;
        targetPitch = -0.23 * Math.pow(1 - s, 0.85) + 0.045;
        targetRoll = Math.sin(s * Math.PI) * (1 - s) * 0.14;
      } else if (p < 0.58) {
        // Landing roll across airport (wx, baseY + 0.16, wz) -> takeoff roll
        plane.phase = 'rollout';
        const s = (p - 0.42) / 0.16;
        wx = (cx - 0.52) + 1.04 * s;
        wz = (cz - 0.44) + 0.88 * s;
        wy = baseY + 0.16;
        tx = 1.04;
        tz = 0.88;
        if (s < 0.35) targetPitch = 0.045 * (1 - s / 0.35);
        else if (s <= 0.70) targetPitch = 0;
        else targetPitch = ((s - 0.70) / 0.30) * 0.22;
        targetRoll = 0;
      } else {
        // Takeoff climb: liftoff -> (wx + 18, baseY + 9.5, wz + 14)
        plane.phase = 'climb';
        const s = (p - 0.58) / 0.42;
        const hs = 0.28 * s + 0.72 * s * s;
        wx = (cx + 0.52) + 17.48 * hs;
        wz = (cz + 0.44) + 13.56 * hs;
        wy = (baseY + 0.16) + 9.34 * Math.pow(s, 1.45);
        tx = 17.48;
        tz = 13.56;
        targetPitch = 0.22 + 0.07 * Math.sin(s * Math.PI * 0.85);
        targetRoll = s > 0.25 ? -Math.sin(((s - 0.25) / 0.75) * Math.PI) * 0.16 : 0;
      }

      const tLen = Math.hypot(tx, tz) || 1;
      const ndx = tx / tLen;
      const ndz = tz / tLen;
      const targetYaw = Math.atan2(ndx, ndz);

      plane.wx = wx;
      plane.wy = wy;
      plane.wz = wz;

      if (wrapped) {
        plane.dirX = ndx;
        plane.dirZ = ndz;
        plane.yaw = targetYaw;
        plane.pitch = targetPitch;
        plane.roll = targetRoll;
      } else {
        const rate = Math.min(1, effDt * 8.0);
        plane.yaw = lerpAngle(plane.yaw, targetYaw, rate);
        plane.dirX = Math.sin(plane.yaw);
        plane.dirZ = Math.cos(plane.yaw);
        plane.pitch += (targetPitch - plane.pitch) * rate;
        plane.roll += (targetRoll - plane.roll) * rate;
      }

      plane.scale = p < 0.04 ? (p / 0.04) : (p > 0.96 ? (1 - p) / 0.04 : 1.0);
    }
  }

  // Wet-cell sea/channel pathfinder (waterDepth > 0.12) preferring deep water away from shores
  findWaterPath(sx, sz, ex, ez) {
    if (!inBounds(sx, sz) || !inBounds(ex, ez)) return null;
    if (sx === ex && sz === ez) return null;
    const wd = this.sim.waterDepth;
    const grid = this.sim.grid;
    const sIdx = idx(sx, sz);
    const eIdx = idx(ex, ez);
    if (wd[sIdx] <= 0.08 || wd[eIdx] <= 0.08) return null;

    const N = GRID_SIZE * GRID_SIZE;
    const dist = new Float32Array(N).fill(1e9);
    const prev = new Int16Array(N).fill(-1);
    const closed = new Uint8Array(N);

    dist[sIdx] = 0;
    const open = [sIdx];

    const dirs8 = [
      [1, 0, 1.0], [-1, 0, 1.0], [0, 1, 1.0], [0, -1, 1.0],
      [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]
    ];

    let found = false;
    let steps = 0;
    while (open.length > 0 && steps++ < 3200) {
      let bestK = 0;
      let bestD = dist[open[0]];
      for (let k = 1; k < open.length; k++) {
        const d = dist[open[k]];
        if (d < bestD) { bestD = d; bestK = k; }
      }
      const cur = open[bestK];
      open[bestK] = open[open.length - 1];
      open.pop();

      if (closed[cur]) continue;
      closed[cur] = 1;
      if (cur === eIdx) { found = true; break; }

      const cx = cur % GRID_SIZE;
      const cz = (cur / GRID_SIZE) | 0;

      for (const [dx, dz, baseCost] of dirs8) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (closed[ni]) continue;
        if (wd[ni] <= 0.12 || grid[ni].dam) continue;

        // Prevent diagonal corner-cutting across dry land!
        if (dx !== 0 && dz !== 0) {
          if (wd[idx(cx + dx, cz)] <= 0.12 || wd[idx(cx, cz + dz)] <= 0.12) continue;
        }

        const shallowPenalty = wd[ni] < 0.26 ? 0.9 : 0;
        const bridgePenalty = grid[ni].roadGround > 0 ? 2.5 : 0;
        const nd = bestD + baseCost + shallowPenalty + bridgePenalty;
        if (nd < dist[ni]) {
          dist[ni] = nd;
          prev[ni] = cur;
          open.push(ni);
        }
      }
    }

    if (!found) return null;

    const raw = [];
    let cur = eIdx;
    while (cur !== -1) {
      const x = cur % GRID_SIZE;
      const z = (cur / GRID_SIZE) | 0;
      const w = tileToWorld(x, z);
      raw.push({ x, z, wx: w.wx, wz: w.wz });
      if (cur === sIdx) break;
      cur = prev[cur];
    }
    raw.reverse();
    if (raw.length < 2) return null;

    // Gentle path relaxation over wet tiles so ships glide along smooth curves
    const smoothed = raw.map((p) => ({ ...p }));
    for (let k = 1; k < smoothed.length - 1; k++) {
      const mx = (raw[k - 1].wx + raw[k].wx * 2 + raw[k + 1].wx) * 0.25;
      const mz = (raw[k - 1].wz + raw[k].wz * 2 + raw[k + 1].wz) * 0.25;
      const mt = worldToTile(mx, mz);
      if (inBounds(mt.x, mt.z) && wd[idx(mt.x, mt.z)] > 0.12 && !grid[idx(mt.x, mt.z)].dam) {
        smoothed[k].wx = mx;
        smoothed[k].wz = mz;
      }
    }
    return smoothed;
  }

  findSeaOriginForBerth(bx, bz) {
    const wd = this.sim.waterDepth;
    // Primary SE Sea Bay ocean edge (x=53, z=51)
    const candidates = [{ x: 53, z: 51 }];
    for (let r = 1; r <= 7; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          const nx = 53 + dx, nz = 51 + dz;
          if (inBounds(nx, nz) && wd[idx(nx, nz)] > 0.12) {
            candidates.push({ x: nx, z: nz });
          }
        }
      }
    }
    // Also include map-edge river/sea cells as fallback for inland river ports
    for (let g = 2; g < GRID_SIZE - 2; g += 2) {
      for (const edge of [
        { x: GRID_SIZE - 2, z: g },
        { x: g, z: GRID_SIZE - 2 },
        { x: 1, z: g },
        { x: g, z: 1 }
      ]) {
        if (wd[idx(edge.x, edge.z)] > 0.12) candidates.push(edge);
      }
    }

    for (const c of candidates) {
      if (!inBounds(c.x, c.z) || wd[idx(c.x, c.z)] <= 0.12) continue;
      if (Math.hypot(c.x - bx, c.z - bz) < 3) continue;
      const path = this.findWaterPath(c.x, c.z, bx, bz);
      if (path && path.length >= 3) return path;
    }
    return null;
  }

  trySpawnShip(seaports) {
    const port = seaports[(Math.random() * seaports.length) | 0];
    const wd = this.sim.waterDepth;

    // Find adjacent water berth tiles (waterDepth > 0.12) within 2 tiles of seaport
    const berths = [];
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx === 0 && dz === 0) continue;
        const nx = port.x + dx, nz = port.z + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (wd[ni] > 0.12 && !this.sim.grid[ni].dam) {
          berths.push({ x: nx, z: nz, depth: wd[ni], d2: dx * dx + dz * dz });
        }
      }
    }
    berths.sort((a, b) => (a.d2 - b.d2) || (b.depth - a.depth));

    for (const berth of berths) {
      const path = this.findSeaOriginForBerth(berth.x, berth.z);
      if (!path) continue;

      const p0 = path[0];
      const p1 = path[1];
      // Ensure we don't spawn directly on top of another ship at sea edge
      const blocked = this.ships.some((s) => Math.hypot(s.wx - p0.wx, s.wz - p0.wz) < 1.8);
      if (blocked) return;

      const dx = p1.wx - p0.wx;
      const dz = p1.wz - p0.wz;
      const yaw = Math.atan2(dx, dz);
      const surfY = this.sim.getTileElev(p0.x, p0.z) + wd[idx(p0.x, p0.z)];

      this.ships.push({
        portX: port.x,
        portZ: port.z,
        waypoints: path,
        seg: 0,
        t: 0,
        leg: 'inbound',
        dwell: 0,
        speed: 0.55,
        maxSpeed: 0.92 + Math.random() * 0.16,
        wx: p0.wx,
        wy: surfY,
        wz: p0.wz,
        yaw,
        dirX: Math.sin(yaw),
        dirZ: Math.cos(yaw),
        roll: 0,
        pitch: 0,
        bobPhase: Math.random() * Math.PI * 2,
        variant: (port.x + port.z + this.ships.length) % 4
      });
      return;
    }
  }

  updateShips(effDt) {
    const seaports = [];
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      const b = t.building;
      if (b && b.type === 'seaport' && !b.abandoned && !b.underConstruction && !b.flooded) {
        if (this.sim.hasNearbyWater(t.x, t.z, 2).found) {
          seaports.push(t);
        }
      }
    }

    if (seaports.length === 0) {
      this.ships.length = 0;
      this.shipTimer = 0;
      return;
    }

    const maxShips = 2;
    if (this.ships.length >= maxShips) {
      this.shipTimer = 0;
    } else {
      this.shipTimer += effDt;
      if ((this.ships.length === 0 && this.shipTimer >= 2.0) || (this.ships.length < maxShips && this.shipTimer >= 8.5)) {
        this.shipTimer = 0;
        this.trySpawnShip(seaports);
      }
    }

    for (let i = this.ships.length - 1; i >= 0; i--) {
      const ship = this.ships[i];
      if (!this.isValidShipState(ship)) {
        this.ships.splice(i, 1);
        continue;
      }

      // 3s pause at berth to load/unload cargo containers
      if (ship.dwell > 0) {
        ship.speed = 0;
        ship.dwell -= effDt;
        const lastWp = ship.waypoints[ship.waypoints.length - 1];
        const surf = this.sim.getTileElev(lastWp.x, lastWp.z) + this.sim.waterDepth[idx(lastWp.x, lastWp.z)];
        ship.wy = surf + Math.sin(this.signalClock * 1.6 + ship.bobPhase) * 0.008;
        ship.roll = Math.sin(this.signalClock * 1.2 + ship.bobPhase) * 0.015;
        if (ship.dwell <= 0) {
          ship.dwell = 0;
          ship.leg = 'outbound';
          ship.waypoints = ship.waypoints.slice().reverse();
          ship.seg = 0;
          ship.t = 0;
        }
        continue;
      }

      const wps = ship.waypoints;
      if (!wps || ship.seg >= wps.length - 1) {
        this.ships.splice(i, 1);
        continue;
      }

      const p0 = wps[ship.seg];
      const p1 = wps[ship.seg + 1];
      const segDx = p1.wx - p0.wx;
      const segDz = p1.wz - p0.wz;
      const segLen = Math.hypot(segDx, segDz) || 1;

      const nearBerth =
        (ship.leg === 'inbound' && ship.seg >= wps.length - 2) ||
        (ship.leg === 'outbound' && ship.seg === 0);
      let targetSpeed = nearBerth ? ship.maxSpeed * 0.55 : ship.maxSpeed;

      // Ship-to-ship safe spacing on same leg or near berth
      for (let j = 0; j < this.ships.length; j++) {
        if (i === j) continue;
        const o = this.ships[j];
        const rx = o.wx - ship.wx;
        const rz = o.wz - ship.wz;
        const d = Math.hypot(rx, rz);
        if (d < 1.25) {
          const fwd = rx * ship.dirX + rz * ship.dirZ;
          if (fwd > 0 && (o.dwell > 0 || ship.dirX * o.dirX + ship.dirZ * o.dirZ > 0.3)) {
            targetSpeed = 0;
            break;
          }
        }
      }

      ship.speed += (targetSpeed - ship.speed) * Math.min(1, effDt * 2.2);
      if (ship.speed < 0.01 && targetSpeed === 0) ship.speed = 0;
      ship.t += (ship.speed / segLen) * effDt;

      while (ship.t >= 1.0) {
        ship.t -= 1.0;
        ship.seg++;
        if (ship.seg >= wps.length - 1) break;
      }

      if (ship.seg >= wps.length - 1) {
        if (ship.leg === 'inbound') {
          const berthWp = wps[wps.length - 1];
          ship.wx = berthWp.wx;
          ship.wz = berthWp.wz;
          ship.dwell = 3.0;
          ship.leg = 'berth';
          ship.speed = 0;
          if (!this.isValidShipState(ship)) {
            this.ships.splice(i, 1);
          }
          continue;
        } else {
          this.ships.splice(i, 1);
          continue;
        }
      }

      const c0 = wps[ship.seg];
      const c1 = wps[ship.seg + 1];
      const vx = c1.wx - c0.wx;
      const vz = c1.wz - c0.wz;
      const vLen = Math.hypot(vx, vz) || 1;
      const targetYaw = Math.atan2(vx / vLen, vz / vLen);

      ship.yaw = lerpAngle(ship.yaw, targetYaw, Math.min(1, effDt * 3.2));
      ship.dirX = Math.sin(ship.yaw);
      ship.dirZ = Math.cos(ship.yaw);

      // Subtle starboard channel separation so inbound & outbound ships pass port-to-port cleanly
      const distFromBerth = ship.leg === 'inbound'
        ? (wps.length - 1 - (ship.seg + ship.t))
        : (ship.seg + ship.t);
      const laneTaper = Math.min(1, Math.max(0, (distFromBerth - 0.6) / 1.5));
      const rightX = -ship.dirZ;
      const rightZ = ship.dirX;
      const laneOff = 0.15 * laneTaper;

      const baseWx = c0.wx + vx * ship.t;
      const baseWz = c0.wz + vz * ship.t;
      let nextWx = baseWx + rightX * laneOff;
      let nextWz = baseWz + rightZ * laneOff;
      const offTile = worldToTile(nextWx, nextWz);
      if (!inBounds(offTile.x, offTile.z) ||
          !(this.sim.waterDepth[idx(offTile.x, offTile.z)] > 0.08) ||
          this.sim.grid[idx(offTile.x, offTile.z)].dam) {
        nextWx = baseWx;
        nextWz = baseWz;
      }
      ship.wx = nextWx;
      ship.wz = nextWz;

      if (!this.isValidShipState(ship)) {
        this.ships.splice(i, 1);
        continue;
      }

      const s0 = this.sim.getTileElev(c0.x, c0.z) + this.sim.waterDepth[idx(c0.x, c0.z)];
      const s1 = this.sim.getTileElev(c1.x, c1.z) + this.sim.waterDepth[idx(c1.x, c1.z)];
      ship.wy = s0 + (s1 - s0) * ship.t + Math.sin(this.signalClock * 1.8 + ship.bobPhase) * 0.012;
      ship.roll = Math.sin(this.signalClock * 1.3 + ship.bobPhase) * 0.022;
    }
  }
}
