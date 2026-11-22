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

function makeRoadTexture(lanes = 2, isHub = false) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#9aa2ad';
  g.fillRect(0, 0, 256, 256);

  if (isHub) {
    g.fillStyle = '#282c34';
    g.fillRect(22, 0, 212, 256);
    g.fillRect(0, 22, 256, 212);

    g.fillStyle = '#9aa2ad';
    for (const [cx, cy] of [[0,0],[256,0],[0,256],[256,256]]) {
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

export class CityRenderer3D {
  constructor(canvas, sim, traffic, disasters, waterPhysics) {
    this.canvas = canvas;
    this.sim = sim;
    this.traffic = traffic;
    this.disasters = disasters;
    this.waterPhysics = waterPhysics;

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
    this.selectedTile = null;
    this.selectedVehicle = null;

    this.staticGroup = new THREE.Group();
    this.waterGroup = new THREE.Group();
    this.vehicleGroup = new THREE.Group();
    this.uiOverlayGroup = new THREE.Group();
    this.scene.add(this.staticGroup, this.waterGroup, this.vehicleGroup, this.uiOverlayGroup);

    this._initSharedAssets();

    this.glbProtos = {};
    this.archLib = new ArchitectureLibrary(THREE, this.glbProtos, this.mats);

    this.skyDome = this.archLib.createSkyDome();
    this.scene.add(this.skyDome.mesh);

    // X-ray occlusion fading (auto: buildings blocking the view to the focus point turn translucent)
    this.xrayMode = 'auto';
    this.buildingEntries = [];
    this._ghostMatCache = new Map();
    this._xrayAccum = 99;
    this._tmpBox = new THREE.Box3();

    // Image-based lighting so glass curtain walls & metal pick up sky reflections
    this._initEnvironmentLighting();

    this.vehiclePool = [];
    this.trainCarPool = [];
    this.airlinerPool = [];
    this.shipPool = [];

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

    window.addEventListener('resize', () => this.resize());
  }

  _initSharedAssets() {
    this.texRoad2 = makeRoadTexture(2, false);
    this.texRoad4 = makeRoadTexture(4, false);
    this.texRoadHub = makeRoadTexture(2, true);
    this.terrainDetailTex = createTerrainDetailTexture(THREE);
    this.physicalWaterMat = createPhysicalWaterMaterial(THREE);

    this.mats = {
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
      bulletBody: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.20, metalness: 0.28 }),
      bulletStripe: new THREE.MeshStandardMaterial({ color: 0x1d6feb, roughness: 0.25, metalness: 0.4, emissive: 0x0b3b8c, emissiveIntensity: 0.32 }),
      garbageGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45 }),
      bark: new THREE.MeshStandardMaterial({ color: 0x5c4028, roughness: 0.90 }),
      pineLeafA: new THREE.MeshStandardMaterial({ color: 0x235e34, roughness: 0.84 }),
      pineLeafB: new THREE.MeshStandardMaterial({ color: 0x2b703d, roughness: 0.82 }),
      oakLeafA: new THREE.MeshStandardMaterial({ color: 0x358240, roughness: 0.82 }),
      oakLeafB: new THREE.MeshStandardMaterial({ color: 0x459448, roughness: 0.82 })
    };

    const smokeImg = new Image();
    smokeImg.src = SMOKE_PNG_URI;
    this.smokeTex = new THREE.Texture(smokeImg);
    this.smokeTex.colorSpace = THREE.SRGBColorSpace;
    smokeImg.onload = () => { this.smokeTex.needsUpdate = true; };

    this.geos = {
      unitBox: new THREE.BoxGeometry(1, 1, 1),
      taperSpire: new THREE.CylinderGeometry(0.18, 0.42, 1, 8),
      pierCyl: new THREE.CylinderGeometry(0.08, 0.10, 1, 12),
      waterSphere: new THREE.SphereGeometry(0.28, 18, 14),
      cylTower: new THREE.CylinderGeometry(0.35, 0.36, 1, 18),
      pineCone1: new THREE.ConeGeometry(0.15, 0.34, 8),
      pineCone2: new THREE.ConeGeometry(0.115, 0.28, 8),
      oakCrown: new THREE.DodecahedronGeometry(0.15, 1),
      trunk: new THREE.CylinderGeometry(0.022, 0.036, 0.18, 7),
      bulletCoach: new THREE.CapsuleGeometry(0.105, 0.44, 8, 14)
    };
    this.geos.bulletCoach.rotateX(Math.PI * 0.5);
  }

  _loadEmbeddedGLBs() {
    if (!THREE.GLTFLoader) return;
    const loader = new THREE.GLTFLoader();
    const keys = Object.keys(GLB_ASSETS);
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
            if (loaded === keys.length || loaded % 4 === 0) {
              this.sim.meshDirty = true;
              this._clearVehiclePool();
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
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
        if (node.userData && node.userData.ownGeo && node.geometry) {
          node.geometry.dispose();
        }
      });
    }
  }

  // ==================== Rebuild Terrain + Continuous Sloped Roads + Real Contemporary City ====================
  rebuildStaticCityMesh() {
    this._disposeGroup(this.staticGroup);
    this.buildingEntries = [];
    this.animHooks.windRotors.length = 0;
    this.animHooks.ferrisWheels.length = 0;
    this.animHooks.radarDishes.length = 0;
    this.animHooks.smokeSources.length = 0;
    this.animHooks.beacons.length = 0;

    const isUnder = this.overlayMode === 'underground';

    // 1. 168x168 Subdivided Catmull-Rom Geological Terrain Mesh!
    const terMesh = buildHighResTerrainMesh(THREE, this.sim, this.overlayMode, this.terrainDetailTex);
    this.staticGroup.add(terMesh);

    // Bedrock Island Base Skirt
    const baseSkirt = new THREE.Mesh(this.geos.unitBox, this.mats.darkConcrete);
    baseSkirt.scale.set(GRID_SIZE + 0.25, 1.85, GRID_SIZE + 0.25);
    baseSkirt.position.set(0, -1.75, 0);
    baseSkirt.receiveShadow = true;
    this.staticGroup.add(baseSkirt);

    // 2. Continuous Corner-Welded Sloped Roads, Bridges, Elevated Viaducts, Ramps, Tunnels & HSR!
    const infraGroup = buildContinuousRoadAndViaductGroup(THREE, this.sim, this.overlayMode, this.mats);
    this.staticGroup.add(infraGroup);

    // 3. Populate Buildings, Root-Planted Forest Trees (Zero Square Base Plates!), Dams & Pylons
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
            this._addBoxMesh(wx, avgH + 0.12, wz, 0.22, 0.10, 0.22, pm, false);
            if (this.sim.getTile(x + 1, z)?.pipe) this._addBoxMesh(wx + 0.5, avgH + 0.12, wz, 0.80, 0.08, 0.12, pm, false);
            if (this.sim.getTile(x, z + 1)?.pipe) this._addBoxMesh(wx, avgH + 0.12, wz + 0.5, 0.12, 0.08, 0.80, pm, false);
          }
          if (t.metro) {
            this._addBoxMesh(wx, avgH + 0.22, wz, 0.30, 0.10, 0.30, this.mats.metroGlow, false);
            if (this.sim.getTile(x + 1, z)?.metro) this._addBoxMesh(wx + 0.5, avgH + 0.22, wz, 0.78, 0.09, 0.22, this.mats.metroGlow, false);
            if (this.sim.getTile(x, z + 1)?.metro) this._addBoxMesh(wx, avgH + 0.22, wz + 0.5, 0.22, 0.09, 0.78, this.mats.metroGlow, false);
          }
        }

        // Sloped-terrain-following Zone Pad
        if (t.zone && !t.building && !isUnder) {
          const zColors = { RL: 0x6ee7b7, RH: 0x16a34a, CL: 0x60a5fa, CH: 0x2563eb, I: 0xf59e0b, O: 0x22d3ee };
          const zm = new THREE.MeshStandardMaterial({ color: zColors[t.zone] || 0x94a3b8, roughness: 0.85, transparent: true, opacity: 0.55 });
          this._addBoxMesh(wx, avgH + 0.02, wz, 0.84, 0.02, 0.84, zm, false);
        }

        // Natural Root-Planted Forest Trees directly on sloped terrain (ZERO square LEGO plates!)
        if (!isUnder && t.trees > 0 && !t.zone && !t.building && t.roadGround === 0 && t.roadElevated === 0 && t.rail === 0 && !t.dam && this.sim.waterDepth[idx(x, z)] < 0.04) {
          const count = Math.min(3, t.trees);
          for (let k = 0; k < count; k++) {
            const ox = (hash2D(x * 7 + k, z * 13, 101) - 0.5) * 0.62;
            const oz = (hash2D(x * 11 + k, z * 17, 202) - 0.5) * 0.62;
            const txW = wx + ox;
            const tzW = wz + oz;
            const groundY = this._sampleExactSlopeHeight(txW, tzW) - 0.03;
            const scale = 0.78 + hash2D(x + k, z, 303) * 0.46;
            const isPine = avgH > 0.85 || ((x + z + k) % 3 !== 0);
            this._addSmoothTree(txW, groundY, tzW, scale, isPine, (x + k) & 1);
          }
        }

        // Monumental Hydroelectric Dam (with Structural Health & Stress Feedback)
        if (t.dam) {
          const baseH = Math.min(-0.7, minH - 0.2);
          const h = t.damCrest - baseH;
          const damHp = t.damHealth !== undefined ? t.damHealth : 100;
          const bodyMat = damHp < 65 ? this.mats.darkConcrete : this.mats.concrete;
          this._addBoxMesh(wx, baseH + h * 0.5, wz, 1.03, h, 1.03, bodyMat, true);
          this._addBoxMesh(wx, t.damCrest + 0.02, wz, 1.02, 0.04, 0.86, this.mats.viaductDeck, false);
          if (damHp < 65) {
            this._addBoxMesh(wx, t.damCrest + 0.045, wz, 0.96, 0.025, 0.14, this.mats.redCross, false);
          }
          if (t.damOutputMW > 0) {
            this._addBoxMesh(wx, t.damCrest - 0.16, wz, 0.36, 0.12, 0.36, this.mats.cyanGlow, false);
          }
        }

        // High-Voltage Steel Pylon
        if (t.pylon) {
          pylonPts.push(new THREE.Vector3(wx, avgH + 1.18, wz));
          const tower = new THREE.Mesh(this.geos.taperSpire, this.mats.steelLattice);
          tower.scale.set(0.36, 1.22, 0.36);
          tower.position.set(wx, avgH + 0.61, wz);
          tower.castShadow = true;
          this.staticGroup.add(tower);
          this._addBoxMesh(wx, avgH + 0.96, wz, 0.58, 0.04, 0.05, this.mats.steelLattice);
          this._addBoxMesh(wx, avgH + 1.15, wz, 0.42, 0.04, 0.05, this.mats.steelLattice);
        }

        // Contemporary Realistic City Buildings!
        if (t.building && !t.building.underConstruction) {
          if (isUnder) {
            const fm = (t.building.type === 'water_pump' || t.building.type === 'sewage_out' || t.building.type === 'water_treat')
              ? this.mats.pipeOk
              : (t.building.type === 'metro_station' ? this.mats.metroGlow : this.mats.darkConcrete);
            this._addBoxMesh(wx, avgH + 0.06, wz, 0.80, 0.10, 0.80, fm, false);
          } else {
            const fH = Math.max(0.06, avgH - minH + 0.08);
            this._addBoxMesh(wx, avgH - fH * 0.5 + 0.02, wz, 0.92, fH, 0.92, this.mats.concrete, true);
            const rotRad = (t.building.rot || 0) * (Math.PI * 0.5);
            const bGrp = this.archLib.buildBuilding(t.building, wx, wz, avgH + 0.02, rotRad, this.animHooks);
            this.staticGroup.add(bGrp);
            this._registerBuildingEntry(bGrp, x, z);
          }
        } else if (t.building && t.building.underConstruction && !isUnder) {
          this._addBoxMesh(wx, avgH + 0.03, wz, 0.84, 0.06, 0.84, this.mats.concrete, true);
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
          this.staticGroup.add(m);
        }
      }
    }

    this.sim.meshDirty = false;
    this.lastOverlayMode = this.overlayMode;
    this.rebuildWaterMesh();
  }

  // ==================== Environment IBL ====================
  _initEnvironmentLighting() {
    try {
      if (!THREE.PMREMGenerator) return;
      const envScene = new THREE.Scene();
      const geo = new THREE.SphereGeometry(10, 32, 16);
      const cols = [];
      const pos = geo.attributes.position;
      const top = new THREE.Color(0x6fa8e8), hor = new THREE.Color(0xdfe9f2), gnd = new THREE.Color(0x4a5246);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) / 10;
        if (y >= 0) c.copy(hor).lerp(top, Math.pow(y, 0.6));
        else c.copy(hor).lerp(gnd, Math.min(1, -y * 3));
        cols.push(c.r, c.g, c.b);
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
      envScene.add(new THREE.Mesh(geo, mat));
      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff4dc }));
      sun.material.color.multiplyScalar(6);
      sun.position.set(6, 6, 3);
      envScene.add(sun);
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const rt = pmrem.fromScene(envScene, 0.02);
      this.scene.environment = rt.texture;
      this.scene.environmentIntensity = 0.5;
      this.hemiBase = 0.70;
      pmrem.dispose();
      geo.dispose();
      mat.dispose();
    } catch {
      this.scene.environment = null;
    }
  }

  // ==================== X-ray Occlusion Fading ====================
  _registerBuildingEntry(grp, x, z) {
    const meshes = [];
    grp.traverse((n) => {
      if (n.isMesh && n.material) meshes.push({ mesh: n, orig: n.material, shadow: n.castShadow });
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
        m.mesh.castShadow = m.shadow;
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

    // Keep ghost emissive (night windows) in sync with their source materials
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
    // Stop the sight line just short of the focus so the focused building itself stays solid
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
          // Buildings right in front of the lens (street-level / close zoom) fade too
          const cx = Math.max(e.box.min.x, Math.min(cam.x, e.box.max.x));
          const cy = Math.max(e.box.min.y, Math.min(cam.y, e.box.max.y));
          const cz = Math.max(e.box.min.z, Math.min(cam.z, e.box.max.z));
          if (Math.hypot(cx - cam.x, cy - cam.y, cz - cam.z) < 1.1) level = 2;
        }
      }
      this._setEntryGhost(e, level);
    }
  }

  _addBoxMesh(x, cy, z, sx, sy, sz, mat, shadow = true) {
    const m = new THREE.Mesh(this.geos.unitBox, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, cy, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    this.staticGroup.add(m);
    return m;
  }

  _addSmoothTree(x, y, z, s = 1.0, isPine = false, altShade = 0) {
    const trk = new THREE.Mesh(this.geos.trunk, this.mats.bark);
    trk.scale.setScalar(s);
    trk.position.set(x, y + 0.08 * s, z);
    trk.castShadow = true;
    this.staticGroup.add(trk);

    if (isPine) {
      const m = altShade ? this.mats.pineLeafB : this.mats.pineLeafA;
      const c1 = new THREE.Mesh(this.geos.pineCone1, m);
      c1.scale.setScalar(s);
      c1.position.set(x, y + 0.24 * s, z);
      c1.castShadow = true;
      const c2 = new THREE.Mesh(this.geos.pineCone2, m);
      c2.scale.setScalar(s);
      c2.position.set(x, y + 0.41 * s, z);
      c2.castShadow = true;
      this.staticGroup.add(c1, c2);
    } else {
      const m = altShade ? this.mats.oakLeafB : this.mats.oakLeafA;
      const cr = new THREE.Mesh(this.geos.oakCrown, m);
      cr.scale.setScalar(s);
      cr.position.set(x, y + 0.25 * s, z);
      cr.castShadow = true;
      this.staticGroup.add(cr);
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

  _createVehicleObject(kind, variantIdx) {
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    const carKeys = ['car_green', 'car_purple', 'car_yellow', 'car_red'];
    const protoKey = kind === 'firetruck'
      ? 'car_red'
      : (kind === 'garbagetruck' ? 'car_green' : (kind === 'taxi' ? 'car_yellow' : carKeys[variantIdx % carKeys.length]));

    if (this.glbProtos[protoKey] && kind !== 'bus') {
      const model = this.glbProtos[protoKey].clone();
      const s = (kind === 'truck' || kind === 'firetruck' || kind === 'garbagetruck') ? 0.122 : 0.105;
      model.scale.setScalar(s);
      grp.add(model);

      if (kind === 'firetruck') {
        const bar = new THREE.Mesh(this.geos.unitBox, this.mats.redCross);
        bar.scale.set(0.11, 0.035, 0.04);
        bar.position.set(0, 0.15, 0.04);
        bar.name = 'strobe';
        grp.add(bar);
      } else if (kind === 'garbagetruck') {
        const hopper = new THREE.Mesh(this.geos.unitBox, this.mats.garbageGreen);
        hopper.scale.set(0.14, 0.09, 0.18);
        hopper.position.set(0, 0.10, -0.05);
        grp.add(hopper);
      }
    } else {
      const coach = new THREE.Mesh(this.geos.bulletCoach, kind === 'firetruck' ? this.mats.redCross : this.mats.bulletStripe);
      coach.scale.set(0.65, 0.65, 0.55);
      coach.position.y = 0.08;
      coach.castShadow = true;
      grp.add(coach);
    }
    return grp;
  }

  // Bilinear sample of a 57x57 corner height field (roadCornerY / elevCornerY / railCornerY) at world XZ
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

  // Point on the rendered track centreline inside tile path[k] at local parameter s in [0..1]
  // (s=0: entry edge midpoint, s=0.5: tile middle / arc midpoint, s=1: exit edge midpoint)
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
      // Junction tile: track is drawn as straight crossing lines through the tile centre
      if (s < 0.5) {
        const f = s / 0.5;
        return { x: eInX + (c.wx - eInX) * f, z: eInZ + (c.wz - eInZ) * f };
      }
      const f = (s - 0.5) / 0.5;
      return { x: c.wx + (eOutX - c.wx) * f, z: c.wz + (eOutZ - c.wz) * f };
    }
    // Quarter-circle arc (radius 0.5) around the tile corner shared by entry & exit edges
    const pivX = c.wx - inX * 0.5 + outX * 0.5;
    const pivZ = c.wz - inZ * 0.5 + outZ * 0.5;
    const th = s * Math.PI * 0.5;
    const ct = Math.cos(th), st = Math.sin(th);
    return {
      x: pivX + (-outX * ct + inX * st) * 0.5,
      z: pivZ + (-outZ * ct + inZ * st) * 0.5
    };
  }

  // World position {x, y, z} at path distance d (d in [0, path.length-1], integer d = tile middle)
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
      // Ride exactly on the welded steel rail heads of the rendered slab track
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
      body.castShadow = true;
      const stripe = new THREE.Mesh(this.geos.unitBox, this.mats.bulletStripe);
      stripe.scale.set(0.215, 0.035, 0.56);
      stripe.position.y = 0.11;
      g.add(body, stripe);
    }
    g.rotation.order = 'YXZ';
    g.userData.isHead = Boolean(isHead);
    return g;
  }

  // Exact rendered deck height under a road vehicle (null => keep traffic-computed height)
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

    // Road Vehicles
    const activeCars = isUnder ? [] : this.traffic.vehicles;
    while (this.vehiclePool.length < activeCars.length) {
      const idxV = this.vehiclePool.length;
      const v = activeCars[idxV];
      const obj = this._createVehicleObject(v.kind, idxV);
      this.vehicleGroup.add(obj);
      this.vehiclePool.push({ kind: v.kind, obj });
    }

    for (let i = 0; i < this.vehiclePool.length; i++) {
      const slot = this.vehiclePool[i];
      if (i >= activeCars.length || activeCars[i].inTunnel) {
        slot.obj.visible = false;
        continue;
      }
      const v = activeCars[i];
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

    // Bullet Trains & Metro Trains (follow exact rendered track curves & deck heights)
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
        if (c === tr.cars - 1 && tr.cars > 1) yaw += Math.PI; // tail cab faces backward

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

    // Lightweight VFX & Previews
    this._disposeGroup(this.uiOverlayGroup);

    if (!isUnder) {
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        const b = t.building;
        if (!b) continue;
        const { wx, wz } = tileToWorld(t.x, t.z);
        const y0 = this.sim.getTileElev(t.x, t.z);

        if (b.underConstruction) {
          const h = 0.25 + (b.buildProgress || 0.2) * 0.9;
          const scaf = new THREE.Mesh(this.geos.unitBox, this.mats.goldGlow);
          scaf.scale.set(0.62, h, 0.62);
          scaf.position.set(wx, y0 + h * 0.5, wz);
          this.uiOverlayGroup.add(scaf);
        } else if (b.fire > 0.05) {
          for (let f = 0; f < 2; f++) {
            const ph = (this.clock * 2.4 + f * 0.5 + i * 0.17) % 1.0;
            const fl = new THREE.Sprite(new THREE.SpriteMaterial({
              map: this.smokeTex,
              color: ph < 0.5 ? 0xff6b1a : 0x333333,
              transparent: true,
              opacity: 0.85 * (1 - ph * 0.6)
            }));
            fl.position.set(wx, y0 + 0.4 + ph * 1.1, wz);
            fl.scale.setScalar(0.45 + ph * 0.4);
            this.uiOverlayGroup.add(fl);
          }
        }
      }

      for (let i = 0; i < this.animHooks.smokeSources.length; i++) {
        const s = this.animHooks.smokeSources[i];
        const ph = (this.clock * 0.42 + i * 0.29) % 1.0;
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: this.smokeTex,
          color: s.isSteam ? 0xf8fafc : 0xdbe2ec,
          transparent: true,
          opacity: (s.isSteam ? 0.52 : 0.40) * (1 - ph)
        }));
        sp.position.set(s.x + ph * 0.22, s.y + ph * 0.65, s.z - ph * 0.12);
        sp.scale.setScalar(0.24 + ph * 0.45);
        this.uiOverlayGroup.add(sp);
      }
    }

    if (this.disasters) {
      for (const m of this.disasters.meteors) {
        const mx = m.start[0] + (m.end[0] - m.start[0]) * m.t;
        const my = m.start[1] + (m.end[1] - m.start[1]) * m.t;
        const mz = m.start[2] + (m.end[2] - m.start[2]) * m.t;
        const ball = new THREE.Mesh(this.geos.waterSphere, new THREE.MeshBasicMaterial({ color: 0xff7b1c }));
        ball.scale.setScalar(2.4);
        ball.position.set(mx, my, mz);
        this.uiOverlayGroup.add(ball);
      }
      if (this.disasters.tornado) {
        const tor = this.disasters.tornado;
        for (let r = 0; r < 12; r++) {
          const ring = new THREE.Mesh(this.geos.cylTower, this.mats.darkConcrete);
          const sc = 0.4 + r * 0.25;
          ring.scale.set(sc, 0.42, sc);
          ring.position.set(tor.wx + Math.sin(this.clock * 10 + r) * 0.16, 0.3 + r * 0.42, tor.wz + Math.cos(this.clock * 10 + r) * 0.16);
          this.uiOverlayGroup.add(ring);
        }
      }
    }

    const prevMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.previewColor[0], this.previewColor[1], this.previewColor[2]),
      transparent: true,
      opacity: 0.62
    });
    for (const pos of this.previewTiles) {
      if (!inBounds(pos.x, pos.z)) continue;
      const { wx, wz } = tileToWorld(pos.x, pos.z);
      const py = Math.max(this.sim.getTileElev(pos.x, pos.z), this.sim.getTileElev(pos.x, pos.z) + this.sim.waterDepth[idx(pos.x, pos.z)]) + 0.06;
      const hl = new THREE.Mesh(this.geos.unitBox, prevMat);
      hl.scale.set(0.92, 0.06, 0.92);
      hl.position.set(wx, py, wz);
      this.uiOverlayGroup.add(hl);
    }

    if (this.selectedTile && inBounds(this.selectedTile.x, this.selectedTile.z)) {
      const { wx, wz } = tileToWorld(this.selectedTile.x, this.selectedTile.z);
      const sy = this.sim.getTileElev(this.selectedTile.x, this.selectedTile.z) + 0.08;
      const sel = new THREE.Mesh(this.geos.unitBox, this.mats.cyanGlow);
      sel.scale.set(0.98, 0.04, 0.98);
      sel.position.set(wx, sy, wz);
      this.uiOverlayGroup.add(sel);
    }

    if (!isUnder && this.selectedVehicle && this.traffic.vehicles.includes(this.selectedVehicle) && !this.selectedVehicle.inTunnel) {
      const v = this.selectedVehicle;
      const pulse = 1.0 + Math.sin(this.clock * 7.5) * 0.14;
      const halo = new THREE.Mesh(this.geos.cylTower, this.mats.goldGlow);
      halo.scale.set(0.68 * pulse, 0.035, 0.68 * pulse);
      halo.position.set(v.wx, (v.wy || 0) + 0.24, v.wz);
      this.uiOverlayGroup.add(halo);
    }

    if (!isUnder) {
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        if (!t.dam) continue;
        const damHp = t.damHealth !== undefined ? t.damHealth : 100;
        if ((t.damStress || 0) >= 0.75 || damHp < 65) {
          const { wx, wz } = tileToWorld(t.x, t.z);
          if (strobeRed) {
            const warn = new THREE.Mesh(this.geos.waterSphere, this.mats.redCross);
            warn.scale.setScalar(0.32);
            warn.position.set(wx, t.damCrest + 0.16, wz);
            this.uiOverlayGroup.add(warn);
          }
          const ph = (this.clock * 3.0 + i * 0.23) % 1.0;
          const spray = new THREE.Sprite(new THREE.SpriteMaterial({
            map: this.smokeTex,
            color: 0xe0f2fe,
            transparent: true,
            opacity: 0.72 * (1 - ph)
          }));
          spray.position.set(wx, t.damCrest + 0.06 - ph * 0.28, wz + 0.35 * ph);
          spray.scale.setScalar(0.32 + ph * 0.48);
          this.uiOverlayGroup.add(spray);
        }
      }
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
    if (this.scene.environment) this.scene.environmentIntensity = 0.5 * (1 - night * 0.85);

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
