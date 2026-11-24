// External Binary PBR Asset Loader, iOS Offline Cache Manager & IndexedDB + localStorage Dual-Write Saves

const IDB_NAME = 'mini_skylines_pro_idb';
const IDB_STORE = 'saves';
const IDB_VERSION = 1;

export class SaveStorage {
  constructor() {
    this._dbPromise = null;
  }

  _openDB() {
    if (this._dbPromise) return this._dbPromise;
    if (typeof indexedDB === 'undefined') {
      this._dbPromise = Promise.resolve(null);
      return this._dbPromise;
    }
    this._dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = (ev) => {
          const db = ev.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return this._dbPromise;
  }

  saveSyncAndAsync(key, dataObj) {
    const raw = typeof dataObj === 'string' ? dataObj : JSON.stringify(dataObj);
    let lsOk = false;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, raw);
        lsOk = true;
      }
    } catch {
      lsOk = false;
    }
    this._openDB().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(raw, key);
      } catch {}
    });
    return lsOk;
  }

  async save(key, dataObj) {
    const raw = typeof dataObj === 'string' ? dataObj : JSON.stringify(dataObj);
    let ok = false;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, raw);
        ok = true;
      }
    } catch {}
    const db = await this._openDB();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(raw, key);
          tx.oncomplete = () => { ok = true; resolve(); };
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    }
    return ok;
  }

  loadSync(key) {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async load(key) {
    const db = await this._openDB();
    if (db) {
      const idbRaw = await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const req = tx.objectStore(IDB_STORE).get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
      if (idbRaw) {
        try {
          // Keep localStorage mirrored if it was cleared by iOS storage pressure
          if (typeof localStorage !== 'undefined' && !localStorage.getItem(key)) {
            try { localStorage.setItem(key, idbRaw); } catch {}
          }
          return typeof idbRaw === 'string' ? JSON.parse(idbRaw) : idbRaw;
        } catch {}
      }
    }
    return this.loadSync(key);
  }
}

export const saveStorage = new SaveStorage();

export class AssetManager {
  constructor(baseUrl = './') {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.manifest = null;
    this.textures = {}; // key -> { map, normalMap, roughnessMap }
    this.glbs = {};
    this.isExternalSupported =
      typeof window !== 'undefined' &&
      typeof fetch === 'function' &&
      typeof location !== 'undefined' &&
      (location.protocol === 'https:' || location.protocol === 'http:');
  }

  async loadManifest() {
    if (this.manifest) return this.manifest;
    if (!this.isExternalSupported) return null;
    try {
      const res = await fetch(`${this.baseUrl}assets/manifest.json`, { cache: 'no-cache' });
      if (!res.ok) return null;
      this.manifest = await res.json();
      return this.manifest;
    } catch {
      return null;
    }
  }

  async loadPBRTextures(THREE, { quality = 'high', onProgress = null, onSuiteUpdate = null, onAlbedoReady = null } = {}) {
    if (!THREE || !THREE.TextureLoader || !this.isExternalSupported) {
      if (onProgress) onProgress(1, '内置材质已就绪');
      if (onAlbedoReady) onAlbedoReady(this.textures);
      return this.textures;
    }
    const manifest = await this.loadManifest();
    if (!manifest || !Array.isArray(manifest.textures)) {
      if (onProgress) onProgress(1, '使用内置高清材质');
      if (onAlbedoReady) onAlbedoReady(this.textures);
      return this.textures;
    }

    const loadPbrMaps = quality !== 'eco';
    const albedoJobs = [];
    const detailJobs = [];
    for (const entry of manifest.textures) {
      albedoJobs.push({ key: entry.key, channel: 'map', url: this.baseUrl + entry.albedo, srgb: true });
      if (loadPbrMaps) {
        if (entry.normal) detailJobs.push({ key: entry.key, channel: 'normalMap', url: this.baseUrl + entry.normal, srgb: false });
        if (entry.roughness) detailJobs.push({ key: entry.key, channel: 'roughnessMap', url: this.baseUrl + entry.roughness, srgb: false });
      }
    }

    const loader = new THREE.TextureLoader();
    const runBatch = async (jobs, concurrency, phaseLabel, emitEvery) => {
      let done = 0;
      const total = Math.max(1, jobs.length);
      let cursor = 0;
      const loadOne = (job, attempt = 0) => new Promise((resolve) => {
        loader.load(
          job.url,
          (tex) => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.anisotropy = quality === 'high' ? 4 : 2;
            tex.colorSpace = job.srgb ? THREE.SRGBColorSpace : (THREE.NoColorSpace || THREE.LinearSRGBColorSpace);
            tex.needsUpdate = true;
            this.textures[job.key][job.channel] = tex;
            resolve(true);
          },
          undefined,
          () => {
            if (attempt < 1) {
              setTimeout(() => loadOne(job, attempt + 1).then(resolve), 220);
              return;
            }
            resolve(false);
          }
        );
      });

      const runWorker = async () => {
        while (cursor < jobs.length) {
          const job = jobs[cursor++];
          if (!this.textures[job.key]) this.textures[job.key] = {};
          if (!this.textures[job.key][job.channel]) {
            await loadOne(job, 0);
          }
          done++;
          if (onProgress) onProgress(done / total, `${phaseLabel} (${done}/${total})`);
          if (onSuiteUpdate && (done % emitEvery === 0 || done === total)) {
            onSuiteUpdate(this.textures);
          }
        }
      };

      const workers = [];
      for (let i = 0; i < Math.min(concurrency, jobs.length || 1); i++) workers.push(runWorker());
      await Promise.all(workers);
    };

