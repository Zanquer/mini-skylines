import { GRID_SIZE, HALF_GRID, CORNER_STRIDE, inBounds, idx, cIdx, tileToWorld, hash2D } from './mapgen.js';
import { GLB_ASSETS, SMOKE_PNG_URI } from './assets_bundle.js';
import {
  createTerrainDetailTexture,
  buildHighResTerrainMesh,
  buildContinuousRoadAndViaductGroup,
  createPhysicalWaterMaterial,
  updatePhysicalWaterUniforms,
  buildSmoothWaterMesh
} from './terrain_water_shader.js';
import { ArchitectureLibrary } from './architecture3d.js';

const THREE = globalThis.THREE;

function b64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// Lightweight dependency-free BufferGeometry merger (positions + normals + uvs)
function mergeGeometriesSimple(geos) {
  const nonIndexed = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let totalVerts = 0;
  for (const g of nonIndexed) totalVerts += g.attributes.position.count;

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);

  let vOff = 0;
  for (const g of nonIndexed) {
    const pos = g.attributes.position;
    if (!g.attributes.normal) g.computeVertexNormals();
    const norm = g.attributes.normal;
    const uv = g.attributes.uv;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const i3 = (vOff + i) * 3;
      positions[i3] = pos.getX(i);
      positions[i3 + 1] = pos.getY(i);
      positions[i3 + 2] = pos.getZ(i);
      normals[i3] = norm.getX(i);
      normals[i3 + 1] = norm.getY(i);
      normals[i3 + 2] = norm.getZ(i);
      const i2 = (vOff + i) * 2;
      if (uv) {
        uvs[i2] = uv.getX(i);
        uvs[i2 + 1] = uv.getY(i);
      }
    }
    vOff += count;
    if (g !== geos[nonIndexed.indexOf(g)]) g.dispose();
  }
  for (const g of geos) g.dispose();

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return merged;
}

