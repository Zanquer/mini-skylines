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
    if (sim) sim.traffic = this;
    this.vehicles = [];
    this.trains = [];      // HSR multi-car bullet trains & underground metro trains!
    this.aircraft = [];    // 3D Wide-body Airliners approaching/landing/climbing at airports!
    this.ships = [];       // 3D Cargo Container Ships sailing SE Sea Bay <-> Seaport!
    this.leisureBoats = []; // 3D Coastal CC0 Sailboats & Fishing Boats cruising the bay!
    this.busStops = [];    // Active roadside EV bus stop tiles collected during refreshRoadGraph!
    this.pedestrians = []; // Lightweight sidewalk pedestrians (<= 240, pure data, zero Three.js dependency)
    this.accidents = [];   // Active road traffic accidents awaiting or being cleared by Traffic Police
    this._pedRoadPool = [];
    this._pedSpawnTimer = 0;
    this.spawnTimer = 0;
    this.trainTimer = 0;
    this.fireTimer = 0;
    this.policeTimer = 0;
    this._accidentCooldown = 90;
    this._jamCooldown = 0;
    this.aircraftTimer = 0;
    this.shipTimer = 2.0;
    this._boatSpawnTimer = 1.0;
    this.signalClock = 0;
    this.modalTimer = 0;
    this._nextVehId = 1;
    this._nextTrainId = 1;
    this._nextShipId = 1;
    this._nextBoatId = 1;
    this._nextPedId = 1;
    this._nextAccidentId = 1;
    this.totalAccidentsCleared = 0;

    const N = GRID_SIZE * GRID_SIZE;
    this.roadDegree = new Uint8Array(N);
    this.tileOccupancy = new Uint8Array(N);
    this.elevOccupancy = new Uint8Array(N);
    this.elevViaductOpen = new Uint8Array(N);
    this.tunnelOpen = new Uint8Array(N);
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
    this.leisureBoats.length = 0;
    this.busStops.length = 0;
    this.pedestrians.length = 0;
    this.accidents.length = 0;
    this._pedRoadPool.length = 0;
    this._pedSpawnTimer = 0;
    this.spawnTimer = 0;
    this.fireTimer = 0;
    this.policeTimer = 0;
    this._accidentCooldown = 90;
    this._jamCooldown = 0;
    this.totalAccidentsCleared = 0;
    this.trainTimer = 0;
    this.aircraftTimer = 0;
    this.shipTimer = 2.0;
    this._boatSpawnTimer = 1.0;
    this.modalTimer = 0;
    this.tileOccupancy.fill(0);
    this.elevOccupancy.fill(0);
    this.elevViaductOpen.fill(0);
    this.tunnelOpen.fill(0);
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
        police_station: '警察总局',
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
    this.ensureRampGraphFresh();

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

      // Collect sidewalk pedestrian spawn candidates near populated zones, parks, bus stops & rail stations (skip isolated 0-neighbor unfinished road stubs!)
      if (passGround && (t.roadGround === 1 || t.roadGround === 2) && !t.dam && !t.ramp && (this.roadDegree[i] || 0) >= 1) {
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
    if (this._inUpdateTick) return;
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
        const hasLowGround = Boolean(lowNb && this.isGroundRoadPassable(lowNb));
        const hasHighElev = Boolean(highNb && highNb.roadElevated > 0);
        const rampConnected = hasLowGround && hasHighElev;
        const lowRef = hasLowGround
          ? { x: lowNb.x, z: lowNb.z }
          : { x: lowEnd.x, z: lowEnd.z };
        const highRef = hasHighElev
          ? { x: highNb.x, z: highNb.z }
          : { x: highEnd.x, z: highEnd.z };
        const rampChainId = ordered[0].i + 1;

        for (let k = 0; k < K; k++) {
          this.rampMeta.set(ordered[k].i, {
            chainId: rampChainId,
            connected: rampConnected,
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

    // Physical Completeness Rule A: Elevated highway components MUST have >= 2 connected ramps,
    // and half-built dead-end elevated sky-stubs are strictly CLOSED to traffic!
    this.elevViaductOpen.fill(0);
    const elevVis = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const t = grid[i];
      if (!(t.roadElevated > 0) || elevVis[i]) continue;
      if (t.ramp) {
        const rm = this.rampMeta.get(i);
        if (!rm || (!rm.connected && !rm.throughElev)) continue;
      }
      const comp = [];
      const connectedRampChains = new Set();
      const q = [i];
      elevVis[i] = 1;
      for (let qh = 0; qh < q.length; qh++) {
        const ci = q[qh];
        comp.push(ci);
        const ct = grid[ci];
        const crm = ct.ramp ? this.rampMeta.get(ci) : null;
        if (crm && crm.connected) connectedRampChains.add(crm.chainId);
        const cx = ci % GRID_SIZE;
        const cz = (ci / GRID_SIZE) | 0;
        for (let d = 0; d < 4; d++) {
          if (crm && d !== crm.lowDir && d !== crm.highDir) continue;
          const nx = cx + RAMP_DIRS[d].dx;
          const nz = cz + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (elevVis[ni]) continue;
          const nt = grid[ni];
          if (!(nt.roadElevated > 0)) continue;
          if (nt.ramp) {
            const nrm = this.rampMeta.get(ni);
            if (!nrm || (!nrm.connected && !nrm.throughElev)) continue;
            const oppD = RAMP_DIRS[d].opp;
            if (oppD !== nrm.lowDir && oppD !== nrm.highDir) continue;
          }
          elevVis[ni] = 1;
          q.push(ni);
        }
      }
      if (connectedRampChains.size >= 2) {
        for (let k = 0; k < comp.length; k++) {
          this.elevViaductOpen[comp[k]] = 1;
        }
      }
    }
    // Iteratively close any half-built dead-end elevated branch sticking out into mid-air off a completed viaduct!
    let prunedElev = true;
    while (prunedElev) {
      prunedElev = false;
      for (let i = 0; i < N; i++) {
        if (!this.elevViaductOpen[i]) continue;
        const t = grid[i];
        if (t.ramp) continue;
        const cx = i % GRID_SIZE;
        const cz = (i / GRID_SIZE) | 0;
        let openDeg = 0;
        for (let d = 0; d < 4; d++) {
          const nx = cx + RAMP_DIRS[d].dx;
          const nz = cz + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (!this.elevViaductOpen[ni]) continue;
          const nt = grid[ni];
          if (nt.ramp) {
            const nrm = this.rampMeta.get(ni);
            const oppD = RAMP_DIRS[d].opp;
            if (!nrm || (oppD !== nrm.highDir && !(nrm.throughElev && oppD === nrm.lowDir))) continue;
          }
          openDeg++;
        }
        if (openDeg < 2) {
          this.elevViaductOpen[i] = 0;
          prunedElev = true;
        }
      }
    }

    // Physical Completeness Rule B: Mountain tunnels (roadGround === 4) MUST have >= 2 open surface portals!
    this.tunnelOpen.fill(0);
    const tunVis = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (grid[i].roadGround !== 4 || tunVis[i]) continue;
      const comp = [];
      const surfacePortals = new Set();
      const q = [i];
      tunVis[i] = 1;
      for (let qh = 0; qh < q.length; qh++) {
        const ci = q[qh];
        comp.push(ci);
        const cx = ci % GRID_SIZE;
        const cz = (ci / GRID_SIZE) | 0;
        for (let d = 0; d < 4; d++) {
          const nx = cx + RAMP_DIRS[d].dx;
          const nz = cz + RAMP_DIRS[d].dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          const nt = grid[ni];
          if (nt.roadGround === 4 && !tunVis[ni]) {
            tunVis[ni] = 1;
            q.push(ni);
          } else if (nt.roadGround >= 1 && nt.roadGround <= 3 && !nt.dam && this.isGroundRoadPassable(nt)) {
            surfacePortals.add(ni);
          }
        }
      }
      if (surfacePortals.size >= 2) {
        for (let k = 0; k < comp.length; k++) {
          this.tunnelOpen[comp[k]] = 1;
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
    const nIdx = idx(node.x, node.z);

    if (node.onRamp) {
      if (!(tile.ramp === true && tile.roadElevated > 0 && this.isGroundRoadPassable(tile))) {
        return false;
      }
      this.ensureRampGraphFresh();
      const rm = this.rampMeta.get(nIdx);
      if (!rm || !rm.connected || !this.elevViaductOpen[nIdx]) return false;
    } else if (node.layer === 0) {
      if (!this.isGroundRoadPassable(tile)) return false;
      this.ensureRampGraphFresh();
      if (tile.roadGround === 4 && !this.tunnelOpen[nIdx]) return false;
      if (node.onRamp === false && tile.ramp) {
        const rm = this.rampMeta.get(nIdx);
        if (!rm || !rm.throughGround) return false;
      }
    } else if (node.layer === 1) {
      if (!(tile.roadElevated > 0)) return false;
      this.ensureRampGraphFresh();
      if (!this.elevViaductOpen[nIdx]) return false;
      if (node.onRamp === false && tile.ramp) {
        const rm = this.rampMeta.get(nIdx);
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
      // Keep tunnel portal transition strictly level at the surface approach elevation (eliminates hillside plunge/clipping!)
      if (p0.layer === 0 && p1.layer === 0) {
        const t0 = this.sim.getTile(p0.x, p0.z);
        const t1 = this.sim.getTile(p1.x, p1.z);
        const isT0 = Boolean(t0 && t0.roadGround === 4);
        const isT1 = Boolean(t1 && t1.roadGround === 4);
        if (isT0 !== isT1) {
          return isT0
            ? this.getRoadNodeY(p1.x, p1.z, 0)
            : this.getRoadNodeY(p0.x, p0.z, 0);
        }
      }
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
      return multi ? (v.laneSlot === 1 ? 0.295 : 0.105) : 0.175;
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
      return v.laneSlot === 1 ? 0.19 : -0.17;
    }

    const isMultiLane =
      p0.layer === 1 ||
      p1.layer === 1 ||
      (t0 && t0.roadGround >= 2 && t0.roadGround !== 4) ||
      (t1 && t1.roadGround >= 2 && t1.roadGround !== 4);

    let laneOff = isMultiLane ? (v.laneSlot === 1 ? 0.295 : 0.105) : 0.175;

    // 2. Ground underpass boulevard flare (0.39) around central median_split ramp
    if (p0.layer === 0 && p1.layer === 0) {
      const rm0 = t0?.ramp ? this.rampMeta.get(i0) : null;
      const rm1 = t1?.ramp ? this.rampMeta.get(i1) : null;
      const split0 = Boolean(rm0 && rm0.throughGround && rm0.mode === 'median_split');
      const split1 = Boolean(rm1 && rm1.throughGround && rm1.mode === 'median_split');
      if (split0 || split1) {
        if (split0 && !split1 && isMultiLane) {
          v.laneSlot = 1;
          laneOff = 0.295;
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

    // 3. Smooth outward arc bulge (+0.07) around roundabout hub center (only when hub degree >= 3)
    const r0 = p0.layer === 0 && t0?.junctionMode === 'roundabout' && this.roadDegree[i0] >= 3;
    const r1 = p1.layer === 0 && t1?.junctionMode === 'roundabout' && this.roadDegree[i1] >= 3;
    if (r0 || r1) {
      let rWeight = 1.0;
      if (r0 && !r1) {
        rWeight = Math.cos(clampedT * Math.PI * 0.5);
      } else if (!r0 && r1) {
        rWeight = Math.sin(clampedT * Math.PI * 0.5);
      }
      laneOff += 0.07 * rWeight;
    }
    // Keep vehicles funnelled cleanly inside mountain tunnel bore opening (±0.35m) so wide trucks never clip portal piers!
    if (p0.layer === 0 && p1.layer === 0 && (t0?.roadGround === 4 || t1?.roadGround === 4)) {
      return Math.min(0.165, laneOff);
    }
    return Math.min(0.35, laneOff);
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

    let segDirX = v.dirX || 0;
    let segDirZ = v.dirZ || -1;
    if (len > 0.01) {
      const targetDirX = vx / len;
      const targetDirZ = vz / len;
      segDirX = targetDirX;
      segDirZ = targetDirZ;
      if (effDt <= 0 || !Number.isFinite(v.dirX) || !Number.isFinite(v.dirZ)) {
        v.dirX = targetDirX;
        v.dirZ = targetDirZ;
      } else {
        // True angular heading interpolation (lerpAngle) -> MATHEMATICALLY IMPOSSIBLE to lock 180° backwards on ramps/viaducts!
        const dot = (v.dirX || 0) * targetDirX + (v.dirZ || 0) * targetDirZ;
        if (dot < -0.65) {
          // Instant heading alignment on sharp reversal so vehicles NEVER travel backwards or swing into oncoming lanes!
          v.dirX = targetDirX;
          v.dirZ = targetDirZ;
        } else {
          const curYaw = Math.atan2(v.dirX, v.dirZ);
          const targetYaw = Math.atan2(targetDirX, targetDirZ);
          const nextYaw = lerpAngle(curYaw, targetYaw, Math.min(1, effDt * 14));
          v.dirX = Math.sin(nextYaw);
          v.dirZ = Math.cos(nextYaw);
        }
      }
    }

    // Use smooth heading for right-hand lane offset, falling back to true segment right when steering > 60° to prevent oncoming swings
    const alignDot = v.dirX * segDirX + v.dirZ * segDirZ;
    const rightX = alignDot >= 0.45 ? -v.dirZ : -segDirZ;
    const rightZ = alignDot >= 0.45 ? v.dirX : segDirX;
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

    const t0 = this.sim.getTile(p0.x, p0.z);
    const t1 = this.sim.getTile(p1.x, p1.z);
    const isT0 = p0.layer === 0 && !p0.onRamp && t0?.roadGround === 4;
    const isT1 = p1.layer === 0 && !p1.onRamp && t1?.roadGround === 4;

    if (isT0 !== isT1) {
      // Exact portal-mouth visibility & level pitch: cars stay 1.0x full-size in renderer3d while _portalFade tracks deep hood occlusion
      v.pitch = 0;
      const ct = v.t || 0;
      if (!isT0 && isT1) {
        v.inTunnel = ct >= 0.60;
        v._portalFade = ct <= 0.42 ? 1.0 : Math.max(0.42, 1.0 - ((ct - 0.42) / 0.18) * 0.58);
      } else {
        v.inTunnel = ct < 0.40;
        v._portalFade = ct >= 0.58 ? 1.0 : Math.max(0.42, 0.42 + ((ct - 0.40) / 0.18) * 0.58);
      }
    } else {
      // Finite-difference 3D slope pitch across exact Hermite ramp & terrain profile!
      const tLo = Math.max(0, (v.t || 0) - 0.05);
      const tHi = Math.min(1, (v.t || 0) + 0.05);
      const dtSpan = tHi - tLo;
      const dy = dtSpan > 1e-4 ? (this.sampleSegmentHeight(p0, p1, tHi) - this.sampleSegmentHeight(p0, p1, tLo)) : 0;
      const rawSlope = (len > 0.05 && dtSpan > 1e-4) ? Math.atan2(dy, dtSpan * len) : 0;
      v.pitch = effDt <= 0 ? rawSlope : ((v.pitch || 0) * 0.78 + rawSlope * 0.22);
      v.inTunnel = Boolean(isT0 && isT1);
      v._portalFade = 1.0;
    }
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
    if ((!newPath || newPath.length < 2) && v.kind === 'police' && v.policeTargetAccidentId) {
      const acc = this.accidents.find((a) => a.id === v.policeTargetAccidentId);
      if (acc) {
        newPath = this.findRoadPath(cur.x, cur.z, acc.x, acc.z, startOnRamp, startLayer, false);
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
    const inBerthOrDepart = ship.leg === 'berth' || (ship.dwell > 0) || ((ship.departGrace || 0) > 0);
    if ((dx !== 0 || dz !== 0) && !inBerthOrDepart) {
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

    for (let i = this.accidents.length - 1; i >= 0; i--) {
      const acc = this.accidents[i];
      const at = this.sim.getTile(acc.x, acc.z);
      if (!at || !(at.roadGround >= 1 && at.roadGround <= 3) || at.dam) {
        this._clearAccidentEntities(acc, false);
        this.accidents.splice(i, 1);
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

    const prevTick = this._inUpdateTick;
    this._inUpdateTick = true;
    try {
      if (sig !== this.lastRoadSignature || this.sim.meshDirty) {
        this.lastRoadSignature = sig;
        this.revalidateActiveTransport();
      }
      this.refreshModalSplitDemand();
    } finally {
      this._inUpdateTick = prevTick;
    }
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
    if (grid[eIdx].roadGround === 4 && !this.tunnelOpen[eIdx]) return null;
    if (startLayer === 1 && !startOnRamp) {
      if (!(grid[sIdx].roadElevated > 0) || !this.elevViaductOpen[sIdx]) return null;
    } else if (startOnRamp) {
      const srm = this.rampMeta.get(sIdx);
      if (!grid[sIdx].ramp || !srm || !srm.connected || !this.elevViaductOpen[sIdx]) return null;
    } else {
      if (!this.isGroundRoadPassable(grid[sIdx])) return null;
      if (grid[sIdx].roadGround === 4 && !this.tunnelOpen[sIdx]) return null;
    }

    let startState = startOnRamp ? (2 * N + sIdx) : (startLayer === 1 ? (N + sIdx) : sIdx);
    if (!startOnRamp && startLayer === 0 && grid[sIdx].ramp && !this.rampMeta.get(sIdx)?.throughGround) {
      const srm = this.rampMeta.get(sIdx);
      if (!srm || !srm.connected || !this.elevViaductOpen[sIdx]) return null;
      startState = 2 * N + sIdx;
    }

    let endState = eIdx;
    if (grid[eIdx].ramp && !this.rampMeta.get(eIdx)?.throughGround) {
      const erm = this.rampMeta.get(eIdx);
      if (!erm || !erm.connected || !this.elevViaductOpen[eIdx]) return null;
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
            if (this.isGroundRoadPassable(nt) && (nt.roadGround !== 4 || this.tunnelOpen[ni])) {
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
            // 2) Enter sloped ramp deck strictly from its lowDir mouth ONLY if ramp & viaduct are structurally finished!
            if (nrm.connected && this.elevViaductOpen[ni] && oppD === nrm.lowDir && Math.abs(nrm.lowFrac) < 1e-5) {
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
            if (nt.roadElevated > 0 && this.elevViaductOpen[ni]) {
              const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
              relax(N + ni, curCost + eCost, cur);
            }
          } else {
            const nrm = this.rampMeta.get(ni);
            if (!nrm || !this.elevViaductOpen[ni]) continue;
            const oppD = RAMP_DIRS[d].opp;
            // 1) Continue along continuous elevated viaduct deck (mid_slip throughElev)
            if (nrm.throughElev && nt.roadElevated > 0 && (oppD === nrm.lowDir || oppD === nrm.highDir)) {
              const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
              relax(N + ni, curCost + eCost, cur);
            }
            // 2) Enter sloped ramp deck strictly from its highDir crest (highFrac === 1.0)
            if (nrm.connected && oppD === nrm.highDir && Math.abs(nrm.highFrac - 1.0) < 1e-5) {
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
              if (nt.roadElevated > 0 && this.elevViaductOpen[ni] && (!nt.ramp || nrm?.throughElev)) {
                const eCost = 0.56 + (nt.elevCongestion || 0) * 1.4;
                relax(N + ni, curCost + eCost, cur);
              }
            } else if (nt.ramp && this.rampMeta.has(ni) && this.elevViaductOpen[ni]) {
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
      id: this._nextVehId++,
      variantIdx: 0,
      tripType: 'service',
      tripLabel: '🚒 消防紧急出警',
      fromName,
      toName,
      originTile: { x: bestStation.x, z: bestStation.z },
      destTile: { x: burningTile.x, z: burningTile.z },
      color: [0.95, 0.14, 0.14],
      length: 0.44,
      width: 0.185,
      height: 0.19,
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

  _clearAccidentEntities(acc, sendPoliceHome = true) {
    if (!acc) return;
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (v.accidentId === acc.id) {
        v.accidentId = null;
        v.accidentYawOffset = 0;
        v.stuckTimer = 0;
        if (v._origTripLabel) v.tripLabel = v._origTripLabel;
      }
      if (v.kind === 'police' && (v.policeOnSceneId === acc.id || v.policeTargetAccidentId === acc.id)) {
        v.policeOnSceneId = null;
        v.policeTargetAccidentId = null;
        v.stuckTimer = 0;
        v.policeReturning = true;
        v.tripLabel = '🚓 交警勘查完毕返航';
        if (sendPoliceHome && acc.policeStationTile) {
          const cur = v.path && v.path[Math.min(v.seg, v.path.length - 1)];
          const stAcc = this.sim.findRoadAccess(acc.policeStationTile.x, acc.policeStationTile.z);
          if (cur && stAcc) {
            const retPath = this.findRoadPath(cur.x, cur.z, stAcc.rx, stAcc.rz, false, 0, false);
            if (retPath && retPath.length >= 2) {
              v.path = retPath;
              v.seg = 0;
              v.t = 0;
              v.toName = v.fromName || '警察总局';
              v.destTile = { x: acc.policeStationTile.x, z: acc.policeStationTile.z };
              this.syncVehicleTransform(v, 0);
              continue;
            }
          }
        }
        // If no home station or path available, allow smooth finish at end of current path
        if (v.path && v.seg >= v.path.length - 1) {
          v.seg = Math.max(0, v.path.length - 2);
          v.t = 0.96;
        }
      }
    }
  }

  triggerTrafficAccident(tx = null, tz = null, options = {}) {
    if (this.accidents.length >= 3) return null;
    this.ensureRampGraphFresh();

    const isEligibleVeh = (v) => (
      v && !v.inTunnel && !v.accidentId && !v.policeOnSceneId &&
      v.kind !== 'firetruck' && v.kind !== 'police' && v.kind !== 'bus' &&
      v.path && v.path[v.seg] && (v.path[v.seg].layer || 0) === 0 && !v.path[v.seg].onRamp
    );

    let chosenTile = null;
    let involved = [];

    if (typeof tx === 'number' && typeof tz === 'number' && inBounds(tx, tz)) {
      const t = this.sim.getTile(tx, tz);
      if (!t || !(t.roadGround >= 1 && t.roadGround <= 3) || t.dam || t.ramp) return null;
      if (this.accidents.some((a) => a.x === tx && a.z === tz)) return null;
      chosenTile = t;
      for (let i = 0; i < this.vehicles.length && involved.length < 2; i++) {
        const v = this.vehicles[i];
        if (!isEligibleVeh(v)) continue;
        const cur = v.path[v.seg];
        if (Math.abs(cur.x - tx) <= 1 && Math.abs(cur.z - tz) <= 1) {
          involved.push(v);
        }
      }
      // If triggered directly on an empty road tile (e.g., manual test/event), stage a realistic stopped sedan at the crash tile
      if (involved.length === 0) {
        let nb = null;
        for (const d of RAMP_DIRS) {
          const nx = tx + d.dx, nz = tz + d.dz;
          const nt = this.sim.getTile(nx, nz);
          if (nt && nt.roadGround >= 1 && nt.roadGround <= 3 && !nt.dam) {
            nb = { x: nx, z: nz, layer: 0, onRamp: false };
            break;
          }
        }
        if (nb) {
          const w0 = tileToWorld(tx, tz);
          const staged = {
            kind: 'car',
            id: this._nextVehId++,
            variantIdx: (this._nextAccidentId * 3) % 10,
            tripType: 'commute',
            tripLabel: '🚗 市民通勤',
            fromName: '城区道路',
            toName: '市区干道',
            originTile: { x: tx, z: tz },
            destTile: { x: nb.x, z: nb.z },
            color: [0.92, 0.94, 0.97],
            length: 0.30,
            width: 0.145,
            height: 0.12,
            path: [{ x: tx, z: tz, layer: 0, onRamp: false }, nb],
            seg: 0,
            t: 0.18,
            speed: 0,
            maxSpeed: 1.85,
            stuckTimer: 0,
            laneSlot: 0,
            laneChangeCooldown: 0,
            wx: w0.wx,
            wy: this.getRoadNodeY(tx, tz, 0),
            wz: w0.wz,
            dirX: nb.x - tx,
            dirZ: nb.z - tz,
            inTunnel: false
          };
          this.syncVehicleTransform(staged, 0);
          this.vehicles.push(staged);
          involved.push(staged);
        }
      }
    } else {
      // Pick a busy ground road/intersection with live surface vehicles
      let bestScore = -1;
      for (let i = 0; i < this.vehicles.length; i++) {
        const v = this.vehicles[i];
        if (!isEligibleVeh(v)) continue;
        const cur = v.path[v.seg];
        const t = this.sim.getTile(cur.x, cur.z);
        if (!t || !(t.roadGround >= 1 && t.roadGround <= 3) || t.dam || t.ramp) continue;
        if (this.accidents.some((a) => Math.hypot(a.x - cur.x, a.z - cur.z) < 5)) continue;
        const ti = idx(cur.x, cur.z);
        const deg = this.roadDegree[ti] || 0;
        const score = (deg >= 3 ? 3.0 : 1.0) + (this.tileOccupancy[ti] || 0) * 1.4 + (t.congestion || 0) * 2.0;
        if (score > bestScore) {
          bestScore = score;
          chosenTile = t;
          involved = [v];
        }
      }
      if (chosenTile && involved.length === 1) {
        const v0 = involved[0];
        for (let i = 0; i < this.vehicles.length; i++) {
          const o = this.vehicles[i];
          if (o === v0 || !isEligibleVeh(o)) continue;
          if (Math.hypot(o.wx - v0.wx, o.wz - v0.wz) <= 1.05) {
            involved.push(o);
            break;
          }
        }
      }
    }

    if (!chosenTile) return null;
    const deg = this.roadDegree[idx(chosenTile.x, chosenTile.z)] || 0;
    const roadName = deg >= 4
      ? '四向十字路口'
      : (deg === 3 ? '三向交叉路口' : (chosenTile.roadGround >= 2 ? '四车道主干道' : '城市街道'));
    const wInfo = typeof this.sim.getWeatherInfo === 'function' ? this.sim.getWeatherInfo() : { id: 'sunny' };
    const isBadWeather = wInfo.id === 'rain' || wInfo.id === 'storm' || wInfo.id === 'snow' || wInfo.id === 'blizzard';
    const cause = options.cause || (
      isBadWeather
        ? '雨雪路面打滑追尾剐蹭'
        : (deg >= 3 ? '繁忙路口抢行刮擦事故' : '并线未让行轻微碰撞')
    );

    const highSafety = (chosenTile.safety || 0) >= 60;
    const totalTime = Number(options.duration || (isBadWeather ? 8.5 : (highSafety ? 6.5 : 7.5)));
    const wCenter = tileToWorld(chosenTile.x, chosenTile.z);
    const primaryVeh = involved[0];
    const acc = {
      id: this._nextAccidentId++,
      type: options.type || 'crash',
      x: chosenTile.x,
      z: chosenTile.z,
      wx: primaryVeh ? primaryVeh.wx : wCenter.wx,
      wy: primaryVeh ? primaryVeh.wy : this.getRoadNodeY(chosenTile.x, chosenTile.z, 0),
      wz: primaryVeh ? primaryVeh.wz : wCenter.wz,
      roadName,
      cause,
      vehicleIds: involved.map((v) => v.id),
      state: 'awaiting_police',
      policeVehicleId: null,
      policeStationTile: null,
      totalTime,
      remainingTime: totalTime,
      selfClearTimer: Number(options.selfClearTime || 18.0),
      elapsed: 0
    };

    for (let k = 0; k < involved.length; k++) {
      const v = involved[k];
      v._origTripLabel = v._origTripLabel || v.tripLabel;
      v.accidentId = acc.id;
      v.accidentYawOffset = k === 0 ? 0.28 : -0.34;
      v.speed = 0;
      v.stuckTimer = 0;
      v.tripLabel = `🚨 交通事故现场（${cause}）`;
    }

    this.accidents.push(acc);
    this._accidentCooldown = 240;
    chosenTile.congestion = Math.max(chosenTile.congestion || 0, 0.85);
    this.sim.latestChirp = {
      user: '@交警支队播报',
      text: `🚨 (${acc.x},${acc.z}) ${acc.roadName}发生【${acc.cause}】！道路局部缓行，已呼叫附近警察总局派交警巡逻车赶赴现场处理。`,
      mood: 'warn'
    };

    this.tryDispatchPoliceCar();
    return acc;
  }

  // Dispatch Traffic Police to actively direct & clear a severe real-world traffic jam (instead of poof-deleting cars!)
  triggerTrafficJamIntervention(tx, tz, options = {}) {
    if (!inBounds(tx, tz) || this.accidents.length >= 3) return null;
    const t = this.sim.getTile(tx, tz);
    if (!t || !(t.roadGround >= 1 && t.roadGround <= 3) || t.dam || t.ramp) return null;
    if (this.accidents.some((a) => Math.hypot(a.x - tx, a.z - tz) < 5.5)) return null;

    const deg = this.roadDegree[idx(tx, tz)] || 0;
    const roadName = deg >= 4
      ? '四向十字路口'
      : (deg === 3 ? '三向交叉路口' : (t.roadGround >= 2 ? '四车道主干道' : '城市街道'));
    const wCenter = tileToWorld(tx, tz);
    const totalTime = Number(options.duration || 5.0);
    const acc = {
      id: this._nextAccidentId++,
      type: 'jam',
      x: tx,
      z: tz,
      wx: wCenter.wx,
      wy: this.getRoadNodeY(tx, tz, 0),
      wz: wCenter.wz,
      roadName,
      cause: options.cause || '路口车流严重拥堵打结',
      vehicleIds: [],
      state: 'awaiting_police',
      policeVehicleId: null,
      policeStationTile: null,
      totalTime,
      remainingTime: totalTime,
      selfClearTimer: Number(options.selfClearTime || 12.0),
      elapsed: 0
    };

    this.accidents.push(acc);
    this._jamCooldown = 95;
    t.congestion = Math.max(t.congestion || 0, 0.90);
    this.sim.latestChirp = {
      user: '@交警支队播报',
      text: `🚦 (${acc.x},${acc.z}) ${acc.roadName}车辆拥堵滞留！已派附近警察总局【🚓 交警巡逻车】火速前往现场指挥疏导！`,
      mood: 'warn'
    };
    this.tryDispatchPoliceCar();
    return acc;
  }

  tryDispatchPoliceCar() {
    if (this.accidents.length === 0) return;

    for (let aIdx = 0; aIdx < this.accidents.length; aIdx++) {
      const acc = this.accidents[aIdx];
      if (acc.state !== 'awaiting_police') continue;

      let bestPath = null;
      let bestStation = null;
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        const b = t.building;
        if (b && (b.type === 'police_station' || b.type === 'police') && !b.abandoned && !b.underConstruction && t.powered) {
          const srcAcc = this.sim.findRoadAccess(t.x, t.z);
          if (!srcAcc) continue;
          let p = null;
          if (srcAcc.rx === acc.x && srcAcc.rz === acc.z) {
            p = [
              { x: acc.x, z: acc.z, layer: 0, onRamp: false },
              { x: acc.x, z: acc.z, layer: 0, onRamp: false }
            ];
          } else {
            p = this.findRoadPath(srcAcc.rx, srcAcc.rz, acc.x, acc.z, false, 0, false);
          }
          if (p && p.length >= 2 && (!bestPath || p.length < bestPath.length)) {
            bestPath = p;
            bestStation = t;
          }
        }
      }
      if (!bestPath || !bestStation) continue;

      const fromName = this.getEndpointName({
        bx: bestStation.x,
        bz: bestStation.z,
        building: bestStation.building
      });
      const w0 = tileToWorld(bestPath[0].x, bestPath[0].z);
      const pv = {
        kind: 'police',
        policeTargetAccidentId: acc.id,
        policeOnSceneId: null,
        policeReturning: false,
        id: this._nextVehId++,
        variantIdx: 0,
        tripType: 'service',
        tripLabel: acc.type === 'jam' ? '🚓 交警赶赴疏导拥堵路口' : '🚓 交警紧急出警处理事故',
        fromName,
        toName: `${acc.type === 'jam' ? '拥堵路口' : '事故现场'} (${acc.x}, ${acc.z})`,
        originTile: { x: bestStation.x, z: bestStation.z },
        destTile: { x: acc.x, z: acc.z },
        color: [0.95, 0.97, 1.0],
        length: 0.34,
        width: 0.15,
        height: 0.145,
        path: bestPath,
        seg: 0,
        t: 0,
        speed: 2.4,
        maxSpeed: 2.85,
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
      this.syncVehicleTransform(pv, 0);
      this.vehicles.push(pv);
      acc.state = 'police_en_route';
      acc.policeVehicleId = pv.id;
      acc.policeStationTile = { x: bestStation.x, z: bestStation.z };
      this.refreshActiveModalCounts();
    }
  }

  updateAccidents(effDt) {
    if (this.accidents.length === 0) return;

    for (let i = this.accidents.length - 1; i >= 0; i--) {
      const acc = this.accidents[i];
      acc.elapsed += effDt;

      const t = this.sim.getTile(acc.x, acc.z);
      if (!t || !(t.roadGround >= 1 && t.roadGround <= 3) || t.dam) {
        this._clearAccidentEntities(acc, false);
        this.accidents.splice(i, 1);
        continue;
      }
      t.congestion = Math.max(t.congestion || 0, 0.80);

      let pv = acc.policeVehicleId
        ? this.vehicles.find((v) => v.id === acc.policeVehicleId)
        : null;

      if (acc.state === 'police_en_route') {
        if (!pv) {
          acc.state = 'awaiting_police';
          acc.policeVehicleId = null;
        } else {
          const distToScene = Math.hypot(pv.wx - acc.wx, pv.wz - acc.wz);
          const arrived = distToScene <= (acc.type === 'jam' ? 1.45 : 0.95) || pv.policeOnSceneId === acc.id || pv.seg >= pv.path.length - 1;
          if (arrived) {
            pv.policeOnSceneId = acc.id;
            pv.speed = 0;
            pv.stuckTimer = 0;
            pv.tripLabel = acc.type === 'jam' ? '🚓 交警现场指挥绿波疏导' : '🚓 交警正在现场勘查清障';
            acc.state = 'clearing';
            for (const v of this.vehicles) {
              if (v.accidentId === acc.id) {
                v.tripLabel = '🚨 交警现场定责清障中';
              }
            }
            this.sim.latestChirp = {
              user: '@交警支队播报',
              text: acc.type === 'jam'
                ? `🚓 交警巡逻车已抵达 (${acc.x},${acc.z}) 拥堵路口启动人工绿波指挥，正在疏导积压车流（预计 ${Math.ceil(acc.remainingTime)} 秒）！`
                : `🚓 交警巡逻车已抵达 (${acc.x},${acc.z}) 事故现场并布设警示锥桶，预计 ${Math.ceil(acc.remainingTime)} 秒后清障恢复通行！`,
              mood: 'info'
            };
          }
        }
      } else if (acc.state === 'clearing') {
        if (!pv) {
          acc.state = 'awaiting_police';
          acc.policeVehicleId = null;
        } else {
          pv.speed = 0;
          pv.stuckTimer = 0;
          // Active Traffic-Police Green-Wave Jam Direction: visibly wave queued cars through the jammed intersection!
          if (acc.type === 'jam') {
            for (let vi = 0; vi < this.vehicles.length; vi++) {
              const qv = this.vehicles[vi];
              if (!qv || qv.accidentId || qv.policeOnSceneId || qv.inTunnel || qv.maxSpeed <= 0.1) continue;
              if (Math.hypot(qv.wx - acc.wx, qv.wz - acc.wz) <= 2.65) {
                qv._jamClearTimer = Math.max(qv._jamClearTimer || 0, 2.6);
                qv.stuckTimer = 0;
              }
            }
          }
          acc.remainingTime = Math.max(0, acc.remainingTime - effDt);
          if (acc.remainingTime <= 0) {
            this._clearAccidentEntities(acc, true);
            this.totalAccidentsCleared++;
            this.accidents.splice(i, 1);
            this.sim.latestChirp = {
              user: '@交警支队播报',
              text: acc.type === 'jam'
                ? `✅ (${acc.x},${acc.z}) ${acc.roadName}经交警现场指挥疏导，车流已恢复顺畅通行！`
                : `✅ (${acc.x},${acc.z}) ${acc.roadName}交通事故已勘查清障完毕，道路恢复畅通！`,
              mood: 'good'
            };
            continue;
          }
        }
      } else {
        // Awaiting police (if city has no powered/reachable police station, drivers slowly self-clear)
        acc.selfClearTimer = Math.max(0, acc.selfClearTimer - effDt);
        if (acc.selfClearTimer <= 0) {
          if (acc.type === 'jam') {
            for (let vi = 0; vi < this.vehicles.length; vi++) {
              const qv = this.vehicles[vi];
              if (!qv || qv.accidentId || qv.policeOnSceneId || qv.inTunnel || qv.maxSpeed <= 0.1) continue;
              if (Math.hypot(qv.wx - acc.wx, qv.wz - acc.wz) <= 2.65) {
                qv._jamClearTimer = Math.max(qv._jamClearTimer || 0, 3.2);
                qv.stuckTimer = 0;
              }
            }
          }
          this._clearAccidentEntities(acc, false);
          this.totalAccidentsCleared++;
          this.accidents.splice(i, 1);
          this.sim.latestChirp = {
            user: '@市民路况播报',
            text: acc.type === 'jam'
              ? `🚧 (${acc.x},${acc.z}) 拥堵路口车流缓慢自行疏通（建造【🚓 警察总局】可派交警第一时间绿波疏导！）`
              : `🚧 (${acc.x},${acc.z}) 事故双方自行协商撤离，道路缓慢恢复（建造【🚓 警察总局】可派交警 3 倍速专业处置！）`,
            mood: 'info'
          };
          continue;
        }
      }
    }
  }

  _hasSpawnClearance(wx, wz, layer = 0, minDist = 0.68) {
    const minSq = minDist * minDist;
    for (let i = 0; i < this.vehicles.length; i++) {
      const o = this.vehicles[i];
      if (!o || o.inTunnel) continue;
      const oCur = o.path && o.path[o.seg];
      if (oCur && (oCur.layer || 0) !== layer) continue;
      const dx = o.wx - wx;
      const dz = o.wz - wz;
      if (dx * dx + dz * dz < minSq) return false;
    }
    return true;
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

    // 0. Priority Custom Colored Bus Route Fleet Spawner (falls back to ad-hoc bus stops if no lines configured!)
    const activeBusLines = Array.isArray(this.sim.busLines)
      ? this.sim.busLines.filter((l) => l && l.active !== false && Array.isArray(l.stops) && l.stops.length >= 2)
      : [];
    if (activeBusLines.length > 0) {
      for (let li = 0; li < activeBusLines.length; li++) {
        const line = activeBusLines[li];
        const lineCount = this.vehicles.reduce((acc, v) => acc + (v.kind === 'bus' && v.busLineId === line.id ? 1 : 0), 0);
        const targetForLine = Math.max(1, Math.min(6, line.busCount || 2));
        if (lineCount >= targetForLine) continue;

        const startIdx = lineCount % line.stops.length;
        const nextIdx = (startIdx + 1) % line.stops.length;
        const stopA = line.stops[startIdx];
        const stopB = line.stops[nextIdx];
        const busPath = this.findRoadPath(stopA.x, stopA.z, stopB.x, stopB.z, false, 0, false);
        if (busPath && busPath.length >= 2) {
          const w0 = tileToWorld(busPath[0].x, busPath[0].z);
          if (!this._hasSpawnClearance(w0.wx, w0.wz, busPath[0].layer || 0, 0.72)) continue;
          const maxSpeed = 1.72;
          const bv = {
            id: this._nextVehId++,
            variantIdx: 0,
            kind: 'bus',
            busLineId: line.id,
            busLineColor: line.colorHex || '#0ea5e9',
            busStopIdx: nextIdx,
            busDwell: 0,
            tripType: 'transit',
            tripLabel: `🚌 ${line.name}`,
            fromName: `${line.name} · 第${startIdx + 1}站`,
            toName: `${line.name} · 第${nextIdx + 1}站`,
            originTile: { x: stopA.x, z: stopA.z },
            destTile: { x: stopB.x, z: stopB.z },
            color: [0.10, 0.72, 0.88],
            length: 0.50,
            width: 0.168,
            height: 0.185,
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
    } else if (this.busStops.length >= 2) {
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
              id: this._nextVehId++,
              variantIdx: 0,
              kind: 'bus',
              tripType: 'transit',
              tripLabel: '🚌 城市新能源公交专线',
              fromName: stopA.portalName,
              toName: stopB.portalName,
              originTile: { x: stopA.bx, z: stopA.bz },
              destTile: { x: stopB.bx, z: stopB.bz },
              color: [0.10, 0.72, 0.88],
              length: 0.50,
              width: 0.168,
              height: 0.185,
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
    let length = 0.31, width = 0.15, height = 0.12, maxSpeed = 1.85 + Math.random() * 0.45;
    if (kind === 'taxi') { color = [0.98, 0.78, 0.12]; length = 0.31; width = 0.15; maxSpeed = 2.15; }
    else if (kind === 'truck') { color = [0.90, 0.46, 0.16]; length = 0.44; width = 0.165; height = 0.19; maxSpeed = 1.55; }
    else if (kind === 'garbagetruck') { color = [0.22, 0.74, 0.38]; length = 0.44; width = 0.185; height = 0.21; maxSpeed = 1.50; }
    else if (kind === 'bus') { color = [0.18, 0.58, 0.92]; length = 0.50; width = 0.168; height = 0.185; maxSpeed = 1.65; }

    const w0 = tileToWorld(path[0].x, path[0].z);
    if (!this._hasSpawnClearance(w0.wx, w0.wz, path[0].layer || 0, 0.68)) return;
    const v = {
      id: this._nextVehId++,
      variantIdx: (Math.random() * 12) | 0,
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

  _sampleTrainPosOnPath(path, dist) {
    if (!path || path.length < 2) return null;
    const maxD = path.length - 1;
    const d = Math.max(0, Math.min(maxD - 1e-4, dist));
    const seg = Math.floor(d);
    const f = d - seg;
    const p0 = path[seg];
    const p1 = path[Math.min(maxD, seg + 1)];
    const w0 = tileToWorld(p0.x, p0.z);
    const w1 = tileToWorld(p1.x, p1.z);
    const dx = w1.wx - w0.wx;
    const dz = w1.wz - w0.wz;
    const len = Math.hypot(dx, dz) || 1;
    return {
      wx: w0.wx + dx * f,
      wz: w0.wz + dz * f,
      dirX: dx / len,
      dirZ: dz / len
    };
  }

  _hasTrainSpawnClearance(isMetro, tx, tz, minTiles = 4.2) {
    const w = tileToWorld(tx, tz);
    const minSq = minTiles * minTiles;
    for (let i = 0; i < this.trains.length; i++) {
      const tr = this.trains[i];
      if (Boolean(tr.isMetro) !== Boolean(isMetro)) continue;
      const spacing = isMetro ? 0.56 : 0.72;
      for (const offset of [0, (tr.cars - 1) * spacing * 0.5, (tr.cars - 1) * spacing]) {
        const pt = this._sampleTrainPosOnPath(tr.path, tr.dist - offset);
        if (!pt) continue;
        const dx = pt.wx - w.wx;
        const dz = pt.wz - w.wz;
        if (dx * dx + dz * dz < minSq) return false;
      }
    }
    return true;
  }

  _getTrainStations(isMetro) {
    const out = [];
    if (!isMetro && this.sim.getTile(8, GRID_SIZE - 1)?.rail > 0) {
      out.push({ x: 8, z: GRID_SIZE - 1, isPortal: true });
    }
    const wantType = isMetro ? 'metro_station' : 'hsr_station';
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.building?.type === wantType && t.powered && !t.building.abandoned && !t.building.underConstruction) {
        out.push({ x: t.x, z: t.z, isPortal: false });
      }
    }
    return out;
  }

  trySpawnTrains() {
    const activeHSR = this.trains.filter((tr) => !tr.isMetro).length;
    const activeMetro = this.trains.filter((tr) => tr.isMetro).length;

    // 1. High-Speed Bullet Train (Fuxing 5-car articulated consist, strict spawn headway!)
    if (activeHSR < 3) {
      const hsrNodes = this._getTrainStations(false);
      if (hsrNodes.length >= 2) {
        let bestPair = null;
        for (let attempt = 0; attempt < 6; attempt++) {
          const a = hsrNodes[(Math.random() * hsrNodes.length) | 0];
          const b = hsrNodes[(Math.random() * hsrNodes.length) | 0];
          if (a.x === b.x && a.z === b.z) continue;
          if (!this._hasTrainSpawnClearance(false, a.x, a.z, 5.2)) continue;
          const path = this.findTrackPath(a.x, a.z, b.x, b.z, false);
          if (path && path.length >= 6) {
            bestPair = { a, b, path };
            break;
          }
        }
        if (bestPair) {
          const { a, b, path } = bestPair;
          const startDist = a.isPortal ? 0 : Math.min(path.length - 1.5, 4 * 0.72 + 0.15);
          const head = this._sampleTrainPosOnPath(path, startDist);
          this.trains.push({
            id: this._nextTrainId++,
            isMetro: false,
            cars: 5,
            carSpacing: 0.72,
            path,
            dist: startDist,
            speed: a.isPortal ? 3.5 : 0,
            maxSpeed: 3.5,
            dwell: a.isPortal ? 0 : 0.9,
            atTerminus: false,
            exitingPortal: false,
            destIsPortal: Boolean(b.isPortal),
            prevOrigin: { x: a.x, z: a.z },
            wx: head ? head.wx : 0,
            wz: head ? head.wz : 0,
            dirX: head ? head.dirX : 0,
            dirZ: head ? head.dirZ : 1
          });
        }
      }
    }

    // 2. Underground Metro Train (4-car consist, continuous loop/turnaround, ZERO sudden vanishing!)
    if (activeMetro < 3) {
      const mStations = this._getTrainStations(true);
      if (mStations.length >= 2) {
        let bestPlan = null;
        for (let attempt = 0; attempt < 8; attempt++) {
          const a = mStations[(Math.random() * mStations.length) | 0];
          const b = mStations[(Math.random() * mStations.length) | 0];
          if (a.x === b.x && a.z === b.z) continue;
          if (!this._hasTrainSpawnClearance(true, a.x, a.z, 4.8)) continue;
          const path = this.findTrackPath(a.x, a.z, b.x, b.z, true);
          if (path && path.length >= 5) {
            if (!bestPlan || path.length > bestPlan.path.length) {
              bestPlan = { a, b, path };
            }
          }
        }
        if (bestPlan) {
          const { a, b, path } = bestPlan;
          const startDist = Math.min(path.length - 1.4, 3 * 0.56 + 0.14);
          const head = this._sampleTrainPosOnPath(path, startDist);
          this.trains.push({
            id: this._nextTrainId++,
            isMetro: true,
            cars: 4,
            carSpacing: 0.56,
            path,
            dist: startDist,
            speed: 0,
            maxSpeed: 2.35,
            dwell: 0.85,
            atTerminus: false,
            exitingPortal: false,
            destIsPortal: false,
            prevOrigin: { x: a.x, z: a.z },
            wx: head ? head.wx : 0,
            wz: head ? head.wz : 0,
            dirX: head ? head.dirX : 0,
            dirZ: head ? head.dirZ : 1
          });
        }
      }
    }
  }

  // Realistic 4-Phase Urban Traffic Signal Controller (Vehicle Green -> Yellow -> All-Red Clearance + Pedestrian WALK/FLASHING Clearance!)
  getSignalState(x, z) {
    if (!inBounds(x, z)) {
      return { active: false, nsVeh: 'green', ewVeh: 'green', nsPed: 'walk', ewPed: 'walk', phaseLabel: '无信号灯', activeRem: 0, cycle: 16 };
    }
    const ti = idx(x, z);
    const tile = this.sim.getTile(x, z);
    if (this.roadDegree[ti] < 3 || (tile && tile.junctionMode && tile.junctionMode !== 'signal')) {
      return { active: false, nsVeh: 'green', ewVeh: 'green', nsPed: 'walk', ewPed: 'walk', phaseLabel: '无信号灯', activeRem: 0, cycle: 16 };
    }
    const preset = (tile && tile.signalPreset) || 'balanced';
    const nsGreen = preset === 'ns_heavy' ? 9.2 : (preset === 'ew_heavy' ? 6.0 : 6.6);
    const ewGreen = preset === 'ew_heavy' ? 9.2 : (preset === 'ns_heavy' ? 6.0 : 6.6);
    const yellow = 0.8;
    const allRed = 0.6;
    const pedClearBuf = 2.6; // Guaranteed 2.6s flashing clearance BEFORE vehicle green ends (+1.4s yellow/all-red = 4.0s before cross traffic!)
    const nsEnd = nsGreen;
    const nsYelEnd = nsEnd + yellow;
    const nsClearEnd = nsYelEnd + allRed;
    const ewEnd = nsClearEnd + ewGreen;
    const ewYelEnd = ewEnd + yellow;
    const cycle = ewYelEnd + allRed;

    const raw = this.signalClock + (x + z) * 0.65;
    const phase = ((raw % cycle) + cycle) % cycle;

    if (phase < nsEnd) {
      const pedWalkEnd = Math.max(1.2, nsEnd - pedClearBuf);
      const nsPed = phase < pedWalkEnd ? 'walk' : 'flashing';
      return {
        active: true, preset, cycle, phase,
        nsVeh: 'green', ewVeh: 'red',
        nsPed, ewPed: 'dont_walk',
        phaseLabel: nsPed === 'walk' ? '🟢 南北绿灯（人车同行）' : '🟢 南北绿灯（行人清场）',
        activeRem: nsEnd - phase,
        pedRem: Math.max(0, pedWalkEnd - phase)
      };
    }
    if (phase < nsYelEnd) {
      return {
        active: true, preset, cycle, phase,
        nsVeh: 'yellow', ewVeh: 'red',
        nsPed: 'dont_walk', ewPed: 'dont_walk',
        phaseLabel: '🟡 南北黄灯清场',
        activeRem: nsYelEnd - phase,
        pedRem: 0
      };
    }
    if (phase < nsClearEnd) {
      return {
        active: true, preset, cycle, phase,
        nsVeh: 'red', ewVeh: 'red',
        nsPed: 'dont_walk', ewPed: 'dont_walk',
        phaseLabel: '🔴 全红安全清空',
        activeRem: nsClearEnd - phase,
        pedRem: 0
      };
    }
    if (phase < ewEnd) {
      const pedWalkEnd = nsClearEnd + Math.max(1.2, ewGreen - pedClearBuf);
      const ewPed = phase < pedWalkEnd ? 'walk' : 'flashing';
      return {
        active: true, preset, cycle, phase,
        nsVeh: 'red', ewVeh: 'green',
        nsPed: 'dont_walk', ewPed,
        phaseLabel: ewPed === 'walk' ? '🟢 东西绿灯（人车同行）' : '🟢 东西绿灯（行人清场）',
        activeRem: ewEnd - phase,
        pedRem: Math.max(0, pedWalkEnd - phase)
      };
    }
    if (phase < ewYelEnd) {
      return {
        active: true, preset, cycle, phase,
        nsVeh: 'red', ewVeh: 'yellow',
        nsPed: 'dont_walk', ewPed: 'dont_walk',
        phaseLabel: '🟡 东西黄灯清场',
        activeRem: ewYelEnd - phase,
        pedRem: 0
      };
    }
    return {
      active: true, preset, cycle, phase,
      nsVeh: 'red', ewVeh: 'red',
      nsPed: 'dont_walk', ewPed: 'dont_walk',
      phaseLabel: '🔴 全红安全清空',
      activeRem: cycle - phase,
      pedRem: 0
    };
  }

  isSignalRed(x, z, moveVertical) {
    const st = this.getSignalState(x, z);
    if (!st.active) return false;
    return (moveVertical ? st.nsVeh : st.ewVeh) !== 'green';
  }

  _hasPedestrianCrossingTile(tx, tz) {
    for (let i = 0; i < this.pedestrians.length; i++) {
      const p = this.pedestrians[i];
      if (!p || p.fadeState === 'exiting') continue;
      if ((p.nx === tx && p.nz === tz && p.t > 0.54) || (p.tx === tx && p.tz === tz && p.t < 0.46)) {
        return true;
      }
    }
    return false;
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
    const jTile = this.sim.getTile(nx, nz);
    if (jTile && jTile.yieldAxis === 'ns') return moveVertical;
    if (jTile && jTile.yieldAxis === 'ew') return !moveVertical;
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
    const altOff = altSlot === 1 ? 0.295 : 0.105;
    const shiftLat = altOff - (v.curLaneOff !== undefined ? v.curLaneOff : (v.laneSlot === 1 ? 0.295 : 0.105));

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
      if (rvx * rvx + rvz * rvz > 0.85) continue;

      const sameDir = v.dirX * o.dirX + v.dirZ * o.dirZ;
      if (sameDir < 0.45) continue;

      const fwdDist = rvx * v.dirX + rvz * v.dirZ;
      const latDistToAlt = Math.abs((-rvx * v.dirZ + rvz * v.dirX) - shiftLat);
      const minLatClr = ((v.width || 0.15) + (o.width || 0.15)) * 0.56;
      const minBackClr = ((v.length || 0.31) + (o.length || 0.31)) * 0.55 + 0.10;
      if (latDistToAlt < minLatClr && fwdDist > -minBackClr && fwdDist < safeGap + 0.16) {
        return false;
      }
    }
    return true;
  }

  // Exact 2D Oriented Bounding Box separating-axis overlap test (prevents physical car-vs-car penetration!)
  _vehiclesOverlapOBB(ax, az, aDirX, aDirZ, aLen, aWid, bx, bz, bDirX, bDirZ, bLen, bWid, margin = 0.025) {
    const dx = bx - ax;
    const dz = bz - az;
    const ahL = aLen * 0.5 + margin;
    const ahW = aWid * 0.5 + margin;
    const bhL = bLen * 0.5 + margin;
    const bhW = bWid * 0.5 + margin;

    const aRx = -aDirZ, aRz = aDirX;
    const bRx = -bDirZ, bRz = bDirX;

    // Test 4 SAT axes: aFwd, aRight, bFwd, bRight
    const cFF = Math.abs(aDirX * bDirX + aDirZ * bDirZ);
    const cFR = Math.abs(aDirX * bRx + aDirZ * bRz);
    const cRF = Math.abs(aRx * bDirX + aRz * bDirZ);
    const cRR = Math.abs(aRx * bRx + aRz * bRz);

    if (Math.abs(dx * aDirX + dz * aDirZ) > ahL + bhL * cFF + bhW * cFR) return false;
    if (Math.abs(dx * aRx + dz * aRz) > ahW + bhL * cRF + bhW * cRR) return false;
    if (Math.abs(dx * bDirX + dz * bDirZ) > bhL + ahL * cFF + ahW * cRF) return false;
    if (Math.abs(dx * bRx + dz * bRz) > bhW + ahL * cFR + ahW * cRR) return false;
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
    if (this.sim.meshDirty || sig !== this.lastRoadSignature || sig !== this.lastGraphSignature) {
      this.refreshRoadGraph(sig);
    }
    this._inUpdateTick = true;
    try {
      this._updateBody(dt);
    } finally {
      this._inUpdateTick = false;
    }
  }

  _updateBody(dt) {
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

    this.policeTimer += effDt;
    if (this.policeTimer >= 0.9) {
      this.policeTimer = 0;
      this.tryDispatchPoliceCar();
    }

    // Rare realistic spontaneous traffic accidents on busy/wet intersections (strictly gated, ~1 every 4-6 min, cap 1!)
    this._accidentCooldown = Math.max(0, (this._accidentCooldown || 0) - effDt);
    this._jamCooldown = Math.max(0, (this._jamCooldown || 0) - effDt);
    const activeCrashCount = this.accidents.reduce((acc, a) => acc + (a.type !== 'jam' ? 1 : 0), 0);
    if (
      this._accidentCooldown <= 0 &&
      activeCrashCount < 1 &&
      (this.sim.population || 0) >= 450 &&
      this.vehicles.length >= 16
    ) {
      const wInfo = typeof this.sim.getWeatherInfo === 'function' ? this.sim.getWeatherInfo() : { id: 'sunny' };
      const weatherRisk = wInfo.id === 'storm' || wInfo.id === 'blizzard'
        ? 2.2
        : (wInfo.id === 'rain' || wInfo.id === 'snow' ? 1.5 : 1.0);
      if (Math.random() < 0.00045 * weatherRisk * effDt) {
        this.triggerTrafficAccident();
      }
    }
    this.updateAccidents(effDt);

    this.trainTimer += effDt;
    if (this.trainTimer >= 1.8) {
      this.trainTimer = 0;
      this.trySpawnTrains();
    }

    // Snapshot ground tile occupancy so junction yield/roundabout/right-on-red see exact live density
    this.rebuildTileOccupancy();
    let gridlockTiles = null;
    const weatherRoadMult = (typeof this.sim.getWeatherInfo === 'function' ? this.sim.getWeatherInfo().roadMult : 1.0) || 1.0;

    // Update road vehicles with per-frame road validation, junction modes, 2-lane parallel flow & 12s anti-gridlock
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      let cur = v.path && v.path[v.seg];
      if (!cur || !this.isValidRoadStep(cur, null)) {
        this.vehicles.splice(i, 1);
        continue;
      }

      // Custom Bus Route stop boarding dwell (never triggers gridlock timeout!)
      if (v.busDwell > 0) {
        v.busDwell = Math.max(0, v.busDwell - effDt);
        v.speed = 0;
        v.stuckTimer = 0;
        this.syncVehicleTransform(v, effDt);
        continue;
      }

      // Active Traffic Accident vehicles & On-Scene Traffic Police patrol cars stay parked safely during clearance countdown
      if (v.accidentId || v.policeOnSceneId) {
        v.speed = 0;
        v.stuckTimer = 0;
        this.syncVehicleTransform(v, effDt);
        continue;
      }

      let nxt = v.path[v.seg + 1];
      if (!nxt) {
        if (v.kind === 'firetruck' && v.fireTargetIdx !== undefined) {
          const bt = this.sim.grid[v.fireTargetIdx];
          if (bt && bt.building) bt.building.fire = 0;
        }
        if (v.kind === 'police' && v.policeTargetAccidentId && this.accidents.some((a) => a.id === v.policeTargetAccidentId)) {
          v.policeOnSceneId = v.policeTargetAccidentId;
          v.speed = 0;
          v.stuckTimer = 0;
          continue;
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
      let targetSpeed = v.maxSpeed * roadBoost * weatherRoadMult;
      let blockedBySignal = false;
      let blockedByVehicle = false;
      let hardStop = false;

      if (v._jamClearTimer > 0) {
        v._jamClearTimer = Math.max(0, v._jamClearTimer - effDt);
      }
      const inJamGreenWave = (v._jamClearTimer || 0) > 0;

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

        if (v.kind !== 'firetruck' && v.kind !== 'police' && !inJamGreenWave && nxtDeg >= 3) {
          const jMode = nxtTile.junctionMode || 'signal';
          const moveVertical = Math.abs(nxt.z - cur.z) > 0;

          if (jMode === 'roundabout') {
            // ZERO red-light stop! Enter roundabout whenever hub occupancy < 4 (brake from t=0.04 so cars halt cleanly behind crosswalk!)
            if (v.t > 0.04 && v.t < 0.44 && !inRoundaboutHub && this.tileOccupancy[nxtIdx] >= 4) {
              targetSpeed = 0;
              blockedBySignal = true;
            }
          } else if (jMode === 'yield') {
            // Major road has ZERO signal stop; minor road yields behind crosswalk (brake from t=0.04) if intersection occupancy >= 2
            const isMajor = this.isMajorYieldApproach(curTile, nxt.x, nxt.z, moveVertical);
            if (!isMajor && v.t > 0.04 && v.t < 0.44 && this.tileOccupancy[nxtIdx] >= 2) {
              targetSpeed = 0;
              blockedBySignal = true;
            }
          } else {
            // 'signal' mode: brake from t=0.04 (halt by ~0.18..0.22) so bus bumpers leave clean clearance for zebra crosswalk pedestrians; Right-Turn-On-Red yields to pedestrians!
            if (v.t > 0.04 && v.t < 0.44 && this.isSignalRed(nxt.x, nxt.z, moveVertical)) {
              if (this.isTurningRightAtNext(v) && this.tileOccupancy[nxtIdx] < 2 && !this._hasPedestrianCrossingTile(nxt.x, nxt.z)) {
                targetSpeed = Math.min(targetSpeed, v.maxSpeed * 0.78);
              } else {
                targetSpeed = 0;
                blockedBySignal = true;
              }
            }
          }
          if (blockedBySignal && v.t > 0.18) hardStop = true;
        }
      }

      // Full 360° 3D Bumper-to-Bumper, Strict Total-Order Intersection Cross-Traffic, Opposing-Turn & 4-Lane Overtaking Avoidance!
      // On 4-lane avenues, parallel lane centers sit 0.190m apart (0.105 vs 0.295), so 0.145m gives wide trucks a clean physical air gap!
      const latLimit = isMultiLane ? 0.145 : 0.185;
      let queuedBehindRed = false;
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
        if (distSq > 1.25) continue; // > 1.12 units away

        const sameDir = v.dirX * o.dirX + v.dirZ * o.dirZ;
        const fwdDist = rvx * v.dirX + rvz * v.dirZ;
        const latDist = Math.abs(-rvx * v.dirZ + rvz * v.dirX);
        const safeGap = (v.length + o.length) * 0.56 + 0.14;
        const oIsStoppedHazard = Boolean(o.accidentId || o.policeOnSceneId);

        if (sameDir >= 0.45) {
          // 1. Same-lane car-following & smooth speed matching + 4-lane parallel overtake (also routes around parked accidents)
          const minBodyLat = ((v.width || 0.15) + (o.width || 0.15)) * 0.52;
          const effLat = oIsStoppedHazard ? Math.max(latLimit, minBodyLat + 0.04) : Math.max(latLimit, minBodyLat * 0.92);
          if (fwdDist > 0.01 && fwdDist < safeGap * 1.50 && latDist < effLat) {
            if (fwdDist < safeGap) {
              if (allowOvertake && targetSpeed > 0 && o.speed < v.maxSpeed * 0.85 && !(v.laneChangeCooldown > 0)) {
                const altSlot = v.laneSlot === 1 ? 0 : 1;
                if (this.canSwitchParallelLane(v, i, altSlot, safeGap)) {
                  v.laneSlot = altSlot;
                  v.laneChangeCooldown = 1.2;
                  continue;
                }
              }
              targetSpeed = 0;
              blockedByVehicle = true;
              if (o._waitingAtRed) queuedBehindRed = true;
              if (fwdDist < safeGap * 0.80) hardStop = true;
              break;
            } else {
              // Gentle proportional follow deceleration before hard stop
              targetSpeed = Math.min(targetSpeed, Math.max(0.10, o.speed * 0.90));
            }
          }
        } else if (sameDir > -0.75) {
          // 2. Strict Total-Order Predictive Cross-Traffic Guard (ZERO ghost-clipping even in green-wave, ZERO mutual deadlocks!)
          const crossFwd = (v.length * 0.5 + o.width * 0.5) + 0.30 + Math.min(0.28, (v.speed || 0) * 0.16);
          const crossLat = (o.length * 0.5 + v.width * 0.5) + 0.15;
          const oLead = Math.min(0.48, (o.speed || 0) * 0.36);
          const fRvx = rvx + o.dirX * oLead;
          const fRvz = rvz + o.dirZ * oLead;
          const futFwd = fRvx * v.dirX + fRvz * v.dirZ;
          const futLat = Math.abs(-fRvx * v.dirZ + fRvz * v.dirX);
          const directHit = fwdDist > 0.01 && fwdDist < crossFwd && latDist < crossLat;
          const predHit = futFwd > 0.01 && futFwd < crossFwd && futLat < crossLat * 1.05;
          if (directHit || predHit) {
            const oFwdToV = (-rvx) * o.dirX + (-rvz) * o.dirZ;
            // Strict antisymmetric total order: ONLY treat o as physically blocking if o is already past our line (oFwdToV < 0.02 -> o cannot yield to us!)
            const oAlreadyPastLine = directHit && oFwdToV < 0.02 && fwdDist < (v.length * 0.5 + o.width * 0.5 + 0.14);
            const oStrictlyCloser = oFwdToV + 0.08 < fwdDist;
            const tieBreak = Math.abs(oFwdToV - fwdDist) <= 0.08 && ((v.id || i) > (o.id || j));
            const yieldToCross = oIsStoppedHazard || oAlreadyPastLine || oStrictlyCloser || tieBreak;
            if (yieldToCross) {
              targetSpeed = 0;
              blockedByVehicle = true;
              if ((directHit && fwdDist < crossFwd * 0.85) || (predHit && futFwd < crossFwd * 0.72)) hardStop = true;
              break;
            }
          }
        } else {
          // 3. Opposing-direction left-turn / narrow-street overlap guard (strict antisymmetric tie-break prevents head-on deadlock!)
          const oppFwd = (v.length + o.length) * 0.56 + 0.16;
          const oppLat = (v.width + o.width) * 0.65;
          if (fwdDist > 0.01 && fwdDist < oppFwd && latDist < oppLat) {
            const yieldOpp = oIsStoppedHazard || (o.maxSpeed <= 0.1) || ((v.id || i) > (o.id || j));
            if (yieldOpp) {
              targetSpeed = 0;
              blockedByVehicle = true;
              if (fwdDist < oppFwd * 0.78) hardStop = true;
              break;
            }
          }
        }
      }

      const accel = targetSpeed < v.speed ? (hardStop ? 26.0 : 11.0) : 3.4;
      v.speed += (targetSpeed - v.speed) * Math.min(1, effDt * accel);
      if (hardStop && targetSpeed === 0) v.speed = Math.min(v.speed, 0.02);
      if (v.speed < 0.01 && targetSpeed === 0) v.speed = 0;

      // Smart Anti-Vanish Jam & Police-Direction Timer:
      //  - Waiting at a red light (or queued behind a red-light platoon!) NEVER falsely panics during a realistic 16-18s signal cycle!
      //  - Severe multi-car jams (v.maxSpeed > 0.1, >=2 cars) summon 🚓 Traffic Police (95s cooldown) instead of poof-vanishing!
      v._waitingAtRed = Boolean((blockedBySignal && !blockedByVehicle) || queuedBehindRed);
      const nearActiveIncident = this.accidents.length > 0 && this.accidents.some(
        (a) => Math.abs(a.x - cur.x) <= 3 && Math.abs(a.z - cur.z) <= 3
      );
      v.stuckTimer = v.stuckTimer || 0;
      if (v.speed < 0.06) {
        if (v.maxSpeed > 0.1 && (nearActiveIncident || (blockedBySignal && !blockedByVehicle))) {
          v.stuckTimer += effDt * 0.06;
        } else if (v.maxSpeed > 0.1 && queuedBehindRed) {
          v.stuckTimer += effDt * 0.08;
        } else {
          v.stuckTimer += effDt;
        }
      } else if (v.speed > 0.15) {
        v._waitingAtRed = false;
        v.stuckTimer = Math.max(0, v.stuckTimer - effDt * 2.8);
      }

      // Proactive reroute at 8.5s when genuinely jammed
      if (v.maxSpeed > 0.1 && v.stuckTimer >= 8.5 && !nearActiveIncident && cur.layer === 0 && !cur.onRamp) {
        if (!v._reroutedOnce && this.tryRerouteVehicle(v)) {
          v._reroutedOnce = true;
          v.stuckTimer = 3.0;
        }
      }

      if (v.stuckTimer >= 12.0) {
        const oldIdx = idx(cur.x, cur.z);
        if (v.maxSpeed <= 0.1) {
          // Immobilized vehicle (e.g. broken down / zero-maxSpeed gridlock fixture): fire economic timeout & clear cleanly
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

        // Healthy live vehicle (v.maxSpeed > 0.1): NEVER poof-delete mid-road!
        const activeJamCount = this.accidents.reduce((acc, a) => acc + (a.type === 'jam' ? 1 : 0), 0);
        const jamTileDense = (this.tileOccupancy[oldIdx] || 0) >= 2;
        if (
          cur.layer === 0 && !cur.onRamp && !nearActiveIncident &&
          jamTileDense && activeJamCount < 1 && this._jamCooldown <= 0 && (this.sim.population || 0) >= 120
        ) {
          this.triggerTrafficJamIntervention(cur.x, cur.z);
        }
        if (!v._jamPenaltyReported) {
          v._jamPenaltyReported = true;
          this.modalSplit.gridlockTimeouts++;
          if (cur.layer === 1) curTile.elevCongestion = 1.0;
          else if (curTile.roadGround > 0) {
            curTile.congestion = 1.0;
            if (!gridlockTiles) gridlockTiles = new Set();
            gridlockTiles.add(oldIdx);
          }
          this.sim.onTripGridlockTimeout?.(v);
        }
        v.stuckTimer = 0;
        v._jamClearTimer = 4.2;
      }

      const prevSeg = v.seg;
      const segWorldLen = Math.hypot(nxt.x - cur.x, nxt.z - cur.z) || 1.0;
      const stepDtT = (v.speed / segWorldLen) * effDt;

      // Hard Physical 2D OBB Non-Penetration Guard: NEVER advance into another vehicle's solid bounding box!
      let obbBlocked = false;
      if (stepDtT > 1e-4 && !v.inTunnel) {
        const w0c = tileToWorld(cur.x, cur.z);
        const w1c = tileToWorld(nxt.x, nxt.z);
        const candWx = v.wx + (w1c.wx - w0c.wx) * stepDtT;
        const candWz = v.wz + (w1c.wz - w0c.wz) * stepDtT;
        for (let j = 0; j < this.vehicles.length; j++) {
          if (i === j) continue;
          const o = this.vehicles[j];
          if (o.inTunnel !== v.inTunnel) continue;
          const oCur = o.path[o.seg];
          if (!oCur) continue;
          if (oCur.layer !== cur.layer && !cur.onRamp && !oCur.onRamp) continue;
          if (Math.abs((v.wy || 0) - (o.wy || 0)) > 0.20) continue;
          const curDistSq = (o.wx - v.wx) * (o.wx - v.wx) + (o.wz - v.wz) * (o.wz - v.wz);
          if (curDistSq > 0.64) continue;
          const candDistSq = (o.wx - candWx) * (o.wx - candWx) + (o.wz - candWz) * (o.wz - candWz);
          // Only block if moving closer into overlap (always allow separating movements so vehicles untangle cleanly!)
          if (candDistSq < curDistSq && this._vehiclesOverlapOBB(
            candWx, candWz, v.dirX, v.dirZ, v.length || 0.31, v.width || 0.15,
            o.wx, o.wz, o.dirX, o.dirZ, o.length || 0.31, o.width || 0.15, 0.015
          )) {
            obbBlocked = true;
            break;
          }
        }
      }
      if (obbBlocked) {
        v.speed = 0;
        blockedByVehicle = true;
      } else {
        v.t += stepDtT;
      }

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
        // Traffic Police patrol car arrived at accident destination -> park safely on scene instead of despawning!
        if (v.kind === 'police' && v.policeTargetAccidentId && this.accidents.some((a) => a.id === v.policeTargetAccidentId)) {
          v.seg = Math.max(0, v.path.length - 2);
          v.t = 0.72;
          v.policeOnSceneId = v.policeTargetAccidentId;
          v.speed = 0;
          v.stuckTimer = 0;
          this.syncVehicleTransform(v, effDt);
          continue;
        }
        if (v.kind === 'garbagetruck' && v.destTile) {
          const dtTile = this.sim.getTile(v.destTile.x, v.destTile.z);
          if (dtTile?.building && typeof dtTile.building.garbage === 'number') {
            dtTile.building.garbage = Math.max(0, dtTile.building.garbage - 0.4);
          }
        }
        // Custom Colored Bus Route continuous stop-to-stop looping!
        if (v.kind === 'bus' && v.busLineId) {
          const line = Array.isArray(this.sim.busLines) ? this.sim.busLines.find((l) => l.id === v.busLineId) : null;
          if (line && line.active !== false && Array.isArray(line.stops) && line.stops.length >= 2) {
            const curStopIdx = ((v.busStopIdx || 0) % line.stops.length + line.stops.length) % line.stops.length;
            const nextStopIdx = (curStopIdx + 1) % line.stops.length;
            const stA = line.stops[curStopIdx];
            const stB = line.stops[nextStopIdx];
            const nextPath = this.findRoadPath(stA.x, stA.z, stB.x, stB.z, false, 0, false);
            if (nextPath && nextPath.length >= 2) {
              line.dailyRiders = (line.dailyRiders || 0) + 12;
              v.path = nextPath;
              v.seg = 0;
              v.t = 0;
              v.busStopIdx = nextStopIdx;
              v.busDwell = 1.45;
              v.stuckTimer = 0;
              v.speed = 0;
              v.busLineColor = line.colorHex || '#0ea5e9';
              v.tripLabel = `🚌 ${line.name}`;
              v.fromName = `${line.name} · 第${curStopIdx + 1}站`;
              v.toName = `${line.name} · 第${nextStopIdx + 1}站`;
              v.originTile = { x: stA.x, z: stA.z };
              v.destTile = { x: stB.x, z: stB.z };
              this.syncVehicleTransform(v, effDt);
              continue;
            }
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

    // Update HSR Bullet Trains & Metro Trains: full coach-span validation, block-signaling headway, smooth station dwell & continuous loop/turnaround (ZERO sudden vanishing!)
    for (let i = 0; i < this.trains.length; i++) {
      const tr = this.trains[i];
      const head = this._sampleTrainPosOnPath(tr.path, tr.dist);
      if (head) {
        tr.wx = head.wx;
        tr.wz = head.wz;
        tr.dirX = head.dirX;
        tr.dirZ = head.dirZ;
      }
    }

    for (let i = this.trains.length - 1; i >= 0; i--) {
      const tr = this.trains[i];
      if (!this.isValidTrainSpan(tr)) {
        this.trains.splice(i, 1);
        continue;
      }

      const spacing = tr.carSpacing || (tr.isMetro ? 0.56 : 0.72);
      const maxSpd = tr.maxSpeed || (tr.isMetro ? 2.35 : 3.5);
      const maxPathDist = tr.path.length - 1;

      if (tr.dwell > 0) {
        tr.dwell = Math.max(0, tr.dwell - effDt);
        tr.speed = 0;
        if (tr.dwell <= 0 && tr.atTerminus) {
          tr.atTerminus = false;
          // Continuously dispatch onto next connected station around loop (or clean cab-swap reverse on shuttle line!)
          const endNode = tr.path[tr.path.length - 1];
          const stations = this._getTrainStations(tr.isMetro);
          const others = stations.filter((s) => !(s.x === endNode.x && s.z === endNode.z));
          // Prefer continuing forward to a station OTHER than prevOrigin so ring/loop metro lines circulate seamlessly!
          const forwardCands = others.filter((s) => !(tr.prevOrigin && s.x === tr.prevOrigin.x && s.z === tr.prevOrigin.z));
          const pool = forwardCands.length > 0 ? forwardCands : others;
          let dispatched = false;
          if (pool.length > 0) {
            const pick = pool[(Math.random() * pool.length) | 0];
            const nextLeg = this.findTrackPath(endNode.x, endNode.z, pick.x, pick.z, tr.isMetro);
            if (nextLeg && nextLeg.length >= 4) {
              // Check if nextLeg continues forward smoothly vs reverses along the exact incoming track
              const prevBeforeEnd = tr.path[tr.path.length - 2];
              const isReverse = prevBeforeEnd && nextLeg[1].x === prevBeforeEnd.x && nextLeg[1].z === prevBeforeEnd.z;
              if (isReverse) {
                // Smooth cab-swap turnaround: exact stationary consist footprint now faces opposite direction!
                tr.path = nextLeg;
                tr.dist = Math.min(nextLeg.length - 1.25, (tr.cars - 1) * spacing);
              } else {
                // Continuous forward continuation (keep trailing tail tiles behind station so ALL 4 cars glide seamlessly through the station!)
                const keepTail = Math.min(tr.path.length - 1, Math.ceil((tr.cars - 1) * spacing) + 2);
                const prefix = tr.path.slice(tr.path.length - 1 - keepTail, tr.path.length - 1);
                tr.path = prefix.concat(nextLeg);
                tr.dist = prefix.length;
              }
              tr.prevOrigin = { x: endNode.x, z: endNode.z };
              tr.destIsPortal = Boolean(pick.isPortal);
              dispatched = true;
            }
          }
          if (!dispatched) {
            // Fallback clean cab-swap reversal along existing intact track (NEVER abruptly vanishes at station!)
            tr.path = tr.path.slice().reverse();
            tr.dist = Math.min(tr.path.length - 1.25, (tr.cars - 1) * spacing);
            tr.prevOrigin = { x: endNode.x, z: endNode.z };
            tr.destIsPortal = false;
          }
          const h2 = this._sampleTrainPosOnPath(tr.path, tr.dist);
          if (h2) { tr.wx = h2.wx; tr.wz = h2.wz; tr.dirX = h2.dirX; tr.dirZ = h2.dirZ; }
        }
        continue;
      }

      // Block-Signaling Anti-Tailgating & Anti-Collision on same layer (isMetro)
      let targetSpeed = maxSpd;
      const remToEnd = maxPathDist - tr.dist;
      if (!tr.destIsPortal && remToEnd < 1.6) {
        targetSpeed = Math.min(targetSpeed, Math.max(0.55, maxSpd * (remToEnd / 1.6)));
      }
      for (let j = 0; j < this.trains.length; j++) {
        if (i === j) continue;
        const o = this.trains[j];
        if (Boolean(o.isMetro) !== Boolean(tr.isMetro)) continue;
        const rx = (o.wx || 0) - (tr.wx || 0);
        const rz = (o.wz || 0) - (tr.wz || 0);
        const dist = Math.hypot(rx, rz);
        const safeBlock = tr.isMetro ? 3.2 : 4.6;
        if (dist < safeBlock + 1.4) {
          const sameDir = (tr.dirX || 0) * (o.dirX || 0) + (tr.dirZ || 0) * (o.dirZ || 0);
          const fwd = rx * (tr.dirX || 0) + rz * (tr.dirZ || 0);
          const lat = Math.abs(-rx * (tr.dirZ || 0) + rz * (tr.dirX || 0));
          // Follow block signal behind same-direction train; opposing trains pass smoothly on dual tracks!
          if (sameDir > 0.35 && fwd > 0.1 && lat < 0.75) {
            if (fwd < safeBlock) {
              targetSpeed = 0;
              break;
            } else {
              targetSpeed = Math.min(targetSpeed, Math.max(0.4, (o.speed || 0) * 0.85));
            }
          }
        }
      }

      const trAccel = targetSpeed < (tr.speed || 0) ? 5.2 : 2.6;
      tr.speed = (tr.speed || 0) + (targetSpeed - (tr.speed || 0)) * Math.min(1, effDt * trAccel);
      if (tr.speed < 0.02 && targetSpeed === 0) tr.speed = 0;

      const prevSeg = Math.floor(tr.dist);
      tr.dist += tr.speed * effDt;
      const curSeg = Math.floor(tr.dist);

      if (tr.destIsPortal) {
        // HSR exiting off map edge: only remove AFTER the entire 5-car consist has smoothly passed off-edge!
        const tailDist = tr.dist - (tr.cars - 1) * spacing;
        if (tailDist >= maxPathDist) {
          this.trains.splice(i, 1);
          continue;
        }
      } else if (tr.dist >= maxPathDist) {
        // Arrived at city Metro/HSR station -> dock cleanly & dwell before continuing loop/turnaround!
        tr.dist = maxPathDist - 0.002;
        tr.speed = 0;
        tr.dwell = tr.isMetro ? 1.55 : 1.85;
        tr.atTerminus = true;
      }

      if (!this.isValidTrainSpan(tr)) {
        this.trains.splice(i, 1);
        continue;
      }

      // Pause briefly if passing an intermediate station!
      if (!tr.atTerminus && curSeg !== prevSeg && curSeg > 1 && curSeg < tr.path.length - 2) {
        const node = tr.path[curSeg];
        const bType = this.sim.getTile(node.x, node.z)?.building?.type;
        if ((!tr.isMetro && bType === 'hsr_station') || (tr.isMetro && bType === 'metro_station')) {
          tr.dwell = tr.isMetro ? 1.35 : 1.60;
          tr.speed = 0;
        }
      }

      const hNow = this._sampleTrainPosOnPath(tr.path, Math.min(maxPathDist - 1e-4, tr.dist));
      if (hNow) { tr.wx = hNow.wx; tr.wz = hNow.wz; tr.dirX = hNow.dirX; tr.dirZ = hNow.dirZ; }
    }

    // Discount calm red-light waiting queues (0.55 weight vs 1.0 for genuine gridlock/jams) so normal 16-18s signal phases never falsely trigger road-paralysis abandonment!
    const redWaitMap = new Map();
    for (let vi = 0; vi < this.vehicles.length; vi++) {
      const v = this.vehicles[vi];
      if (!v || !v._waitingAtRed || v.accidentId) continue;
      const cur = v.path && v.path[v.seg];
      if (cur && cur.layer === 0 && !cur.onRamp) {
        const ci = idx(cur.x, cur.z);
        redWaitMap.set(ci, (redWaitMap.get(ci) || 0) + 1);
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
      const redWaiting = redWaitMap.get(i) || 0;
      const effOcc = Math.max(0, this.tileOccupancy[i] - redWaiting * 0.45);
      const cap = t.roadGround >= 2 ? 4.4 : 2.3;
      const raw = Math.min(1, effOcc / cap);
      t.congestion = t.congestion * 0.95 + raw * 0.05;
    }

    // Update 3D Airliners, Cargo Container Ships, Coastal Leisure Boats & Sidewalk Pedestrians
    this.updateAircraft(effDt);
    this.updateShips(effDt);
    this.updateLeisureBoats(effDt);
    this.updatePedestrians(effDt);
  }

  _isPedRoadTile(tx, tz) {
    if (!inBounds(tx, tz)) return false;
    const ti = idx(tx, tz);
    const t = this.sim.grid[ti];
    return Boolean(t && (t.roadGround === 1 || t.roadGround === 2) && !t.dam && !t.ramp && this.isGroundRoadPassable(t) && (this.roadDegree[ti] || 0) >= 1);
  }

  _pickPedNextTile(tx, tz, prevX, prevZ) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    // Inside an intersection (deg >= 3), ALWAYS finish crossing straight to the far granite curb instead of turning 90° onto a perpendicular red crosswalk!
    if (prevX >= 0 && prevZ >= 0 && inBounds(tx, tz) && (this.roadDegree[idx(tx, tz)] || 0) >= 3) {
      const straightX = tx + (tx - prevX);
      const straightZ = tz + (tz - prevZ);
      if (this._isPedRoadTile(straightX, straightZ)) {
        return { x: straightX, z: straightZ, reversed: false };
      }
    }
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

  _findAdjacentBuildingDir(tx, tz) {
    for (let k = 0; k < 4; k++) {
      const d = RAMP_DIRS[k];
      const nx = tx + d.dx;
      const nz = tz + d.dz;
      if (!inBounds(nx, nz)) continue;
      const nt = this.sim.grid[idx(nx, nz)];
      if (nt && nt.building && !nt.building.underConstruction) {
        return { dx: d.dx, dz: d.dz };
      }
    }
    return null;
  }

  _syncPedTransform(p) {
    const w0 = tileToWorld(p.tx, p.tz);
    const w1 = tileToWorld(p.nx, p.nz);
    const dx = w1.wx - w0.wx;
    const dz = w1.wz - w0.wz;
    const len = Math.hypot(dx, dz);
    if (len > 0.01 && p.fadeState !== 'exiting') {
      p.dirX = dx / len;
      p.dirZ = dz / len;
    }
    // Outer sidewalk offset (+-0.43m from road centerline)
    const swOff = 0.43 * p.side;
    const rightX = -p.dirZ;
    const rightZ = p.dirX;
    const frac = Math.min(1, Math.max(0, p.t));
    let bx = w0.wx + dx * frac + rightX * swOff;
    let bz = w0.wz + dz * frac + rightZ * swOff;

    // Smoothly step out of / into an adjacent building doorway instead of popping mid-sidewalk!
    if (p.doorDir) {
      if (p.fadeState === 'entering') {
        const pull = (1.0 - (p.fadeScale ?? 1.0)) * 0.18;
        bx += p.doorDir.dx * pull;
        bz += p.doorDir.dz * pull;
      } else if (p.fadeState === 'exiting') {
        const stepIn = (1.0 - (p.fadeScale ?? 0)) * 0.22;
        bx = (p._exitOriginX ?? bx) + p.doorDir.dx * stepIn;
        bz = (p._exitOriginZ ?? bz) + p.doorDir.dz * stepIn;
        p.dirX = p.doorDir.dx;
        p.dirZ = p.doorDir.dz;
      }
    }

    p.wx = bx;
    p.wz = bz;

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

    // NEVER pop pedestrians mid-sidewalk! Gently send excess citizens home into nearby building doorways!
    let activeWalkers = 0;
    for (let i = 0; i < this.pedestrians.length; i++) {
      if (!this.pedestrians[i].returningHome && this.pedestrians[i].fadeState !== 'exiting') {
        activeWalkers++;
      }
    }
    if (activeWalkers > targetPed) {
      let toSendHome = activeWalkers - targetPed;
      for (let i = 0; i < this.pedestrians.length && toSendHome > 0; i++) {
        const p = this.pedestrians[i];
        if (!p.returningHome && p.fadeState !== 'exiting') {
          p.returningHome = true;
          toSendHome--;
        }
      }
    }

    // Spawn batch smoothly emerging from building doorways along straight sidewalks (NEVER spawn mid-intersection!)
    let spawnBudget = Math.min(6, Math.max(0, targetPed - this.pedestrians.length));
    while (spawnBudget-- > 0 && this.pedestrians.length < 240) {
      let spot = null;
      let doorDir = null;
      for (let tries = 0; tries < 6; tries++) {
        const cand = this._pedRoadPool[(Math.random() * this._pedRoadPool.length) | 0];
        if (!cand || !this._isPedRoadTile(cand.x, cand.z)) continue;
        if ((this.roadDegree[idx(cand.x, cand.z)] || 0) >= 3) continue; // Keep spawns strictly on straight sidewalk blocks!
        spot = cand;
        doorDir = this._findAdjacentBuildingDir(cand.x, cand.z);
        if (doorDir) break;
      }
      if (!spot) continue;
      const next = this._pickPedNextTile(spot.x, spot.z, -1, -1);
      const p = {
        id: this._nextPedId++,
        tx: spot.x,
        tz: spot.z,
        nx: next.x,
        nz: next.z,
        t: 0.05 + Math.random() * 0.30,
        side: Math.random() < 0.5 ? 1 : -1,
        wx: 0,
        wy: 0,
        wz: 0,
        dirX: 1,
        dirZ: 0,
        walkPhase: Math.random() * Math.PI * 2,
        colorIdx: (Math.random() * 12) | 0,
        pantsIdx: (Math.random() * 6) | 0,
        hairIdx: (Math.random() * 5) | 0,
        skinIdx: (Math.random() * 4) | 0,
        heightScale: 0.90 + Math.random() * 0.20,
        fadeScale: 0.08,
        fadeState: 'entering',
        doorDir,
        returningHome: false,
        homeSearchBlocks: 0,
        speed: 0.085 + Math.random() * 0.045,
        ttl: 75 + Math.random() * 85
      };
      this._syncPedTransform(p);
      this.pedestrians.push(p);
    }

    // Advance sidewalk walkers at calm strolling pace + brisk signal-synchronized crosswalk clearing (0 red-light stragglers!)
    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      const p = this.pedestrians[i];
      if (!this._isPedRoadTile(p.tx, p.tz)) {
        this.pedestrians.splice(i, 1);
        continue;
      }

      if (p.fadeState === 'entering') {
        p.fadeScale = Math.min(1.0, (p.fadeScale ?? 0.08) + effDt * 1.9);
        if (p.fadeScale >= 1.0) {
          p.fadeScale = 1.0;
          p.fadeState = 'walking';
        }
      } else if (p.fadeState === 'exiting') {
        // Citizen smoothly walks into building doorway and fades cleanly inside!
        p.fadeScale = Math.max(0, (p.fadeScale ?? 1.0) - effDt * 1.65);
        p.walkPhase = (p.walkPhase + p.speed * effDt * 15) % (Math.PI * 2);
        this._syncPedTransform(p);
        if (p.fadeScale <= 0.02) {
          this.pedestrians.splice(i, 1);
        }
        continue;
      }

      p.ttl -= effDt;
      if (p.ttl <= 0) {
        p.returningHome = true;
      }

      const curTileDeg = inBounds(p.tx, p.tz) ? (this.roadDegree[idx(p.tx, p.tz)] || 0) : 0;
      const nxtTileDeg = inBounds(p.nx, p.nz) ? (this.roadDegree[idx(p.nx, p.nz)] || 0) : 0;
      const curSig = curTileDeg >= 3 ? this.getSignalState(p.tx, p.tz) : null;
      const nxtSig = nxtTileDeg >= 3 ? this.getSignalState(p.nx, p.nz) : null;
      const curIsSig = Boolean(curSig && curSig.active);
      const nxtIsSig = Boolean(nxtSig && nxtSig.active);
      const pedMoveVert = p.nz !== p.tz;

      // Only step indoors when safely on a straight sidewalk outside intersection roadway!
      const inIntersectionRoadway = (nxtIsSig && p.t > 0.54) || (curIsSig && p.t < 0.46);
      if (p.returningHome && p.fadeState === 'walking' && !inIntersectionRoadway) {
        const bDir = this._findAdjacentBuildingDir(p.tx, p.tz);
        if (bDir) {
          p.fadeState = 'exiting';
          p.doorDir = bDir;
          p._exitOriginX = p.wx;
          p._exitOriginZ = p.wz;
          this._syncPedTransform(p);
          continue;
        }
      }

      // 1. Traffic Signal Pedestrian Curb Control & Brisk Green-Window Crosswalk Clearing!
      let waitingAtCurbRed = false;
      let effWalkSpd = p.speed;
      if (p.retreatingToCurb) {
        // Smoothly finish stepping backward onto the near granite curb (zero ping-pong!)
        const backDist = Math.max(p.speed, 0.72) * effDt;
        p.t -= backDist;
        p.walkPhase = (p.walkPhase + p.speed * effDt * 15) % (Math.PI * 2);
        if (curIsSig && p.t < 0) {
          const backX = 2 * p.tx - p.nx;
          const backZ = 2 * p.tz - p.nz;
          if (this._isPedRoadTile(backX, backZ)) {
            p.nx = p.tx;
            p.nz = p.tz;
            p.tx = backX;
            p.tz = backZ;
            p.t = Math.max(0.52, 1.0 + p.t);
          } else {
            p.t = 0.02;
            p.retreatingToCurb = false;
          }
        } else if (!curIsSig && p.t <= 0.52) {
          p.t = 0.52;
          p.retreatingToCurb = false;
          p.walkPhase = 0;
        }
        this._syncPedTransform(p);
        continue;
      }

      if (nxtIsSig) {
        const pedSig = pedMoveVert ? nxtSig.nsPed : nxtSig.ewPed;
        if (p.t >= 0.44 && p.t <= 0.56) {
          // On granite sidewalk corner BEFORE zebra crosswalk: ONLY step off curb during active WALK window!
          if (pedSig !== 'walk') {
            waitingAtCurbRed = true;
            if (p.t > 0.52) p.t = 0.52;
          } else {
            effWalkSpd = Math.max(p.speed, 0.54);
          }
        } else if (p.t > 0.56) {
          // Already crossing zebra crosswalk -> briskly finish crossing BEFORE green ends!
          effWalkSpd = Math.max(p.speed, pedSig === 'walk' ? 0.54 : (pedSig === 'flashing' ? 0.70 : 0.85));
        }
      } else if (curIsSig && p.t < 0.46) {
        // Second half of intersection crosswalk -> briskly reach far granite sidewalk before red!
        const pedSig = pedMoveVert ? curSig.nsPed : curSig.ewPed;
        effWalkSpd = Math.max(p.speed, pedSig === 'walk' ? 0.54 : (pedSig === 'flashing' ? 0.70 : 0.85));
      }

      // 2. Physical Pedestrian-vs-Vehicle OBB Blocking (checks BOTH stopped AND moving cars -> ZERO phasing, AND stopped red-light buses behind the stop line NEVER block green crosswalks!)
      let pedBlocked = waitingAtCurbRed;
      let pedInsideCar = false;
      const stepDist = effWalkSpd * effDt;
      if (!waitingAtCurbRed) {
        const lookAhead = inIntersectionRoadway ? 0.045 : 0.08;
        const candWx = p.wx + (p.dirX || 0) * (stepDist + lookAhead);
        const candWz = p.wz + (p.dirZ || 0) * (stepDist + lookAhead);
        const vehs = this.vehicles;
        const clearingNow = inIntersectionRoadway && effWalkSpd >= 0.60;
        for (let vj = 0; vj < vehs.length; vj++) {
          const veh = vehs[vj];
          if (!veh || veh.inTunnel) continue;
          const vCur = veh.path && veh.path[veh.seg];
          if (vCur && (vCur.layer === 1 || vCur.onRamp)) continue; // Elevated highway cars are overhead
          const dx = candWx - veh.wx;
          const dz = candWz - veh.wz;
          if (dx * dx + dz * dz > 0.64) continue;
          const vdx = veh.dirX || 0;
          const vdz = veh.dirZ || 1;
          const localFwd = dx * vdx + dz * vdz;
          const localLat = Math.abs(-dx * vdz + dz * vdx);
          const halfL = (veh.length || 0.34) * 0.5;
          const halfW = (veh.width || 0.16) * 0.5;
          const vehMoving = (veh.speed || 0) > 0.08;
          // Tight physical bumper clearance for stopped cars (0.045m) so buses stopped behind stop line NEVER freeze green-light crosswalk pedestrians!
          const pad = vehMoving ? (clearingNow ? 0.06 : 0.11) : 0.045;
          const moveLead = vehMoving ? (clearingNow ? 0.14 : 0.26) : 0.0;
          if (localFwd > -(halfL + pad) && localFwd < (halfL + pad + moveLead) && localLat < (halfW + pad)) {
            pedBlocked = true;
            // Check if citizen is already right inside vehicle's tight envelope (step gently back onto curb)
            const cDx = p.wx - veh.wx;
            const cDz = p.wz - veh.wz;
            const cFwd = cDx * vdx + cDz * vdz;
            const cLat = Math.abs(-cDx * vdz + cDz * vdx);
            if (Math.abs(cFwd) < halfL + 0.05 && cLat < halfW + 0.05) {
              pedInsideCar = true;
            }
            break;
          }
        }
      }

      if (!pedBlocked) {
        p.t += stepDist;
        p.walkPhase = (p.walkPhase + Math.min(stepDist, p.speed * effDt * 2.2) * 15) % (Math.PI * 2);
      } else if (waitingAtCurbRed) {
        // Calmly stand still on the granite curb waiting for pedestrian WALK signal
        p.walkPhase = 0;
      } else if (nxtIsSig && p.t > 0.52 && (pedMoveVert ? nxtSig.nsPed : nxtSig.ewPed) !== 'walk') {
        // Blocked in first half of crosswalk while light is flashing/red -> commit to smooth retreat back onto near granite curb!
        p.retreatingToCurb = true;
      } else if (curIsSig && p.t < 0.45 && (pedMoveVert ? curSig.nsPed : curSig.ewPed) !== 'walk') {
        // Blocked mid-intersection during red/flashing by a box-blocking car -> commit to smooth retreat back onto near granite curb!
        p.retreatingToCurb = true;
      } else if (pedInsideCar) {
        // Gently back up onto the curb so a citizen never stays inside a car that pulled up to the crosswalk
        p.t = Math.max(0.02, p.t - p.speed * effDt * 0.8);
      }

      if (p.t >= 1.0) {
        const prevX = p.tx;
        const prevZ = p.tz;
        p.tx = p.nx;
        p.tz = p.nz;
        p.t -= 1.0;
        if (!this._isPedRoadTile(p.tx, p.tz)) {
          // Smooth turn-around instead of instant pop if next tile was unwalkable!
          p.tx = prevX;
          p.tz = prevZ;
          p.t = 0.05;
          p.side = -p.side;
        }
        const arrivedInInter = inBounds(p.tx, p.tz) && (this.roadDegree[idx(p.tx, p.tz)] || 0) >= 3;
        if (p.returningHome && !arrivedInInter) {
          p.homeSearchBlocks = (p.homeSearchBlocks || 0) + 1;
          const bDir = this._findAdjacentBuildingDir(p.tx, p.tz);
          if (bDir || p.homeSearchBlocks >= 4) {
            p.fadeState = 'exiting';
            p.doorDir = bDir || { dx: -p.dirZ * p.side, dz: p.dirX * p.side };
            p._exitOriginX = p.wx;
            p._exitOriginZ = p.wz;
            this._syncPedTransform(p);
            continue;
          }
        }
        const next = this._pickPedNextTile(p.tx, p.tz, prevX, prevZ);
        p.nx = next.x;
        p.nz = next.z;
        if (next.reversed) {
          p.side = -p.side;
        } else if (arrivedInInter && next.x - p.tx !== p.tx - prevX && next.z - p.tz !== p.tz - prevZ) {
          // Turned at a T-junction corner where no straight road existed -> snap cleanly to the outgoing sidewalk edge
          p.t = Math.max(p.t, 0.48);
        }
      }

      this._syncPedTransform(p);
    }
  }

  // Exact world-space runway centerline, direction & elevation matching _buildAirport() local (x ∈ [-1.9,+1.9], z = -0.82)
  getAirportRunwayFrame(ap) {
    const center = tileToWorld(ap.x, ap.z);
    const rotRad = ((ap.building && ap.building.rot) || 0) * Math.PI * 0.5;
    const c = Math.cos(rotRad);
    const s = Math.sin(rotRad);
    const rwLocalZ = -0.82;
    return {
      rCx: center.wx + rwLocalZ * s,
      rCz: center.wz + rwLocalZ * c,
      dirX: c,
      dirZ: -s,
      rightX: s,
      rightZ: c,
      deckY: this.sim.getTileElev(ap.x, ap.z) + 0.068
    };
  }

  updateAircraft(effDt) {
    // First despawn any ground rollout / short-final aircraft whose runway was bulldozed or flooded
    for (let i = this.aircraft.length - 1; i >= 0; i--) {
      const plane = this.aircraft[i];
      if ((plane.phase === 'rollout' || (plane.progress >= 0.36 && plane.progress <= 0.64)) &&
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
      const rw = this.getAirportRunwayFrame(ap);
      const startAlong = -17.5;
      this.aircraft.push({
        ax: ap.x,
        az: ap.z,
        progress: 0.06,
        phase: 'approach',
        wx: rw.rCx + rw.dirX * startAlong,
        wy: rw.deckY + 7.6,
        wz: rw.rCz + rw.dirZ * startAlong,
        dirX: rw.dirX,
        dirZ: rw.dirZ,
        yaw: Math.atan2(rw.dirX, rw.dirZ),
        pitch: -0.17,
        roll: 0,
        scale: 1,
        variant: 0
      });
      this.aircraftTimer = 0;
    } else if (this.aircraft.length < maxPlanes && this.aircraftTimer >= 9.0) {
      const first = this.aircraft[0];
      if (first.progress >= 0.44 && first.progress <= 0.64) {
        const ap = airports[this.aircraft.length % airports.length];
        const rw = this.getAirportRunwayFrame(ap);
        const startAlong = -17.5;
        this.aircraft.push({
          ax: ap.x,
          az: ap.z,
          progress: 0.0,
          phase: 'approach',
          wx: rw.rCx + rw.dirX * startAlong,
          wy: rw.deckY + 7.6,
          wz: rw.rCz + rw.dirZ * startAlong,
          dirX: rw.dirX,
          dirZ: rw.dirZ,
          yaw: Math.atan2(rw.dirX, rw.dirZ),
          pitch: -0.18,
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
          ap = this.sim.getTile(plane.ax, plane.az);
        }
      }

      plane.progress += effDt * 0.042;
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
      if (p > 0.38 && p < 0.62 && !this.isRunwayIntact(plane.ax, plane.az)) {
        this.aircraft.splice(i, 1);
        continue;
      }

      const rw = this.getAirportRunwayFrame(ap);
      let along = 0;
      let lateral = 0;
      let wy = rw.deckY;
      let tx = rw.dirX;
      let tz = rw.dirZ;
      let targetPitch = 0;
      let targetRoll = 0;

      if (p <= 0.38) {
        // Straight ILS glideslope final aligned dead-center with the illuminated runway threshold (-17.5 -> -1.68)
        plane.phase = 'approach';
        const s = p / 0.38;
        const hs = 1 - Math.pow(1 - s, 1.22);
        along = -17.5 + 15.82 * hs;
        lateral = 0;
        wy = rw.deckY + 7.6 * Math.pow(1 - s, 1.55);
        targetPitch = -0.20 * Math.pow(1 - s, 0.85) + 0.045;
        targetRoll = 0;
      } else if (p < 0.62) {
        // Touchdown rollout & full-length takeoff run right along runway centerline (-1.68 -> +1.55)
        plane.phase = 'rollout';
        const s = (p - 0.38) / 0.24;
        along = -1.68 + 3.23 * s;
        lateral = 0;
        wy = rw.deckY;
        if (s < 0.24) targetPitch = 0.045 * (1 - s / 0.24);
        else if (s <= 0.74) targetPitch = 0;
        else targetPitch = ((s - 0.74) / 0.26) * 0.21;
        targetRoll = 0;
      } else {
        // Positive-rate departure climb straight out off runway end, then gentle scenic turn above 6.5 units
        plane.phase = 'climb';
        const s = (p - 0.62) / 0.38;
        const hs = 0.26 * s + 0.74 * s * s;
        along = 1.55 + 17.5 * hs;
        const turnS = Math.max(0, (s - 0.38) / 0.62);
        lateral = -2.8 * turnS * turnS;
        const dAlong = 17.5 * (0.26 + 1.48 * s);
        const dLat = turnS > 0 ? (-5.6 * turnS / 0.62) : 0;
        tx = rw.dirX * dAlong + rw.rightX * dLat;
        tz = rw.dirZ * dAlong + rw.rightZ * dLat;
        wy = rw.deckY + 8.6 * Math.pow(s, 1.45);
        targetPitch = 0.21 + 0.05 * Math.sin(s * Math.PI * 0.85);
        targetRoll = turnS > 0 ? Math.sin(turnS * Math.PI) * 0.18 : 0;
      }

      const wx = rw.rCx + rw.dirX * along + rw.rightX * lateral;
      const wz = rw.rCz + rw.dirZ * along + rw.rightZ * lateral;
      const tLen = Math.hypot(tx, tz) || 1;
      const ndx = tx / tLen;
      const ndz = tz / tLen;
      const targetYaw = Math.atan2(ndx, ndz);

      plane.wx = wx;
      plane.wy = wy;
      plane.wz = wz;

      if (wrapped || plane.phase === 'rollout') {
        plane.dirX = ndx;
        plane.dirZ = ndz;
        plane.yaw = targetYaw;
        plane.pitch += (targetPitch - plane.pitch) * Math.min(1, effDt * 10.0);
        plane.roll = 0;
        if (wrapped) plane.pitch = targetPitch;
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
        // Strongly follow player-planned Maritime Shipping Lanes (⚓ 海运航道)!
        const laneMult = grid[ni].shippingLane ? 0.36 : 1.0;
        const nd = bestD + baseCost * laneMult + shallowPenalty + bridgePenalty;
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
    // Primary SE Sea Bay deep-water entry (x=53..54, z=51, keeping hull stern 100% inside inBounds!)
    const candidates = [{ x: 53, z: 51 }, { x: 53, z: 52 }, { x: 54, z: 51 }];
    for (let r = 1; r <= 7; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          const nx = 53 + dx, nz = 51 + dz;
          if (nx >= GRID_SIZE - 1 || nz >= GRID_SIZE - 1) continue;
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
        if (wd[ni] > 0.14 && !this.sim.grid[ni].dam) {
          let wetNeighbors = 0;
          for (const [ox, oz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            if (inBounds(nx + ox, nz + oz) && wd[idx(nx + ox, nz + oz)] > 0.14) wetNeighbors++;
          }
          berths.push({ x: nx, z: nz, depth: wd[ni], d2: dx * dx + dz * dz, wetNeighbors });
        }
      }
    }
    berths.sort((a, b) => (b.wetNeighbors - a.wetNeighbors) || (a.d2 - b.d2) || (b.depth - a.depth));

    for (const berth of berths) {
      const path = this.findSeaOriginForBerth(berth.x, berth.z);
      if (!path) continue;

      const p0 = path[0];
      const p1 = path[1];
      // Ensure wide safe sea-entry clearance from any existing ship (prevents spawn overlaps!)
      const blocked = this.ships.some((s) => Math.hypot(s.wx - p0.wx, s.wz - p0.wz) < 3.0);
      if (blocked) return;

      const dx = p1.wx - p0.wx;
      const dz = p1.wz - p0.wz;
      const yaw = Math.atan2(dx, dz);
      const surfY = this.sim.getTileElev(p0.x, p0.z) + wd[idx(p0.x, p0.z)];
      const shipId = this._nextShipId++;

      this.ships.push({
        id: shipId,
        portX: port.x,
        portZ: port.z,
        waypoints: path,
        seg: 0,
        t: 0,
        leg: 'inbound',
        dwell: 0,
        departGrace: 0,
        stuckTimer: 0,
        scale: 0.72,
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
        variant: (port.x + port.z + shipId) % 4
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

    // Helper: distance along route from seaport berth
    const shipDistFromBerth = (sh) => {
      if (!sh || !sh.waypoints) return 99;
      if (sh.leg === 'berth' || sh.dwell > 0) return 0;
      return sh.leg === 'inbound'
        ? Math.max(0, sh.waypoints.length - 1 - (sh.seg + sh.t))
        : (sh.seg + sh.t);
    };

    // Pass 0: Strict Single-Vessel Harbor Berth & Inner-Channel Reservation Map!
    // Outbound/berthed ships always hold inner harbor priority (< 5.0 tiles); closest inbound holds next.
    const portOwner = new Map();
    for (let i = 0; i < this.ships.length; i++) {
      const sh = this.ships[i];
      const key = `${sh.portX},${sh.portZ}`;
      const dBerth = shipDistFromBerth(sh);
      const isBerthOrOut = sh.leg === 'berth' || sh.dwell > 0 || (sh.leg === 'outbound' && dBerth < 5.2);
      const cur = portOwner.get(key);
      if (isBerthOrOut) {
        if (!cur || !cur.priority || dBerth < cur.dBerth) {
          portOwner.set(key, { ship: sh, priority: true, dBerth });
        }
      } else if (sh.leg === 'inbound' && dBerth < 5.2) {
        if (!cur || (!cur.priority && dBerth < cur.dBerth)) {
          portOwner.set(key, { ship: sh, priority: false, dBerth });
        }
      }
    }

    for (let i = this.ships.length - 1; i >= 0; i--) {
      const ship = this.ships[i];
      if (!this.isValidShipState(ship)) {
        this.ships.splice(i, 1);
        continue;
      }

      // 3s pause at berth to load/unload cargo containers, then smoothly turn & sail out to open sea!
      if (ship.dwell > 0) {
        ship.speed = 0;
        ship.stuckTimer = 0;
        ship.scale = 1.0;
        ship.dwell -= effDt;
        const lastWp = ship.waypoints[ship.waypoints.length - 1];
        const surf = this.sim.getTileElev(lastWp.x, lastWp.z) + this.sim.waterDepth[idx(lastWp.x, lastWp.z)];
        ship.wy = surf + Math.sin(this.signalClock * 1.6 + ship.bobPhase) * 0.008;
        ship.roll = Math.sin(this.signalClock * 1.2 + ship.bobPhase) * 0.015;
        if (ship.dwell <= 0) {
          ship.dwell = 0;
          ship.leg = 'outbound';
          ship.departGrace = 3.6;
          ship.waypoints = ship.waypoints.slice().reverse();
          ship.seg = 0;
          ship.t = 0;
          // Immediately orient heading along outbound channel so bow/stern NEVER poke shore on cast-off!
          if (ship.waypoints.length >= 2) {
            const ddx = ship.waypoints[1].wx - ship.waypoints[0].wx;
            const ddz = ship.waypoints[1].wz - ship.waypoints[0].wz;
            const dLen = Math.hypot(ddx, ddz) || 1;
            ship.yaw = Math.atan2(ddx / dLen, ddz / dLen);
            ship.dirX = Math.sin(ship.yaw);
            ship.dirZ = Math.cos(ship.yaw);
          }
        }
        continue;
      }

      if ((ship.departGrace || 0) > 0) {
        ship.departGrace = Math.max(0, ship.departGrace - effDt);
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
      const distFromBerth = shipDistFromBerth(ship);

      const nearBerth =
        (ship.leg === 'inbound' && ship.seg >= wps.length - 2) ||
        (ship.leg === 'outbound' && ship.seg === 0);
      let targetSpeed = nearBerth ? ship.maxSpeed * 0.62 : ship.maxSpeed;
      let holdingForPort = false;

      // 1. Harbor Anchorage Hold: if an outbound/berthed ship owns inner harbor, incoming ships wait politely offshore!
      const pKey = `${ship.portX},${ship.portZ}`;
      const owner = portOwner.get(pKey);
      if (ship.leg === 'inbound' && owner && owner.ship !== ship && distFromBerth <= 5.6 && distFromBerth >= 2.2) {
        targetSpeed = 0;
        holdingForPort = true;
      }

      // Strict Asymmetric Total-Order Maritime Right-of-Way (Outbound > Berth > Inbound, tie-break by id -> ZERO mutual deadlocks!)
      const shipRank = (s) => (s.leg === 'outbound' ? 3 : ((s.leg === 'berth' || s.dwell > 0) ? 2 : 1));
      const hasRightOfWay = (a, b) => {
        const ra = shipRank(a), rb = shipRank(b);
        if (ra !== rb) return ra > rb;
        return (a.id || 0) < (b.id || 0);
      };

      // 2. Full 360° Separated-Lane Maritime Anti-Collision (ONLY lower-priority vessel yields; higher-priority vessel keeps steaming!)
      let extraStarboardAvoid = 0;
      for (let j = 0; j < this.ships.length; j++) {
        if (i === j) continue;
        const o = this.ships[j];
        const rx = o.wx - ship.wx;
        const rz = o.wz - ship.wz;
        const d = Math.hypot(rx, rz);
        if (d < 3.4) {
          const fwd = rx * ship.dirX + rz * ship.dirZ;
          const lat = Math.abs(-rx * ship.dirZ + rz * ship.dirX);
          const headingDot = ship.dirX * o.dirX + ship.dirZ * o.dirZ;
          const iYield = !hasRightOfWay(ship, o) || (o.dwell > 0 || o.leg === 'berth');

          // Both ships widen starboard passing separation when approaching head-on/beam-on
          if (headingDot < 0.15) {
            extraStarboardAvoid = Math.max(extraStarboardAvoid, 0.42);
          }

          if (iYield) {
            // Yielding vessel slows/holds cleanly well before hulls get close
            if (d < 1.95 && fwd > -0.15 && lat < 1.25) {
              targetSpeed = 0;
              break;
            } else if (d < 2.8 && fwd > 0.10 && lat < 1.15) {
              targetSpeed = Math.min(targetSpeed, ship.maxSpeed * 0.25);
            }
          } else {
            // Higher-priority vessel NEVER deadlocks for a yielding vessel; only slows if following directly behind same-way ship!
            if (headingDot > 0.55 && fwd > 0.20 && d < 1.75 && lat < 0.90) {
              targetSpeed = Math.min(targetSpeed, Math.max(0.15, o.speed * 0.85));
            }
          }
        }
      }

      // 3. Anti-Stuck Recovery: if a non-holding ship ever gets wedged (< 0.08 speed for > 4.2s), steer wide starboard & creep clear!
      ship.stuckTimer = ship.stuckTimer || 0;
      if (ship.speed < 0.08 && !holdingForPort) {
        ship.stuckTimer += effDt;
        if (ship.stuckTimer > 4.2) {
          targetSpeed = Math.max(targetSpeed, ship.maxSpeed * 0.55);
          extraStarboardAvoid = Math.max(extraStarboardAvoid, 0.65);
        }
      } else {
        ship.stuckTimer = Math.max(0, ship.stuckTimer - effDt * 2.0);
      }

      ship.speed += (targetSpeed - ship.speed) * Math.min(1, effDt * 3.4);
      if (ship.speed < 0.015 && targetSpeed === 0) ship.speed = 0;
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
          ship.stuckTimer = 0;
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

      ship.yaw = lerpAngle(ship.yaw, targetYaw, Math.min(1, effDt * 3.6));
      ship.dirX = Math.sin(ship.yaw);
      ship.dirZ = Math.cos(ship.yaw);

      // Wide Two-Way Starboard Channel Separation (0.62m base + 0.42m passing margin -> >= 1.6m port-to-port gap!)
      const updatedDistFromBerth = shipDistFromBerth(ship);
      const laneTaper = Math.min(1, Math.max(0, (updatedDistFromBerth - 0.55) / 1.4));
      const rightX = -ship.dirZ;
      const rightZ = ship.dirX;
      const desiredOff = (0.62 + extraStarboardAvoid) * laneTaper;

      const baseWx = c0.wx + vx * ship.t;
      const baseWz = c0.wz + vz * ship.t;
      let nextWx = baseWx;
      let nextWz = baseWz;
      for (const frac of [1.0, 0.72, 0.42, 0.18]) {
        const candX = baseWx + rightX * (desiredOff * frac);
        const candZ = baseWz + rightZ * (desiredOff * frac);
        const offTile = worldToTile(candX, candZ);
        if (inBounds(offTile.x, offTile.z) &&
            this.sim.waterDepth[idx(offTile.x, offTile.z)] > 0.12 &&
            !this.sim.grid[idx(offTile.x, offTile.z)].dam) {
          nextWx = candX;
          nextWz = candZ;
          break;
        }
      }

      // Asymmetric hull-clearance guard: ONLY the yielding vessel halts if too close; higher-priority ship steams through cleanly!
      let wouldClip = false;
      for (let j = 0; j < this.ships.length; j++) {
        if (i === j) continue;
        const o = this.ships[j];
        const curD = Math.hypot(o.wx - ship.wx, o.wz - ship.wz);
        const nextD = Math.hypot(o.wx - nextWx, o.wz - nextWz);
        if (nextD < 1.15 && nextD < curD + 0.01 && !hasRightOfWay(ship, o) && (ship.stuckTimer || 0) <= 4.2) {
          wouldClip = true;
          break;
        }
      }
      if (!wouldClip) {
        ship.wx = nextWx;
        ship.wz = nextWz;
      } else {
        ship.speed = 0;
      }

      if (!this.isValidShipState(ship)) {
        this.ships.splice(i, 1);
        continue;
      }

      // Keep cargo ships full-size across the entire visible sea bay (gentle 0.72->1.0 horizon ease only at outermost 0.35 tiles!)
      const prog = ship.seg + ship.t;
      const rem = (wps.length - 1) - prog;
      if (ship.leg === 'inbound') {
        ship.scale = prog < 0.35 ? (0.72 + (prog / 0.35) * 0.28) : 1.0;
      } else {
        ship.scale = rem < 0.35 ? (0.72 + (rem / 0.35) * 0.28) : 1.0;
      }

      const s0 = this.sim.getTileElev(c0.x, c0.z) + this.sim.waterDepth[idx(c0.x, c0.z)];
      const s1 = this.sim.getTileElev(c1.x, c1.z) + this.sim.waterDepth[idx(c1.x, c1.z)];
      ship.wy = s0 + (s1 - s0) * ship.t + Math.sin(this.signalClock * 1.8 + ship.bobPhase) * 0.012;
      ship.roll = Math.sin(this.signalClock * 1.3 + ship.bobPhase) * 0.022;
    }
  }

  // Scenic CC0 Coastal Sailboats & Fishing Boats gently cruising deep open bay water (strictly clear of shipping lanes & cargo ships!)
  updateLeisureBoats(effDt) {
    const isSafeBoatWater = (wx, wz) => {
      const tile = worldToTile(wx, wz);
      if (!inBounds(tile.x, tile.z)) return false;
      const ti = idx(tile.x, tile.z);
      const t = this.sim.grid[ti];
      if (!t || t.dam || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.building || t.shippingLane) return false;
      return this.sim.waterDepth[ti] > 0.28;
    };

    this._boatSpawnTimer -= effDt;
    if (this.leisureBoats.length < 3 && this._boatSpawnTimer <= 0) {
      this._boatSpawnTimer = 2.6;
      // Search deep coastal bay tiles (SE sea bay) for open circular cruise centers cleanly flanking shipping lanes
      const cands = [
        { tx: 49, tz: 44, r: 1.7, v: 0 },
        { tx: 51, tz: 46, r: 1.5, v: 1 },
        { tx: 46, tz: 52, r: 1.5, v: 0 },
        { tx: 43, tz: 51, r: 1.5, v: 1 },
        { tx: 52, tz: 43, r: 1.4, v: 0 },
        { tx: 49, tz: 53, r: 1.3, v: 1 },
        { tx: 46, tz: 49, r: 1.6, v: 0 }
      ];
      for (let k = 0; k < cands.length && this.leisureBoats.length < 3; k++) {
        const c = cands[(this._nextBoatId + k) % cands.length];
        if (!inBounds(c.tx, c.tz)) continue;
        const center = tileToWorld(c.tx, c.tz);
        if (this.leisureBoats.some((b) => Math.hypot(b.cx - center.wx, b.cz - center.wz) < 3.0)) continue;
        // Verify all 8 compass points on the loop stay in deep open water
        let loopClean = true;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          if (!isSafeBoatWater(center.wx + Math.cos(ang) * c.r, center.wz + Math.sin(ang) * c.r)) {
            loopClean = false;
            break;
          }
        }
        if (!loopClean) continue;
        const startAng = Math.random() * Math.PI * 2;
        const wx = center.wx + Math.cos(startAng) * c.r;
        const wz = center.wz + Math.sin(startAng) * c.r;
        const t = worldToTile(wx, wz);
        const surf = this.sim.getTileElev(t.x, t.z) + this.sim.waterDepth[idx(t.x, t.z)];
        this.leisureBoats.push({
          id: this._nextBoatId++,
          variant: c.v,
          cx: center.wx,
          cz: center.wz,
          radius: c.r,
          angle: startAng,
          angSpeed: (0.24 + Math.random() * 0.12) * (k % 2 === 0 ? 1 : -1),
          bobPhase: Math.random() * Math.PI * 2,
          wx,
          wy: surf,
          wz,
          yaw: startAng + Math.PI * 0.5,
          roll: 0
        });
        break;
      }
    }

    for (let i = this.leisureBoats.length - 1; i >= 0; i--) {
      const b = this.leisureBoats[i];
      // Yield politely if any large container ship is nearby (< 3.2m)
      let yieldToShip = false;
      for (let j = 0; j < this.ships.length; j++) {
        const s = this.ships[j];
        if (Math.hypot(s.wx - b.wx, s.wz - b.wz) < 3.2) {
          yieldToShip = true;
          break;
        }
      }
      if (!yieldToShip) {
        const nextAng = b.angle + b.angSpeed * effDt;
        const nextWx = b.cx + Math.cos(nextAng) * b.radius;
        const nextWz = b.cz + Math.sin(nextAng) * b.radius;
        if (!isSafeBoatWater(nextWx, nextWz)) {
          this.leisureBoats.splice(i, 1);
          continue;
        }
        const vx = nextWx - b.wx;
        const vz = nextWz - b.wz;
        b.angle = nextAng;
        b.wx = nextWx;
        b.wz = nextWz;
        if (Math.hypot(vx, vz) > 0.0005) {
          b.yaw = lerpAngle(b.yaw, Math.atan2(vx, vz), Math.min(1, effDt * 4.5));
        }
      }
      const tile = worldToTile(b.wx, b.wz);
      if (!inBounds(tile.x, tile.z) || this.sim.waterDepth[idx(tile.x, tile.z)] <= 0.15) {
        this.leisureBoats.splice(i, 1);
        continue;
      }
      const surf = this.sim.getTileElev(tile.x, tile.z) + this.sim.waterDepth[idx(tile.x, tile.z)];
      b.wy = surf + Math.sin(this.signalClock * 2.1 + b.bobPhase) * 0.014;
      b.roll = Math.sin(this.signalClock * 1.7 + b.bobPhase) * 0.045;
    }
  }
}