    // Stage 1: Priority 14 Albedo Color Maps first (high concurrency over HTTP/2 + instant per-map live hot-apply!)
    await runBatch(albedoJobs, 10, '加载主视觉高清贴图', 2);
    if (onSuiteUpdate) onSuiteUpdate(this.textures);
    if (onAlbedoReady) onAlbedoReady(this.textures);

    // Stage 2: Stream 28 Normal & Roughness relief maps smoothly in background with progressive hot-bind!
    if (detailJobs.length > 0) {
      await runBatch(detailJobs, 8, '补全 PBR 法线/光泽贴图', 4);
      if (onSuiteUpdate) onSuiteUpdate(this.textures);
    }
    return this.textures;
  }

  async loadGLBModels(THREE, { onProgress = null } = {}) {
    if (!THREE || !THREE.GLTFLoader || !this.isExternalSupported) {
      if (onProgress) onProgress(1, '内置模型已就绪');
      return this.glbs;
    }
    const manifest = await this.loadManifest();
    if (!manifest || !Array.isArray(manifest.models) || manifest.models.length === 0) {
      if (onProgress) onProgress(1, '模型就绪');
      return this.glbs;
    }

    const loader = new THREE.GLTFLoader();
    const list = manifest.models;
    const total = list.length;
    let done = 0;
    let cursor = 0;

    // Normalize any loaded GLB into a clean ground-seated Group (minY = 0, centered XZ)
    // and bake any SkinnedMesh into a static rest-pose Mesh so multi-instance cloning never distorts!
    const normalizeProto = (rawScene) => {
      rawScene.updateMatrixWorld(true);
      const wrap = new THREE.Group();
      const meshes = [];
      rawScene.traverse((n) => {
        if (!n.isMesh || !n.geometry) return;
        meshes.push(n);
      });

      const invRoot = new THREE.Matrix4().copy(rawScene.matrixWorld).invert();
      for (const n of meshes) {
        const geo = n.geometry.clone();
        const relMat = new THREE.Matrix4().multiplyMatrices(invRoot, n.matrixWorld);
        geo.applyMatrix4(relMat);
        if (!geo.attributes.normal) geo.computeVertexNormals();
        const matSrc = n.material;
        const fixMat = (mt) => {
          if (!mt) return mt;
          if (mt.map) {
            mt.map.colorSpace = THREE.SRGBColorSpace;
            mt.map.anisotropy = 4;
          }
          if (mt.roughness !== undefined && mt.roughness > 0.92) mt.roughness = 0.72;
          if (mt.metalness !== undefined && mt.metalness > 0.85) mt.metalness = 0.35;
          return mt;
        };
        const mat = Array.isArray(matSrc) ? matSrc.map(fixMat) : fixMat(matSrc);
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = true;
        m.receiveShadow = true;
        wrap.add(m);
      }

      wrap.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(wrap);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      if (isFinite(box.min.y) && isFinite(box.max.y)) {
        box.getSize(size);
        box.getCenter(center);
        for (const ch of wrap.children) {
          ch.position.x -= center.x;
          ch.position.y -= box.min.y;
          ch.position.z -= center.z;
        }
      }
      wrap.userData.origSize = { x: size.x || 1, y: size.y || 1, z: size.z || 1 };
      return wrap;
    };

    const runWorker = async () => {
      while (cursor < total) {
        const entry = list[cursor++];
        if (this.glbs[entry.key]) {
          done++;
          if (onProgress) onProgress(done / total, `加载 3D 资产 (${done}/${total})`);
          continue;
        }
        const loadOne = (attempt = 0) => new Promise((resolve) => {
          loader.load(
            this.baseUrl + entry.url,
            (gltf) => {
              try {
                this.glbs[entry.key] = normalizeProto(gltf.scene);
              } catch {}
              done++;
              if (onProgress) onProgress(done / total, `加载 3D 精品模型 (${done}/${total})`);
              resolve();
            },
            undefined,
            () => {
              if (attempt < 1) {
                setTimeout(() => loadOne(attempt + 1).then(resolve), 240);
                return;
              }
              done++;
              if (onProgress) onProgress(done / total, `加载模型 (${done}/${total})`);
              resolve();
            }
          );
        });
        await loadOne(0);
      }
    };

    const workers = [];
    for (let i = 0; i < 2; i++) workers.push(runWorker());
    await Promise.all(workers);
    return this.glbs;
  }

  getCacheName() {
    const ver = (this.manifest && this.manifest.version) || 'v8.5';
    return `mini-skylines-${ver}`;
  }

  getAssetCacheName() {
    const ver = (this.manifest && this.manifest.version) || 'v8.5-dev';
    const assetHash = ver.split('-')[1] || 'dev';
    return `mini-skylines-assets-${assetHash}`;
  }

  async getOfflineCacheStatus() {
    if (typeof caches === 'undefined' || !this.isExternalSupported) {
      return { supported: false, version: 'offline-inline', cachedCount: 0, totalCount: 0, totalBytes: 0, complete: false };
    }
    const manifest = await this.loadManifest();
    const version = (manifest && manifest.version) || 'v8.5';
    const coreUrls = ['./', './index.html', './app.bundle.js', './vendor/three_classic.js', './manifest.json', './assets/manifest.json'];
    const assetUrls = manifest && Array.isArray(manifest.files) ? manifest.files.map((f) => './' + f.path) : [];
    const totalCount = coreUrls.length + assetUrls.length;
    const totalBytes = (manifest ? manifest.totalBytes : 0) + 1400000;

    let cachedCount = 0;
    try {
      const names = await caches.keys();
      const codeCacheName = names.find((n) => n === this.getCacheName()) || names.find((n) => n.startsWith('mini-skylines-v'));
      const assetCacheName = names.find((n) => n === this.getAssetCacheName()) || codeCacheName;
      if (codeCacheName) {
        const codeCache = await caches.open(codeCacheName);
        for (const u of coreUrls) {
          if (await codeCache.match(u, { ignoreSearch: true })) cachedCount++;
        }
      }
      if (assetCacheName) {
        const assetCache = await caches.open(assetCacheName);
        for (const u of assetUrls) {
          if (await assetCache.match(u, { ignoreSearch: true })) cachedCount++;
        }
      }
    } catch {}

    return {
      supported: true,
      version,
      cachedCount,
      totalCount,
      totalBytes,
      complete: totalCount > 0 && cachedCount >= totalCount - 1
    };
  }

  async cacheAllOfflineAssets(onProgress = null) {
    if (typeof caches === 'undefined' || !this.isExternalSupported) {
      return { ok: false, reason: '当前运行环境不支持离线 Cache Storage（仅 HTTPS / PWA 可用）' };
    }
    const manifest = await this.loadManifest();
    const coreUrls = ['./', './index.html', './app.bundle.js', './vendor/three_classic.js', './manifest.json', './assets/manifest.json'];
    const assetUrls = manifest && Array.isArray(manifest.files) ? manifest.files.map((f) => './' + f.path) : [];
    const items = [
      ...coreUrls.map((url) => ({ url, isAsset: false })),
      ...assetUrls.map((url) => ({ url, isAsset: true }))
    ];

    const codeCache = await caches.open(this.getCacheName());
    const assetCache = await caches.open(this.getAssetCacheName());
    let done = 0;
    let failed = 0;
    const total = Math.max(1, items.length);

    const concurrency = 6;
    let cursor = 0;
    const run = async () => {
      while (cursor < items.length) {
        const item = items[cursor++];
        const targetCache = item.isAsset ? assetCache : codeCache;
        try {
          const existing = await targetCache.match(item.url, { ignoreSearch: true });
          if (!existing) {
            const resp = await fetch(item.url, { cache: 'reload' });
            if (resp && resp.ok) {
              await targetCache.put(item.url, resp.clone());
            } else {
              failed++;
            }
          }
        } catch {
          failed++;
        }
        done++;
        if (onProgress) onProgress(done / total, done, total);
      }
    };

    const workers = [];
    for (let i = 0; i < concurrency; i++) workers.push(run());
    await Promise.all(workers);

    return { ok: failed === 0, cached: done - failed, total: items.length, failed, version: this.manifest?.version || 'v8.5' };
  }

  async checkForUpdates() {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return { supported: false, updated: false };
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return { supported: true, updated: false };
      await reg.update();
      return { supported: true, updated: Boolean(reg.waiting || reg.installing) };
    } catch {
      return { supported: true, updated: false };
    }
  }
}