function makeRoadTexture(lanes = 2, isHub = false) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  if (!g) return null;

  g.fillStyle = '#9aa2ad';
  g.fillRect(0, 0, 256, 256);

  if (isHub) {
    g.fillStyle = '#282c34';
    g.fillRect(22, 0, 212, 256);
    g.fillRect(0, 22, 256, 212);

    g.fillStyle = '#9aa2ad';
    for (const [cx, cy] of [[0, 0], [256, 0], [0, 256], [256, 256]]) {
      g.beginPath();
      g.arc(cx, cy, 26, 0, Math.PI * 2);
      g.fill();
    }

    g.fillStyle = 'rgba(238, 242, 248, 0.86)';
    for (let i = 44; i <= 204; i += 24) {
      g.fillRect(i, 10, 12, 22);
      g.fillRect(i, 224, 12, 22);
      g.fillRect(10, i, 22, 12);
      g.fillRect(224, i, 22, 12);
    }
  } else {
    const curb = lanes >= 4 ? 18 : 28;
    g.fillStyle = '#6c737d';
    g.fillRect(curb - 4, 0, 256 - (curb - 4) * 2, 256);
    g.fillStyle = '#262a32';
    g.fillRect(curb, 0, 256 - curb * 2, 256);

    if (lanes >= 4) {
      g.fillStyle = '#f5b82e';
      g.fillRect(124, 0, 3, 256);
      g.fillRect(129, 0, 3, 256);
      g.fillStyle = '#e5e9f0';
      for (let y = 12; y < 256; y += 42) {
        g.fillRect(74, y, 4, 22);
        g.fillRect(178, y, 4, 22);
      }
    } else {
      g.fillStyle = '#dce2ec';
      for (let y = 14; y < 256; y += 44) {
        g.fillRect(126, y, 4, 22);
      }
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function makeGlowHaloTexture() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');
  if (!g) return null;
  const grad = g.createRadialGradient(64, 64, 2, 64, 64, 62);
  grad.addColorStop(0.0, 'rgba(255,255,255,1.0)');
  grad.addColorStop(0.22, 'rgba(255,248,225,0.72)');
  grad.addColorStop(0.52, 'rgba(255,224,160,0.22)');
  grad.addColorStop(1.0, 'rgba(255,200,120,0.0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class CityRenderer3D {
  constructor(canvas, sim, traffic, disasters, waterPhysics) {
    this.canvas = canvas;
    this.sim = sim;
    this.traffic = traffic;
    this.disasters = disasters;
    this.waterPhysics = waterPhysics;

    this.qualityMode = 'high';
    this._maxGlowSprites = 56;
    this._maxRenderedVehicles = 160;
    this._loadedPBRTexMap = null;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.skyColor = new THREE.Color(0x74b6f2);
    this.scene.background = this.skyColor;
    this.fog = new THREE.FogExp2(0x74b6f2, 0.0072);
    this.scene.fog = this.fog;

    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / Math.max(1, window.innerHeight), 0.4, 260);

    this.hemiLight = new THREE.HemisphereLight(0xdff0ff, 0x546a4b, 0.88);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.92);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 115;
    const d = 29;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.024;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    this.camTarget = [-4, 0.35, 16];
    this.camYaw = 0.58;
    this.camPitch = 0.66;
    this.camDist = 22.0;

    this.overlayMode = 'none';
    this.lastOverlayMode = 'none';
    this.previewTiles = [];
    this.previewColor = [0.22, 0.85, 1.0];
    this.servicePreviewTiles = [];
    this.selectedTile = null;
    this.selectedVehicle = null;
    this._maxPedestrians = 240;

    // 4-Layer Independent Static Groups inside staticGroup (zero unnecessary terrain/forest rebuilds!)
    this.staticGroup = new THREE.Group();
    this.terrainGroup = new THREE.Group();
    this.infraGroup = new THREE.Group();
    this.forestGroup = new THREE.Group();
    this.buildingGroup = new THREE.Group();
    this.staticGroup.add(this.terrainGroup, this.infraGroup, this.forestGroup, this.buildingGroup);

    this.waterGroup = new THREE.Group();
    this.vehicleGroup = new THREE.Group();
    this.uiOverlayGroup = new THREE.Group();
    this.scene.add(this.staticGroup, this.waterGroup, this.vehicleGroup, this.uiOverlayGroup);

    this.rebuildStats = { terrain: 0, infra: 0, forest: 0, building: 0 };

    this._initSharedAssets();

    this.glbProtos = {};
    this.archLib = new ArchitectureLibrary(THREE, this.glbProtos, this.mats);

    this.skyDome = this.archLib.createSkyDome();
    this.scene.add(this.skyDome.mesh);

    // X-ray occlusion fading
    this.xrayMode = 'auto';
    this.buildingEntries = [];
    this._ghostMatCache = new Map();
    this._xrayAccum = 99;
    this._tmpBox = new THREE.Box3();
    this._tmpMat4 = new THREE.Matrix4();
    this._tmpPos = new THREE.Vector3();
    this._tmpQuat = new THREE.Quaternion();
    this._tmpScale = new THREE.Vector3();
    this._tmpEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._tmpColor = new THREE.Color();

    // Street furniture live instances
    this._lampPositions = [];
    this._signalEntries = [];
    this._signalRedInst = null;
    this._signalGreenInst = null;
    this._signalSyncAccum = 99;

    // Image-based lighting so glass curtain walls & metal pick up sky reflections
    this._initEnvironmentLighting();

    // Zero-Leak Reusable Object Pools (NEVER allocate materials/meshes inside render loop!)
    this.vehiclePool = [];
    this.trainCarPool = [];
    this.airlinerPool = [];
    this.shipPool = [];

    this.smokePool = [];
    this.firePool = [];
    this.sprayPool = [];
    this.glowPool = [];
    this.previewMeshPool = [];
    this.scaffoldPool = [];
    this.meteorPool = [];
    this.damWarnPool = [];
    this.tornadoRings = [];
    this._initPersistentOverlayMeshes();

    this._loadEmbeddedGLBs();

    this.animHooks = {
      windRotors: [],
      ferrisWheels: [],
      radarDishes: [],
      smokeSources: [],
      beacons: []
    };

    this.waterMesh = null;
    this.waterRebuildAccum = 99;
    this.clock = 0;

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', () => this.resize());
    }
  }

  _initSharedAssets() {
    this.texRoad2 = makeRoadTexture(2, false);
    this.texRoad4 = makeRoadTexture(4, false);
    this.texRoadHub = makeRoadTexture(2, true);
    this.terrainDetailTex = createTerrainDetailTexture(THREE);
    this.physicalWaterMat = createPhysicalWaterMaterial(THREE);
    this.glowTex = makeGlowHaloTexture();

    this.mats = {
      terrain: new THREE.MeshStandardMaterial({ vertexColors: true, map: this.terrainDetailTex || null, roughness: 0.88, metalness: 0.02 }),
      road2: new THREE.MeshStandardMaterial({ map: this.texRoad2, roughness: 0.84, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
      road4: new THREE.MeshStandardMaterial({ map: this.texRoad4, roughness: 0.82, metalness: 0.06, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
      roadHub: new THREE.MeshStandardMaterial({ map: this.texRoadHub, roughness: 0.84, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
      viaductDeck: new THREE.MeshStandardMaterial({ color: 0x353a42, roughness: 0.78 }),
      concrete: new THREE.MeshStandardMaterial({ color: 0xb8c0ca, roughness: 0.74 }),
      darkConcrete: new THREE.MeshStandardMaterial({ color: 0x767e8a, roughness: 0.84 }),
      whiteSteel: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.32, metalness: 0.38 }),
      steelLattice: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.42, metalness: 0.62 }),
      cable: new THREE.MeshStandardMaterial({ color: 0x2b313a, roughness: 0.5 }),
      powerGlow: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      pipeOk: new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
      pipeBroken: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      metroGlow: new THREE.MeshBasicMaterial({ color: 0xd946ef }),
      abandoned: new THREE.MeshStandardMaterial({ color: 0x828890, roughness: 0.90 }),
      roofGarden: new THREE.MeshStandardMaterial({ color: 0x3b8a47, roughness: 0.84 }),
      industrial: new THREE.MeshStandardMaterial({ color: 0xa8927d, roughness: 0.72, metalness: 0.25 }),
      cleanTech: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.30, metalness: 0.42 }),
      redCross: new THREE.MeshBasicMaterial({ color: 0xf43f5e }),
      goldGlow: new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
      cyanGlow: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      meteorGlow: new THREE.MeshBasicMaterial({ color: 0xff7b1c }),
      previewMat: new THREE.MeshBasicMaterial({ color: 0x38d9ff, transparent: true, opacity: 0.62 }),
      servicePreviewMat: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.46, depthWrite: false }),
      pedBodyMat: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0.05 }),
      pedHeadMat: new THREE.MeshStandardMaterial({ color: 0xf1c29b, roughness: 0.78 }),
      bulletBody: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.20, metalness: 0.28 }),
      bulletStripe: new THREE.MeshStandardMaterial({ color: 0x1d6feb, roughness: 0.25, metalness: 0.4, emissive: 0x0b3b8c, emissiveIntensity: 0.32 }),
      garbageGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45 }),
      // Cached Zone Pad materials (eliminates per-tile MeshStandardMaterial leaks!)
      zonePads: {
        RL: new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.85, transparent: true, opacity: 0.55 }),
        RH: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.85, transparent: true, opacity: 0.55 }),
        CL: new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.85, transparent: true, opacity: 0.55 }),
        CH: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.85, transparent: true, opacity: 0.55 }),
        I:  new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.85, transparent: true, opacity: 0.55 }),
        O:  new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.85, transparent: true, opacity: 0.55 }),
        default: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85, transparent: true, opacity: 0.55 })
      },
      // Botanical Instanced Forest Materials (per-instance color via setColorAt)
      bark: new THREE.MeshStandardMaterial({ color: 0x5c4028, roughness: 0.90 }),
      palmBark: new THREE.MeshStandardMaterial({ color: 0x7a6246, roughness: 0.88 }),
      pineInst: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.84, metalness: 0.02 }),
      leafInst: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0.02 }),
      palmInst: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.76, metalness: 0.04 }),
      // Street Furniture Materials
      lampMetal: new THREE.MeshStandardMaterial({ color: 0x8f9aa8, roughness: 0.38, metalness: 0.65 }),
      lampEmissive: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.25,
        emissive: 0xffd58a,
        emissiveIntensity: 0.12
      }),
      signalBody: new THREE.MeshStandardMaterial({ color: 0x2b323c, roughness: 0.50, metalness: 0.55 }),
      signalLens: new THREE.MeshBasicMaterial({ color: 0xffffff })
    };

    if (typeof Image !== 'undefined' && SMOKE_PNG_URI) {
      const smokeImg = new Image();
      smokeImg.src = SMOKE_PNG_URI;
      this.smokeTex = new THREE.Texture(smokeImg);
      this.smokeTex.colorSpace = THREE.SRGBColorSpace;
      smokeImg.onload = () => { this.smokeTex.needsUpdate = true; };
    } else {
      this.smokeTex = this.glowTex;
    }

    // Build reusable & pre-merged botanical/street-furniture BufferGeometries ONCE
    this.geos = {
      unitBox: new THREE.BoxGeometry(1, 1, 1),
      taperSpire: new THREE.CylinderGeometry(0.18, 0.42, 1, 8),
      pierCyl: new THREE.CylinderGeometry(0.08, 0.10, 1, 12),
      waterSphere: new THREE.SphereGeometry(0.28, 18, 14),
      cylTower: new THREE.CylinderGeometry(0.35, 0.36, 1, 18),
      bulletCoach: new THREE.CapsuleGeometry(0.105, 0.44, 8, 14),
      pineTrunk: this._makePineTrunkGeo(),
      pineCrown: this._makePineCrownGeo(),
      leafTrunk: this._makeLeafTrunkGeo(),
      leafCrown: this._makeLeafCrownGeo(),
      palmTrunk: this._makePalmTrunkGeo(),
      palmCrown: this._makePalmCrownGeo(),
      lampPole: this._makeLampPoleGeo(),
      lampBulb: this._makeLampBulbGeo(),
      signalPole: this._makeSignalPoleGeo(),
      signalLens: new THREE.SphereGeometry(0.026, 6, 5),
      pedBody: new THREE.CylinderGeometry(0.017, 0.020, 0.068, 6),
      pedHead: new THREE.SphereGeometry(0.016, 6, 5)
    };
    this.geos.bulletCoach.rotateX(Math.PI * 0.5);
  }

  _makePineTrunkGeo() {
    const g = new THREE.CylinderGeometry(0.020, 0.040, 0.22, 6);
    g.translate(0, 0.10, 0);
    return g;
  }

  _makePineCrownGeo() {
    const c1 = new THREE.ConeGeometry(0.175, 0.26, 7);
    c1.translate(0, 0.22, 0);
    const c2 = new THREE.ConeGeometry(0.135, 0.25, 7);
    c2.rotateY(0.45);
    c2.translate(0.008, 0.36, -0.006);
    const c3 = new THREE.ConeGeometry(0.088, 0.22, 7);
    c3.rotateY(0.92);
    c3.translate(-0.005, 0.49, 0.005);
    return mergeGeometriesSimple([c1, c2, c3]);
  }

  _makeLeafTrunkGeo() {
    const g = new THREE.CylinderGeometry(0.024, 0.044, 0.23, 6);
    g.translate(0, 0.11, 0);
    return g;
  }

  _makeLeafCrownGeo() {
    // 4-cluster asymmetric broadleaf canopy (Sycamore / Ginkgo / Camphor)
    const a = new THREE.DodecahedronGeometry(0.132, 1);
    a.scale(1.12, 0.88, 1.05);
    a.translate(0, 0.32, 0);
    const b = new THREE.DodecahedronGeometry(0.102, 1);
    b.scale(1.06, 0.82, 0.94);
    b.translate(-0.09, 0.26, 0.04);
    const c = new THREE.DodecahedronGeometry(0.098, 1);
    c.scale(0.95, 0.86, 1.08);
    c.translate(0.088, 0.28, -0.045);
    const d = new THREE.DodecahedronGeometry(0.085, 1);
    d.scale(1.05, 0.84, 1.0);
    d.translate(0.015, 0.38, 0.068);
    return mergeGeometriesSimple([a, b, c, d]);
  }

  _makePalmTrunkGeo() {
    const s1 = new THREE.CylinderGeometry(0.025, 0.036, 0.17, 6);
    s1.rotateZ(-0.08);
    s1.translate(0.008, 0.08, 0);
    const s2 = new THREE.CylinderGeometry(0.021, 0.025, 0.17, 6);
    s2.rotateZ(-0.15);
    s2.translate(0.026, 0.24, 0);
    const s3 = new THREE.CylinderGeometry(0.017, 0.021, 0.16, 6);
    s3.rotateZ(-0.20);
    s3.translate(0.052, 0.39, 0);
    return mergeGeometriesSimple([s1, s2, s3]);
  }

  _makePalmCrownGeo() {
    const fronds = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2;
      const f1 = new THREE.BoxGeometry(0.045, 0.014, 0.17);
      f1.rotateX(0.22);
      f1.translate(0, 0.01, 0.08);
      f1.rotateY(ang);
      f1.translate(0.065, 0.46, 0);
      const f2 = new THREE.BoxGeometry(0.032, 0.012, 0.13);
      f2.rotateX(0.58);
      f2.translate(0, -0.028, 0.19);
      f2.rotateY(ang);
      f2.translate(0.065, 0.46, 0);
      fronds.push(f1, f2);
    }
    return mergeGeometriesSimple(fronds);
  }

  _makeLampPoleGeo() {
    const post = new THREE.CylinderGeometry(0.011, 0.017, 0.52, 6);
    post.translate(0, 0.26, 0);
    const arm = new THREE.BoxGeometry(0.018, 0.018, 0.19);
    arm.rotateX(-0.14);
    arm.translate(0, 0.525, 0.09);
    const head = new THREE.BoxGeometry(0.052, 0.016, 0.085);
    head.translate(0, 0.535, 0.175);
    return mergeGeometriesSimple([post, arm, head]);
  }

  _makeLampBulbGeo() {
    const g = new THREE.BoxGeometry(0.046, 0.012, 0.072);
    g.translate(0, 0.523, 0.175);
    return g;
  }

  _makeSignalPoleGeo() {
    const post = new THREE.CylinderGeometry(0.015, 0.021, 0.50, 6);
    post.translate(0, 0.25, 0);
    // Cantilever mast arm extends along -X so yaw=0 (NE corner) spans across NS lane and yaw=-PI/2 (SW corner) spans across EW lane!
    const arm = new THREE.BoxGeometry(0.30, 0.020, 0.020);
    arm.translate(-0.15, 0.48, 0);
    const box = new THREE.BoxGeometry(0.052, 0.125, 0.056);
    box.translate(-0.24, 0.47, 0);
    return mergeGeometriesSimple([post, arm, box]);
  }

  _initPersistentOverlayMeshes() {
    this.selectedTileMesh = new THREE.Mesh(this.geos.unitBox, this.mats.cyanGlow);
    this.selectedTileMesh.scale.set(0.98, 0.04, 0.98);
    this.selectedTileMesh.visible = false;
    this.uiOverlayGroup.add(this.selectedTileMesh);

    this.selectedVehicleHalo = new THREE.Mesh(this.geos.cylTower, this.mats.goldGlow);
    this.selectedVehicleHalo.visible = false;
    this.uiOverlayGroup.add(this.selectedVehicleHalo);

    for (let r = 0; r < 12; r++) {
      const ring = new THREE.Mesh(this.geos.cylTower, this.mats.darkConcrete);
      ring.visible = false;
      this.uiOverlayGroup.add(ring);
      this.tornadoRings.push(ring);
    }

    // Pre-warm fixed VFX & overlay pools once at startup -> ZERO Material allocations during render() even in disasters!
    this._poolCaps = { glow: 56, fire: 64, smoke: 96, spray: 48, damWarn: 16, preview: 64, scaffold: 32, meteor: 8 };
    for (let i = 0; i < this._poolCaps.glow; i++) this._acquirePoolSprite(this.glowPool, i, { map: this.glowTex, additive: true });
    for (let i = 0; i < this._poolCaps.fire; i++) this._acquirePoolSprite(this.firePool, i, { map: this.smokeTex });
    for (let i = 0; i < this._poolCaps.smoke; i++) this._acquirePoolSprite(this.smokePool, i, { map: this.smokeTex });
    for (let i = 0; i < this._poolCaps.spray; i++) this._acquirePoolSprite(this.sprayPool, i, { map: this.smokeTex });
    for (let i = 0; i < this._poolCaps.damWarn; i++) this._acquirePoolMesh(this.damWarnPool, i, this.geos.waterSphere, this.mats.redCross);
    for (let i = 0; i < this._poolCaps.preview; i++) this._acquirePoolMesh(this.previewMeshPool, i, this.geos.unitBox, this.mats.previewMat);
    for (let i = 0; i < this._poolCaps.scaffold; i++) this._acquirePoolMesh(this.scaffoldPool, i, this.geos.unitBox, this.mats.goldGlow);
    for (let i = 0; i < this._poolCaps.meteor; i++) this._acquirePoolMesh(this.meteorPool, i, this.geos.waterSphere, this.mats.meteorGlow);

    // 1-Draw-Call Instanced Pre-Build Road-Connected Service Coverage Preview (up to 320 tiles, ZERO per-frame allocs!)
    this._servicePreviewCap = 320;
    this.servicePreviewInst = new THREE.InstancedMesh(this.geos.unitBox, this.mats.servicePreviewMat, this._servicePreviewCap);
    this.servicePreviewInst.count = 0;
    this.servicePreviewInst.visible = false;
    this.servicePreviewInst.frustumCulled = false;
    this.uiOverlayGroup.add(this.servicePreviewInst);

    // 2-Draw-Call Instanced Sidewalk Pedestrians (up to 240 citizens strolling sidewalks, ZERO per-frame allocs!)
    this._pedCap = 240;
    this.pedBodyInst = new THREE.InstancedMesh(this.geos.pedBody, this.mats.pedBodyMat, this._pedCap);
    this.pedHeadInst = new THREE.InstancedMesh(this.geos.pedHead, this.mats.pedHeadMat, this._pedCap);
    this.pedBodyInst.count = 0;
    this.pedHeadInst.count = 0;
    this.pedBodyInst.visible = false;
    this.pedHeadInst.visible = false;
    this.pedBodyInst.frustumCulled = false;
    this.pedHeadInst.frustumCulled = false;
    const pedOutfitPalette = [0x1d4ed8, 0xe11d48, 0x0f766e, 0xd97706, 0xf8fafc, 0x334155, 0x7c3aed, 0x0284c7];
    const tmpC = new THREE.Color();
    for (let i = 0; i < this._pedCap; i++) {
      tmpC.setHex(pedOutfitPalette[i % pedOutfitPalette.length]);
      this.pedBodyInst.setColorAt(i, tmpC);
    }
    if (this.pedBodyInst.instanceColor) this.pedBodyInst.instanceColor.needsUpdate = true;
    this.vehicleGroup.add(this.pedBodyInst, this.pedHeadInst);
  }

  _acquirePoolSprite(pool, index, { map, additive = false } = {}) {
    while (pool.length <= index) {
      const mat = new THREE.SpriteMaterial({
        map: map || this.smokeTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
      });
      const sp = new THREE.Sprite(mat);
      sp.visible = false;
      this.uiOverlayGroup.add(sp);
      pool.push(sp);
    }
    return pool[index];
  }

  _acquirePoolMesh(pool, index, geo, mat) {
    while (pool.length <= index) {
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      this.uiOverlayGroup.add(m);
      pool.push(m);
    }
    return pool[index];
  }

  _hidePoolFrom(pool, startIdx) {
    for (let i = startIdx; i < pool.length; i++) {
      pool[i].visible = false;
    }
  }

  // ==================== Graphics Tier & External PBR Textures ====================
  setQualityMode(mode = 'high') {
    const valid = mode === 'high' || mode === 'medium' || mode === 'eco' ? mode : 'high';
    this.qualityMode = valid;
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

    if (valid === 'high') {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(2048, 2048);
      this._maxGlowSprites = 56;
      this._maxRenderedVehicles = 160;
      this._maxPedestrians = 240;
    } else if (valid === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(1024, 1024);
      this._maxGlowSprites = 24;
      this._maxRenderedVehicles = 80;
      this._maxPedestrians = 120;
    } else {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.sunLight.castShadow = false;
      this._maxGlowSprites = 0;
      this._maxRenderedVehicles = 45;
      this._maxPedestrians = 0;
    }

    if (this.sunLight.shadow && this.sunLight.shadow.map) {
      this.sunLight.shadow.map.dispose();
      this.sunLight.shadow.map = null;
    }
    if (this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }

    // Re-apply PBR maps if loaded (eco skips normal/roughness to slash fragment bandwidth)
    if (this._loadedPBRTexMap) {
      this.applyExternalPBRTextures(this._loadedPBRTexMap);
    }
    this.resize();
  }

  applyExternalPBRTextures(texMap) {
    if (!texMap || typeof texMap !== 'object') return;
    this._loadedPBRTexMap = texMap;
    const usePbrMaps = this.qualityMode !== 'eco';

    const bindRoadMat = (mat, entry) => {
      if (!mat || !entry) return;
      if (entry.map) mat.map = entry.map;
      mat.normalMap = usePbrMaps && entry.normalMap ? entry.normalMap : null;
      if (mat.normalScale) mat.normalScale.set(0.85, 0.85);
      mat.roughnessMap = usePbrMaps && entry.roughnessMap ? entry.roughnessMap : null;
      mat.roughness = mat.roughnessMap ? 1.0 : 0.82;
      mat.needsUpdate = true;
    };

    bindRoadMat(this.mats.road2, texMap.road_2lane);
    bindRoadMat(this.mats.road4, texMap.road_4lane);
    bindRoadMat(this.mats.roadHub, texMap.road_hub);

    if (this.archLib && typeof this.archLib.applyLoadedPBRTextures === 'function') {
      const filtered = {};
      for (const [k, v] of Object.entries(texMap)) {
        const packed = usePbrMaps ? v : { map: v.map, normalMap: null, roughnessMap: null };
        filtered[k] = packed;
        if (k.startsWith('facade_')) {
          filtered[k.slice('facade_'.length)] = packed;
        }
      }
      this.archLib.applyLoadedPBRTextures(filtered);
    }
  }

  _loadEmbeddedGLBs() {
    if (!THREE.GLTFLoader || !GLB_ASSETS) return;
    const keys = Object.keys(GLB_ASSETS);
    if (keys.length === 0) return;
    const loader = new THREE.GLTFLoader();
    let loaded = 0;

    keys.forEach((key) => {
      try {
        const buf = b64ToArrayBuffer(GLB_ASSETS[key]);
        loader.parse(
          buf,
          '',
          (gltf) => {
            const root = gltf.scene;
            root.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.roughness = 0.65;
                  child.material.metalness = 0.08;
                  if (child.material.map) {
                    child.material.map.colorSpace = THREE.SRGBColorSpace;
                    child.material.map.anisotropy = 4;
                  }
                }
              }
            });
            this.glbProtos[key] = root;
            loaded++;
            if (loaded === keys.length) {
              this.sim.buildingDirty = true;
            }
          },
          () => {}
        );
      } catch {}
    });
  }

  _clearVehiclePool() {
    for (const item of this.vehiclePool) this.vehicleGroup.remove(item.obj);
    this.vehiclePool.length = 0;
  }

  resize() {
    const w = Math.max(1, (typeof window !== 'undefined' && window.innerWidth) || 800);
    const h = Math.max(1, (typeof window !== 'undefined' && window.innerHeight) || 600);
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const cap = this.qualityMode === 'eco' ? 1 : (this.qualityMode === 'medium' ? 1.5 : 2);
    this.renderer.setPixelRatio(Math.min(dpr, cap));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  updateCameraMatrices() {
    this.camPitch = Math.max(0.22, Math.min(1.38, this.camPitch));
    this.camDist = Math.max(4.6, Math.min(64.0, this.camDist));
    this.camTarget[0] = Math.max(-HALF_GRID + 1, Math.min(HALF_GRID - 1, this.camTarget[0]));
    this.camTarget[2] = Math.max(-HALF_GRID + 1, Math.min(HALF_GRID - 1, this.camTarget[2]));

    const tx = Math.floor(this.camTarget[0] + HALF_GRID);
    const tz = Math.floor(this.camTarget[2] + HALF_GRID);
    const gElev = inBounds(tx, tz) ? Math.max(0, this.sim.getTileElev(tx, tz)) : 0.3;
    this.camTarget[1] = this.camTarget[1] * 0.85 + gElev * 0.15;

    let shakeX = 0, shakeY = 0;
    if (this.disasters && this.disasters.shakeTime > 0) {
      const a = this.disasters.shakeAmp * Math.min(1, this.disasters.shakeTime);
      shakeX = (Math.random() - 0.5) * a;
      shakeY = (Math.random() - 0.5) * a;
    }

    const horiz = Math.cos(this.camPitch) * this.camDist;
    const vert = Math.sin(this.camPitch) * this.camDist;
    this.camera.position.set(
      this.camTarget[0] + Math.sin(this.camYaw) * horiz + shakeX,
      this.camTarget[1] + vert + shakeY,
      this.camTarget[2] + Math.cos(this.camYaw) * horiz
    );
    this.camera.lookAt(this.camTarget[0], this.camTarget[1], this.camTarget[2]);
    this.camera.updateMatrixWorld();

    if (this.skyDome) {
      this.skyDome.mesh.position.copy(this.camera.position);
    }
  }

  screenToGround(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, this.camera);
    const orig = raycaster.ray.origin;
    const dir = raycaster.ray.direction;
    if (Math.abs(dir.y) < 1e-5) return null;

    const tTop = Math.max(0, (3.8 - orig.y) / dir.y);
    const tBot = (-1.2 - orig.y) / dir.y;
    if (tBot < 0) return null;

    const steps = 48;
    for (let s = 0; s <= steps; s++) {
      const t = tTop + ((tBot - tTop) * s) / steps;
      const wx = orig.x + dir.x * t;
      const wy = orig.y + dir.y * t;
      const wz = orig.z + dir.z * t;
      const tx = Math.floor(wx + HALF_GRID);
      const tz = Math.floor(wz + HALF_GRID);
      if (inBounds(tx, tz)) {
        const gh = this.sim.getTileElev(tx, tz);
        const surf = Math.max(gh, gh + this.sim.waterDepth[idx(tx, tz)] * 0.5);
        if (wy <= surf) return { wx, wz, tx, tz, valid: true };
      }
    }

    const t0 = (0.3 - orig.y) / dir.y;
    const wx = orig.x + dir.x * t0;
    const wz = orig.z + dir.z * t0;
    const tx = Math.floor(wx + HALF_GRID);
    const tz = Math.floor(wz + HALF_GRID);
    return { wx, wz, tx, tz, valid: inBounds(tx, tz) };
  }

  _sampleExactSlopeHeight(wx, wz) {
    const gx = Math.max(0, Math.min(GRID_SIZE - 0.001, wx + HALF_GRID));
    const gz = Math.max(0, Math.min(GRID_SIZE - 0.001, wz + HALF_GRID));
    const ix = Math.floor(gx);
    const iz = Math.floor(gz);
    const fx = gx - ix;
    const fz = gz - iz;
    const c = this.sim.corners;
    const h00 = c[cIdx(ix, iz)];
    const h10 = c[cIdx(ix + 1, iz)];
    const h01 = c[cIdx(ix, iz + 1)];
    const h11 = c[cIdx(ix + 1, iz + 1)];
    return (h00 * (1 - fx) + h10 * fx) * (1 - fz) + (h01 * (1 - fx) + h11 * fx) * fz;
  }

  _disposeGroup(grp) {
    while (grp.children.length > 0) {
      const ch = grp.children.pop();
      ch.traverse((node) => {
        if (node.isInstancedMesh && typeof node.dispose === 'function') {
          node.dispose();
        }
        if (node.userData && node.userData.ownGeo && node.geometry) {
          node.geometry.dispose();
        }
        if (node.userData && node.userData.ownMat && node.material) {
          if (Array.isArray(node.material)) node.material.forEach((m) => m && m.dispose && m.dispose());
          else if (node.material.dispose) node.material.dispose();
        }
      });
    }
  }

  // ==================== 4-Layer Independent Static Mesh Rebuilders ====================
  _addBoxTo(targetGroup, x, cy, z, sx, sy, sz, mat, shadow = true) {
    const m = new THREE.Mesh(this.geos.unitBox, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, cy, z);
    m.castShadow = shadow && this.qualityMode !== 'eco';
    m.receiveShadow = true;
    targetGroup.add(m);
    return m;
  }

  rebuildTerrainGroup() {
    this._disposeGroup(this.terrainGroup);
    const terMesh = buildHighResTerrainMesh(THREE, this.sim, this.overlayMode, this.terrainDetailTex, this.mats.terrain);
    this.terrainGroup.add(terMesh);

    const baseSkirt = new THREE.Mesh(this.geos.unitBox, this.mats.darkConcrete);
    baseSkirt.scale.set(GRID_SIZE + 0.25, 1.85, GRID_SIZE + 0.25);
    baseSkirt.position.set(0, -1.75, 0);
    baseSkirt.receiveShadow = true;
    this.terrainGroup.add(baseSkirt);

    this.sim.terrainDirty = false;
    this.rebuildStats.terrain++;
  }

  rebuildInfraGroup() {
    this._disposeGroup(this.infraGroup);
    this._lampPositions = [];
    this._signalEntries = [];
    this._signalRedInst = null;
    this._signalGreenInst = null;

    const isUnder = this.overlayMode === 'underground';
    const roadGroup = buildContinuousRoadAndViaductGroup(THREE, this.sim, this.overlayMode, this.mats);
    this.infraGroup.add(roadGroup);

    // Build Instanced Streetlamps & Live-Synced Traffic Signal Poles from roadGroup.userData.streetProps
    if (!isUnder && roadGroup && roadGroup.userData && roadGroup.userData.streetProps) {
      this._buildStreetFurnitureInstances(roadGroup.userData.streetProps);
    }

    const pylonPts = [];
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.sim.grid[idx(x, z)];
        const { wx, wz } = tileToWorld(x, z);
        const avgH = this.sim.getTileElev(x, z);
        const { min: minH } = this.sim.getTileMinMaxElev(x, z);

        if (isUnder) {
          if (t.pipe) {
            const pm = t.pipeBroken ? this.mats.pipeBroken : this.mats.pipeOk;
            this._addBoxTo(this.infraGroup, wx, avgH + 0.12, wz, 0.22, 0.10, 0.22, pm, false);
            if (this.sim.getTile(x + 1, z)?.pipe) this._addBoxTo(this.infraGroup, wx + 0.5, avgH + 0.12, wz, 0.80, 0.08, 0.12, pm, false);
            if (this.sim.getTile(x, z + 1)?.pipe) this._addBoxTo(this.infraGroup, wx, avgH + 0.12, wz + 0.5, 0.12, 0.08, 0.80, pm, false);
          }
          if (t.metro) {
            this._addBoxTo(this.infraGroup, wx, avgH + 0.22, wz, 0.30, 0.10, 0.30, this.mats.metroGlow, false);
            if (this.sim.getTile(x + 1, z)?.metro) this._addBoxTo(this.infraGroup, wx + 0.5, avgH + 0.22, wz, 0.78, 0.09, 0.22, this.mats.metroGlow, false);
            if (this.sim.getTile(x, z + 1)?.metro) this._addBoxTo(this.infraGroup, wx, avgH + 0.22, wz + 0.5, 0.22, 0.09, 0.78, this.mats.metroGlow, false);
          }
        }

        // Sculpted Monumental Hydroelectric Gravity Dam
        if (t.dam) {
          const damHp = t.damHealth !== undefined ? t.damHealth : 100;
          const isGenerating = (t.damOutputMW || 0) > 0;
          if (this.archLib && typeof this.archLib.createHydroDamSegment === 'function') {
            const seg = this.archLib.createHydroDamSegment(t.damCrest, minH, isGenerating, damHp);
            seg.position.set(wx, 0, wz);
            // Align dam wall along span axis and point downstream powerhouse toward lower water
            const hasEW = Boolean(this.sim.getTile(x - 1, z)?.dam || this.sim.getTile(x + 1, z)?.dam);
            const hasNS = Boolean(this.sim.getTile(x, z - 1)?.dam || this.sim.getTile(x, z + 1)?.dam);
            let yaw = 0;
            if (hasNS && !hasEW) {
              const wE = inBounds(x + 1, z) ? this.sim.waterDepth[idx(x + 1, z)] : 0;
              const wW = inBounds(x - 1, z) ? this.sim.waterDepth[idx(x - 1, z)] : 0;
              yaw = wW > wE ? Math.PI * 0.5 : -Math.PI * 0.5;
            } else {
              const wN = inBounds(x, z - 1) ? this.sim.waterDepth[idx(x, z - 1)] : 0;
              const wS = inBounds(x, z + 1) ? this.sim.waterDepth[idx(x, z + 1)] : 0;
              yaw = wS > wN ? Math.PI : 0;
            }
            seg.rotation.y = yaw;
            this.infraGroup.add(seg);
          } else {
            const baseH = Math.min(-0.7, minH - 0.2);
            const h = t.damCrest - baseH;
            const bodyMat = damHp < 65 ? this.mats.darkConcrete : this.mats.concrete;
            this._addBoxTo(this.infraGroup, wx, baseH + h * 0.5, wz, 1.03, h, 1.03, bodyMat, true);
            this._addBoxTo(this.infraGroup, wx, t.damCrest + 0.02, wz, 1.02, 0.04, 0.86, this.mats.viaductDeck, false);
          }
        }

        // High-Voltage Steel Pylon
        if (t.pylon) {
          pylonPts.push(new THREE.Vector3(wx, avgH + 1.18, wz));
          const tower = new THREE.Mesh(this.geos.taperSpire, this.mats.steelLattice);
          tower.scale.set(0.36, 1.22, 0.36);
          tower.position.set(wx, avgH + 0.61, wz);
          tower.castShadow = this.qualityMode !== 'eco';
          this.infraGroup.add(tower);
          this._addBoxTo(this.infraGroup, wx, avgH + 0.96, wz, 0.58, 0.04, 0.05, this.mats.steelLattice);
          this._addBoxTo(this.infraGroup, wx, avgH + 1.15, wz, 0.42, 0.04, 0.05, this.mats.steelLattice);
        }
      }
    }

    // Sagging Catenary High-Voltage Cables
    for (let i = 0; i < pylonPts.length; i++) {
      for (let j = i + 1; j < pylonPts.length; j++) {
        const d = pylonPts[i].distanceTo(pylonPts[j]);
        if (d <= 6.3) {
          const mid = pylonPts[i].clone().add(pylonPts[j]).multiplyScalar(0.5);
          mid.y -= 0.16;
          const curve = new THREE.QuadraticBezierCurve3(pylonPts[i], mid, pylonPts[j]);
          const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.014, 5, false);
          const m = new THREE.Mesh(tubeGeo, this.overlayMode === 'power' ? this.mats.powerGlow : this.mats.cable);
          m.userData.ownGeo = true;
          this.infraGroup.add(m);
        }
      }
    }

    this.sim.infraDirty = false;
    this.rebuildStats.infra++;
  }

  _buildStreetFurnitureInstances(props) {
    const lamps = Array.isArray(props.lamps) ? props.lamps : [];
    const signals = Array.isArray(props.signals) ? props.signals : [];

    // 1. Curved LED Streetlamps (2 InstancedMeshes for the entire city!)
    if (lamps.length > 0) {
      const poleInst = new THREE.InstancedMesh(this.geos.lampPole, this.mats.lampMetal, lamps.length);
      const bulbInst = new THREE.InstancedMesh(this.geos.lampBulb, this.mats.lampEmissive, lamps.length);
      poleInst.castShadow = false;
      poleInst.receiveShadow = false;
      bulbInst.castShadow = false;
      this._tmpScale.set(1, 1, 1);

      for (let i = 0; i < lamps.length; i++) {
        const lp = lamps[i];
        this._tmpEuler.set(0, lp.yaw || 0, 0);
        this._tmpQuat.setFromEuler(this._tmpEuler);
        this._tmpPos.set(lp.x, lp.y, lp.z);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        poleInst.setMatrixAt(i, this._tmpMat4);
        bulbInst.setMatrixAt(i, this._tmpMat4);

        // Store bulb world position for nighttime selective glow halo sprites
        const sinY = Math.sin(lp.yaw || 0);
        const cosY = Math.cos(lp.yaw || 0);
        this._lampPositions.push({
          x: lp.x + sinY * 0.175,
          y: lp.y + 0.515,
          z: lp.z + cosY * 0.175
        });
      }
      poleInst.instanceMatrix.needsUpdate = true;
      bulbInst.instanceMatrix.needsUpdate = true;
      this.infraGroup.add(poleInst, bulbInst);
    }

    // 2. Live-Synced 3-Lamp Traffic Signal Poles (3 InstancedMeshes total!)
    if (signals.length > 0) {
      const poleInst = new THREE.InstancedMesh(this.geos.signalPole, this.mats.signalBody, signals.length);
      const redInst = new THREE.InstancedMesh(this.geos.signalLens, this.mats.signalLens, signals.length);
      const greenInst = new THREE.InstancedMesh(this.geos.signalLens, this.mats.signalLens, signals.length);
      poleInst.castShadow = false;
      redInst.castShadow = false;
      greenInst.castShadow = false;

      const redInit = new THREE.Color(0xff3333);
      const greenInit = new THREE.Color(0x164e32);

      for (let i = 0; i < signals.length; i++) {
        const s = signals[i];
        const yaw = s.yaw || 0;
        this._tmpEuler.set(0, yaw, 0);
        this._tmpQuat.setFromEuler(this._tmpEuler);
        this._tmpScale.set(1, 1, 1);
        this._tmpPos.set(s.x, s.y, s.z);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        poleInst.setMatrixAt(i, this._tmpMat4);

        const sinY = Math.sin(yaw);
        const cosY = Math.cos(yaw);
        // Rotate local (-0.24, 0) by Y rotation `yaw`: (x*cos + z*sin, -x*sin + z*cos)
        const lx = s.x - 0.24 * cosY;
        const lz = s.z + 0.24 * sinY;

        this._tmpPos.set(lx, s.y + 0.502, lz);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        redInst.setMatrixAt(i, this._tmpMat4);
        redInst.setColorAt(i, redInit);

        this._tmpPos.set(lx, s.y + 0.440, lz);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        greenInst.setMatrixAt(i, this._tmpMat4);
        greenInst.setColorAt(i, greenInit);
      }

      poleInst.instanceMatrix.needsUpdate = true;
      redInst.instanceMatrix.needsUpdate = true;
      greenInst.instanceMatrix.needsUpdate = true;
      if (redInst.instanceColor) redInst.instanceColor.needsUpdate = true;
      if (greenInst.instanceColor) greenInst.instanceColor.needsUpdate = true;

      this.infraGroup.add(poleInst, redInst, greenInst);
      this._signalEntries = signals;
      this._signalRedInst = redInst;
      this._signalGreenInst = greenInst;
      this._signalSyncAccum = 99;
    }

    // 3. Roadside Modern EV Bus Stop Shelters (exact curb height from roadCornerY)
    const busStops = Array.isArray(props.busStops) ? props.busStops : [];
    if (busStops.length > 0 && this.archLib && typeof this.archLib.createBusStopShelter === 'function') {
      for (let i = 0; i < busStops.length; i++) {
        const bs = busStops[i];
        const shelter = this.archLib.createBusStopShelter();
        shelter.position.set(bs.x, bs.y, bs.z);
        shelter.rotation.y = bs.yaw || 0;
        this.infraGroup.add(shelter);
      }
    }
  }

  // 6-Batch Botanical InstancedMesh Forest (<= 6 draw calls for 1,500+ trees!)
  rebuildForestGroup() {
    this._disposeGroup(this.forestGroup);
    if (this.overlayMode === 'underground') {
      this.sim.forestDirty = false;
      this.rebuildStats.forest++;
      return;
    }

    const pines = [];
    const leaves = [];
    const palms = [];

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.sim.grid[idx(x, z)];
        if (t.trees <= 0 || t.zone || t.building || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.dam) continue;
        if (this.sim.waterDepth[idx(x, z)] >= 0.04) continue;

        const { wx, wz } = tileToWorld(x, z);
        const avgH = this.sim.getTileElev(x, z);
        const isCoastPalmZone = avgH <= 0.28 && (x >= GRID_SIZE - 16 || z >= GRID_SIZE - 14);
        const count = Math.min(3, t.trees);

        for (let k = 0; k < count; k++) {
          const ox = (hash2D(x * 7 + k, z * 13, 101) - 0.5) * 0.64;
          const oz = (hash2D(x * 11 + k, z * 17, 202) - 0.5) * 0.64;
          const txW = wx + ox;
          const tzW = wz + oz;
          const groundY = this._sampleExactSlopeHeight(txW, tzW) - 0.025;
          const scale = 0.78 + hash2D(x + k, z, 303) * 0.48;
          const yaw = hash2D(x * 5 + k, z * 9, 404) * Math.PI * 2;
          const tint = hash2D(x * 19 + k, z * 23, 505);

          if (isCoastPalmZone && tint > 0.30) {
            palms.push({ x: txW, y: groundY, z: tzW, s: scale * 1.05, yaw, tint });
          } else if (avgH > 0.78 || ((x + z + k) % 3 !== 0 && avgH > 0.36)) {
            pines.push({ x: txW, y: groundY, z: tzW, s: scale, yaw, tint });
          } else {
            leaves.push({ x: txW, y: groundY, z: tzW, s: scale, yaw, tint });
          }
        }
      }
    }

    const castSh = this.qualityMode !== 'eco';
    const pinePalette = [0x1e5631, 0x266639, 0x2f753e, 0x1b4d2c, 0x357a42];
    const leafPalette = [0x388542, 0x459648, 0x2f753a, 0x569a4a, 0x4b8f42, 0xc49a35]; // ~16% golden ginkgo accent!
    const palmPalette = [0x3c8f3b, 0x4ca344, 0x347f35, 0x5aad4a];

    const addSpecies = (list, trunkGeo, trunkMat, crownGeo, crownMat, palette) => {
      if (list.length === 0) return;
      const trInst = new THREE.InstancedMesh(trunkGeo, trunkMat, list.length);
      const crInst = new THREE.InstancedMesh(crownGeo, crownMat, list.length);
      trInst.castShadow = castSh;
      trInst.receiveShadow = true;
      crInst.castShadow = castSh;
      crInst.receiveShadow = true;

      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        this._tmpEuler.set(0, it.yaw, 0);
        this._tmpQuat.setFromEuler(this._tmpEuler);
        const sy = it.s * (0.92 + it.tint * 0.18);
        this._tmpScale.set(it.s, sy, it.s);
        this._tmpPos.set(it.x, it.y, it.z);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        trInst.setMatrixAt(i, this._tmpMat4);
        crInst.setMatrixAt(i, this._tmpMat4);

        const hex = palette[Math.floor(it.tint * palette.length) % palette.length];
        this._tmpColor.setHex(hex);
        crInst.setColorAt(i, this._tmpColor);
      }
      trInst.instanceMatrix.needsUpdate = true;
      crInst.instanceMatrix.needsUpdate = true;
      if (crInst.instanceColor) crInst.instanceColor.needsUpdate = true;
      this.forestGroup.add(trInst, crInst);
    };

    addSpecies(pines, this.geos.pineTrunk, this.mats.bark, this.geos.pineCrown, this.mats.pineInst, pinePalette);
    addSpecies(leaves, this.geos.leafTrunk, this.mats.bark, this.geos.leafCrown, this.mats.leafInst, leafPalette);
    addSpecies(palms, this.geos.palmTrunk, this.mats.palmBark, this.geos.palmCrown, this.mats.palmInst, palmPalette);

    this.sim.forestDirty = false;
    this.rebuildStats.forest++;
  }

  rebuildBuildingGroup() {
    this._disposeGroup(this.buildingGroup);
    this.buildingEntries = [];
    this.animHooks.windRotors.length = 0;
    this.animHooks.ferrisWheels.length = 0;
    this.animHooks.radarDishes.length = 0;
    this.animHooks.smokeSources.length = 0;
    this.animHooks.beacons.length = 0;

    const isUnder = this.overlayMode === 'underground';

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.sim.grid[idx(x, z)];
        const { wx, wz } = tileToWorld(x, z);
        const avgH = this.sim.getTileElev(x, z);
        const { min: minH } = this.sim.getTileMinMaxElev(x, z);

        // Cached Zone Pad (ZERO material allocations!)
        if (t.zone && !t.building && !isUnder) {
          const zm = this.mats.zonePads[t.zone] || this.mats.zonePads.default;
          this._addBoxTo(this.buildingGroup, wx, avgH + 0.02, wz, 0.84, 0.02, 0.84, zm, false);
        }

        // Contemporary PBR City Buildings!
        if (t.building && !t.building.underConstruction) {
          if (isUnder) {
            const fm = (t.building.type === 'water_pump' || t.building.type === 'sewage_out' || t.building.type === 'water_treat')
              ? this.mats.pipeOk
              : (t.building.type === 'metro_station' ? this.mats.metroGlow : this.mats.darkConcrete);
            this._addBoxTo(this.buildingGroup, wx, avgH + 0.06, wz, 0.80, 0.10, 0.80, fm, false);
          } else {
            const fH = Math.max(0.06, avgH - minH + 0.08);
            this._addBoxTo(this.buildingGroup, wx, avgH - fH * 0.5 + 0.02, wz, 0.92, fH, 0.92, this.mats.concrete, true);
            const rotRad = (t.building.rot || 0) * (Math.PI * 0.5);
            const bGrp = this.archLib.buildBuilding(t.building, wx, wz, avgH + 0.02, rotRad, this.animHooks);
            this.buildingGroup.add(bGrp);
            this._registerBuildingEntry(bGrp, x, z);
          }
        } else if (t.building && t.building.underConstruction && !isUnder) {
          this._addBoxTo(this.buildingGroup, wx, avgH + 0.03, wz, 0.84, 0.06, 0.84, this.mats.concrete, true);
        }
      }
    }

    this.sim.buildingDirty = false;
    this.rebuildStats.building++;
  }

  // Backward-compatible full or granular static rebuild dispatcher
  rebuildStaticCityMesh() {
    const overlayChanged = this.lastOverlayMode !== this.overlayMode;
    if (overlayChanged) {
      this.sim.terrainDirty = true;
      this.sim.infraDirty = true;
      this.sim.forestDirty = true;
      this.sim.buildingDirty = true;
    }

    const needWater = this.sim.terrainDirty || overlayChanged;
    if (this.sim.terrainDirty) this.rebuildTerrainGroup();
    if (this.sim.infraDirty) this.rebuildInfraGroup();
    if (this.sim.forestDirty) this.rebuildForestGroup();
    if (this.sim.buildingDirty) this.rebuildBuildingGroup();

    this.lastOverlayMode = this.overlayMode;
    if (needWater) this.rebuildWaterMesh();
  }

  // ==================== Environment IBL ====================
  _initEnvironmentLighting() {
    try {
      if (!THREE.PMREMGenerator) return;
      const envScene = new THREE.Scene();
      const geo = new THREE.SphereGeometry(10, 32, 16);
      const cols = [];
      const pos = geo.attributes.position;
      const top = new THREE.Color(0x4b8fe8), cloud = new THREE.Color(0xf4f8ff), hor = new THREE.Color(0xffe9d2), gnd = new THREE.Color(0x4f564b);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) / 10;
        if (y >= 0.14) c.copy(cloud).lerp(top, Math.pow((y - 0.14) / 0.86, 0.58));
        else if (y >= 0) c.copy(hor).lerp(cloud, y / 0.14);
        else c.copy(hor).lerp(gnd, Math.min(1, -y * 2.8));
        cols.push(c.r, c.g, c.b);
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
      envScene.add(new THREE.Mesh(geo, mat));
      const sunGeo = new THREE.SphereGeometry(0.95, 12, 8);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff3d4 });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.material.color.multiplyScalar(7.5);
      sun.position.set(6, 5.5, 3.2);
      envScene.add(sun);
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const rt = pmrem.fromScene(envScene, 0.018);
      this.scene.environment = rt.texture;
      this.scene.environmentIntensity = 0.68;
      this.hemiBase = 0.70;
      pmrem.dispose();
      geo.dispose();
      mat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
    } catch {
      this.scene.environment = null;
    }
  }

  // ==================== X-ray Occlusion Fading ====================
  _registerBuildingEntry(grp, x, z) {
    const meshes = [];
    grp.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      if (n.userData && n.userData.skipGhost) return;
      // Keep Contact AO skirts untouched during X-ray ghosting
      if (!Array.isArray(n.material) && n.material.transparent && n.material.depthWrite === false) return;
      meshes.push({ mesh: n, orig: n.material, shadow: n.castShadow });
    });
    if (meshes.length === 0) return;
    const box = new THREE.Box3();
    try {
      grp.updateMatrixWorld(true);
      box.setFromObject(grp);
    } catch {
      const { wx, wz } = tileToWorld(x, z);
      box.set(new THREE.Vector3(wx - 0.5, 0, wz - 0.5), new THREE.Vector3(wx + 0.5, 2, wz + 0.5));
    }
    if (!isFinite(box.min.x) || !isFinite(box.max.y)) return;
    this.buildingEntries.push({ grp, x, z, box, meshes, ghost: 0 });
  }

  _getGhostMaterial(orig, level) {
    if (Array.isArray(orig)) return orig.map((m) => this._getGhostMaterial(m, level));
    const key = orig.uuid + ':' + level;
    let g = this._ghostMatCache.get(key);
    if (!g) {
      g = orig.clone();
      if (orig.onBeforeCompile) g.onBeforeCompile = orig.onBeforeCompile;
      if (orig.customProgramCacheKey && orig.customProgramCacheKey !== THREE.Material.prototype.customProgramCacheKey) {
        const baseKeyFn = orig.customProgramCacheKey.bind(orig);
        g.customProgramCacheKey = () => baseKeyFn() + '_ghost';
      }
      g.transparent = true;
      g.opacity = level === 2 ? 0.16 : 0.30;
      g.depthWrite = false;
      g.userData.ghostOf = orig;
      this._ghostMatCache.set(key, g);
    }
    return g;
  }

  _setEntryGhost(entry, level) {
    if (entry.ghost === level) return;
    entry.ghost = level;
    for (const m of entry.meshes) {
      if (level === 0) {
        m.mesh.material = m.orig;
        m.mesh.castShadow = m.shadow && this.qualityMode !== 'eco';
      } else {
        m.mesh.material = this._getGhostMaterial(m.orig, level);
        m.mesh.castShadow = false;
      }
    }
  }

  _segmentHitsBox(ox, oy, oz, dx, dy, dz, box, pad) {
    let tmin = 0, tmax = 1;
    const mins = [box.min.x - pad, box.min.y - pad, box.min.z - pad];
    const maxs = [box.max.x + pad, box.max.y + pad, box.max.z + pad];
    const o = [ox, oy, oz], d = [dx, dy, dz];
    for (let a = 0; a < 3; a++) {
      if (Math.abs(d[a]) < 1e-8) {
        if (o[a] < mins[a] || o[a] > maxs[a]) return false;
      } else {
        let t1 = (mins[a] - o[a]) / d[a];
        let t2 = (maxs[a] - o[a]) / d[a];
        if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; }
        if (t1 > tmin) tmin = t1;
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) return false;
      }
    }
    return true;
  }

  _updateXrayFading(dt) {
    this._xrayAccum += dt;
    if (this._xrayAccum < 0.08) return;
    this._xrayAccum = 0;

    for (const g of this._ghostMatCache.values()) {
      const src = g.userData.ghostOf;
      if (src && src.emissiveIntensity !== undefined) g.emissiveIntensity = src.emissiveIntensity;
    }

    const mode = this.overlayMode === 'underground' ? 'off' : (this.xrayMode || 'auto');
    const cam = this.camera.position;
    let tx = this.camTarget[0], ty = this.camTarget[1] + 0.25, tz = this.camTarget[2];
    let focusTile = null;
    if (this.selectedTile && inBounds(this.selectedTile.x, this.selectedTile.z)) {
      focusTile = this.selectedTile;
      const w = tileToWorld(focusTile.x, focusTile.z);
      tx = w.wx; tz = w.wz;
      ty = this.sim.getTileElev(focusTile.x, focusTile.z) + 0.35;
    }
    const dx = tx - cam.x, dy = ty - cam.y, dz = tz - cam.z;
    const segLen = Math.hypot(dx, dy, dz) || 1;
    const stopT = Math.max(0, 1 - 0.55 / segLen);

    for (const e of this.buildingEntries) {
      const isFocus = focusTile && e.x === focusTile.x && e.z === focusTile.z;
      let level = 0;
      if (mode === 'all') {
        level = isFocus ? 0 : 1;
      } else if (mode === 'auto' && !isFocus) {
        const containsTarget =
          tx >= e.box.min.x && tx <= e.box.max.x && tz >= e.box.min.z && tz <= e.box.max.z && ty <= e.box.max.y;
        if (!containsTarget && this._segmentHitsBox(cam.x, cam.y, cam.z, dx * stopT, dy * stopT, dz * stopT, e.box, 0.18)) {
          level = 2;
        } else {
          const cx = Math.max(e.box.min.x, Math.min(cam.x, e.box.max.x));
          const cy = Math.max(e.box.min.y, Math.min(cam.y, e.box.max.y));
          const cz = Math.max(e.box.min.z, Math.min(cam.z, e.box.max.z));
          if (Math.hypot(cx - cam.x, cy - cam.y, cz - cam.z) < 1.1) level = 2;
        }
      }
      this._setEntryGhost(e, level);
    }
  }

  rebuildWaterMesh() {
    if (this.waterMesh) {
      this.waterGroup.remove(this.waterMesh);
      this.waterMesh.geometry.dispose();
      this.waterMesh = null;
    }
    if (this.overlayMode === 'underground') return;

    const mesh = buildSmoothWaterMesh(THREE, this.sim, this.waterPhysics, this.physicalWaterMat);
    if (mesh) {
      this.waterMesh = mesh;
      this.waterGroup.add(mesh);
    }
  }

  // True-Proportion Modern 3D Vehicles (Sedan, SUV, Taxi, Bus, Container Truck, Fire Engine, Garbage Truck)
  _createVehicleObject(kind, variantIdx) {
    if (this.archLib && typeof this.archLib.createRealisticVehicleObject === 'function') {
      try {
        const obj = this.archLib.createRealisticVehicleObject(kind, variantIdx);
        if (obj) {
          obj.rotation.order = 'YXZ';
          return obj;
        }
      } catch {}
    }

    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';
    const coach = new THREE.Mesh(this.geos.bulletCoach, kind === 'firetruck' ? this.mats.redCross : this.mats.bulletStripe);
    coach.scale.set(0.65, 0.65, 0.55);
    coach.position.y = 0.08;
    coach.castShadow = this.qualityMode !== 'eco';
    grp.add(coach);
    return grp;
  }

  _sampleInfraHeight(field, wx, wz) {
    const gx = Math.max(0, Math.min(GRID_SIZE - 0.0001, wx + HALF_GRID));
    const gz = Math.max(0, Math.min(GRID_SIZE - 0.0001, wz + HALF_GRID));
    const ix = Math.floor(gx), iz = Math.floor(gz);
    const fx = gx - ix, fz = gz - iz;
    const h00 = field[cIdx(ix, iz)], h10 = field[cIdx(ix + 1, iz)];
    const h01 = field[cIdx(ix, iz + 1)], h11 = field[cIdx(ix + 1, iz + 1)];
    return (h00 * (1 - fx) + h10 * fx) * (1 - fz) + (h01 * (1 - fx) + h11 * fx) * fz;
  }

  _countRailNeighbors(x, z, isMetro) {
    let n = 0;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const t = this.sim.getTile(x + dx, z + dz);
      if (t && (isMetro ? t.metro : t.rail > 0)) n++;
    }
    return n;
  }

  _trackTilePoint(path, k, s, isMetro) {
    const p = path[k];
    const prev = path[k - 1];
    const next = path[k + 1];
    const c = tileToWorld(p.x, p.z);
    let inX = prev ? p.x - prev.x : (next ? next.x - p.x : 0);
    let inZ = prev ? p.z - prev.z : (next ? next.z - p.z : 1);
    let outX = next ? next.x - p.x : inX;
    let outZ = next ? next.z - p.z : inZ;
    const eInX = c.wx - inX * 0.5, eInZ = c.wz - inZ * 0.5;
    const eOutX = c.wx + outX * 0.5, eOutZ = c.wz + outZ * 0.5;

    if (inX === outX && inZ === outZ) {
      return { x: eInX + (eOutX - eInX) * s, z: eInZ + (eOutZ - eInZ) * s };
    }
    if (this._countRailNeighbors(p.x, p.z, isMetro) !== 2) {
      if (s < 0.5) {
        const f = s / 0.5;
        return { x: eInX + (c.wx - eInX) * f, z: eInZ + (c.wz - eInZ) * f };
      }
      const f = (s - 0.5) / 0.5;
      return { x: c.wx + (eOutX - c.wx) * f, z: c.wz + (eOutZ - c.wz) * f };
    }
    const pivX = c.wx - inX * 0.5 + outX * 0.5;
    const pivZ = c.wz - inZ * 0.5 + outZ * 0.5;
    const th = s * Math.PI * 0.5;
    const ct = Math.cos(th), st = Math.sin(th);
    return {
      x: pivX + (-outX * ct + inX * st) * 0.5,
      z: pivZ + (-outZ * ct + inZ * st) * 0.5
    };
  }

  _sampleTrackPoint(path, d, isMetro) {
    const maxD = path.length - 1;
    const dd = Math.max(0, Math.min(maxD - 1e-4, d));
    const seg = Math.floor(dd);
    const f = dd - seg;
    let pt;
    if (f < 0.5) pt = this._trackTilePoint(path, seg, 0.5 + f, isMetro);
    else pt = this._trackTilePoint(path, seg + 1, f - 0.5, isMetro);

    let y;
    if (isMetro) {
      const node = path[f < 0.5 ? seg : seg + 1];
      y = this.sim.getTileElev(node.x, node.z) + 0.25;
    } else if (this.sim.infraHeights && this.sim.infraHeights.railCornerY) {
      y = this._sampleInfraHeight(this.sim.infraHeights.railCornerY, pt.x, pt.z) + 0.028;
    } else {
      const p0 = path[seg], p1 = path[Math.min(maxD, seg + 1)];
      const y0 = this.traffic.getRailNodeY(p0.x, p0.z, false);
      const y1 = this.traffic.getRailNodeY(p1.x, p1.z, false);
      y = y0 + (y1 - y0) * f;
    }
    return { x: pt.x, y, z: pt.z };
  }

  _createTrainCarObject(isHead) {
    let g = null;
    if (this.archLib && typeof this.archLib.createBulletTrainCarObject === 'function') {
      try { g = this.archLib.createBulletTrainCarObject(isHead); } catch { g = null; }
    }
    if (!g) {
      g = new THREE.Group();
      const body = new THREE.Mesh(this.geos.bulletCoach, this.mats.bulletBody);
      body.position.y = 0.11;
      body.castShadow = this.qualityMode !== 'eco';
      const stripe = new THREE.Mesh(this.geos.unitBox, this.mats.bulletStripe);
      stripe.scale.set(0.215, 0.035, 0.56);
      stripe.position.y = 0.11;
      g.add(body, stripe);
    }
    g.rotation.order = 'YXZ';
    g.userData.isHead = Boolean(isHead);
    return g;
  }

  _vehicleDeckHeight(v, wx, wz) {
    const ih = this.sim.infraHeights;
    if (!ih || !v.path) return null;
    const cur = v.path[v.seg];
    const nxt = v.path[v.seg + 1];
    if (!cur || !nxt) return null;
    if (cur.onRamp || nxt.onRamp || cur.layer !== nxt.layer) return null;
    const tA = this.sim.getTile(cur.x, cur.z);
    const tB = this.sim.getTile(nxt.x, nxt.z);
    if (!tA || !tB) return null;
    if (cur.layer === 1) {
      if (tA.ramp || tB.ramp) return null;
      return this._sampleInfraHeight(ih.elevCornerY, wx, wz);
    }
    if (tA.dam || tB.dam || tA.roadGround === 4 || tB.roadGround === 4) return null;
    return this._sampleInfraHeight(ih.roadCornerY, wx, wz);
  }

  _syncTrafficSignals(dt) {
    if (!this._signalRedInst || !this._signalGreenInst || this._signalEntries.length === 0) return;
    this._signalSyncAccum += dt;
    if (this._signalSyncAccum < 0.12) return;
    this._signalSyncAccum = 0;

    const brightRed = 0xff2b3a;
    const dimRed = 0x3b1216;
    const brightGreen = 0x22f57a;
    const dimGreen = 0x103321;

    for (let i = 0; i < this._signalEntries.length; i++) {
      const s = this._signalEntries[i];
      const isNS = s.axis === 'NS';
      const isRed = this.traffic && typeof this.traffic.isSignalRed === 'function'
        ? this.traffic.isSignalRed(s.tx, s.tz, isNS)
        : false;
      this._tmpColor.setHex(isRed ? brightRed : dimRed);
      this._signalRedInst.setColorAt(i, this._tmpColor);
      this._tmpColor.setHex(isRed ? dimGreen : brightGreen);
      this._signalGreenInst.setColorAt(i, this._tmpColor);
    }
    if (this._signalRedInst.instanceColor) this._signalRedInst.instanceColor.needsUpdate = true;
    if (this._signalGreenInst.instanceColor) this._signalGreenInst.instanceColor.needsUpdate = true;
  }

  _syncDynamicScene(dt, night) {
    const isUnder = this.overlayMode === 'underground';
    const strobeRed = Math.sin(this.clock * 18) > 0;
    const beaconBlink = Math.sin(this.clock * 4.2) > -0.2;

    for (const hub of this.animHooks.windRotors) hub.rotation.z -= dt * 2.1;
    for (const wheel of this.animHooks.ferrisWheels) {
      wheel.rotation.z += dt * 0.42;
      if (wheel.userData && Array.isArray(wheel.userData.gondolas)) {
        for (const pod of wheel.userData.gondolas) pod.rotation.z = -wheel.rotation.z;
      }
    }
    for (const radar of this.animHooks.radarDishes) radar.rotation.y += dt * 2.2;
    for (const bc of this.animHooks.beacons) bc.visible = night > 0.22 ? beaconBlink : false;

    // Streetlamp dusk/night emissive glow & live traffic signals
    if (this.mats.lampEmissive) {
      const lampGlow = Math.max(0.08, night * 2.2);
      this.mats.lampEmissive.emissiveIntensity = lampGlow;
    }
    if (!isUnder) this._syncTrafficSignals(dt);

    // Road Vehicles (zero per-frame material leaks!)
    const rawCars = isUnder ? [] : this.traffic.vehicles;
    const activeCount = Math.min(rawCars.length, this._maxRenderedVehicles);
    while (this.vehiclePool.length < activeCount) {
      const idxV = this.vehiclePool.length;
      const v = rawCars[idxV];
      const obj = this._createVehicleObject(v.kind, idxV);
      this.vehicleGroup.add(obj);
      this.vehiclePool.push({ kind: v.kind, obj });
    }

    for (let i = 0; i < this.vehiclePool.length; i++) {
      const slot = this.vehiclePool[i];
      if (i >= activeCount || rawCars[i].inTunnel) {
        slot.obj.visible = false;
        continue;
      }
      const v = rawCars[i];
      if (slot.kind !== v.kind) {
        this.vehicleGroup.remove(slot.obj);
        slot.obj = this._createVehicleObject(v.kind, i);
        slot.kind = v.kind;
        this.vehicleGroup.add(slot.obj);
      }
      slot.obj.visible = true;
      const deckY = this._vehicleDeckHeight(v, v.wx, v.wz);
      if (deckY !== null) {
        const ahead = this._vehicleDeckHeight(v, v.wx + v.dirX * 0.12, v.wz + v.dirZ * 0.12);
        const behind = this._vehicleDeckHeight(v, v.wx - v.dirX * 0.12, v.wz - v.dirZ * 0.12);
        const deckPitch = (ahead !== null && behind !== null) ? Math.atan2(ahead - behind, 0.24) : (v.pitch || 0);
        slot.obj.position.set(v.wx, deckY + 0.004, v.wz);
        slot.obj.rotation.set(-deckPitch, Math.atan2(v.dirX, v.dirZ), 0);
      } else {
        slot.obj.position.set(v.wx, v.wy, v.wz);
        slot.obj.rotation.set(-(v.pitch || 0), Math.atan2(v.dirX, v.dirZ), 0);
      }

      if (v.kind === 'firetruck') {
        const st = slot.obj.getObjectByName('strobe');
        if (st) st.material = strobeRed ? this.mats.redCross : this.mats.cyanGlow;
      }
    }

    // Bullet Trains & Metro Trains
    let neededTrainCars = 0;
    for (const tr of this.traffic.trains) {
      if ((tr.isMetro && isUnder) || (!tr.isMetro && !isUnder)) neededTrainCars += tr.cars;
    }
    while (this.trainCarPool.length < neededTrainCars) {
      const g = this._createTrainCarObject(false);
      this.vehicleGroup.add(g);
      this.trainCarPool.push(g);
    }

    let tCursor = 0;
    for (const tr of this.traffic.trains) {
      if ((tr.isMetro && !isUnder) || (!tr.isMetro && isUnder)) continue;
      for (let c = 0; c < tr.cars; c++) {
        const poolIdx = tCursor++;
        const isEnd = c === 0 || c === tr.cars - 1;
        let carObj = this.trainCarPool[poolIdx];
        if (Boolean(carObj.userData.isHead) !== isEnd) {
          this.vehicleGroup.remove(carObj);
          carObj = this._createTrainCarObject(isEnd);
          this.vehicleGroup.add(carObj);
          this.trainCarPool[poolIdx] = carObj;
        }
        const carDist = tr.dist - c * 0.72;
        if (carDist < 0 || carDist >= tr.path.length - 1) {
          carObj.visible = false;
          continue;
        }
        const pA = this._sampleTrackPoint(tr.path, Math.max(0, carDist - 0.06), tr.isMetro);
        const pB = this._sampleTrackPoint(tr.path, Math.min(tr.path.length - 1.001, carDist + 0.06), tr.isMetro);
        const pC = this._sampleTrackPoint(tr.path, carDist, tr.isMetro);
        const dx = pB.x - pA.x, dz = pB.z - pA.z;
        const hLen = Math.hypot(dx, dz) || 1;
        const pitch = Math.atan2(pB.y - pA.y, hLen);
        let yaw = Math.atan2(dx, dz);
        if (c === tr.cars - 1 && tr.cars > 1) yaw += Math.PI;

        carObj.visible = true;
        carObj.position.set(pC.x, pC.y, pC.z);
        carObj.rotation.set(c === tr.cars - 1 && tr.cars > 1 ? pitch : -pitch, yaw, 0);
      }
    }
    for (let k = tCursor; k < this.trainCarPool.length; k++) this.trainCarPool[k].visible = false;

    // Airliners
    const planes = isUnder ? [] : (this.traffic.aircraft || []);
    while (this.airlinerPool.length < planes.length) {
      const jet = this.archLib.createAirlinerObject();
      this.vehicleGroup.add(jet);
      this.airlinerPool.push(jet);
    }
    for (let i = 0; i < this.airlinerPool.length; i++) {
      const jet = this.airlinerPool[i];
      if (i >= planes.length) { jet.visible = false; continue; }
      const p = planes[i];
      jet.visible = true;
      jet.position.set(p.wx, p.wy, p.wz);
      jet.rotation.set(-(p.pitch || 0), p.yaw || 0, p.roll || 0);
    }

    // Cargo Ships
    const ships = isUnder ? [] : (this.traffic.ships || []);
    while (this.shipPool.length < ships.length) {
      const sh = this.archLib.createCargoShipObject();
      this.vehicleGroup.add(sh);
      this.shipPool.push(sh);
    }
    for (let i = 0; i < this.shipPool.length; i++) {
      const sh = this.shipPool[i];
      if (i >= ships.length) { sh.visible = false; continue; }
      const s = ships[i];
      sh.visible = true;
      sh.position.set(s.wx, s.wy, s.wz);
      sh.rotation.set(-(s.pitch || 0), s.yaw || 0, s.roll || 0);
    }

    // Sidewalk Pedestrians (2 InstancedMeshes total, <= 240 citizens, ZERO per-frame allocations!)
    const peds = (!isUnder && this._maxPedestrians > 0 && Array.isArray(this.traffic.pedestrians))
      ? this.traffic.pedestrians
      : [];
    const pedCount = Math.min(peds.length, this._maxPedestrians, this._pedCap);
    if (pedCount > 0) {
      this._tmpScale.set(1, 1, 1);
      this._tmpQuat.identity();
      for (let i = 0; i < pedCount; i++) {
        const p = peds[i];
        const bob = Math.abs(Math.sin(p.walkPhase || 0)) * 0.014;
        const baseY = (p.wy || 0) + 0.036 + bob;
        this._tmpPos.set(p.wx, baseY, p.wz);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        this.pedBodyInst.setMatrixAt(i, this._tmpMat4);

        this._tmpPos.set(p.wx, baseY + 0.048, p.wz);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        this.pedHeadInst.setMatrixAt(i, this._tmpMat4);
      }
      this.pedBodyInst.count = pedCount;
      this.pedHeadInst.count = pedCount;
      this.pedBodyInst.instanceMatrix.needsUpdate = true;
      this.pedHeadInst.instanceMatrix.needsUpdate = true;
      this.pedBodyInst.visible = true;
      this.pedHeadInst.visible = true;
    } else {
      this.pedBodyInst.visible = false;
      this.pedHeadInst.visible = false;
    }

    // ==================== Zero-Leak Pooled VFX, Night Glow & Selection Overlays ====================
    let scafCount = 0;
    let fireCount = 0;
    let smokeCount = 0;
    let sprayCount = 0;
    let damWarnCount = 0;
    let glowCount = 0;

    if (!isUnder) {
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        const b = t.building;
        if (b) {
          const { wx, wz } = tileToWorld(t.x, t.z);
          const y0 = this.sim.getTileElev(t.x, t.z);

          if (b.underConstruction) {
            if (scafCount < this._poolCaps.scaffold) {
              const h = 0.25 + (b.buildProgress || 0.2) * 0.9;
              const scaf = this._acquirePoolMesh(this.scaffoldPool, scafCount++, this.geos.unitBox, this.mats.goldGlow);
              scaf.scale.set(0.62, h, 0.62);
              scaf.position.set(wx, y0 + h * 0.5, wz);
              scaf.visible = true;
            }
          } else if (b.fire > 0.05) {
            for (let f = 0; f < 2 && fireCount < this._poolCaps.fire; f++) {
              const ph = (this.clock * 2.4 + f * 0.5 + i * 0.17) % 1.0;
              const fl = this._acquirePoolSprite(this.firePool, fireCount++, { map: this.smokeTex });
              fl.material.color.setHex(ph < 0.5 ? 0xff6b1a : 0x333333);
              fl.material.opacity = 0.85 * (1 - ph * 0.6);
              fl.position.set(wx, y0 + 0.4 + ph * 1.1, wz);
              fl.scale.setScalar(0.45 + ph * 0.4);
              fl.visible = true;
            }
          }
        }

        if (t.dam) {
          const damHp = t.damHealth !== undefined ? t.damHealth : 100;
          if ((t.damStress || 0) >= 0.75 || damHp < 65) {
            const { wx, wz } = tileToWorld(t.x, t.z);
            if (strobeRed && damWarnCount < this._poolCaps.damWarn) {
              const warn = this._acquirePoolMesh(this.damWarnPool, damWarnCount++, this.geos.waterSphere, this.mats.redCross);
              warn.scale.setScalar(0.32);
              warn.position.set(wx, t.damCrest + 0.16, wz);
              warn.visible = true;
            }
            if (sprayCount < this._poolCaps.spray) {
              const ph = (this.clock * 3.0 + i * 0.23) % 1.0;
              const spray = this._acquirePoolSprite(this.sprayPool, sprayCount++, { map: this.smokeTex });
              spray.material.color.setHex(0xe0f2fe);
              spray.material.opacity = 0.72 * (1 - ph);
              spray.position.set(wx, t.damCrest + 0.06 - ph * 0.28, wz + 0.35 * ph);
              spray.scale.setScalar(0.32 + ph * 0.48);
              spray.visible = true;
            }
          }
        }
      }

      for (let i = 0; i < this.animHooks.smokeSources.length && smokeCount < this._poolCaps.smoke; i++) {
        const s = this.animHooks.smokeSources[i];
        const ph = (this.clock * 0.42 + i * 0.29) % 1.0;
        const sp = this._acquirePoolSprite(this.smokePool, smokeCount++, { map: this.smokeTex });
        sp.material.color.setHex(s.isSteam ? 0xf8fafc : 0xdbe2ec);
        sp.material.opacity = (s.isSteam ? 0.52 : 0.40) * (1 - ph);
        sp.position.set(s.x + ph * 0.22, s.y + ph * 0.65, s.z - ph * 0.12);
        sp.scale.setScalar(0.24 + ph * 0.45);
        sp.visible = true;
      }

      // Selective Nighttime Glow / Bloom Halos (tower beacons + nearest curved LED streetlamps)
      if (night > 0.20 && this._maxGlowSprites > 0 && this.glowTex) {
        const glowAlpha = Math.min(1, (night - 0.20) / 0.55);
        // 1. Tower crown aviation beacons
        for (let i = 0; i < this.animHooks.beacons.length && glowCount < this._maxGlowSprites; i++) {
          const bc = this.animHooks.beacons[i];
          if (!bc.visible) continue;
          bc.getWorldPosition(this._tmpPos);
          const gl = this._acquirePoolSprite(this.glowPool, glowCount++, { map: this.glowTex, additive: true });
          gl.material.color.setHex(0xff3b4e);
          gl.material.opacity = 0.75 * glowAlpha;
          gl.position.copy(this._tmpPos);
          gl.scale.setScalar(0.42);
          gl.visible = true;
        }
        // 2. Nearest streetlamp warm halos around camera target
        const txC = this.camTarget[0], tzC = this.camTarget[2];
        const maxRadiusSq = 18 * 18;
        for (let i = 0; i < this._lampPositions.length && glowCount < this._maxGlowSprites; i++) {
          const lp = this._lampPositions[i];
          const dSq = (lp.x - txC) * (lp.x - txC) + (lp.z - tzC) * (lp.z - tzC);
          if (dSq > maxRadiusSq) continue;
          const gl = this._acquirePoolSprite(this.glowPool, glowCount++, { map: this.glowTex, additive: true });
          gl.material.color.setHex(0xffd27d);
          gl.material.opacity = 0.48 * glowAlpha;
          gl.position.set(lp.x, lp.y, lp.z);
          gl.scale.setScalar(0.55);
          gl.visible = true;
        }
      }
    }

    this._hidePoolFrom(this.scaffoldPool, scafCount);
    this._hidePoolFrom(this.firePool, fireCount);
    this._hidePoolFrom(this.smokePool, smokeCount);
    this._hidePoolFrom(this.sprayPool, sprayCount);
    this._hidePoolFrom(this.damWarnPool, damWarnCount);
    this._hidePoolFrom(this.glowPool, glowCount);

    // Disasters (pooled meteors & tornado funnel)
    let meteorCount = 0;
    if (this.disasters) {
      for (const m of this.disasters.meteors) {
        const mx = m.start[0] + (m.end[0] - m.start[0]) * m.t;
        const my = m.start[1] + (m.end[1] - m.start[1]) * m.t;
        const mz = m.start[2] + (m.end[2] - m.start[2]) * m.t;
        const ball = this._acquirePoolMesh(this.meteorPool, meteorCount++, this.geos.waterSphere, this.mats.meteorGlow);
        ball.scale.setScalar(2.4);
        ball.position.set(mx, my, mz);
        ball.visible = true;
      }
      const tor = this.disasters.tornado;
      for (let r = 0; r < this.tornadoRings.length; r++) {
        const ring = this.tornadoRings[r];
        if (!tor) {
          ring.visible = false;
        } else {
          const sc = 0.4 + r * 0.25;
          ring.scale.set(sc, 0.42, sc);
          ring.position.set(tor.wx + Math.sin(this.clock * 10 + r) * 0.16, 0.3 + r * 0.42, tor.wz + Math.cos(this.clock * 10 + r) * 0.16);
          ring.visible = true;
        }
      }
    } else {
      for (let r = 0; r < this.tornadoRings.length; r++) this.tornadoRings[r].visible = false;
    }
    this._hidePoolFrom(this.meteorPool, meteorCount);

    // Build / Drag Preview Tiles (single reusable previewMat mutated in place!)
    let prevCount = 0;
    if (this.previewTiles.length > 0) {
      this.mats.previewMat.color.setRGB(this.previewColor[0], this.previewColor[1], this.previewColor[2]);
      for (const pos of this.previewTiles) {
        if (!inBounds(pos.x, pos.z)) continue;
        const { wx, wz } = tileToWorld(pos.x, pos.z);
        const py = Math.max(this.sim.getTileElev(pos.x, pos.z), this.sim.getTileElev(pos.x, pos.z) + this.sim.waterDepth[idx(pos.x, pos.z)]) + 0.06;
        const hl = this._acquirePoolMesh(this.previewMeshPool, prevCount++, this.geos.unitBox, this.mats.previewMat);
        hl.scale.set(0.92, 0.06, 0.92);
        hl.position.set(wx, py, wz);
        hl.visible = true;
      }
    }
    this._hidePoolFrom(this.previewMeshPool, prevCount);

    // Pre-Build Green Road-Connected Service Coverage Overlay (1 InstancedMesh, ZERO allocs!)
    const svcList = Array.isArray(this.servicePreviewTiles) ? this.servicePreviewTiles : [];
    const svcCount = Math.min(svcList.length, this._servicePreviewCap);
    if (svcCount > 0 && !isUnder) {
      this._tmpQuat.identity();
      this._tmpScale.set(0.90, 0.035, 0.90);
      for (let i = 0; i < svcCount; i++) {
        const st = svcList[i];
        if (!inBounds(st.x, st.z)) continue;
        const { wx, wz } = tileToWorld(st.x, st.z);
        const py = Math.max(this.sim.getTileElev(st.x, st.z), this.sim.getTileElev(st.x, st.z) + this.sim.waterDepth[idx(st.x, st.z)]) + 0.045;
        this._tmpPos.set(wx, py, wz);
        this._tmpMat4.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        this.servicePreviewInst.setMatrixAt(i, this._tmpMat4);
        const str = Math.max(0.15, Math.min(1.0, st.strength ?? 0.8));
        this._tmpColor.setRGB(0.10 + (1 - str) * 0.25, 0.55 + str * 0.42, 0.22 + (1 - str) * 0.22);
        this.servicePreviewInst.setColorAt(i, this._tmpColor);
      }
      this.servicePreviewInst.count = svcCount;
      this.servicePreviewInst.instanceMatrix.needsUpdate = true;
      if (this.servicePreviewInst.instanceColor) this.servicePreviewInst.instanceColor.needsUpdate = true;
      this.servicePreviewInst.visible = true;
    } else {
      this.servicePreviewInst.visible = false;
    }

    // Selected Tile Highlight
    if (this.selectedTile && inBounds(this.selectedTile.x, this.selectedTile.z)) {
      const { wx, wz } = tileToWorld(this.selectedTile.x, this.selectedTile.z);
      const sy = this.sim.getTileElev(this.selectedTile.x, this.selectedTile.z) + 0.08;
      this.selectedTileMesh.position.set(wx, sy, wz);
      this.selectedTileMesh.visible = true;
    } else {
      this.selectedTileMesh.visible = false;
    }

    // Selected Vehicle Golden Halo
    if (!isUnder && this.selectedVehicle && this.traffic.vehicles.includes(this.selectedVehicle) && !this.selectedVehicle.inTunnel) {
      const v = this.selectedVehicle;
      const pulse = 1.0 + Math.sin(this.clock * 7.5) * 0.14;
      this.selectedVehicleHalo.scale.set(0.68 * pulse, 0.035, 0.68 * pulse);
      this.selectedVehicleHalo.position.set(v.wx, (v.wy || 0) + 0.24, v.wz);
      this.selectedVehicleHalo.visible = true;
    } else {
      this.selectedVehicleHalo.visible = false;
    }
  }

  _updateAtmosphereAndShadows() {
    const p = this.sim.dayProgress;
    const sunAngle = (p - 0.25) * Math.PI * 2;
    const sunElev = Math.sin(sunAngle);
    const night = Math.max(0, Math.min(1, (-sunElev + 0.16) / 0.42));
    const sunset = Math.max(0, 1 - Math.abs(sunElev - 0.06) / 0.28);

    const lx = sunElev >= -0.05 ? Math.cos(sunAngle) * 34 : -Math.cos(sunAngle) * 28;
    const ly = sunElev >= -0.05 ? Math.max(12, sunElev * 42) : 26;
    const lz = sunElev >= -0.05 ? 22 : -20;

    const sunDir = new THREE.Vector3(lx, ly, lz).normalize();

    if (this.overlayMode === 'underground') {
      if (this.skyDome) this.skyDome.mesh.visible = false;
      this.skyColor.setRGB(0.04, 0.07, 0.12);
      this.scene.background = this.skyColor;
      this.fog.color.copy(this.skyColor);
      this.sunLight.intensity = 0.7;
      this.hemiLight.intensity = 0.55;
      if (this.scene.environment) this.scene.environmentIntensity = 0.15;
      return { night: 0.65, sunDir };
    }

    if (this.skyDome) {
      this.skyDome.mesh.visible = true;
      this.skyDome.update(p, night, sunDir);
    }

    const daySky = new THREE.Color(0x74b6f2);
    const sunsetSky = new THREE.Color(0xe57c56);
    const nightSky = new THREE.Color(0x091124);

    this.skyColor.copy(daySky).lerp(nightSky, night).lerp(sunsetSky, sunset * 0.65);
    this.fog.color.copy(this.skyColor);

    this.sunLight.target.position.set(this.camTarget[0], this.camTarget[1], this.camTarget[2]);
    this.sunLight.position.set(this.camTarget[0] + lx, this.camTarget[1] + ly, this.camTarget[2] + lz);

    const daySun = new THREE.Color(0xfff7e8);
    const sunsetSun = new THREE.Color(0xff8c4a);
    const moonCol = new THREE.Color(0x4a6fa5);
    this.sunLight.color.copy(daySun).lerp(moonCol, night).lerp(sunsetSun, sunset * 0.75);
    this.sunLight.intensity = 1.92 * (1 - night * 0.72);
    this.hemiLight.intensity = (this.hemiBase || 0.88) * (1 - night * 0.62);
    if (this.scene.environment) this.scene.environmentIntensity = 0.68 * (1 - night * 0.78);

    this.archLib.setNightFactor(night);

    updatePhysicalWaterUniforms(
      this.physicalWaterMat,
      this.clock,
      sunDir,
      this.sunLight.color,
      this.skyColor,
      this.camera.position,
      night
    );

    return { night, sunDir };
  }

  render(dt) {
    this.clock += dt;
    this.updateCameraMatrices();

    if (this.sim.meshDirty || this.lastOverlayMode !== this.overlayMode) {
      this.rebuildStaticCityMesh();
    } else {
      this.waterRebuildAccum += dt;
      if (this.waterRebuildAccum >= 0.09) {
        this.waterRebuildAccum = 0;
        this.rebuildWaterMesh();
      }
    }

    const { night } = this._updateAtmosphereAndShadows();
    this._updateXrayFading(dt);
    this._syncDynamicScene(dt, night);
    this.renderer.render(this.scene, this.camera);
  }
}
