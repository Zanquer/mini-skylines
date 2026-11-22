export const GRID_SIZE = 56;
export const HALF_GRID = GRID_SIZE / 2;
export const CORNER_STRIDE = GRID_SIZE + 1;
export const SEA_LEVEL = 0.05;

export function inBounds(x, z) {
  return x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE;
}

export function idx(x, z) {
  return z * GRID_SIZE + x;
}

export function cIdx(cx, cz) {
  return cz * CORNER_STRIDE + cx;
}

export function tileToWorld(x, z) {
  return {
    wx: x - HALF_GRID + 0.5,
    wz: z - HALF_GRID + 0.5
  };
}

export function worldToTile(wx, wz) {
  return {
    x: Math.floor(wx + HALF_GRID),
    z: Math.floor(wz + HALF_GRID)
  };
}

export function hash2D(x, z, seed = 1337) {
  let h = (x * 374761393 + z * 668265263 + seed * 1442695041) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function smoothNoise(x, z, seed) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);

  const a = hash2D(xi, zi, seed);
  const b = hash2D(xi + 1, zi, seed);
  const c = hash2D(xi, zi + 1, seed);
  const d = hash2D(xi + 1, zi + 1, seed);

  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

function sCurve(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function fbm(x, z, seed) {
  return (
    smoothNoise(x * 0.065, z * 0.065, seed) * 0.55 +
    smoothNoise(x * 0.14, z * 0.14, seed + 31) * 0.30 +
    smoothNoise(x * 0.29, z * 0.29, seed + 67) * 0.15
  );
}

// Ridged multifractal noise: sharp alpine arêtes & natural erosion couloirs
function ridgedMultifractal(x, z, seed) {
  const n1 = smoothNoise(x * 0.095, z * 0.095, seed + 13);
  let r1 = 1.0 - Math.abs(n1 * 2.0 - 1.0);
  r1 = r1 * r1;

  const n2 = smoothNoise(x * 0.20, z * 0.20, seed + 47);
  let r2 = 1.0 - Math.abs(n2 * 2.0 - 1.0);
  r2 = r2 * r2 * (0.35 + 0.65 * r1);

  const n3 = smoothNoise(x * 0.41, z * 0.41, seed + 89);
  let r3 = 1.0 - Math.abs(n3 * 2.0 - 1.0);
  r3 = r3 * r3 * (0.30 + 0.70 * r2);

  return r1 * 0.56 + r2 * 0.30 + r3 * 0.14;
}

// River centerline z(t) / x(t) helper: diagonal winding river from NW gorge (5,5) to SE bay (46, 48)
export function riverSpineDist(x, z, seed = 2026) {
  const phase = (seed % 97) * 0.05;
  // Project onto diagonal u = (x + z) * 0.5
  const u = (x + z) * 0.5;
  const targetDiff = Math.sin(u * 0.13 + phase) * 3.8 + Math.cos(u * 0.06 - 0.5) * 2.0;
  // On diagonal x - z = targetDiff
  const perp = ((x - z) - targetDiff) * 0.7071;
  return { perp: Math.abs(perp), signedPerp: perp, u };
}

export function createEmptyTile(x, z) {
  return {
    x,
    z,
    trees: 0,
    waterSpring: 0,    // >0 means mountain spring water source inflow!
    roadGround: 0,     // 0 none, 1 street(2L), 2 avenue(4L), 3 highway-portal, 4 mountain-tunnel
    roadBridge: false, // true when roadGround 1/2 was built over water as an elevated bridge deck
    roadDir: -1,       // -1 two-way, 0=N(-Z), 1=S(+Z), 2=W(-X), 3=E(+X) for one-way streets
    banTrucks: false,  // true when heavy trucks & garbage trucks are banned from this street
    busStop: false,    // true when a roadside EV bus shelter is built on this road tile
    junctionMode: 'signal', // 'signal' | 'yield' | 'roundabout' for road intersections
    roadElevated: 0,   // 0 none, 1 elevated highway overpass (+0.68m)
    ramp: false,       // connects roadGround <-> roadElevated
    rail: 0,           // 0 none, 1 HSR twin track, 2 HSR border portal
    metro: false,      // underground metro tunnel
    pipe: false,       // underground water pipe
    pipeBroken: false, // earthquake rupture
    pylon: false,      // 3D high-voltage transmission tower
    dam: false,        // hydroelectric dam wall
    damCrest: 0,       // crest height of dam
    damOutputMW: 0,    // live generated MW
    damHealth: 100,    // 0..100 structural integrity
    damStress: 0,      // 0..1.5 hydrostatic + overtopping stress ratio
    zone: null,        // null | 'RL' | 'RH' | 'CL' | 'CH' | 'I' | 'O'
    building: null,
    powered: false,
    watered: false,
    landValue: 32,
    pollution: 0,
    noise: 0,          // 0..100 live traffic/industry/airport acoustic noise level
    trash: 0,
    serviceScore: 0,
    fireSafety: 0,
    congestion: 0
  };
}

export function generateWorld(seed = 2026) {
  const corners = new Float32Array(CORNER_STRIDE * CORNER_STRIDE);
  const grid = new Array(GRID_SIZE * GRID_SIZE);
  const waterDepth = new Float32Array(GRID_SIZE * GRID_SIZE);
  const waterPoll = new Float32Array(GRID_SIZE * GRID_SIZE);

  // 1. Sculpt 3D Geomorphological Corner Heightmap:
  //    - NW Ridged Multifractal Alpine Massif & Erosion Gullies (cx < 25, cz < 25)
  //    - Narrow Granite Canyon Mouth at (10,16)-(16,10) ideal for Hydroelectric Dam
  //    - Scenic Stepped Foothills / Geological Terraces in East (32..46, 15..28)
  //    - Broad Flat Buildable Central Plains + Level Airport Plateau at (12..18, 26..30)
  //    - Deep Southeast Sea Bay (x > 38, z > 40) with clean Seaport Harbor Quay Shelf
  for (let cz = 0; cz < CORNER_STRIDE; cz++) {
    for (let cx = 0; cx < CORNER_STRIDE; cx++) {
      const n = fbm(cx, cz, seed);
      const { perp, u } = riverSpineDist(cx, cz, seed);

      // Gentle alluvial plain gradient from NW (+0.52) toward SE (+0.34), calm in central plains
      const plainSlope = (1 - (cx + cz) / (GRID_SIZE * 2)) * 0.18;
      let h = 0.36 + plainSlope + (n - 0.5) * 0.10;

      // --- A. NW Alpine Mountain Range with Ridged Multifractal Crests & Gullies (cx < 25, cz < 25) ---
      const nwBox = (1 - sCurve(16.5, 25.5, cx)) * (1 - sCurve(16.5, 25.5, cz));
      const nwRadial = Math.max(0, 1 - Math.hypot(cx - 6.5, cz - 6.5) / 23.5);
      const nwMask = Math.max(nwBox * 0.85, Math.pow(nwRadial, 1.25));
      if (nwMask > 0.001) {
        // Domain-warped ridged multifractal crests
        const warpX = cx + (smoothNoise(cx * 0.16, cz * 0.16, seed + 101) - 0.5) * 2.8;
        const warpZ = cz + (smoothNoise(cx * 0.16, cz * 0.16, seed + 151) - 0.5) * 2.8;
        const ridge = ridgedMultifractal(warpX, warpZ, seed);

        // Downslope alpine erosion gullies incised into mid-slopes
        const gullyNoise = 1.0 - Math.abs(smoothNoise(warpX * 0.34 + cz * 0.08, warpZ * 0.34 - cx * 0.08, seed + 211) * 2.0 - 1.0);
        const gullyCarve = Math.pow(1.0 - gullyNoise, 2.2) * 0.36 * sCurve(0.15, 0.75, nwMask);

        const alpineHeight = Math.pow(nwMask, 1.18) * (1.85 + ridge * 1.65) - gullyCarve;
        h += Math.max(0, alpineHeight);
      }

      // Twin Canyon Buttress Shoulders around (10,16) and (16,10) forming a dramatic Dam Gorge Mouth!
      const swShoulder = Math.hypot((cx - 9.8) * 0.85, (cz - 16.2) * 0.85);
      if (swShoulder < 6.8) {
        const sf = Math.cos((swShoulder / 6.8) * Math.PI * 0.5);
        const sr = ridgedMultifractal(cx * 1.1, cz * 1.1, seed + 303);
        h = Math.max(h, 0.55 + sf * sf * (1.82 + sr * 0.52));
      }
      const neShoulder = Math.hypot((cx - 16.2) * 0.85, (cz - 9.8) * 0.85);
      if (neShoulder < 6.8) {
        const nf = Math.cos((neShoulder / 6.8) * Math.PI * 0.5);
        const nr = ridgedMultifractal(cx * 1.1, cz * 1.1, seed + 337);
        h = Math.max(h, 0.55 + nf * nf * (1.82 + nr * 0.52));
      }

      // --- B. Scenic Stepped Foothills in the East (32..46, 15..28) ---
      // Keep safe buffer from river corridor so river sweeps cleanly past SW bluff
      const riverClearance = sCurve(3.6, 7.2, perp);
      const eastDx = (cx - 39.2) / 8.2;
      const eastDz = (cz - 21.2) / 7.6;
      const eastDist = Math.hypot(eastDx + (n - 0.5) * 0.22, eastDz - (n - 0.5) * 0.18);
      if (eastDist < 1.0 && riverClearance > 0.01) {
        const rawEnv = Math.pow(Math.cos(eastDist * Math.PI * 0.5), 1.35);
        // Quantize into 4 scenic geological terrace benches with crisp cliff risers
        const steps = rawEnv * 3.6;
        const stepBase = Math.floor(steps);
        const stepFrac = steps - stepBase;
        const terraced = (stepBase + sCurve(0.42, 0.88, stepFrac)) / 3.6;
        const crestDetail = ridgedMultifractal(cx * 0.85, cz * 0.85, seed + 419) * 0.24;
        h += (terraced * 1.52 + rawEnv * crestDetail) * riverClearance;
      }

      // --- C. Deep Southeast Sea Bay (x > 38, z > 40) & Clean Coastal Seaport Shelf ---
      // Harbor shelf apron around bay perimeter (x ~ 35..39, z ~ 41..53 and x ~ 40..53, z ~ 37..40)
      const inBayX = sCurve(37.8, 40.6, cx);
      const inBayZ = sCurve(39.4, 42.2, cz);
      const bayMask = inBayX * inBayZ;

      // Radial bay curve rounding the NW corner of the bay while opening wide to SE ocean borders
      const bayCornerDist = Math.hypot(Math.max(0, 44.5 - cx) * 0.92, Math.max(0, 45.5 - cz) * 0.92);
      const bayBasin = bayMask * (1 - sCurve(7.5, 11.5, bayCornerDist) * 0.55);

      // Coastal Harbor Quay Shelf: grades waterfront land just outside bay cleanly to ~0.28m
      const nearBayRim = sCurve(34.5, 38.0, cx) * sCurve(36.5, 40.0, cz) * (1 - bayMask);
      if (nearBayRim > 0.01) {
        h = h * (1 - nearBayRim * 0.82) + 0.28 * (nearBayRim * 0.82);
      }

      if (bayBasin > 0.001) {
        // Dredged navigable harbor depth (-0.62m near quay) sloping to deep sapphire bay (-1.04m)
        const deepProgress = sCurve(40.0, 52.0, (cx + cz) * 0.5);
        const seaFloorTarget = -0.58 - deepProgress * 0.42 + (n - 0.5) * 0.08;
        const shelfDrop = sCurve(0.08, 0.52, bayBasin);
        h = h * (1 - shelfDrop) + seaFloorTarget * shelfDrop;
      }

      // --- D. Carve Winding River Gorge, Upper Reservoir Bowl & Alluvial Channel ---
      if (u >= 2.0 && u <= 51.5) {
        // Upper reservoir bowl (u < 11.5): slightly wider basin; Dam Gorge (u 11.5..15.8): narrow steep V-slot!
        let halfW;
        let bankSpan;
        if (u < 11.2) {
          halfW = 2.35;
          bankSpan = 2.1;
        } else if (u < 16.0) {
          // Pinch tightly at (10,16)-(16,10) canyon mouth (u ~ 13)
          const pinch = Math.sin(Math.min(1, Math.max(0, (u - 11.2) / 4.8)) * Math.PI);
          halfW = 2.25 - pinch * 0.52;
          bankSpan = 1.65;
        } else {
          halfW = 2.55 + Math.max(0, (u - 33) * 0.14);
          bankSpan = 2.5;
        }

        if (perp < halfW + bankSpan) {
          // Smooth downhill thalweg: high NW cascade (+1.06) -> reservoir bowl (+0.50) -> dam gorge (+0.30) -> SE Bay (-0.76)
          let bedTarget;
          if (u < 8.5) {
            bedTarget = 1.12 - ((u - 2.0) / 6.5) * 0.60;
          } else if (u < 16.0) {
            bedTarget = 0.52 - ((u - 8.5) / 7.5) * 0.22;
          } else if (u < 38.0) {
            bedTarget = 0.30 - ((u - 16.0) / 22.0) * 0.32;
          } else {
            bedTarget = -0.02 - ((u - 38.0) / 13.5) * 0.74;
          }

          // Concave parabolic riverbed cross-section so depths feather naturally to banks
          const crossProfile = perp < halfW
            ? (1.0 - Math.pow(perp / halfW, 2) * 0.14)
            : 0.86 * Math.pow(1 - (perp - halfW) / bankSpan, 2);
          const channelBed = bedTarget - (perp < halfW ? (1 - Math.pow(perp / halfW, 2)) * 0.08 : 0);
          const carveT = perp < halfW
            ? 1.0
            : sCurve(halfW + bankSpan, halfW, perp);
          h = h * (1 - carveT) + channelBed * carveT + (1 - crossProfile) * 0.02 * (1 - carveT);
        }
      }

      // --- E. Level Airport Plateau around (12..18, 26..30) ---
      // Corners cx in 12..19, cz in 26..31 strictly flat at 0.40, with smooth 3-tile apron
      const apFactorX = sCurve(9.0, 12.0, cx) * (1 - sCurve(19.0, 22.0, cx));
      const apFactorZ = sCurve(23.0, 26.0, cz) * (1 - sCurve(31.0, 34.0, cz));
      const apBlend = apFactorX * apFactorZ;
      if (apBlend > 0.001) {
        h = h * (1 - apBlend) + 0.40 * apBlend;
      }

      // --- F. South Border Portals: Highway (x=22, z=55..52) & HSR (x=8, z=55..52) flat at 0.36 ---
      const southFactor = sCurve(GRID_SIZE - 7.5, GRID_SIZE - 5.0, cz);
      if (southFactor > 0.001) {
        const hwDist = Math.abs(cx - 22);
        const hsrDist = Math.abs(cx - 8);
        const portalDist = Math.min(hwDist, hsrDist);
        if (portalDist <= 5.5) {
          const pBlend = southFactor * (portalDist <= 3.0 ? 1.0 : 1.0 - sCurve(3.0, 5.5, portalDist));
          h = h * (1 - pBlend) + 0.36 * pBlend;
        }
      }

      corners[cIdx(cx, cz)] = Math.max(-1.15, Math.min(3.5, h));
    }
  }

  // 2. Initialize Tiles, Initial River/Sea Water, Springs & Forest Biomes
  for (let z = 0; z < GRID_SIZE; z++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t = createEmptyTile(x, z);
      const c00 = corners[cIdx(x, z)];
      const c10 = corners[cIdx(x + 1, z)];
      const c01 = corners[cIdx(x, z + 1)];
      const c11 = corners[cIdx(x + 1, z + 1)];
      const avgH = (c00 + c10 + c01 + c11) * 0.25;
      const maxDiff = Math.max(c00, c10, c01, c11) - Math.min(c00, c10, c01, c11);

      const { perp, u } = riverSpineDist(x + 0.5, z + 0.5, seed);

      // Fill Sea Bay below SEA_LEVEL + initial river channel water so river flows immediately at t=0
      let w = 0;
      if (avgH < SEA_LEVEL) {
        w = SEA_LEVEL - avgH;
      }
      const riverHalfW = u < 11.2 ? 2.25 : (u < 16.0 ? 1.85 : 2.35);
      if (u >= 2.5 && u <= 49.5 && perp < riverHalfW) {
        w = Math.max(w, u < 12.0 ? 0.34 : 0.28);
      }
      waterDepth[idx(x, z)] = w;

      // Mountain river headwater springs in NW canyon (u = 3..5.5)
      if (u >= 3.0 && u <= 5.5 && perp < 1.65) {
        t.waterSpring = 0.54;
      }

      // Natural forest clusters on dry non-cliff land (keeping Airport meadow & Harbor quay clear)
      const inAirportZone = x >= 11 && x <= 19 && z >= 25 && z <= 31;
      const inHarborQuay = x >= 36 && x <= 52 && z >= 38 && z <= 52 && avgH < 0.33;
      if (w < 0.02 && avgH > 0.16 && avgH < 2.22 && maxDiff < 0.68 && !inAirportZone && !inHarborQuay) {
        const fn = smoothNoise(x * 0.19, z * 0.19, seed + 91);
        const r = hash2D(x, z, seed + 17);
        // Richer conifer stands on NW lower slopes & East foothill benches
        const mountainBoost = (x < 24 && z < 24) || (x >= 32 && x <= 46 && z >= 15 && z <= 28) ? 0.08 : 0;
        if (fn + mountainBoost > 0.53 && r > 0.26) t.trees = r > 0.70 ? 3 : 2;
        else if (fn + mountainBoost > 0.41 && r > 0.62) t.trees = 1;
      }

      grid[idx(x, z)] = t;
    }
  }

  // 3. Outside Connections at South Border:
  //    - Intercity 4-Lane Highway at x = 22, z = 55..52
  //    - Intercity High-Speed Rail Twin Mainline at x = 8, z = 55..52
  for (let z = GRID_SIZE - 1; z >= GRID_SIZE - 4; z--) {
    const hw = grid[idx(22, z)];
    hw.trees = 0;
    hw.roadGround = z === GRID_SIZE - 1 ? 3 : 2;

    const hsr = grid[idx(8, z)];
    hsr.trees = 0;
    hsr.rail = z === GRID_SIZE - 1 ? 2 : 1;
  }

  return { corners, grid, waterDepth, waterPoll };
}
