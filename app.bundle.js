(function () {
"use strict";
const __M = {};

// ====== MODULE: assets_bundle.js ======
(function () {
// Slim PWA asset stub (heavy textures & models served as binary files under ./assets/)
const SMOKE_PNG_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAODklEQVR4nO3d+3XbRhbH8d9sA1YqMF1BuBWIriDqwEwF0VYQbgVRB2YqMF1B4ApMV7BMBWYquPsHhhJE8wUS88T3c45OYlkExjpnLu6dFyQAAAAAI+JSNwBhmNnPkiaSpv5bU0l3F358K2nt/38taeOc+zZoA5EFAkAFfGefqe3ku68Q1p2vhqBQPgJAgczsjaQHtZ1+pvZJn8JGUiNppTYg/JOoHbgSAaAQvtPPJM39fy9N52PZqg0GSxEMgGGY2Vsz+2hm360c383sDzN7m/r3BxTJzO7N7K+UvXggn8zsPvXvEyiC1dPx9xEIMsQYQCasTZeXauv7mi0lLZxzf6duCKR/pW7A2JnZGzP7Q+2I+ixta6KYS9qY2e+pGwIygKR8SrxSfiP6sWwlPTjnvqRuyFiRASTgn/p/qZ02G2vnl9p/e+MzICRABhAZT/2jyAYSIAOIxD/1P4qn/jG7bOC31A0ZEzKACKxdxdco3Br92iydc7+mbsQYkAEEZu1GnbXo/H3Mzeyr/90hIDKAgMzsg6QnkfJfaytpxq7DcMgAAvEj20vR+W+xGxf4kLohtSIDCMAP9s1Tt6Myc+fcn6kbURsCwMDo/EERBAZGALiAX6c/0etjtWZHfvzY93G77lFlx76/8V9rziQ4jwDQ4afrpno5XmsiRu9L18gHBLVBgYVGHaMPAGb2i16O1qKzj0Pjv1Zjn2EYXQCwl6O1HkStjrZ8WKoNBqPLDkYTAPyikke1HZ+pORyyURsMlmM5r6D6AODnkB9Feo9+VpKeas8Kqg0A/sCJudIdmY06rNWeYPQ5dUNCqC4A+EG9pUjzMay12nUIVQ0aVhMAfI2/FKk+wlqpDQRVrDEofi+A32f/Sey4QxwPkra1nGlYdAbgB/gWos5HGsWXBcUGANbcIyPF7lEoLgD4Wn8lnvrIS6P2TMOixgaKGgPwKX8jOj/yM5O0Lu0Uo2IyAN/5l6nbAZxR1ClGRWQAndN1gNwVdYpR9hkAg30oWPaDg1kHAD/XukjdDuAGs5z3E2QbAKj5UYmsxwSyDAB0flQm2yCQXQDw0yiN2MyDumwlTXJbJ5DVLIA/fLMRnR/12c0OvEndkK5sAoD/xfDWXNRsqsxK22wCgNpXaLGbD7V7yGknYRZjAP6V0E+p2wFElMX0YPIAwKAfRmojaZp6UDCHEoC352KMJspgPCBpAPCp/yxlG4CEHszsPmUDkpUAfspvLZ7+GLeNEpYCKTMAUn+gLQUeU908SQbg054mxb2BTE1SvI0oVQawSHRfIFeLFDeNngH4F3esYt8XKED0tQEpMoBFgnsCJZjHvmHUDIDaHzgr6lhA7Awg2WgnUIhFzJtFywD8vP8m1v2Agt3FWhcQMwPg6Q9cZh7rRjEzgO9i4Q9wiY1z7l2MG0XJAPzUH50fuMzEl8zBxSoBHiLdB6jFPMZNopQApP9Ab1HKgOAZAOk/cJUoZUCMEmAW4R5AjYKXzgQAIF+z0DcIOgbgj/rehrwHULGtc+6nkDcInQHMAl8fqNmdPzQ3mNABgHP+gdsE7UNkAEDeig4AZADAbYL2oWCDgAwAAoMIOhAYMgPg6Q/c7i7kG4VDBoBJwGsDYxLsYUoAAEaMAADkbxbqwgQAYMRyeDswgNOC7aYlAwDyxyAggOFRAgAjRgAARowAAIxYkABgZh9CXBcYqWmocwEG3wzkO/9y6OsCI7dV+/rwb0NedNAA4E8AXg15TQDPBg8CgwUAn6I04ghwIKSNpOlQLw8dJAD488vXovMDMazVZgI3B4GhBgFXovMDsUwlPQ1xoZsDgJl9Eod/ALHNzez3Wy9yUwnAiD+Q3Mw59+XaD18dAPyg3/razwMYxFbS5NrxgKtKAH9G2fKazwIY1J1umHq/dgxgIep+IBczM/vtmg/2LgHM7F7tfD+AfFy1SOiaAPA/sdcfyFHjnHvf5wO9SgA/7TDp8xkA0cz6bsS7OAPwq/02fVsEIKpeswJ9MoDFVc0BENOdevTVizIABv6A4kycc3+f+6FLM4DFbW0BENnikh86mwGw4g8o1tks4JIMYJBdRwCiW5z7gZMZACP/QPFOZgHnMoDFsG0BENnjqb88lwF8Fwd9ACXbOud+OvaXRzMAv6KIzg+U7c4f1nvQqRLgIUBjAMQ3P/YXB0sAv99/G6o1AKK7O7Q8+FgGwNMfqMvBPk0AAMbhYJ8+VgJY2LYAiOzgbMAPGYDf+AOgLneHXjB6qASYhW8LgAR+KAMIAMB4zPa/8cMYAKv/gGr9MA7wKgPwm3/o/ECd7vwan2f7JcAkXlsAJPDqfR77AWAWrx0AEph1/7AfAEj/gbq96uP7AYDXfQF1O1kCABgRBgGBcZl0//BqHQB7AID6Oeee+z0lADBiBABgxAgAwIgRAIARIwAAI0YAAEaMAACM2H4AaFI0AkA0TfcPZADAiBEAgHF59cIfSgBgXNbdP+wHAF4HBtTtZAawFoCancwANvHaASCBVwGAY8GB8Th9LLhHGQDUqdn/xqEA8MMPAajCDw93AgAwHs3+N3g9ODAOl70e3FsFbgyAuJpD3yQAAONwsE8fKwHeijUBQE3unHP/7H/zYAbgnPtbTAcCtVgd6vzS6d2AT4EaAyCuoyX9wRJAkvx7xDdiVSBQsoOj/ztHMwCfMjAYCJTtZB8+mgFIDAYCFZj4Mb2DTp4I5D/YDN0iAFE0pzq/dCYDkCQzuxdBACjRyae/dMGZgM65LyIAAKU5+/SXLsgAJLIAoEBT59y3cz900anAPgtgRgAow/KSzi9dmAFIzAgABTlb++9c/F4Af8HFtS0CEMXi0s4v9cgApOfVgWtJk56NAhDexjn3rs8Her0ZyK8OnPf5DIBo5n0/0PvVYH5AkI1CQF4Wvm/20qsE2KEUALKyUTvtd3DL7ylXvRyUUgDIxlbSwzWdX7rh7cA+3Xi89vMABrG4dM7/kKtKgC4z+yiyASCFpXPu11suMEQAeKN2mfD01msBuNha0uza1H/n5gAgPa8SXIvTg4AYtmpX+93U+aUbxgC6/MqjmfbePQ5gcFsN8OTfGSQD2GHXIBDc7Jr5/mMGyQB2fMPmQ14TwLP5kJ1fGjgD2DGzD5KWIa4NjNTcOffn0BcNEgAkXjAKDKhxzr0PceFBSwAAZSEAACMWMgAwJQhkLmQA4OWiwDCaUBemBABGjAAAjFjIANAEvDYwJsHKaTIAIH/BBtQZBATytwl1YaYBgcz1Oee/97VDXVhiOTAwgLVz7t+hLh56DGAT+PpA7YKW0gQAIG+bkBcPHQCawNcHateEvHjoAMBMAHCbokuAJvD1gZqthzr775igAcA3niwAuE7wvhNjJWAT4R5AjVahbxAjAAT/RwCVakLfIHgA8KeYsioQ6GcVuv6X4m0GIgsA+onSZwgAQJ7qCQDOuc+iDAAuFSX9l+KeB7CMeC+gZNEy5qC7AbvM7GexJgA4Z7A3/14iWgbgnPsm1gQA5zzF6vxS/CPBlpHvB5RmGfNmUQOAf7nhJuY9gYIsQ57+c0iKQ0EXCe4JlGAR+4bRAwBZAHBQ9Ke/FHEWoMvMfhGLg4CuSYoAkOS9AH5hUJPi3kCGFik6v5QoA5BYFwB4G0nTmFN/XcneDOTXBTyluj+QicdUnV9KmAFIkpm9UZsFTFK2A0ikcc69T9mApAFAkszsXowHYHyiLvk9JvnLQf2BIZQCGJt56s4vZZAB7JjZV0nT1O0AIlg45/6buhFSXgHgjdoR0bvETQFCCvquv76SlwA7Ph2apW4HENBG0kPqRnRlEwCk56nBeep2AAFsJT2kWvBzTFYBQHreK7BI3Q5gYHP/gMtKNmMA+8zso8gGUIe5f7BlJ7sMYMc596s4QARl2yrjzi9lnAHsmNkHEQhQnq2kWY5pf1f2AUAiCKA4RXR+KeMSoMunUHPxbgHkr5jOLxWSAez4LcQrsXkIeVorw6m+U4rIAHZ8VJ2KcwSQnye1T/5iOr9UWACQXq0YfEzcFEB6Gen/Tw6be/oqqgTY57cSL0VJgDQatQd6FFHvH1JcBtDlnPvinHunNv1igBAxLZxz70vu/FLhGUCXHyBcii3FCKtRm/IXVesfU3QG0OWc++a3WT6I9w5geBu1g3zva+n8UkUBYMc599mXBY8iEOB2G7VP/Hf+9KqqVFMCHOIPGXlQGwwoDdDHWm2d/zl1Q0KqOgB0mdlb+blaceoQjluqfU1XdU/7Q0YTALr83oIHZXY6C5Jp1Hb8VYlz+bcYZQDo8sFgqjYzoEwYh63aTt+ofdqPqtN3jT4AdPmpxIlegsFUlAs12Oilw69Ln7sfEgHgDD+QOFUbGCZqA8KpTGEWvFE4ZKt24O7Vf8dSy1+LADAwvzx5JTKHoe3W3Fc9Kh8bASAAX0o0IggMpag99iUhAARCEBgMnT8gAkBABIGb0fkDq24pcE46B5gsEzelREtJUzp/WGQAkZjZH+IQk0st/bHwCIwAEJFfdPQkSoJTsj5HvzYEgMg4t+CojdoDNUn5I2IMILLOuQWL1G3JyJPfbkvnj4wMICG/aOhJ480GWNyTGBlAQv5Mw7FmAwvn3E90fkDt2ICZfbT6fbJ2HATAPjO7N7OvaftoEF+tLXkAnGNtIPiUts8O4quZ/ZL69wkUyV5Kg+9Ju3F/n4wnfvaYBSiEtecSzP1XrrMGG72cqVfN0dk1IwAUyNpBtLnyOMZso/b8gyXz+OUhABTO2tOOZ52vSeBbbuSP1lJ7iCZP+oIRACpjL0eYzfRyjNnuq4/N3lej9oit0R6gCQAAAACF+z/UP4XNZ01PuwAAAABJRU5ErkJggg==";
const GLB_ASSETS = {};

Object.assign(__M, { SMOKE_PNG_URI, GLB_ASSETS });
})();

// ====== MODULE: asset_loader.js ======
(function () {
// External Binary PBR Asset Loader, iOS Offline Cache Manager & IndexedDB + localStorage Dual-Write Saves

const IDB_NAME = 'mini_skylines_pro_idb';
const IDB_STORE = 'saves';
const IDB_VERSION = 1;
class SaveStorage {
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
const saveStorage = new SaveStorage();
class AssetManager {
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

  async loadPBRTextures(THREE, { quality = 'high', onProgress = null } = {}) {
    if (!THREE || !THREE.TextureLoader || !this.isExternalSupported) {
      if (onProgress) onProgress(1, '内置材质已就绪');
      return this.textures;
    }
    const manifest = await this.loadManifest();
    if (!manifest || !Array.isArray(manifest.textures)) {
      if (onProgress) onProgress(1, '使用内置高清材质');
      return this.textures;
    }

    const loadPbrMaps = quality !== 'eco';
    const jobs = [];
    for (const entry of manifest.textures) {
      jobs.push({ key: entry.key, channel: 'map', url: this.baseUrl + entry.albedo, srgb: true });
      if (loadPbrMaps) {
        if (entry.normal) jobs.push({ key: entry.key, channel: 'normalMap', url: this.baseUrl + entry.normal, srgb: false });
        if (entry.roughness) jobs.push({ key: entry.key, channel: 'roughnessMap', url: this.baseUrl + entry.roughness, srgb: false });
      }
    }

    const loader = new THREE.TextureLoader();
    let done = 0;
    const total = Math.max(1, jobs.length);
    const concurrency = 6;
    let cursor = 0;

    const runWorker = async () => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++];
        if (!this.textures[job.key]) this.textures[job.key] = {};
        if (this.textures[job.key][job.channel]) {
          done++;
          if (onProgress) onProgress(done / total, `加载 PBR 纹理 (${done}/${total})`);
          continue;
        }
        await new Promise((resolve) => {
          loader.load(
            job.url,
            (tex) => {
              tex.wrapS = THREE.RepeatWrapping;
              tex.wrapT = THREE.RepeatWrapping;
              tex.anisotropy = quality === 'high' ? 4 : 2;
              tex.colorSpace = job.srgb ? THREE.SRGBColorSpace : (THREE.NoColorSpace || THREE.LinearSRGBColorSpace);
              tex.needsUpdate = true;
              this.textures[job.key][job.channel] = tex;
              done++;
              if (onProgress) onProgress(done / total, `加载高清 PBR 贴图 (${done}/${total})`);
              resolve();
            },
            undefined,
            () => {
              done++;
              if (onProgress) onProgress(done / total, `加载贴图 (${done}/${total})`);
              resolve();
            }
          );
        });
      }
    };

    const workers = [];
    for (let i = 0; i < concurrency; i++) workers.push(runWorker());
    await Promise.all(workers);
    return this.textures;
  }

  getCacheName() {
    const ver = (this.manifest && this.manifest.version) || 'v7.0';
    return `mini-skylines-${ver}`;
  }

  async getOfflineCacheStatus() {
    if (typeof caches === 'undefined' || !this.isExternalSupported) {
      return { supported: false, version: 'offline-inline', cachedCount: 0, totalCount: 0, totalBytes: 0, complete: false };
    }
    const manifest = await this.loadManifest();
    const version = (manifest && manifest.version) || 'v7.0';
    const coreUrls = ['./', './index.html', './app.bundle.js', './vendor/three_classic.js', './manifest.json', './assets/manifest.json'];
    const assetUrls = manifest && Array.isArray(manifest.files) ? manifest.files.map((f) => './' + f.path) : [];
    const allUrls = [...coreUrls, ...assetUrls];
    const totalBytes = (manifest ? manifest.totalBytes : 0) + 1400000;

    let cachedCount = 0;
    try {
      const names = await caches.keys();
      const targetName = names.find((n) => n === this.getCacheName()) || names.find((n) => n.startsWith('mini-skylines-'));
      if (targetName) {
        const cache = await caches.open(targetName);
        for (const u of allUrls) {
          const hit = await cache.match(u, { ignoreSearch: true });
          if (hit) cachedCount++;
        }
      }
    } catch {}

    return {
      supported: true,
      version,
      cachedCount,
      totalCount: allUrls.length,
      totalBytes,
      complete: allUrls.length > 0 && cachedCount >= allUrls.length - 1
    };
  }

  async cacheAllOfflineAssets(onProgress = null) {
    if (typeof caches === 'undefined' || !this.isExternalSupported) {
      return { ok: false, reason: '当前运行环境不支持离线 Cache Storage（仅 HTTPS / PWA 可用）' };
    }
    const manifest = await this.loadManifest();
    const coreUrls = ['./', './index.html', './app.bundle.js', './vendor/three_classic.js', './manifest.json', './assets/manifest.json'];
    const assetUrls = manifest && Array.isArray(manifest.files) ? manifest.files.map((f) => './' + f.path) : [];
    const allUrls = [...coreUrls, ...assetUrls];

    const cacheName = this.getCacheName();
    const cache = await caches.open(cacheName);
    let done = 0;
    let failed = 0;
    const total = Math.max(1, allUrls.length);

    const concurrency = 4;
    let cursor = 0;
    const run = async () => {
      while (cursor < allUrls.length) {
        const url = allUrls[cursor++];
        try {
          const existing = await cache.match(url, { ignoreSearch: true });
          if (!existing) {
            const resp = await fetch(url, { cache: 'reload' });
            if (resp && resp.ok) {
              await cache.put(url, resp.clone());
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

    return { ok: failed === 0, cached: done - failed, total: allUrls.length, failed, version: this.manifest?.version || 'v7.0' };
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

Object.assign(__M, { SaveStorage, saveStorage, AssetManager });
})();

// ====== MODULE: audio.js ======
(function () {
// iOS-Unlocked WebAudio Procedural SFX + Dynamic City Ambient Soundscape + Soothing Procedural BGM
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = this._readPref('ms_sfx_enabled', true);
    this.ambientEnabled = this._readPref('ms_ambient_enabled', true);
    this.bgmEnabled = this._readPref('ms_bgm_enabled', true);
    this.lastUpgradeTime = 0;
    this.lastSculptTime = 0;
    this._unlocked = false;

    // Ambient soundscape nodes
    this._ambientReady = false;
    this._masterGain = null;
    this._windGain = null;
    this._waterGain = null;
    this._cityGain = null;

    // Procedural BGM scheduler
    this._bgmAccum = 0;
    this._bgmStep = 0;
    this._chirpAccum = 3.5;
    this._hidden = false;

    this._installIOSUnlockListeners();
  }

  _readPref(key, fallback) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const v = localStorage.getItem(key);
      if (v === null) return fallback;
      return v === '1' || v === 'true';
    } catch {
      return fallback;
    }
  }

  _writePref(key, val) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, val ? '1' : '0');
    } catch {}
  }

  setEnabled(v) {
    this.enabled = Boolean(v);
    this._writePref('ms_sfx_enabled', this.enabled);
    this._syncMasterVolume();
  }

  _rampParam(param, val, now, tc = 0.12) {
    if (!param) return;
    if (typeof param.setTargetAtTime === 'function') {
      param.setTargetAtTime(val, now, tc);
    } else if (typeof param.setValueAtTime === 'function') {
      param.setValueAtTime(val, now);
    } else {
      param.value = val;
    }
  }

  setAmbientEnabled(v) {
    this.ambientEnabled = Boolean(v);
    this._writePref('ms_ambient_enabled', this.ambientEnabled);
    if (!this.ambientEnabled && this._windGain && this.ctx) {
      const now = this.ctx.currentTime;
      this._rampParam(this._windGain.gain, 0.0001, now, 0.15);
      this._rampParam(this._waterGain.gain, 0.0001, now, 0.15);
      this._rampParam(this._cityGain.gain, 0.0001, now, 0.15);
    }
  }

  setBgmEnabled(v) {
    this.bgmEnabled = Boolean(v);
    this._writePref('ms_bgm_enabled', this.bgmEnabled);
  }

  _installIOSUnlockListeners() {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    const onGesture = () => {
      this.unlock();
    };
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('touchstart', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture, { passive: true });
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        this._hidden = document.visibilityState === 'hidden';
        if (!this.ctx) return;
        if (this._hidden) {
          this.ctx.suspend().catch(() => {});
        } else if (this.enabled && this._unlocked) {
          this.ctx.resume().catch(() => {});
        }
      });
    }
  }

  _syncMasterVolume() {
    if (!this._masterGain || !this.ctx) return;
    const target = this.enabled && !this._hidden ? 1.0 : 0.0001;
    this._rampParam(this._masterGain.gain, target, this.ctx.currentTime, 0.08);
  }

  unlock() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this._masterGain = this.ctx.createGain();
        this._masterGain.gain.value = this.enabled ? 1.0 : 0.0001;
        this._masterGain.connect(this.ctx.destination);
      } catch {
        this.ctx = null;
        return;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this._unlocked) {
      this._unlocked = true;
      try {
        // Silent 1-sample buffer unlock required by iOS Safari WebAudio
        const buf = this.ctx.createBuffer(1, 1, 22050);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.ctx.destination);
        src.start(0);
      } catch {}
      this._initAmbientBed();
    }
    this._syncMasterVolume();
  }

  _initAmbientBed() {
    if (this._ambientReady || !this.ctx || !this._masterGain) return;
    try {
      // Generate 3s smooth pink-ish noise buffer shared across wind, river & city hum filters
      const sr = this.ctx.sampleRate || 44100;
      const len = sr * 3;
      const buf = this.ctx.createBuffer(1, len, sr);
      const data = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
        b6 = white * 0.115926;
      }

      const makeLayer = (filterType, freq, q) => {
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const flt = this.ctx.createBiquadFilter();
        flt.type = filterType;
        flt.frequency.value = freq;
        flt.Q.value = q;
        const g = this.ctx.createGain();
        g.gain.value = 0.0001;
        src.connect(flt);
        flt.connect(g);
        g.connect(this._masterGain);
        src.start(0);
        return { flt, g };
      };

      const wind = makeLayer('bandpass', 420, 0.7);
      const water = makeLayer('bandpass', 920, 0.9);
      const city = makeLayer('lowpass', 240, 0.8);

      this._windFilter = wind.flt;
      this._windGain = wind.g;
      this._waterGain = water.g;
      this._cityGain = city.g;
      this._ambientReady = true;
    } catch {}
  }

  // Called once per frame from main loop with live camera & city context
  update(dt, state = null) {
    if (!this.enabled || !this._unlocked || !this.ctx || this.ctx.state !== 'running' || this._hidden) return;
    const now = this.ctx.currentTime;

    if (this._ambientReady && state) {
      if (this.ambientEnabled) {
        const camDist = state.camDist || 22;
        const pop = state.population || 0;
        const waterNear = Math.min(1, state.waterNear || 0);
        const damNear = state.damNear ? 1 : 0;
        const elev = Math.max(0, state.focusElev || 0);
        const night = state.night || 0;

        // High-altitude mountain & skyline breeze when zoomed out or over peaks
        const windTarget = Math.max(0.004, Math.min(0.055, ((camDist - 12) / 42) * 0.038 + elev * 0.012));
        // Canyon river & spillway rush when hovering near water/dam & zoomed closer
        const zoomFactor = Math.max(0.25, 1.25 - camDist / 45);
        const waterTarget = Math.min(0.075, (waterNear * 0.036 + damNear * 0.042) * zoomFactor);
        // Warm low urban street hum when zoomed into active districts
        const cityFactor = Math.min(1, pop / 450) * Math.max(0, 1 - (camDist - 8) / 26) * (1 - night * 0.35);
        const cityTarget = Math.max(0.0001, cityFactor * 0.048);

        this._rampParam(this._windGain.gain, windTarget, now, 0.25);
        this._rampParam(this._waterGain.gain, Math.max(0.0001, waterTarget), now, 0.22);
        this._rampParam(this._cityGain.gain, cityTarget, now, 0.28);
        if (this._windFilter) {
          this._rampParam(this._windFilter.frequency, 340 + Math.sin(now * 0.35) * 90 + elev * 80, now, 0.4);
        }

        // Occasional gentle daytime bird chirp near green areas
        this._chirpAccum -= dt;
        if (this._chirpAccum <= 0) {
          this._chirpAccum = 6.5 + Math.random() * 9.0;
          if (night < 0.35 && camDist < 28 && !state.disasterActive) {
            this._playBirdChirp();
          }
        }
      } else {
        this._rampParam(this._windGain.gain, 0.0001, now, 0.15);
        this._rampParam(this._waterGain.gain, 0.0001, now, 0.15);
        this._rampParam(this._cityGain.gain, 0.0001, now, 0.15);
      }
    }

    // Gentle procedural city-builder BGM (chill Rhodes + pad chords at ~66 BPM)
    if (this.bgmEnabled && (!state || !state.disasterActive)) {
      this._bgmAccum -= dt;
      if (this._bgmAccum <= 0) {
        this._playNextBgmBeat(state ? (state.night || 0) : 0);
        this._bgmAccum = 1.82; // Half-bar calm tempo
      }
    }
  }

  _playBirdChirp() {
    if (!this.ctx || !this._masterGain) return;
    const base = 2100 + Math.random() * 750;
    this.tone(base, base * 1.24, 0.065, 'sine', 0.011, 0);
    this.tone(base * 1.18, base * 0.96, 0.07, 'sine', 0.009, 0.085);
  }

  _playNextBgmBeat(night) {
    if (!this.ctx || !this._masterGain) return;
    // 4-chord warm atmospheric progression: Cmaj9 -> Am9 -> Fmaj7 -> G6sus4
    const chords = [
      [261.63, 329.63, 392.00, 493.88, 587.33],
      [220.00, 261.63, 329.63, 392.00, 493.88],
      [174.61, 220.00, 261.63, 329.63, 392.00],
      [196.00, 261.63, 293.66, 329.63, 440.00]
    ];
    const bar = Math.floor(this._bgmStep / 4) % chords.length;
    const beat = this._bgmStep % 4;
    const chord = chords[bar];
    this._bgmStep++;

    const now = this.ctx.currentTime;
    // On beat 0, play warm low pad root + fifth
    if (beat === 0) {
      for (const freq of [chord[0] * 0.5, chord[2] * 0.5]) {
        const osc = this.ctx.createOscillator();
        const flt = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(night > 0.4 ? 520 : 760, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.018, now + 0.85);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.8);
        osc.connect(flt);
        flt.connect(gain);
        gain.connect(this._masterGain);
        osc.start(now);
        osc.stop(now + 7.0);
      }
    }

    // Gentle Rhodes electric-piano arpeggio note on select beats
    const arpMap = [2, 4, 3, 1];
    if (beat !== 2 || Math.random() > 0.35) {
      const noteFreq = chord[arpMap[beat]] * (night > 0.5 ? 1.0 : (beat === 1 ? 2.0 : 1.0));
      const osc = this.ctx.createOscillator();
      const harm = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      harm.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);
      harm.frequency.setValueAtTime(noteFreq * 2, now);
      hGain.gain.setValueAtTime(0.006, now);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.017, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(gain);
      harm.connect(hGain);
      hGain.connect(gain);
      gain.connect(this._masterGain);
      osc.start(now);
      harm.start(now);
      osc.stop(now + 2.5);
      harm.stop(now + 0.6);
    }
  }

  tone(freq, endFreq, dur, type = 'sine', vol = 0.07, delay = 0) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.ctx) return;
    const dest = this._masterGain || this.ctx.destination;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), now);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + dur);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  tap() { this.tone(540, 650, 0.045, 'triangle', 0.045); }
  road() {
    this.tone(220, 310, 0.08, 'triangle', 0.07);
    this.tone(440, 540, 0.07, 'sine', 0.045, 0.03);
  }
  pipe() {
    this.tone(310, 480, 0.07, 'sine', 0.06);
  }
  rail() {
    this.tone(280, 420, 0.09, 'triangle', 0.07);
    this.tone(560, 680, 0.08, 'sine', 0.05, 0.04);
  }
  zone() { this.tone(370, 550, 0.085, 'sine', 0.06); }
  sculpt() {
    const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (t - this.lastSculptTime < 95) return;
    this.lastSculptTime = t;
    this.tone(125, 165, 0.07, 'sine', 0.045);
  }
  buildCivic() {
    this.tone(330, 330, 0.08, 'triangle', 0.07, 0);
    this.tone(440, 440, 0.08, 'triangle', 0.07, 0.06);
    this.tone(660, 660, 0.15, 'sine', 0.08, 0.12);
  }
  bulldoze() { this.tone(160, 52, 0.14, 'sawtooth', 0.065); }
  upgrade() {
    const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (t - this.lastUpgradeTime < 700) return;
    this.lastUpgradeTime = t;
    this.tone(523.25, 523.25, 0.08, 'sine', 0.045, 0);
    this.tone(659.25, 659.25, 0.11, 'sine', 0.045, 0.065);
  }
  milestone() {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => this.tone(n, n, 0.2, 'triangle', 0.075, i * 0.085));
  }
  explosion() {
    this.tone(110, 28, 0.55, 'sawtooth', 0.16, 0);
    this.tone(75, 22, 0.65, 'square', 0.11, 0.05);
  }
  siren() {
    this.tone(620, 880, 0.22, 'triangle', 0.06, 0);
    this.tone(880, 620, 0.22, 'triangle', 0.06, 0.22);
  }
  error() { this.tone(190, 130, 0.12, 'sawtooth', 0.06); }
}

Object.assign(__M, { SoundFX });
})();

// ====== MODULE: mapgen.js ======
(function () {
const GRID_SIZE = 56;
const HALF_GRID = GRID_SIZE / 2;
const CORNER_STRIDE = GRID_SIZE + 1;
const SEA_LEVEL = 0.05;
function inBounds(x, z) {
  return x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE;
}
function idx(x, z) {
  return z * GRID_SIZE + x;
}
function cIdx(cx, cz) {
  return cz * CORNER_STRIDE + cx;
}
function tileToWorld(x, z) {
  return {
    wx: x - HALF_GRID + 0.5,
    wz: z - HALF_GRID + 0.5
  };
}
function worldToTile(wx, wz) {
  return {
    x: Math.floor(wx + HALF_GRID),
    z: Math.floor(wz + HALF_GRID)
  };
}
function hash2D(x, z, seed = 1337) {
  let h = (x * 374761393 + z * 668265263 + seed * 1442695041) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function smoothNoise(x, z, seed) {
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
function riverSpineDist(x, z, seed = 2026) {
  const phase = (seed % 97) * 0.05;
  // Project onto diagonal u = (x + z) * 0.5
  const u = (x + z) * 0.5;
  const targetDiff = Math.sin(u * 0.13 + phase) * 3.8 + Math.cos(u * 0.06 - 0.5) * 2.0;
  // On diagonal x - z = targetDiff
  const perp = ((x - z) - targetDiff) * 0.7071;
  return { perp: Math.abs(perp), signedPerp: perp, u };
}
function createEmptyTile(x, z) {
  return {
    x,
    z,
    trees: 0,
    waterSpring: 0,    // >0 means mountain spring water source inflow!
    roadGround: 0,     // 0 none, 1 street(2L), 2 avenue(4L), 3 highway-portal, 4 mountain-tunnel
    roadBridge: false, // true when roadGround 1/2 was built over water as an elevated bridge deck
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
    trash: 0,
    serviceScore: 0,
    fireSafety: 0,
    congestion: 0
  };
}
function generateWorld(seed = 2026) {
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

Object.assign(__M, { GRID_SIZE, HALF_GRID, CORNER_STRIDE, SEA_LEVEL, inBounds, idx, cIdx, tileToWorld, worldToTile, hash2D, smoothNoise, riverSpineDist, createEmptyTile, generateWorld });
})();

// ====== MODULE: water_physics.js ======
(function () {
const { GRID_SIZE, CORNER_STRIDE, inBounds, cIdx, idx, SEA_LEVEL } = __M;
class WaterPhysics {
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

    this.refreshCellElevations();
    this._seedInitialFlowVectors();
  }

  refreshCellElevations() {
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
            const dOld = Math.max(0, this.nextWater[downIdx]);
            this.nextWater[downIdx] = dOld + discharge;
            this.nextPoll[downIdx] =
              (this.nextPoll[downIdx] * dOld + this.nextPoll[upIdx] * discharge) /
              Math.max(0.001, this.nextWater[downIdx]);
            this.flowMag[downIdx] = Math.min(1, this.flowMag[downIdx] + 0.88);

            // Tailrace flow impulse directed away from upstream reservoir toward tailrace
            const upX = upIdx % GRID_SIZE;
            const upZ = (upIdx / GRID_SIZE) | 0;
            const dnX = downIdx % GRID_SIZE;
            const dnZ = (downIdx / GRID_SIZE) | 0;
            const tLen = Math.max(1, Math.hypot(dnX - upX, dnZ - upZ));
            this._instFlowX[downIdx] += ((dnX - upX) / tLen) * 0.92;
            this._instFlowZ[downIdx] += ((dnZ - upZ) / tLen) * 0.92;

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

    return this._cornerField;
  }
}

Object.assign(__M, { WaterPhysics });
})();

// ====== MODULE: terrain_water_shader.js ======
(function () {
const { GRID_SIZE, HALF_GRID, CORNER_STRIDE, SEA_LEVEL, inBounds, idx, cIdx, hash2D, smoothNoise } = __M;

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
function createTerrainDetailTexture(THREE) {
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
function buildHighResTerrainMesh(THREE, sim, overlayMode, detailTex, sharedMat = null) {
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
  let trashScale = 1;
  let servScale = 1;
  let fireScale = 1;
  let congScale = 1;
  if (activeOverlay) {
    let maxP = 0, maxTr = 0, maxS = 0, maxF = 0, maxCg = 0;
    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      if (t.pollution > maxP) maxP = t.pollution;
      if ((t.trash || 0) > maxTr) maxTr = t.trash || 0;
      if (t.serviceScore > maxS) maxS = t.serviceScore;
      if (t.fireSafety > maxF) maxF = t.fireSafety;
      if (t.congestion > maxCg) maxCg = t.congestion;
    }
    pollScale = maxP > 1.05 ? 0.01 : 1.0;
    trashScale = maxTr > 1.05 ? 0.01 : 1.0;
    servScale = maxS > 1.05 ? 0.01 : 1.0;
    fireScale = maxF > 1.05 ? 0.01 : 1.0;
    congScale = maxCg > 1.05 ? 0.01 : 1.0;
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
          const wp = waterPoll[idx(tx, tz)] || 0;
          const pv = clamp01(Math.max(tile.pollution * pollScale, wp));
          or = 0.26 + pv * 0.68;
          og = 0.78 - pv * 0.56;
          ob = 0.38 - pv * 0.12 + (pv > 0.6 ? (pv - 0.6) * 0.5 : 0);
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
function createPhysicalWaterMaterial(THREE) {
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
      float shoreAlpha = smoothstep(0.004, 0.11, vDepth);
      if (shoreAlpha <= 0.001) discard;

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

      // Crisp sun / moon Blinn-Phong specular sparkle
      vec3 H = normalize(L + V);
      float NdotH = max(dot(N, H), 0.0);
      float specBroad = pow(NdotH, 52.0) * 0.20;
      float specSparkle = pow(NdotH, 280.0) * 1.55;
      float specMask = smoothstep(0.015, 0.09, vDepth) * (1.0 - pollFactor * 0.45);
      col += uSunColor * (specBroad + specSparkle) * specMask * mix(1.0, 0.45, uNight);

      // Animated whitewater rapids/tailrace foam (vFoam > 0.35) & shoreline lap foam (vDepth < 0.09)
      vec2 foamUV = xz * 4.6 - vFlow * uTime * 1.45;
      float fNoise1 = valueNoise(foamUV + vec2(uTime * 0.35, -uTime * 0.25));
      float fNoise2 = valueNoise(foamUV * 2.3 - vec2(uTime * 0.55, uTime * 0.42));
      float foamPattern = fNoise1 * 0.62 + fNoise2 * 0.38;

      float rapidFoam = smoothstep(0.35, 0.78, vFoam + (foamPattern - 0.48) * 0.36) * smoothstep(0.012, 0.06, vDepth);
      float shoreRipple = 0.5 + 0.5 * sin(vDepth * 62.0 - uTime * 2.8 + foamPattern * 4.0);
      float shoreFoam =
        smoothstep(0.09, 0.018, vDepth) *
        smoothstep(0.005, 0.020, vDepth) *
        smoothstep(0.46, 0.80, foamPattern * 0.75 + shoreRipple * 0.35);

      float totalFoam = clamp(max(rapidFoam, shoreFoam * 0.78), 0.0, 1.0);
      vec3 foamTint = mix(cleanFoamColor, dirtyFoamColor, pollFactor) * mix(1.0, 0.32, uNight);
      col = mix(col, foamTint, totalFoam * 0.85);

      float baseOpacity = mix(0.85, 0.94, deepMix);
      float alpha = shoreAlpha * clamp(baseOpacity * 0.88 / 0.85 + totalFoam * 0.12 + specSparkle * 0.15, 0.0, 0.96);
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
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2
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
function updatePhysicalWaterUniforms(mat, clock, sunDir, sunColor, skyColor, camPos, night) {
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
function buildSmoothWaterMesh(THREE, sim, waterPhysics, waterMat) {
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
      subSurf[wi] = dVal > 0 ? sVal + 0.007 : Math.min(sVal, terrH - 0.012);
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

      if (d00 <= 0.002 && d10 <= 0.002 && d01 <= 0.002 && d11 <= 0.002) continue;

      const a = getVertIndex(q00);
      const b = getVertIndex(q10);
      const c = getVertIndex(q01);
      const d = getVertIndex(q11);

      if (Math.abs(d00 - d11) <= Math.abs(d10 - d01)) {
        triIndices.push(a, c, d, a, d, b);
      } else {
        triIndices.push(a, c, b, b, c, d);
      }
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

  return { addQuad, addBeam, addCylinder, addCappedCylinder, addBilinearDeck, toMesh };
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
function resolveRampChainMeta(gridOrSim) {
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
function buildContinuousRoadAndViaductGroup(THREE, sim, overlayMode, mats) {
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

  const cCurb = [toCol(0.73), toCol(0.74), toCol(0.76)];
  const cParapet = [toCol(0.82), toCol(0.83), toCol(0.85)];
  const cGirder = [toCol(0.66), toCol(0.68), toCol(0.71)];
  const cPier = [toCol(0.62), toCol(0.64), toCol(0.67)];
  const cPortal = [toCol(0.76), toCol(0.77), toCol(0.79)];
  const cSlab = [toCol(0.78), toCol(0.79), toCol(0.81)];

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

  // Exact-height streetlamp & live traffic signal placement registries for InstancedMesh rendering
  const lamps = [];
  const signals = [];
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
          const bedY = cellElev[i] - 0.18;
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
        const groundY = cellElev[i] - 0.16;

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
  const meshes = [
    bRoad2.toMesh(THREE, matRoad2),
    bRoad4.toMesh(THREE, matRoad4),
    bRoadHub.toMesh(THREE, matRoadHub),
    bTraffic.toMesh(THREE, auxMats.trafficDeck),
    bConcrete.toMesh(THREE, auxMats.concrete),
    bTunnelDark.toMesh(THREE, auxMats.tunnelDark),
    bSteel.toMesh(THREE, auxMats.steelRail)
  ];

  for (let i = 0; i < meshes.length; i++) {
    if (meshes[i]) group.add(meshes[i]);
  }

  group.userData.streetProps = { lamps, signals };

  return group;
}

Object.assign(__M, { createTerrainDetailTexture, buildHighResTerrainMesh, createPhysicalWaterMaterial, updatePhysicalWaterUniforms, buildSmoothWaterMesh, resolveRampChainMeta, buildContinuousRoadAndViaductGroup });
})();

// ====== MODULE: facade_textures.js ======
(function () {
// External PBR textures loaded natively from ./assets/textures/ by AssetManager
const FACADE_TEXTURES = {};

Object.assign(__M, { FACADE_TEXTURES });
})();

// ====== MODULE: architecture3d.js ======
(function () {
// Flagship v7.0 PBR 3D Architectural Asset Library, True-Proportion Vehicles, CR400 Trains, Hydro Dam, Aircraft, Ships & Sky Dome
// Supports full Albedo + Normal + Roughness PBR channels (via globalThis.__ASSET_MGR / applyLoadedPBRTextures) with offline DataURI fallback.

const { FACADE_TEXTURES } = __M;

function hash2(x, y, seed = 1337) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function mergeParts(THREE, parts) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const m4 = new THREE.Matrix4();
  const n3 = new THREE.Matrix3();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const posV = new THREE.Vector3();
  const sclV = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (const p of parts) {
    const src = p.geo;
    const g = src.index ? src.toNonIndexed() : src;
    e.set(p.rx || 0, p.ry || 0, p.rz || 0, 'XYZ');
    q.setFromEuler(e);
    posV.set(p.px || 0, p.py || 0, p.pz || 0);
    sclV.set(p.sx ?? 1, p.sy ?? 1, p.sz ?? 1);
    m4.compose(posV, q, sclV);
    n3.getNormalMatrix(m4);

    const posAttr = g.getAttribute('position');
    const normAttr = g.getAttribute('normal');
    const uvAttr = g.getAttribute('uv');
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(posAttr, i).applyMatrix4(m4);
      positions.push(v.x, v.y, v.z);

      if (normAttr) {
        v.fromBufferAttribute(normAttr, i).applyMatrix3(n3).normalize();
        normals.push(v.x, v.y, v.z);
      } else {
        normals.push(0, 1, 0);
      }

      if (uvAttr) {
        uvs.push(uvAttr.getX(i), uvAttr.getY(i));
      } else {
        uvs.push(0, 0);
      }
    }
    if (src.index) g.dispose();
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return out;
}

// Helper: Extrude a 2D automotive side profile (x = +Z forward, y = +Y up) centered on X width
function buildSideProfileGeo(THREE, pts, totalWidth, bevel = 0.008) {
  const sh = new THREE.Shape();
  sh.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const pt = pts[i];
    if (pt.length === 4) {
      sh.quadraticCurveTo(pt[0], pt[1], pt[2], pt[3]);
    } else {
      sh.lineTo(pt[0], pt[1]);
    }
  }
  sh.closePath();
  const depth = Math.max(0.01, totalWidth - bevel * 2);
  const g = new THREE.ExtrudeGeometry(sh, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.85,
    bevelSegments: 2
  });
  g.translate(0, 0, -depth * 0.5);
  g.rotateY(-Math.PI * 0.5);
  return g;
}

// Lofted Streamlined Parabolic Nose Geometry for CR400 "Fuxing" Bullet Train (facing +Z, rail-head at y=0)
function buildCR400NoseGeometry(THREE) {
  const stations = [
    { z: 0.040, rx: 0.104, yBot: 0.022, yTop: 0.240 },
    { z: 0.105, rx: 0.101, yBot: 0.023, yTop: 0.228 },
    { z: 0.170, rx: 0.092, yBot: 0.025, yTop: 0.198 },
    { z: 0.235, rx: 0.076, yBot: 0.028, yTop: 0.158 },
    { z: 0.290, rx: 0.055, yBot: 0.033, yTop: 0.118 },
    { z: 0.332, rx: 0.032, yBot: 0.042, yTop: 0.088 },
    { z: 0.355, rx: 0.012, yBot: 0.052, yTop: 0.068 }
  ];

  const N = 14;
  const ringPts = stations.map((st) => {
    const cy = (st.yBot + st.yTop) * 0.5;
    const ry = (st.yTop - st.yBot) * 0.5;
    const pts = [];
    for (let k = 0; k < N; k++) {
      const a = (k * Math.PI * 2) / N;
      const sx = -Math.sin(a);
      const ca = Math.cos(a);
      const yShape = ca < 0 ? Math.pow(-ca, 0.78) * -1 : Math.pow(ca, 0.88);
      const xShape = Math.sign(sx) * Math.pow(Math.abs(sx), 0.88);
      pts.push([xShape * st.rx, cy + yShape * ry, st.z]);
    }
    return pts;
  });

  const positions = [];
  const uvs = [];
  const pushTri = (a, b, c) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    uvs.push(0, 0, 1, 0, 0.5, 1);
  };

  for (let s = 0; s < stations.length - 1; s++) {
    const r0 = ringPts[s];
    const r1 = ringPts[s + 1];
    for (let k = 0; k < N; k++) {
      const kn = (k + 1) % N;
      pushTri(r0[k], r1[k], r1[kn]);
      pushTri(r0[k], r1[kn], r0[kn]);
    }
  }

  const lastRing = ringPts[stations.length - 1];
  const tip = [0, 0.060, 0.362];
  for (let k = 0; k < N; k++) {
    const kn = (k + 1) % N;
    pushTri(lastRing[k], tip, lastRing[kn]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

// ==================== World-Space Full PBR (Albedo + Normal + Roughness) & Night-Window Shader Patch ====================

function applyWorldFacadePatch(mat, opts) {
  const {
    cacheKey,
    tileW = 0.64,
    tileH = 0.60,
    roofTex = null,
    roofNormTex = null,
    roofRoughTex = null,
    roofScale = 0.72,
    nightMode = 0,
    cellsX = 4.0,
    cellsY = 4.0,
    planarOnly = false
  } = opts;

  const fTileW = Number(tileW).toFixed(4);
  const fTileH = Number(tileH).toFixed(4);
  const fRoofS = Number(roofScale).toFixed(4);
  const fCellsX = Number(cellsX).toFixed(2);
  const fCellsY = Number(cellsY).toFixed(2);
  const iNightMode = nightMode | 0;
  const iPlanar = planarOnly ? 1 : 0;

  // Shared mutable uniform holders so applyLoadedPBRTextures() hot-updates roof PBR channels without rebuilding meshes!
  const pbrUniforms = {
    uArchRoofMap: { value: roofTex || mat.map },
    uArchRoofNormMap: { value: roofNormTex },
    uArchRoofRoughMap: { value: roofRoughTex }
  };

  const patchFn = (shader) => {
    shader.uniforms.uArchRoofMap = pbrUniforms.uArchRoofMap;
    shader.uniforms.uArchRoofNormMap = pbrUniforms.uArchRoofNormMap;
    shader.uniforms.uArchRoofRoughMap = pbrUniforms.uArchRoofRoughMap;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vArchWorldPos;
varying vec3 vArchWorldNorm;
varying vec3 vArchBasePos;`
      )
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
vArchWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vec3 archCol0 = modelMatrix[0].xyz;
vec3 archCol1 = modelMatrix[1].xyz;
vec3 archCol2 = modelMatrix[2].xyz;
vArchWorldNorm = normalize(
  archCol0 * (objectNormal.x / max(1e-6, dot(archCol0, archCol0))) +
  archCol1 * (objectNormal.y / max(1e-6, dot(archCol1, archCol1))) +
  archCol2 * (objectNormal.z / max(1e-6, dot(archCol2, archCol2)))
);
vArchBasePos = (modelMatrix * vec4(0.0, -0.5, 0.0, 1.0)).xyz;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform sampler2D uArchRoofMap;
uniform sampler2D uArchRoofNormMap;
uniform sampler2D uArchRoofRoughMap;
varying vec3 vArchWorldPos;
varying vec3 vArchWorldNorm;
varying vec3 vArchBasePos;`
      )
      .replace(
        '#include <map_fragment>',
        `vec3 archN = normalize(vArchWorldNorm);
bool archIsRoof = (${iPlanar} == 1) || (abs(archN.y) >= 0.5);
vec2 archWallUV = vec2(
  ((abs(archN.x) > abs(archN.z) ? (vArchWorldPos.z - vArchBasePos.z) : (vArchWorldPos.x - vArchBasePos.x)) / ${fTileW}) + 0.5,
  max(0.0, vArchWorldPos.y - vArchBasePos.y) / ${fTileH}
);
vec2 archRoofUV = vArchWorldPos.xz / ${fRoofS};
vec2 archActiveUV = archIsRoof ? archRoofUV : archWallUV;
vec4 archTexel = vec4(1.0);
#ifdef USE_MAP
  vec4 archWallSample = texture2D(map, archWallUV);
  vec4 archRoofSample = texture2D(uArchRoofMap, archRoofUV);
  archTexel = archIsRoof ? archRoofSample : archWallSample;
  diffuseColor *= archTexel;
#endif`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  vec4 archRoughWall = texture2D(roughnessMap, archWallUV);
  vec4 archRoughRoof = texture2D(uArchRoofRoughMap, archRoofUV);
  vec4 texelRoughness = archIsRoof ? archRoughRoof : archRoughWall;
  roughnessFactor *= texelRoughness.g;
#endif`
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#ifdef USE_NORMALMAP_OBJECTSPACE
  normal = texture2D(normalMap, archActiveUV).xyz * 2.0 - 1.0;
  #ifdef FLIP_SIDED
    normal = -normal;
  #endif
  #ifdef DOUBLE_SIDED
    normal = normal * faceDirection;
  #endif
  normal = normalize(normalMatrix * normal);
#elif defined(USE_NORMALMAP_TANGENTSPACE)
  vec3 archNormWall = texture2D(normalMap, archWallUV).xyz * 2.0 - 1.0;
  vec3 archNormRoof = texture2D(uArchRoofNormMap, archRoofUV).xyz * 2.0 - 1.0;
  vec3 mapN = archIsRoof ? archNormRoof : archNormWall;
  mapN.xy *= normalScale;
  mat3 archTbn = getTangentFrame(-vViewPosition, nonPerturbedNormal, archActiveUV);
  #if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
    archTbn[0] *= faceDirection;
    archTbn[1] *= faceDirection;
  #endif
  normal = normalize(archTbn * mapN);
#elif defined(USE_BUMPMAP)
  normal = perturbNormalArb(-vViewPosition, normal, dHdxy_fwd(), faceDirection);
#endif`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `float archNight = totalEmissiveRadiance.r;
totalEmissiveRadiance = vec3(0.0);
#if defined(USE_MAP) && (${iNightMode} > 0)
  if (!archIsRoof && archNight > 0.005) {
    vec2 archCellScaled = archWallUV * vec2(${fCellsX}, ${fCellsY});
    vec2 archCellId = floor(archCellScaled);
    vec2 archCellFrac = fract(archCellScaled);

    float bldgSeed = floor(vArchBasePos.x * 3.17 + 0.5) * 19.3 + floor(vArchBasePos.z * 3.17 + 0.5) * 47.9;
    float faceSeed = abs(archN.x) > abs(archN.z) ? (archN.x > 0.0 ? 11.0 : 23.0) : (archN.z > 0.0 ? 37.0 : 53.0);
    float rnd = fract(sin(dot(archCellId + vec2(bldgSeed, faceSeed), vec2(127.1, 311.7))) * 43758.5453);
    float rndTemp = fract(rnd * 17.37 + 0.23);

    vec3 srgbTex = sqrt(max(vec3(0.0), archTexel.rgb));
    float sLum = dot(srgbTex, vec3(0.299, 0.587, 0.114));
    float glassMask = 0.0;

    #if ${iNightMode} == 1
      float inResPane = step(0.09, archCellFrac.x) * step(archCellFrac.x, 0.91) * step(0.28, archCellFrac.y) * step(archCellFrac.y, 0.90);
      float darkPane = smoothstep(0.73, 0.52, sLum) * smoothstep(0.18, 0.28, sLum);
      float coolPane = smoothstep(-0.01, 0.03, srgbTex.b - srgbTex.r) * smoothstep(0.80, 0.56, sLum);
      glassMask = inResPane * max(darkPane, coolPane);
    #elif ${iNightMode} == 2
      float inVision = step(0.05, archCellFrac.x) * step(archCellFrac.x, 0.95) * step(0.20, archCellFrac.y) * step(archCellFrac.y, 0.84);
      glassMask = inVision * smoothstep(0.01, 0.06, srgbTex.b - srgbTex.r * 0.94) * smoothstep(0.74, 0.55, sLum) * smoothstep(0.16, 0.26, sLum);
    #elif ${iNightMode} == 3
      float inStoneWin = step(0.15, archCellFrac.x) * step(archCellFrac.x, 0.85) * step(0.10, archCellFrac.y) * step(archCellFrac.y, 0.88);
      glassMask = inStoneWin * smoothstep(0.58, 0.40, sLum) * smoothstep(0.14, 0.23, sLum);
    #elif ${iNightMode} == 4
      float inShop = step(0.06, archCellFrac.x) * step(archCellFrac.x, 0.94) * step(0.03, archCellFrac.y) * step(archCellFrac.y, 0.62);
      glassMask = inShop * smoothstep(0.20, 0.30, sLum) * smoothstep(0.86, 0.64, sLum);
    #elif ${iNightMode} == 5
      float inVilla = step(0.16, archCellFrac.x) * step(archCellFrac.x, 0.84) * step(0.16, archCellFrac.y) * step(archCellFrac.y, 0.82);
      glassMask = inVilla * smoothstep(0.52, 0.34, sLum);
    #elif ${iNightMode} == 6
      float vBand = fract(archWallUV.y);
      float inClere = step(0.75, vBand) * step(vBand, 0.89);
      glassMask = inClere * smoothstep(0.68, 0.48, sLum) * smoothstep(0.22, 0.32, sLum);
    #endif

    float litProb = (${iNightMode} == 4) ? 0.78 : ((${iNightMode} == 2 || ${iNightMode} == 3) ? 0.48 : 0.44);
    float isLit = step(1.0 - litProb, rnd);

    vec3 warmGlow = vec3(1.0, 0.83, 0.58);
    vec3 coolGlow = vec3(0.82, 0.92, 1.0);
    float coolMix = (${iNightMode} == 2 || ${iNightMode} == 3) ? step(0.60, rndTemp) : step(0.88, rndTemp);
    vec3 winRadiance = mix(warmGlow, coolGlow, coolMix) * (0.76 + 0.44 * fract(rnd * 29.3));

    totalEmissiveRadiance = winRadiance * glassMask * isLit * archNight;
  }
#endif`
      );
  };

  mat.userData = mat.userData || {};
  mat.userData.facadePatch = true;
  mat.userData.facadePatchOpts = opts;
  mat.userData.pbrUniforms = pbrUniforms;
  mat.onBeforeCompile = patchFn;
  mat.customProgramCacheKey = function () {
    return cacheKey + (this.normalMap ? '_N' : '') + (this.roughnessMap ? '_R' : '');
  };
  return mat;
}

// ==================== Special Procedural Decal & AO Canvas Textures ====================

function createSolidLinearTexture(THREE, cssColor) {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 4;
  const g = c.getContext('2d');
  g.fillStyle = cssColor;
  g.fillRect(0, 0, 4, 4);
  const tex = new THREE.CanvasTexture(c);
  if ('NoColorSpace' in THREE) tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createContactAOTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createRadialGradient(64, 64, 14, 64, 64, 63);
  grad.addColorStop(0.0, 'rgba(9, 13, 20, 0.58)');
  grad.addColorStop(0.58, 'rgba(9, 13, 20, 0.34)');
  grad.addColorStop(0.84, 'rgba(9, 13, 20, 0.12)');
  grad.addColorStop(1.0, 'rgba(9, 13, 20, 0.0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createHelipadTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#525b66';
  g.fillRect(0, 0, 256, 256);

  g.strokeStyle = 'rgba(203, 213, 225, 0.42)';
  g.lineWidth = 6;
  g.strokeRect(14, 14, 228, 228);

  g.strokeStyle = 'rgba(241, 245, 249, 0.78)';
  g.lineWidth = 8;
  g.beginPath();
  g.arc(128, 128, 82, 0, Math.PI * 2);
  g.stroke();

  g.fillStyle = 'rgba(248, 250, 252, 0.86)';
  g.fillRect(90, 78, 16, 100);
  g.fillRect(150, 78, 16, 100);
  g.fillRect(90, 120, 76, 16);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createSoccerPitchTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  const stripes = 10;
  const sw = 256 / stripes;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? '#229944' : '#2cb452';
    g.fillRect(i * sw, 0, sw + 1, 256);
  }

  g.strokeStyle = '#b85038';
  g.lineWidth = 22;
  g.strokeRect(6, 6, 244, 244);

  g.strokeStyle = '#f8fafc';
  g.lineWidth = 4;
  g.strokeRect(26, 38, 204, 180);

  g.beginPath();
  g.moveTo(128, 38);
  g.lineTo(128, 218);
  g.stroke();

  g.beginPath();
  g.arc(128, 128, 28, 0, Math.PI * 2);
  g.stroke();

  g.strokeRect(26, 82, 34, 92);
  g.strokeRect(196, 82, 34, 92);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createSolarMirrorTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, '#174ea6');
  grad.addColorStop(0.5, '#2563eb');
  grad.addColorStop(1, '#1e3a8a');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  g.strokeStyle = 'rgba(226, 238, 255, 0.68)';
  g.lineWidth = 2;
  for (let i = 0; i <= 128; i += 32) {
    g.beginPath();
    g.moveTo(i, 0); g.lineTo(i, 128);
    g.moveTo(0, i); g.lineTo(128, i);
    g.stroke();
  }
  g.strokeStyle = '#e2e8f0';
  g.lineWidth = 5;
  g.strokeRect(2, 2, 124, 124);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createContainerRibsTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const g = c.getContext('2d');

  g.fillStyle = '#e5e7eb';
  g.fillRect(0, 0, 128, 64);

  for (let x = 6; x < 122; x += 8) {
    g.fillStyle = '#b4bcc8';
    g.fillRect(x, 5, 4, 54);
    g.fillStyle = '#ffffff';
    g.fillRect(x + 4, 5, 2, 54);
  }
  g.fillStyle = '#9ca3af';
  g.fillRect(0, 0, 128, 5);
  g.fillRect(0, 59, 128, 5);
  g.fillStyle = '#f8fafc';
  g.fillRect(92, 14, 22, 8);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRunwayTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const g = c.getContext('2d');

  g.fillStyle = '#252930';
  g.fillRect(0, 0, 128, 512);

  g.fillStyle = '#1d2026';
  g.fillRect(30, 50, 68, 412);

  g.fillStyle = '#f1f5f9';
  g.fillRect(8, 0, 4, 512);
  g.fillRect(116, 0, 4, 512);

  for (let x = 18; x <= 102; x += 14) {
    g.fillRect(x, 14, 8, 42);
    g.fillRect(x, 456, 8, 42);
  }

  g.fillRect(24, 96, 16, 44);
  g.fillRect(88, 96, 16, 44);
  g.fillRect(24, 372, 16, 44);
  g.fillRect(88, 372, 16, 44);

  for (let y = 80; y < 430; y += 44) {
    g.fillRect(61, y, 6, 24);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createPoolTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');

  const grad = g.createRadialGradient(64, 64, 8, 64, 64, 82);
  grad.addColorStop(0, '#38e8ff');
  grad.addColorStop(0.7, '#0ea5e9');
  grad.addColorStop(1, '#0284c7');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);

  g.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  g.lineWidth = 2.5;
  for (let i = 18; i < 110; i += 22) {
    g.beginPath();
    g.arc(i, 42 + (i % 3) * 18, 14, 0, Math.PI * 1.4);
    g.stroke();
  }
  g.strokeStyle = '#f8fafc';
  g.lineWidth = 8;
  g.strokeRect(3, 3, 122, 122);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ==================== Main ArchitectureLibrary Class ====================
class ArchitectureLibrary {
  constructor(THREE, glbProtos = {}, mats = {}) {
    this.THREE = THREE || globalThis.THREE;
    this.glbProtos = glbProtos;
    this.baseMats = mats;
    this.emissiveMaterials = [];
    this._pbrBindings = [];
    this._glbAbandonedCache = new WeakMap();

    this._initTexturesAndMaterials();
    this._initSculptedGeometries();

    // Seamlessly bind external PBR textures if AssetManager already preloaded them!
    if (globalThis.__ASSET_MGR) {
      this.applyLoadedPBRTextures(globalThis.__ASSET_MGR);
    }
  }

  _configureTexture(tex, isColor = true) {
    if (!tex) return null;
    const THREE = this.THREE;
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : (THREE.NoColorSpace ?? '');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    if (THREE.LinearMipmapLinearFilter) tex.minFilter = THREE.LinearMipmapLinearFilter;
    if (THREE.LinearFilter) tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  _loadPhotoTexture(loader, uri) {
    const THREE = this.THREE;
    let tex;
    if (loader && uri) {
      tex = loader.load(uri);
    } else if (THREE.CanvasTexture) {
      const c = document.createElement('canvas');
      c.width = c.height = 4;
      tex = new THREE.CanvasTexture(c);
    } else {
      tex = {};
    }
    return this._configureTexture(tex, true);
  }

  _resolveAssetEntry(source, key) {
    if (!source || !key) return null;
    if (typeof source.getTexture === 'function') {
      const t = source.getTexture(key);
      if (t) return t;
    }
    if (typeof source.get === 'function') {
      const t = source.get(key);
      if (t) return t;
    }
    if (source.textures) {
      if (typeof source.textures.get === 'function') {
        const t = source.textures.get(key);
        if (t) return t;
      }
      if (source.textures[key]) return source.textures[key];
    }
    return source[key] || null;
  }

  // Hot-binds external Albedo + Normal + Roughness PBR textures onto all shared materials with ZERO scene rebuild!
  applyLoadedPBRTextures(texMap) {
    const src = texMap || globalThis.__ASSET_MGR;
    if (!src) return 0;

    const THREE = this.THREE;
    const pbrKeys = [
      'res_beige', 'res_grey', 'office_glass', 'office_stone',
      'retail_podium', 'villa_plaster', 'industrial_panel',
      'roof_concrete', 'paving_plaza', 'roof_solar_green', 'dam_concrete'
    ];

    for (const k of pbrKeys) {
      const entry = this._resolveAssetEntry(src, k);
      const albedo = (entry && entry.isTexture) ? entry : (entry && (entry.map || entry.albedo)) || null;
      const norm = this._resolveAssetEntry(src, `${k}_norm`)
        || this._resolveAssetEntry(src, `${k}_normal`)
        || (entry && !entry.isTexture && (entry.normalMap || entry.norm || entry.normal))
        || null;
      const rough = this._resolveAssetEntry(src, `${k}_rough`)
        || this._resolveAssetEntry(src, `${k}_roughness`)
        || (entry && !entry.isTexture && (entry.roughnessMap || entry.rough || entry.roughness))
        || null;

      if (albedo) this.photoTex[k] = this._configureTexture(albedo, true);
      if (norm) this.normTex[k] = this._configureTexture(norm, false);
      else if (entry && !entry.isTexture && ('normalMap' in entry || 'norm' in entry)) this.normTex[k] = null;
      if (rough) this.roughTex[k] = this._configureTexture(rough, false);
      else if (entry && !entry.isTexture && ('roughnessMap' in entry || 'rough' in entry)) this.roughTex[k] = null;
    }

    let updatedCount = 0;
    for (const b of this._pbrBindings) {
      const { mat, wallKey, roofKey, fallbackRough, normalStrength } = b;
      const wMap = this.photoTex[wallKey];
      const wNorm = this.normTex[wallKey] || null;
      const wRough = this.roughTex[wallKey] || null;
      const rMap = this.photoTex[roofKey] || wMap;
      const rNorm = this.normTex[roofKey] || this._flatNormalTex;
      const rRough = this.roughTex[roofKey] || this._neutralRoughTex;

      let changed = false;
      if (wMap && mat.map !== wMap) {
        mat.map = wMap;
        changed = true;
      }
      if (wNorm && mat.normalMap !== wNorm) {
        mat.normalMap = wNorm;
        mat.normalScale = new THREE.Vector2(normalStrength, normalStrength);
        changed = true;
      } else if (!wNorm && mat.normalMap) {
        mat.normalMap = null;
        changed = true;
      }
      if (wRough && mat.roughnessMap !== wRough) {
        mat.roughnessMap = wRough;
        mat.roughness = 1.0;
        changed = true;
      } else if (!wRough) {
        if (mat.roughnessMap) {
          mat.roughnessMap = null;
          changed = true;
        }
        mat.roughness = fallbackRough;
      }

      const u = mat.userData && mat.userData.pbrUniforms;
      if (u) {
        if (rMap && u.uArchRoofMap.value !== rMap) { u.uArchRoofMap.value = rMap; changed = true; }
        if (u.uArchRoofNormMap.value !== rNorm) { u.uArchRoofNormMap.value = rNorm; changed = true; }
        if (u.uArchRoofRoughMap.value !== rRough) { u.uArchRoofRoughMap.value = rRough; changed = true; }
      }

      if (changed) {
        mat.needsUpdate = true;
        updatedCount++;
      }
    }
    return updatedCount;
  }

  _initTexturesAndMaterials() {
    const THREE = this.THREE;
    const texSrc = (typeof FACADE_TEXTURES !== 'undefined' && FACADE_TEXTURES) ? FACADE_TEXTURES : {};
    const loader = THREE.TextureLoader ? new THREE.TextureLoader() : null;

    // Neutral linear fallbacks for roof normal/roughness uniforms prior to external PBR load
    this._flatNormalTex = createSolidLinearTexture(THREE, '#8080ff');
    this._neutralRoughTex = createSolidLinearTexture(THREE, '#c8c8c8');

    this.photoTex = {
      res_beige: this._loadPhotoTexture(loader, texSrc.res_beige),
      res_grey: this._loadPhotoTexture(loader, texSrc.res_grey),
      office_glass: this._loadPhotoTexture(loader, texSrc.office_glass),
      office_stone: this._loadPhotoTexture(loader, texSrc.office_stone),
      retail_podium: this._loadPhotoTexture(loader, texSrc.retail_podium),
      villa_plaster: this._loadPhotoTexture(loader, texSrc.villa_plaster),
      industrial_panel: this._loadPhotoTexture(loader, texSrc.industrial_panel),
      roof_concrete: this._loadPhotoTexture(loader, texSrc.roof_concrete),
      paving_plaza: this._loadPhotoTexture(loader, texSrc.paving_plaza),
      roof_solar_green: this._loadPhotoTexture(loader, texSrc.roof_solar_green),
      dam_concrete: this._loadPhotoTexture(loader, texSrc.dam_concrete || texSrc.roof_concrete)
    };
    this.normTex = {};
    this.roughTex = {};

    this.texContactAO = createContactAOTexture(THREE);
    this.texHelipad = createHelipadTexture(THREE);
    this.texPitch = createSoccerPitchTexture(THREE);
    this.texSolar = createSolarMirrorTexture(THREE);
    this.texContainer = createContainerRibsTexture(THREE);
    this.texRunway = createRunwayTexture(THREE);
    this.texPool = createPoolTexture(THREE);

    const makeWorldFacadeMat = (key, wallKey, roofKey, colorHex, rough, metal, patchCfg, normalStrength = 0.55) => {
      const isLit = (patchCfg.nightMode || 0) > 0;
      const tex = this.photoTex[wallKey];
      const rTex = this.photoTex[roofKey] || tex;
      const m = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: tex,
        emissive: isLit ? 0xffffff : 0x000000,
        emissiveIntensity: 0.0,
        roughness: rough,
        metalness: metal
      });
      applyWorldFacadePatch(m, {
        cacheKey: key,
        roofTex: rTex,
        roofNormTex: this._flatNormalTex,
        roofRoughTex: this._neutralRoughTex,
        ...patchCfg
      });
      this._pbrBindings.push({ mat: m, wallKey, roofKey, fallbackRough: rough, normalStrength });
      if (isLit) this.emissiveMaterials.push(m);
      return m;
    };

    const makePlanarMat = (key, texKey, colorHex, rough, metal, scaleXZ, normalStrength = 0.55) => {
      const tex = this.photoTex[texKey];
      const m = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: tex,
        roughness: rough,
        metalness: metal
      });
      applyWorldFacadePatch(m, {
        cacheKey: key,
        tileW: scaleXZ,
        tileH: scaleXZ,
        roofTex: tex,
        roofNormTex: this._flatNormalTex,
        roofRoughTex: this._neutralRoughTex,
        roofScale: scaleXZ,
        nightMode: 0,
        planarOnly: true
      });
      this._pbrBindings.push({ mat: m, wallKey: texKey, roofKey: texKey, fallbackRough: rough, normalStrength });
      return m;
    };

    const makeContMat = (hex) => new THREE.MeshStandardMaterial({
      color: hex,
      map: this.texContainer,
      roughness: 0.52,
      metalness: 0.28
    });

    const contactAO = new THREE.MeshBasicMaterial({
      map: this.texContactAO,
      transparent: true,
      opacity: 0.80,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    });
    contactAO.userData = { skipGhost: true };

    this.m = {
      contactAO,

      // Top-down world-space granite plaza paving, concrete roof membrane, green roof & gravity dam concrete
      pavingPlaza: makePlanarMat('arch_planar_plaza_v2', 'paving_plaza', 0xffffff, 0.78, 0.05, 0.46),
      pavingPlazaDusty: makePlanarMat('arch_planar_plaza_dusty_v2', 'paving_plaza', 0x8e9298, 0.90, 0.03, 0.46),
      roofConcrete: makePlanarMat('arch_planar_roof_conc_v2', 'roof_concrete', 0xf1f5f9, 0.84, 0.04, 0.72),
      roofGreen: makePlanarMat('arch_planar_roof_green_v2', 'roof_solar_green', 0xffffff, 0.82, 0.04, 0.78),
      damConcrete: makeWorldFacadeMat('arch_fac_dam_conc_v2', 'dam_concrete', 'roof_concrete', 0xd8dee6, 0.80, 0.06, {
        tileW: 0.85, tileH: 0.85, roofScale: 0.75, nightMode: 0, cellsX: 2, cellsY: 2
      }, 0.65),

      // Contemporary Grade-A Office & Commercial Curtain-Wall Facades (CH & O)
      cbdIceBlue: makeWorldFacadeMat('arch_fac_off_glass_ice_v2', 'office_glass', 'roof_concrete', 0xdceeff, 0.18, 0.38, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }),
      cbdSlateSilver: makeWorldFacadeMat('arch_fac_off_glass_sil_v2', 'office_glass', 'roof_concrete', 0xf1f5f9, 0.17, 0.42, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }),
      cbdDeepAzure: makeWorldFacadeMat('arch_fac_off_glass_az_v2', 'office_glass', 'roof_concrete', 0xbcd8f4, 0.19, 0.38, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }),
      cbdTealGlass: makeWorldFacadeMat('arch_fac_off_glass_tl_v2', 'office_glass', 'roof_concrete', 0xc4edea, 0.18, 0.36, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 2, cellsX: 4, cellsY: 4
      }),
      finStoneChampagne: makeWorldFacadeMat('arch_fac_off_stone_ch_v2', 'office_stone', 'roof_concrete', 0xfbf6ee, 0.52, 0.12, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 3, cellsX: 4, cellsY: 4
      }),
      finStoneSilver: makeWorldFacadeMat('arch_fac_off_stone_sl_v2', 'office_stone', 'roof_concrete', 0xe8eef5, 0.48, 0.16, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 3, cellsX: 4, cellsY: 4
      }),

      // Ground-Floor Luxury Retail Shopfront Podium (CL, RH, CH, O podiums)
      retailPodium: makeWorldFacadeMat('arch_fac_retail_pod_v2', 'retail_podium', 'roof_solar_green', 0xffffff, 0.38, 0.18, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.78, nightMode: 4, cellsX: 4, cellsY: 1
      }),
      retailPodiumConc: makeWorldFacadeMat('arch_fac_retail_podc_v2', 'retail_podium', 'roof_concrete', 0xf8fafc, 0.38, 0.18, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.72, nightMode: 4, cellsX: 4, cellsY: 1
      }),

      // Contemporary Chinese High-Rise Residential Facades (RH: res_beige & res_grey)
      condoWarmWhite: makeWorldFacadeMat('arch_fac_res_beige_w_v2', 'res_beige', 'roof_concrete', 0xffffff, 0.62, 0.06, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }),
      condoChampagne: makeWorldFacadeMat('arch_fac_res_beige_c_v2', 'res_beige', 'roof_concrete', 0xf5eadc, 0.64, 0.06, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }),
      condoWarmGrey: makeWorldFacadeMat('arch_fac_res_grey_g_v2', 'res_grey', 'roof_concrete', 0xf8fafc, 0.58, 0.08, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }),
      condoSandStone: makeWorldFacadeMat('arch_fac_res_grey_s_v2', 'res_grey', 'roof_concrete', 0xeee8df, 0.60, 0.08, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 1, cellsX: 4, cellsY: 4
      }),

      // Low-Density Villa / Townhouse Cream Plaster Facades (RL)
      villaCream: makeWorldFacadeMat('arch_fac_villa_cr_v2', 'villa_plaster', 'roof_concrete', 0xffffff, 0.72, 0.04, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }),
      villaSand: makeWorldFacadeMat('arch_fac_villa_sd_v2', 'villa_plaster', 'roof_concrete', 0xf3e7d8, 0.74, 0.04, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }),
      villaCool: makeWorldFacadeMat('arch_fac_villa_cl_v2', 'villa_plaster', 'roof_concrete', 0xeaeff5, 0.70, 0.05, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 5, cellsX: 2, cellsY: 2
      }),

      // Industrial Cladding + Clerestory Strip Facades (I)
      indPanelBlue: makeWorldFacadeMat('arch_fac_ind_bl_v2', 'industrial_panel', 'roof_concrete', 0xdce8f5, 0.52, 0.32, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }),
      indPanelSilver: makeWorldFacadeMat('arch_fac_ind_sl_v2', 'industrial_panel', 'roof_concrete', 0xf4f7fb, 0.44, 0.38, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }),
      indPanelWarm: makeWorldFacadeMat('arch_fac_ind_wm_v2', 'industrial_panel', 'roof_concrete', 0xd8cec4, 0.60, 0.26, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 6, cellsX: 3, cellsY: 1
      }),

      // Dusty Desaturated Abandoned Versions of the Same PBR Textures (nightMode: 0)
      dustyCBD: makeWorldFacadeMat('arch_fac_dusty_cbd_v2', 'office_glass', 'roof_concrete', 0x8b929a, 0.88, 0.08, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }),
      dustyStoneFin: makeWorldFacadeMat('arch_fac_dusty_st_v2', 'office_stone', 'roof_concrete', 0x908d88, 0.90, 0.05, {
        tileW: 0.64, tileH: 0.68, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }),
      dustyRetail: makeWorldFacadeMat('arch_fac_dusty_ret_v2', 'retail_podium', 'roof_concrete', 0x8a8e94, 0.90, 0.05, {
        tileW: 0.72, tileH: 0.36, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 1
      }),
      dustyCondo: makeWorldFacadeMat('arch_fac_dusty_res_v2', 'res_beige', 'roof_concrete', 0x92908b, 0.90, 0.04, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }),
      dustyCondoGrey: makeWorldFacadeMat('arch_fac_dusty_resg_v2', 'res_grey', 'roof_concrete', 0x8d9196, 0.90, 0.04, {
        tileW: 0.64, tileH: 0.60, roofScale: 0.72, nightMode: 0, cellsX: 4, cellsY: 4
      }),
      dustyVilla: makeWorldFacadeMat('arch_fac_dusty_vil_v2', 'villa_plaster', 'roof_concrete', 0x938f88, 0.92, 0.03, {
        tileW: 0.44, tileH: 0.34, roofScale: 0.64, nightMode: 0, cellsX: 2, cellsY: 2
      }),
      dustyInd: makeWorldFacadeMat('arch_fac_dusty_ind_v2', 'industrial_panel', 'roof_concrete', 0x888e95, 0.90, 0.08, {
        tileW: 0.60, tileH: 0.42, roofScale: 0.72, nightMode: 0, cellsX: 3, cellsY: 1
      }),

      // Architectural trims, concrete, metals & glass
      plazaStone: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.74, metalness: 0.05 }),
      parapetStone: new THREE.MeshStandardMaterial({ color: 0xdad5cc, roughness: 0.64, metalness: 0.08 }),
      darkGranite: new THREE.MeshStandardMaterial({ color: 0x3b4452, roughness: 0.46, metalness: 0.22 }),
      charcoalFrame: new THREE.MeshStandardMaterial({ color: 0x2c343f, roughness: 0.44, metalness: 0.32 }),
      refugeLouvers: new THREE.MeshStandardMaterial({ color: 0x26303c, roughness: 0.50, metalness: 0.40 }),
      asphalt: new THREE.MeshStandardMaterial({ color: 0x323842, roughness: 0.86, metalness: 0.04 }),
      brushedSilver: new THREE.MeshStandardMaterial({ color: 0xdce4ec, roughness: 0.26, metalness: 0.58 }),
      whiteComposite: new THREE.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.30, metalness: 0.18 }),
      steelDark: new THREE.MeshStandardMaterial({ color: 0x4b5664, roughness: 0.44, metalness: 0.52 }),
      atriumGlass: new THREE.MeshStandardMaterial({
        color: 0x8ec5e8,
        emissive: 0x3898d8,
        emissiveIntensity: 0.22,
        roughness: 0.14,
        metalness: 0.38,
        transparent: true,
        opacity: 0.86
      }),
      cockpitGlass: new THREE.MeshStandardMaterial({ color: 0x111a2b, roughness: 0.09, metalness: 0.72 }),

      // Realistic Automotive Metallic Paints, Tires & Night Headlight/Taillight Lenses
      carPearlWhite: new THREE.MeshStandardMaterial({ color: 0xf4f7fb, roughness: 0.20, metalness: 0.34 }),
      carGraphite: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.22, metalness: 0.56 }),
      carMidnightBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a6e, roughness: 0.22, metalness: 0.48 }),
      carSilver: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.19, metalness: 0.60 }),
      carCrimson: new THREE.MeshStandardMaterial({ color: 0xa61b34, roughness: 0.22, metalness: 0.44 }),
      carEmeraldEV: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.22, metalness: 0.44 }),
      taxiYellow: new THREE.MeshStandardMaterial({ color: 0xf5be0b, roughness: 0.24, metalness: 0.28 }),
      taxiSignGlow: new THREE.MeshStandardMaterial({ color: 0xfffbeb, emissive: 0xfde68a, emissiveIntensity: 0.75, roughness: 0.25 }),
      busTurquoise: new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.26, metalness: 0.32 }),
      garbageGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.34, metalness: 0.22 }),
      tireRubber: new THREE.MeshStandardMaterial({ color: 0x1e2229, roughness: 0.84, metalness: 0.12 }),
      vehHeadlight: new THREE.MeshStandardMaterial({
        color: 0xfff9eb,
        emissive: 0xffe8b0,
        emissiveIntensity: 0.16,
        roughness: 0.14,
        metalness: 0.10
      }),
      vehTaillight: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff1e2d,
        emissiveIntensity: 0.20,
        roughness: 0.18,
        metalness: 0.10
      }),

      // CR400 "Fuxing" Bullet Train Livery Materials
      fuxingBody: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.22 }),
      fuxingRedStripe: new THREE.MeshStandardMaterial({ color: 0xc81e2b, roughness: 0.24, metalness: 0.34 }),
      fuxingRoofSilver: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.30, metalness: 0.48 }),
      fuxingBogie: new THREE.MeshStandardMaterial({ color: 0x262c36, roughness: 0.62, metalness: 0.35 }),
      fuxingHeadlight: new THREE.MeshBasicMaterial({ color: 0xfff8dc }),

      // Landscaping, wood, roofs & special decals
      lawn: new THREE.MeshStandardMaterial({ color: 0x3b9c4a, roughness: 0.86 }),
      hedge: new THREE.MeshStandardMaterial({ color: 0x2b753b, roughness: 0.88 }),
      teakDeck: new THREE.MeshStandardMaterial({ color: 0xb77946, roughness: 0.68 }),
      terracottaRoof: new THREE.MeshStandardMaterial({ color: 0xb45640, roughness: 0.68 }),
      slateRoof: new THREE.MeshStandardMaterial({ color: 0x455060, roughness: 0.62, metalness: 0.16 }),
      poolWater: new THREE.MeshStandardMaterial({
        map: this.texPool,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.26,
        roughness: 0.12,
        metalness: 0.22
      }),
      helipad: new THREE.MeshStandardMaterial({ map: this.texHelipad, roughness: 0.76, metalness: 0.06 }),
      soccerPitch: new THREE.MeshStandardMaterial({ map: this.texPitch, roughness: 0.82 }),
      solarPanel: new THREE.MeshStandardMaterial({
        map: this.texSolar,
        roughness: 0.18,
        metalness: 0.56,
        emissive: 0x0f2d6b,
        emissiveIntensity: 0.14
      }),
      runway: new THREE.MeshStandardMaterial({ map: this.texRunway, roughness: 0.80 }),

      // Industrial accents, cranes, ships & containers
      craneRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.38, metalness: 0.40 }),
      craneYellow: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.40, metalness: 0.36 }),
      factoryFasciaBlue: new THREE.MeshStandardMaterial({ color: 0x1d65b8, roughness: 0.36, metalness: 0.28 }),
      factoryFasciaTeal: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.36, metalness: 0.28 }),
      factoryBrick: new THREE.MeshStandardMaterial({ color: 0x9e6450, roughness: 0.76, metalness: 0.10 }),
      hullNavy: new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.46, metalness: 0.32 }),
      hullCrimson: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.52, metalness: 0.24 }),
      airlineBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.24, metalness: 0.40 }),
      contRed: makeContMat(0xdc2626),
      contBlue: makeContMat(0x2563eb),
      contAmber: makeContMat(0xd97706),
      contTeal: makeContMat(0x0d9488),
      contGreen: makeContMat(0x16a34a),

      // Subtle architectural LED linear strips, storefront neon, warm molten-salt solar crown & aviation beacons
      ledLinearCyan: new THREE.MeshBasicMaterial({ color: 0x7dd3fc }),
      ledLinearWhite: new THREE.MeshBasicMaterial({ color: 0xe2f1ff }),
      neonCyan: new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
      neonGold: new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
      neonRose: new THREE.MeshBasicMaterial({ color: 0xfb7185 }),
      neonEmerald: new THREE.MeshBasicMaterial({ color: 0x34d399 }),
      neonViolet: new THREE.MeshBasicMaterial({ color: 0xc084fc }),
      floodlightWhite: new THREE.MeshBasicMaterial({ color: 0xfffef5 }),
      solarReceiverCrown: new THREE.MeshStandardMaterial({
        color: 0xffb74d,
        emissive: 0xff9800,
        emissiveIntensity: 0.92,
        roughness: 0.28,
        metalness: 0.24
      }),
      beaconRed: new THREE.MeshBasicMaterial({ color: 0xff2438 }),
      strobeGreen: new THREE.MeshBasicMaterial({ color: 0x22c55e }),

      abandoned: new THREE.MeshStandardMaterial({ color: 0x8b9098, roughness: 0.90, metalness: 0.05 }),
      abandonedRust: new THREE.MeshStandardMaterial({ color: 0x7c7874, roughness: 0.92, metalness: 0.06 })
    };

    // Canonical PBR material aliases for external inspection & theming
    this.m.officeGlass = this.m.cbdIceBlue;
    this.m.resBeige = this.m.condoWarmWhite;

    this.carBodyPalette = [
      this.m.carPearlWhite,
      this.m.carGraphite,
      this.m.carMidnightBlue,
      this.m.carSilver,
      this.m.carCrimson,
      this.m.carEmeraldEV
    ];
    this.containerMats = [this.m.contRed, this.m.contBlue, this.m.contAmber, this.m.contTeal, this.m.contGreen];
    this.neonMats = [this.m.neonCyan, this.m.neonRose, this.m.neonGold, this.m.neonEmerald, this.m.neonViolet];
  }

  _getDustyGLBMat(origMat) {
    if (!origMat) return this.m.abandoned;
    let cached = this._glbAbandonedCache.get(origMat);
    if (!cached) {
      cached = origMat.clone();
      if (cached.color) cached.color.setHex(0x828890);
      cached.roughness = 0.90;
      cached.metalness = 0.05;
      if (cached.emissive) cached.emissive.setHex(0x000000);
      cached.emissiveIntensity = 0.0;
      this._glbAbandonedCache.set(origMat, cached);
    }
    return cached;
  }

  _initSculptedGeometries() {
    const THREE = this.THREE;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const aoQuad = new THREE.PlaneGeometry(1, 1);
    aoQuad.rotateX(-Math.PI * 0.5);

    const cyl16 = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const cyl24 = new THREE.CylinderGeometry(0.5, 0.5, 1, 24);
    const oct = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    const taperOct = new THREE.CylinderGeometry(0.32, 0.50, 1, 8);
    const taperPyr = new THREE.CylinderGeometry(0.24, 0.52, 1, 4);
    const cone8 = new THREE.ConeGeometry(0.5, 1, 8);
    const sphere16 = new THREE.SphereGeometry(0.5, 18, 14);
    const hemiDome = new THREE.SphereGeometry(0.5, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const capsule = new THREE.CapsuleGeometry(0.25, 0.5, 8, 14);
    const treeCrown = new THREE.DodecahedronGeometry(0.11, 1);

    // 1. Flat-shaded Axis-Aligned Tapered Square Shaft & Tapered Gravity Dam Monolith
    const rawTaperSq = new THREE.CylinderGeometry(0.52, 0.7071, 1, 4);
    rawTaperSq.rotateY(Math.PI * 0.25);
    const taperSquare = rawTaperSq.toNonIndexed();
    taperSquare.computeVertexNormals();
    rawTaperSq.dispose();

    const rawDamSq = new THREE.CylinderGeometry(0.68, 0.835, 1, 4);
    rawDamSq.rotateY(Math.PI * 0.25);
    const damGravityBody = rawDamSq.toNonIndexed();
    damGravityBody.computeVertexNormals();
    rawDamSq.dispose();

    // 4-Corner Buttress Piers for Hydroelectric Gravity Dam
    const damButtresses = mergeParts(THREE, [
      { geo: box, px: -0.38, py: 0, pz: 0, sx: 0.16, sy: 1.0, sz: 1.04 },
      { geo: box, px: 0.38, py: 0, pz: 0, sx: 0.16, sy: 1.0, sz: 1.04 },
      { geo: box, px: 0, py: 0, pz: -0.38, sx: 1.04, sy: 1.0, sz: 0.16 },
      { geo: box, px: 0, py: 0, pz: 0.38, sx: 1.04, sy: 1.0, sz: 0.16 }
    ]);

    // 2. Pre-merged 4-Wall Rectangular Roof Parapet Frame (女儿墙)
    const parapetFrame = mergeParts(THREE, [
      { geo: box, px: 0, py: 0, pz: 0.47, sx: 1.0, sy: 1.0, sz: 0.06 },
      { geo: box, px: 0, py: 0, pz: -0.47, sx: 1.0, sy: 1.0, sz: 0.06 },
      { geo: box, px: 0.47, py: 0, pz: 0, sx: 0.06, sy: 1.0, sz: 0.88 },
      { geo: box, px: -0.47, py: 0, pz: 0, sx: 0.06, sy: 1.0, sz: 0.88 }
    ]);

    // 3. Pre-merged 8-Fin Vertical Curtain-Wall Corner & Mullion Columns
    const rectCornerFins = mergeParts(THREE, [
      { geo: box, px: -0.495, py: 0, pz: -0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0.495, py: 0, pz: -0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: -0.495, py: 0, pz: 0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0.495, py: 0, pz: 0.495, sx: 0.04, sy: 1.0, sz: 0.04 },
      { geo: box, px: 0, py: 0, pz: 0.50, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: 0, py: 0, pz: -0.50, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: 0.50, py: 0, pz: 0, sx: 0.028, sy: 1.0, sz: 0.028 },
      { geo: box, px: -0.50, py: 0, pz: 0, sx: 0.028, sy: 1.0, sz: 0.028 }
    ]);

    // 4. Pre-merged Street Tree Planters & Canopies for Plot Edges
    const buildPlanterSet = (coords) => {
      const curbParts = [];
      const trunkParts = [];
      const leafParts = [];
      for (const [cx, cz] of coords) {
        curbParts.push({ geo: box, px: cx, py: 0.032, pz: cz, sx: 0.11, sy: 0.036, sz: 0.11 });
        trunkParts.push({ geo: cyl16, px: cx, py: 0.075, pz: cz, sx: 0.022, sy: 0.08, sz: 0.022 });
        leafParts.push({ geo: treeCrown, px: cx, py: 0.145, pz: cz, sx: 0.68, sy: 0.68, sz: 0.68 });
      }
      return {
        curbs: mergeParts(THREE, curbParts),
        trunks: mergeParts(THREE, trunkParts),
        leaves: mergeParts(THREE, leafParts)
      };
    };
    const planters4 = buildPlanterSet([[-0.39, -0.39], [0.39, -0.39], [-0.39, 0.39], [0.39, 0.39]]);
    const planters2 = buildPlanterSet([[-0.38, 0.39], [0.38, 0.39]]);

    // 5. Sawtooth Industrial Roof & Gas Sphere Support Legs
    const triRidge = new THREE.CylinderGeometry(0.5, 0.5, 1, 3);
    const sawParts = [];
    for (let i = -1; i <= 1; i++) {
      sawParts.push({ geo: triRidge, px: 0, py: 0, pz: i * 0.22, rz: Math.PI * 0.5, rx: 0.22, sx: 0.22, sy: 0.68, sz: 0.24 });
    }
    const sawtoothRoof = mergeParts(THREE, sawParts);
    triRidge.dispose();

    const legParts = [];
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      legParts.push({ geo: cyl16, px: Math.cos(a) * 0.13, py: 0.18, pz: Math.sin(a) * 0.13, sx: 0.028, sy: 0.36, sz: 0.028 });
    }
    const eqTorus = new THREE.TorusGeometry(0.175, 0.014, 8, 20);
    legParts.push({ geo: eqTorus, px: 0, py: 0.28, pz: 0, rx: Math.PI * 0.5 });
    const gasSphereSupport = mergeParts(THREE, legParts);
    eqTorus.dispose();

    // 6. Cooling Tower, Stadium, Ferris Wheel, Heliostats & Gantry Crane
    const coolingTower = new THREE.LatheGeometry([
      new THREE.Vector2(0.24, 0.0),
      new THREE.Vector2(0.20, 0.22),
      new THREE.Vector2(0.165, 0.52),
      new THREE.Vector2(0.148, 0.78),
      new THREE.Vector2(0.172, 1.05),
      new THREE.Vector2(0.158, 1.05),
      new THREE.Vector2(0.138, 0.78)
    ], 24);

    const stadiumBowl = new THREE.LatheGeometry([
      new THREE.Vector2(0.45, 0.00),
      new THREE.Vector2(0.54, 0.22),
      new THREE.Vector2(0.51, 0.38),
      new THREE.Vector2(0.46, 0.38),
      new THREE.Vector2(0.30, 0.03)
    ], 32);

    const stadiumRoof = new THREE.LatheGeometry([
      new THREE.Vector2(0.34, 0.390),
      new THREE.Vector2(0.51, 0.365),
      new THREE.Vector2(0.525, 0.385),
      new THREE.Vector2(0.44, 0.425),
      new THREE.Vector2(0.335, 0.405)
    ], 32);

    const rimOuter = new THREE.TorusGeometry(0.68, 0.022, 10, 32);
    const rimInner = new THREE.TorusGeometry(0.50, 0.012, 8, 28);
    const fwParts = [
      { geo: rimOuter, px: 0, py: 0, pz: -0.06 },
      { geo: rimOuter, px: 0, py: 0, pz: 0.06 },
      { geo: rimInner, px: 0, py: 0, pz: -0.06 },
      { geo: rimInner, px: 0, py: 0, pz: 0.06 },
      { geo: cyl16, px: 0, py: 0, pz: 0, rx: Math.PI * 0.5, sx: 0.14, sy: 0.20, sz: 0.14 }
    ];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const cx = Math.cos(a) * 0.34;
      const cy = Math.sin(a) * 0.34;
      fwParts.push({ geo: cyl16, px: cx, py: cy, pz: -0.06, rz: a - Math.PI * 0.5, sx: 0.014, sy: 0.68, sz: 0.014 });
      fwParts.push({ geo: cyl16, px: cx, py: cy, pz: 0.06, rz: a - Math.PI * 0.5, sx: 0.014, sy: 0.68, sz: 0.014 });
      fwParts.push({ geo: cyl16, px: Math.cos(a) * 0.68, py: Math.sin(a) * 0.68, pz: 0, rx: Math.PI * 0.5, sx: 0.016, sy: 0.14, sz: 0.016 });
    }
    const ferrisWheelFrame = mergeParts(THREE, fwParts);
    rimOuter.dispose();
    rimInner.dispose();

    const helioMirParts = [];
    const helioPedParts = [];
    for (const rd of [{ count: 6, r: 0.26, tilt: 0.42 }, { count: 10, r: 0.43, tilt: 0.58 }]) {
      for (let i = 0; i < rd.count; i++) {
        const a = (i * Math.PI * 2) / rd.count + (rd.count === 10 ? 0.16 : 0);
        const px = Math.cos(a) * rd.r;
        const pz = Math.sin(a) * rd.r;
        helioPedParts.push({ geo: cyl16, px, py: 0.055, pz, sx: 0.022, sy: 0.11, sz: 0.022 });
        helioMirParts.push({ geo: box, px, py: 0.115, pz, ry: -a, rz: rd.tilt, sx: 0.105, sy: 0.012, sz: 0.115 });
      }
    }
    const heliostatMirrors = mergeParts(THREE, helioMirParts);
    const heliostatPedestals = mergeParts(THREE, helioPedParts);

    const gantryCraneRed = mergeParts(THREE, [
      { geo: box, px: -0.11, py: 0.48, pz: -0.14, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0.11, py: 0.48, pz: -0.14, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: -0.11, py: 0.48, pz: 0.16, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0.11, py: 0.48, pz: 0.16, sx: 0.032, sy: 0.96, sz: 0.032 },
      { geo: box, px: 0, py: 0.42, pz: -0.14, sx: 0.24, sy: 0.028, sz: 0.028 },
      { geo: box, px: 0, py: 0.42, pz: 0.16, sx: 0.24, sy: 0.028, sz: 0.028 },
      { geo: box, px: -0.07, py: 0.96, pz: 0.26, sx: 0.028, sy: 0.036, sz: 1.24 },
      { geo: box, px: 0.07, py: 0.96, pz: 0.26, sx: 0.028, sy: 0.036, sz: 1.24 },
      { geo: box, px: 0, py: 0.96, pz: 0.84, sx: 0.17, sy: 0.032, sz: 0.04 },
      { geo: box, px: -0.06, py: 1.18, pz: 0.02, sx: 0.026, sy: 0.44, sz: 0.026 },
      { geo: box, px: 0.06, py: 1.18, pz: 0.02, sx: 0.026, sy: 0.44, sz: 0.026 },
      { geo: box, px: 0, py: 1.39, pz: 0.02, sx: 0.15, sy: 0.028, sz: 0.03 },
      { geo: box, px: 0, py: 1.17, pz: 0.38, rx: 0.50, sx: 0.016, sy: 0.016, sz: 0.82 },
      { geo: box, px: 0, py: 1.17, pz: -0.18, rx: -0.78, sx: 0.016, sy: 0.016, sz: 0.56 }
    ]);

    const gullShape = new THREE.Shape();
    gullShape.moveTo(-0.56, 0.0);
    gullShape.quadraticCurveTo(-0.28, 0.19, 0.0, 0.05);
    gullShape.quadraticCurveTo(0.28, 0.19, 0.56, 0.0);
    gullShape.lineTo(0.54, -0.035);
    gullShape.quadraticCurveTo(0.28, 0.14, 0.0, 0.01);
    gullShape.quadraticCurveTo(-0.28, 0.14, -0.54, -0.035);
    gullShape.closePath();
    const gullWingRoof = new THREE.ExtrudeGeometry(gullShape, { depth: 0.52, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
    gullWingRoof.translate(0, 0, -0.26);

    const wedgeShape = new THREE.Shape();
    wedgeShape.moveTo(-0.38, 0.0);
    wedgeShape.lineTo(0.38, 0.0);
    wedgeShape.lineTo(0.38, 1.18);
    wedgeShape.quadraticCurveTo(0.02, 0.78, -0.38, 0.34);
    wedgeShape.closePath();
    const copenhillWedge = new THREE.ExtrudeGeometry(wedgeShape, { depth: 0.58, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
    copenhillWedge.translate(0, 0, -0.29);

    // 7. Widebody Airliner & Ocean Container Ship Hulls
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, -0.24);
    wingShape.lineTo(0.68, 0.15);
    wingShape.lineTo(0.68, 0.25);
    wingShape.lineTo(0.11, 0.11);
    wingShape.lineTo(-0.11, 0.11);
    wingShape.lineTo(-0.68, 0.25);
    wingShape.lineTo(-0.68, 0.15);
    wingShape.closePath();
    const airlinerWing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.008, bevelSegments: 2 });
    airlinerWing.rotateX(-Math.PI * 0.5);

    const hTailShape = new THREE.Shape();
    hTailShape.moveTo(0, -0.08);
    hTailShape.lineTo(0.26, 0.09);
    hTailShape.lineTo(0.26, 0.15);
    hTailShape.lineTo(0, 0.07);
    hTailShape.lineTo(-0.26, 0.15);
    hTailShape.lineTo(-0.26, 0.09);
    hTailShape.closePath();
    const airlinerHTail = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.012, bevelEnabled: false });
    airlinerHTail.rotateX(-Math.PI * 0.5);

    const vTailShape = new THREE.Shape();
    vTailShape.moveTo(0.14, 0.0);
    vTailShape.lineTo(-0.08, 0.29);
    vTailShape.lineTo(-0.19, 0.29);
    vTailShape.lineTo(-0.10, 0.0);
    vTailShape.closePath();
    const airlinerVTail = new THREE.ExtrudeGeometry(vTailShape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.005, bevelSegments: 1 });
    airlinerVTail.translate(0, 0, -0.008);
    airlinerVTail.rotateY(-Math.PI * 0.5);

    const makeShipHullGeo = (halfBeam, sternY, bowY, depth) => {
      const sh = new THREE.Shape();
      sh.moveTo(-halfBeam * 0.88, sternY);
      sh.lineTo(-halfBeam, sternY * 0.65);
      sh.lineTo(-halfBeam, -0.35);
      sh.quadraticCurveTo(-halfBeam * 0.92, bowY * 0.72, 0, bowY);
      sh.quadraticCurveTo(halfBeam * 0.92, bowY * 0.72, halfBeam, -0.35);
      sh.lineTo(halfBeam, sternY * 0.65);
      sh.lineTo(halfBeam * 0.88, sternY);
      sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 });
      g.rotateX(-Math.PI * 0.5);
      return g;
    };

    const fuselage = new THREE.CapsuleGeometry(0.095, 1.08, 10, 18);
    fuselage.rotateX(Math.PI * 0.5);

    const windNacelle = new THREE.CapsuleGeometry(0.058, 0.15, 8, 12);
    windNacelle.rotateX(Math.PI * 0.5);

    // 8. CR400 "Fuxing" High-Speed Train Shared Geometries
    const crShape = new THREE.Shape();
    crShape.moveTo(-0.086, 0.022);
    crShape.lineTo(0.086, 0.022);
    crShape.lineTo(0.104, 0.072);
    crShape.lineTo(0.098, 0.194);
    crShape.quadraticCurveTo(0, 0.246, -0.098, 0.194);
    crShape.lineTo(-0.104, 0.072);
    crShape.closePath();

    const fuxingMidBody = new THREE.ExtrudeGeometry(crShape, { depth: 0.65, bevelEnabled: false });
    fuxingMidBody.translate(0, 0, -0.325);

    const fuxingHeadAft = new THREE.ExtrudeGeometry(crShape, { depth: 0.38, bevelEnabled: false });
    fuxingHeadAft.translate(0, 0, -0.340);
    const fuxingNose = buildCR400NoseGeometry(THREE);
    const fuxingHeadBody = mergeParts(THREE, [{ geo: fuxingHeadAft }, { geo: fuxingNose }]);
    fuxingHeadAft.dispose();
    fuxingNose.dispose();

    const fuxingMidDark = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.017, pz: -0.20, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.017, pz: 0.20, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.125, pz: -0.333, sx: 0.176, sy: 0.185, sz: 0.016 },
      { geo: box, px: 0, py: 0.125, pz: 0.333, sx: 0.176, sy: 0.185, sz: 0.016 },
      { geo: box, px: 0, py: 0.150, pz: 0, sx: 0.206, sy: 0.042, sz: 0.58 }
    ]);

    const fuxingHeadDark = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.017, pz: -0.21, sx: 0.165, sy: 0.026, sz: 0.11 },
      { geo: box, px: 0, py: 0.017, pz: 0.15, sx: 0.155, sy: 0.026, sz: 0.10 },
      { geo: box, px: 0, py: 0.036, pz: 0.28, rx: 0.28, sx: 0.11, sy: 0.024, sz: 0.10 },
      { geo: box, px: 0, py: 0.125, pz: -0.344, sx: 0.176, sy: 0.185, sz: 0.014 },
      { geo: box, px: 0, py: 0.150, pz: -0.14, sx: 0.206, sy: 0.042, sz: 0.35 },
      { geo: sphere16, px: 0, py: 0.168, pz: 0.165, rx: -0.34, sx: 0.148, sy: 0.062, sz: 0.145 }
    ]);

    const fuxingMidStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.106, pz: 0, sx: 0.211, sy: 0.018, sz: 0.648 },
      { geo: box, px: 0, py: 0.202, pz: 0, sx: 0.199, sy: 0.010, sz: 0.648 }
    ]);

    const fuxingHeadStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.106, pz: -0.14, sx: 0.211, sy: 0.018, sz: 0.39 },
      { geo: box, px: 0.082, py: 0.088, pz: 0.165, rx: 0.13, ry: -0.14, sx: 0.018, sy: 0.016, sz: 0.25 },
      { geo: box, px: -0.082, py: 0.088, pz: 0.165, rx: 0.13, ry: 0.14, sx: 0.018, sy: 0.016, sz: 0.25 }
    ]);

    const fuxingHeadlights = mergeParts(THREE, [
      { geo: sphere16, px: -0.045, py: 0.076, pz: 0.308, sx: 0.026, sy: 0.018, sz: 0.032 },
      { geo: sphere16, px: 0.045, py: 0.076, pz: 0.308, sx: 0.026, sy: 0.018, sz: 0.032 }
    ]);

    // 9. True-Proportion Realistic Modern 3D Road Vehicles (facing +Z, tire bottoms at exact y = 0.000!)
    const makeWheelsAndChassis = (zf, zr, halfTrack, r, w, chassisL, chassisW) => {
      const wParts = [
        { geo: cyl16, px: -halfTrack, py: r, pz: zf, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: halfTrack, py: r, pz: zf, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: -halfTrack, py: r, pz: zr, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: cyl16, px: halfTrack, py: r, pz: zr, rz: Math.PI * 0.5, sx: r * 2, sy: w, sz: r * 2 },
        { geo: box, px: 0, py: r * 0.95, pz: (zf + zr) * 0.5, sx: chassisW, sy: r * 0.7, sz: chassisL }
      ];
      return mergeParts(THREE, wParts);
    };

    const makeLampPair = (halfX, py, pz, sx, sy, sz) => mergeParts(THREE, [
      { geo: box, px: -halfX, py, pz, sx, sy, sz },
      { geo: box, px: halfX, py, pz, sx, sy, sz }
    ]);

    // Sedan / Taxi (L ≈ 0.30, W ≈ 0.145, H ≈ 0.114)
    const vehSedanBody = buildSideProfileGeo(THREE, [
      [-0.144, 0.024],
      [0.145, 0.022],
      [0.148, 0.045],
      [0.135, 0.056, 0.072, 0.066],
      [-0.138, 0.070],
      [-0.146, 0.052]
    ], 0.144, 0.008);

    const vehSedanCabin = buildSideProfileGeo(THREE, [
      [-0.108, 0.064],
      [0.068, 0.062],
      [0.020, 0.111],
      [-0.068, 0.112]
    ], 0.122, 0.006);

    const vehSedanWheels = makeWheelsAndChassis(0.092, -0.092, 0.064, 0.022, 0.022, 0.23, 0.115);
    const vehSedanHL = makeLampPair(0.048, 0.046, 0.147, 0.028, 0.012, 0.010);
    const vehSedanTL = makeLampPair(0.046, 0.058, -0.145, 0.034, 0.011, 0.010);

    // Compact Urban SUV (L ≈ 0.31, W ≈ 0.150, H ≈ 0.126)
    const vehSuvBody = buildSideProfileGeo(THREE, [
      [-0.148, 0.026],
      [0.148, 0.026],
      [0.152, 0.054],
      [0.140, 0.068, 0.076, 0.075],
      [-0.146, 0.078],
      [-0.150, 0.055]
    ], 0.148, 0.008);

    const vehSuvCabin = buildSideProfileGeo(THREE, [
      [-0.136, 0.073],
      [0.068, 0.071],
      [0.022, 0.124],
      [-0.118, 0.125]
    ], 0.128, 0.006);

    const vehSuvWheels = makeWheelsAndChassis(0.096, -0.096, 0.067, 0.024, 0.024, 0.24, 0.120);
    const vehSuvHL = makeLampPair(0.050, 0.054, 0.151, 0.030, 0.013, 0.010);
    const vehSuvTL = makeLampPair(0.050, 0.066, -0.149, 0.032, 0.013, 0.010);

    // Low-Floor EV City Transit Bus (L ≈ 0.50, W ≈ 0.162, H ≈ 0.186)
    const vehBusBody = buildSideProfileGeo(THREE, [
      [-0.244, 0.024],
      [0.244, 0.024],
      [0.250, 0.085],
      [0.248, 0.168, 0.228, 0.174],
      [-0.238, 0.174],
      [-0.246, 0.160]
    ], 0.160, 0.007);

    const vehBusDark = mergeParts(THREE, [
      // Panoramic dark side & front/rear transit windows
      { geo: box, px: 0, py: 0.122, pz: 0.005, sx: 0.163, sy: 0.058, sz: 0.45 },
      { geo: box, px: 0, py: 0.118, pz: 0.246, sx: 0.144, sy: 0.068, sz: 0.014 },
      { geo: box, px: 0, py: 0.124, pz: -0.243, sx: 0.140, sy: 0.048, sz: 0.012 }
    ]);
    const vehBusStripe = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.058, pz: 0, sx: 0.163, sy: 0.036, sz: 0.486 },
      { geo: box, px: 0, py: 0.180, pz: -0.02, sx: 0.115, sy: 0.014, sz: 0.28 }
    ]);
    const vehBusWheels = makeWheelsAndChassis(0.145, -0.145, 0.070, 0.027, 0.026, 0.40, 0.13);
    const vehBusHL = makeLampPair(0.056, 0.048, 0.249, 0.026, 0.014, 0.010);
    const vehBusTL = makeLampPair(0.058, 0.062, -0.245, 0.022, 0.026, 0.010);

    // Cab-Over Cargo / Container Truck & Municipal Trucks (L ≈ 0.44, W ≈ 0.160, H ≈ 0.190)
    const vehTruckCab = buildSideProfileGeo(THREE, [
      [0.088, 0.028],
      [0.214, 0.028],
      [0.218, 0.092],
      [0.204, 0.164],
      [0.155, 0.182],
      [0.088, 0.182]
    ], 0.154, 0.006);

    const vehTruckGlass = mergeParts(THREE, [
      { geo: box, px: 0, py: 0.128, pz: 0.211, rx: 0.12, sx: 0.138, sy: 0.048, sz: 0.014 },
      { geo: box, px: 0, py: 0.128, pz: 0.155, sx: 0.156, sy: 0.044, sz: 0.075 }
    ]);
    const vehTruckWheels = makeWheelsAndChassis(0.148, -0.132, 0.068, 0.027, 0.026, 0.39, 0.125);
    const vehTruckHL = makeLampPair(0.054, 0.048, 0.217, 0.026, 0.014, 0.010);
    const vehTruckTL = makeLampPair(0.056, 0.046, -0.218, 0.026, 0.014, 0.010);

    // Firetruck Crew-Cab + Equipment Body + Silver Aerial Ladder Rack
    const vehFireBody = mergeParts(THREE, [
      { geo: vehTruckCab },
      { geo: box, px: 0, py: 0.104, pz: -0.075, sx: 0.158, sy: 0.132, sz: 0.305 }
    ]);
    const vehFireSilver = mergeParts(THREE, [
      // White/silver rescue stripe + roll-up equipment shutters + aerial extension ladder on roof!
      { geo: box, px: 0, py: 0.098, pz: -0.075, sx: 0.161, sy: 0.076, sz: 0.24 },
      { geo: box, px: 0, py: 0.072, pz: 0.152, sx: 0.157, sy: 0.018, sz: 0.125 },
      { geo: box, px: -0.036, py: 0.180, pz: -0.03, sx: 0.016, sy: 0.016, sz: 0.36 },
      { geo: box, px: 0.036, py: 0.180, pz: -0.03, sx: 0.016, sy: 0.016, sz: 0.36 },
      { geo: box, px: 0, py: 0.180, pz: -0.16, sx: 0.082, sy: 0.012, sz: 0.018 },
      { geo: box, px: 0, py: 0.180, pz: -0.03, sx: 0.082, sy: 0.012, sz: 0.018 },
      { geo: box, px: 0, py: 0.180, pz: 0.10, sx: 0.082, sy: 0.012, sz: 0.018 }
    ]);

    // Garbage Compactor Angled Hopper Body (z ∈ [-0.215, +0.080])
    const vehGarbageHopper = buildSideProfileGeo(THREE, [
      [-0.185, 0.048],
      [0.080, 0.048],
      [0.080, 0.178],
      [-0.135, 0.182],
      [-0.216, 0.125],
      [-0.212, 0.068]
    ], 0.156, 0.006);

    this.geos = {
      box,
      aoQuad,
      cyl16,
      cyl24,
      oct,
      taperOct,
      taperPyr,
      taperSquare,
      damGravityBody,
      damButtresses,
      parapetFrame,
      rectCornerFins,
      planters4,
      planters2,
      cone8,
      sphere16,
      hemiDome,
      capsule,
      sawtoothRoof,
      gasSphereSupport,
      coolingTower,
      stadiumBowl,
      stadiumRoof,
      ferrisWheelFrame,
      heliostatMirrors,
      heliostatPedestals,
      gantryCraneRed,
      gullWingRoof,
      copenhillWedge,
      fuselage,
      airlinerWing,
      airlinerHTail,
      airlinerVTail,
      shipHullBoot: makeShipHullGeo(0.24, 0.96, -1.04, 0.09),
      shipHullMain: makeShipHullGeo(0.26, 0.98, -1.10, 0.14),
      fuxingMidBody,
      fuxingHeadBody,
      fuxingMidDark,
      fuxingHeadDark,
      fuxingMidStripe,
      fuxingHeadStripe,
      fuxingHeadlights,
      vehSedanBody,
      vehSedanCabin,
      vehSedanWheels,
      vehSedanHL,
      vehSedanTL,
      vehSuvBody,
      vehSuvCabin,
      vehSuvWheels,
      vehSuvHL,
      vehSuvTL,
      vehBusBody,
      vehBusDark,
      vehBusStripe,
      vehBusWheels,
      vehBusHL,
      vehBusTL,
      vehTruckCab,
      vehTruckGlass,
      vehTruckWheels,
      vehTruckHL,
      vehTruckTL,
      vehFireBody,
      vehFireSilver,
      vehGarbageHopper,
      windMast: new THREE.CylinderGeometry(0.030, 0.068, 1.58, 14),
      windNacelle,
      windBlade: new THREE.ConeGeometry(0.036, 0.44, 7),
      spireNeedle: new THREE.ConeGeometry(0.026, 0.88, 4),
      umbrellaCanopy: new THREE.ConeGeometry(0.11, 0.06, 8),
      treeCrown
    };
  }

  setNightFactor(night) {
    const n = Math.max(0, Math.min(1, night));
    const emi = n * 1.28;
    for (let i = 0; i < this.emissiveMaterials.length; i++) {
      this.emissiveMaterials[i].emissiveIntensity = emi;
    }

    // Scale vehicle headlights & ruby taillights brightly whenever night > 0.18
    if (this.m.vehHeadlight && this.m.vehTaillight) {
      if (n > 0.18) {
        const ramp = Math.min(1, (n - 0.18) / 0.52);
        this.m.vehHeadlight.emissiveIntensity = 0.45 + ramp * 2.45;
        this.m.vehTaillight.emissiveIntensity = 0.42 + ramp * 2.18;
      } else {
        this.m.vehHeadlight.emissiveIntensity = 0.16;
        this.m.vehTaillight.emissiveIntensity = 0.20;
      }
    }
  }

  // ==================== Helpers for Building Assembly ====================

  _addMesh(grp, geo, mat, px, py, pz, sx = 1, sy = 1, sz = 1, shadow = true, ry = 0) {
    const m = new this.THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.scale.set(sx, sy, sz);
    if (ry !== 0) m.rotation.y = ry;
    m.castShadow = shadow;
    m.receiveShadow = true;
    grp.add(m);
    return m;
  }

  // Grounded soft Contact AO shadow skirt under buildings (marked skipGhost = true)
  _addContactAO(grp, sx = 1.04, sz = 1.04, py = 0.008) {
    const ao = new this.THREE.Mesh(this.geos.aoQuad, this.m.contactAO);
    ao.position.set(0, py, 0);
    ao.scale.set(sx, 1, sz);
    ao.castShadow = false;
    ao.receiveShadow = false;
    ao.userData.skipGhost = true;
    grp.add(ao);
    return ao;
  }

  _addZonedPlotPad(grp, ab = false, fourCorners = true) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.012, 0, 0.92, 0.024, 0.92, false);
    const pSet = fourCorners ? this.geos.planters4 : this.geos.planters2;
    this._addMesh(grp, pSet.curbs, ab ? this.m.abandoned : this.m.parapetStone, 0, 0, 0, 1, 1, 1, false);
    this._addMesh(grp, pSet.trunks, this.m.teakDeck, 0, 0, 0, 1, 1, 1, false);
    this._addMesh(grp, pSet.leaves, ab ? this.m.abandonedRust : this.m.lawn, 0, 0, 0, 1, 1, 1, true);
  }

  _localToWorld(lx, ly, lz, x, y0, z, rotRad) {
    const c = Math.cos(rotRad);
    const s = Math.sin(rotRad);
    return new this.THREE.Vector3(
      x + lx * c + lz * s,
      y0 + ly,
      z - lx * s + lz * c
    );
  }

  _pushSmoke(hooks, lx, ly, lz, x, y0, z, rotRad, isSteam = false) {
    if (!hooks || !hooks.smokeSources) return;
    const wp = this._localToWorld(lx, ly, lz, x, y0, z, rotRad);
    wp.isSteam = isSteam;
    hooks.smokeSources.push(wp);
  }

  _addBeacon(grp, hooks, lx, ly, lz, x, y0, z, rotRad, ab = false) {
    if (ab) return null;
    const bm = this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, lx, ly, lz, 0.065, 0.065, 0.065, false);
    bm.userData.worldPos = this._localToWorld(lx, ly, lz, x, y0, z, rotRad);
    if (hooks && hooks.beacons) hooks.beacons.push(bm);
    return bm;
  }

  _addTinyTree(grp, lx, ly, lz, sc = 0.7) {
    this._addMesh(grp, this.geos.cyl16, this.m.teakDeck, lx, ly + 0.05 * sc, lz, 0.03 * sc, 0.10 * sc, 0.03 * sc, false);
    this._addMesh(grp, this.geos.treeCrown, this.m.lawn, lx, ly + 0.14 * sc, lz, sc, sc, sc, true);
  }

  _addHelipad(grp, lx, ly, lz, width = 0.30, ab = false) {
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.roofConcrete, lx, ly + 0.014, lz, width + 0.04, 0.026, width + 0.04, true);
    const pad = this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.helipad, lx, ly + 0.029, lz, width, 0.006, width, false);
    return pad;
  }

  _addRooftopHVAC(grp, lx, ly, lz, ab = false) {
    const mat = ab ? this.m.abandoned : this.m.brushedSilver;
    const fanMat = ab ? this.m.abandonedRust : this.m.steelDark;
    this._addMesh(grp, this.geos.box, mat, lx, ly + 0.042, lz, 0.16, 0.084, 0.11, true);
    this._addMesh(grp, this.geos.cyl16, fanMat, lx - 0.038, ly + 0.087, lz, 0.055, 0.010, 0.055, false);
    this._addMesh(grp, this.geos.cyl16, fanMat, lx + 0.038, ly + 0.087, lz, 0.055, 0.010, 0.055, false);
  }

  _placeGLB(grp, key, px, py, pz, sx, sy, sz, ab = false, ry = 0) {
    const proto = this.glbProtos && this.glbProtos[key];
    if (!proto) return false;
    const inst = proto.clone();
    if (ab) {
      inst.traverse((ch) => {
        if (ch.isMesh && ch.material) {
          if (Array.isArray(ch.material)) {
            ch.material = ch.material.map((mt) => this._getDustyGLBMat(mt));
          } else {
            ch.material = this._getDustyGLBMat(ch.material);
          }
        }
      });
    }
    inst.position.set(px, py, pz);
    inst.scale.set(sx, sy, sz);
    if (ry !== 0) inst.rotation.y = ry;
    grp.add(inst);
    return true;
  }

  // ==================== Master Building Factory ====================

  buildBuilding(b, x, z, y0, rotRad = 0, hooks = {}) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y0, z);
    grp.rotation.y = rotRad;

    const lv = Math.max(1, b.level || 1);
    const v = Math.abs(b.variant || 0);
    const ab = Boolean(b.abandoned);
    const type = b.type || 'RL';

    // Grounded Contact AO Shadow Skirt under every building
    if (type === 'stadium') {
      this._addContactAO(grp, 1.34, 1.14, 0.008);
    } else if (type === 'landmark' || type === 'amusement_park' || type === 'nuclear_plant' || type === 'solar_plant' || type === 'seaport') {
      this._addContactAO(grp, 1.16, 1.16, 0.008);
    } else if (type === 'airport') {
      this._addContactAO(grp, 1.16, 1.44, 0.008);
    } else if (type === 'power_wind') {
      this._addContactAO(grp, 0.48, 0.48, 0.008);
    } else {
      this._addContactAO(grp, 1.04, 1.04, 0.008);
    }

    switch (type) {
      case 'RL':
        this._buildVillaRL(grp, lv, v, ab);
        break;
      case 'CL':
        this._buildShopCL(grp, lv, v, ab);
        break;
      case 'RH':
        this._buildCondoRH(grp, lv, v, ab);
        break;
      case 'CH':
      case 'O':
        this._buildSkyscraperCHO(grp, type, lv, v, ab, x, y0, z, rotRad, hooks);
        break;
      case 'I':
        this._buildIndustrialI(grp, lv, v, ab, x, y0, z, rotRad, hooks);
        break;
      case 'landmark':
        this._buildLandmarkObelisk(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'stadium':
        this._buildOlympicStadium(grp, ab);
        break;
      case 'amusement_park':
        this._buildAmusementPark(grp, ab, hooks);
        break;
      case 'airport':
        this._buildAirport(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'seaport':
        this._buildSeaport(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'nuclear_plant':
        this._buildNuclearPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'solar_plant':
        this._buildSolarPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'waste_plant':
        this._buildWastePlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'power_wind':
        this._buildWindTurbine(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'power_plant':
        this._buildThermalPowerPlant(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'water_pump':
      case 'sewage_out':
      case 'water_treat':
        this._buildWaterFacility(grp, type, ab);
        break;
      case 'fire_station':
        this._buildFireStation(grp, ab, x, y0, z, rotRad, hooks);
        break;
      case 'police_station':
        this._buildPoliceStation(grp, ab);
        break;
      case 'hospital':
        this._buildHospital(grp, ab);
        break;
      case 'school':
        this._buildSchool(grp, ab);
        break;
      case 'park':
        this._buildPark(grp);
        break;
      case 'metro_station':
        this._buildMetroStation(grp, ab);
        break;
      case 'hsr_station':
        this._buildHSRStation(grp, ab);
        break;
      default:
        this._addZonedPlotPad(grp, ab, true);
        this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdIceBlue, 0, 0.024 + 0.34, 0, 0.64, 0.68, 0.64, true);
        break;
    }

    return grp;
  }

  // ==================== 1. Photorealistic PBR Zoned Buildings ====================

  _buildVillaRL(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, false);

    const lawnMat = ab ? this.m.abandonedRust : this.m.lawn;
    const hedgeMat = ab ? this.m.abandoned : this.m.hedge;
    const villaMats = [this.m.villaCream, this.m.villaSand, this.m.villaCool];
    const wallMat = ab ? this.m.dustyVilla : villaMats[v % villaMats.length];
    const trimMat = ab ? this.m.abandoned : this.m.parapetStone;

    this._addMesh(grp, this.geos.box, lawnMat, 0, 0.022, -0.14, 0.80, 0.012, 0.54, false);
    this._addMesh(grp, this.geos.box, hedgeMat, 0, 0.052, -0.42, 0.84, 0.06, 0.04, true);
    this._addMesh(grp, this.geos.box, hedgeMat, -0.42, 0.052, -0.05, 0.04, 0.06, 0.72, true);
    this._addMesh(grp, this.geos.box, hedgeMat, 0.42, 0.052, -0.05, 0.04, 0.06, 0.72, true);

    const baseY = 0.024;
    const mainH = lv >= 3 ? 0.51 : 0.34;
    const wingH = 0.34;
    const houseZ = lv >= 3 ? 0.11 : 0.04;
    const houseX = (v & 1) === 0 ? -0.08 : 0.08;
    const wingX = (v & 1) === 0 ? 0.19 : -0.19;

    this._addMesh(grp, this.geos.box, wallMat, houseX, baseY + mainH * 0.5, houseZ, 0.46, mainH, 0.42, true);
    this._addMesh(grp, this.geos.box, wallMat, wingX, baseY + wingH * 0.5, houseZ + 0.04, 0.26, wingH * 0.65, 0.34, true);
    this._addMesh(grp, this.geos.box, this.m.charcoalFrame, houseX, baseY + 0.15, houseZ + 0.24, 0.20, 0.020, 0.09, true);

    const isFlatModern = (v % 2) === 1;
    let roofTopY = baseY + mainH;

    if (isFlatModern) {
      this._addMesh(grp, this.geos.parapetFrame, trimMat, houseX, baseY + mainH + 0.024, houseZ, 0.47, 0.048, 0.43, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, wingX, baseY + wingH * 0.65 + 0.02, houseZ + 0.04, 0.27, 0.04, 0.35, true);
      roofTopY = baseY + mainH + 0.03;
    } else {
      const pitchMat = ab ? this.m.abandonedRust : ((v % 4 === 0) ? this.m.terracottaRoof : this.m.slateRoof);
      this._addMesh(grp, this.geos.taperPyr, pitchMat, houseX, baseY + mainH + 0.085, houseZ, 0.54, 0.17, 0.50, true, Math.PI * 0.25);
      this._addMesh(grp, this.geos.box, trimMat, wingX, baseY + wingH * 0.65 + 0.015, houseZ + 0.04, 0.28, 0.03, 0.36, true);
      roofTopY = baseY + mainH + 0.11;
    }

    if (lv >= 2 && !ab) {
      const sol = this._addMesh(grp, this.geos.box, this.m.solarPanel, wingX, baseY + wingH * 0.65 + 0.04, houseZ + 0.04, 0.20, 0.014, 0.18, false);
      sol.rotation.x = 0.22;
    }

    if (lv >= 3) {
      this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.teakDeck, -0.19, 0.032, -0.24, 0.32, 0.020, 0.22, false);
      this._addMesh(grp, this.geos.box, trimMat, 0.15, 0.032, -0.24, 0.36, 0.024, 0.23, false);
      if (!ab) {
        this._addMesh(grp, this.geos.box, this.m.poolWater, 0.15, 0.040, -0.24, 0.31, 0.014, 0.18, false);
        this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, -0.22, 0.095, -0.25, 0.015, 0.13, 0.015, false);
        this._addMesh(grp, this.geos.umbrellaCanopy, this.neonMats[v % this.neonMats.length], -0.22, 0.165, -0.25, 1, 1, 1, true);
      }
    } else if (!ab && roofTopY > 0) {
      this._addTinyTree(grp, 0.24, 0.024, -0.24, 0.62);
    }
  }

  _buildShopCL(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, false);

    const podMat = ab ? this.m.dustyRetail : this.m.retailPodiumConc;
    const upperMats = [this.m.finStoneChampagne, this.m.cbdIceBlue, this.m.condoWarmGrey, this.m.finStoneSilver];
    const upperMat = ab ? (v % 2 === 0 ? this.m.dustyStoneFin : this.m.dustyCBD) : upperMats[v % upperMats.length];
    const trimMat = ab ? this.m.abandoned : this.m.parapetStone;

    const baseY = 0.024;
    const podH = 0.36;
    const upperFloors = Math.min(3, lv);
    const upperH = upperFloors * 0.17;

    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, -0.05, 0.76, podH, 0.62, true);

    const uBase = baseY + podH;
    if ((v & 1) === 0) {
      this._addMesh(grp, this.geos.box, upperMat, 0, uBase + upperH * 0.5, -0.07, 0.72, upperH, 0.56, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, 0, uBase + upperH + 0.025, -0.07, 0.73, 0.05, 0.57, true);
    } else {
      this._addMesh(grp, this.geos.box, upperMat, -0.08, uBase + upperH * 0.5, -0.07, 0.56, upperH, 0.56, true);
      this._addMesh(grp, this.geos.box, upperMat, 0.18, uBase + (upperH * 0.66) * 0.5, -0.02, 0.34, upperH * 0.66, 0.48, true);
      this._addMesh(grp, this.geos.parapetFrame, trimMat, -0.08, uBase + upperH + 0.025, -0.07, 0.57, 0.05, 0.57, true);
    }

    const neonMat = ab ? this.m.abandonedRust : this.neonMats[(v + lv) % this.neonMats.length];
    this._addMesh(grp, this.geos.box, neonMat, 0, baseY + 0.27, 0.265, 0.54, 0.032, 0.018, false);
    this._addMesh(grp, this.geos.box, neonMat, 0.35, uBase + 0.16, 0.18, 0.020, 0.20, 0.065, false);

    if (!ab) {
      for (const cx of [-0.22, 0.20]) {
        this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, cx, 0.052, 0.34, 0.055, 0.045, 0.055, false);
        this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, cx, 0.10, 0.34, 0.012, 0.10, 0.012, false);
        this._addMesh(grp, this.geos.umbrellaCanopy, this.neonMats[(v + (cx > 0 ? 1 : 3)) % this.neonMats.length], cx, 0.16, 0.34, 0.80, 0.80, 0.80, true);
      }
    }

    this._addRooftopHVAC(grp, -0.14, uBase + upperH + 0.01, -0.10, ab);
  }

  _buildCondoRH(grp, lv, v, ab) {
    this._addZonedPlotPad(grp, ab, true);

    const facadeMats = [this.m.condoWarmWhite, this.m.condoWarmGrey, this.m.condoChampagne, this.m.condoSandStone];
    const wallMat = ab ? ((v & 1) ? this.m.dustyCondoGrey : this.m.dustyCondo) : facadeMats[v % facadeMats.length];
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;
    const pilasterMat = ab ? this.m.abandoned : this.m.parapetStone;
    const frameMat = ab ? this.m.abandonedRust : this.m.charcoalFrame;

    const baseY = 0.024;
    const podH = 0.36;
    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, 0.02, 0.80, podH, 0.72, true);
    this._addMesh(grp, this.geos.box, frameMat, 0, baseY + 0.24, 0.41, 0.36, 0.022, 0.09, true);

    const floorsByLv = [0, 8, 13, 19, 25, 31];
    const nFloors = floorsByLv[Math.min(5, lv)];
    const shaftH = nFloors * 0.15;
    const tBase = baseY + podH;
    const plan = v % 4;

    if (plan === 0) {
      const sideH = (nFloors - 1) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + shaftH * 0.5, -0.02, 0.72, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, -0.20, tBase + sideH * 0.5, -0.02, 0.24, sideH, 0.40, true);
      this._addMesh(grp, this.geos.box, wallMat, 0.20, tBase + sideH * 0.5, -0.02, 0.24, sideH, 0.40, true);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, topY + 0.038, -0.02, 0.73, 0.075, 0.33, true);
      this._addMesh(grp, this.geos.box, pilasterMat, 0, topY + 0.085, -0.03, 0.20, 0.15, 0.15, true);
      this._addMesh(grp, this.geos.box, frameMat, 0, topY + 0.165, -0.03, 0.22, 0.018, 0.17, false);
      this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, 0.20, topY + 0.055, -0.04, 0.09, 0.10, 0.09, true);
      this._addRooftopHVAC(grp, -0.20, topY + 0.005, -0.02, ab);
    } else if (plan === 1) {
      const northH = (nFloors - 2) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + shaftH * 0.5, 0.06, 0.68, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, 0, tBase + northH * 0.5, -0.15, 0.32, northH, 0.42, true);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, topY + 0.038, 0.06, 0.69, 0.075, 0.33, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0, tBase + northH + 0.032, -0.15, 0.33, 0.065, 0.43, true);
      this._addMesh(grp, this.geos.box, pilasterMat, 0, topY + 0.088, 0.02, 0.20, 0.16, 0.16, true);
      this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, -0.20, topY + 0.055, 0.06, 0.09, 0.10, 0.09, true);
      this._addRooftopHVAC(grp, 0.20, topY + 0.005, 0.06, ab);
    } else if (plan === 2) {
      const wingH = (nFloors - 3) * 0.15;
      this._addMesh(grp, this.geos.box, wallMat, 0.02, tBase + shaftH * 0.5, -0.12, 0.68, shaftH, 0.32, true);
      this._addMesh(grp, this.geos.box, wallMat, -0.16, tBase + wingH * 0.5, 0.08, 0.32, wingH, 0.50, true);

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0.02, topY + 0.038, -0.12, 0.69, 0.075, 0.33, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, -0.16, tBase + wingH + 0.032, 0.08, 0.33, 0.065, 0.51, true);
      this._addMesh(grp, this.geos.box, pilasterMat, -0.12, topY + 0.085, -0.12, 0.19, 0.15, 0.15, true);
      this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, 0.18, topY + 0.055, -0.12, 0.09, 0.10, 0.09, true);
    } else {
      const hB = Math.max(0.90, (nFloors - 4) * 0.15);
      this._addMesh(grp, this.geos.box, wallMat, -0.15, tBase + shaftH * 0.5, -0.06, 0.38, shaftH, 0.36, true);
      this._addMesh(grp, this.geos.box, wallMat, 0.16, tBase + hB * 0.5, 0.06, 0.36, hB, 0.36, true);

      const topA = tBase + shaftH;
      const topB = tBase + hB;
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, -0.15, topA + 0.035, -0.06, 0.39, 0.07, 0.37, true);
      this._addMesh(grp, this.geos.parapetFrame, pilasterMat, 0.16, topB + 0.035, 0.06, 0.37, 0.07, 0.37, true);
      this._addMesh(grp, this.geos.box, pilasterMat, -0.15, topA + 0.075, -0.06, 0.16, 0.13, 0.14, true);
      this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, 0.16, topB + 0.05, 0.06, 0.085, 0.095, 0.085, true);
    }
  }

  _buildSkyscraperCHO(grp, type, lv, v, ab, x, y0, z, rotRad, hooks) {
    this._addZonedPlotPad(grp, ab, true);

    const isOffice = type === 'O';
    const metalMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const darkBandMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const ledMat = ab ? this.m.abandoned : (isOffice ? this.m.ledLinearCyan : this.m.ledLinearWhite);
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;

    const baseY = 0.024;
    const podH = 0.36;
    this._addMesh(grp, this.geos.box, podMat, 0, baseY + podH * 0.5, 0, 0.80, podH, 0.76, true);
    this._addMesh(grp, this.geos.box, metalMat, 0, baseY + 0.24, 0.41, 0.40, 0.024, 0.09, true);

    const floorsByLv = [0, 8, 14, 21, 28, 35];
    const nFloors = floorsByLv[Math.min(5, lv)];
    const shaftH = nFloors * 0.17;
    const tBase = baseY + podH;
    const sil = (v + (isOffice ? 2 : 0)) % 4;
    let helipadY = tBase + shaftH;
    let helipadX = 0, helipadZ = -0.02;

    if (sil === 0) {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdSlateSilver : this.m.cbdIceBlue);
      const w = 0.60, d = 0.56;
      this._addMesh(grp, this.geos.box, mat, 0, tBase + shaftH * 0.5, -0.02, w, shaftH, d, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0, tBase + shaftH * 0.5, -0.02, w, shaftH, d, true);
      this._addMesh(grp, this.geos.box, darkBandMat, 0, tBase + Math.floor(nFloors * 0.5) * 0.17, -0.02, w + 0.012, 0.065, d + 0.012, true);
      if (lv >= 4) {
        this._addMesh(grp, this.geos.box, darkBandMat, 0, tBase + Math.floor(nFloors * 0.78) * 0.17, -0.02, w + 0.012, 0.065, d + 0.012, true);
      }

      const topY = tBase + shaftH;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0, topY + 0.06, -0.02, w + 0.01, 0.12, d + 0.01, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0, topY + 0.125, -0.02, w + 0.016, 0.016, d + 0.016, false);
      this._addRooftopHVAC(grp, -0.14, topY + 0.005, -0.14, ab);
      helipadY = topY + 0.005;
      helipadX = 0.06; helipadZ = 0.04;
    } else if (sil === 1) {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdTealGlass : this.m.cbdDeepAzure);
      const hA = shaftH;
      const hB = Math.max(1.02, Math.floor(nFloors * 0.80) * 0.17);

      this._addMesh(grp, this.geos.box, mat, -0.17, tBase + hA * 0.5, -0.09, 0.36, hA, 0.40, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, -0.17, tBase + hA * 0.5, -0.09, 0.36, hA, 0.40, true);
      this._addMesh(grp, this.geos.box, mat, 0.17, tBase + hB * 0.5, 0.10, 0.36, hB, 0.40, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0.17, tBase + hB * 0.5, 0.10, 0.36, hB, 0.40, true);

      const sbY = tBase + Math.floor(nFloors * 0.52) * 0.17;
      this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, sbY, 0.005, 0.38, 0.10, 0.15, true, -0.46);
      this._addMesh(grp, this.geos.box, metalMat, 0, sbY - 0.055, 0.005, 0.39, 0.018, 0.16, true, -0.46);

      const topA = tBase + hA;
      const topB = tBase + hB;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, -0.17, topA + 0.045, -0.09, 0.365, 0.09, 0.405, true);
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0.17, topB + 0.045, 0.10, 0.365, 0.09, 0.405, true);
      if (!ab) {
        this._addMesh(grp, this.geos.parapetFrame, ledMat, -0.17, topA + 0.095, -0.09, 0.37, 0.015, 0.41, false);
        this._addMesh(grp, this.geos.parapetFrame, ledMat, 0.17, topB + 0.095, 0.10, 0.37, 0.015, 0.41, false);
      }
      this._addRooftopHVAC(grp, 0.17, topB + 0.005, 0.10, ab);
      helipadY = topA + 0.005;
      helipadX = -0.17; helipadZ = -0.09;
    } else if (sil === 2) {
      const mat = ab ? this.m.dustyStoneFin : (isOffice ? this.m.finStoneSilver : this.m.finStoneChampagne);
      const n1 = Math.max(4, Math.round(nFloors * 0.52));
      const n2 = Math.max(2, Math.round(nFloors * 0.28));
      const n3 = Math.max(2, nFloors - n1 - n2);
      const h1 = n1 * 0.17, h2 = n2 * 0.17, h3 = n3 * 0.17;

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 * 0.5, 0, 0.68, h1, 0.64, true);
      this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, tBase + h1 + 0.02, 0, 0.69, 0.04, 0.65, true);

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 + h2 * 0.5, 0, 0.54, h2, 0.52, true);
      this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, tBase + h1 + h2 + 0.02, 0, 0.55, 0.04, 0.53, true);

      this._addMesh(grp, this.geos.box, mat, 0, tBase + h1 + h2 + h3 * 0.5, 0, 0.42, h3, 0.42, true);

      const topY = tBase + h1 + h2 + h3;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0, topY + 0.055, 0, 0.43, 0.11, 0.43, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0, topY + 0.115, 0, 0.435, 0.015, 0.435, false);
      this._addRooftopHVAC(grp, 0.20, tBase + h1 + 0.005, 0.18, ab);
      helipadY = topY + 0.005;
      helipadX = 0; helipadZ = 0;
    } else {
      const mat = ab ? this.m.dustyCBD : (isOffice ? this.m.cbdSlateSilver : this.m.cbdTealGlass);
      const nLo = Math.max(4, Math.floor(nFloors * 0.52));
      const nHi = Math.max(3, nFloors - nLo);
      const hLo = nLo * 0.17, hHi = nHi * 0.17;

      this._addMesh(grp, this.geos.box, mat, -0.025, tBase + hLo * 0.5, 0.015, 0.64, hLo, 0.58, true);
      this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, tBase + hLo + 0.04, 0, 0.58, 0.08, 0.52, false);
      const hiBase = tBase + hLo + 0.08;
      this._addMesh(grp, this.geos.box, mat, 0.025, hiBase + hHi * 0.5, -0.015, 0.64, hHi, 0.58, true);
      this._addMesh(grp, this.geos.rectCornerFins, metalMat, 0.025, hiBase + hHi * 0.5, -0.015, 0.64, hHi, 0.58, true);

      const topY = hiBase + hHi;
      this._addMesh(grp, this.geos.parapetFrame, metalMat, 0.025, topY + 0.05, -0.015, 0.645, 0.10, 0.585, true);
      if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledMat, 0.025, topY + 0.105, -0.015, 0.65, 0.015, 0.59, false);
      this._addRooftopHVAC(grp, -0.14, topY + 0.005, -0.12, ab);
      helipadY = topY + 0.005;
      helipadX = 0.08; helipadZ = 0.05;
    }

    if (lv >= 4) {
      const padW = sil === 1 ? 0.24 : 0.27;
      this._addHelipad(grp, helipadX, helipadY, helipadZ, padW, ab);
      const mastX = sil === 1 ? -0.30 : (helipadX - 0.18);
      const mastZ = sil === 1 ? -0.24 : (helipadZ - 0.18);
      this._addMesh(grp, this.geos.spireNeedle, metalMat, mastX, helipadY + 0.38, mastZ, 0.85, 0.82, 0.85, true);
      this._addBeacon(grp, hooks, mastX, helipadY + 0.80, mastZ, x, y0, z, rotRad, ab);
    } else if (lv >= 3) {
      this._addMesh(grp, this.geos.spireNeedle, metalMat, helipadX, helipadY + 0.28, helipadZ, 0.75, 0.62, 0.75, true);
      this._addBeacon(grp, hooks, helipadX, helipadY + 0.60, helipadZ, x, y0, z, rotRad, ab);
    }
  }

  _buildIndustrialI(grp, lv, v, ab, x, y0, z, rotRad, hooks) {
    const flip = (Math.floor(v / 3) % 2 === 1) ? -1 : 1;

    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.asphalt, 0, 0.025, -0.02, 0.82, 0.008, 0.76, false);
    const baseY = 0.028;

    if (lv >= 4) {
      const fabMat = ab ? this.m.dustyInd : this.m.indPanelSilver;
      const officeMat = ab ? this.m.dustyCBD : ((v & 1) === 0 ? this.m.cbdDeepAzure : this.m.cbdSlateSilver);
      const fasciaMat = ab ? this.m.abandonedRust : ((v & 1) === 0 ? this.m.factoryFasciaBlue : this.m.factoryFasciaTeal);
      const silver = ab ? this.m.abandoned : this.m.brushedSilver;

      if ((v & 1) === 0) {
        const fabH = 0.42 + (lv - 4) * 0.14;
        this._addMesh(grp, this.geos.box, fabMat, 0, baseY + fabH * 0.5, -0.08, 0.76, fabH, 0.52, true);
        this._addMesh(grp, this.geos.box, fasciaMat, 0, baseY + fabH + 0.015, -0.08, 0.775, 0.03, 0.535, true);
        this._addMesh(grp, this.geos.parapetFrame, silver, 0, baseY + fabH + 0.04, -0.08, 0.76, 0.04, 0.52, true);

        for (const dx of [-0.22, 0, 0.22]) {
          this._addMesh(grp, this.geos.box, this.m.charcoalFrame, dx, baseY + 0.10, 0.185, 0.12, 0.17, 0.02, false);
        }
        this._addMesh(grp, this.geos.box, silver, 0, baseY + 0.21, 0.24, 0.62, 0.022, 0.12, true);
        const cMat = ab ? this.m.abandonedRust : this.containerMats[v % this.containerMats.length];
        this._addMesh(grp, this.geos.box, cMat, 0.20 * flip, baseY + 0.05, 0.27, 0.11, 0.09, 0.20, true);

        const topY = baseY + fabH + 0.02;
        this._addRooftopHVAC(grp, -0.23, topY, -0.18, ab);
        this._addRooftopHVAC(grp, -0.23, topY, 0.02, ab);
        if (!ab) {
          for (const pz of [-0.18, 0.02]) {
            const pv = this._addMesh(grp, this.geos.box, this.m.solarPanel, 0.14, topY + 0.03, pz, 0.38, 0.014, 0.14, false);
            pv.rotation.x = 0.20;
          }
        }
      } else {
        const hallH = 0.42;
        const rdH = 0.68;
        this._addMesh(grp, this.geos.box, fabMat, 0.02 * flip, baseY + hallH * 0.5, -0.13, 0.74, hallH, 0.44, true);
        this._addMesh(grp, this.geos.box, officeMat, -0.19 * flip, baseY + rdH * 0.5, 0.15, 0.34, rdH, 0.30, true);
        this._addMesh(grp, this.geos.parapetFrame, silver, -0.19 * flip, baseY + rdH + 0.025, 0.15, 0.35, 0.045, 0.31, true);

        this._addMesh(grp, this.geos.box, silver, 0.18 * flip, baseY + 0.20, 0.14, 0.32, 0.022, 0.13, true);
        const c1 = ab ? this.m.abandonedRust : this.containerMats[(v + 1) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, c1, 0.18 * flip, baseY + 0.05, 0.22, 0.11, 0.09, 0.20, true);

        this._addRooftopHVAC(grp, -0.19 * flip, baseY + rdH + 0.005, 0.15, ab);
        if (!ab) {
          for (const px of [-0.20, 0.02, 0.24]) {
            const pv = this._addMesh(grp, this.geos.box, this.m.solarPanel, px * flip, baseY + hallH + 0.025, -0.13, 0.17, 0.014, 0.30, false);
            pv.rotation.x = 0.18;
          }
        }
      }
      return;
    }

    const arch = v % 3;

    if (arch === 0) {
      const whMat = ab ? this.m.dustyInd : (((v >> 1) & 1) === 0 ? this.m.indPanelBlue : this.m.indPanelSilver);
      const fascia = ab ? this.m.abandonedRust : (((v >> 1) & 1) === 0 ? this.m.factoryFasciaBlue : this.m.factoryFasciaTeal);
      const whH = 0.36 + (lv - 1) * 0.05;

      this._addMesh(grp, this.geos.box, whMat, 0, baseY + whH * 0.5, -0.12, 0.76, whH, 0.48, true);
      this._addMesh(grp, this.geos.box, fascia, 0, baseY + whH + 0.016, -0.12, 0.775, 0.032, 0.495, false);

      this._addRooftopHVAC(grp, -0.22 * flip, baseY + whH + 0.02, -0.14, ab);
      for (const vx of [0.02, 0.22]) {
        this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, vx * flip, baseY + whH + 0.045, -0.12, 0.07, 0.04, 0.07, true);
      }

      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0, baseY + 0.19, 0.17, 0.68, 0.022, 0.13, true);
      const bayXs = [-0.22, 0.0, 0.22];
      for (let i = 0; i < 3; i++) {
        this._addMesh(grp, this.geos.box, this.m.charcoalFrame, bayXs[i], baseY + 0.09, 0.125, 0.11, 0.15, 0.02, false);
        const cMat = ab ? this.m.abandonedRust : this.containerMats[(v + i) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, cMat, bayXs[i], baseY + 0.05, 0.24, 0.105, 0.09, 0.20, true);
      }
    } else if (arch === 1) {
      const hallMat = ab ? this.m.dustyInd : this.m.indPanelWarm;
      const darkRoof = ab ? this.m.abandoned : this.m.steelDark;
      const hallH = 0.38 + (lv - 1) * 0.06;

      this._addMesh(grp, this.geos.box, hallMat, -0.13 * flip, baseY + hallH * 0.5, -0.06, 0.52, hallH, 0.62, true);
      this._addMesh(grp, this.geos.sawtoothRoof, darkRoof, -0.13 * flip, baseY + hallH + 0.045, -0.06, 0.72, 0.58, 0.82, true);

      const gMat = ab ? this.m.abandonedRust : this.m.craneYellow;
      for (const gz of [-0.14, 0.18]) {
        this._addMesh(grp, this.geos.box, gMat, 0.17 * flip, baseY + 0.16, gz, 0.024, 0.32, 0.024, true);
        this._addMesh(grp, this.geos.box, gMat, 0.37 * flip, baseY + 0.16, gz, 0.024, 0.32, 0.024, true);
      }
      this._addMesh(grp, this.geos.box, this.m.steelDark, 0.17 * flip, baseY + 0.32, 0.02, 0.024, 0.022, 0.40, true);
      this._addMesh(grp, this.geos.box, this.m.steelDark, 0.37 * flip, baseY + 0.32, 0.02, 0.024, 0.022, 0.40, true);
      this._addMesh(grp, this.geos.box, gMat, 0.27 * flip, baseY + 0.34, 0.04, 0.24, 0.030, 0.05, true);

      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0.27 * flip, baseY + 0.035, -0.04, 0.13, 0.055, 0.16, true);
      this._addMesh(grp, this.geos.box, this.m.teakDeck, 0.27 * flip, baseY + 0.04, 0.14, 0.12, 0.07, 0.12, true);

      const stackH = hallH + 0.50;
      const sx = -0.27 * flip, sz = -0.28;
      this._addMesh(grp, this.geos.taperOct, ab ? this.m.abandonedRust : this.m.factoryBrick, sx, baseY + stackH * 0.5, sz, 0.14, stackH, 0.14, true);
      this._addMesh(grp, this.geos.cyl16, this.m.charcoalFrame, sx, baseY + stackH - 0.025, sz, 0.09, 0.045, 0.09, false);
      if (!ab) this._pushSmoke(hooks, sx, baseY + stackH + 0.04, sz, x, y0, z, rotRad, false);
    } else {
      const ctrlMat = ab ? this.m.dustyInd : this.m.indPanelBlue;
      const tankMat = ab ? this.m.abandoned : this.m.whiteComposite;
      const silver = ab ? this.m.abandoned : this.m.brushedSilver;
      const ctrlH = 0.36 + (lv - 1) * 0.05;

      this._addMesh(grp, this.geos.box, ctrlMat, -0.21 * flip, baseY + ctrlH * 0.5, 0.14, 0.34, ctrlH, 0.34, true);
      this._addMesh(grp, this.geos.parapetFrame, silver, -0.21 * flip, baseY + ctrlH + 0.02, 0.14, 0.35, 0.035, 0.35, true);

      for (const [tx, tz, sc] of [[-0.18 * flip, -0.20, 0.82], [0.13 * flip, -0.20, 0.74]]) {
        this._addMesh(grp, this.geos.gasSphereSupport, this.m.steelDark, tx, baseY, tz, sc, sc, sc, true);
        this._addMesh(grp, this.geos.sphere16, tankMat, tx, baseY + 0.33 * sc, tz, 0.34 * sc, 0.34 * sc, 0.34 * sc, true);
        if (!ab) {
          this._addMesh(grp, this.geos.cyl24, this.m.factoryFasciaTeal, tx, baseY + 0.33 * sc, tz, 0.348 * sc, 0.02, 0.348 * sc, false);
        }
      }

      const pipeEW = this._addMesh(grp, this.geos.cyl16, silver, -0.02 * flip, baseY + 0.22, -0.04, 0.028, 0.50, 0.028, true);
      pipeEW.rotation.z = Math.PI * 0.5;
      const pipeNS = this._addMesh(grp, this.geos.cyl16, silver, 0.18 * flip, baseY + 0.22, -0.02, 0.026, 0.38, 0.026, true);
      pipeNS.rotation.x = Math.PI * 0.5;

      const colH = 0.60 + lv * 0.10;
      const cx = 0.19 * flip, cz = 0.15;
      this._addMesh(grp, this.geos.cyl24, silver, cx, baseY + colH * 0.5, cz, 0.14, colH, 0.14, true);
      this._addMesh(grp, this.geos.hemiDome, silver, cx, baseY + colH, cz, 0.14, 0.07, 0.14, true);
      for (let r = 1; r <= 3; r++) {
        this._addMesh(grp, this.geos.cyl24, this.m.steelDark, cx, baseY + (colH * r) * 0.26, cz, 0.175, 0.015, 0.175, false);
      }

      const stackH = colH + 0.22;
      const sx = 0.31 * flip, sz = -0.02;
      this._addMesh(grp, this.geos.cyl16, silver, sx, baseY + stackH * 0.5, sz, 0.052, stackH, 0.052, true);
      if (!ab) this._pushSmoke(hooks, sx, baseY + stackH + 0.03, sz, x, y0, z, rotRad, true);
    }
  }

  // ==================== 2. Landmark, Civic, Energy & Hydroelectric Dam ====================

  // Sculpted Monumental Hydroelectric Gravity Dam Segment (local y=0 corresponds to world y=0)
  createHydroDamSegment(crestY = 1.0, minH = -0.4, isGenerating = false, damHp = 100) {
    const THREE = this.THREE;
    const grp = new THREE.Group();

    const cY = Number.isFinite(crestY) ? crestY : 1.0;
    const mH = Number.isFinite(minH) ? minH : -0.4;
    const baseY = Math.min(-0.65, mH - 0.22);
    const wallH = Math.max(0.45, cY - baseY);
    const midY = baseY + wallH * 0.5;

    // 1. Tapered/Sloped Concrete Gravity Dam Wall (wide anchored toe tapering cleanly to crest)
    this._addMesh(grp, this.geos.damGravityBody, this.m.damConcrete, 0, midY, 0, 1.02, wallH, 1.02, true);

    // 2. Flanking Concrete Buttress Piers + Recessed Vertical Spillway Sluice Bay + Steel Gate Lintel
    this._addMesh(grp, this.geos.damButtresses, this.m.damConcrete, 0, midY, 0, 1.0, wallH, 1.0, true);
    const sluiceH = Math.max(0.24, wallH * 0.62);
    const sluiceY = cY - sluiceH * 0.5 - 0.08;
    this._addMesh(grp, this.geos.box, this.m.darkGranite, 0, sluiceY, 0, 0.48, sluiceH, 1.05, true);
    this._addMesh(grp, this.geos.box, this.m.darkGranite, 0, sluiceY, 0, 1.05, sluiceH, 0.48, true);
    // Steel Tainter-Gate Spillway Lintels near crest
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0, cY - 0.11, 0, 0.54, 0.055, 1.08, true);
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0, cY - 0.11, 0, 1.08, 0.055, 0.54, true);

    // 3. Crest Roadway Deck + Dual Safety Parapet Curbs
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, cY + 0.018, 0, 1.02, 0.036, 0.88, false);
    this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, cY + 0.052, 0, 1.03, 0.055, 1.03, true);

    // 4. Lower Turbine Powerhouse Intake Gallery + Cyan Generation Status / Red Low-HP Hazard Stripe
    const phH = Math.min(0.32, wallH * 0.36);
    const phY = baseY + wallH * 0.28;
    this._addMesh(grp, this.geos.box, this.m.damConcrete, 0, phY, 0, 0.62, phH, 1.14, true);
    this._addMesh(grp, this.geos.box, this.m.damConcrete, 0, phY, 0, 1.14, phH, 0.62, true);

    const statusMat = isGenerating ? this.m.ledLinearCyan : this.m.charcoalFrame;
    this._addMesh(grp, this.geos.box, statusMat, 0, phY + phH * 0.25, 0, 0.46, 0.042, 1.16, false);
    this._addMesh(grp, this.geos.box, statusMat, 0, phY + phH * 0.25, 0, 1.16, 0.042, 0.46, false);

    if (damHp !== undefined && damHp < 65) {
      this._addMesh(grp, this.geos.box, this.m.beaconRed, 0, cY - 0.045, 0, 1.07, 0.035, 1.07, false);
    }

    return grp;
  }

  _buildLandmarkObelisk(grp, ab, x, y0, z, rotRad, hooks) {
    const silver = ab ? this.m.abandoned : this.m.brushedSilver;
    const glassMain = ab ? this.m.dustyCBD : this.m.cbdIceBlue;
    const glassUpper = ab ? this.m.dustyCBD : this.m.cbdSlateSilver;
    const podMat = ab ? this.m.dustyRetail : this.m.retailPodium;
    const refugeMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const ledTrim = ab ? this.m.abandoned : this.m.ledLinearCyan;

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.03, 0, 1.06, 0.06, 1.06, true);
    this._addMesh(grp, this.geos.box, podMat, 0, 0.24, 0, 0.88, 0.36, 0.88, true);
    this._addMesh(grp, this.geos.box, silver, 0, 0.43, 0, 0.90, 0.025, 0.90, true);
    if (!ab) {
      for (const [tx, tz] of [[-0.44, -0.44], [0.44, -0.44], [-0.44, 0.44], [0.44, 0.44]]) {
        this._addTinyTree(grp, tx, 0.06, tz, 0.65);
      }
    }

    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 0.45 + 1.53, 0, 0.84, 3.06, 0.72, true);
    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 0.45 + 1.53, 0, 0.72, 3.06, 0.84, true);
    this._addMesh(grp, this.geos.rectCornerFins, silver, 0, 0.45 + 1.53, 0, 0.68, 3.06, 0.68, true);
    this._addMesh(grp, this.geos.box, refugeMat, 0, 3.51, 0, 0.64, 0.08, 0.64, true);
    if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledTrim, 0, 3.56, 0, 0.65, 0.02, 0.65, false);

    this._addMesh(grp, this.geos.taperSquare, glassUpper, 0, 3.56 + 1.19, 0, 0.64, 2.38, 0.54, true);
    this._addMesh(grp, this.geos.taperSquare, glassUpper, 0, 3.56 + 1.19, 0, 0.54, 2.38, 0.64, true);
    this._addMesh(grp, this.geos.rectCornerFins, silver, 0, 3.56 + 1.19, 0, 0.52, 2.38, 0.52, true);
    this._addMesh(grp, this.geos.box, refugeMat, 0, 5.94, 0, 0.48, 0.075, 0.48, true);
    if (!ab) this._addMesh(grp, this.geos.parapetFrame, ledTrim, 0, 5.985, 0, 0.49, 0.02, 0.49, false);

    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 5.99 + 0.85, 0, 0.48, 1.70, 0.40, true);
    this._addMesh(grp, this.geos.taperSquare, glassMain, 0, 5.99 + 0.85, 0, 0.40, 1.70, 0.48, true);
    this._addMesh(grp, this.geos.parapetFrame, silver, 0, 7.72, 0, 0.36, 0.14, 0.36, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.atriumGlass, 0, 7.72, 0, 0.32, 0.12, 0.32, false);
      this._addMesh(grp, this.geos.parapetFrame, this.m.ledLinearWhite, 0, 7.80, 0, 0.37, 0.02, 0.37, false);
    }
    this._addHelipad(grp, 0, 7.76, 0, 0.24, ab);

    this._addMesh(grp, this.geos.spireNeedle, silver, 0, 7.79 + 0.42, 0, 1.35, 0.96, 1.35, true, Math.PI * 0.25);
    this._addBeacon(grp, hooks, 0, 8.64, 0, x, y0, z, rotRad, ab);
  }

  _buildOlympicStadium(grp, ab) {
    const shellMat = ab ? this.m.abandoned : this.m.whiteComposite;
    const roofMat = ab ? this.m.abandoned : this.m.brushedSilver;
    const lightMat = ab ? this.m.abandonedRust : this.m.floodlightWhite;

    this._addMesh(grp, this.geos.cyl24, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 1.24, 0.03, 1.04, false);
    this._addMesh(grp, this.geos.stadiumBowl, shellMat, 0, 0.02, 0, 1.16, 1.05, 0.94, true);
    this._addMesh(grp, this.geos.stadiumRoof, roofMat, 0, 0.02, 0, 1.16, 1.05, 0.94, true);
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandonedRust : this.m.soccerPitch, 0, 0.045, 0, 0.68, 0.015, 0.54, false);

    for (const [sx, sz] of [[-0.48, -0.38], [0.48, -0.38], [-0.48, 0.38], [0.48, 0.38]]) {
      const ang = Math.atan2(-sx, -sz);
      const mast = this._addMesh(grp, this.geos.cyl16, this.m.steelDark, sx, 0.36, sz, 0.026, 0.68, 0.026, true, ang);
      mast.rotation.x = 0.16;
      const head = this._addMesh(grp, this.geos.box, lightMat, sx * 0.88, 0.69, sz * 0.88, 0.13, 0.075, 0.035, false, ang);
      head.rotation.x = 0.45;
    }
  }

  _buildAmusementPark(grp, ab, hooks) {
    const THREE = this.THREE;
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.018, 0, 1.06, 0.035, 1.06, false);

    const t1 = ab ? this.m.abandonedRust : this.m.neonRose;
    const t2 = ab ? this.m.abandonedRust : this.m.neonGold;
    const t3 = ab ? this.m.abandonedRust : this.m.neonCyan;

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, -0.32, 0.09, 0.30, 0.22, 0.12, 0.22, true);
    this._addMesh(grp, this.geos.cone8, t1, -0.32, 0.21, 0.30, 0.28, 0.14, 0.28, true);

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0.32, 0.09, 0.30, 0.22, 0.12, 0.22, true);
    this._addMesh(grp, this.geos.cone8, t2, 0.32, 0.21, 0.30, 0.28, 0.14, 0.28, true);

    this._addMesh(grp, this.geos.cyl16, t3, 0.34, 0.08, -0.28, 0.20, 0.10, 0.20, true);
    this._addMesh(grp, this.geos.hemiDome, this.m.whiteComposite, 0.34, 0.13, -0.28, 0.22, 0.14, 0.22, true);

    const hubY = 0.92;
    const pylonMat = ab ? this.m.abandoned : this.m.whiteComposite;
    for (const pz of [-0.13, 0.13]) {
      for (const side of [-1, 1]) {
        const leg = this._addMesh(grp, this.geos.cyl16, pylonMat, side * 0.19, hubY * 0.5, pz, 0.032, 0.98, 0.032, true);
        leg.rotation.z = side * 0.38;
      }
    }

    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(-0.04, hubY, 0);
    this._addMesh(wheelGroup, this.geos.ferrisWheelFrame, ab ? this.m.abandoned : this.m.brushedSilver, 0, 0, 0, 1, 1, 1, true);
    if (!ab) {
      const ledTorus = this._addMesh(wheelGroup, this.geos.cyl24, this.m.neonCyan, 0, 0, 0, 0.22, 0.16, 0.22, false);
      ledTorus.rotation.x = Math.PI * 0.5;
    }

    const gondolas = [];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const gx = Math.cos(a) * 0.68;
      const gy = Math.sin(a) * 0.68;
      const gMat = ab ? this.m.abandonedRust : this.neonMats[i % this.neonMats.length];
      const pod = new THREE.Mesh(this.geos.capsule, gMat);
      pod.position.set(gx, gy, 0);
      pod.scale.set(0.24, 0.16, 0.28);
      pod.rotation.x = Math.PI * 0.5;
      pod.castShadow = true;
      wheelGroup.add(pod);
      gondolas.push(pod);
    }
    wheelGroup.userData.gondolas = gondolas;
    grp.add(wheelGroup);

    if (!ab && hooks && hooks.ferrisWheels) {
      hooks.ferrisWheels.push(wheelGroup);
    }
  }

  _buildAirport(grp, ab, x, y0, z, rotRad, hooks) {
    const THREE = this.THREE;
    const silver = ab ? this.m.abandoned : this.m.brushedSilver;
    const glass = ab ? this.m.dustyCBD : this.m.cbdIceBlue;

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, -0.18, 0.015, 0, 0.86, 0.03, 1.18, false);
    this._addMesh(grp, this.geos.box, glass, -0.22, 0.19, 0, 0.44, 0.34, 0.82, true);
    const roof = this._addMesh(grp, this.geos.gullWingRoof, silver, -0.22, 0.35, 0, 0.96, 1.0, 1.68, true);
    roof.rotation.y = Math.PI * 0.5;

    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0.05, 0.14, -0.20, 0.18, 0.045, 0.045, true);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0.05, 0.14, 0.22, 0.18, 0.045, 0.045, true);

    const tx = -0.40, tz = -0.44;
    this._addMesh(grp, this.geos.taperOct, ab ? this.m.abandoned : this.m.whiteComposite, tx, 0.58, tz, 0.24, 1.14, 0.24, true);
    const atcCab = this._addMesh(grp, this.geos.taperOct, glass, tx, 1.22, tz, 0.38, 0.18, 0.38, true);
    atcCab.rotation.z = Math.PI;
    this._addMesh(grp, this.geos.cyl24, silver, tx, 1.33, tz, 0.22, 0.04, 0.22, true);

    const radar = new THREE.Group();
    radar.position.set(tx, 1.40, tz);
    this._addMesh(radar, this.geos.cyl16, silver, 0, -0.02, 0, 0.025, 0.06, 0.025, false);
    this._addMesh(radar, this.geos.box, ab ? this.m.abandonedRust : this.m.craneRed, 0, 0.02, 0, 0.24, 0.032, 0.028, true);
    this._addMesh(radar, this.geos.box, this.m.whiteComposite, 0, 0.02, 0, 0.14, 0.036, 0.032, false);
    grp.add(radar);

    if (!ab && hooks && hooks.radarDishes) hooks.radarDishes.push(radar);
    this._addBeacon(grp, hooks, tx, 1.48, tz, x, y0, z, rotRad, ab);

    const rx = 0.36;
    this._addMesh(grp, this.geos.box, this.m.runway, rx, 0.022, 0, 0.34, 0.018, 1.38, false);
    if (!ab) {
      for (const rz of [-0.66, 0.66]) {
        this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, rx - 0.12, 0.038, rz, 0.028, 0.028, 0.028, false);
        this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, rx + 0.12, 0.038, rz, 0.028, 0.028, 0.028, false);
      }
      for (const rz of [-0.42, -0.14, 0.14, 0.42]) {
        this._addMesh(grp, this.geos.sphere16, this.m.neonGold, rx - 0.15, 0.036, rz, 0.024, 0.024, 0.024, false);
        this._addMesh(grp, this.geos.sphere16, this.m.neonGold, rx + 0.15, 0.036, rz, 0.024, 0.024, 0.024, false);
      }
    }
  }

  _buildSeaport(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.roofConcrete, 0, 0.03, -0.02, 1.08, 0.18, 0.96, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.craneYellow, 0, 0.125, 0.44, 1.06, 0.018, 0.035, false);
    }
    for (const fx of [-0.38, -0.12, 0.14, 0.40]) {
      this._addMesh(grp, this.geos.box, this.m.asphalt, fx, 0.02, 0.47, 0.05, 0.14, 0.03, false);
    }

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = -0.32 + col * 0.32;
        const cz = -0.34 + row * 0.15;
        const m1 = ab ? this.m.abandonedRust : this.containerMats[(row * 3 + col) % this.containerMats.length];
        const m2 = ab ? this.m.abandoned : this.containerMats[(row * 3 + col + 2) % this.containerMats.length];
        this._addMesh(grp, this.geos.box, m1, cx, 0.165, cz, 0.25, 0.09, 0.105, true);
        if ((row + col) % 2 === 0) {
          this._addMesh(grp, this.geos.box, m2, cx, 0.255, cz, 0.25, 0.09, 0.105, true);
        }
      }
    }

    const craneRed = ab ? this.m.abandonedRust : this.m.craneRed;
    const craneWhite = ab ? this.m.abandoned : this.m.whiteComposite;
    for (const gx of [-0.27, 0.27]) {
      this._addMesh(grp, this.geos.gantryCraneRed, craneRed, gx, 0.12, 0.16, 0.92, 0.95, 0.92, true);
      this._addMesh(grp, this.geos.box, craneWhite, gx, 1.05, 0.16, 0.20, 0.09, 0.22, true);
      this._addMesh(grp, this.geos.box, craneWhite, gx, 1.035, 0.56, 0.16, 0.038, 0.24, false);
      this._addMesh(grp, this.geos.box, this.m.craneYellow, gx, 0.84, 0.64, 0.12, 0.035, 0.08, true);
      this._addBeacon(grp, hooks, gx, 1.46, 0.18, x, y0, z, rotRad, ab);
    }
  }

  _buildNuclearPlant(grp, ab, x, y0, z, rotRad, hooks) {
    const conc = ab ? this.m.abandoned : this.m.damConcrete;
    const white = ab ? this.m.abandoned : this.m.whiteComposite;

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.roofConcrete, 0, 0.015, 0, 1.04, 0.03, 1.04, false);
    this._addMesh(grp, this.geos.cyl24, white, -0.24, 0.30, 0.20, 0.42, 0.58, 0.42, true);
    this._addMesh(grp, this.geos.hemiDome, conc, -0.24, 0.59, 0.20, 0.42, 0.36, 0.42, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, this.m.ledLinearCyan, -0.24, 0.58, 0.20, 0.43, 0.02, 0.43, false);
    }
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyInd : this.m.indPanelSilver, 0.20, 0.22, 0.24, 0.42, 0.42, 0.34, true);

    this._addMesh(grp, this.geos.coolingTower, this.m.plazaStone, -0.22, 0.02, -0.22, 0.96, 1.08, 0.96, true);
    this._addMesh(grp, this.geos.coolingTower, this.m.plazaStone, 0.24, 0.02, -0.20, 0.96, 1.08, 0.96, true);

    if (!ab) {
      this._pushSmoke(hooks, -0.22, 1.16, -0.22, x, y0, z, rotRad, true);
      this._pushSmoke(hooks, 0.24, 1.16, -0.20, x, y0, z, rotRad, true);
    }
  }

  _buildSolarPlant(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.pavingPlazaDusty : this.m.roofConcrete, 0, 0.012, 0, 1.08, 0.024, 1.08, false);
    this._addMesh(grp, this.geos.heliostatPedestals, this.m.steelDark, 0, 0.02, 0, 1, 1, 1, false);
    this._addMesh(grp, this.geos.heliostatMirrors, ab ? this.m.abandoned : this.m.solarPanel, 0, 0.02, 0, 1, 1, 1, true);

    this._addMesh(grp, this.geos.taperOct, ab ? this.m.abandoned : this.m.whiteComposite, 0, 0.91, 0, 0.22, 1.78, 0.22, true);

    const collarMat = ab ? this.m.abandonedRust : this.m.refugeLouvers;
    const crownMat = ab ? this.m.abandonedRust : this.m.solarReceiverCrown;
    this._addMesh(grp, this.geos.cyl24, collarMat, 0, 1.82, 0, 0.185, 0.045, 0.185, true);
    this._addMesh(grp, this.geos.cyl24, crownMat, 0, 1.97, 0, 0.155, 0.25, 0.155, false);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl24, this.m.neonGold, 0, 1.97, 0, 0.162, 0.032, 0.162, false);
      this._addMesh(grp, this.geos.box, collarMat, 0, 1.97, 0, 0.164, 0.25, 0.014, false);
      this._addMesh(grp, this.geos.box, collarMat, 0, 1.97, 0, 0.014, 0.25, 0.164, false);
    }
    this._addMesh(grp, this.geos.cyl24, collarMat, 0, 2.12, 0, 0.185, 0.045, 0.185, true);
    this._addMesh(grp, this.geos.cyl24, ab ? this.m.abandoned : this.m.brushedSilver, 0, 2.155, 0, 0.15, 0.025, 0.15, true);
    this._addBeacon(grp, hooks, 0, 2.21, 0, x, y0, z, rotRad, ab);
  }

  _buildWastePlant(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.94, 0.03, 0.94, false);
    const wedgeMat = ab ? this.m.dustyInd : this.m.indPanelSilver;
    this._addMesh(grp, this.geos.copenhillWedge, wedgeMat, -0.04, 0.02, 0.06, 0.95, 0.92, 0.92, true);

    const slopePark = this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.roofGreen, -0.04, 0.73, 0.06, 0.82, 0.035, 0.48, false);
    slopePark.rotation.z = 0.78;
    if (!ab) {
      this._addTinyTree(grp, -0.26, 0.46, 0.14, 0.48);
      this._addTinyTree(grp, 0.08, 0.82, 0.14, 0.48);
    }

    const siloMat = ab ? this.m.abandoned : this.m.whiteComposite;
    this._addMesh(grp, this.geos.cyl24, siloMat, -0.22, 0.24, -0.30, 0.20, 0.46, 0.20, true);
    this._addMesh(grp, this.geos.cyl24, siloMat, 0.02, 0.28, -0.30, 0.20, 0.54, 0.20, true);
    this._addMesh(grp, this.geos.cyl16, siloMat, 0.30, 0.78, -0.24, 0.10, 1.54, 0.10, true);
    if (!ab) {
      this._addMesh(grp, this.geos.cyl16, this.m.neonEmerald, 0.30, 1.48, -0.24, 0.112, 0.04, 0.112, false);
      this._pushSmoke(hooks, 0.30, 1.58, -0.24, x, y0, z, rotRad, true);
    }
  }

  // ==================== 3. Upgraded Civic & Utility Buildings ====================

  _buildWindTurbine(grp, ab, x, y0, z, rotRad, hooks) {
    const THREE = this.THREE;
    const mat = ab ? this.m.abandoned : this.m.whiteComposite;
    this._addMesh(grp, this.geos.cyl24, this.m.roofConcrete, 0, 0.025, 0, 0.32, 0.05, 0.32, true);
    this._addMesh(grp, this.geos.windMast, mat, 0, 0.80, 0, 1, 1, 1, true);
    this._addMesh(grp, this.geos.windNacelle, mat, 0, 1.60, 0, 1, 1, 1, true);
    this._addBeacon(grp, hooks, 0, 1.68, -0.05, x, y0, z, rotRad, ab);

    const hub = new THREE.Group();
    hub.position.set(0, 1.60, 0.13);
    this._addMesh(hub, this.geos.cone8, mat, 0, 0, 0.03, 0.12, 0.10, 0.12, false).rotation.x = Math.PI * 0.5;
    for (let k = 0; k < 3; k++) {
      const arm = new THREE.Group();
      arm.rotation.z = (k * Math.PI * 2) / 3;
      this._addMesh(arm, this.geos.windBlade, mat, 0, 0.22, 0, 1, 1, 0.45, true);
      hub.add(arm);
    }
    grp.add(hub);
    if (!ab && hooks && hooks.windRotors) hooks.windRotors.push(hub);
  }

  _buildThermalPowerPlant(grp, ab, x, y0, z, rotRad, hooks) {
    const wall = ab ? this.m.dustyInd : this.m.indPanelWarm;
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, wall, -0.18, 0.34, 0.04, 0.46, 0.66, 0.72, true);
    this._addMesh(grp, this.geos.box, this.m.brushedSilver, -0.18, 0.69, 0.04, 0.40, 0.06, 0.64, true);

    this._addMesh(grp, this.geos.cyl16, this.m.plazaStone, -0.26, 0.66, -0.26, 0.09, 1.30, 0.09, true);
    this._addMesh(grp, this.geos.coolingTower, ab ? this.m.abandoned : this.m.plazaStone, 0.22, 0.02, 0.12, 0.88, 0.96, 0.88, true);

    if (!ab) {
      this._addMesh(grp, this.geos.cyl16, this.m.craneRed, -0.26, 1.25, -0.26, 0.096, 0.08, 0.096, false);
      this._pushSmoke(hooks, -0.26, 1.34, -0.26, x, y0, z, rotRad, false);
      this._pushSmoke(hooks, 0.22, 1.04, 0.12, x, y0, z, rotRad, true);
    }
  }

  _buildWaterFacility(grp, type, ab) {
    const isSewage = type === 'sewage_out';
    const isTreat = type === 'water_treat';
    const mainMat = ab ? this.m.dustyInd : (isSewage ? this.m.indPanelWarm : this.m.indPanelSilver);
    const poolMat = ab ? this.m.abandonedRust : (isSewage ? this.m.teakDeck : this.m.poolWater);

    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.90, 0.03, 0.90, false);
    this._addMesh(grp, this.geos.box, mainMat, -0.18, 0.22, -0.08, 0.40, 0.42, 0.62, true);

    for (const bz of [-0.18, 0.20]) {
      this._addMesh(grp, this.geos.cyl24, this.m.plazaStone, 0.22, 0.09, bz, 0.34, 0.16, 0.34, true);
      this._addMesh(grp, this.geos.cyl24, poolMat, 0.22, 0.165, bz, 0.29, 0.02, 0.29, false);
      this._addMesh(grp, this.geos.box, this.m.brushedSilver, 0.22, 0.18, bz, 0.32, 0.015, 0.03, false);
    }

    if (isTreat) {
      this._addMesh(grp, this.geos.sphere16, this.m.whiteComposite, -0.18, 0.58, -0.16, 0.30, 0.30, 0.30, true);
      if (!ab) this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, -0.18, 0.44, 0.16, 0.34, 0.022, 0.12, false);
    } else {
      const pipeMat = isSewage ? this.m.steelDark : this.m.airlineBlue;
      for (const px of [-0.26, -0.10]) {
        const p = this._addMesh(grp, this.geos.cyl16, pipeMat, px, 0.10, 0.34, 0.07, 0.34, 0.07, true);
        p.rotation.x = Math.PI * 0.5;
      }
    }
  }

  _buildFireStation(grp, ab, x, y0, z, rotRad, hooks) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyStoneFin : this.m.finStoneSilver, -0.08, 0.27, -0.02, 0.64, 0.51, 0.58, true);
    const redMat = ab ? this.m.abandonedRust : this.m.craneRed;
    for (const dx of [-0.26, -0.08, 0.10]) {
      this._addMesh(grp, this.geos.box, redMat, dx, 0.14, 0.28, 0.13, 0.22, 0.03, false);
    }
    this._addMesh(grp, this.geos.box, redMat, 0.28, 0.52, -0.20, 0.22, 1.02, 0.22, true);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0.28, 0.88, -0.20, 0.24, 0.06, 0.24, false);
    this._addBeacon(grp, hooks, 0.28, 1.07, -0.20, x, y0, z, rotRad, ab);
  }

  _buildPoliceStation(grp, ab) {
    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyRetail : this.m.retailPodiumConc, 0, 0.20, 0, 0.76, 0.36, 0.68, true);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdIceBlue, 0, 0.38 + 0.51, -0.04, 0.62, 1.02, 0.52, true);
    if (!ab) {
      this._addMesh(grp, this.geos.parapetFrame, this.m.airlineBlue, 0, 1.43, -0.04, 0.63, 0.06, 0.53, true);
    }
    this._addHelipad(grp, 0, 1.41, -0.04, 0.26, ab);
    this._addMesh(grp, this.geos.spireNeedle, this.m.brushedSilver, 0.20, 1.66, -0.18, 0.7, 0.50, 0.7, false);
  }

  _buildHospital(grp, ab) {
    this._addZonedPlotPad(grp, ab, true);
    const white = ab ? this.m.abandoned : this.m.whiteComposite;
    const glass = ab ? this.m.dustyCBD : this.m.cbdSlateSilver;
    const red = ab ? this.m.abandonedRust : this.m.craneRed;

    this._addMesh(grp, this.geos.box, ab ? this.m.dustyRetail : this.m.retailPodium, 0.04, 0.20, 0.12, 0.76, 0.36, 0.48, true);
    this._addMesh(grp, this.geos.box, red, 0.04, 0.18, 0.39, 0.34, 0.030, 0.10, true);

    const wardH = 1.70;
    this._addMesh(grp, this.geos.box, glass, -0.04, 0.024 + wardH * 0.5, -0.08, 0.68, wardH, 0.42, true);
    this._addMesh(grp, this.geos.box, white, -0.36, 0.024 + wardH * 0.5, -0.08, 0.06, wardH + 0.02, 0.44, true);
    this._addMesh(grp, this.geos.box, white, 0.28, 0.024 + wardH * 0.5, -0.08, 0.06, wardH + 0.02, 0.44, true);
    this._addMesh(grp, this.geos.parapetFrame, white, -0.04, 0.024 + wardH + 0.035, -0.08, 0.70, 0.07, 0.44, true);

    const crossMat = ab ? this.m.abandonedRust : this.m.beaconRed;
    this._addMesh(grp, this.geos.box, crossMat, -0.04, 1.44, 0.14, 0.22, 0.065, 0.025, false);
    this._addMesh(grp, this.geos.box, crossMat, -0.04, 1.44, 0.14, 0.065, 0.22, 0.025, false);
    this._addHelipad(grp, -0.04, 0.024 + wardH + 0.01, -0.08, 0.28, ab);
  }

  _buildSchool(grp, ab) {
    this._addZonedPlotPad(grp, ab, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandonedRust : this.m.lawn, 0, 0.028, 0.24, 0.54, 0.014, 0.26, false);

    const mat = ab ? this.m.dustyStoneFin : this.m.finStoneChampagne;
    const hMain = 0.68;
    const hWing = 0.51;
    this._addMesh(grp, this.geos.box, mat, 0, 0.024 + hMain * 0.5, -0.14, 0.74, hMain, 0.36, true);
    this._addMesh(grp, this.geos.box, mat, -0.24, 0.024 + hWing * 0.5, 0.08, 0.26, hWing, 0.36, true);
    this._addMesh(grp, this.geos.parapetFrame, this.m.parapetStone, 0, 0.024 + hMain + 0.025, -0.14, 0.75, 0.05, 0.37, true);
    this._addMesh(grp, this.geos.box, ab ? this.m.abandoned : this.m.parapetStone, 0, 0.024 + hMain + 0.10, -0.14, 0.22, 0.16, 0.20, true);
    this._addMesh(grp, this.geos.taperPyr, ab ? this.m.abandonedRust : this.m.slateRoof, 0, 0.024 + hMain + 0.23, -0.14, 0.28, 0.11, 0.26, true, Math.PI * 0.25);
  }

  _buildPark(grp) {
    this._addMesh(grp, this.geos.box, this.m.lawn, 0, 0.015, 0, 0.92, 0.03, 0.92, false);
    this._addMesh(grp, this.geos.box, this.m.pavingPlaza, 0, 0.026, 0, 0.90, 0.012, 0.16, false);
    this._addMesh(grp, this.geos.box, this.m.pavingPlaza, 0, 0.026, 0, 0.16, 0.012, 0.90, false);

    if (!this._placeGLB(grp, 'park_fountain', 0, 0.02, 0, 0.92, 1.0, 0.92, false)) {
      this._addMesh(grp, this.geos.cyl24, this.m.plazaStone, 0, 0.06, 0, 0.36, 0.08, 0.36, true);
      this._addMesh(grp, this.geos.cyl24, this.m.poolWater, 0, 0.105, 0, 0.30, 0.02, 0.30, false);
      this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0, 0.16, 0, 0.08, 0.14, 0.08, true);
    }

    for (const [tx, tz] of [[-0.31, -0.31], [0.31, -0.31], [-0.31, 0.31], [0.31, 0.31]]) {
      this._addTinyTree(grp, tx, 0.02, tz, 0.82);
    }
  }

  _buildMetroStation(grp, ab) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.015, 0, 0.90, 0.03, 0.90, false);
    const vault = this._addMesh(grp, this.geos.capsule, ab ? this.m.dustyCBD : this.m.atriumGlass, 0, 0.14, 0, 1.25, 0.82, 0.72, true);
    vault.rotation.x = Math.PI * 0.5;
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.09, 0.24, 0.28, 0.14, 0.14, false);
    this._addMesh(grp, this.geos.box, this.m.steelDark, 0.32, 0.26, 0.28, 0.05, 0.48, 0.05, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.neonViolet, 0.32, 0.46, 0.28, 0.12, 0.12, 0.07, false);
    }
  }

  _buildHSRStation(grp, ab) {
    this._addMesh(grp, this.geos.box, ab ? this.m.pavingPlazaDusty : this.m.pavingPlaza, 0, 0.02, 0, 0.98, 0.04, 0.98, false);
    this._addMesh(grp, this.geos.box, ab ? this.m.dustyCBD : this.m.cbdSlateSilver, 0, 0.24, 0, 0.84, 0.42, 0.62, true);
    this._addMesh(grp, this.geos.gullWingRoof, ab ? this.m.abandoned : this.m.brushedSilver, 0, 0.44, 0, 0.92, 1.15, 1.52, true);
    if (!ab) {
      this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, 0, 0.52, 0.38, 0.86, 0.025, 0.035, false);
      this._addMesh(grp, this.geos.box, this.m.ledLinearCyan, 0, 0.52, -0.38, 0.86, 0.025, 0.035, false);
    }
  }

  // ==================== 4. True-Proportion 3D Road Vehicles, CR400 Train, Airliner & Cargo Ship ====================

  // True-Proportion Modern 3D Road Vehicles (facing +Z, tire bottoms at y = 0.000, night headlights & ruby taillights!)
  createRealisticVehicleObject(kind = 'car', variantIdx = 0) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    const v = Math.abs(variantIdx | 0);
    const k = String(kind || 'car').toLowerCase();

    if (k === 'bus') {
      // Contemporary Low-Floor Chinese EV Transit Bus (L ≈ 0.50, W ≈ 0.162, H ≈ 0.186)
      this._addMesh(grp, this.geos.vehBusBody, this.m.carPearlWhite, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehBusStripe, this.m.busTurquoise, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehBusHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehBusTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    if (k === 'firetruck') {
      // Municipal Aerial-Ladder Fire Engine + named 'strobe' lightbar!
      this._addMesh(grp, this.geos.vehFireBody, this.m.craneRed, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehFireSilver, this.m.brushedSilver, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);

      const strobe = this._addMesh(grp, this.geos.box, this.m.beaconRed, 0, 0.190, 0.165, 0.115, 0.018, 0.028, false);
      strobe.name = 'strobe';
      return grp;
    }

    if (k === 'garbagetruck') {
      // Clean White Cab + Emerald-Green Rear-Loader Compactor Hopper Truck
      this._addMesh(grp, this.geos.vehTruckCab, this.m.carPearlWhite, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehGarbageHopper, this.m.garbageGreen, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    if (k === 'truck') {
      // Modern Cab-Over Cargo / Container Rig (L ≈ 0.44, W ≈ 0.160, H ≈ 0.190)
      const cabMat = (v & 1) === 0 ? this.m.carPearlWhite : this.m.airlineBlue;
      const boxMat = this.containerMats[v % this.containerMats.length];
      this._addMesh(grp, this.geos.vehTruckCab, cabMat, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.box, boxMat, 0, 0.118, -0.072, 0.158, 0.142, 0.296, true);
      this._addMesh(grp, this.geos.vehTruckGlass, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehTruckHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehTruckTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
      return grp;
    }

    const isTaxi = k === 'taxi';
    const isSuv = k === 'suv' || (!isTaxi && (v % 4 === 3));
    const paint = isTaxi ? this.m.taxiYellow : this.carBodyPalette[v % this.carBodyPalette.length];

    if (isSuv) {
      // Compact Urban SUV (L ≈ 0.31, W ≈ 0.150, H ≈ 0.126)
      this._addMesh(grp, this.geos.vehSuvBody, paint, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvCabin, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSuvHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehSuvTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);
    } else {
      // Sleek Modern Sedan / Taxi (L ≈ 0.30, W ≈ 0.145, H ≈ 0.114)
      this._addMesh(grp, this.geos.vehSedanBody, paint, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanCabin, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanWheels, this.m.tireRubber, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.vehSedanHL, this.m.vehHeadlight, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.vehSedanTL, this.m.vehTaillight, 0, 0, 0, 1, 1, 1, false);

      if (isTaxi) {
        this._addMesh(grp, this.geos.box, this.m.taxiSignGlow, 0, 0.118, -0.012, 0.056, 0.016, 0.024, false);
      }
    }

    return grp;
  }

  createBulletTrainCarObject(isHead = false) {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    if (isHead) {
      this._addMesh(grp, this.geos.fuxingHeadBody, this.m.fuxingBody, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingHeadStripe, this.m.fuxingRedStripe, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.fuxingHeadDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingHeadlights, this.m.fuxingHeadlight, 0, 0, 0, 1, 1, 1, false);
    } else {
      this._addMesh(grp, this.geos.fuxingMidBody, this.m.fuxingBody, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.fuxingMidStripe, this.m.fuxingRedStripe, 0, 0, 0, 1, 1, 1, false);
      this._addMesh(grp, this.geos.fuxingMidDark, this.m.cockpitGlass, 0, 0, 0, 1, 1, 1, true);
      this._addMesh(grp, this.geos.box, this.m.fuxingRoofSilver, 0, 0.242, 0, 0.11, 0.012, 0.36, false);
    }

    return grp;
  }

  createAirlinerObject() {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    this._addMesh(grp, this.geos.fuselage, this.m.whiteComposite, 0, 0.14, -0.02, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.fuselage, this.m.airlineBlue, 0, 0.115, -0.02, 0.96, 0.68, 0.97, false);
    this._addMesh(grp, this.geos.sphere16, this.m.cockpitGlass, 0, 0.175, 0.52, 0.135, 0.075, 0.16, false);

    this._addMesh(grp, this.geos.airlinerWing, this.m.whiteComposite, 0, 0.12, 0.08, 1.0, 1.0, 1.0, true);
    const wlL = this._addMesh(grp, this.geos.box, this.m.airlineBlue, 0.68, 0.165, -0.12, 0.015, 0.09, 0.08, true);
    wlL.rotation.z = -0.22;
    const wlR = this._addMesh(grp, this.geos.box, this.m.airlineBlue, -0.68, 0.165, -0.12, 0.015, 0.09, 0.08, true);
    wlR.rotation.z = 0.22;

    for (const sx of [-0.28, 0.28]) {
      const pod = this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, sx, 0.075, 0.06, 0.095, 0.20, 0.095, true);
      pod.rotation.x = Math.PI * 0.5;
      const intake = this._addMesh(grp, this.geos.cyl16, this.m.brushedSilver, sx, 0.075, 0.162, 0.098, 0.018, 0.098, false);
      intake.rotation.x = Math.PI * 0.5;
      const fan = this._addMesh(grp, this.geos.cyl16, this.m.cockpitGlass, sx, 0.075, 0.168, 0.078, 0.012, 0.078, false);
      fan.rotation.x = Math.PI * 0.5;
    }

    this._addMesh(grp, this.geos.airlinerVTail, this.m.airlineBlue, 0, 0.19, -0.48, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.airlinerHTail, this.m.whiteComposite, 0, 0.15, -0.52, 1.0, 1.0, 1.0, true);

    this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, 0.69, 0.21, -0.14, 0.038, 0.038, 0.038, false);
    this._addMesh(grp, this.geos.sphere16, this.m.strobeGreen, -0.69, 0.21, -0.14, 0.038, 0.038, 0.038, false);
    const tailStrobe = this._addMesh(grp, this.geos.sphere16, this.m.beaconRed, 0, 0.485, -0.62, 0.042, 0.042, 0.042, false);
    tailStrobe.name = 'strobe';

    return grp;
  }

  createCargoShipObject() {
    const THREE = this.THREE;
    const grp = new THREE.Group();
    grp.rotation.order = 'YXZ';

    this._addMesh(grp, this.geos.shipHullBoot, this.m.hullCrimson, 0, 0.0, 0, 1.0, 1.0, 1.0, true);
    this._addMesh(grp, this.geos.shipHullMain, this.m.hullNavy, 0, 0.075, 0, 1.0, 1.0, 1.0, true);

    this._addMesh(grp, this.geos.cyl16, this.m.whiteComposite, 0, 0.28, 0.88, 0.022, 0.16, 0.022, false);
    this._addMesh(grp, this.geos.sphere16, this.m.neonGold, 0, 0.37, 0.88, 0.035, 0.035, 0.035, false);

    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.30, -0.62, 0.38, 0.22, 0.22, true);
    this._addMesh(grp, this.geos.box, this.m.whiteComposite, 0, 0.44, -0.60, 0.48, 0.07, 0.14, true);
    this._addMesh(grp, this.geos.box, this.m.cockpitGlass, 0, 0.45, -0.528, 0.44, 0.035, 0.015, false);
    this._addMesh(grp, this.geos.box, this.m.craneRed, 0, 0.47, -0.70, 0.10, 0.16, 0.11, true);
    this._addMesh(grp, this.geos.box, this.m.asphalt, 0, 0.56, -0.70, 0.102, 0.035, 0.112, false);

    const baysZ = [0.50, 0.18, -0.14, -0.86];
    for (let bIdx = 0; bIdx < baysZ.length; bIdx++) {
      const bz = baysZ[bIdx];
      const cols = bIdx === 0 ? [-0.08, 0.08] : [-0.13, 0.0, 0.13];
      const tiers = bIdx === 3 ? 2 : (bIdx === 0 ? 2 : 3);
      for (let cIdx = 0; cIdx < cols.length; cIdx++) {
        for (let t = 0; t < tiers; t++) {
          const mat = this.containerMats[(bIdx * 3 + cIdx + t * 2) % this.containerMats.length];
          this._addMesh(grp, this.geos.box, mat, cols[cIdx], 0.25 + t * 0.082, bz, 0.118, 0.08, 0.27, true);
        }
      }
    }

    return grp;
  }

  // ==================== 5. Atmospheric Procedural Sky Dome ====================

  createSkyDome() {
    const THREE = this.THREE;
    const geo = new THREE.SphereGeometry(145, 32, 20);

    const uniforms = {
      uTime: { value: 0.0 },
      uNight: { value: 0.0 },
      uSunset: { value: 0.0 },
      uSunDir: { value: new THREE.Vector3(0.45, 0.75, 0.48).normalize() }
    };

    const vertexShader = `
      varying vec3 vDir;
      void main() {
        vDir = position;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uNight;
      uniform float uSunset;
      uniform vec3 uSunDir;
      varying vec3 vDir;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise2D(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 4; i++) {
          v += a * noise2D(p);
          p = rot * p * 2.03 + vec2(17.1, 31.7);
          a *= 0.5;
        }
        return v;
      }

      vec3 hash33(vec3 p) {
        p = fract(p * vec3(0.1031, 0.1030, 0.0973));
        p += dot(p, p.yxz + 33.33);
        return fract((p.xxy + p.yxx) * p.zyx);
      }

      float starLayer(vec3 dir, float scale, float time) {
        vec3 p = dir * scale;
        vec3 id = floor(p);
        vec3 f = fract(p) - 0.5;
        vec3 rnd = hash33(id);
        if (rnd.z < 0.76) return 0.0;
        vec3 center = (rnd - 0.5) * 0.56;
        float dist = length(f - center);
        float size = mix(0.055, 0.115, rnd.x);
        float star = smoothstep(size, size * 0.15, dist);
        float twinkle = 0.66 + 0.34 * sin(time * (1.8 + rnd.y * 4.2) + rnd.z * 62.83);
        return star * twinkle * smoothstep(0.76, 1.0, rnd.z);
      }

      void main() {
        vec3 d = normalize(vDir);
        float up = clamp(d.y, 0.0, 1.0);
        float horizonFactor = pow(1.0 - up, 2.6);

        vec3 dayZenith = vec3(0.16, 0.45, 0.85);
        vec3 dayMid = vec3(0.41, 0.70, 0.95);
        vec3 dayHorizon = vec3(0.76, 0.89, 0.99);
        vec3 dayCol = mix(dayZenith, dayMid, smoothstep(0.85, 0.22, up));
        dayCol = mix(dayCol, dayHorizon, horizonFactor);

        vec3 nightZenith = vec3(0.014, 0.026, 0.068);
        vec3 nightHorizon = vec3(0.052, 0.092, 0.180);
        vec3 nightCol = mix(nightZenith, nightHorizon, pow(1.0 - up, 2.1));

        vec3 sky = mix(dayCol, nightCol, uNight);

        float sunCos = dot(d, uSunDir);
        float sunAzimuth = max(0.0, dot(normalize(vec2(d.x, d.z) + 1e-5), normalize(vec2(uSunDir.x, uSunDir.z) + 1e-5)));
        vec3 sunsetGlowCol = mix(vec3(0.95, 0.38, 0.26), vec3(1.0, 0.76, 0.38), pow(sunAzimuth, 2.0));
        float sunsetBand = uSunset * pow(1.0 - up, 2.2) * (0.35 + 0.65 * sunAzimuth);
        sky = mix(sky, sunsetGlowCol, clamp(sunsetBand * 0.82, 0.0, 0.85));

        float sunVis = smoothstep(-0.10, 0.06, uSunDir.y) * (1.0 - uNight * 0.92);
        float sunDisc = smoothstep(0.9980, 0.9993, sunCos);
        float sunCorona = pow(max(0.0, sunCos), 36.0) * 0.55 + pow(max(0.0, sunCos), 6.0) * 0.14;
        vec3 sunTint = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 0.58, 0.24), uSunset * 0.80);
        sky += sunTint * (sunDisc * 1.65 + sunCorona) * sunVis;

        if (uNight > 0.02 && d.y > 0.02) {
          float starFade = uNight * smoothstep(0.02, 0.24, d.y);
          float s1 = starLayer(d, 155.0, uTime);
          float s2 = starLayer(d + vec3(0.37, 0.19, -0.23), 240.0, uTime * 1.15);
          vec3 starCol = mix(vec3(0.76, 0.88, 1.0), vec3(1.0, 0.91, 0.74), fract(d.x * 37.0 + d.z * 19.0));
          sky += starCol * (s1 * 1.25 + s2 * 0.95) * starFade;

          vec3 moonDir = normalize(vec3(-uSunDir.x, max(0.34, -uSunDir.y * 0.72 + 0.26), -uSunDir.z));
          float moonCos = dot(d, moonDir);
          float moonDisc = smoothstep(0.9986, 0.9993, moonCos);
          float moonHalo = pow(max(0.0, moonCos), 28.0) * 0.28 + pow(max(0.0, moonCos), 6.0) * 0.06;
          float crater = 0.86 + 0.14 * noise2D(d.xy * 180.0);
          sky += vec3(0.82, 0.90, 1.0) * (moonDisc * crater * 1.15 + moonHalo) * uNight;
        }

        if (d.y > 0.015) {
          vec2 cloudUV = d.xz / (d.y + 0.20);
          float cBase = fbm(cloudUV * 1.05 + vec2(uTime * 0.011, uTime * 0.006));
          float cirrus = noise2D(cloudUV * vec2(2.6, 0.75) - vec2(uTime * 0.018, 0.0));

          float cumulusMask = smoothstep(0.50, 0.78, cBase);
          float cirrusMask = smoothstep(0.62, 0.88, cirrus) * 0.35;
          float cloudAlpha = clamp(cumulusMask * 0.78 + cirrusMask, 0.0, 0.86) * smoothstep(0.015, 0.20, d.y);

          vec3 cloudDay = mix(vec3(0.76, 0.84, 0.94), vec3(1.0, 0.99, 0.98), smoothstep(0.48, 0.76, cBase));
          vec3 cloudSunset = mix(vec3(0.52, 0.34, 0.48), vec3(1.0, 0.64, 0.38), smoothstep(0.45, 0.74, cBase));
          vec3 cloudNight = vec3(0.07, 0.11, 0.20);

          vec3 cloudCol = mix(cloudDay, cloudSunset, uSunset * 0.82);
          cloudCol = mix(cloudCol, cloudNight, uNight * 0.88);
          sky = mix(sky, cloudCol, cloudAlpha * (1.0 - uNight * 0.42));
        }

        if (d.y < 0.0) {
          vec3 abyss = mix(vec3(0.56, 0.74, 0.90), vec3(0.03, 0.05, 0.10), uNight);
          sky = mix(sky, abyss, smoothstep(0.0, -0.22, d.y));
        }

        gl_FragColor = vec4(sky, 1.0);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -1000;
    mesh.frustumCulled = false;

    let elapsed = 0;
    let lastStamp = typeof performance !== 'undefined' ? performance.now() : 0;

    const update = (dayProgress = 0.35, night, sunDir) => {
      const now = typeof performance !== 'undefined' ? performance.now() : lastStamp + 16;
      const dt = Math.min(0.1, Math.max(0.001, (now - lastStamp) * 0.001));
      lastStamp = now;
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      const sunAngle = (dayProgress - 0.25) * Math.PI * 2;
      const sunElev = Math.sin(sunAngle);
      const calcNight = night !== undefined
        ? Math.max(0, Math.min(1, night))
        : Math.max(0, Math.min(1, (-sunElev + 0.16) / 0.42));

      uniforms.uNight.value = calcNight;
      uniforms.uSunset.value = Math.max(0, 1 - Math.abs(sunElev - 0.06) / 0.30);

      if (sunDir) {
        if (typeof sunDir.x === 'number') {
          uniforms.uSunDir.value.set(sunDir.x, sunDir.y, sunDir.z).normalize();
        } else if (Array.isArray(sunDir) && sunDir.length >= 3) {
          uniforms.uSunDir.value.set(sunDir[0], sunDir[1], sunDir[2]).normalize();
        }
      } else {
        uniforms.uSunDir.value.set(Math.cos(sunAngle) * 34, sunElev * 42, 22).normalize();
      }

      this.setNightFactor(calcNight);
    };

    return { mesh, update };
  }
}

Object.assign(__M, { ArchitectureLibrary });
})();

// ====== MODULE: disasters.js ======
(function () {
const { GRID_SIZE, inBounds, idx, cIdx, tileToWorld, worldToTile } = __M;
class DisasterManager {
  constructor(sim, waterPhysics, sfx) {
    this.sim = sim;
    this.waterPhysics = waterPhysics;
    this.sfx = sfx;

    this.randomDisasters = false;
    this.randomTimer = 0;

    this.meteors = [];    // { start:[x,y,z], end:[x,y,z], tx, tz, t:0..1 }
    this.shockwaves = []; // { wx, wy, wz, r, maxR, ttl }
    this.tornado = null;  // { wx, wz, vx, vz, ttl }
    this.shakeTime = 0;
    this.shakeAmp = 0;
    this.fireAccum = 0;
  }

  _notifyTransportChanged() {
    this.sim.meshDirty = true;
    if (this.sim.traffic && typeof this.sim.traffic.refreshRoadGraph === 'function') {
      this.sim.traffic.refreshRoadGraph();
    }
  }

  pickTargetInCity() {
    const built = [];
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.building || t.roadGround > 0 || t.dam) built.push({ x: t.x, z: t.z });
    }
    if (built.length > 0) {
      return built[(Math.random() * built.length) | 0];
    }
    return { x: 24 + ((Math.random() * 10) | 0), z: 28 + ((Math.random() * 10) | 0) };
  }

  triggerMeteor(tx, tz) {
    if (tx === undefined || tz === undefined) {
      const p = this.pickTargetInCity();
      tx = p.x; tz = p.z;
    }
    const { wx, wz } = tileToWorld(tx, tz);
    const gy = this.sim.getTileElev(tx, tz);
    this.meteors.push({
      start: [wx - 13, gy + 19, wz - 11],
      end: [wx, gy, wz],
      tx,
      tz,
      t: 0
    });
    if (this.sfx) this.sfx.siren();
    this.sim.emitToast(`☄️ 防空警报！检测到巨型陨石正朝 (${tx}, ${tz}) 坠落！`);
  }

  _impactMeteor(m) {
    if (this.sfx) this.sfx.explosion();
    this.shakeTime = 1.1;
    this.shakeAmp = 0.55;
    this.shockwaves.push({ wx: m.end[0], wy: m.end[1] + 0.15, wz: m.end[2], r: 0.4, maxR: 6.5, ttl: 1.2 });

    // 1. Blast real 3D crater into terrain heightmap corners!
    const R = 4.4;
    for (let cz = Math.max(1, m.tz - 5); cz <= Math.min(GRID_SIZE - 1, m.tz + 6); cz++) {
      for (let cx = Math.max(1, m.tx - 5); cx <= Math.min(GRID_SIZE - 1, m.tx + 6); cx++) {
        const d = Math.hypot(cx - (m.tx + 0.5), cz - (m.tz + 0.5));
        if (d < R) {
          const norm = d / R;
          // Deep bowl inside norm < 0.75, raised ejecta rim at 0.75..1.0!
          const delta = norm < 0.75
            ? -1.15 * Math.cos((norm / 0.75) * Math.PI * 0.5)
            : 0.22 * Math.sin(((norm - 0.75) / 0.25) * Math.PI);
          const ci = cIdx(cx, cz);
          this.sim.corners[ci] = Math.max(-1.15, this.sim.corners[ci] + delta);
        }
      }
    }

    // 2. Destroy center tiles & ignite ring of fires!
    for (let z = m.tz - 5; z <= m.tz + 5; z++) {
      for (let x = m.tx - 5; x <= m.tx + 5; x++) {
        if (!inBounds(x, z)) continue;
        const d = Math.hypot(x - m.tx, z - m.tz);
        const t = this.sim.grid[idx(x, z)];
        if (d < 2.3) {
          if (t.roadGround !== 3) {
            t.roadGround = 0;
            t.roadBridge = false;
            t.junctionMode = 'signal';
            t.roundaboutPaid = false;
          }
          t.roadElevated = 0;
          t.ramp = false;
          if (t.rail !== 2) t.rail = 0;
          t.pylon = false;
          t.dam = false;
          t.trees = 0;
          t.building = null;
          if (t.pipe) t.pipeBroken = true;
        } else if (d < 5.0 && t.building) {
          t.building.fire = Math.max(t.building.fire || 0, 0.75);
        }
      }
    }

    this.waterPhysics.refreshCellElevations();
    this.sim.recomputeNetworksAndFields();
    this._notifyTransportChanged();
    this.sim.emitToast('💥 陨石撞击炸出巨型弹坑！周边建筑起火，请确保消防局道路畅通！');
  }

  triggerTsunami() {
    if (this.sfx) this.sfx.siren();
    this.waterPhysics.triggerTsunami();
    // Also surge mountain canyon floodwaters!
    for (let z = 2; z <= 9; z++) {
      for (let x = 2; x <= 9; x++) {
        const i = idx(x, z);
        if (this.sim.waterDepth[i] > 0.05) {
          this.sim.waterDepth[i] += 1.35;
        }
      }
    }
    this._notifyTransportChanged();
    this.sim.emitToast('🌊 特大海啸与山洪来袭！大坝与高地防洪堤正在经受考验！');
  }

  triggerTornado() {
    if (this.sfx) this.sfx.siren();
    const p = this.pickTargetInCity();
    const { wx, wz } = tileToWorld(Math.max(5, p.x - 8), Math.max(5, p.z - 6));
    this.tornado = {
      wx,
      wz,
      vx: 1.45,
      vz: 1.05,
      ttl: 11.0
    };
    this.sim.emitToast('🌪️ 超级龙卷风生成！正在横扫城区上空！');
  }

  triggerEarthquake(centerTx, centerTz) {
    if (this.sfx) this.sfx.explosion();
    this.shakeTime = 1.8;
    this.shakeAmp = 0.7;

    const p = (centerTx !== undefined && centerTz !== undefined)
      ? { x: centerTx, z: centerTz }
      : this.pickTargetInCity();
    const angle = Math.random() * Math.PI;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);

    let brokenPipes = 0;
    let damagedDams = 0;
    const visitedFault = new Set();
    for (let s = -6; s <= 6; s++) {
      const jitterX = s === 0 ? 0 : (Math.random() - 0.5) * 1.2;
      const jitterZ = s === 0 ? 0 : (Math.random() - 0.5) * 1.2;
      const tx = Math.round(p.x + dx * s + jitterX);
      const tz = Math.round(p.z + dz * s + jitterZ);
      if (!inBounds(tx, tz)) continue;

      const ti = idx(tx, tz);
      if (visitedFault.has(ti)) continue;
      visitedFault.add(ti);

      // Depress fault line slightly
      const ci = cIdx(tx, tz);
      this.sim.corners[ci] = Math.max(-1.15, this.sim.corners[ci] - 0.28);
      const t = this.sim.grid[ti];
      if (t.dam) {
        t.damHealth = Math.max(15, (t.damHealth ?? 100) - 45);
        damagedDams++;
      }
      if (t.pipe) {
        t.pipeBroken = true;
        brokenPipes++;
      }
      if (t.building && Math.random() < 0.45) {
        t.building.fire = 0.65;
      }
    }

    this.waterPhysics.refreshCellElevations();
    this.sim.recomputeNetworksAndFields();
    this._notifyTransportChanged();
    const damNote = damagedDams > 0 ? `，重创 ${damagedDams} 段水坝坝体结构` : '';
    this.sim.emitToast(`🌍 发生 7.2 级强震！震裂 ${brokenPipes} 处地下水管${damNote}并引发多处火情！`);
  }

  triggerFire() {
    const candidates = [];
    for (let i = 0; i < this.sim.grid.length; i++) {
      const t = this.sim.grid[i];
      if (t.building && !t.building.underConstruction) candidates.push(t);
    }
    if (candidates.length === 0) {
      this.sim.emitToast('当前城区暂无建筑可触发火灾测试');
      return;
    }
    const pick = candidates[(Math.random() * candidates.length) | 0];
    pick.building.fire = 0.72;
    if (this.sfx) this.sfx.siren();
    this.sim.emitToast(`🔥 (${pick.x}, ${pick.z}) 建筑突发大火！消防车正在赶往现场！`);
  }

  update(dt) {
    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
    }

    // Update falling meteors
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.t += dt * 0.78;
      if (m.t >= 1.0) {
        this._impactMeteor(m);
        this.meteors.splice(i, 1);
      }
    }

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.ttl -= dt;
      sw.r += dt * 5.2;
      if (sw.ttl <= 0) this.shockwaves.splice(i, 1);
    }

    // Update Tornado path
    if (this.tornado) {
      const tor = this.tornado;
      tor.ttl -= dt;
      tor.wx += tor.vx * dt + Math.sin(tor.ttl * 3.0) * 0.4 * dt;
      tor.wz += tor.vz * dt + Math.cos(tor.ttl * 2.4) * 0.4 * dt;

      const { x, z } = worldToTile(tor.wx, tor.wz);
      if (inBounds(x, z)) {
        const t = this.sim.grid[idx(x, z)];
        let treeChanged = false;
        let pylonChanged = false;
        let bldgChanged = false;
        if (t.trees > 0) {
          t.trees = 0;
          treeChanged = true;
        }
        if (t.pylon && Math.random() < dt * 2.5) {
          t.pylon = false;
          this.sim.recomputeNetworksAndFields();
          pylonChanged = true;
        }
        if (t.building && Math.random() < dt * 1.8 && t.building.type !== 'landmark') {
          t.building = null;
          this.sim.recomputeNetworksAndFields();
          bldgChanged = true;
        }
        if (treeChanged) this.sim.forestDirty = true;
        if (pylonChanged) this.sim.infraDirty = true;
        if (bldgChanged) {
          this.sim.buildingDirty = true;
          if (this.sim.traffic && typeof this.sim.traffic.refreshRoadGraph === 'function') {
            this.sim.traffic.refreshRoadGraph();
          }
        }
      }

      if (tor.ttl <= 0) {
        this.tornado = null;
        this.sim.emitToast('🌤️ 龙卷风已消散');
      }
    }

    if (this.sim.speed === 0) return;
    const simDt = dt * this.sim.speed;

    // Optional Random Natural Disasters
    if (this.randomDisasters) {
      this.randomTimer += simDt;
      if (this.randomTimer > 75) {
        this.randomTimer = 0;
        if (Math.random() < 0.45) {
          const r = Math.random();
          if (r < 0.35) this.triggerFire();
          else if (r < 0.6) this.triggerTornado();
          else if (r < 0.82) this.triggerTsunami();
          else this.triggerMeteor();
        }
      }
    }

    // Fire burn / extinguish simulation
    this.fireAccum += simDt;
    if (this.fireAccum >= 0.8) {
      this.fireAccum = 0;
      let destroyedAny = false;
      for (let i = 0; i < this.sim.grid.length; i++) {
        const t = this.sim.grid[i];
        const b = t.building;
        if (!b || !b.fire || b.fire <= 0) continue;

        // Fire station safety coverage + water extinguishes fire; lack of coverage burns building down!
        if (t.fireSafety > 25 && t.watered) {
          b.fire = Math.max(0, b.fire - 0.14 - (t.fireSafety / 400));
        } else {
          b.fire += 0.08;
          // Chance to spread to adjacent building
          if (b.fire > 0.75 && Math.random() < 0.12) {
            const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
            const [dx, dz] = dirs[(Math.random() * 4) | 0];
            const nt = this.sim.getTile(t.x + dx, t.z + dz);
            if (nt && nt.building && !nt.building.fire) {
              nt.building.fire = 0.45;
            }
          }
          if (b.fire >= 1.25 && b.type !== 'landmark') {
            t.building = null;
            destroyedAny = true;
          }
        }
      }
      if (destroyedAny) {
        this.sim.recomputeNetworksAndFields();
        this._notifyTransportChanged();
      }
    }
  }
}

Object.assign(__M, { DisasterManager });
})();

// ====== MODULE: simulation.js ======
(function () {
const { GRID_SIZE, CORNER_STRIDE, inBounds, idx, cIdx, hash2D, generateWorld } = __M;
const CATALOG = {
  // Terrain & Hydrology
  ter_raise:   { id: 'ter_raise',   name: '抬升造山/筑堤', cost: 40, unlockPop: 0, unlockLevel: 1, icon: '⛰️', desc: '抬高地形造山，或在河岸筑起防洪堤坝（土方工程费较高）' },
  ter_lower:   { id: 'ter_lower',   name: '挖河开渠/造湖', cost: 45, unlockPop: 0, unlockLevel: 1, icon: '🌊', desc: '挖掘人工运河、蓄水湖泊或加深航道，水流实时涌入' },
  ter_flatten: { id: 'ter_flatten', name: '平整山城台地', cost: 30, unlockPop: 0, unlockLevel: 1, icon: '📐', desc: '按起点海拔推平坡地，打造半山台地街区' },
  ter_spring:  { id: 'ter_spring',  name: '高山水源泉眼', cost: 1200, unlockPop: 450, unlockLevel: 4, icon: '⛲', desc: '在山顶引出天然活水源头，顺山谷奔流成河' },

  // Multi-layer Roads, Viaducts, Ramps & Tunnels (Real upkeep pressure!)
  road_1:      { id: 'road_1',      name: '双车道街道', cost: 35, bridgeCost: 110, upkeep: 1.1, unlockPop: 0, unlockLevel: 1, icon: '🛣️', desc: '基础地面街道（维护 ¥1.1/格，前期切勿盲目铺太长！）' },
  road_2:      { id: 'road_2',      name: '四车道主干道', cost: 85, bridgeCost: 220, upkeep: 2.8, unlockPop: 350, unlockLevel: 3, icon: '🛤️', desc: '大容量主干道，跨水架斜拉桥（维护较高，需人口支撑）' },
  road_elev:   { id: 'road_elev',   name: '高架快速路(+1层)', cost: 160, upkeep: 4.5, unlockPop: 450, unlockLevel: 5, icon: '🌉', desc: '二层立体高架桥！跨越地面拥堵路口、铁路与河流' },
  road_ramp:   { id: 'road_ramp',   name: '高架上下匝道', cost: 110, upkeep: 2.2, unlockPop: 450, unlockLevel: 5, icon: '↗️', desc: '🛣️ 点击或直线拖拽1~3格建匝道：建在地面主干道上将自动生成【桥下不断流·两侧辅道 + 中央上下匝道】！' },
  road_tunnel: { id: 'road_tunnel', name: '穿山公路隧道', cost: 190, upkeep: 4.8, unlockPop: 450, unlockLevel: 5, icon: '🏔️', desc: '贯穿陡峭山脉的地下公路隧道' },

  // Underground Metro & High-Speed Rail
  metro_line:    { id: 'metro_line',    name: '地下地铁隧道', cost: 110, upkeep: 3.2, unlockPop: 1100, unlockLevel: 7, icon: '🟣', desc: '地底地铁轨道，无视地面建筑与山河阻隔' },
  metro_station: { id: 'metro_station', name: '地铁站出入口', cost: 1800, upkeep: 55, unlockPop: 1100, unlockLevel: 7, icon: '🚇', desc: '连接地铁隧道，大幅缓解路面堵车并拉升商业地价' },
  rail_track:    { id: 'rail_track',    name: '高速铁路轨道', cost: 135, bridgeCost: 260, upkeep: 3.6, unlockPop: 2200, unlockLevel: 8, icon: '🚄', desc: '双线无砟高铁轨道（跨河跨路自动架设特大桥）' },
  hsr_station:   { id: 'hsr_station',   name: '高铁中央车站', cost: 4800, upkeep: 130, unlockPop: 2200, unlockLevel: 8, icon: '🚉', desc: '接通城际高铁干线，复兴号停靠带来大量客流与商业税收' },

  // 6 Authentic Cities: Skylines Zones (Zoning is free in CS1, road/pipe upkeep is the real cost!)
  zone_RL: { id: 'zone_RL', name: '低密住宅(别墅)', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏡', desc: '花园独栋与洋房，厌恶工业污染与高税率' },
  zone_RH: { id: 'zone_RH', name: '高密住宅(摩天寓)', cost: 0, unlockPop: 900, unlockLevel: 5, icon: '🏢', desc: '都市高层公寓，高地价与公共服务下可升至 48 层' },
  zone_CL: { id: 'zone_CL', name: '低密商业(街铺)', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏪', desc: '社区商店餐饮，依赖工业区进货，堵车会缺货倒闭！' },
  zone_CH: { id: 'zone_CH', name: '高密商业(CBD)', cost: 0, unlockPop: 900, unlockLevel: 6, icon: '🏙️', desc: '大型商业中心至64层摩天楼，需高学历员工与通畅货运' },
  zone_I:  { id: 'zone_I',  name: '工业制造区', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🏭', desc: '提供岗位与商业货源，产生重污染（切勿紧贴住宅区！）' },
  zone_O:  { id: 'zone_O',  name: '现代办公区(零污)', cost: 0, unlockPop: 1100, unlockLevel: 6, icon: '💼', desc: '零污染白领科技写字楼，必须有【理工大学】培养人才否则荒废' },
  dezone:  { id: 'dezone',  name: '取消区划', cost: 0, unlockPop: 0, unlockLevel: 1, icon: '🧹', desc: '清除规划区划' },

  // Underground Water Pipes & Sewage
  water_pipe:  { id: 'water_pipe',  name: '地下输水管道', cost: 22, upkeep: 0.45, unlockPop: 0, unlockLevel: 1, icon: '🔵', desc: '地下供水排污管道（覆盖两侧4格，过长会增加财政维护费）' },
  water_pump:  { id: 'water_pump',  name: '河畔抽水站', cost: 1400, upkeep: 42, waterOut: 360, unlockPop: 0, unlockLevel: 1, icon: '🚰', desc: '必须建在【上游洁净河岸】！吸入下游污水会导致全城重病废弃' },
  sewage_out:  { id: 'sewage_out',  name: '河道排污口', cost: 1100, upkeep: 34, sewageCap: 360, unlockPop: 0, unlockLevel: 1, icon: '🤎', desc: '向河道排放污水，务必建在抽水站的【下游】！' },
  water_treat: { id: 'water_treat', name: '生态净水中心', cost: 3400, upkeep: 88, waterOut: 240, sewageCap: 520, unlockPop: 1100, unlockLevel: 7, icon: '♻️', desc: '高阶环保净水与污水处理厂，几乎不污染河道' },

  // Power, Clean Energy & Hydroelectric Dam
  hydro_dam:     { id: 'hydro_dam',     name: '水力发电大坝', cost: 680, upkeep: 26, unlockPop: 2200, unlockLevel: 9, icon: '🏗️', desc: '横跨峡谷拦截蓄水，按上下游水位落差发出巨额清洁电力' },
  power_pylon:   { id: 'power_pylon',   name: '高压输电铁塔', cost: 45, upkeep: 0.6, unlockPop: 0, unlockLevel: 1, icon: '🗼', desc: '远距离输送大坝/电厂电力（每座接力传导 6 格）' },
  power_wind:    { id: 'power_wind',    name: '高山风力发电', cost: 950, upkeep: 24, powerOut: 115, unlockPop: 0, unlockLevel: 1, icon: '🌬️', desc: '前期清洁电源，建在高山脊风力更强（最高 ~160 MW）' },
  power_plant:   { id: 'power_plant',   name: '燃气热电厂', cost: 3200, upkeep: 95, powerOut: 580, unlockPop: 350, unlockLevel: 3, icon: '⚡', desc: '+580 MW 主力电厂，维护费高，前期可通过预算滑块省钱' },
  solar_plant:   { id: 'solar_plant',   name: '塔式熔盐光热电站', cost: 2800, upkeep: 58, powerOut: 340, unlockPop: 600, unlockLevel: 4, icon: '☀️', desc: '+340 MW 零污染光热发电塔与定日镜阵（夜间储热持续供电）' },
  nuclear_plant: { id: 'nuclear_plant', name: '核裂变发电站', cost: 9200, upkeep: 195, powerOut: 1650, unlockPop: 2200, unlockLevel: 9, icon: '☢️', desc: '+1,650 MW 零碳超级电源！必须建在水源岸边（2格内有水）抽取冷却水' },

  // Sanitation & Waste-to-Energy
  waste_plant:   { id: 'waste_plant',   name: '环保垃圾焚烧厂', cost: 2100, upkeep: 52, powerOut: 180, trashCap: 2600, unlockPop: 350, unlockLevel: 3, icon: '♻️', desc: '焚烧处理城市垃圾并产出 +180 MW 电力！缺乏垃圾处理会导致垃圾围城致病荒废' },

  // Air/Sea Trade Hubs & Tourism Wonders
  seaport:        { id: 'seaport',        name: '深水集装箱海港', cost: 4200, upkeep: 92, unlockPop: 1100, unlockLevel: 8, icon: '🚢', desc: '必须建在海湾或深水河岸！远洋货轮靠泊出口工业品，工业与商业税收 +12%' },
  airport:        { id: 'airport',        name: '国际民航机场', cost: 6400, upkeep: 145, unlockPop: 1600, unlockLevel: 10, icon: '✈️', desc: '宽体客机起降！吸引全球商务客与游客，全城商业与办公税收 +15%' },
  amusement_park: { id: 'amusement_park', name: '滨海摩天轮乐园', cost: 3600, upkeep: 72, unlockPop: 900, unlockLevel: 6, icon: '🎡', desc: '巨型动态摩天轮游乐园，大幅拉升周边豪宅与商业地价及市民幸福度' },
  stadium:        { id: 'stadium',        name: '奥林匹克体育中心', cost: 5200, upkeep: 105, unlockPop: 1100, unlockLevel: 7, icon: '🏟️', desc: '定期举办大型球赛与演唱会，比赛日发放巨额门票分红并引爆全城幸福感！' },

  // Civic, Emergency & Landmarks
  fire_station:   { id: 'fire_station',   name: '消防总署', cost: 1500, upkeep: 48, unlockPop: 150, unlockLevel: 2, icon: '🚒', desc: '派出消防车扑灭火灾；无消防覆盖的街区极易起火烧毁！' },
  police_station: { id: 'police_station', name: '警察总局', cost: 1550, upkeep: 48, unlockPop: 150, unlockLevel: 2, icon: '🚓', desc: '压制犯罪率！治安恶化会导致商业与住宅成片废弃' },
  hospital:       { id: 'hospital',       name: '大型综合医院', cost: 2600, upkeep: 78, unlockPop: 350, unlockLevel: 3, icon: '🏥', desc: '救治污染病患、提升健康度，高密城区必备' },
  school:         { id: 'school',         name: '市立理工大学', cost: 2400, upkeep: 72, unlockPop: 600, unlockLevel: 4, icon: '🏫', desc: '提升市民学历！没有大学学历支撑，CBD与办公区无法发展' },
  park:           { id: 'park',           name: '中央景观公园', cost: 680, upkeep: 18, unlockPop: 150, unlockLevel: 2, icon: '🌳', desc: '提升周边地价与市民幸福度' },
  landmark:       { id: 'landmark',       name: '星海88层金融塔', cost: 12000, upkeep: 190, unlockPop: 2200, unlockLevel: 10, icon: '🌟', desc: '88层城市超级奇观，全城商业繁荣度与周边地价跃升' },

  // Bulldozers
  bulldoze:       { id: 'bulldoze',       name: '地面推土机', cost: 10, unlockPop: 0, unlockLevel: 1, icon: '🚜', desc: '分层智能拆除：优先拆除二层高架桥（保留地面道路），再拆地面建筑或废墟' },
  bulldoze_under: { id: 'bulldoze_under', name: '地下拆除器', cost: 8, unlockPop: 0, unlockLevel: 1, icon: '🔧', desc: '拆除或抢修震裂的地下输水管与地铁隧道' }
};
const BUILDING_NAMES = {
  RL: [
    ['梧桐花园独栋', '溪谷木屋别墅', '晴岚山居小屋', '翠微庭院洋房'],
    ['半山观景联排', '白鹭溪畔雅墅', '枫丹花园洋房', '云栖叠拼美宅'],
    ['翡翠半山庄园', '星河湾名门望族墅', '松风山顶大宅', '听涛海岸豪墅']
  ],
  RH: [
    ['青年人才公寓(8F)', '阳光茗苑住宅(10F)', '望江公寓楼(9F)', '紫荆花园大厦(11F)'],
    ['蔚蓝海岸高尚住宅(18F)', '锦绣华庭塔楼(20F)', '星辰都市公寓(19F)', '明珠江畔花园(22F)'],
    ['御景湾高层豪庭(28F)', '翡翠城邦住宅塔(30F)', '天琴湾全景公寓(32F)', '云顶华府(29F)'],
    ['星海湾壹号超高层(38F)', '天鹅堡云端公馆(42F)', '苍穹云玺住宅大厦(40F)', '澜湾国际公寓(41F)'],
    ['云端天际48F摩天豪宅', '星耀海湾全景摩天寓(46F)', '凌霄花园超级塔楼(50F)', '寰宇天际至尊公馆(48F)']
  ],
  CL: [
    ['街角精品咖啡馆', '24H便民生活超市', '晨光烘焙书屋', '鲜果便利驿站'],
    ['邻里美食商业街', '星光社区购物坊', '汽车餐厅与超市', '海风休闲广场'],
    ['时代邻里百货中心', '新天地精品商街', '悦活生活MALL', '海湾假日集市']
  ],
  CH: [
    ['汇金商业大厦(12F)', '远洋购物中心(10F)', '环球百货大楼(14F)', '世纪商贸广场(12F)'],
    ['银泰玻璃幕墙商厦(22F)', '盛世金融商业塔(25F)', '天枢购物与酒店中心(24F)', '万象都会广场(26F)'],
    ['环贸国际广场(36F)', '蔚蓝中心摩天商厦(38F)', '星海国际酒店塔(35F)', '金茂商务大厦(39F)'],
    ['大都会双子星商厦(48F)', '云顶环球贸易塔(52F)', '深蓝海岸金融大厦(50F)', '天际商业航母塔(49F)'],
    ['环太平洋国际金融中心(64F)', '苍穹之巅世界贸易塔(62F)', '星耀60F玻璃幕墙摩天楼', '凌霄国际CBD第一高楼(66F)']
  ],
  I: [
    ['红砖轻工车间', '标准机械加工坊', '城郊建材仓库', '木材装配厂'],
    ['现代冷链物流港', '精密模具制造厂', '自动化包装基地', '重型汽配厂'],
    ['联合智能装备总厂', '大型能源机械基地', '新材料合成中心', '港口集装箱集散枢纽'],
    ['未来新能源智造园', '高精密航空部件厂', '智能机器人超级工厂', '零碳循环工业基地']
  ],
  O: [
    ['创智软件园办公楼(10F)', '青年创业孵化大厦(12F)', '数字媒体工作室(9F)', '云谷科技楼(11F)'],
    ['硅谷研发中心大厦(20F)', '互联网金融写字楼(22F)', '量子通信实验大楼(19F)', '人工智能总部园(21F)'],
    ['全球半导体设计总部(32F)', '蔚蓝科技玻璃幕墙塔(35F)', '星际航太研发大厦(34F)', '超级计算云中心(36F)'],
    ['环宇跨国科技总部塔(46F)', '未来AI数字摩天大厦(50F)', '零碳智慧金融科技塔(48F)', '星海硅谷第一总部(52F)']
  ]
};
const MILESTONES = [
  { pop: 0, title: '初创村落', reward: 0, desc: '基础道路、水管与低密度区划' },
  { pop: 150, title: '活力小镇', reward: 4500, desc: '解锁消防局、警察局、公园与银行贷款' },
  { pop: 350, title: '繁华县城', reward: 7500, desc: '解锁四车道大道、综合医院、垃圾焚烧厂与燃气热电厂' },
  { pop: 450, title: '立体交通城', reward: 9500, desc: '解锁二层高架快速路、立交匝道与穿山隧道' },
  { pop: 600, title: '科教新城', reward: 12000, desc: '解锁市立理工大学与塔式熔盐光热电站' },
  { pop: 900, title: '高密都市', reward: 16000, desc: '解锁高密住宅(RH)、高密商业(CH)与滨海摩天轮乐园' },
  { pop: 1100, title: '轨道新都', reward: 22000, desc: '解锁地铁网络、办公区(O)、深水海港、奥体中心与净水厂' },
  { pop: 1600, title: '国际航空港', reward: 29000, desc: '解锁国际民航机场，开启全球航空商旅网络' },
  { pop: 2200, title: '山河大都会', reward: 38000, desc: '解锁水力大坝、核裂变电站、高速铁路与88层金融地标' }
];
const MAYOR_LEVELS = [
  {
    level: 1,
    title: '初创村落',
    popReq: 0,
    xpReq: 0,
    reward: 0,
    summary: '基础双车道、地下输水管、河畔抽水站、河道排污口、高山风电、高压输电塔、低密住商工区划及地形工具'
  },
  {
    level: 2,
    title: '平安小镇',
    popReq: 180,
    xpReq: 220,
    reward: 4500,
    summary: '解锁 🚒消防总署、🚓警察总局、🌳中央景观公园、🏦市政小额贷款'
  },
  {
    level: 3,
    title: '民生县城',
    popReq: 480,
    xpReq: 600,
    reward: 7500,
    summary: '解锁 🛤️四车道主干道、🏥大型综合医院、♻️环保垃圾焚烧厂、⚡燃气热电厂'
  },
  {
    level: 4,
    title: '科教新城',
    popReq: 1000,
    xpReq: 1200,
    reward: 11000,
    summary: '解锁 🏫市立理工大学、☀️塔式熔盐光热电站、⛲高山水源泉眼、🏦基建发展债'
  },
  {
    level: 5,
    title: '立体交通城',
    popReq: 1900,
    xpReq: 2100,
    reward: 15000,
    summary: '解锁 🌉二层高架快速路、↗️高架上下匝道、🏔️穿山公路隧道、🏢高密住宅(RH)'
  },
  {
    level: 6,
    title: '摩天商务都',
    popReq: 3200,
    xpReq: 3300,
    reward: 20000,
    summary: '解锁 🏙️高密商业CBD(CH)、💼零污染现代办公区(O)、🎡滨海摩天轮乐园'
  },
  {
    level: 7,
    title: '轨道新都',
    popReq: 5000,
    xpReq: 4800,
    reward: 26000,
    summary: '解锁 🟣地下地铁隧道、🚇地铁站出入口、♻️生态净水中心、🏟️奥林匹克体育中心'
  },
  {
    level: 8,
    title: '远洋枢纽城',
    popReq: 7500,
    xpReq: 6800,
    reward: 34000,
    summary: '解锁 🚢深水集装箱海港、🚄高速铁路轨道、🚉高铁中央车站'
  },
  {
    level: 9,
    title: '山河能源巨匠',
    popReq: 10500,
    xpReq: 9200,
    reward: 45000,
    summary: '解锁 ☢️核裂变发电站(+1650MW)、🏗️峡谷水力发电大坝！'
  },
  {
    level: 10,
    title: '传奇超级都会',
    popReq: 14500,
    xpReq: 12000,
    reward: 65000,
    summary: '解锁 ✈️国际民航机场(宽体客机)、🌟星海88层金融地标奇观！'
  }
];
const MAYOR_QUESTS = [
  {
    step: 1,
    id: 'q_road',
    title: '修筑首条街道',
    tool: 'road_1',
    cat: 'road',
    rewardMoney: 2000,
    rewardXP: 90,
    tip: '从南侧高速路延伸铺设双车道街道（注意：路有维护费，前期紧凑修10~15格即可！）'
  },
  {
    step: 2,
    id: 'q_power',
    title: '点亮清洁风电',
    tool: 'power_wind',
    cat: 'power',
    rewardMoney: 2500,
    rewardXP: 110,
    tip: '在街区附近（3格内）建造【高山风力发电】；若建在远处山坡，用【高压输电铁塔】接力连入街区'
  },
  {
    step: 3,
    id: 'q_water',
    title: '上游抽水·下游排污·铺地下水管',
    tool: 'water_pipe',
    cat: 'water',
    rewardMoney: 3500,
    rewardXP: 150,
    tip: '铁律：在河道【上游】岸边建抽水站，【下游】岸边建排污口（防喝污水生病！），再铺【地下输水管】连通街道'
  },
  {
    step: 4,
    id: 'q_zones',
    title: '科学分区引市民入驻',
    tool: 'zone_RL',
    cat: 'zones',
    rewardMoney: 4000,
    rewardXP: 200,
    tip: '在通水通电街道旁划【低密住宅】与【低密商业】，下风处划【工业区】！持续扩建街区冲刺 180 人晋升 Lv.2'
  },
  {
    step: 5,
    id: 'q_civic_lv2',
    title: '达180人晋升小镇·建消防与公园 (Lv.2)',
    tool: 'fire_station',
    cat: 'civic',
    rewardMoney: 4500,
    rewardXP: 300,
    tip: '扩建住商工街区满 180 人晋升 Lv.2【平安小镇】，建造【消防总署】防起火烧毁，并在住宅旁建【景观公园】拉升地价'
  },
  {
    step: 6,
    id: 'q_waste_lv3',
    title: '达480人晋升县城·垃圾焚烧发电 (Lv.3)',
    tool: 'waste_plant',
    cat: 'water',
    rewardMoney: 5500,
    rewardXP: 440,
    tip: '扩建城区满 480 人晋升 Lv.3【民生县城】！在工业侧建造【环保垃圾焚烧厂】解决垃圾危机并白赚 +180MW 电力'
  },
  {
    step: 7,
    id: 'q_edu_lv4',
    title: '达1000人科教新城·建大学与医院 (Lv.4)',
    tool: 'school',
    cat: 'civic',
    rewardMoney: 7000,
    rewardXP: 620,
    tip: '发展街区满 1,000 人晋升 Lv.4！建造【综合医院】与【市立理工大学】，培养高学历人才支撑摩天楼升级'
  },
  {
    step: 8,
    id: 'q_viaduct_lv5',
    title: '立体高架与摩天高密区 (Lv.5–6)',
    tool: 'road_elev',
    cat: 'road',
    rewardMoney: 11000,
    rewardXP: 980,
    tip: '人口达 1,900~3,200 人解锁高架与CBD！在堵点架【二层高架+匝道】或改建【环岛】，并规划【高密住宅/商业CBD/办公区】'
  },
  {
    step: 9,
    id: 'q_transit_lv7',
    title: '轨道新都与远洋港口 (Lv.7–8)',
    tool: 'metro_station',
    cat: 'rail',
    rewardMoney: 16000,
    rewardXP: 1380,
    tip: '高密人口突破 5,000~7,500 人后，铺设【地下地铁】分流一半私家车，并在海湾建【深水海港】分流出口重卡、接通【高铁】！'
  },
  {
    step: 10,
    id: 'q_endgame_lv9',
    title: '万人都邑：核能·峡谷大坝·国际空港 (Lv.9–10)',
    tool: 'nuclear_plant',
    cat: 'power',
    rewardMoney: 30000,
    rewardXP: 1400,
    tip: '迈入万人大都会！Lv.9(10,500人)在深V急流峡谷建【水力发电大坝】或临水【核电站】；Lv.10(14,500人)建【国际机场】与88层奇观！'
  }
];
const LOAN_OFFERS = [
  { id: 'loan_s', name: '应急周转小额贷', unlockLevel: 2, principal: 15000, totalRepay: 17400, periodPay: 290, desc: '本金 ¥15,000（利率16%，每期还 ¥290）' },
  { id: 'loan_m', name: '城市基建发展债', unlockLevel: 4, principal: 45000, totalRepay: 54000, periodPay: 750, desc: '本金 ¥45,000（利率20%，每期还 ¥750）' },
  { id: 'loan_l', name: '超级工程建设国债', unlockLevel: 7, principal: 100000, totalRepay: 125000, periodPay: 1560, desc: '本金 ¥100,000（利率25%，每期还 ¥1,560）' }
];
class CitySimulation {
  constructor(sfx) {
    this.sfx = sfx;
    this.seed = 2026;
    this.cityName = '山河天际市';

    // Hardcore Skylines Economy & Pacing!
    this.difficulty = 'hardcore'; // 'hardcore' | 'normal' | 'sandbox'
    this.unlockAll = false;       // false = Mayor Level progression!
    this.money = 32000;
    this.taxRate = 9;
    this.budgets = { power: 100, water: 100, service: 100 }; // 50..150%
    this.activeLoans = []; // { id, name, remaining, periodPay }

    // 10-Level Mayor Progression (Dual Pop + XP) & 10-Step Guide Quests
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this._suppressPromotions = false;
    this.gridlockTimeouts = 0;
    this._lastDamBreachToastAt = 0;
    this.onLevelUp = null;
    this.onQuestComplete = null;

    this.policies = {
      freeTransit: false,
      greenCity: false,
      techBoost: false
    };

    // Calm, realistic calendar & day-night flow!
    this.year = 2026;
    this.month = 3;
    this.day = 1;
    this.dayProgress = 0.36;
    this.timeMode = 'cycle';
    this.speed = 1;

    this.population = 0;
    this.maxPopReached = 0;
    this.jobsTotal = 0;
    this.unemploymentPct = 0;
    this.happiness = 75;
    this.demand = { R: 0.75, C: 0.45, I: 0.60 };

    this.powerSupply = 0;
    this.powerDemand = 0;
    this.hydroPowerMW = 0;

    this.waterSupply = 0;
    this.waterDemand = 0;
    this.sewageSupply = 0;
    this.sewageDemand = 0;
    this.waterPollutedPct = 0;
    this.trashSupply = 0;
    this.trashDemand = 0;
    this.sickCitizens = 0;
    this.abandonedCount = 0;

    this.hasSeaport = false;
    this.hasAirport = false;
    this.hasAmusementPark = false;
    this.hasStadium = false;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;

    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };

    this.netIncome = 0;
    this.lastTaxIncome = 0;
    this.lastUpkeep = 0;
    this.lastLoanPay = 0;
    this.milestoneIdx = 0;

    const world = generateWorld(this.seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;

    this.waterPhysics = null;
    this.terrainDirty = true;
    this.infraDirty = true;
    this.forestDirty = true;
    this.buildingDirty = true;
    this.simAccum = 0;
    this.econAccum = 0;
    this.dateAccum = 0;
    this.waterAccum = 0;
    this.recentUpgrades = [];
    this.onToast = null;
  }

  get meshDirty() {
    return Boolean(this.terrainDirty || this.infraDirty || this.forestDirty || this.buildingDirty);
  }

  set meshDirty(v) {
    const flag = Boolean(v);
    this.terrainDirty = flag;
    this.infraDirty = flag;
    this.forestDirty = flag;
    this.buildingDirty = flag;
  }

  emitToast(msg) {
    if (this.onToast) this.onToast(msg);
  }

  getFormattedDate() {
    return `${this.year}年${this.month}月${this.day}日`;
  }

  getMayorLevelInfo() {
    const lv = Math.max(1, Math.min(MAYOR_LEVELS.length, this.mayorLevel || 1));
    const current = MAYOR_LEVELS[lv - 1];
    const next = lv < MAYOR_LEVELS.length ? MAYOR_LEVELS[lv] : null;
    const xp = this.mayorXP || 0;
    const pop = this.population || 0;
    const nextXp = next ? next.xpReq : current.xpReq;
    const nextPop = next ? next.popReq : current.popReq;
    let progressPct = 100;
    if (next) {
      const xpRatio = next.xpReq > 0 ? Math.min(1, xp / next.xpReq) : 1;
      const popRatio = next.popReq > 0 ? Math.min(1, pop / next.popReq) : 1;
      progressPct = Math.max(0, Math.min(100, Math.round(Math.min(xpRatio, popRatio) * 100)));
    }
    return {
      level: lv,
      title: current.title,
      xp,
      nextXp,
      pop,
      nextPop,
      progressPct,
      current,
      next,
      pct: progressPct
    };
  }

  checkLevelPromotion(suppressCallback = false) {
    let lastUnlockedTier = null;
    while (this.mayorLevel < MAYOR_LEVELS.length) {
      const nextTier = MAYOR_LEVELS[this.mayorLevel];
      if (!nextTier) break;
      if ((this.population || 0) < (nextTier.popReq || 0) || (this.mayorXP || 0) < (nextTier.xpReq || 0)) {
        break;
      }
      this.mayorLevel = nextTier.level;
      if (this.difficulty !== 'sandbox' && nextTier.reward > 0) {
        this.money += nextTier.reward;
      }
      lastUnlockedTier = nextTier;
      this.latestChirp = {
        user: '@市政厅晋升喜报',
        text: `🎖️ 人口破 ${nextTier.popReq.toLocaleString()} 人，晋升 Lv.${nextTier.level}【${nextTier.title}】！奖励 +¥${nextTier.reward.toLocaleString()}，${nextTier.summary}`,
        mood: 'good'
      };
    }
    if (lastUnlockedTier) {
      if (!this._suppressPromotions && this.sfx && this.sfx.milestone) {
        this.sfx.milestone();
      }
      if (!suppressCallback && !this._suppressPromotions && this.onLevelUp) {
        this.onLevelUp(lastUnlockedTier);
      }
    }
    return lastUnlockedTier;
  }

  addXP(amount, reason = '', suppressCallback = false) {
    if (!amount || amount <= 0) return null;
    this.mayorXP = Math.max(0, Math.round((this.mayorXP || 0) + amount));
    return this.checkLevelPromotion(suppressCallback);
  }

  onDamBreach(x, z) {
    this.latestChirp = {
      user: '@防汛抗旱总指挥部',
      text: `💥 特大事故！(${x},${z}) 水力大坝超载溃坝决口，洪峰正冲向下游！`,
      mood: 'bad'
    };
    if (this.sfx && typeof this.sfx.explosion === 'function') {
      this.sfx.explosion();
    }
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - (this._lastDamBreachToastAt || 0) > 2500) {
      this._lastDamBreachToastAt = now;
      this.emitToast(`💥 特大事故！(${x},${z}) 水力大坝超载溃坝决口，洪峰正冲向下游！`);
    }
    this.meshDirty = true;
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
  }

  repairDamSpan(x, z) {
    const startTile = this.getTile(x, z);
    if (!startTile || !startTile.dam) return { ok: false };
    const cost = this.difficulty === 'sandbox' ? 0 : 450;
    if (this.difficulty !== 'sandbox' && this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`💰 资金不足（加固抢修大坝需 ¥${cost}）`);
      return { ok: false };
    }
    if (this.difficulty !== 'sandbox') this.money -= cost;

    const visited = new Set([idx(x, z)]);
    const queue = [{ x, z }];
    let repaired = 0;
    while (queue.length > 0) {
      const cur = queue.shift();
      const ct = this.getTile(cur.x, cur.z);
      if (ct && ct.dam) {
        ct.damHealth = 100;
        ct.damStress = 0;
        repaired++;
      }
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cur.x + dx, nz = cur.z + dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (visited.has(ni)) continue;
          const nt = this.grid[ni];
          if (nt && nt.dam) {
            visited.add(ni);
            queue.push({ x: nx, z: nz });
          }
        }
      }
    }

    if (this.sfx && this.sfx.buildCivic) this.sfx.buildCivic();
    this.infraDirty = true;
    this.emitToast(`🔧 大坝全段已注浆加固抢修完毕（恢复 100% 耐久，花费 ¥${cost}）`);
    return { ok: true, repaired, cost };
  }

  getRoadIntersectionDegree(x, z) {
    const t = this.getTile(x, z);
    if (!t || !(t.roadGround === 1 || t.roadGround === 2) || t.dam) return 0;
    let deg = 0;
    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dz] of dirs4) {
      const nt = this.getTile(x + dx, z + dz);
      if (nt && (nt.roadGround > 0 || nt.ramp)) deg++;
    }
    return deg;
  }

  setJunctionMode(x, z, mode) {
    const t = this.getTile(x, z);
    if (!t || !(t.roadGround === 1 || t.roadGround === 2)) return { ok: false };
    if (!['signal', 'yield', 'roundabout'].includes(mode)) return { ok: false };
    if ((t.junctionMode || 'signal') === mode) return { ok: true, cost: 0 };

    let cost = 0;
    if (mode === 'roundabout' && !t.roundaboutPaid) {
      cost = this.difficulty === 'sandbox' ? 0 : 120;
      if (this.difficulty !== 'sandbox' && this.money < cost) {
        if (this.sfx) this.sfx.error();
        this.emitToast('💰 资金不足：改建景观环岛需 ¥120');
        return { ok: false };
      }
      if (this.difficulty !== 'sandbox') this.money -= cost;
      t.roundaboutPaid = true;
    }

    t.junctionMode = mode;
    this.infraDirty = true;
    if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
      this.traffic.refreshRoadGraph();
    }
    if (this.sfx) {
      if (mode === 'roundabout' && this.sfx.road) this.sfx.road();
      else if (this.sfx.tap) this.sfx.tap();
    }
    return { ok: true, cost };
  }

  onTripGridlockTimeout(v) {
    if (!v) return;
    this.gridlockTimeouts = (this.gridlockTimeouts || 0) + 1;
    const dx = v.destTile?.x ?? v.destTile?.tx;
    const dz = v.destTile?.z ?? v.destTile?.tz;
    const dtile = (typeof dx === 'number' && typeof dz === 'number') ? this.getTile(dx, dz) : null;
    const b = dtile?.building;
    if (b && !b.abandoned && !b.underConstruction) {
      if (v.tripType === 'freight' && (b.type === 'CL' || b.type === 'CH')) {
        if (this.difficulty !== 'sandbox') {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '干道严重塞车导致货车超时断货';
        }
      } else if ((v.tripLabel && v.tripLabel.includes('垃圾')) || v.tripType === 'garbage' || v.tripType === 'trash') {
        b.trashPiled = true;
        b.gridlockTrashTicks = 6;
        if (this.difficulty !== 'sandbox' && BUILDING_NAMES[b.type]) {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '垃圾车被堵在半路无法清运';
        }
      } else if (v.tripType === 'commute' && (b.type === 'I' || b.type === 'O')) {
        if (this.difficulty !== 'sandbox' && Math.random() < 0.45) {
          b.distress = Math.min(7, (b.distress || 0) + 1);
          b.abandonReason = '通勤干道瘫痪导致员工迟到减产';
        }
      }
    }
  }

  getQuestMetrics() {
    let countRoadTiles = 0;
    let elevatedCount = 0;
    let pipeCount = 0;
    let countHighDensity = 0;
    let buildingHighDensity = 0;
    const builtSet = new Set();

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround === 1 || t.roadGround === 2 || t.roadGround === 4 || t.roadElevated > 0) {
        countRoadTiles++;
      }
      if (t.roadElevated > 0) elevatedCount++;
      if (t.pipe && !t.pipeBroken) pipeCount++;

      const b = t.building;
      if (!b || b.abandoned) continue;
      if (!b.underConstruction) {
        builtSet.add(b.type);
        if (b.type === 'RH' || b.type === 'CH' || b.type === 'O') {
          countHighDensity++;
        }
      } else if (b.type === 'RH' || b.type === 'CH' || b.type === 'O') {
        buildingHighDensity++;
      }
    }

    return {
      countRoadTiles,
      elevatedCount,
      pipeCount,
      countHighDensity,
      buildingHighDensity,
      hasBuilding: (type) => builtSet.has(type)
    };
  }

  evaluateQuest(quest, m = this.getQuestMetrics()) {
    if (!quest) return { done: true, progressText: '全部指引已完成', recTool: 'pan', recCat: null };
    switch (quest.step) {
      case 1:
        return {
          done: m.countRoadTiles >= 12,
          progressText: `📊 已铺街道：${Math.min(12, m.countRoadTiles)} / 12 格`,
          recTool: 'road_1',
          recCat: 'road'
        };
      case 2:
        return {
          done: this.powerSupply >= 80,
          progressText: `📊 全市发电量：${this.powerSupply} / 80 MW`,
          recTool: 'power_wind',
          recCat: 'power'
        };
      case 3: {
        const wOk = this.waterSupply >= 200;
        const sOk = this.sewageSupply >= 200;
        const pOk = m.pipeCount >= 8;
        const cleanOk = this.waterPollutedPct < 5;
        let recTool = quest.tool;
        if (!wOk) recTool = 'water_pump';
        else if (!sOk) recTool = 'sewage_out';
        else recTool = 'water_pipe';
        return {
          done: wOk && sOk && pOk && cleanOk,
          progressText: `📊 抽水${wOk ? '✅' : `${this.waterSupply}/200`} · 排污${sOk ? '✅' : `${this.sewageSupply}/200`} · 水管${Math.min(8, m.pipeCount)}/8格${!cleanOk ? ' ⚠️水源受污!' : ''}`,
          recTool,
          recCat: 'water'
        };
      }
      case 4: {
        const recTool = (this.population >= 50 && this.jobsTotal < 25) ? 'zone_CL' : 'zone_RL';
        return {
          done: this.population >= 60 && this.jobsTotal >= 25,
          progressText: `📊 人口 ${this.population}/60 人 · 岗位 ${this.jobsTotal}/25 个`,
          recTool,
          recCat: 'zones'
        };
      }
      case 5: {
        const hasF = m.hasBuilding('fire_station');
        const hasP = m.hasBuilding('park');
        const unlocked = this.isToolUnlocked('fire_station');
        return {
          done: hasF && hasP,
          progressText: unlocked
            ? `📊 🚒消防署 ${hasF ? '✅' : '⬜'} · 🌳公园 ${hasP ? '✅' : '⬜'}`
            : `📊 升Lv.2人口 ${this.population}/180人 · 🚒消防⬜ · 🌳公园⬜`,
          recTool: !unlocked ? 'zone_RL' : (hasF ? 'park' : 'fire_station'),
          recCat: !unlocked ? 'zones' : 'civic'
        };
      }
      case 6: {
        const hasW = m.hasBuilding('waste_plant');
        const unlocked = this.isToolUnlocked('waste_plant');
        return {
          done: hasW && this.population >= 480,
          progressText: `📊 升Lv.3人口 ${Math.min(480, this.population)}/480人 · ♻️焚烧厂 ${hasW ? '✅' : '⬜'}`,
          recTool: (!unlocked || hasW) ? 'zone_RL' : 'waste_plant',
          recCat: (!unlocked || hasW) ? 'zones' : 'water'
        };
      }
      case 7: {
        const hasS = m.hasBuilding('school');
        const hasH = m.hasBuilding('hospital');
        const unlocked = this.isToolUnlocked('school');
        return {
          done: hasS && hasH,
          progressText: unlocked
            ? `📊 🏫理工大学 ${hasS ? '✅' : '⬜'} · 🏥综合医院 ${hasH ? '✅' : '⬜'}`
            : `📊 升Lv.4人口 ${this.population}/1,000人 · 🏥医院 ${hasH ? '✅' : '⬜'}`,
          recTool: !unlocked ? (hasH || !this.isToolUnlocked('hospital') ? 'zone_RL' : 'hospital') : (hasS ? 'hospital' : 'school'),
          recCat: !unlocked ? (hasH || !this.isToolUnlocked('hospital') ? 'zones' : 'civic') : 'civic'
        };
      }
      case 8: {
        const evOk = m.elevatedCount >= 4;
        const hdOk = m.countHighDensity >= 4;
        const unlocked = this.isToolUnlocked('road_elev');
        return {
          done: evOk && hdOk,
          progressText: unlocked
            ? `📊 🌉高架路 ${Math.min(4, m.elevatedCount)}/4格 · 🏙️高密/办公 ${Math.min(4, m.countHighDensity)}/4栋${m.buildingHighDensity > 0 ? ` (施工${m.buildingHighDensity})` : ''}`
            : `📊 升Lv.5人口 ${this.population}/1,900人 · 扩建住商工街区解锁高架&高密`,
          recTool: !unlocked ? 'zone_RL' : (!evOk ? 'road_elev' : 'zone_RH'),
          recCat: !unlocked ? 'zones' : (!evOk ? 'road' : 'zones')
        };
      }
      case 9: {
        const done = m.hasBuilding('metro_station') || m.hasBuilding('hsr_station') || m.hasBuilding('seaport');
        const unlocked = this.isToolUnlocked('metro_station');
        return {
          done,
          progressText: unlocked
            ? `📊 建成 🚇地铁站 / 🚢深水海港 / 🚉高铁站 任一枢纽`
            : `📊 升Lv.7人口 ${this.population}/5,000人 · 规划高密住宅(RH)冲刺轨道新都`,
          recTool: unlocked ? 'metro_station' : 'zone_RH',
          recCat: unlocked ? 'rail' : 'zones'
        };
      }
      case 10:
      default: {
        const done = m.hasBuilding('nuclear_plant') || this.hydroPowerMW > 50 || m.hasBuilding('airport');
        const unlocked = this.isToolUnlocked('nuclear_plant');
        return {
          done,
          progressText: unlocked
            ? `📊 建成 ☢️核电站 / 🏗️峡谷大坝(${Math.round(this.hydroPowerMW)}/50MW) / ✈️国际机场`
            : `📊 升Lv.9人口 ${this.population}/10,500人 · 发展摩天都市解锁核电&大坝`,
          recTool: unlocked ? 'nuclear_plant' : 'zone_RH',
          recCat: unlocked ? 'power' : 'zones'
        };
      }
    }
  }

  getCurrentQuestStatus() {
    const totalSteps = MAYOR_QUESTS.length;
    if (this.guideStep >= totalSteps) {
      return {
        completedAll: true,
        stepIndex: totalSteps,
        totalSteps,
        quest: null,
        evalResult: { done: true, progressText: '🏆 全部 10 步市长建城指引已圆满达成！', recTool: 'pan', recCat: null }
      };
    }
    const quest = MAYOR_QUESTS[this.guideStep];
    const evalResult = this.evaluateQuest(quest);
    return {
      completedAll: false,
      stepIndex: this.guideStep,
      totalSteps,
      quest,
      evalResult
    };
  }

  syncCompletedQuestsSilent() {
    const m = this.getQuestMetrics();
    while (this.guideStep < MAYOR_QUESTS.length) {
      const q = MAYOR_QUESTS[this.guideStep];
      if (!this.evaluateQuest(q, m).done) break;
      if (!this.completedQuests.includes(q.step)) {
        this.completedQuests.push(q.step);
      }
      this.guideStep++;
    }
  }

  checkMayorQuests() {
    if (this.guideStep >= MAYOR_QUESTS.length) return;
    const m = this.getQuestMetrics();
    while (this.guideStep < MAYOR_QUESTS.length) {
      const q = MAYOR_QUESTS[this.guideStep];
      if (!this.evaluateQuest(q, m).done) break;

      if (!this.completedQuests.includes(q.step)) {
        this.completedQuests.push(q.step);
      }
      this.guideStep++;

      if (this.difficulty !== 'sandbox' && q.rewardMoney > 0) {
        this.money += q.rewardMoney;
      }
      const lvUp = this.addXP(q.rewardXP, q.title, true);

      if (!lvUp) {
        if (this.sfx && this.sfx.milestone) this.sfx.milestone();
        this.latestChirp = {
          user: '@建城顾问团',
          text: `✅ 达成第${q.step}步指引【${q.title}】！国库拨款 +¥${q.rewardMoney.toLocaleString()}，经验 +${q.rewardXP} XP！`,
          mood: 'good'
        };
      }

      if (this.onQuestComplete) {
        this.onQuestComplete(q, lvUp);
      } else if (lvUp && this.onLevelUp) {
        this.onLevelUp(lvUp);
      }
    }
  }

  isToolUnlocked(toolId) {
    if (this.unlockAll || this.difficulty === 'sandbox') return true;
    const item = CATALOG[toolId];
    if (!item) return true;
    return (this.mayorLevel || 1) >= (item.unlockLevel || 1);
  }

  getTile(x, z) {
    if (!inBounds(x, z)) return null;
    return this.grid[idx(x, z)];
  }

  getTileElev(x, z) {
    if (!inBounds(x, z)) return 0;
    const c = this.corners;
    return (
      c[cIdx(x, z)] +
      c[cIdx(x + 1, z)] +
      c[cIdx(x, z + 1)] +
      c[cIdx(x + 1, z + 1)]
    ) * 0.25;
  }

  getTileMinMaxElev(x, z) {
    if (!inBounds(x, z)) return { min: 0, max: 0, slope: 0 };
    const c = this.corners;
    const h00 = c[cIdx(x, z)];
    const h10 = c[cIdx(x + 1, z)];
    const h01 = c[cIdx(x, z + 1)];
    const h11 = c[cIdx(x + 1, z + 1)];
    const min = Math.min(h00, h10, h01, h11);
    const max = Math.max(h00, h10, h01, h11);
    return { min, max, slope: max - min };
  }

  isWaterTile(x, z) {
    if (!inBounds(x, z)) return false;
    return this.waterDepth[idx(x, z)] > 0.08;
  }

  hasNearbyWater(x, z, radius = 2) {
    let bestPoll = 1;
    let found = false;
    for (let dz = -radius; dz <= radius; dz++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx, nz = z + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (this.waterDepth[ni] > 0.10) {
          found = true;
          if (this.waterPoll[ni] < bestPoll) bestPoll = this.waterPoll[ni];
        }
      }
    }
    return { found, poll: found ? bestPoll : 0 };
  }

  sculptTerrain(tx, tz, mode, flattenTarget = null) {
    if (!inBounds(tx, tz)) return false;
    if (!this.isToolUnlocked(mode)) {
      this.emitToast(`🔒 需升至市长等级 Lv.${CATALOG[mode]?.unlockLevel || 1} 解锁【${CATALOG[mode]?.name}】！`);
      return false;
    }
    const cost = this.difficulty === 'sandbox' ? 0 : (CATALOG[mode]?.cost || 35);
    if (this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast('💰 资金不足，土方开挖需谨慎预算（可去财政面板申请贷款）');
      return false;
    }

    if (mode === 'ter_spring') {
      const t = this.getTile(tx, tz);
      t.waterSpring = t.waterSpring > 0 ? 0 : 0.56;
      if (t.waterSpring > 0) {
        this.waterDepth[idx(tx, tz)] = Math.max(this.waterDepth[idx(tx, tz)], 0.45);
        this.emitToast('⛲ 已开启高山活水源头！泉水正顺山谷奔流而下');
        this.addXP(35, '开启高山泉眼');
      } else {
        this.emitToast('已关闭该处水源泉眼');
      }
      this.money -= cost;
      if (this.sfx) this.sfx.pipe();
      this.meshDirty = true;
      return true;
    }

    const R = 2.8;
    const cxCenter = tx + 0.5;
    const czCenter = tz + 0.5;
    let modified = false;

    const minCellZ = Math.max(0, tz - 4);
    const maxCellZ = Math.min(GRID_SIZE - 1, tz + 4);
    const minCellX = Math.max(0, tx - 4);
    const maxCellX = Math.min(GRID_SIZE - 1, tx + 4);
    const preElev = new Map();
    for (let z = minCellZ; z <= maxCellZ; z++) {
      for (let x = minCellX; x <= maxCellX; x++) {
        preElev.set(idx(x, z), this.getTileElev(x, z));
      }
    }

    for (let cz = Math.max(0, tz - 3); cz <= Math.min(CORNER_STRIDE - 1, tz + 4); cz++) {
      for (let cx = Math.max(0, tx - 3); cx <= Math.min(CORNER_STRIDE - 1, tx + 4); cx++) {
        // Protect South Highway & HSR outside-connection portals
        if (cz >= GRID_SIZE - 1 && (Math.abs(cx - 22.5) <= 1.6 || Math.abs(cx - 8.5) <= 1.6)) continue;
        const d = Math.hypot(cx - cxCenter, cz - czCenter);
        if (d > R) continue;
        const w = Math.cos((d / R) * Math.PI * 0.5);
        const ci = cIdx(cx, cz);
        const oldH = this.corners[ci];
        let newH = oldH;

        if (mode === 'ter_raise') newH = Math.min(3.5, oldH + 0.16 * w);
        else if (mode === 'ter_lower') newH = Math.max(-1.05, oldH - 0.18 * w);
        else if (mode === 'ter_flatten' && flattenTarget !== null) {
          newH = oldH + (flattenTarget - oldH) * (0.45 * w);
        }

        if (Math.abs(newH - oldH) > 0.001) {
          this.corners[ci] = newH;
          modified = true;
        }
      }
    }

    if (modified) {
      this.money -= cost;
      for (const [ti, oldE] of preElev.entries()) {
        const txCell = ti % GRID_SIZE;
        const tzCell = (ti / GRID_SIZE) | 0;
        const newE = this.getTileElev(txCell, tzCell);
        const oldW = this.waterDepth[ti];
        if (newE > oldE && oldW > 0) {
          const oldSurf = oldE + oldW;
          this.waterDepth[ti] = Math.max(0, oldSurf - newE);
        }
      }
      if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
      if (this.sfx) this.sfx.sculpt();
      this.meshDirty = true;
      if (this.traffic && typeof this.traffic.refreshRoadGraph === 'function') {
        this.traffic.refreshRoadGraph();
      }
    }
    return modified;
  }

  getBuildingDisplayName(b, x, z) {
    if (!b) return '';
    if (b.abandoned) return `🏚️ 废弃建筑（原${BUILDING_NAMES[b.type]?.[0]?.[0] || '楼宇'}）`;
    if (BUILDING_NAMES[b.type]) {
      const table = BUILDING_NAMES[b.type];
      const lvIdx = Math.min(table.length - 1, Math.max(0, (b.level || 1) - 1));
      const arr = table[lvIdx];
      return arr[(b.variant + x + z) % arr.length];
    }
    return CATALOG[b.type] ? CATALOG[b.type].name : b.type;
  }

  getMaxLevelForZone(zType) {
    if (zType === 'RL' || zType === 'CL') return 3;
    if (zType === 'I' || zType === 'O') return 4;
    return 5;
  }

  getBuildingStats(b) {
    if (!b || b.abandoned) return { pop: 0, jobs: 0, power: 0, water: 0 };
    if (b.underConstruction) return { pop: 0, jobs: 0, power: 1, water: 1 };
    const lv = b.level || 1;
    switch (b.type) {
      case 'RL': return { pop: [0, 12, 24, 42][lv] || 24, jobs: 0, power: lv * 1.8, water: lv * 2.0 };
      case 'RH': return { pop: [0, 46, 92, 168, 280, 440][lv] || 150, jobs: 0, power: lv * 3.8, water: lv * 4.0 };
      case 'CL': return { pop: 0, jobs: [0, 12, 26, 46][lv] || 20, power: lv * 2.2, water: lv * 2.0 };
      case 'CH': return { pop: 0, jobs: [0, 40, 86, 155, 260, 410][lv] || 120, power: lv * 4.5, water: lv * 3.8 };
      case 'I':  return { pop: 0, jobs: [0, 18, 40, 78, 140][lv] || 40, power: lv * 4.2, water: lv * 3.6 };
      case 'O':  return { pop: 0, jobs: [0, 32, 72, 145, 250][lv] || 70, power: lv * 3.5, water: lv * 2.6 };
      case 'landmark': return { pop: 0, jobs: 480, power: 48, water: 40 };
      case 'airport': return { pop: 0, jobs: 140, power: 36, water: 24 };
      case 'seaport': return { pop: 0, jobs: 95, power: 22, water: 14 };
      case 'stadium': return { pop: 0, jobs: 75, power: 28, water: 20 };
      case 'amusement_park': return { pop: 0, jobs: 48, power: 18, water: 12 };
      case 'hsr_station': return { pop: 0, jobs: 80, power: 26, water: 18 };
      case 'metro_station': return { pop: 0, jobs: 20, power: 14, water: 9 };
      case 'waste_plant': return { pop: 0, jobs: 28, power: 0, water: 8 };
      case 'solar_plant': return { pop: 0, jobs: 18, power: 0, water: 4 };
      case 'nuclear_plant': return { pop: 0, jobs: 65, power: 0, water: 0 };
      case 'hospital':
      case 'school':
      case 'fire_station':
      case 'police_station':
        return { pop: 0, jobs: 26, power: 10, water: 10 };
      case 'park':
        return { pop: 0, jobs: 4, power: 2, water: 3 };
      default:
        return { pop: 0, jobs: 0, power: 0, water: 0 };
    }
  }

  findRoadAccess(x, z) {
    const dirs = [
      { dx: 0, dz: 1, rot: 0 },
      { dx: 1, dz: 0, rot: 1 },
      { dx: 0, dz: -1, rot: 2 },
      { dx: -1, dz: 0, rot: 3 }
    ];
    for (const d of dirs) {
      const t = this.getTile(x + d.dx, z + d.dz);
      if (t && (t.roadGround === 1 || t.roadGround === 2)) {
        return { dist: 1, rot: d.rot, roadType: t.roadGround, rx: x + d.dx, rz: z + d.dz, roadTile: t };
      }
    }
    for (const d of dirs) {
      const t = this.getTile(x + d.dx * 2, z + d.dz * 2);
      if (t && (t.roadGround === 1 || t.roadGround === 2)) {
        return { dist: 2, rot: d.rot, roadType: t.roadGround, rx: x + d.dx * 2, rz: z + d.dz * 2, roadTile: t };
      }
    }
    return null;
  }

  computeLineOrLPath(x0, z0, x1, z1, straightOnly = false) {
    if (straightOnly) {
      const pts = [];
      let cx = x0, cz = z0;
      const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
      const dz = -Math.abs(z1 - z0), sz = z0 < z1 ? 1 : -1;
      let err = dx + dz;
      while (true) {
        if (inBounds(cx, cz)) pts.push({ x: cx, z: cz });
        if (cx === x1 && cz === z1) break;
        const e2 = 2 * err;
        if (e2 >= dz) { err += dz; cx += sx; }
        if (e2 <= dx) { err += dx; cz += sz; }
      }
      return pts;
    }

    const path = [];
    const dx = x1 - x0;
    const dz = z1 - z0;
    if (Math.abs(dx) >= Math.abs(dz)) {
      const stepX = dx >= 0 ? 1 : -1;
      for (let x = x0; x !== x1 + stepX; x += stepX) {
        if (inBounds(x, z0)) path.push({ x, z: z0 });
        if (x === x1) break;
      }
      if (dz !== 0) {
        const stepZ = dz >= 0 ? 1 : -1;
        for (let z = z0 + stepZ; z !== z1 + stepZ; z += stepZ) {
          if (inBounds(x1, z)) path.push({ x: x1, z });
          if (z === z1) break;
        }
      }
    } else {
      const stepZ = dz >= 0 ? 1 : -1;
      for (let z = z0; z !== z1 + stepZ; z += stepZ) {
        if (inBounds(x0, z)) path.push({ x: x0, z });
        if (z === z1) break;
      }
      if (dx !== 0) {
        const stepX = dx >= 0 ? 1 : -1;
        for (let x = x0 + stepX; x !== x1 + stepX; x += stepX) {
          if (inBounds(x, z1)) path.push({ x, z: z1 });
          if (x === x1) break;
        }
      }
    }
    return path;
  }

  computeRectTiles(x0, z0, x1, z1) {
    const minX = Math.max(0, Math.min(x0, x1));
    const maxX = Math.min(GRID_SIZE - 1, Math.max(x0, x1));
    const minZ = Math.max(0, Math.min(z0, z1));
    const maxZ = Math.min(GRID_SIZE - 1, Math.max(z0, z1));
    const out = [];
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) out.push({ x, z });
    }
    return out;
  }

  _isBlockedByMidSlipFlank(x, z) {
    // Check if an adjacent mid-viaduct slip-ramp (with elevated viaduct on BOTH ends) flares its side ramp across (x, z)
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nt = this.getTile(x + dx, z + dz);
      if (!nt || !nt.ramp) continue;
      if (dx !== 0) {
        if ((this.getTile(nt.x, nt.z - 1)?.roadElevated || 0) > 0 && (this.getTile(nt.x, nt.z + 1)?.roadElevated || 0) > 0) return true;
      } else {
        if ((this.getTile(nt.x - 1, nt.z)?.roadElevated || 0) > 0 && (this.getTile(nt.x + 1, nt.z)?.roadElevated || 0) > 0) return true;
      }
    }
    return false;
  }

  estimateAction(toolId, tiles) {
    let cost = 0;
    const validTiles = [];
    if (!this.isToolUnlocked(toolId)) {
      return { cost: 0, validTiles: [], lockedLevel: CATALOG[toolId]?.unlockLevel || 1 };
    }

    for (const pos of tiles) {
      const t = this.getTile(pos.x, pos.z);
      if (!t) continue;
      const wet = this.isWaterTile(pos.x, pos.z);
      const { slope } = this.getTileMinMaxElev(pos.x, pos.z);

      if (toolId === 'road_1' || toolId === 'road_2') {
        const target = toolId === 'road_1' ? 1 : 2;
        if (t.roadGround === 3 || t.dam) continue;
        if (slope > 0.72 && !wet) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        if (t.roadGround === target && (!wet || t.roadBridge)) continue;
        cost += wet ? CATALOG[toolId].bridgeCost : CATALOG[toolId].cost;
        validTiles.push(pos);
      } else if (toolId === 'road_elev') {
        if (t.roadElevated === 1 || t.dam) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        cost += CATALOG.road_elev.cost;
        validTiles.push(pos);
      } else if (toolId === 'road_ramp') {
        if (t.ramp || t.dam || wet || t.roadGround === 3 || t.rail > 0 || (t.building && !BUILDING_NAMES[t.building.type])) continue;
        cost += CATALOG.road_ramp.cost;
        validTiles.push(pos);
      } else if (toolId === 'road_tunnel') {
        if (wet || t.dam || t.roadGround === 4) continue;
        cost += CATALOG.road_tunnel.cost;
        validTiles.push(pos);
      } else if (toolId === 'metro_line') {
        if (t.metro) continue;
        cost += CATALOG.metro_line.cost;
        validTiles.push(pos);
      } else if (toolId === 'rail_track') {
        if (t.rail >= 1 || t.dam) continue;
        if (t.building && t.building.type !== 'hsr_station') continue;
        cost += wet ? CATALOG.rail_track.bridgeCost : CATALOG.rail_track.cost;
        validTiles.push(pos);
      } else if (toolId === 'water_pipe') {
        if (t.pipe && !t.pipeBroken) continue;
        cost += CATALOG.water_pipe.cost;
        validTiles.push(pos);
      } else if (toolId === 'hydro_dam') {
        if (t.roadGround === 3 || t.rail === 2) continue;
        cost += CATALOG.hydro_dam.cost;
        validTiles.push(pos);
      } else if (toolId === 'power_pylon') {
        if (wet || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.building || t.pylon || t.dam) continue;
        cost += CATALOG.power_pylon.cost;
        validTiles.push(pos);
      } else if (toolId.startsWith('zone_')) {
        const zType = toolId.slice(5);
        // Prevent zoning under elevated viaducts, ramps, mid-slip ramp flanks, or rails so buildings NEVER clip into bridges!
        if (wet || slope > 0.62 || t.roadGround > 0 || t.roadElevated > 0 || t.ramp || t.rail > 0 || t.dam || t.pylon) continue;
        if (this._isBlockedByMidSlipFlank(pos.x, pos.z)) continue;
        if (t.building && !BUILDING_NAMES[t.building.type]) continue;
        if (t.zone === zType && (!t.building || !t.building.abandoned)) continue;
        cost += CATALOG[toolId].cost;
        validTiles.push(pos);
      } else if (toolId === 'dezone') {
        if (t.zone) validTiles.push(pos);
      } else if (toolId === 'bulldoze') {
        if (t.roadGround === 3 || t.rail === 2) continue;
        if (t.roadGround > 0 || t.roadElevated > 0 || t.ramp || t.rail > 0 || t.dam || t.pylon || t.building || t.zone) {
          cost += CATALOG.bulldoze.cost;
          validTiles.push(pos);
        }
      } else if (toolId === 'bulldoze_under') {
        if (t.pipe || t.metro) {
          cost += CATALOG.bulldoze_under.cost;
          validTiles.push(pos);
        }
      } else if (CATALOG[toolId]) {
        const hasFixedBuilding = Boolean(t.building && !BUILDING_NAMES[t.building.type]);
        if (this._isBlockedByMidSlipFlank(pos.x, pos.z)) continue;
        if (toolId === 'water_pump' || toolId === 'sewage_out') {
          const nearW = this.hasNearbyWater(pos.x, pos.z, 2);
          if (!nearW.found || hasFixedBuilding || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.dam) continue;
        } else if (toolId === 'nuclear_plant' || toolId === 'seaport') {
          const nearW = this.hasNearbyWater(pos.x, pos.z, 2);
          if (wet || !nearW.found || hasFixedBuilding || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.dam) continue;
        } else {
          const railBlocked = t.rail > 0 && toolId !== 'hsr_station';
          if (wet || slope > 0.65 || t.roadGround > 0 || t.roadElevated > 0 || railBlocked || hasFixedBuilding || t.dam) continue;
        }
        cost += CATALOG[toolId].cost;
        validTiles.push(pos);
      }
    }

    if (this.difficulty === 'sandbox') cost = 0;
    return { cost, validTiles };
  }

  applyTool(toolId, tiles, free = false) {
    if (!free && !this.isToolUnlocked(toolId)) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`🔒 需升至市长等级 Lv.${CATALOG[toolId]?.unlockLevel || 1} 解锁【${CATALOG[toolId]?.name}】！`);
      return { ok: false };
    }

    const savedUnlock = this.unlockAll;
    if (free) this.unlockAll = true;
    const { cost, validTiles } = this.estimateAction(toolId, tiles);
    this.unlockAll = savedUnlock;

    if (validTiles.length === 0) {
      if (!free && (toolId === 'water_pump' || toolId === 'sewage_out')) {
        this.emitToast('💧 抽水站与排污口必须建在河岸或海边（2格内有水）！');
      } else if (!free && toolId === 'nuclear_plant') {
        this.emitToast('☢️ 核裂变发电站必须建在河岸或海湾陆地上（2格内有冷却水）！');
      } else if (!free && toolId === 'seaport') {
        this.emitToast('🚢 深水集装箱海港必须建在海湾或深水河岸陆地上（2格内有水域）！');
      }
      return { ok: false };
    }
    const isBulldozeTool = toolId === 'bulldoze' || toolId === 'bulldoze_under';
    if (!free && this.difficulty !== 'sandbox' && !isBulldozeTool && this.money < cost) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`💰 国库资金不足（需 ¥${cost.toLocaleString()}）！可前往【📊 财政】申请市政贷款`);
      return { ok: false };
    }

    if (!free && this.difficulty !== 'sandbox') {
      if (isBulldozeTool && this.money < cost) {
        this.money -= Math.max(0, Math.min(this.money, cost));
      } else {
        this.money -= cost;
      }
    }

    let uniformDamCrest = 1.2;
    if (toolId === 'hydro_dam') {
      let maxBank = 0.6;
      for (const p of validTiles) {
        const e = this.getTileElev(p.x, p.z) + this.waterDepth[idx(p.x, p.z)];
        if (e > maxBank) maxBank = e;
      }
      const first = validTiles[0];
      const last = validTiles[validTiles.length - 1];
      maxBank = Math.max(maxBank, this.getTileElev(first.x, first.z) + 0.35, this.getTileElev(last.x, last.z) + 0.35);
      uniformDamCrest = Math.min(3.2, Math.max(0.85, maxBank + 0.22));
    }

    let gradedAny = false;
    const gradeFlat = (gx, gz, strength = 0.78) => {
      if (this.isWaterTile(gx, gz)) return;
      const c = this.corners;
      const i00 = cIdx(gx, gz), i10 = cIdx(gx + 1, gz);
      const i01 = cIdx(gx, gz + 1), i11 = cIdx(gx + 1, gz + 1);
      const avg = (c[i00] + c[i10] + c[i01] + c[i11]) * 0.25;
      c[i00] += (avg - c[i00]) * strength;
      c[i10] += (avg - c[i10]) * strength;
      c[i01] += (avg - c[i01]) * strength;
      c[i11] += (avg - c[i11]) * strength;
      gradedAny = true;
    };

    // Smooth longitudinal path grading for roads, ramps & rail: eliminates terrace staircases while preserving natural uphill/downhill slopes!
    const gradeSmoothPath = (pathTiles) => {
      const c = this.corners;
      const M = pathTiles.length;
      if (M === 0) return;

      if (M === 1) {
        const { x, z } = pathTiles[0];
        if (this.isWaterTile(x, z)) return;
        const i00 = cIdx(x, z), i10 = cIdx(x + 1, z);
        const i01 = cIdx(x, z + 1), i11 = cIdx(x + 1, z + 1);
        const hasRoadX = (this.getTile(x - 1, z)?.roadGround > 0) || (this.getTile(x + 1, z)?.roadGround > 0);
        const hasRoadZ = (this.getTile(x, z - 1)?.roadGround > 0) || (this.getTile(x, z + 1)?.roadGround > 0);
        if (hasRoadX && !hasRoadZ) {
          // Preserve X longitudinal slope, gently level Z cross-tilt
          const m0 = (c[i00] + c[i01]) * 0.5;
          const m1 = (c[i10] + c[i11]) * 0.5;
          c[i00] += (m0 - c[i00]) * 0.45;
          c[i01] += (m0 - c[i01]) * 0.45;
          c[i10] += (m1 - c[i10]) * 0.45;
          c[i11] += (m1 - c[i11]) * 0.45;
        } else if (hasRoadZ && !hasRoadX) {
          // Preserve Z longitudinal slope, gently level X cross-tilt
          const m0 = (c[i00] + c[i10]) * 0.5;
          const m1 = (c[i01] + c[i11]) * 0.5;
          c[i00] += (m0 - c[i00]) * 0.45;
          c[i10] += (m0 - c[i10]) * 0.45;
          c[i01] += (m1 - c[i01]) * 0.45;
          c[i11] += (m1 - c[i11]) * 0.45;
        } else {
          // Remove quad saddle twist without flattening natural slope
          const twist = (c[i00] + c[i11] - c[i10] - c[i01]) * 0.25;
          c[i00] -= twist * 0.6;
          c[i11] -= twist * 0.6;
          c[i10] += twist * 0.6;
          c[i01] += twist * 0.6;
        }
        gradedAny = true;
        return;
      }

      const rawH = new Float32Array(M);
      for (let k = 0; k < M; k++) {
        rawH[k] = this.getTileElev(pathTiles[k].x, pathTiles[k].z);
      }
      const smoothH = new Float32Array(rawH);
      for (let pass = 0; pass < 2; pass++) {
        const tmp = new Float32Array(smoothH);
        for (let k = 1; k < M - 1; k++) {
          tmp[k] = smoothH[k - 1] * 0.25 + smoothH[k] * 0.50 + smoothH[k + 1] * 0.25;
        }
        smoothH.set(tmp);
      }

      const cornerSum = new Map();
      const cornerCnt = new Map();
      const addCornerTarget = (ci, val) => {
        cornerSum.set(ci, (cornerSum.get(ci) || 0) + val);
        cornerCnt.set(ci, (cornerCnt.get(ci) || 0) + 1);
      };

      for (let k = 0; k < M; k++) {
        const p = pathTiles[k];
        if (this.isWaterTile(p.x, p.z)) continue;
        if (toolId === 'rail_track' && this.getTile(p.x, p.z)?.roadGround > 0) continue;

        const pPrev = pathTiles[Math.max(0, k - 1)];
        const pNext = pathTiles[Math.min(M - 1, k + 1)];
        const tx = pNext.x - pPrev.x;
        const tz = pNext.z - pPrev.z;
        const tLen = Math.hypot(tx, tz) || 1;
        const ux = tx / tLen;
        const uz = tz / tLen;

        const hPrev = smoothH[Math.max(0, k - 1)];
        const hNext = smoothH[Math.min(M - 1, k + 1)];
        const dStep = (k > 0 ? Math.hypot(p.x - pPrev.x, p.z - pPrev.z) : 0) +
                      (k < M - 1 ? Math.hypot(pNext.x - p.x, pNext.z - p.z) : 0);
        const dhDs = dStep > 0.01 ? (hNext - hPrev) / dStep : 0;

        const i00 = cIdx(p.x, p.z), i10 = cIdx(p.x + 1, p.z);
        const i01 = cIdx(p.x, p.z + 1), i11 = cIdx(p.x + 1, p.z + 1);
        const gradX = ((c[i10] - c[i00]) + (c[i11] - c[i01])) * 0.5;
        const gradZ = ((c[i01] - c[i00]) + (c[i11] - c[i10])) * 0.5;
        // Keep only 35% of transverse cross-tilt so hillside road deck stays comfortably level sideways
        const crossSlope = gradX * (-uz) + gradZ * ux;

        const offsets = [
          [i00, -0.5, -0.5],
          [i10,  0.5, -0.5],
          [i01, -0.5,  0.5],
          [i11,  0.5,  0.5]
        ];
        for (const [ci, ox, oz] of offsets) {
          const sOff = ox * ux + oz * uz;
          const tOff = ox * (-uz) + oz * ux;
          const ideal = smoothH[k] + sOff * dhDs + tOff * crossSlope * 0.35;
          addCornerTarget(ci, ideal);
        }
      }

      for (const [ci, sumVal] of cornerSum.entries()) {
        const target = sumVal / cornerCnt.get(ci);
        c[ci] += (target - c[ci]) * 0.68;
        gradedAny = true;
      }
    };

    if (toolId === 'road_1' || toolId === 'road_2' || toolId === 'road_ramp' || toolId === 'rail_track') {
      gradeSmoothPath(validTiles);
    }

    for (const pos of validTiles) {
      const t = this.getTile(pos.x, pos.z);
      if (!t) continue;

      if (toolId === 'road_1' || toolId === 'road_2') {
        t.roadGround = toolId === 'road_1' ? 1 : 2;
        t.roadBridge = this.isWaterTile(pos.x, pos.z);
        t.zone = null;
        t.building = null;
        t.pylon = false;
        t.trees = 0;
      } else if (toolId === 'road_elev') {
        t.roadElevated = 1;
        if (t.building && BUILDING_NAMES[t.building.type]) t.building = null;
        t.zone = null;
        t.pylon = false;
        t.trees = 0;
      } else if (toolId === 'road_ramp') {
        if (t.roadGround === 0) t.roadGround = 2;
        t.roadElevated = 1;
        t.ramp = true;
        t.zone = null;
        t.building = null;
        t.pylon = false;
        t.trees = 0;
        // Clear zoned R/C/I/O parcels on immediate flanks if this ramp sits mid-viaduct (mid_slip side slip-ramps)
        const ewMid = (this.getTile(pos.x - 1, pos.z)?.roadElevated || 0) > 0 && (this.getTile(pos.x + 1, pos.z)?.roadElevated || 0) > 0;
        const nsMid = (this.getTile(pos.x, pos.z - 1)?.roadElevated || 0) > 0 && (this.getTile(pos.x, pos.z + 1)?.roadElevated || 0) > 0;
        if (ewMid || nsMid) {
          const flanks = ewMid ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]];
          for (const [fx, fz] of flanks) {
            const ft = this.getTile(pos.x + fx, pos.z + fz);
            if (ft) {
              ft.zone = null;
              if (ft.building && BUILDING_NAMES[ft.building.type]) ft.building = null;
              ft.trees = 0;
            }
          }
        }
      } else if (toolId === 'road_tunnel') {
        t.roadGround = 4;
        t.trees = 0;
      } else if (toolId === 'metro_line') {
        t.metro = true;
      } else if (toolId === 'rail_track') {
        t.rail = 1;
        t.zone = null;
        t.pylon = false;
        if (t.building && t.building.type !== 'hsr_station') t.building = null;
        t.trees = 0;
      } else if (toolId === 'water_pipe') {
        t.pipe = true;
        t.pipeBroken = false;
      } else if (toolId === 'hydro_dam') {
        t.dam = true;
        t.damCrest = uniformDamCrest;
        t.damHealth = 100;
        t.damStress = 0;
        t.roadGround = 2;
        t.zone = null;
        t.building = null;
        t.trees = 0;
      } else if (toolId === 'power_pylon') {
        t.pylon = true;
        t.zone = null;
        t.trees = 0;
      } else if (toolId.startsWith('zone_')) {
        const zType = toolId.slice(5);
        if ((t.zone !== zType || t.building?.abandoned) && t.building && BUILDING_NAMES[t.building.type]) {
          t.building = null;
        }
        t.zone = zType;
        t.trees = 0;
      } else if (toolId === 'dezone') {
        t.zone = null;
        if (t.building && BUILDING_NAMES[t.building.type]) t.building = null;
      } else if (toolId === 'bulldoze') {
        if (t.roadElevated > 0 && (t.roadGround > 0 || t.rail > 0 || t.building)) {
          // Smart Layer-Priority Bulldoze: remove elevated viaduct/ramp FIRST, preserving ground street/rail!
          t.roadElevated = 0;
          t.ramp = false;
        } else {
          if (t.roadGround !== 3) {
            t.roadGround = 0;
            t.roadBridge = false;
            t.junctionMode = null;
            t.roundaboutPaid = false;
          }
          t.roadElevated = 0;
          t.ramp = false;
          if (t.rail !== 2) t.rail = 0;
          t.dam = false;
          t.damOutputMW = 0;
          t.damHealth = 100;
          t.damStress = 0;
          t.pylon = false;
          if (!t.building) t.zone = null;
          t.building = null;
        }
      } else if (toolId === 'bulldoze_under') {
        t.pipe = false;
        t.pipeBroken = false;
        t.metro = false;
      } else if (CATALOG[toolId]) {
        gradeFlat(pos.x, pos.z, 0.85);
        const acc = this.findRoadAccess(pos.x, pos.z);
        t.zone = null;
        t.pylon = false;
        t.trees = 0;
        if (toolId === 'water_pump' || toolId === 'sewage_out' || toolId === 'water_treat') {
          t.pipe = true;
          t.pipeBroken = false;
        }
        if (toolId === 'metro_station') t.metro = true;
        if (toolId === 'hsr_station') t.rail = 1;
        t.building = {
          type: toolId,
          level: 1,
          variant: Math.floor(hash2D(pos.x, pos.z, this.seed + 99) * 8),
          rot: acc ? acc.rot : 0,
          underConstruction: false,
          buildProgress: 1,
          upgradeProgress: 0,
          fire: 0,
          sick: false,
          trashPiled: false,
          flooded: false,
          abandoned: false,
          distress: 0,
          abandonReason: ''
        };
      }
    }

    if (toolId === 'bulldoze') {
      const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const pos of validTiles) {
        for (const [dx, dz] of [[0, 0], ...dirs4]) {
          const nt = this.getTile(pos.x + dx, pos.z + dz);
          if (!nt || nt.roadGround <= 0) continue;
          let deg = 0;
          for (const [qx, qz] of dirs4) {
            if ((this.getTile(nt.x + qx, nt.z + qz)?.roadGround || 0) > 0) deg++;
          }
          if (deg < 3 && nt.junctionMode && nt.junctionMode !== 'signal') {
            nt.junctionMode = 'signal';
            nt.roundaboutPaid = false;
          }
        }
      }
    }

    if (gradedAny && this.waterPhysics) {
      this.waterPhysics.refreshCellElevations();
    }

    const prevSuppress = this._suppressPromotions;
    if (free) this._suppressPromotions = true;
    this.recomputeNetworksAndFields();
    this._suppressPromotions = prevSuppress;
    if (gradedAny) this.terrainDirty = true;
    if (
      toolId.startsWith('road_') || toolId === 'rail_track' || toolId === 'water_pipe' ||
      toolId === 'metro_line' || toolId === 'power_line' || toolId === 'hydro_dam'
    ) {
      this.infraDirty = true;
      this.forestDirty = true;
      if (toolId === 'road_ramp') this.buildingDirty = true;
    } else if (toolId.startsWith('zone_') || toolId === 'dezone') {
      this.buildingDirty = true;
      this.forestDirty = true;
    } else if (toolId.startsWith('bulldoze')) {
      this.infraDirty = true;
      this.forestDirty = true;
      this.buildingDirty = true;
    } else {
      this.buildingDirty = true;
      this.forestDirty = true;
      if (toolId === 'hsr_station' || toolId === 'metro_station') this.infraDirty = true;
    }

    if (!free && this.sfx) {
      if (toolId.startsWith('road_')) this.sfx.road();
      else if (toolId === 'water_pipe' || toolId === 'metro_line') this.sfx.pipe();
      else if (toolId === 'rail_track' || toolId === 'hsr_station') this.sfx.rail();
      else if (toolId.startsWith('zone_') || toolId === 'dezone') this.sfx.zone();
      else if (toolId.startsWith('bulldoze')) this.sfx.bulldoze();
      else this.sfx.buildCivic();
    }

    if (!free) {
      if (
        toolId === 'road_1' || toolId === 'road_2' || toolId === 'road_elev' ||
        toolId === 'road_ramp' || toolId === 'road_tunnel' || toolId === 'water_pipe' ||
        toolId === 'metro_line' || toolId === 'rail_track' || toolId === 'power_pylon'
      ) {
        this.addXP(validTiles.length * 1, toolId);
      } else if (toolId === 'hydro_dam') {
        this.addXP(validTiles.length * 40, '水力发电大坝');
      } else if (!toolId.startsWith('zone_') && toolId !== 'dezone' && !toolId.startsWith('bulldoze') && CATALOG[toolId]) {
        const bXp = Math.min(120, Math.max(35, Math.round((CATALOG[toolId]?.cost || 1000) / 35)));
        this.addXP(bXp * validTiles.length, CATALOG[toolId]?.name || toolId);
      }
      this.checkMayorQuests();
    }

    return { ok: true, count: validTiles.length, cost };
  }

  takeLoan(loanId) {
    const offer = LOAN_OFFERS.find((l) => l.id === loanId);
    if (!offer) return false;
    if (!this.unlockAll && this.difficulty !== 'sandbox' && (this.mayorLevel || 1) < (offer.unlockLevel || 2)) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`🔒 需升至市长等级 Lv.${offer.unlockLevel || 2} 解锁【${offer.name}】！`);
      return false;
    }
    if (this.activeLoans.some((l) => l.id === loanId)) {
      this.emitToast('该项债券尚未还清，请先偿还后再借');
      return false;
    }
    this.money += offer.principal;
    this.activeLoans.push({
      id: offer.id,
      name: offer.name,
      remaining: offer.totalRepay,
      periodPay: offer.periodPay
    });
    if (this.sfx) this.sfx.buildCivic();
    this.emitToast(`🏦 已获批【${offer.name}】+¥${offer.principal.toLocaleString()}！注意每期利息扣款`);
    return true;
  }

  repayLoan(loanId) {
    const idxLoan = this.activeLoans.findIndex((l) => l.id === loanId);
    if (idxLoan === -1) return false;
    const loan = this.activeLoans[idxLoan];
    if (this.money < loan.remaining) {
      if (this.sfx) this.sfx.error();
      this.emitToast(`资金不足以提前结清（需 ¥${loan.remaining.toLocaleString()}）`);
      return false;
    }
    this.money -= loan.remaining;
    this.activeLoans.splice(idxLoan, 1);
    if (this.sfx) this.sfx.milestone();
    this.emitToast(`✅ 已提前还清【${loan.name}】，财政无债一身轻！`);
    return true;
  }

  recomputeNetworksAndFields() {
    const N = this.grid.length;
    const svcMult = this.budgets.service / 100;
    const pwrMult = this.budgets.power / 100;
    const wtrMult = this.budgets.water / 100;

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const elev = this.getTileElev(t.x, t.z);
      const nearW = this.hasNearbyWater(t.x, t.z, 2);
      t.powered = false;
      t.watered = false;
      t.outsideConnected = false;
      t.pollution = 0;
      t.serviceScore = 0;
      t.education = 0;
      t.crimeSafety = 0;
      t.fireSafety = 0;
      t.landValue = 22 + (nearW.found && nearW.poll <= 0.35 ? 14 : 0) + (elev > 0.7 && elev < 2.0 ? 9 : 0);
    }

    // ==================== PHASE A: Power Generation & HV Power Grid BFS ====================
    const powerSources = [];
    let totalPowerOut = (this.hydroPowerMW || 0) * pwrMult;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.dam) powerSources.push({ x, z });

        const b = t.building;
        if (!b || b.abandoned || b.underConstruction || b.flooded || b.fire > 0.3) continue;

        if (b.type === 'power_wind') {
          const elevBoost = Math.min(1.4, 0.9 + Math.max(0, this.getTileElev(x, z)) * 0.22);
          totalPowerOut += CATALOG.power_wind.powerOut * elevBoost * pwrMult;
          powerSources.push({ x, z });
        } else if (b.type === 'solar_plant') {
          totalPowerOut += CATALOG.solar_plant.powerOut * pwrMult;
          powerSources.push({ x, z });
        } else if (b.type === 'power_plant') {
          if (this.findRoadAccess(x, z)) {
            totalPowerOut += CATALOG.power_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        } else if (b.type === 'nuclear_plant') {
          if (this.findRoadAccess(x, z) && this.hasNearbyWater(x, z, 2).found) {
            totalPowerOut += CATALOG.nuclear_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        } else if (b.type === 'waste_plant') {
          if (this.findRoadAccess(x, z)) {
            totalPowerOut += CATALOG.waste_plant.powerOut * pwrMult;
            powerSources.push({ x, z });
          }
        }
      }
    }

    this.powerSupply = Math.round(totalPowerOut);
    if (powerSources.length > 0 && totalPowerOut > 0) {
      const pVis = new Uint8Array(N);
      const pQueue = [];
      for (const s of powerSources) {
        const si = idx(s.x, s.z);
        if (!pVis[si]) {
          pVis[si] = 1;
          pQueue.push(si);
        }
      }

      let head = 0;
      let pUsed = 0;
      while (head < pQueue.length) {
        const ci = pQueue[head++];
        const ct = this.grid[ci];
        const need = this.getBuildingStats(ct.building).power || 0;

        if (pUsed + need <= totalPowerOut) {
          ct.powered = true;
          pUsed += need;
        } else if (need === 0) {
          ct.powered = true;
        }

        const rad = ct.pylon ? 6 : 3;
        const r2 = rad * rad;
        for (let dz = -rad; dz <= rad; dz++) {
          for (let dx = -rad; dx <= rad; dx++) {
            if (dx * dx + dz * dz > r2) continue;
            const nx = ct.x + dx, nz = ct.z + dz;
            if (!inBounds(nx, nz)) continue;
            const ni = idx(nx, nz);
            if (pVis[ni]) continue;
            const nt = this.grid[ni];
            if (nt.pylon || nt.building || nt.zone || nt.dam) {
              pVis[ni] = 1;
              pQueue.push(ni);
            }
          }
        }
      }
    }

    // ==================== Intercity Outside Connection 2-Layer Road BFS ====================
    {
      const visG = new Uint8Array(N);
      const visE = new Uint8Array(N);
      const outQ = [];
      let portalCount = 0;
      let hubSeedCount = 0;

      for (let i = 0; i < N; i++) {
        const t = this.grid[i];
        if (t.roadGround === 3) {
          portalCount++;
          if (!visG[i]) {
            visG[i] = 1;
            outQ.push(i * 2);
          }
        }
        const b = t.building;
        if (
          b && !b.abandoned && !b.underConstruction && !b.flooded && !(b.fire > 0.3) && t.powered &&
          (b.type === 'hsr_station' || b.type === 'airport' || (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found))
        ) {
          const acc = this.findRoadAccess(t.x, t.z);
          if (acc) {
            const ri = idx(acc.rx, acc.rz);
            hubSeedCount++;
            if (!visG[ri]) {
              visG[ri] = 1;
              outQ.push(ri * 2);
            }
          }
        }
      }

      if (portalCount === 0 && hubSeedCount === 0) {
        // Safety fallback for synthetic unit test maps without highway portals
        for (let i = 0; i < N; i++) {
          const t = this.grid[i];
          if (t.roadGround > 0 || t.roadElevated > 0) t.outsideConnected = true;
        }
      } else {
        const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let oHead = 0;
        while (oHead < outQ.length) {
          const code = outQ[oHead++];
          const ci = code >> 1;
          const layer = code & 1;
          const ct = this.grid[ci];

          if (ct.ramp) {
            if (layer === 0 && ct.roadElevated > 0 && !visE[ci]) {
              visE[ci] = 1;
              outQ.push(ci * 2 + 1);
            } else if (layer === 1 && ct.roadGround > 0 && !visG[ci]) {
              visG[ci] = 1;
              outQ.push(ci * 2);
            }
          }

          for (const [dx, dz] of dirs4) {
            const nx = ct.x + dx, nz = ct.z + dz;
            if (!inBounds(nx, nz)) continue;
            const ni = idx(nx, nz);
            const nt = this.grid[ni];
            if (layer === 0) {
              if (nt.roadGround > 0 && !visG[ni]) {
                visG[ni] = 1;
                outQ.push(ni * 2);
              }
            } else if (nt.roadElevated > 0 && !visE[ni]) {
              visE[ni] = 1;
              outQ.push(ni * 2 + 1);
            }
          }
        }

        for (let i = 0; i < N; i++) {
          const t = this.grid[i];
          if (t.roadGround > 0) t.outsideConnected = Boolean(visG[i]);
          else if (t.roadElevated > 0) t.outsideConnected = Boolean(visE[i]);
        }
      }
    }

    // ==================== Polluted Riverbank Odor Seepage ====================
    {
      const seepPol = new Float32Array(N);
      const seepLV = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        if (this.waterDepth[i] > 0.08 && this.waterPoll[i] > 0.38) {
          const wp = this.waterPoll[i];
          const wx = i % GRID_SIZE;
          const wz = (i / GRID_SIZE) | 0;
          const basePol = Math.round(wp * 22);
          for (let dz = -2; dz <= 2; dz++) {
            for (let dx = -2; dx <= 2; dx++) {
              const d2 = dx * dx + dz * dz;
              if (d2 > 5) continue;
              const nx = wx + dx, nz = wz + dz;
              if (!inBounds(nx, nz)) continue;
              const falloff = 1 - Math.sqrt(d2) / 2.8;
              const ni = idx(nx, nz);
              seepPol[ni] = Math.min(36, seepPol[ni] + basePol * falloff);
              seepLV[ni] = Math.max(-22, seepLV[ni] - 10 * falloff);
            }
          }
        }
      }
      for (let i = 0; i < N; i++) {
        if (seepPol[i] > 0 || seepLV[i] < 0) {
          this.grid[i].pollution += seepPol[i];
          this.grid[i].landValue += seepLV[i];
        }
      }
    }

    // ==================== PHASE B: Powered Water/Sewage/Waste & Road-Reachable Civic Services ====================
    const waterNodes = [];
    let totalWaterOut = 0;
    let totalSewageCap = 0;
    let totalTrashCap = 0;
    let pollutedWaterIntake = 0;
    let landmarkBonus = 0;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.roadGround === 2) this.addRadialField(x, z, 3, 5, 0, 0, 0, 0, 0);

        const b = t.building;
        if (!b) continue;

        if (b.abandoned) {
          // Abandoned ruins drag down surrounding land value & breed crime!
          this.addRadialField(x, z, 4, -16, 4, 0, 0, 0, -15);
          continue;
        }

        const operational = !b.underConstruction && !b.flooded && !(b.fire > 0.3);

        if (b.type === 'power_plant') {
          if (operational && this.findRoadAccess(x, z)) {
            this.addRadialField(x, z, 6, -18, 36, 0, 0, 0, 0);
          }
        } else if (b.type === 'solar_plant') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 5, 4, 0, 8, 0, 0, 0);
          }
        } else if (b.type === 'nuclear_plant') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 6, -6, 0, 10, 0, 0, 0);
          }
        } else if (b.type === 'waste_plant') {
          const hasRd = Boolean(this.findRoadAccess(x, z));
          if (operational && t.powered && hasRd) {
            totalTrashCap += CATALOG.waste_plant.trashCap * svcMult;
          }
          const wPol = Math.round(16 * (this.policies.greenCity ? 0.5 : 1.0));
          this.addRadialField(x, z, 5, -10, wPol, (operational && t.powered && hasRd) ? 14 * svcMult : 0, 0, 0, 0);
        } else if (b.type === 'water_pump') {
          if (operational && t.powered) {
            const nw = this.hasNearbyWater(x, z, 2);
            if (nw.found) {
              const out = CATALOG.water_pump.waterOut * wtrMult;
              totalWaterOut += out;
              pollutedWaterIntake += out * nw.poll;
              waterNodes.push({ x, z });
            }
          }
        } else if (b.type === 'sewage_out') {
          if (operational && t.powered) {
            const nw = this.hasNearbyWater(x, z, 2);
            if (nw.found) {
              totalSewageCap += CATALOG.sewage_out.sewageCap * wtrMult;
              waterNodes.push({ x, z });
              this.addRadialField(x, z, 5, -20, 30, 0, 0, 0, 0);
            }
          }
        } else if (b.type === 'water_treat') {
          if (operational && t.powered) {
            totalWaterOut += CATALOG.water_treat.waterOut * wtrMult;
            totalSewageCap += CATALOG.water_treat.sewageCap * wtrMult;
            waterNodes.push({ x, z });
          }
        } else if (b.type === 'fire_station') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(12 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 8, 12 * svcMult, 70 * svcMult, 0, 0);
          }
        } else if (b.type === 'police_station') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(13 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 14, 18 * svcMult, 0, 0, 75 * svcMult);
          }
        } else if (b.type === 'hospital') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(14 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 20, 30 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'school') {
          const acc = this.findRoadAccess(x, z);
          if (operational && t.powered && acc) {
            const r = Math.round(15 * svcMult);
            this.propagateServiceAlongRoads(acc.rx, acc.rz, r * 1.45, 18, 26 * svcMult, 0, 78 * svcMult, 0);
          }
        } else if (b.type === 'park') {
          this.addRadialField(x, z, 7, 24, -8, 18, 0, 0, 0);
        } else if (b.type === 'metro_station') {
          if (operational && t.powered) {
            this.addRadialField(x, z, 9, 22, 0, 24, 0, 0, 0);
          }
        } else if (b.type === 'hsr_station') {
          if (operational && t.powered) {
            landmarkBonus += 0.14;
            this.addRadialField(x, z, 14, 28, 0, 25, 0, 0, 0);
          }
        } else if (b.type === 'seaport') {
          if (operational && t.powered && this.hasNearbyWater(x, z, 2).found) {
            landmarkBonus += 0.10;
            this.addRadialField(x, z, 10, 12, 8, 20, 0, 0, 0);
          }
        } else if (b.type === 'airport') {
          if (operational && t.powered) {
            landmarkBonus += 0.16;
            this.addRadialField(x, z, 14, 22, 6, 26, 0, 0, 0);
          }
        } else if (b.type === 'amusement_park') {
          if (operational && t.powered) {
            landmarkBonus += 0.12;
            this.addRadialField(x, z, 14, 34, 0, 30 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'stadium') {
          if (operational && t.powered) {
            landmarkBonus += 0.14;
            this.addRadialField(x, z, 15, 30, 0, 32 * svcMult, 0, 0, 0);
          }
        } else if (b.type === 'landmark') {
          if (operational && t.powered) {
            landmarkBonus += 0.22;
            this.addRadialField(x, z, 18, 38, 0, 34, 0, 0, 0);
          }
        } else if (b.type === 'I' && !b.underConstruction) {
          const pol = Math.round((22 + b.level * 7) * (this.policies.greenCity ? 0.55 : 1.0));
          this.addRadialField(x, z, 6, -Math.round(pol * 0.55), pol, 0, 0, 0, 0);
        }
      }
    }

    if (this.policies.greenCity) {
      for (let i = 0; i < N; i++) this.grid[i].landValue = Math.min(100, this.grid[i].landValue + 7);
    }

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      t.pollution = Math.max(0, Math.min(100, t.pollution));
      t.serviceScore = Math.max(0, Math.min(100, t.serviceScore));
      t.fireSafety = Math.max(0, Math.min(100, t.fireSafety));
      t.education = Math.max(0, Math.min(100, t.education || 0));
      t.crimeSafety = Math.max(0, Math.min(100, t.crimeSafety || 0));
      t.landValue = Math.max(5, Math.min(100, t.landValue - t.pollution * 0.45));
    }

    // Underground Water Pipe BFS + 4-Tile Coverage
    this.waterSupply = Math.round(totalWaterOut);
    this.sewageSupply = Math.round(totalSewageCap);
    this.waterPollutedPct = totalWaterOut > 0 ? Math.round((pollutedWaterIntake / totalWaterOut) * 100) : 0;

    if (waterNodes.length > 0 && totalWaterOut > 0) {
      const pipeVis = new Uint8Array(N);
      const q = [];
      for (const wn of waterNodes) {
        const wi = idx(wn.x, wn.z);
        if (!this.grid[wi].pipeBroken) {
          pipeVis[wi] = 1;
          q.push(wi);
        }
      }

      let head = 0;
      const dirs8 = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      while (head < q.length) {
        const ci = q[head++];
        const cx = ci % GRID_SIZE;
        const cz = (ci / GRID_SIZE) | 0;
        for (const [dx, dz] of dirs8) {
          const nx = cx + dx, nz = cz + dz;
          if (!inBounds(nx, nz)) continue;
          const ni = idx(nx, nz);
          if (pipeVis[ni]) continue;
          const nt = this.grid[ni];
          if (nt.pipe && !nt.pipeBroken) {
            pipeVis[ni] = 1;
            q.push(ni);
          }
        }
      }

      let wUsed = 0;
      const covered = new Uint8Array(N);
      for (let i = 0; i < q.length; i++) {
        const pi = q[i];
        const px = pi % GRID_SIZE;
        const pz = (pi / GRID_SIZE) | 0;
        for (let dz = -4; dz <= 4; dz++) {
          for (let dx = -4; dx <= 4; dx++) {
            if (dx * dx + dz * dz > 18) continue;
            const nx = px + dx, nz = pz + dz;
            if (!inBounds(nx, nz)) continue;
            covered[idx(nx, nz)] = 1;
          }
        }
      }

      for (let i = 0; i < N; i++) {
        if (!covered[i]) continue;
        const t = this.grid[i];
        const need = this.getBuildingStats(t.building).water || 0;
        if (wUsed + need <= totalWaterOut) {
          t.watered = true;
          wUsed += need;
        } else if (need === 0) {
          t.watered = true;
        }
      }
    }

    // Aggregate City Totals & Active Hubs/Wonders
    let totalPDemand = 0;
    let totalWDemand = 0;
    let pop = 0;
    let jobs = 0;
    let happySum = 0;
    let resCount = 0;
    let sickCount = 0;
    let abandoned = 0;
    let hasSeaport = false;
    let hasAirport = false;
    let hasAmusementPark = false;
    let hasStadium = false;

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b) continue;
      if (b.abandoned) {
        b.trashPiled = false;
        b.sewageBackedUp = false;
        abandoned++;
        continue;
      }
      const st = this.getBuildingStats(b);
      totalPDemand += st.power;
      totalWDemand += st.water;

      const active = t.powered && t.watered && !b.flooded && !(b.fire > 0.3);
      pop += active ? st.pop : Math.round(st.pop * 0.25);
      jobs += active ? st.jobs : Math.round(st.jobs * 0.25);

      if (!b.underConstruction && t.powered && !b.flooded && !(b.fire > 0.3)) {
        if (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found) hasSeaport = true;
        else if (b.type === 'airport') hasAirport = true;
        else if (b.type === 'amusement_park') hasAmusementPark = true;
        else if (b.type === 'stadium') hasStadium = true;
      }
    }

    this.hasSeaport = hasSeaport;
    this.hasAirport = hasAirport;
    this.hasAmusementPark = hasAmusementPark;
    this.hasStadium = hasStadium;

    this.powerDemand = Math.ceil(totalPDemand);
    this.waterDemand = Math.ceil(totalWDemand);
    this.sewageDemand = this.waterDemand;

    // Sanitation, Sewage Backup & Waste-to-Energy balance
    this.trashSupply = Math.round(totalTrashCap);
    this.trashDemand = Math.ceil(pop * 0.42 + jobs * 0.30);
    const trashCrisis = pop >= 380 && this.trashDemand > this.trashSupply * 1.15;
    const trashOverload = trashCrisis
      ? Math.min(1, (this.trashDemand - this.trashSupply) / Math.max(200, this.trashDemand))
      : 0;

    const sewageCrisis = pop >= 120 && this.waterDemand > this.sewageSupply * 1.15;
    const sewageOverload = sewageCrisis
      ? Math.min(1, (this.waterDemand - this.sewageSupply) / Math.max(120, this.waterDemand))
      : 0;

    const wonderHappyBoost =
      (hasAmusementPark ? 4 : 0) +
      (hasStadium ? 3 : 0) +
      (this.matchDayBoostTimer > 0 ? 8 : 0);

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b || b.abandoned) continue;

      if (trashCrisis && BUILDING_NAMES[b.type] && !b.underConstruction) {
        const hVal = hash2D(t.x, t.z, 313);
        b.trashPiled = hVal < Math.min(0.95, 0.38 + trashOverload * 0.72);
        if (b.trashPiled) {
          t.landValue = Math.max(5, t.landValue - 15);
        }
      } else if ((b.gridlockTrashTicks || 0) > 0) {
        b.trashPiled = true;
        t.landValue = Math.max(5, t.landValue - 12);
      } else {
        b.trashPiled = false;
      }

      if (sewageCrisis && t.watered && BUILDING_NAMES[b.type] && !b.underConstruction) {
        const sVal = hash2D(t.x, t.z, 619);
        b.sewageBackedUp = sVal < Math.min(0.95, 0.40 + sewageOverload * 0.72);
        if (b.sewageBackedUp) {
          t.landValue = Math.max(5, t.landValue - 14);
        }
      } else {
        b.sewageBackedUp = false;
      }

      const st = this.getBuildingStats(b);
      const pollutedHome = (b.type === 'RL' || b.type === 'RH') && t.pollution > 28;
      b.sick = (
        (t.watered && this.waterPollutedPct >= 10) ||
        pollutedHome ||
        b.sewageBackedUp
      ) && (b.type === 'RL' || b.type === 'RH');
      if (b.sick) sickCount += Math.round(st.pop * 0.45);
      else if (b.trashPiled && (b.type === 'RL' || b.type === 'RH')) sickCount += Math.round(st.pop * 0.20);

      if ((b.type === 'RL' || b.type === 'RH') && !b.underConstruction) {
        let h = 56 + t.landValue * 0.26 + t.serviceScore * 0.25 - t.pollution * 0.65 - (this.taxRate - 9) * 3.8 + wonderHappyBoost;
        if (!t.powered) h -= 32;
        if (!t.watered) h -= 32;
        if (b.sick) h -= 38;
        if (b.sewageBackedUp) h -= 22;
        if (b.trashPiled) h -= 24;
        if (b.flooded) h -= 35;
        if (totalWDemand > totalSewageCap + 50) h -= 18;
        if (pop > 250 && t.crimeSafety < 15) h -= 16;
        happySum += Math.max(5, Math.min(100, h));
        resCount++;
      }
    }

    this.population = pop;
    if (pop > this.maxPopReached) this.maxPopReached = pop;
    this.jobsTotal = jobs;
    this.sickCitizens = sickCount;
    this.abandonedCount = abandoned;
    this.happiness = resCount > 0 ? Math.round(happySum / resCount) : 75;

    const workforce = Math.round(pop * 0.58);
    this.unemploymentPct = workforce > 0 ? Math.max(0, Math.round(((workforce - jobs) / workforce) * 100)) : 0;

    // Strict RCI Demand sensitive to Taxes, Unemployment, Goods & Happiness!
    const taxPenalty = this.taxRate > 11 ? (this.taxRate - 11) * 0.14 : (9 - this.taxRate) * 0.04;
    const workerNeed = (jobs - workforce + 35) / Math.max(100, workforce + 60);
    const cJobs = this.countZoneJobs(['CL', 'CH']);
    const indJobs = this.countZoneJobs(['I']);
    const ioJobs = indJobs + this.countZoneJobs(['O']);

    // Commercial needs BOTH population shoppers AND industrial goods supply!
    const shopperGap = (pop * 0.35 + 20 - cJobs) / Math.max(80, pop * 0.4 + 50);
    const indGap = (workforce * 0.52 + 25 - ioJobs) / Math.max(80, workforce * 0.5 + 50);

    this.demand.R = Math.max(0.0, Math.min(1.0, 0.45 + workerNeed * 0.65 + taxPenalty + (this.happiness - 65) * 0.008));
    this.demand.C = Math.max(0.0, Math.min(1.0, 0.35 + shopperGap * 0.68 + taxPenalty + landmarkBonus));
    this.demand.I = Math.max(0.0, Math.min(1.0, 0.40 + indGap * 0.68 + taxPenalty + (this.policies.techBoost ? 0.10 : 0)));

    while (
      this.milestoneIdx + 1 < MILESTONES.length &&
      this.population >= MILESTONES[this.milestoneIdx + 1].pop
    ) {
      this.milestoneIdx++;
    }

    if (!this._suppressPromotions) {
      this.checkLevelPromotion();
    }
  }

  countZoneJobs(types) {
    let sum = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const b = this.grid[i].building;
      if (b && !b.abandoned && types.includes(b.type) && !b.underConstruction) {
        sum += this.getBuildingStats(b).jobs;
      }
    }
    return sum;
  }

  propagateServiceAlongRoads(startRx, startRz, maxSteps, dLandVal, dService, dFire, dEdu, dCrime) {
    if (!inBounds(startRx, startRz) || maxSteps <= 0) return;
    const N = this.grid.length;
    if (!this._svcDistG || this._svcDistG.length !== N) {
      this._svcDistG = new Float32Array(N);
      this._svcDistE = new Float32Array(N);
      this._svcBestFalloff = new Float32Array(N);
    }
    const distG = this._svcDistG;
    const distE = this._svcDistE;
    const bestFalloff = this._svcBestFalloff;
    distG.fill(1e9);
    distE.fill(1e9);

    const startIdx = idx(startRx, startRz);
    const startTile = this.grid[startIdx];
    if (!startTile || (startTile.roadGround <= 0 && startTile.roadElevated <= 0)) return;

    const q = [];
    const reachedGround = [];
    if (startTile.roadGround > 0) {
      distG[startIdx] = 0;
      q.push(startIdx * 2);
      reachedGround.push(startIdx);
    } else if (startTile.roadElevated > 0) {
      distE[startIdx] = 0;
      q.push(startIdx * 2 + 1);
    }

    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let head = 0;
    while (head < q.length) {
      const code = q[head++];
      const ci = code >> 1;
      const layer = code & 1;
      const curD = layer === 0 ? distG[ci] : distE[ci];
      if (curD > maxSteps) continue;
      const ct = this.grid[ci];

      if (ct.ramp) {
        const rampD = curD + 0.35;
        if (layer === 0 && ct.roadElevated > 0 && rampD <= maxSteps && rampD < distE[ci] - 0.01) {
          distE[ci] = rampD;
          q.push(ci * 2 + 1);
        } else if (layer === 1 && ct.roadGround > 0 && rampD <= maxSteps && rampD < distG[ci] - 0.01) {
          if (distG[ci] >= 1e8) reachedGround.push(ci);
          distG[ci] = rampD;
          q.push(ci * 2);
        }
      }

      for (const [dx, dz] of dirs4) {
        const nx = ct.x + dx, nz = ct.z + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        const nt = this.grid[ni];
        if (layer === 0) {
          if (nt.roadGround > 0) {
            const stepCost = 1.0 + (nt.congestion || 0) * 1.3;
            const nd = curD + stepCost;
            if (nd <= maxSteps && nd < distG[ni] - 0.01) {
              if (distG[ni] >= 1e8) reachedGround.push(ni);
              distG[ni] = nd;
              q.push(ni * 2);
            }
          }
        } else if (nt.roadElevated > 0) {
          const stepCost = 0.9 + (nt.congestion || 0) * 1.1;
          const nd = curD + stepCost;
          if (nd <= maxSteps && nd < distE[ni] - 0.01) {
            distE[ni] = nd;
            q.push(ni * 2 + 1);
          }
        }
      }
    }

    const touchedTargets = [];
    const denom = maxSteps + 3;

    for (let k = 0; k < reachedGround.length; k++) {
      const ri = reachedGround[k];
      const rDist = distG[ri];
      if (rDist > maxSteps) continue;
      const rx = ri % GRID_SIZE;
      const rz = (ri / GRID_SIZE) | 0;

      for (let dz = -3; dz <= 3; dz++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d2 = dx * dx + dz * dz;
          if (d2 > 10) continue;
          const tx = rx + dx, tz = rz + dz;
          if (!inBounds(tx, tz)) continue;

          // Prevent curbside service jump across unbridged rivers/creeks!
          const steps = Math.max(Math.abs(dx), Math.abs(dz));
          if (steps >= 2) {
            let waterBlocked = false;
            for (let s = 1; s < steps; s++) {
              const mx = rx + Math.round((dx * s) / steps);
              const mz = rz + Math.round((dz * s) / steps);
              if (this.isWaterTile(mx, mz) && !this.grid[idx(mx, mz)].roadBridge) {
                waterBlocked = true;
                break;
              }
            }
            if (waterBlocked) continue;
          }

          const totDist = rDist + Math.sqrt(d2);
          const falloff = 1 - totDist / denom;
          if (falloff <= 0) continue;

          const ti = idx(tx, tz);
          if (bestFalloff[ti] === 0) touchedTargets.push(ti);
          if (falloff > bestFalloff[ti]) bestFalloff[ti] = falloff;
        }
      }
    }

    for (let k = 0; k < touchedTargets.length; k++) {
      const ti = touchedTargets[k];
      const f = bestFalloff[ti];
      bestFalloff[ti] = 0;
      const t = this.grid[ti];
      t.landValue += dLandVal * f;
      t.serviceScore += dService * f;
      t.fireSafety += dFire * f;
      t.education = (t.education || 0) + dEdu * f;
      t.crimeSafety = (t.crimeSafety || 0) + dCrime * f;
    }
  }

  addRadialField(cx, cz, radius, dLandVal, dPollution, dService, dFire, dEdu, dCrime) {
    if (radius <= 0) return;
    const r2 = radius * radius;
    const minX = Math.max(0, cx - radius);
    const maxX = Math.min(GRID_SIZE - 1, cx + radius);
    const minZ = Math.max(0, cz - radius);
    const maxZ = Math.min(GRID_SIZE - 1, cz + radius);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const d2 = (x - cx) * (x - cx) + (z - cz) * (z - cz);
        if (d2 > r2) continue;
        const falloff = 1 - Math.sqrt(d2) / (radius + 0.5);
        const t = this.grid[idx(x, z)];
        t.landValue += dLandVal * falloff;
        t.pollution += dPollution * falloff;
        t.serviceScore += dService * falloff;
        t.fireSafety += dFire * falloff;
        t.education = (t.education || 0) + dEdu * falloff;
        t.crimeSafety = (t.crimeSafety || 0) + dCrime * falloff;
      }
    }
  }

  stepWaterFacilities() {
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        const b = t.building;
        if (!b || b.abandoned || b.underConstruction || !t.powered) continue;
        if (b.type === 'sewage_out' || b.type === 'water_treat') {
          const pollAdd = b.type === 'sewage_out' ? 0.26 : 0.02;
          const pollCap = b.type === 'sewage_out' ? 1.0 : 0.18;
          for (let dz = -2; dz <= 2; dz++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx, nz = z + dz;
              if (!inBounds(nx, nz)) continue;
              const ni = idx(nx, nz);
              if (this.waterDepth[ni] > 0.08) {
                this.waterDepth[ni] = Math.min(3.5, this.waterDepth[ni] + 0.015);
                if (this.waterPoll[ni] < pollCap) {
                  this.waterPoll[ni] = Math.min(pollCap, this.waterPoll[ni] + pollAdd);
                }
                dz = 9; break;
              }
            }
          }
        }
      }
    }
  }

  update(dt) {
    for (let i = this.recentUpgrades.length - 1; i >= 0; i--) {
      this.recentUpgrades[i].ttl -= dt;
      if (this.recentUpgrades[i].ttl <= 0) this.recentUpgrades.splice(i, 1);
    }

    if (this.speed === 0) return;
    const simDt = dt * this.speed;

    // 5x Calmer, Majestic Day-Night Cycle (~7.5 minutes per full day-night cycle at 1x!)
    if (this.timeMode === 'cycle') {
      this.dayProgress += simDt * 0.0022;
      if (this.dayProgress >= 1) this.dayProgress -= 1;
    } else if (this.timeMode === 'day') this.dayProgress = 0.42;
    else if (this.timeMode === 'sunset') this.dayProgress = 0.755;
    else if (this.timeMode === 'night') this.dayProgress = 0.02;

    // Calendar advances smoothly (1 calendar day every 4.5s at 1x)
    this.dateAccum += simDt;
    if (this.dateAccum >= 4.5) {
      this.dateAccum -= 4.5;
      this.day++;
      if (this.day > 30) {
        this.day = 1;
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
        }
      }
    }

    // Real-time Shallow Water Physics
    if (this.waterPhysics) {
      this.waterAccum += Math.min(0.10, dt * Math.min(2.2, 0.65 + this.speed * 0.35));
      while (this.waterAccum >= 0.05) {
        this.waterAccum -= 0.05;
        this.stepWaterFacilities();
        this.waterPhysics.step();
      }
    }

    // Slower, realistic construction crane buildup (~6-7s per building at 1x)
    let finishedCount = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const b = this.grid[i].building;
      if (b && b.underConstruction) {
        b.buildProgress += simDt * 0.15;
        if (b.buildProgress >= 1) {
          b.buildProgress = 1;
          b.underConstruction = false;
          finishedCount++;
        }
      }
    }
    if (finishedCount > 0) {
      this.recomputeNetworksAndFields();
      this.addXP(finishedCount * 12, '新建筑落成');
      this.checkMayorQuests();
      this.buildingDirty = true;
    }

    // City growth & Distress/Abandonment check every 2.2s sim time
    this.simAccum += simDt;
    if (this.simAccum >= 2.2) {
      this.simAccum = 0;
      this.stepCityGrowthAndAbandonment();
      this.recomputeNetworksAndFields();
      this.checkMayorQuests();
    }

    // Fiscal Budget & Loan Tick every 6.0s sim time
    this.econAccum += simDt;
    if (this.econAccum >= 6.0) {
      this.econAccum = 0;
      this.stepEconomy();
    }

    // Olympic Stadium Match Day (~45s sim time when powered)
    if (this.matchDayBoostTimer > 0) {
      this.matchDayBoostTimer = Math.max(0, this.matchDayBoostTimer - simDt);
    }
    if (this.hasStadium) {
      this.stadiumTimer += simDt;
      if (this.stadiumTimer >= 45.0) {
        this.stadiumTimer = 0;
        this.matchDayBoostTimer = 18.0;
        const events = ['山河超级杯足球决赛', '世界巡回巨星演唱会', '奥林匹克田径钻石赛', '全明星冠军德比之夜'];
        const evName = events[(this.day + this.month) % events.length];
        const ticketBonus = 1200;
        this.money += ticketBonus;
        if (this.sfx && this.sfx.milestone) this.sfx.milestone();
        this.latestChirp = {
          user: '@奥体中心快讯',
          text: `🏟️ 【${evName}】盛大举行！发放门票分红 +¥${ticketBonus.toLocaleString()}，全城幸福感飙升！`,
          mood: 'good'
        };
        this.recomputeNetworksAndFields();
      }
    }

    // Citizen Chirper dynamic live feed (~9.0s sim time)
    this.chirpTimer += simDt;
    if (this.chirpTimer >= 9.0) {
      this.chirpTimer = 0;
      this.stepChirper();
    }
  }

  stepChirper() {
    const urgent = [];
    const positive = [];

    let congestedTiles = 0;
    let hasDam = this.hydroPowerMW > 20;
    let hasHSR = false;
    let metroStations = 0;
    let hasNuclear = false;
    let hasSolar = false;
    let hasSkyscraper = false;

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround > 0 && t.congestion > 0.68) congestedTiles++;
      if (t.dam) hasDam = true;
      const b = t.building;
      if (!b || b.abandoned || b.underConstruction) continue;
      if (b.type === 'hsr_station' && t.powered) hasHSR = true;
      else if (b.type === 'metro_station' && t.powered) metroStations++;
      else if (b.type === 'nuclear_plant' && t.powered && this.hasNearbyWater(t.x, t.z, 2).found) hasNuclear = true;
      else if (b.type === 'solar_plant' && t.powered) hasSolar = true;
      else if (b.type === 'landmark' || ((b.type === 'CH' || b.type === 'RH' || b.type === 'O') && b.level >= 4)) {
        hasSkyscraper = true;
      }
    }

    // 1. Live Urgent City Complaints
    if (this.waterPollutedPct >= 10 || this.sickCitizens > 35) {
      urgent.push({
        user: '@宝妈林女士',
        text: '救命啊！家里水龙头流出来的全是发臭的褐色污水🤢！是不是抽水站建在排污口下游了？！',
        mood: 'bad'
      });
    }
    if (this.population >= 380 && this.trashDemand > this.trashSupply * 1.15) {
      urgent.push({
        user: '@便利店老王',
        text: `街角垃圾桶堆成小山臭气熏天🪰！全市垃圾产出 ${this.trashDemand} 吨却处理不过来，快建【环保垃圾焚烧厂】吧！`,
        mood: 'bad'
      });
    }
    if (this.powerDemand > this.powerSupply && this.population > 40) {
      urgent.push({
        user: '@程序员阿杰',
        text: `写字楼又停电跳闸了⚡（缺口 ${this.powerDemand - this.powerSupply} MW）！求市长快建电站或架设高压输电塔！`,
        mood: 'bad'
      });
    }
    if (this.waterDemand > this.waterSupply && this.population > 40) {
      urgent.push({
        user: '@住户周阿姨',
        text: '做饭做一半停水啦🚿！地下输水管和抽水站供水量跟不上新区发展了！',
        mood: 'warn'
      });
    }
    if (this.population >= 120 && this.waterDemand > this.sewageSupply * 1.15) {
      urgent.push({
        user: '@一楼住户老孙',
        text: `救命！全市下水道彻底爆满（污水 ${this.waterDemand} > 排污 ${this.sewageSupply}），地漏往外冒脏水了🚱！快建【排污口】或【生态净水中心】！`,
        mood: 'bad'
      });
    }
    if (this.taxRate >= 12) {
      urgent.push({
        user: '@创业者老赵',
        text: `税率高达 ${this.taxRate}% 实在喘不过气💸！再不降税我们公司只能搬离这座城市了！`,
        mood: 'warn'
      });
    }
    if (congestedTiles >= 6) {
      urgent.push({
        user: '@出租车刘师傅',
        text: '主干道十字路口堵成停车场啦🚗💢！建议架设二层【高架快速路】或开通【地下地铁】分流！',
        mood: 'warn'
      });
    }
    if (this.abandonedCount >= 4) {
      urgent.push({
        user: '@房产中介小吴',
        text: `附近有 ${this.abandonedCount} 栋废弃荒楼🏚️严重拉低片区房价，期盼市政推土机清理重建！`,
        mood: 'warn'
      });
    }

    // 2. Live City Praise & Landmarks
    if (hasDam) {
      positive.push({
        user: '@风光摄影师老韩',
        text: `西北峡谷的【水力发电大坝】太壮观了🏗️！高峡出平湖，澎湃清洁水电点亮全城！`,
        mood: 'good'
      });
    }
    if (hasHSR) {
      positive.push({
        user: '@商务旅客陆总',
        text: '刚乘复兴号高速列车跨过特大桥抵达中央车站🚄，山河大都会的立体交通太震撼了！',
        mood: 'good'
      });
    }
    if (this.hasAirport) {
      positive.push({
        user: '@环球旅行家Mia',
        text: '在【国际民航机场】看着宽体大客机呼啸冲上云霄✈️，全球商务客与游客络绎不绝！',
        mood: 'good'
      });
    }
    if (this.hasSeaport) {
      positive.push({
        user: '@远洋船长老郑',
        text: '万吨集装箱巨轮稳稳靠泊东南海湾【深水海港】🚢，本地智造商品正源源不断出口海外！',
        mood: 'good'
      });
    }
    if (this.hasAmusementPark) {
      const isNight = this.dayProgress < 0.22 || this.dayProgress > 0.72;
      positive.push({
        user: '@情侣小鹿',
        text: isNight
          ? '夜晚的【滨海摩天轮乐园】霓虹璀璨太浪漫啦🎡✨！升到最高点俯瞰全城万家灯火美哭了！'
          : '周末来【滨海摩天轮乐园】打卡巨型摩天轮🎡，海风拂面欢声笑语，幸福感拉满！',
        mood: 'good'
      });
    }
    if (this.hasStadium) {
      positive.push({
        user: '@体育解说大鹏',
        text: '【奥林匹克体育中心】圣火辉映🏟️！每逢比赛日全城沸腾，文体商业一片繁荣！',
        mood: 'good'
      });
    }
    if (hasNuclear) {
      positive.push({
        user: '@核能工程师林博',
        text: '岸畔【核裂变发电站】安全满发☢️，+1,650 MW 零碳清洁基荷电力让工业与CBD火力全开！',
        mood: 'good'
      });
    }
    if (hasSolar) {
      positive.push({
        user: '@科普博主阿星',
        text: '【塔式熔盐光热电站】定日镜阵璀璨夺目☀️，连夜晚都能靠熔盐储热持续清洁供电！',
        mood: 'good'
      });
    }
    if (metroStations >= 2) {
      positive.push({
        user: '@通勤白领小苏',
        text: '地下地铁环线准点又凉快🚇！再也不用挤早高峰红绿灯，出站就是写字楼！',
        mood: 'good'
      });
    }
    if (hasSkyscraper) {
      positive.push({
        user: '@天际线迷小陈',
        text: '仰望CBD六十层玻璃幕墙摩天群与88层星海金融塔🌟，这城市天际线简直是世界级奇观！',
        mood: 'good'
      });
    }

    positive.push({
      user: '@市民小张',
      text: `咱们${this.cityName}已有 ${this.population.toLocaleString()} 位居民安居乐业🏡，市民幸福度 ${this.happiness}%！`,
      mood: this.happiness >= 75 ? 'good' : 'info'
    });

    const pool = (urgent.length > 0 && Math.random() < 0.72) ? urgent : positive;
    const filtered = pool.length > 1 ? pool.filter((c) => c.text !== this.latestChirp?.text) : pool;
    this.latestChirp = filtered[(Math.random() * filtered.length) | 0] || pool[0];
  }

  stepCityGrowthAndAbandonment() {
    let changed = false;
    const demandMap = {
      RL: this.demand.R,
      RH: this.demand.R,
      CL: this.demand.C,
      CH: this.demand.C,
      I: this.demand.I,
      O: this.demand.I
    };

    // 1. Spawn at most 1-2 buildings per tick so growth feels deliberate & organic
    const candidates = { RL: [], RH: [], CL: [], CH: [], I: [], O: [] };
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (t.zone && !t.building && !this.isWaterTile(x, z)) {
          const acc = this.findRoadAccess(x, z);
          if (acc && acc.roadTile?.outsideConnected === true) {
            candidates[t.zone].push({ t, acc });
          }
        }
      }
    }

    for (const zType of Object.keys(candidates)) {
      const list = candidates[zType];
      const dem = demandMap[zType] || 0;
      if (list.length === 0 || dem < 0.18) continue;
      // Office (O) won't even spawn if education is zero!
      if (zType === 'O' && Math.random() < 0.7) {
        const sample = list[0].t;
        if ((sample.education || 0) < 15) continue;
      }
      if (Math.random() > dem) continue;
      const pick = list[(Math.random() * list.length) | 0];
      pick.t.building = {
        type: zType,
        level: 1,
        variant: Math.floor(hash2D(pick.t.x, pick.t.z, this.seed + this.day) * 8),
        rot: pick.acc.rot,
        underConstruction: true,
        buildProgress: 0.04,
        upgradeProgress: 0,
        fire: 0,
        sick: false,
        trashPiled: false,
        flooded: false,
        abandoned: false,
        distress: 0,
        abandonReason: ''
      };
      changed = true;
    }

    // Check city-wide labor shortage ratio & goods supply (Seaport container freight supplements local industry!)
    const workforce = Math.round(this.population * 0.58);
    const severeLaborShortage = this.jobsTotal > 80 && workforce < this.jobsTotal * 0.45;
    const indJobs = this.countZoneJobs(['I']) + (this.hasSeaport ? 900 : 0);
    const comJobs = this.countZoneJobs(['CL', 'CH']);
    const severeGoodsShortage = comJobs > 90 && indJobs < comJobs * 0.25;
    const trashCrisisNow = this.population >= 380 && this.trashDemand > this.trashSupply * 1.15;

    // 2. Check Distress -> Abandonment (Punishes careless planning!) & Earned Upgrades
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      const b = t.building;
      if (!b || b.underConstruction || !BUILDING_NAMES[b.type]) continue;

      // Occasional auto-redevelopment of abandoned buildings ONLY if all problems are solved & high demand
      if (b.abandoned) {
        const acc = this.findRoadAccess(t.x, t.z);
        if (acc && acc.roadTile?.outsideConnected && t.powered && t.watered && !trashCrisisNow && !b.sewageBackedUp && t.pollution < 20 && this.taxRate <= 10 && (demandMap[b.type] || 0) > 0.72 && Math.random() < 0.04) {
          b.abandoned = false;
          b.trashPiled = false;
          b.sewageBackedUp = false;
          b.level = 1;
          b.distress = 0;
          b.underConstruction = true;
          b.buildProgress = 0.1;
          changed = true;
        }
        continue;
      }

      const acc = this.findRoadAccess(t.x, t.z);
      const roadCong = acc?.roadTile?.congestion || 0;
      if ((b.gridlockTrashTicks || 0) > 0 && roadCong < 0.55) {
        b.gridlockTrashTicks = Math.max(0, b.gridlockTrashTicks - 1);
      }

      // Evaluate urban planning failures!
      let problem = '';
      if (!acc) problem = '道路被切断';
      else if ((b.type === 'CL' || b.type === 'CH' || b.type === 'I') && acc.roadTile && !acc.roadTile.outsideConnected) problem = '与城际高速/港站道路断联';
      else if (!t.powered) problem = '长期断电';
      else if (!t.watered) problem = '未铺设地下输水管';
      else if (b.flooded) problem = '洪水淹没';
      else if (b.sewageBackedUp) problem = '排污管网超载导致污水倒灌';
      else if (b.sick) problem = '饮用污水或工业毒气致病';
      else if (b.trashPiled && Math.random() < 0.75) problem = '垃圾围城无人清运';
      else if ((b.type === 'RL' || b.type === 'RH') && t.pollution > 32) problem = '紧邻重污染源居民逃离';
      else if (this.taxRate >= 14) problem = '苛捐杂税过高企业市民撤离';
      else if (roadCong > 0.78 && (b.type === 'CL' || b.type === 'CH' || b.type === 'I')) problem = '道路严重瘫痪导致断货倒闭';
      else if (severeLaborShortage && (b.type === 'I' || b.type === 'CL' || b.type === 'CH') && Math.random() < 0.45) problem = '住宅人口不足引发严重用工荒';
      else if (severeGoodsShortage && (b.type === 'CL' || b.type === 'CH') && Math.random() < 0.35) problem = '缺乏工业区供货导致商场断货';
      else if (b.type === 'O' && (t.education || 0) < 18) problem = '缺乏大学高学历人才写字楼空置';

      if (problem && this.difficulty !== 'sandbox') {
        b.distress = (b.distress || 0) + 1;
        b.abandonReason = problem;
        if (b.distress >= 7) {
          b.abandoned = true;
          b.upgradeProgress = 0;
          changed = true;
          this.latestChirp = {
            user: '@城建监察播报',
            text: `🏚️ 警报：(${t.x},${t.z}) 建筑因【${problem}】已荒废！可点击顶部「🔔 问题」一键跳转定位处理`,
            mood: 'bad'
          };
        }
        continue;
      } else {
        b.distress = Math.max(0, (b.distress || 0) - 1);
        b.abandonReason = '';
      }

      // Earned Upgrades (Much stricter requirements for high-rise skyscrapers!)
      const maxLv = this.getMaxLevelForZone(b.type);
      if (b.level >= maxLv) continue;

      b.rot = acc.rot;
      // High-density Lv.3+ requires Education + Healthcare/Service + Low Congestion!
      if ((b.type === 'RH' || b.type === 'CH' || b.type === 'O') && b.level >= 2 && (t.education || 0) < 20) continue;

      const aveBonus = acc.roadType >= 2 ? 10 : 0;
      const eduBonus = (t.education || 0) * 0.22;
      const score = (b.type === 'I')
        ? 18 + t.serviceScore * 0.65 + eduBonus + aveBonus - roadCong * 28
        : t.landValue * 0.62 + t.serviceScore * 0.48 + eduBonus + aveBonus - t.pollution * 0.55 - roadCong * 25;

      const thresholds = [0, 28, 46, 64, 80];
      const needed = thresholds[b.level] || 78;
      const dem = demandMap[b.type] || 0.25;

      if (score >= needed && dem > 0.22) {
        // Authentic multi-year skyscraper progression (~2x slower steady pace)
        b.upgradeProgress = (b.upgradeProgress || 0) + 3.2 + (score - needed) * 0.12;
        if (b.upgradeProgress >= 100) {
          b.level++;
          b.upgradeProgress = 0;
          this.recentUpgrades.push({ x: t.x, z: t.z, ttl: 1.5 });
          if (this.sfx && typeof this.sfx.upgrade === 'function') this.sfx.upgrade();
          this.addXP(18 * b.level, '楼宇升级');
          changed = true;
        }
      }
    }

    // Periodic healthy governance XP tick
    if (this.population > 30 && this.happiness >= 65) {
      this.addXP(Math.min(45, Math.floor(5 + this.population * 0.015)), '良政执政');
    }

    if (changed) this.buildingDirty = true;
  }

  stepEconomy() {
    let infraUpkeep = 0;
    let pwrUpkeep = 0;
    let wtrUpkeep = 0;
    let svcUpkeep = 0;
    let grossTax = 0;

    const workforce = Math.round(this.population * 0.58);
    // Labor efficiency: if you over-zone C/I without enough R workers, factories & shops run half-empty!
    const laborEff = this.jobsTotal > 0 ? Math.min(1.0, (workforce + 25) / this.jobsTotal) : 1.0;
    const seaportTradeMult = this.hasSeaport ? 1.12 : 1.0;
    const airportTradeMult = this.hasAirport ? 1.15 : 1.0;

    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.roadGround === 1) infraUpkeep += CATALOG.road_1.upkeep;
      else if (t.roadGround === 2) infraUpkeep += CATALOG.road_2.upkeep;
      else if (t.roadGround === 4) infraUpkeep += CATALOG.road_tunnel.upkeep;
      if (t.roadElevated > 0) infraUpkeep += CATALOG.road_elev.upkeep;
      if (t.ramp) infraUpkeep += CATALOG.road_ramp.upkeep;
      if (t.rail === 1) infraUpkeep += CATALOG.rail_track.upkeep;
      if (t.metro) infraUpkeep += CATALOG.metro_line.upkeep;
      if (t.pipe) infraUpkeep += CATALOG.water_pipe.upkeep;
      if (t.pylon) infraUpkeep += CATALOG.power_pylon.upkeep;
      if (t.dam) pwrUpkeep += CATALOG.hydro_dam.upkeep * 0.35;

      const b = t.building;
      if (!b || b.underConstruction || b.abandoned) continue;

      const u = CATALOG[b.type]?.upkeep || 0;
      if (b.type === 'power_wind' || b.type === 'power_plant' || b.type === 'solar_plant' || b.type === 'nuclear_plant') pwrUpkeep += u;
      else if (b.type === 'water_pump' || b.type === 'sewage_out' || b.type === 'water_treat') wtrUpkeep += u;
      else if (u > 0) svcUpkeep += u;

      if (!t.powered || !t.watered || b.flooded || b.fire > 0.2) continue;

      const acc = this.findRoadAccess(t.x, t.z);
      const congPenalty = acc?.roadTile ? Math.max(0.35, 1 - acc.roadTile.congestion * 0.75) : 0.3;
      const sickPenalty = b.sick ? 0.35 : (b.trashPiled ? 0.75 : 1.0);

      if (b.type === 'RL') grossTax += (2.4 + b.level * 2.8) * sickPenalty;
      else if (b.type === 'RH') grossTax += (5.8 + b.level * 6.5) * sickPenalty;
      else if (b.type === 'CL') grossTax += (3.2 + b.level * 3.6) * laborEff * congPenalty * seaportTradeMult * airportTradeMult;
      else if (b.type === 'CH') grossTax += (7.5 + b.level * 8.2) * laborEff * congPenalty * seaportTradeMult * airportTradeMult;
      else if (b.type === 'I')  grossTax += (3.8 + b.level * 4.2) * laborEff * congPenalty * seaportTradeMult;
      else if (b.type === 'O')  grossTax += (6.5 + b.level * 7.2) * laborEff * airportTradeMult;
      else if (b.type === 'landmark') grossTax += 85;
      else if (b.type === 'hsr_station') grossTax += 58;
      else if (b.type === 'airport') grossTax += 95;
      else if (b.type === 'seaport' && this.hasNearbyWater(t.x, t.z, 2).found) grossTax += 65;
      else if (b.type === 'stadium') grossTax += 55;
      else if (b.type === 'amusement_park') grossTax += 48;
    }

    // Department budget scaling
    const totalDeptUpkeep =
      infraUpkeep +
      pwrUpkeep * (this.budgets.power / 100) +
      wtrUpkeep * (this.budgets.water / 100) +
      svcUpkeep * (this.budgets.service / 100);

    let policyCost = 0;
    if (this.policies.freeTransit) policyCost += 25 + this.population * 0.018;
    if (this.policies.greenCity) policyCost += 20 + this.population * 0.014;
    if (this.policies.techBoost) policyCost += 28 + this.jobsTotal * 0.018;

    // Loan repayments
    let loanPay = 0;
    for (let i = this.activeLoans.length - 1; i >= 0; i--) {
      const ln = this.activeLoans[i];
      const pay = Math.min(ln.remaining, ln.periodPay);
      ln.remaining -= pay;
      loanPay += pay;
      if (ln.remaining <= 0) {
        this.latestChirp = {
          user: '@市政财政局',
          text: `🎉 债券【${ln.name}】已全额结清，财政利息负担解除！`,
          mood: 'good'
        };
        this.activeLoans.splice(i, 1);
      }
    }

    const diffTaxMult = this.difficulty === 'hardcore' ? 1.04 : 1.32;
    const boost = this.policies.techBoost ? 1.15 : 1.0;
    const taxIncome = Math.round(grossTax * (this.taxRate / 9) * diffTaxMult * boost);
    const totalUpkeep = Math.round(totalDeptUpkeep + policyCost);

    this.lastTaxIncome = taxIncome;
    this.lastUpkeep = totalUpkeep;
    this.lastLoanPay = loanPay;
    this.netIncome = taxIncome - totalUpkeep - loanPay;

    if (this.difficulty !== 'sandbox') {
      this.money += this.netIncome;
      if (this.money < -3000) {
        this.latestChirp = {
          user: '@财政赤字预警',
          text: '🚨 国库严重赤字！请点顶部「📊 财政」调低水电预算、清理冗余道路或申请银行应急贷款！',
          mood: 'bad'
        };
      }
    }
  }

  getCityIssues() {
    const categories = {
      utility: [],
      sanitation: [],
      economy: [],
      disaster: []
    };

    const powerShort = this.powerDemand > this.powerSupply;
    const waterShort = this.waterDemand > this.waterSupply;

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];

        if (t.dam && (t.damHealth ?? 100) < 75) {
          const nearReported = categories.disaster.some(
            (it) => it.title === '水力发电大坝结构受损' && Math.hypot(it.x - x, it.z - z) <= 5
          );
          if (!nearReported) {
            const hp = Math.round(t.damHealth ?? 100);
            categories.disaster.push({
              category: 'disaster',
              icon: '⚠️',
              title: '水力发电大坝结构受损',
              reason: `⚠️ 大坝结构受损 (${hp}%)，有溃坝风险！`,
              actionTip: '立即跳转点击大坝执行【🔧 加固抢修大坝 (¥450)】，并在财政面板保持电力预算 ≥ 80%',
              x,
              z,
              severity: hp < 40 ? 5 : 4
            });
          }
        }

        if (t.pipe && t.pipeBroken) {
          categories.utility.push({
            category: 'utility',
            icon: '🔴',
            title: '地下输水管道破裂',
            reason: '地震或灾害震裂地下输水管，导致周边街区断水',
            actionTip: '跳转后选择【地下输水管道】重铺该格即可修复',
            x,
            z,
            severity: 4
          });
        }

        if (t.roadGround > 0 && (t.congestion || 0) > 0.72) {
          categories.economy.push({
            category: 'economy',
            icon: '🚦',
            title: t.roadGround >= 2 ? '四车道主干道严重拥堵' : '双车道街道瘫痪拥堵',
            reason: `当前路段拥堵率高达 ${Math.round(t.congestion * 100)}%，严重阻碍商铺进货与市民通勤`,
            actionTip: '点击该路口切换【🛑 主路优先】或【🔄 改建环岛】，或拓宽四车道/架设二层高架',
            x,
            z,
            severity: 2
          });
        }

        const b = t.building;
        if (!b) continue;
        const bName = this.getBuildingDisplayName(b, x, z);

        // 1. Disasters & Abandoned Ruins
        if (b.fire > 0) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🔥',
            title: bName,
            reason: '建筑正在起火燃烧！若无消防车及时扑救将化为废墟',
            actionTip: '确保该街区道路连通已通电的【消防总署】',
            x,
            z,
            severity: 5
          });
          continue;
        }

        if (b.abandoned) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🏚️',
            title: bName,
            reason: `建筑已荒废停摆（原因：${b.abandonReason || '市政配套缺失或灾害损毁'}），拉低地价并滋生犯罪`,
            actionTip: '可点上方【🚜 一键清理全城废弃楼】，或跳转后改善配套并用【地面推土机】清理',
            x,
            z,
            severity: 2
          });
          continue;
        }

        if (b.flooded) {
          categories.disaster.push({
            category: 'disaster',
            icon: '🌊',
            title: bName,
            reason: '河水泛滥或海啸漫灌淹没建筑',
            actionTip: '用【抬升造山/筑堤】在岸边筑防洪堤，或在上游峡谷建【水力发电大坝】控水',
            x,
            z,
            severity: 4
          });
          continue;
        }

        if (b.underConstruction) continue;

        // 2. Utility: Shore water check + Power + Water
        if (
          (b.type === 'nuclear_plant' || b.type === 'seaport' || b.type === 'water_pump' || b.type === 'sewage_out') &&
          !this.hasNearbyWater(x, z, 2).found
        ) {
          categories.utility.push({
            category: 'utility',
            icon: '💧',
            title: bName,
            reason: '周边2格内水体干涸或无水源，设施停机无法运行',
            actionTip: '用【挖河开渠】引水至岸边，或迁建至河岸/海湾沿岸',
            x,
            z,
            severity: 3
          });
          continue;
        }

        const st = this.getBuildingStats(b);
        let hasUtilityOrSanitationIssue = false;

        const needsRoadStaff = (
          b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant' ||
          b.type === 'fire_station' || b.type === 'police_station' || b.type === 'hospital' || b.type === 'school'
        );
        if (needsRoadStaff && !this.findRoadAccess(x, z)) {
          const isEnergyOrWaste = b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant';
          categories.utility.push({
            category: 'utility',
            icon: '🚧',
            title: bName,
            reason: isEnergyOrWaste
              ? '🚧 能源/环卫设施未连通道路，燃料与垃圾车无法进出'
              : '🚧 市政服务设施未连通道路，执勤车辆无法驶出覆盖街区',
            actionTip: '在该设施周边2格内修筑【双车道街道】或【四车道主干道】连通城市路网',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (!t.powered && (st.power > 0 || BUILDING_NAMES[b.type])) {
          categories.utility.push({
            category: 'utility',
            icon: '⚡',
            title: bName,
            reason: powerShort
              ? `全市发电量不足（需求 ${this.powerDemand} MW > 供给 ${this.powerSupply} MW）`
              : '未接入高压电网传导范围，建筑处于断电状态',
            actionTip: powerShort
              ? '增建风电/光热/燃气/核电站，或在【📊 财政】调高电力预算'
              : '在电厂与该街区之间架设【高压输电铁塔】接力供电',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (!t.watered && (st.water > 0 || BUILDING_NAMES[b.type])) {
          categories.utility.push({
            category: 'utility',
            icon: '🔵',
            title: bName,
            reason: waterShort
              ? `全市供水量不足（需求 ${this.waterDemand} > 供给 ${this.waterSupply}）`
              : '周边4格内未铺设连通抽水站的地下输水管',
            actionTip: waterShort
              ? '在上游洁净河岸增建已通电的【河畔抽水站】或【生态净水中心】'
              : '选择【地下输水管道】从已通电的抽水站铺设管道覆盖此街区',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        // 3. Sanitation, Sewage Backup & Pollution Health
        if (b.sewageBackedUp) {
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🚱',
            title: `🚱 排污能力不足·污水倒灌（${bName}）`,
            reason: `全市用水排污量 (${this.waterDemand}) 超过排污上限 (${this.sewageSupply})，下水道超载导致污水倒灌`,
            actionTip: '在下游河岸增建通电的【河道排污口】或建造零污染【生态净水中心】扩容排污',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (b.sick && (!b.sewageBackedUp || this.waterPollutedPct >= 10 || t.pollution > 28)) {
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🤢',
            title: bName,
            reason: this.waterPollutedPct >= 10
              ? `抽水站吸入下游污水（水源污染 ${this.waterPollutedPct}%）导致居民集体患病`
              : '住宅区紧邻重工业、燃气电厂或发臭黑水河岸，毒雾臭气导致居民患病',
            actionTip: this.waterPollutedPct >= 10
              ? '立即拆除下游抽水站，改在【上游洁净河岸】取水或建【生态净水中心】'
              : '增建通电通车的【大型综合医院】，并将重工业/排污口迁离住宅区',
            x,
            z,
            severity: 4
          });
          hasUtilityOrSanitationIssue = true;
        }

        if (b.trashPiled) {
          const gridlockBlocked = (b.gridlockTrashTicks || 0) > 0 && this.trashDemand <= this.trashSupply * 1.15;
          categories.sanitation.push({
            category: 'sanitation',
            icon: '🗑️',
            title: bName,
            reason: gridlockBlocked
              ? '垃圾车被堵在半路无法清运，导致街区垃圾堆积'
              : `垃圾堆积需增建垃圾焚烧厂（全市垃圾产出 ${this.trashDemand} > 处理力 ${this.trashSupply}）`,
            actionTip: gridlockBlocked
              ? '疏通沿途拥堵路口（改建环岛/主路优先或拓宽四车道）让垃圾车顺利进入'
              : '在远离住宅区的道路旁增建通车的【环保垃圾焚烧厂】清运垃圾并产出电力',
            x,
            z,
            severity: 3
          });
          hasUtilityOrSanitationIssue = true;
        }

        // 4. Economy & Operating Distress Warnings (deduplicated from utility/sanitation)
        if (!hasUtilityOrSanitationIssue && (b.distress > 0 || b.abandonReason)) {
          const reason = b.abandonReason || '周边经营环境恶化';
          let tip = '改善周边道路交通、降低税率或补充市政服务设施';
          if (reason.includes('城际高速') || reason.includes('断联')) tip = '修筑道路或匝道将该街区连通至南侧(22,55)城际高速，或接入通电的高铁站/海港/机场';
          else if (reason.includes('道路被切断')) tip = '在该建筑2格内补修地面街道以恢复交通连接';
          else if (reason.includes('污水倒灌')) tip = '在下游河岸增建通电的【河道排污口】或建造【生态净水中心】扩容排污';
          else if (reason.includes('大学') || reason.includes('学历')) tip = '在连通道路旁建造通电的【市立理工大学】培养高学历白领人才';
          else if (reason.includes('税')) tip = '打开顶部【📊 财政】面板，将综合税率调回 9%~11%';
          else if (reason.includes('用工荒')) tip = '增划低密/高密【住宅区】吸引市民迁入补充劳动力';
          else if (reason.includes('供货') || reason.includes('断货')) tip = '增划【工业制造区】、建造【深水海港】或疏通拥堵道路';
          else if (reason.includes('污染')) tip = '清理周边高污染工厂，或在财政面板开启【绿色环保城市条例】';

          categories.economy.push({
            category: 'economy',
            icon: '⚠️',
            title: bName,
            reason: `经营预警：${reason}（恶化度 ${b.distress || 1}/7）`,
            actionTip: tip,
            x,
            z,
            severity: b.distress >= 4 ? 3 : 2
          });
        }
      }
    }

    for (const key of Object.keys(categories)) {
      categories[key].sort((a, b) => b.severity - a.severity);
    }

    const total =
      categories.utility.length +
      categories.sanitation.length +
      categories.economy.length +
      categories.disaster.length;

    return { total, categories };
  }

  clearAllAbandoned() {
    let cleared = 0;
    let cost = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const t = this.grid[i];
      if (t.building && t.building.abandoned) {
        t.building = null;
        cleared++;
        if (this.difficulty !== 'sandbox' && this.money >= cost + 5) {
          cost += 5;
        }
      }
    }
    if (cleared > 0) {
      if (this.difficulty !== 'sandbox' && cost > 0) {
        this.money -= cost;
      }
      if (this.sfx && this.sfx.bulldoze) this.sfx.bulldoze();
      this.recomputeNetworksAndFields();
      this.stepEconomy();
      this.buildingDirty = true;
    }
    return { cleared, cost };
  }

  getUpgradeHint(t) {
    if (!t) return '';
    if (t.dam) {
      const hp = Math.round(t.damHealth ?? 100);
      if (hp < 75) {
        return `⚠️ 警告：坝体健康度已降至 ${hp}%！请立即点击下方【🔧 加固抢修大坝】并保证电力预算充足防溃坝！`;
      }
      return `🏗️ 水力发电大坝：单段出力 ${t.damOutputMW || 0} MW（全坝总计 ${this.hydroPowerMW} MW · 结构健康 ${hp}%）`;
    }
    const b = t.building;
    if (!b) return '';
    if (b.abandoned) return `🏚️ 已废弃（原因：${b.abandonReason || '环境恶化'}）！请用【推土机】清理或改善条件重建`;
    if (b.fire > 0) return '🔥 正在着火！需道路连通已通电的【消防总署】并保证通水灭火！';
    if (b.flooded) return '🌊 遭受水淹！请用【抬升造山】筑防洪堤或在上游建大坝控水';
    if (b.sewageBackedUp) return '🚱 污水倒灌危机！全市排污量超出上限，请立即在下游增建通电的【排污口】或【生态净水中心】！';
    if (b.sick) return '🤢 居民生病！请检查抽水站是否吸入下游污水，或住宅是否紧邻工厂/电厂/黑臭河岸！';
    if (b.trashPiled) return '🗑️ 垃圾围城无人清运！请尽快在道路旁建造【环保垃圾焚烧厂】提升环卫处理能力！';
    if (
      (b.type === 'power_plant' || b.type === 'nuclear_plant' || b.type === 'waste_plant' ||
       b.type === 'fire_station' || b.type === 'police_station' || b.type === 'hospital' || b.type === 'school') &&
      !this.findRoadAccess(t.x, t.z)
    ) {
      return '🚧 设施未连通地面道路（当前无法运转）！请在周边2格内修筑街道接入城市路网';
    }
    if ((b.type === 'water_pump' || b.type === 'sewage_out' || b.type === 'water_treat') && !t.powered) {
      return '⚡ 水务设施断电停机（当前供水/排污出力为 0）！请架设【高压输电铁塔】接入电网';
    }
    if (b.type === 'nuclear_plant' && !this.hasNearbyWater(t.x, t.z, 2).found) return '☢️ 缺少冷却水源！核裂变电站2格内必须有河水或海水才能发电';
    if (b.type === 'seaport' && !this.hasNearbyWater(t.x, t.z, 2).found) return '🚢 航道干涸！海港2格内必须紧邻海湾或深水河道才能靠泊货轮';
    if (b.abandonReason) return `⚠️ 经营预警：${b.abandonReason}（持续恶化将导致荒废倒闭！）`;
    if (b.underConstruction) return '🏗️ 塔吊正在施工中...';
    if (!BUILDING_NAMES[b.type]) return CATALOG[b.type]?.desc || '';
    if (!t.powered) return '⚡ 未通电！请建风电/电厂，远距离需架设【高压输电铁塔】';
    if (!t.watered) return '🔵 未通水！请切换【地下输水管】铺设管道连接上游抽水站';
    const maxLv = this.getMaxLevelForZone(b.type);
    if (b.level >= maxLv) return `🏆 已达该区划封顶等级 Lv.${maxLv}！`;
    if ((b.type === 'RH' || b.type === 'CH' || b.type === 'O') && b.level >= 2 && (t.education || 0) < 20) {
      return '🏫 升级受阻：高层大厦急需【市立理工大学】提供高学历人才！';
    }
    return `📈 保持低拥堵，增建【公园 / 医院 / 大学 / 地铁站】拉升地价即可升至 Lv.${b.level + 1}`;
  }

  // ==================== Preset 0: Beginner Guided Tutorial City (Clean Map + ¥42,000) ====================
  setupTutorialCity(seed = 2026) {
    this.seed = seed;
    this.cityName = '新星教学城';
    this.difficulty = 'normal';
    this.unlockAll = false;
    this.money = 42000;
    this.taxRate = 9;
    this.budgets = { power: 90, water: 90, service: 100 };
    this.activeLoans = [];
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.38;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@建城总顾问',
      text: '🎓 欢迎来到新手建城教学！请跟随左上角《📋 建城指引》从第 1 步修筑街道开始规划吧！',
      mood: 'info'
    };
    this.policies = { freeTransit: false, greenCity: false, techBoost: false };

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this.stepEconomy();
    this.meshDirty = true;
  }

  _placePylonChain(x0, z0, x1, z1) {
    let curX = x0;
    let curZ = z0;
    let curIsPylon = Boolean(this.getTile(curX, curZ)?.pylon);

    for (let step = 0; step < 24; step++) {
      const reachR = curIsPylon ? 6 : 3;
      const dxEnd = x1 - curX;
      const dzEnd = z1 - curZ;
      if (dxEnd * dxEnd + dzEnd * dzEnd <= reachR * reachR) break;

      const curDist = Math.hypot(dxEnd, dzEnd);
      let best = null;
      let bestScore = curDist;

      for (let dz = -reachR; dz <= reachR; dz++) {
        for (let dx = -reachR; dx <= reachR; dx++) {
          if (dx * dx + dz * dz > reachR * reachR) continue;
          const nx = curX + dx, nz = curZ + dz;
          if (!inBounds(nx, nz)) continue;
          const nt = this.grid[idx(nx, nz)];
          const canUseExistingPylon = nt.pylon;
          const canPlaceNewPylon = (
            !this.isWaterTile(nx, nz) &&
            nt.roadGround === 0 &&
            nt.roadElevated === 0 &&
            nt.rail === 0 &&
            !nt.building &&
            !nt.dam &&
            !nt.zone
          );
          if (!canUseExistingPylon && !canPlaceNewPylon) continue;
          const remDist = Math.hypot(x1 - nx, z1 - nz) - (canUseExistingPylon ? 0.15 : 0);
          if (remDist < bestScore - 0.1) {
            bestScore = remDist;
            best = { x: nx, z: nz, existing: canUseExistingPylon };
          }
        }
      }

      if (!best) break;
      if (!best.existing) {
        this.applyTool('power_pylon', [{ x: best.x, z: best.z }], true);
      }
      curX = best.x;
      curZ = best.z;
      curIsPylon = true;
    }
  }

  _ensurePowerTo(targetX, targetZ) {
    this.recomputeNetworksAndFields();
    const targetTile = this.getTile(targetX, targetZ);
    if (!targetTile || targetTile.powered) return;

    let bestSrc = null;
    let bestDist = 1e9;
    for (let i = 0; i < this.grid.length; i++) {
      const st = this.grid[i];
      if (!st.powered) continue;
      if (!(st.pylon || st.building || st.zone || st.dam)) continue;
      const d = Math.hypot(st.x - targetX, st.z - targetZ) - (st.pylon ? 2.5 : 0);
      if (d < bestDist) {
        bestDist = d;
        bestSrc = st;
      }
    }
    if (bestSrc) {
      this._placePylonChain(bestSrc.x, bestSrc.z, targetX, targetZ);
      this.recomputeNetworksAndFields();
    }
  }

  _ensureRoadTo(targetX, targetZ, roadTool = 'road_1') {
    this.recomputeNetworksAndFields();
    const curAcc = this.findRoadAccess(targetX, targetZ);
    if (curAcc && curAcc.roadTile?.outsideConnected) return;

    const N = this.grid.length;
    const prev = new Int32Array(N);
    prev.fill(-1);
    const vis = new Uint8Array(N);
    const q = [];

    for (let i = 0; i < N; i++) {
      const t = this.grid[i];
      if ((t.roadGround === 1 || t.roadGround === 2 || t.roadGround === 3) && t.outsideConnected) {
        vis[i] = 1;
        q.push(i);
      }
    }
    if (q.length === 0) return;

    const isGoal = (gx, gz) => {
      const adx = Math.abs(gx - targetX);
      const adz = Math.abs(gz - targetZ);
      return (adx === 0 && (adz === 1 || adz === 2)) || (adz === 0 && (adx === 1 || adx === 2));
    };

    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let foundIdx = -1;
    let head = 0;
    while (head < q.length) {
      const ci = q[head++];
      const cx = ci % GRID_SIZE;
      const cz = (ci / GRID_SIZE) | 0;
      if (isGoal(cx, cz) && !this.isWaterTile(cx, cz)) {
        foundIdx = ci;
        break;
      }
      for (const [dx, dz] of dirs4) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz) || (nx === targetX && nz === targetZ)) continue;
        const ni = idx(nx, nz);
        if (vis[ni]) continue;
        const nt = this.grid[ni];
        if (nt.dam || nt.roadGround === 3 || nt.rail > 0 || nt.pylon) continue;
        if (nt.building || nt.zone) continue;
        const wet = this.isWaterTile(nx, nz);
        const { slope } = this.getTileMinMaxElev(nx, nz);
        if (slope > 0.72 && !wet) continue;
        vis[ni] = 1;
        prev[ni] = ci;
        q.push(ni);
      }
    }

    if (foundIdx >= 0) {
      const path = [];
      let cur = foundIdx;
      while (cur >= 0) {
        const t = this.grid[cur];
        if (t.roadGround === 0) {
          path.push({ x: cur % GRID_SIZE, z: (cur / GRID_SIZE) | 0 });
        }
        cur = prev[cur];
      }
      path.reverse();
      if (path.length > 0) {
        this.applyTool(roadTool, path, true);
      }
      this.recomputeNetworksAndFields();
    }
  }

  // ==================== Preset 1: Hardcore Starter Town (Real Challenge!) ====================
  setupStarterTown(seed = 2026) {
    this.seed = seed;
    this.cityName = '山河天际市';
    this.difficulty = 'hardcore';
    this.unlockAll = false;
    this.money = 32000;
    this.taxRate = 9;
    this.budgets = { power: 80, water: 80, service: 100 }; // Smart frugal startup budget!
    this.activeLoans = [];
    this._suppressPromotions = true;
    this.mayorLevel = 1;
    this.mayorXP = 95;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.36;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };
    this.policies = { freeTransit: false, greenCity: false, techBoost: false };

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();

    // Modest, realistic starter connection from South Highway (x=22, z=52->43)
    this.applyTool('road_1', this.computeLineOrLPath(22, 52, 22, 43), true);
    this.applyTool('road_1', this.computeLineOrLPath(16, 46, 27, 46), true);
    this.applyTool('road_1', this.computeLineOrLPath(17, 43, 25, 43), true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 50, 28, 50), true);

    // 1 Wind Turbine on starter hill (adjacent to z=46 road)
    this.applyTool('power_wind', [{ x: 16, z: 45 }], true);

    // Clean Upstream River Pump & Downstream Sewage Outfall (pick nearest dry bank spots!)
    let pumpPos = { x: 25, z: 35 };
    let bestPumpDist = 1e9;
    for (let z = 29; z <= 36; z++) {
      for (let x = 23; x <= 35; x++) {
        if (!this.isWaterTile(x, z) && this.hasNearbyWater(x, z, 1).found && this.getTileMinMaxElev(x, z).slope <= 0.62) {
          const d = Math.hypot(x - 24, z - 38);
          if (d < bestPumpDist) {
            bestPumpDist = d;
            pumpPos = { x, z };
          }
        }
      }
    }
    let sewPos = { x: 36, z: 43 };
    let bestSewDist = 1e9;
    for (let z = 40; z <= 47; z++) {
      for (let x = 34; x <= 46; x++) {
        if (!this.isWaterTile(x, z) && this.hasNearbyWater(x, z, 1).found && this.getTileMinMaxElev(x, z).slope <= 0.62) {
          const d = Math.hypot(x - 33, z - 45);
          if (d < bestSewDist) {
            bestSewDist = d;
            sewPos = { x, z };
          }
        }
      }
    }

    this.applyTool('water_pump', [pumpPos], true);
    this.applyTool('sewage_out', [sewPos], true);

    // Zone residential AWAY from industrial! (RL on west, CL in middle, I on southeast downwind/away!)
    this.applyTool('zone_RL', this.computeRectTiles(17, 44, 21, 45), true);
    this.applyTool('zone_CL', this.computeRectTiles(23, 44, 24, 45), true);
    this.applyTool('zone_I',  this.computeRectTiles(25, 49, 28, 51), true);

    // Connect service streets to pump & sewage outfall routing around zoned blocks
    this._ensureRoadTo(pumpPos.x, pumpPos.z, 'road_1');
    this._ensureRoadTo(sewPos.x, sewPos.z, 'road_1');

    this.applyTool('water_pipe', this.computeLineOrLPath(pumpPos.x, pumpPos.z, 22, 45, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(17, 45, 22, 45, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(22, 45, sewPos.x, sewPos.z, false), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(22, 45, 27, 50, false), true);

    for (const [bx, bz, bt] of [[18,44,'RL'],[19,44,'RL'],[20,45,'RL'],[23,44,'CL'],[26,49,'I'],[27,49,'I']]) {
      const t = this.getTile(bx, bz);
      const acc = this.findRoadAccess(bx, bz);
      if (t && acc) {
        t.building = {
          type: bt, level: 1, variant: (bx + bz) % 5, rot: acc.rot,
          underConstruction: false, buildProgress: 1, upgradeProgress: 10,
          fire: 0, sick: false, trashPiled: false, sewageBackedUp: false,
          flooded: false, abandoned: false, distress: 0, abandonReason: ''
        };
      }
    }

    // Guarantee HV Power Pylons reach industrial park, upstream pump, and downstream sewage outfall at frame 0!
    this._placePylonChain(24, 45, 26, 49);
    this._ensurePowerTo(26, 49);
    this._ensurePowerTo(pumpPos.x, pumpPos.z);
    this._ensurePowerTo(sewPos.x, sewPos.z);

    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    this.syncCompletedQuestsSilent();
    this.stepEconomy();
    this.meshDirty = true;
  }

  // ==================== Preset 2: Pure Blank Canyon Challenge ====================
  setupBlankMap(seed = Math.floor(1000 + Math.random() * 8999)) {
    this.seed = seed;
    this.cityName = '未名山河城';
    this.difficulty = 'hardcore';
    this.unlockAll = false;
    this.money = 38000;
    this.taxRate = 9;
    this.budgets = { power: 80, water: 80, service: 90 };
    this.activeLoans = [];
    this.mayorLevel = 1;
    this.mayorXP = 0;
    this.gridlockTimeouts = 0;
    this.guideStep = 0;
    this.completedQuests = [];
    this.year = 2026; this.month = 3; this.day = 1;
    this.dayProgress = 0.38;
    this.milestoneIdx = 0;
    this.maxPopReached = 0;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.latestChirp = {
      user: '@市民小张',
      text: '听说新市长上任了！期待我们的山河新城早日通上地铁和高铁🚄',
      mood: 'info'
    };
    this.policies = { freeTransit: false, greenCity: false, techBoost: false };

    const world = generateWorld(seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this.stepEconomy();
    this.meshDirty = true;
  }

  // ==================== Preset 3: Grand 3D Showcase (All Systems Unlocked!) ====================
  setupMetropolisShowcase() {
    this._suppressPromotions = true;
    this.seed = 2026;
    this.cityName = '山河立体大都会';
    this.difficulty = 'normal';
    this.unlockAll = true;
    this.money = 185000;
    this.taxRate = 9;
    this.budgets = { power: 110, water: 110, service: 110 };
    this.activeLoans = [];
    this.mayorLevel = 10;
    this.mayorXP = 15000;
    this.gridlockTimeouts = 0;
    this.guideStep = MAYOR_QUESTS.length;
    this.completedQuests = MAYOR_QUESTS.map((q) => q.step);
    this.year = 2032; this.month = 8; this.day = 15;
    this.dayProgress = 0.40;
    this.milestoneIdx = MILESTONES.length - 1;
    this.stadiumTimer = 0;
    this.matchDayBoostTimer = 0;
    this.chirpTimer = 0;
    this.policies = { freeTransit: true, greenCity: true, techBoost: true };

    const world = generateWorld(this.seed);
    this.corners = world.corners;
    this.grid = world.grid;
    this.waterDepth = world.waterDepth;
    this.waterPoll = world.waterPoll;
    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();

    // 1. NW Alpine Canyon Hydroelectric Dam + Impounded Reservoir + HV Pylons!
    const damSpan = this.computeLineOrLPath(10, 16, 16, 10, true);
    this.applyTool('hydro_dam', damSpan, true);
    for (let z = 2; z <= 15; z++) {
      for (let x = 2; x <= 15; x++) {
        if ((x + z) < 26 && !this.grid[idx(x, z)].dam) {
          const elev = this.getTileElev(x, z);
          if (elev < 1.55) {
            this.waterDepth[idx(x, z)] = Math.max(this.waterDepth[idx(x, z)], 1.52 - elev);
          }
        }
      }
    }
    for (const py of [[12, 18], [13, 22], [14, 26], [15, 30]]) {
      this.applyTool('power_pylon', [{ x: py[0], z: py[1] }], true);
    }

    // 2. Road Network + River Bridges + Mountain Ridge Tunnel
    this.applyTool('road_2', this.computeLineOrLPath(22, 52, 22, 14), true);
    this.applyTool('road_2', this.computeLineOrLPath(12, 38, 36, 38), true);
    this.applyTool('road_2', this.computeLineOrLPath(12, 32, 34, 32), true);
    this.applyTool('road_1', this.computeLineOrLPath(12, 44, 34, 44), true);
    for (const x of [12, 17, 27, 33]) {
      this.applyTool('road_1', this.computeLineOrLPath(x, 32, x, 46), true);
    }
    const rbtTile = this.getTile(17, 44);
    if (rbtTile) { rbtTile.junctionMode = 'roundabout'; rbtTile.roundaboutPaid = true; }
    const yldTile = this.getTile(27, 38);
    if (yldTile) { yldTile.junctionMode = 'yield'; }

    this.applyTool('road_2', this.computeLineOrLPath(22, 19, 31, 19), true);
    this.applyTool('road_tunnel', this.computeLineOrLPath(32, 19, 41, 19, true), true);
    this.applyTool('road_2', this.computeLineOrLPath(42, 19, 46, 26), true);

    // 3. Elevated Highway Viaducts (+1 Layer) + Smooth Multi-Tile Ramp + Over-Avenue Median Ramp!
    this.applyTool('road_2', this.computeLineOrLPath(9, 35, 12, 35), true);
    this.applyTool('road_ramp', [{ x: 10, z: 35 }, { x: 11, z: 35 }], true);
    this.applyTool('road_elev', this.computeLineOrLPath(12, 35, 34, 35, true), true);
    this.applyTool('road_2', this.computeLineOrLPath(33, 35, 35, 35), true);
    this.applyTool('road_ramp', [{ x: 35, z: 35 }], true);

    this.applyTool('road_1', [{ x: 25, z: 46 }, { x: 24, z: 46 }, { x: 23, z: 46 }, { x: 22, z: 46 }], true);
    this.applyTool('road_ramp', [{ x: 25, z: 47 }], true);
    this.applyTool('road_elev', this.computeLineOrLPath(25, 46, 25, 29, true), true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 28, 25, 28), true);
    this.applyTool('road_ramp', [{ x: 25, z: 28 }], true);

    // Over-Avenue Median Ramp along the z=38 4-lane Boulevard (keeps ground avenue flowing on both sides!)
    this.applyTool('road_elev', this.computeLineOrLPath(25, 38, 29, 38, true), true);
    this.applyTool('road_ramp', [{ x: 30, z: 38 }, { x: 31, z: 38 }], true);

    // 4. High-Speed Rail Mainline + HSR Viaduct Bridge + 2 HSR Central Stations
    this.applyTool('rail_track', this.computeLineOrLPath(8, 52, 8, 36), true);
    this.applyTool('hsr_station', [{ x: 8, z: 35 }], true);
    this.applyTool('road_1', this.computeLineOrLPath(8, 36, 12, 36), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(8, 35, 10, 33, false), true);
    this.applyTool('power_pylon', [{ x: 11, z: 34 }], true);
    this.applyTool('rail_track', this.computeLineOrLPath(8, 34, 8, 24), true);
    this.applyTool('rail_track', this.computeLineOrLPath(8, 24, 33, 24), true);
    this.applyTool('hsr_station', [{ x: 34, z: 24 }], true);
    this.applyTool('road_1', this.computeLineOrLPath(22, 25, 34, 25), true);
    this.applyTool('road_1', this.computeLineOrLPath(34, 25, 34, 32), true);
    this.applyTool('power_pylon', [{ x: 38, z: 24 }], true);

    // 5. Underground Metro Loop + 4 Stations
    this.applyTool('metro_line', this.computeLineOrLPath(14, 33, 31, 33), true);
    this.applyTool('metro_line', this.computeLineOrLPath(31, 33, 31, 43), true);
    this.applyTool('metro_line', this.computeLineOrLPath(31, 43, 14, 43), true);
    this.applyTool('metro_line', this.computeLineOrLPath(14, 43, 14, 33), true);
    this.applyTool('metro_station', [{ x: 14, z: 33 }], true);
    this.applyTool('metro_station', [{ x: 23, z: 33 }], true);
    this.applyTool('metro_station', [{ x: 31, z: 39 }], true);
    this.applyTool('metro_station', [{ x: 18, z: 43 }], true);

    // 6. Water Treatment + Underground Pipe Grid + Backup Power (full road & pipe coverage x=9..39!)
    this.applyTool('road_1', this.computeLineOrLPath(9, 50, 39, 50), true);
    this.applyTool('road_1', this.computeLineOrLPath(12, 46, 12, 50), true);
    for (const x of [11, 13, 15, 17, 19, 21, 23, 25, 27]) {
      this.applyTool('water_treat', [{ x, z: 48 }], true);
    }
    this.applyTool('water_pipe', this.computeLineOrLPath(9, 48, 46, 48), true);
    for (const z of [22, 26, 33, 39, 45]) {
      this.applyTool('water_pipe', this.computeLineOrLPath(10, z, 46, z), true);
    }
    this.applyTool('water_pipe', this.computeLineOrLPath(18, 48, 18, 22), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(32, 48, 32, 22), true);

    this.applyTool('power_plant', [{ x: 36, z: 49 }], true);
    this.applyTool('power_plant', [{ x: 38, z: 49 }], true);
    this.applyTool('water_pipe', this.computeLineOrLPath(9, 50, 42, 50), true);
    this.applyTool('power_pylon', [{ x: 20, z: 45 }], true);

    // Eco Waste-to-Energy Plants (2x initial + auto-scaled below) & Molten Salt Solar Plant
    this.applyTool('waste_plant', [{ x: 24, z: 51 }], true);
    this.applyTool('waste_plant', [{ x: 26, z: 51 }], true);
    this.applyTool('solar_plant', [{ x: 33, z: 51 }], true);

    // 7. Full Civic Coverage + Olympic Stadium + Waterfront Ferris Wheel + Airport + Seaport
    this.applyTool('landmark', [{ x: 21, z: 33 }], true);
    this.applyTool('fire_station', [{ x: 16, z: 39 }], true);
    this.applyTool('fire_station', [{ x: 28, z: 39 }], true);
    this.applyTool('police_station', [{ x: 20, z: 39 }], true);
    this.applyTool('hospital', [{ x: 23, z: 37 }], true);
    this.applyTool('school', [{ x: 19, z: 37 }], true);
    this.applyTool('school', [{ x: 24, z: 42 }], true);
    this.applyTool('park', [{ x: 20, z: 33 }], true);
    this.applyTool('park', [{ x: 24, z: 33 }], true);
    this.applyTool('park', [{ x: 44, z: 24 }], true);

    // Olympic Sports Center along North CBD Avenue (z=32)
    for (const sx of [18, 19, 17, 16, 20, 27]) {
      if (!this.isWaterTile(sx, 31) && !this.getTile(sx, 31)?.building) {
        if (this.applyTool('stadium', [{ x: sx, z: 31 }], true).ok) break;
      }
    }

    // Coastal/Waterfront Ferris Wheel Amusement Park
    let placedAmusement = false;
    for (const cand of [
      { x: 30, z: 39 }, { x: 29, z: 39 }, { x: 34, z: 37 },
      { x: 35, z: 37 }, { x: 34, z: 39 }, { x: 27, z: 31 }
    ]) {
      if (!this.isWaterTile(cand.x, cand.z) && this.applyTool('amusement_park', [cand], true).ok) {
        placedAmusement = true;
        break;
      }
    }
    if (!placedAmusement) {
      for (let z = 36; z <= 42 && !placedAmusement; z++) {
        for (let x = 28; x <= 36 && !placedAmusement; x++) {
          if (!this.isWaterTile(x, z) && this.findRoadAccess(x, z) && this.applyTool('amusement_park', [{ x, z }], true).ok) {
            placedAmusement = true;
          }
        }
      }
    }

    // International Civil Airport in open flat area connected by road
    let airportPos = null;
    let bestSlope = 99;
    for (let z = 27; z <= 30; z++) {
      for (let x = 15; x <= 20; x++) {
        const t = this.getTile(x, z);
        if (!t || this.isWaterTile(x, z) || this.hasNearbyWater(x, z, 1).found) continue;
        if (t.building || t.roadGround > 0 || t.roadElevated > 0 || t.rail > 0 || t.pylon) continue;
        const { slope } = this.getTileMinMaxElev(x, z);
        if (slope < bestSlope) {
          bestSlope = slope;
          airportPos = { x, z };
        }
      }
    }
    if (!airportPos) airportPos = { x: 17, z: 28 };
    const apRoadZ = Math.min(31, airportPos.z + 1);
    this.applyTool('road_2', this.computeLineOrLPath(airportPos.x, apRoadZ, 22, apRoadZ), true);
    this.applyTool('water_pipe', this.computeLineOrLPath(18, 28, airportPos.x, airportPos.z, false), true);
    this.applyTool('airport', [airportPos], true);
    this.applyTool('power_pylon', [{ x: Math.max(12, airportPos.x - 1), z: Math.min(31, airportPos.z + 2) }], true);

    // Deep-Water Container Seaport on SE Sea Bay coastal shore (z >= 40, x >= 36)
    const oceanWet = new Uint8Array(GRID_SIZE * GRID_SIZE);
    const oq = [];
    for (let z = 46; z < GRID_SIZE; z++) {
      for (let x = 46; x < GRID_SIZE; x++) {
        const i = idx(x, z);
        if (this.waterDepth[i] > 0.12) {
          oceanWet[i] = 1;
          oq.push(i);
        }
      }
    }
    let oHead = 0;
    const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (oHead < oq.length) {
      const ci = oq[oHead++];
      const cx = ci % GRID_SIZE, cz = (ci / GRID_SIZE) | 0;
      for (const [dx, dz] of dirs4) {
        const nx = cx + dx, nz = cz + dz;
        if (!inBounds(nx, nz)) continue;
        const ni = idx(nx, nz);
        if (!oceanWet[ni] && this.waterDepth[ni] > 0.12) {
          oceanWet[ni] = 1;
          oq.push(ni);
        }
      }
    }

    let seaportPos = null;
    let bestPortDist = 9999;
    for (let z = 40; z <= 51; z++) {
      for (let x = 36; x <= 51; x++) {
        const t = this.getTile(x, z);
        if (!t || this.isWaterTile(x, z) || t.building || t.roadGround > 0 || t.dam) continue;
        if (!this.hasNearbyWater(x, z, 2).found) continue;
        let touchesBay = false;
        for (let dz = -2; dz <= 2 && !touchesBay; dz++) {
          for (let dx = -2; dx <= 2 && !touchesBay; dx++) {
            const nx = x + dx, nz = z + dz;
            if (inBounds(nx, nz) && oceanWet[idx(nx, nz)]) touchesBay = true;
          }
        }
        if (!touchesBay && oq.length > 0) continue;
        const d = Math.hypot(x - 38, z - 45);
        if (d < bestPortDist) {
          bestPortDist = d;
          seaportPos = { x, z };
        }
      }
    }
    if (seaportPos) {
      this.applyTool('seaport', [seaportPos], true);
      // Connect road & water pipe & power pylons to Seaport
      const roadTarget = !this.isWaterTile(seaportPos.x - 1, seaportPos.z)
        ? { x: seaportPos.x - 1, z: seaportPos.z }
        : { x: seaportPos.x, z: Math.max(40, seaportPos.z - 1) };
      this.applyTool('road_1', this.computeLineOrLPath(34, 44, roadTarget.x, roadTarget.z), true);
      this.applyTool('water_pipe', this.computeLineOrLPath(32, 45, seaportPos.x, seaportPos.z, false), true);
      const portPylons = this.computeLineOrLPath(38, 48, seaportPos.x, seaportPos.z, true);
      for (let k = 2; k < portPylons.length - 1; k += 3) {
        this.applyTool('power_pylon', [portPylons[k]], true);
      }
    }

    // 8. Balanced Zones (with Industrial well separated in South-East!)
    this.applyTool('zone_CH', this.computeRectTiles(18, 33, 26, 37), true);
    this.applyTool('zone_O',  this.computeRectTiles(13, 33, 16, 37), true);
    this.applyTool('zone_RH', this.computeRectTiles(13, 39, 25, 43), true);
    this.applyTool('zone_CL', this.computeRectTiles(28, 33, 32, 37), true);
    this.applyTool('zone_I',  this.computeRectTiles(28, 46, 36, 48), true);
    this.applyTool('zone_RL', this.computeRectTiles(43, 20, 47, 26), true);
    this.applyTool('power_wind', [{ x: 41, z: 21 }], true);
    this.applyTool('power_pylon', [{ x: 41, z: 24 }], true);
    this.applyTool('water_pipe', this.computeLineOrLPath(42, 22, 45, 25, false), true);

    if (this.waterPhysics) {
      for (let k = 0; k < 25; k++) this.waterPhysics.step();
    }
    this.recomputeNetworksAndFields();

    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const t = this.grid[idx(x, z)];
        if (!t.zone || this.isWaterTile(x, z)) continue;
        const acc = this.findRoadAccess(x, z);
        if (!acc) continue;
        const maxLv = this.getMaxLevelForZone(t.zone);
        const r = hash2D(x, z, 777);
        const lv = Math.max(2, Math.min(maxLv, Math.round(maxLv * (0.65 + r * 0.35))));
        t.building = {
          type: t.zone,
          level: lv,
          variant: Math.floor(r * 8),
          rot: acc.rot,
          underConstruction: false,
          buildProgress: 1,
          upgradeProgress: 50,
          fire: 0,
          sick: false,
          trashPiled: false,
          flooded: false,
          abandoned: false,
          distress: 0,
          abandonReason: ''
        };
      }
    }

    this.recomputeNetworksAndFields();

    // Ensure 100% surplus on Trash, Water, Sewage, Power & Road/Grid Connectivity for Showcase Metropolis!
    const extraWasteSpots = [{ x: 28, z: 51 }, { x: 30, z: 51 }, { x: 20, z: 51 }, { x: 18, z: 51 }, { x: 16, z: 51 }];
    for (const wp of extraWasteSpots) {
      if (this.trashSupply > this.trashDemand * 1.65) break;
      this.applyTool('waste_plant', [wp], true);
      this.recomputeNetworksAndFields();
    }
    const extraWaterSpots = [
      { x: 29, z: 48 }, { x: 9, z: 48 }, { x: 14, z: 51 },
      { x: 12, z: 51 }, { x: 10, z: 51 }, { x: 31, z: 51 },
      { x: 22, z: 51 }, { x: 15, z: 51 }
    ];
    for (const wt of extraWaterSpots) {
      if (this.waterSupply > this.waterDemand * 1.48 && this.sewageSupply > this.waterDemand * 1.55) break;
      this.applyTool('water_treat', [wt], true);
      this.applyTool('water_pipe', [{ x: wt.x, z: wt.z }], true);
      this._ensurePowerTo(wt.x, wt.z);
    }
    const extraSolarSpots = [{ x: 35, z: 51 }, { x: 37, z: 51 }, { x: 39, z: 51 }, { x: 40, z: 49 }];
    for (const sp of extraSolarSpots) {
      if (this.powerSupply > this.powerDemand * 1.38) break;
      this.applyTool('solar_plant', [sp], true);
      this.recomputeNetworksAndFields();
    }

    // Final facility audit pass: ensure every civic/utility/transit hub has outside road & HV power!
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const b = this.grid[idx(x, z)].building;
        if (!b || BUILDING_NAMES[b.type]) continue;
        this._ensureRoadTo(x, z, 'road_1');
        this._ensurePowerTo(x, z);
      }
    }

    this.milestoneIdx = MILESTONES.length - 1;
    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    this.stepEconomy();
    this.stepChirper();
    this.meshDirty = true;
  }

  toJSON() {
    return {
      v: 3,
      seed: this.seed,
      cityName: this.cityName,
      difficulty: this.difficulty,
      unlockAll: this.unlockAll,
      money: this.money,
      taxRate: this.taxRate,
      budgets: this.budgets,
      activeLoans: this.activeLoans,
      policies: this.policies,
      year: this.year,
      month: this.month,
      day: this.day,
      dayProgress: this.dayProgress,
      timeMode: this.timeMode,
      milestoneIdx: this.milestoneIdx,
      maxPopReached: this.maxPopReached,
      mayorLevel: this.mayorLevel,
      mayorXP: this.mayorXP,
      guideStep: this.guideStep,
      completedQuests: this.completedQuests,
      corners: Array.from(this.corners, (v) => Number(v.toFixed(3))),
      water: Array.from(this.waterDepth, (v) => Number(v.toFixed(3))),
      tiles: this.grid.map((t) => ({
        rg: t.roadGround || undefined,
        rb: t.roadBridge ? 1 : undefined,
        jm: t.junctionMode || undefined,
        rbp: t.roundaboutPaid ? 1 : undefined,
        re: t.roadElevated || undefined,
        rp: t.ramp ? 1 : undefined,
        rl: t.rail || undefined,
        mt: t.metro ? 1 : undefined,
        pp: t.pipe ? 1 : undefined,
        pb: t.pipeBroken ? 1 : undefined,
        py: t.pylon ? 1 : undefined,
        dm: t.dam ? Number(t.damCrest.toFixed(2)) : undefined,
        dmh: t.dam && t.damHealth !== undefined && t.damHealth < 100 ? Math.round(t.damHealth) : undefined,
        ws: t.waterSpring ? Number(t.waterSpring.toFixed(2)) : undefined,
        tr: t.trees || undefined,
        z: t.zone || undefined,
        b: t.building
          ? {
              t: t.building.type,
              l: t.building.level,
              v: t.building.variant,
              rt: t.building.rot,
              ab: t.building.abandoned ? 1 : undefined,
              ar: t.building.abandonReason || undefined,
              f: t.building.fire ? Number(t.building.fire.toFixed(2)) : undefined
            }
          : undefined
      }))
    };
  }

  fromJSON(data) {
    if (!data || data.v !== 3 || !Array.isArray(data.tiles) || data.tiles.length !== GRID_SIZE * GRID_SIZE) {
      return false;
    }
    this._suppressPromotions = true;
    this.seed = data.seed || 2026;
    this.cityName = data.cityName || '山河天际市';
    this.difficulty = data.difficulty || 'hardcore';
    this.unlockAll = Boolean(data.unlockAll);
    this.money = typeof data.money === 'number' ? data.money : 32000;
    this.taxRate = data.taxRate || 9;
    this.budgets = Object.assign({ power: 100, water: 100, service: 100 }, data.budgets || {});
    this.activeLoans = Array.isArray(data.activeLoans) ? data.activeLoans : [];
    this.policies = Object.assign({ freeTransit: false, greenCity: false, techBoost: false }, data.policies || {});
    this.year = data.year || 2026;
    this.month = data.month || 3;
    this.day = data.day || 1;
    this.dayProgress = typeof data.dayProgress === 'number' ? data.dayProgress : 0.36;
    this.timeMode = data.timeMode || 'cycle';
    this.milestoneIdx = data.milestoneIdx || 0;
    this.maxPopReached = data.maxPopReached || 0;
    this.gridlockTimeouts = 0;
    let fallbackLv = 1;
    for (const tier of MAYOR_LEVELS) {
      if ((this.maxPopReached || 0) >= tier.popReq) fallbackLv = tier.level;
    }
    this.mayorLevel = typeof data.mayorLevel === 'number' ? Math.max(1, Math.min(10, data.mayorLevel)) : fallbackLv;
    this.mayorXP = typeof data.mayorXP === 'number'
      ? Math.max(0, data.mayorXP)
      : (MAYOR_LEVELS[this.mayorLevel - 1]?.xpReq || 0);
    this.guideStep = typeof data.guideStep === 'number' ? Math.max(0, data.guideStep) : 0;
    this.completedQuests = Array.isArray(data.completedQuests) ? data.completedQuests.slice() : [];

    const world = generateWorld(this.seed);
    this.corners = data.corners && data.corners.length === CORNER_STRIDE * CORNER_STRIDE
      ? new Float32Array(data.corners)
      : world.corners;
    this.waterDepth = data.water && data.water.length === GRID_SIZE * GRID_SIZE
      ? new Float32Array(data.water)
      : world.waterDepth;
    this.waterPoll = new Float32Array(GRID_SIZE * GRID_SIZE);
    this.grid = world.grid;

    for (let i = 0; i < this.grid.length; i++) {
      const s = data.tiles[i];
      const t = this.grid[i];
      t.roadGround = s.rg || 0;
      t.roadBridge = s.rb !== undefined ? Boolean(s.rb) : (Boolean(s.rg === 1 || s.rg === 2) && this.waterDepth[i] > 0.08);
      t.junctionMode = s.jm || null;
      t.roundaboutPaid = Boolean(s.rbp || s.jm === 'roundabout');
      t.roadElevated = s.re || 0;
      t.ramp = Boolean(s.rp);
      t.rail = s.rl || 0;
      t.metro = Boolean(s.mt);
      t.pipe = Boolean(s.pp);
      t.pipeBroken = Boolean(s.pb);
      t.pylon = Boolean(s.py);
      t.dam = s.dm !== undefined;
      t.damCrest = s.dm || 0;
      t.damHealth = t.dam ? (typeof s.dmh === 'number' ? s.dmh : 100) : 100;
      t.damStress = 0;
      t.waterSpring = s.ws || 0;
      t.trees = s.tr || 0;
      t.zone = s.z || null;
      t.building = s.b
        ? {
            type: s.b.t,
            level: s.b.l || 1,
            variant: s.b.v || 0,
            rot: s.b.rt || 0,
            underConstruction: false,
            buildProgress: 1,
            upgradeProgress: 20,
            fire: s.b.f || 0,
            sick: false,
            trashPiled: false,
            flooded: false,
            abandoned: Boolean(s.b.ab),
            distress: 0,
            abandonReason: s.b.ar || ''
          }
        : null;
    }

    if (this.waterPhysics) this.waterPhysics.refreshCellElevations();
    this.recomputeNetworksAndFields();
    this._suppressPromotions = false;
    if (typeof data.guideStep !== 'number') {
      this.syncCompletedQuestsSilent();
    }
    this.stepEconomy();
    this.meshDirty = true;
    return true;
  }
}

Object.assign(__M, { CATALOG, BUILDING_NAMES, MILESTONES, MAYOR_LEVELS, MAYOR_QUESTS, LOAN_OFFERS, CitySimulation });
})();

// ====== MODULE: traffic.js ======
(function () {
const { GRID_SIZE, inBounds, idx, tileToWorld, worldToTile } = __M;

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
class TrafficManager {
  constructor(sim) {
    this.sim = sim;
    this.vehicles = [];
    this.trains = [];      // HSR multi-car bullet trains & underground metro trains!
    this.aircraft = [];    // 3D Wide-body Airliners approaching/landing/climbing at airports!
    this.ships = [];       // 3D Cargo Container Ships sailing SE Sea Bay <-> Seaport!
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
      transitPolicyPct: 0,
      walkSharePct: 0,
      seaportFreightPct: 0,
      activeCommuters: 0,
      activeFreight: 0,
      activeService: 0,
      gridlockTimeouts: 0
    };
  }

  reset() {
    this.vehicles.length = 0;
    this.trains.length = 0;
    this.aircraft.length = 0;
    this.ships.length = 0;
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
    this.modalSplit.transitPolicyPct = 0;
    this.modalSplit.walkSharePct = 0;
    this.modalSplit.seaportFreightPct = 0;
    this.modalSplit.activeCommuters = 0;
    this.modalSplit.activeFreight = 0;
    this.modalSplit.activeService = 0;
    this.modalSplit.gridlockTimeouts = 0;
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
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (v.tripType === 'freight') freight++;
      else if (v.tripType === 'service') service++;
      else commuters++;
    }
    this.modalSplit.activeCommuters = commuters;
    this.modalSplit.activeFreight = freight;
    this.modalSplit.activeService = service;
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

    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      if (!hasAnyRoad && (this.isGroundRoadPassable(t) || t.roadElevated > 0)) {
        hasAnyRoad = true;
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

    const transitPolicyPct = this.sim.policies?.freeTransit ? 20 : 0;
    const seaportFreightPct = (this.sim.hasSeaport || activeSeaports > 0) ? 35 : 0;

    const targetRoadVehicles = hasAnyRoad
      ? Math.max(4, Math.min(165, Math.round(rawDemand * (1 - (walkSharePct + metroSharePct + transitPolicyPct) * 0.0085))))
      : 0;

    this.modalSplit.rawCarDemand = rawDemand;
    this.modalSplit.targetRoadVehicles = targetRoadVehicles;
    this.modalSplit.walkSharePct = walkSharePct;
    this.modalSplit.metroSharePct = metroSharePct;
    this.modalSplit.transitPolicyPct = transitPolicyPct;
    this.modalSplit.seaportFreightPct = seaportFreightPct;
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

  computeRoadSignature() {
    const grid = this.sim.grid;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < grid.length; i++) {
      const t = grid[i];
      const flooded = t.roadGround > 0 && !this.isGroundRoadPassable(t);
      const code =
        (t.roadGround & 7) |
        ((t.roadElevated & 3) << 3) |
        (t.ramp ? 16 : 0) |
        ((t.rail & 3) << 5) |
        (t.metro ? 128 : 0) |
        (t.dam ? 256 : 0) |
        (t.roadBridge ? 512 : 0) |
        (flooded ? 1024 : 0);
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
    if (!grid || !grid.length) return;

    const N = GRID_SIZE * GRID_SIZE;
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
    for (let k = v.seg; k < v.path.length - 1; k++) {
      if (!this.isValidRoadStep(v.path[k], v.path[k + 1])) return false;
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
    let newPath = this.findRoadPath(cur.x, cur.z, last.x, last.z, startOnRamp, startLayer);
    if ((!newPath || newPath.length < 2) && v.kind === 'firetruck' && v.fireTargetIdx !== undefined) {
      const bt = this.sim.grid[v.fireTargetIdx];
      if (bt && bt.building && bt.building.fire > 0 && typeof this.sim.findRoadAccess === 'function') {
        const altAcc = this.sim.findRoadAccess(bt.x, bt.z);
        if (altAcc) {
          newPath = this.findRoadPath(cur.x, cur.z, altAcc.rx, altAcc.rz, startOnRamp, startLayer);
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

    this.purgeInvalidShipsAndAircraft();
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
  findRoadPath(sx, sz, ex, ez, startOnRamp = false, startLayer = 0) {
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
              if (this.isGroundRoadPassable(nt) && (!nt.ramp || nrm?.throughGround)) {
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
    const freeTransit = Boolean(this.sim.policies?.freeTransit);

    let origins = null;
    let dests = null;
    let kind = 'car';
    let tripType = 'commute';
    let tripLabel = '👷 通勤上班';

    const roll = Math.random();

    // 1. Municipal Sanitation Service Chain (Waste Plant <-> Zones)
    if (endpoints.W.length > 0 && allZones.length > 0 &&
        activeGarbage < Math.min(10, endpoints.W.length * 4) && roll < 0.14) {
      const outbound = Math.random() < 0.72;
      origins = outbound ? endpoints.W : allZones;
      dests = outbound ? allZones : endpoints.W;
      kind = 'garbagetruck';
      tripType = 'service';
      tripLabel = '🚛 环卫沿街收运垃圾';
    }
    // 2. Industrial Freight Supply Chain (Industry -> Retail Restock OR Industry <-> Seaport / Highway Export)
    else if (roll < 0.38 && endpoints.IND.length > 0 &&
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
    else if (roll < 0.50 && endpoints.GATEWAY.length > 0 &&
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
    else if (roll < 0.74 && endpoints.R.length > 0 && endpoints.SHOP.length > 0) {
      tripType = 'shopping';
      const toShop = Math.random() < 0.62;
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
    // 5. Daily Work Commute Chain (Residential <-> Industrial / Office)
    else if (endpoints.R.length > 0 && endpoints.WORK.length > 0) {
      tripType = 'commute';
      const toWork = Math.random() < 0.58;
      origins = toWork ? endpoints.R : endpoints.WORK;
      dests = toWork ? endpoints.WORK : endpoints.R;
      if (freeTransit && Math.random() < 0.28) {
        kind = 'bus';
        tripLabel = toWork ? '👷 通勤上班' : '🏠 下班返家';
      } else {
        kind = 'car';
        tripLabel = toWork ? '👷 通勤上班' : '🏠 下班返家';
      }
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
    const path = this.findRoadPath(a.rx, a.rz, b.rx, b.rz);
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

    this.spawnTimer += effDt;
    if (this.spawnTimer >= 0.26) {
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
      const isMultiLane =
        !onRampSeg && (
          isElevated ||
          (curTile.roadGround >= 2 && curTile.roadGround !== 4) ||
          (nxtTile.roadGround >= 2 && nxtTile.roadGround !== 4)
        );
      const allowOvertake = isMultiLane && !curTile.ramp && !nxtTile.ramp;

      const roadBoost = isElevated ? 1.55 : (onRampSeg ? 1.32 : (nxtTile.roadGround >= 2 ? 1.25 : 1.0));
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

    // Update 3D Airliners & Cargo Container Ships
    this.updateAircraft(effDt);
    this.updateShips(effDt);
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

Object.assign(__M, { TrafficManager });
})();

// ====== MODULE: renderer3d.js ======
(function () {
const { GRID_SIZE, HALF_GRID, CORNER_STRIDE, inBounds, idx, cIdx, tileToWorld, hash2D } = __M;
const { GLB_ASSETS, SMOKE_PNG_URI } = __M;
const { createTerrainDetailTexture, buildHighResTerrainMesh, buildContinuousRoadAndViaductGroup, createPhysicalWaterMaterial, updatePhysicalWaterUniforms, buildSmoothWaterMesh } = __M;
const { ArchitectureLibrary } = __M;

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
class CityRenderer3D {
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
    this.selectedTile = null;
    this.selectedVehicle = null;

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
      signalLens: new THREE.SphereGeometry(0.026, 6, 5)
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
    } else if (valid === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(1024, 1024);
      this._maxGlowSprites = 24;
      this._maxRenderedVehicles = 80;
    } else {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.sunLight.castShadow = false;
      this._maxGlowSprites = 0;
      this._maxRenderedVehicles = 45;
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
      const sunGeo = new THREE.SphereGeometry(0.8, 12, 8);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.material.color.multiplyScalar(6);
      sun.position.set(6, 6, 3);
      envScene.add(sun);
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const rt = pmrem.fromScene(envScene, 0.02);
      this.scene.environment = rt.texture;
      this.scene.environmentIntensity = 0.55;
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
    if (this.scene.environment) this.scene.environmentIntensity = 0.55 * (1 - night * 0.82);

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

Object.assign(__M, { CityRenderer3D });
})();

// ====== MODULE: ui.js ======
(function () {
const { CATALOG, MILESTONES, LOAN_OFFERS, MAYOR_LEVELS, MAYOR_QUESTS } = __M;
const { tileToWorld } = __M;
const { saveStorage } = __M;

const TOOL_GROUPS = {
  terrain:  ['ter_raise', 'ter_lower', 'ter_flatten', 'ter_spring'],
  road:     ['road_1', 'road_2', 'road_elev', 'road_ramp', 'road_tunnel'],
  rail:     ['metro_line', 'metro_station', 'rail_track', 'hsr_station', 'seaport', 'airport'],
  zones:    ['zone_RL', 'zone_RH', 'zone_CL', 'zone_CH', 'zone_I', 'zone_O', 'dezone'],
  water:    ['water_pipe', 'water_pump', 'sewage_out', 'water_treat', 'waste_plant'],
  power:    ['hydro_dam', 'power_pylon', 'power_wind', 'power_plant', 'solar_plant', 'nuclear_plant'],
  civic:    ['fire_station', 'police_station', 'hospital', 'school', 'park', 'amusement_park', 'stadium', 'landmark'],
  bulldoze: ['bulldoze', 'bulldoze_under']
};
class GameUI {
  constructor(canvas, sim, traffic, disasters, renderer, sfx, assetManager = null) {
    this.canvas = canvas;
    this.sim = sim;
    this.traffic = traffic;
    this.disasters = disasters;
    this.renderer = renderer;
    this.sfx = sfx;
    this.assetManager = assetManager;

    this.activeTool = 'pan';
    this.openCategory = null;
    this.autoOverlayActive = false;

    this.pointers = new Map();
    this.multiTouchGesture = false;
    this.lastPinchDist = 0;
    this.lastPinchAngle = 0;
    this.lastMidX = 0;
    this.lastMidY = 0;

    this.dragStartScreen = null;
    this.dragBuildStart = null;
    this.dragBuildEnd = null;
    this.dragCancelled = false;
    this.rightMouseOrbit = false;
    this.flattenRefElev = null;
    this.lastSculptStamp = 0;

    this.keys = new Set();
    this.muteToasts = false;
    this.guideCollapsed = (sim.guideStep >= MAYOR_QUESTS.length);
    this._userToggledGuide = false;
    this.inspectedVehicle = null;
    this._flyRaf = null;
    this._highlightTimer = null;
    this._questHighlightTimer = null;
    this._toastTimer = null;
    this._toastRemoveTimer = null;
    this.sim.onToast = (msg) => this.showToast(msg);
    this.sim.onLevelUp = (lvObj) => {
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.showToast(
        `🎖️ 晋升 Lv.${lvObj.level}【${lvObj.title}】！奖励 +¥${lvObj.reward.toLocaleString()}，${lvObj.summary}`,
        4500,
        'levelup'
      );
    };
    this.sim.onQuestComplete = (q, lvObj) => {
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      if (lvObj) {
        this.showToast(
          `🎖️ 完成指引 & 晋升 Lv.${lvObj.level}【${lvObj.title}】！共奖励 +¥${(q.rewardMoney + lvObj.reward).toLocaleString()}，${lvObj.summary}`,
          4800,
          'levelup'
        );
      } else {
        this.showToast(
          `✅ 完成指引(第${q.step}/10步)【${q.title}】！奖励 +¥${q.rewardMoney.toLocaleString()} · +${q.rewardXP}XP`,
          3600,
          'levelup'
        );
      }
    };

    this._bindDOM();
    this._bindCanvasInput();
    this._bindKeyboard();
    this.refreshHUD();
  }

  _bindDOM() {
    document.getElementById('city-brand-btn').addEventListener('click', () => {
      this.sfx.tap();
      this.openSaveAndCityModal();
    });

    const mayorLvBtn = document.getElementById('mayor-level-btn');
    if (mayorLvBtn) {
      mayorLvBtn.addEventListener('click', () => {
        this.sfx.tap();
        this.openLevelRoadmapModal();
      });
    }

    const guideCollapseBtn = document.getElementById('guide-collapse-btn');
    if (guideCollapseBtn) {
      guideCollapseBtn.addEventListener('click', () => {
        this.sfx.tap();
        this._userToggledGuide = true;
        this.guideCollapsed = true;
        this.refreshGuideCard();
      });
    }

    const guideChip = document.getElementById('guide-chip');
    if (guideChip) {
      guideChip.addEventListener('click', () => {
        this.sfx.tap();
        this._userToggledGuide = true;
        this.guideCollapsed = false;
        this.refreshGuideCard();
      });
    }

    const guideGoBtn = document.getElementById('guide-go-btn');
    if (guideGoBtn) {
      guideGoBtn.addEventListener('click', () => {
        this.sfx.tap();
        this.handleGuideGoClick();
      });
    }

    document.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sfx.tap();
        this.sim.speed = Number(btn.dataset.speed);
        this.refreshHUD();
      });
    });

    document.getElementById('btn-time-mode').addEventListener('click', () => {
      this.sfx.tap();
      const modes = ['cycle', 'day', 'sunset', 'night'];
      const nxt = modes[(modes.indexOf(this.sim.timeMode) + 1) % modes.length];
      this.sim.timeMode = nxt;
      const labels = { cycle: '🔄 真实慢速昼夜', day: '☀️ 白昼锁定', sunset: '🌆 黄昏锁定', night: '🌙 夜景万家灯火' };
      this.showToast(`光影：${labels[nxt]}`);
      this.refreshHUD();
    });

    const btnIssues = document.getElementById('btn-issues');
    if (btnIssues) {
      btnIssues.addEventListener('click', () => {
        this.sfx.tap();
        this.openIssuesModal('all');
      });
    }

    document.getElementById('btn-budget').addEventListener('click', () => {
      this.sfx.tap();
      this.openBudgetModal();
    });

    document.getElementById('btn-disaster').addEventListener('click', () => {
      this.sfx.tap();
      this.openDisasterModal();
    });

    document.getElementById('btn-menu').addEventListener('click', () => {
      this.sfx.tap();
      this.openSaveAndCityModal();
    });

    const chirperPill = document.getElementById('chirper-pill');
    if (chirperPill) {
      chirperPill.addEventListener('click', () => {
        this.sfx.tap();
        if (typeof this.sim.stepChirper === 'function') {
          this.sim.stepChirper();
          this.refreshHUD();
        }
      });
    }

    // Side floating controls
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      this.sfx.tap();
      this.renderer.camDist = Math.max(5.0, this.renderer.camDist * 0.8);
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      this.sfx.tap();
      this.renderer.camDist = Math.min(60, this.renderer.camDist * 1.25);
    });
    document.getElementById('btn-rot').addEventListener('click', () => {
      this.sfx.tap();
      this.renderer.camYaw += Math.PI / 4;
    });
    document.getElementById('btn-tilt').addEventListener('click', () => {
      this.sfx.tap();
      this.renderer.camPitch = this.renderer.camPitch < 0.50 ? 0.78 : (this.renderer.camPitch < 1.0 ? 1.24 : 0.38);
    });
    document.getElementById('btn-overlay').addEventListener('click', () => {
      this.sfx.tap();
      this.autoOverlayActive = false;
      const modes = ['none', 'underground', 'power', 'landValue', 'traffic'];
      const next = modes[(modes.indexOf(this.renderer.overlayMode) + 1) % modes.length];
      this.renderer.overlayMode = next;
      this.updateOverlayLegend();
    });
    const sfxBtn = document.getElementById('btn-sfx');
    if (sfxBtn) {
      sfxBtn.textContent = this.sfx.enabled ? '🔊' : '🔇';
      sfxBtn.addEventListener('click', (e) => {
        const next = !this.sfx.enabled;
        if (typeof this.sfx.setEnabled === 'function') this.sfx.setEnabled(next);
        else this.sfx.enabled = next;
        e.currentTarget.textContent = this.sfx.enabled ? '🔊' : '🔇';
        if (this.sfx.enabled) this.sfx.tap();
      });
    }

    const xrayBtn = document.getElementById('btn-xray');
    if (xrayBtn) {
      const xrayModes = ['auto', 'all', 'off'];
      const xrayLabels = {
        auto: '👁️ 遮挡虚化：自动（拉近时挡住视线的楼自动半透明）',
        all: '🩻 全城X光：所有建筑半透明，看清道路/地块/车流',
        off: '🚫 遮挡虚化：已关闭'
      };
      xrayBtn.addEventListener('click', () => {
        this.sfx.tap();
        const cur = this.renderer.xrayMode || 'auto';
        const next = xrayModes[(xrayModes.indexOf(cur) + 1) % xrayModes.length];
        this.renderer.xrayMode = next;
        xrayBtn.textContent = next === 'auto' ? '👁️' : (next === 'all' ? '🩻' : '🚫');
        xrayBtn.classList.toggle('active', next !== 'off');
        this.showToast(xrayLabels[next]);
      });
    }

    document.getElementById('cancel-drag-btn').addEventListener('click', () => {
      this.dragCancelled = true;
      this.dragBuildStart = null;
      this.renderer.previewTiles = [];
      this.updateToolHint();
      this.showToast('已取消当前规划');
    });

    document.querySelectorAll('.dock-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sfx.tap();
        const cat = btn.dataset.dock;
        if (cat === 'pan') {
          this.selectTool('pan', null);
        } else if (TOOL_GROUPS[cat]) {
          if (this.openCategory === cat) {
            this.selectTool('pan', null);
          } else {
            const list = TOOL_GROUPS[cat];
            this.openSubToolbar(list, list[0], cat);
          }
        }
      });
    });

    document.getElementById('insp-close-btn').addEventListener('click', () => {
      this.inspectedVehicle = null;
      this.renderer.selectedVehicle = null;
      this.renderer.selectedTile = null;
      this.renderer.previewTiles = [];
      document.getElementById('inspector-card').classList.remove('open');
    });

    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') this.closeModal();
    });
  }

  openSubToolbar(itemIds, defaultToolId, categoryKey) {
    this.openCategory = categoryKey;
    const sub = document.getElementById('sub-toolbar');
    sub.innerHTML = '';
    itemIds.forEach((id) => {
      const item = CATALOG[id];
      const unlocked = this.sim.isToolUnlocked(id);
      const btn = document.createElement('button');
      btn.className = 'sub-item' + (id === defaultToolId ? ' active' : '');
      if (!unlocked) btn.style.opacity = '0.58';
      btn.dataset.toolId = id;
      const costText = !unlocked
        ? `🔒 Lv.${item.unlockLevel || 1}`
        : (this.sim.difficulty === 'sandbox' || item.cost === 0 ? '免费' : `¥${item.cost}`);
      btn.innerHTML = `
        <span class="sub-icon">${item.icon}</span>
        <span class="sub-title">${item.name}</span>
        <span class="sub-cost">${costText}</span>
      `;
      btn.addEventListener('click', () => {
        this.sfx.tap();
        this.selectTool(id, categoryKey, true);
      });
      sub.appendChild(btn);
    });
    sub.classList.add('open');
    this.selectTool(defaultToolId, categoryKey, true);
  }

  refreshSubToolbarUnlocks() {
    const sub = document.getElementById('sub-toolbar');
    if (!sub || !sub.classList.contains('open')) return;
    sub.querySelectorAll('.sub-item').forEach((btn) => {
      const id = btn.dataset.toolId;
      const item = CATALOG[id];
      if (!item) return;
      const unlocked = this.sim.isToolUnlocked(id);
      btn.style.opacity = unlocked ? '1' : '0.58';
      const costEl = btn.querySelector('.sub-cost');
      if (costEl) {
        costEl.textContent = !unlocked
          ? `🔒 Lv.${item.unlockLevel || 1}`
          : (this.sim.difficulty === 'sandbox' || item.cost === 0 ? '免费' : `¥${item.cost}`);
      }
    });
    this.updateToolHint();
  }

  handleGuideGoClick() {
    const status = this.sim.getCurrentQuestStatus();
    if (status.completedAll || !status.quest) {
      this.openLevelRoadmapModal();
      return;
    }

    const recCat = status.evalResult.recCat || status.quest.cat;
    const recTool = status.evalResult.recTool || status.quest.tool;

    if (recCat && TOOL_GROUPS[recCat]) {
      this.openSubToolbar(TOOL_GROUPS[recCat], recTool, recCat);
    }

    document.querySelectorAll('.quest-highlight').forEach((el) => el.classList.remove('quest-highlight'));
    const dockBtn = document.querySelector(`.dock-btn[data-dock="${recCat}"]`);
    const subBtn = document.querySelector(`#sub-toolbar .sub-item[data-tool-id="${recTool}"]`);
    if (dockBtn) dockBtn.classList.add('quest-highlight');
    if (subBtn) {
      subBtn.classList.add('quest-highlight');
      if (typeof subBtn.scrollIntoView === 'function') {
        subBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    if (this._questHighlightTimer) clearTimeout(this._questHighlightTimer);
    this._questHighlightTimer = setTimeout(() => {
      document.querySelectorAll('.quest-highlight').forEach((el) => el.classList.remove('quest-highlight'));
    }, 3600);

    if (!this.sim.isToolUnlocked(recTool)) {
      const reqLv = CATALOG[recTool]?.unlockLevel || 1;
      const reqTier = MAYOR_LEVELS[reqLv - 1] || { popReq: 0, xpReq: 0, title: '' };
      this.showToast(
        `🔒 升至 Lv.${reqLv}【${reqTier.title}】解锁（需 👥人口 ${reqTier.popReq.toLocaleString()} [当前${this.sim.population}] · ⭐经验 ${reqTier.xpReq.toLocaleString()} [当前${this.sim.mayorXP || 0}]）`,
        4000
      );
    }
  }

  refreshGuideCard() {
    const card = document.getElementById('guide-card');
    const chip = document.getElementById('guide-chip');
    if (!card || !chip) return;

    const status = this.sim.getCurrentQuestStatus();
    if (!this._userToggledGuide && status.completedAll && this.sim.unlockAll) {
      this.guideCollapsed = true;
    }
    const chipStep = document.getElementById('guide-chip-step');
    if (chipStep) {
      chipStep.textContent = status.completedAll
        ? '10/10✅'
        : `${status.quest.step}/${status.totalSteps}`;
    }

    if (this.guideCollapsed) {
      card.style.display = 'none';
      chip.style.display = 'inline-flex';
      return;
    }

    card.style.display = 'block';
    chip.style.display = 'none';

    const stepLbl = document.getElementById('guide-step-lbl');
    const stepFill = document.getElementById('guide-step-fill');
    const titleEl = document.getElementById('guide-title');
    const tipEl = document.getElementById('guide-tip');
    const progEl = document.getElementById('guide-prog-text');
    const rewardEl = document.getElementById('guide-reward');
    const goBtn = document.getElementById('guide-go-btn');

    if (status.completedAll) {
      if (stepLbl) stepLbl.textContent = '📋 建城指引 (10/10 已通关)';
      if (stepFill) stepFill.style.width = '100%';
      if (titleEl) titleEl.textContent = '🏆 传奇天际线宗师达成！';
      if (tipEl) tipEl.textContent = '恭喜完成全部 10 步建城法则！可继续扩建摩天都市，或点击查看全等级图鉴。';
      if (progEl) progEl.textContent = status.evalResult.progressText;
      if (rewardEl) rewardEl.textContent = '🎖️ 荣耀通关';
      if (goBtn) goBtn.textContent = '🎖️ 等级图鉴';
      return;
    }

    const q = status.quest;
    const pct = Math.max(8, Math.round(((q.step - 1) / status.totalSteps) * 100));
    if (stepLbl) stepLbl.textContent = `📋 建城指引 (第 ${q.step}/${status.totalSteps} 步)`;
    if (stepFill) stepFill.style.width = `${pct}%`;
    if (titleEl) titleEl.textContent = `${q.step}. ${q.title}`;
    if (tipEl) tipEl.textContent = q.tip;
    if (progEl) progEl.textContent = status.evalResult.progressText;
    if (rewardEl) rewardEl.textContent = `🎁 +¥${q.rewardMoney.toLocaleString()} · +${q.rewardXP}XP`;
    if (goBtn) {
      const recTool = status.evalResult.recTool || q.tool;
      const recItem = CATALOG[recTool];
      goBtn.textContent = recItem ? `👆 去建${recItem.icon}` : '👆 去建造';
    }
  }

  selectTool(toolId, categoryKey = null, keepSubOpen = false) {
    if (this._highlightTimer) {
      clearTimeout(this._highlightTimer);
      this._highlightTimer = null;
    }
    this.inspectedVehicle = null;
    this.activeTool = toolId;
    this.renderer.previewTiles = [];
    this.dragBuildStart = null;

    // Auto X-Ray view for Underground Pipes / Metro, and Power Grid view for Power/Dam tools!
    if (toolId === 'water_pipe' || toolId === 'metro_line' || toolId === 'bulldoze_under') {
      this.renderer.overlayMode = 'underground';
      this.autoOverlayActive = true;
      this.updateOverlayLegend();
    } else if (
      toolId === 'power_pylon' || toolId === 'hydro_dam' || toolId === 'power_wind' ||
      toolId === 'power_plant' || toolId === 'solar_plant' || toolId === 'nuclear_plant'
    ) {
      this.renderer.overlayMode = 'power';
      this.autoOverlayActive = true;
      this.updateOverlayLegend();
    } else if (this.autoOverlayActive) {
      this.renderer.overlayMode = 'none';
      this.autoOverlayActive = false;
      this.updateOverlayLegend();
    }

    if (!keepSubOpen && !categoryKey) {
      this.openCategory = null;
      document.getElementById('sub-toolbar').classList.remove('open');
    } else {
      document.querySelectorAll('#sub-toolbar .sub-item').forEach((el) => {
        el.classList.toggle('active', el.dataset.toolId === toolId);
      });
    }

    document.querySelectorAll('.dock-btn').forEach((btn) => {
      const d = btn.dataset.dock;
      btn.classList.toggle('active', d === toolId || d === categoryKey);
    });

    this.updateToolHint();
  }

  updateToolHint(extraText = '') {
    const hint = document.getElementById('tool-hint');
    const txt = document.getElementById('tool-hint-text');
    const cancelBtn = document.getElementById('cancel-drag-btn');

    if (this.activeTool === 'pan') {
      hint.classList.remove('visible');
      cancelBtn.style.display = 'none';
      return;
    }

    hint.classList.add('visible');
    if (extraText) {
      txt.textContent = extraText;
      cancelBtn.style.display = this.dragBuildStart ? 'inline-block' : 'none';
      return;
    }

    const item = CATALOG[this.activeTool];
    if (item) {
      if (!this.sim.isToolUnlocked(this.activeTool)) {
        const reqLv = item.unlockLevel || 1;
        const reqTier = MAYOR_LEVELS[reqLv - 1] || { popReq: 0, xpReq: 0, title: '' };
        txt.textContent = `🔒 需升至 Lv.${reqLv}【${reqTier.title}】解锁【${item.name}】（👥需人口 ${reqTier.popReq.toLocaleString()} · ⭐需经验 ${reqTier.xpReq.toLocaleString()}）`;
      } else {
        txt.textContent = `${item.icon} ${item.name}：${item.desc}`;
      }
      cancelBtn.style.display = 'none';
    }
  }

  updateOverlayLegend() {
    const el = document.getElementById('overlay-legend');
    const btn = document.getElementById('btn-overlay');
    const mode = this.renderer.overlayMode;
    btn.classList.toggle('active', mode !== 'none');

    if (mode === 'none') {
      el.classList.remove('visible');
    } else {
      el.classList.add('visible');
      if (mode === 'underground') {
        el.innerHTML = `<strong>🔵 地下透视蓝图视图</strong><br>青蓝管线 = 地下输水管（覆盖两侧4格）| 红管 = 地震破裂需抢修<br>亮紫隧道 = 地下地铁线路与运行中的地铁列车`;
      } else if (mode === 'power') {
        el.innerHTML = `<strong>⚡ 高压电网覆盖视图</strong><br>蓝色地块 = 已通电区域 | 远距离电厂/大坝请架设【高压输电铁塔】接力`;
      } else if (mode === 'landValue') {
        el.innerHTML = `<strong>💎 地价热力视图</strong><br>翠绿 = 高地价核心区（可长出 48~64 层摩天大楼）`;
      } else if (mode === 'traffic') {
        el.innerHTML = `<strong>🚦 交通拥堵与工业污染视图</strong><br>红橙色道路 = 严重堵车（会导致商店缺货倒闭！建议架二层高架或修地铁）`;
      }
    }
  }

  _panByScreenDelta(dx, dy) {
    const scale = this.renderer.camDist * 0.0019;
    const sinY = Math.sin(this.renderer.camYaw);
    const cosY = Math.cos(this.renderer.camYaw);
    this.renderer.camTarget[0] -= (dx * cosY + dy * sinY) * scale;
    this.renderer.camTarget[2] -= (-dx * sinY + dy * cosY) * scale;
  }

  _isTerrainBrush(t) {
    return t === 'ter_raise' || t === 'ter_lower' || t === 'ter_flatten';
  }

  _isLinePathTool(t) {
    return (
      t === 'road_1' || t === 'road_2' || t === 'road_elev' || t === 'road_ramp' || t === 'road_tunnel' ||
      t === 'metro_line' || t === 'rail_track' || t === 'water_pipe' || t === 'hydro_dam'
    );
  }

  _isRectTool(t) {
    return t.startsWith('zone_') || t === 'dezone' || t === 'bulldoze' || t === 'bulldoze_under';
  }

  _computePlannedTiles(s, e) {
    if (this.activeTool === 'road_ramp') {
      return this.sim.computeLineOrLPath(s.x, s.z, e.x, e.z, true).slice(0, 4);
    }
    if (this._isLinePathTool(this.activeTool)) {
      const straightOnly = this.activeTool === 'hydro_dam' || this.activeTool === 'road_tunnel';
      return this.sim.computeLineOrLPath(s.x, s.z, e.x, e.z, straightOnly);
    }
    if (this._isRectTool(this.activeTool)) {
      return this.sim.computeRectTiles(s.x, s.z, e.x, e.z);
    }
    return [{ x: e.x, z: e.z }];
  }

  _updateBuildPreview() {
    if (!this.dragBuildStart || !this.dragBuildEnd) return;
    const rawTiles = this._computePlannedTiles(this.dragBuildStart, this.dragBuildEnd);
    const est = this.sim.estimateAction(this.activeTool, rawTiles);
    this.renderer.previewTiles = est.validTiles.length > 0 ? est.validTiles : rawTiles.slice(0, 1);

    if (est.lockedLevel) {
      this.renderer.previewColor = [0.95, 0.25, 0.25];
      const reqTier = MAYOR_LEVELS[est.lockedLevel - 1] || { popReq: 0, xpReq: 0 };
      this.updateToolHint(`🔒 需升至 Lv.${est.lockedLevel} 解锁（👥需人口 ${reqTier.popReq.toLocaleString()} · ⭐需经验 ${reqTier.xpReq.toLocaleString()}）！`);
    } else if (est.validTiles.length === 0) {
      this.renderer.previewColor = [0.95, 0.25, 0.25];
      this.updateToolHint('⚠️ 当前地形坡度过陡或位置受阻（陡坡请用平整台地或穿山隧道）');
    } else if (this.sim.difficulty !== 'sandbox' && !this.activeTool.startsWith('bulldoze') && est.cost > this.sim.money) {
      this.renderer.previewColor = [0.95, 0.25, 0.25];
      this.updateToolHint(`💰 资金不足：需 ¥${est.cost.toLocaleString()} (${est.validTiles.length}格)`);
    } else if (this.activeTool === 'hydro_dam' && est.validTiles.length >= 2 && this.sim.waterPhysics?.evaluateDamSite) {
      const site = this.sim.waterPhysics.evaluateDamSite(est.validTiles);
      if (site) {
        const estHead = Number(site.estHead || 0);
        const estMW = Math.round(site.estMW || 0);
        this.renderer.previewColor = estMW > 25 ? [0.22, 0.92, 0.62] : [0.96, 0.62, 0.14];
        this.updateToolHint(
          `🏗️ 地形勘测：【${site.rating || '一般'}】预估水头 ${estHead.toFixed(1)}m · 满蓄发电 ~${estMW} MW · 造价 ¥${est.cost.toLocaleString()}`
        );
      } else {
        this.renderer.previewColor = [0.25, 0.88, 1.0];
        this.updateToolHint(`🏗️ 规划大坝 ${est.validTiles.length} 段 · 造价 ¥${est.cost.toLocaleString()}（松手确认）`);
      }
    } else if (this.activeTool === 'road_ramp') {
      this.renderer.previewColor = [0.22, 0.92, 0.62];
      const overRoad = est.validTiles.some((p) => (this.sim.getTile(p.x, p.z)?.roadGround || 0) >= 1);
      const modeTxt = overRoad ? '桥下不断流·两侧辅道 + 中央上下匝道' : '平顺缓坡立体匝道';
      this.updateToolHint(`↗️ 规划 ${est.validTiles.length} 格【${modeTxt}】· 造价 ¥${est.cost.toLocaleString()}（松手确认）`);
    } else {
      this.renderer.previewColor = this.activeTool.startsWith('bulldoze') ? [0.98, 0.30, 0.30] : [0.25, 0.88, 1.0];
      const item = CATALOG[this.activeTool];
      this.updateToolHint(`${item.icon} 规划 ${est.validTiles.length} 格 · 造价 ¥${est.cost.toLocaleString()}（松手确认）`);
    }
  }

  _bindCanvasInput() {
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.12 : 0.89;
      this.renderer.camDist = Math.max(5.0, Math.min(60, this.renderer.camDist * factor));
    }, { passive: false });

    this.canvas.addEventListener('pointerdown', (e) => {
      if (this._flyRaf) {
        cancelAnimationFrame(this._flyRaf);
        this._flyRaf = null;
      }
      this.sfx.unlock();
      this.canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.pointers.size >= 2) {
        this.multiTouchGesture = true;
        this.dragBuildStart = null;
        this.renderer.previewTiles = [];
        this.updateToolHint();
        const pts = Array.from(this.pointers.values());
        this.lastPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        this.lastPinchAngle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
        this.lastMidX = (pts[0].x + pts[1].x) * 0.5;
        this.lastMidY = (pts[0].y + pts[1].y) * 0.5;
        return;
      }

      this.multiTouchGesture = false;
      this.dragCancelled = false;
      this.dragStartScreen = { x: e.clientX, y: e.clientY };

      if (e.button === 2) {
        this.rightMouseOrbit = true;
        return;
      }

      if (this.activeTool !== 'pan' && e.button === 0) {
        const hit = this.renderer.screenToGround(e.clientX, e.clientY);
        if (hit && hit.valid) {
          if (this._isTerrainBrush(this.activeTool)) {
            this.flattenRefElev = this.sim.getTileElev(hit.tx, hit.tz);
            this.sim.sculptTerrain(hit.tx, hit.tz, this.activeTool, this.flattenRefElev);
            this.lastSculptStamp = performance.now();
            this.refreshHUD();
          } else if (this.activeTool === 'ter_spring') {
            this.sim.sculptTerrain(hit.tx, hit.tz, 'ter_spring');
            this.refreshHUD();
          } else {
            this.dragBuildStart = { x: hit.tx, z: hit.tz };
            this.dragBuildEnd = { x: hit.tx, z: hit.tz };
            this._updateBuildPreview();
          }
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.pointers.has(e.pointerId)) {
        if (this.activeTool !== 'pan' && this.pointers.size === 0) {
          const hit = this.renderer.screenToGround(e.clientX, e.clientY);
          this.renderer.previewTiles = hit && hit.valid ? [{ x: hit.tx, z: hit.tz }] : [];
        }
        return;
      }

      const prev = this.pointers.get(e.pointerId);
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.pointers.size >= 2) {
        const pts = Array.from(this.pointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
        const midX = (pts[0].x + pts[1].x) * 0.5;
        const midY = (pts[0].y + pts[1].y) * 0.5;

        if (this.lastPinchDist > 12 && dist > 12) {
          this.renderer.camDist = Math.max(5.0, Math.min(60, this.renderer.camDist * (this.lastPinchDist / dist)));
        }
        let dAngle = angle - this.lastPinchAngle;
        if (dAngle > Math.PI) dAngle -= Math.PI * 2;
        if (dAngle < -Math.PI) dAngle += Math.PI * 2;
        if (Math.abs(dAngle) < 0.35) this.renderer.camYaw -= dAngle * 1.15;

        this._panByScreenDelta(midX - this.lastMidX, midY - this.lastMidY);
        this.lastPinchDist = dist;
        this.lastPinchAngle = angle;
        this.lastMidX = midX;
        this.lastMidY = midY;
        return;
      }

      if (this.multiTouchGesture) return;

      if (this.rightMouseOrbit) {
        this.renderer.camYaw -= dx * 0.007;
        this.renderer.camPitch += dy * 0.006;
        return;
      }

      if (this.activeTool === 'pan' || e.button === 1) {
        this._panByScreenDelta(dx, dy);
      } else if (this._isTerrainBrush(this.activeTool)) {
        const now = performance.now();
        if (now - this.lastSculptStamp > 75) {
          const hit = this.renderer.screenToGround(e.clientX, e.clientY);
          if (hit && hit.valid) {
            this.renderer.previewTiles = [{ x: hit.tx, z: hit.tz }];
            this.sim.sculptTerrain(hit.tx, hit.tz, this.activeTool, this.flattenRefElev);
            this.lastSculptStamp = now;
            this.refreshHUD();
          }
        }
      } else if (this.dragBuildStart && !this.dragCancelled) {
        const hit = this.renderer.screenToGround(e.clientX, e.clientY);
        if (hit && hit.valid) {
          if (!this._isLinePathTool(this.activeTool) && !this._isRectTool(this.activeTool)) {
            this.dragBuildStart = { x: hit.tx, z: hit.tz };
          }
          this.dragBuildEnd = { x: hit.tx, z: hit.tz };
          this._updateBuildPreview();
        }
      }
    });

    const finishPointer = (e) => {
      this.pointers.delete(e.pointerId);
      if (e.button === 2) this.rightMouseOrbit = false;
      if (this.pointers.size > 0) return;

      if (this.multiTouchGesture) {
        this.multiTouchGesture = false;
        return;
      }

      if (this.activeTool === 'pan' && this.dragStartScreen && e.button === 0) {
        const moved = Math.hypot(e.clientX - this.dragStartScreen.x, e.clientY - this.dragStartScreen.y);
        if (moved < 9) {
          const hit = this.renderer.screenToGround(e.clientX, e.clientY);
          if (hit && hit.valid) {
            const tappedTile = this.sim.getTile(hit.tx, hit.tz);
            const fallbackW = tileToWorld(hit.tx, hit.tz);
            const wx = typeof hit.wx === 'number' ? hit.wx : fallbackW.wx;
            const wz = typeof hit.wz === 'number' ? hit.wz : fallbackW.wz;
            const veh = (!tappedTile?.building && !tappedTile?.dam)
              ? this.traffic?.findVehicleNearWorld?.(wx, wz, 0.58)
              : null;
            if (veh) {
              this.inspectVehicle(veh);
            } else {
              this.inspectTile(hit.tx, hit.tz);
            }
          }
        }
      } else if (this.dragBuildStart && this.dragBuildEnd && !this.dragCancelled) {
        const tiles = this._computePlannedTiles(this.dragBuildStart, this.dragBuildEnd);
        this.sim.applyTool(this.activeTool, tiles, false);
        this.refreshSubToolbarUnlocks();
        this.refreshHUD();
        this.renderer.previewTiles = [];
      } else if (this.activeTool !== 'pan') {
        this.renderer.previewTiles = [];
      }

      this.dragBuildStart = null;
      this.dragBuildEnd = null;
      this.updateToolHint();
    };

    this.canvas.addEventListener('pointerup', finishPointer);
    this.canvas.addEventListener('pointercancel', finishPointer);
  }

  _bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      this.keys.add(e.key.toLowerCase());
      if (e.key === 'Escape') {
        this.selectTool('pan');
        this.closeModal();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.sim.speed = this.sim.speed === 0 ? 1 : 0;
        this.refreshHUD();
      }
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
  }

  updateKeyboardCamera(dt) {
    if (this.keys.size === 0) return;
    if (this._flyRaf) {
      cancelAnimationFrame(this._flyRaf);
      this._flyRaf = null;
    }
    const speed = this.renderer.camDist * 0.85 * dt;
    const sinY = Math.sin(this.renderer.camYaw), cosY = Math.cos(this.renderer.camYaw);
    if (this.keys.has('w') || this.keys.has('arrowup')) { this.renderer.camTarget[0] -= sinY * speed; this.renderer.camTarget[2] -= cosY * speed; }
    if (this.keys.has('s') || this.keys.has('arrowdown')) { this.renderer.camTarget[0] += sinY * speed; this.renderer.camTarget[2] += cosY * speed; }
    if (this.keys.has('a') || this.keys.has('arrowleft')) { this.renderer.camTarget[0] -= cosY * speed; this.renderer.camTarget[2] += sinY * speed; }
    if (this.keys.has('d') || this.keys.has('arrowright')) { this.renderer.camTarget[0] += cosY * speed; this.renderer.camTarget[2] -= sinY * speed; }
    if (this.keys.has('q')) this.renderer.camYaw -= 1.6 * dt;
    if (this.keys.has('e')) this.renderer.camYaw += 1.6 * dt;
  }

  inspectVehicle(veh, isLiveRefresh = false) {
    if (!veh) return;
    if (!isLiveRefresh) this.sfx.tap();
    this.inspectedVehicle = veh;
    this.renderer.selectedVehicle = veh;

    const card = document.getElementById('inspector-card');
    const titleEl = document.getElementById('insp-title');
    const badgesEl = document.getElementById('insp-badges');
    const gridEl = document.getElementById('insp-grid');
    const actionsEl = document.getElementById('insp-actions');
    const hintEl = document.getElementById('insp-hint');
    const progWrap = document.getElementById('insp-prog-wrap');

    const stuckSec = Number(veh.stuckTimer || 0);
    const rawSpd = Number(veh.speed ?? veh.curSpeed ?? 0);
    const kmh = veh.speedKmh !== undefined ? Math.round(veh.speedKmh) : Math.max(0, Math.round(rawSpd * 32));
    const dx = veh.destTile?.x ?? veh.destTile?.tx;
    const dz = veh.destTile?.z ?? veh.destTile?.tz;
    const hasDest = typeof dx === 'number' && typeof dz === 'number';

    titleEl.textContent = veh.tripLabel ? `🚗 ${veh.tripLabel}` : '🚗 市民/货运车辆追踪';

    let typeBadge = '🚗 市民通勤/消费';
    if (veh.tripType === 'freight') typeBadge = '🚚 工业货运供应链';
    else if (veh.tripType === 'service' || (veh.tripLabel && (veh.tripLabel.includes('垃圾') || veh.tripLabel.includes('消防')))) {
      typeBadge = '🚒 市政特种执勤';
    }

    badgesEl.innerHTML = `
      <span class="badge info">${typeBadge}</span>
      <span class="badge ${stuckSec > 3 ? 'warn' : 'ok'}">
        ${stuckSec > 3 ? `🚦 堵车等待 ${stuckSec.toFixed(1)}s` : '🟢 顺畅行驶中'}
      </span>
    `;

    gridEl.innerHTML = `
      <div class="veh-route-box">
        <div>📍 <strong>出发地：</strong>${veh.fromName || '城区起点'}</div>
        <div style="margin-top:3px;">🏁 <strong>目的地：</strong><span style="color:#7dd3fc;font-weight:700;">${veh.toName || (hasDest ? `地块 (${dx}, ${dz})` : '城际干道')}</span></div>
      </div>
      <div>当前车速：<strong>${kmh} km/h</strong></div>
      <div>受阻等待：<strong>${stuckSec.toFixed(1)} / 12s</strong></div>
    `;

    if (hasDest) {
      this.renderer.selectedTile = { x: dx, z: dz };
      this.renderer.previewTiles = [{ x: dx, z: dz }];
      this.renderer.previewColor = [0.22, 0.92, 0.55];
      if (actionsEl && !isLiveRefresh) {
        actionsEl.style.display = 'flex';
        actionsEl.innerHTML = `
          <button class="btn-secondary" id="btn-jump-veh-dest" style="width:100%;padding:6px 10px;font-size:11.5px;">
            📍 镜头追踪至目的地 (${dx}, ${dz})
          </button>
        `;
        const jumpBtn = document.getElementById('btn-jump-veh-dest');
        if (jumpBtn) {
          jumpBtn.addEventListener('click', () => {
            this.flyToTile(dx, dz);
          });
        }
      }
    } else if (actionsEl && !isLiveRefresh) {
      actionsEl.style.display = 'none';
      actionsEl.innerHTML = '';
    }

    progWrap.style.display = 'none';
    hintEl.textContent = '💡 若路口死锁等待超 12 秒，货车超时会导致商场断货、垃圾车超时会导致小区垃圾成山！可点击拥堵路口切换【🛑 支路让主路】或【🔄 改建环岛】。';
    card.classList.add('open');
  }

  inspectTile(x, z) {
    const t = this.sim.getTile(x, z);
    if (!t) return;
    this.sfx.tap();
    this.inspectedVehicle = null;
    this.renderer.selectedVehicle = null;
    if (!this._flyRaf) {
      this.renderer.previewTiles = [];
    }
    this.renderer.selectedTile = { x, z };
    const card = document.getElementById('inspector-card');
    const titleEl = document.getElementById('insp-title');
    const badgesEl = document.getElementById('insp-badges');
    const gridEl = document.getElementById('insp-grid');
    const actionsEl = document.getElementById('insp-actions');
    const hintEl = document.getElementById('insp-hint');
    const progWrap = document.getElementById('insp-prog-wrap');
    const progFill = document.getElementById('insp-prog-fill');

    if (actionsEl) {
      actionsEl.style.display = 'none';
      actionsEl.innerHTML = '';
    }

    const elev = this.sim.getTileElev(x, z).toFixed(2);
    const wDepth = this.sim.waterDepth[z * 56 + x];

    if (t.dam) {
      const hp = Math.round(t.damHealth ?? 100);
      const rawStress = Number(t.damStress || 0);
      const stressPct = rawStress <= 1.5 ? Math.round(rawStress * 100) : Math.round(rawStress);
      titleEl.textContent = '🏗️ 峡谷水力发电大坝';
      badgesEl.innerHTML = `
        <span class="badge ok">⚡ 实时发电 ${t.damOutputMW || 0} MW</span>
        <span class="badge ${hp >= 75 ? 'ok' : 'warn'}">🛡️ 坝体健康 ${hp}%</span>
        <span class="badge ${stressPct >= 70 ? 'warn' : 'info'}">🌊 水压应力 ${stressPct}%</span>
      `;
      gridEl.innerHTML = `
        <div>全坝总水电：<strong>${this.sim.hydroPowerMW} MW</strong></div>
        <div>坝顶高程：<strong>${t.damCrest.toFixed(2)}m</strong></div>
        <div>坝体耐久：<strong>${hp}%</strong></div>
        <div>地块坐标：<strong>(${x}, ${z})</strong></div>
      `;
      if (hp < 98 && actionsEl) {
        actionsEl.style.display = 'flex';
        const repCostTxt = this.sim.difficulty === 'sandbox' ? '免费' : '¥450';
        actionsEl.innerHTML = `
          <button class="btn-primary" id="btn-repair-dam" style="width:100%;">
            🔧 加固抢修大坝 (${repCostTxt})
          </button>
        `;
        const repBtn = document.getElementById('btn-repair-dam');
        if (repBtn) {
          repBtn.addEventListener('click', () => {
            if (this.sim.repairDamSpan(x, z).ok) {
              this.refreshHUD();
              this.inspectTile(x, z);
            }
          });
        }
      }
      hintEl.textContent = this.sim.getUpgradeHint(t);
      progWrap.style.display = 'none';
    } else if (t.building) {
      const b = t.building;
      const st = this.sim.getBuildingStats(b);
      titleEl.textContent = this.sim.getBuildingDisplayName(b, x, z);

      let badges = '';
      if (b.abandoned) badges += `<span class="badge warn">🏚️ 已荒废停摆</span>`;
      else if (b.level) badges += `<span class="badge info">Lv.${b.level} / ${this.sim.getMaxLevelForZone(b.type)}</span>`;
      badges += t.powered ? `<span class="badge ok">⚡ 通电</span>` : `<span class="badge warn">⚡ 断电</span>`;
      badges += t.watered ? `<span class="badge ok">🔵 通水</span>` : `<span class="badge warn">🔵 缺水管</span>`;
      if (b.fire > 0) badges += `<span class="badge warn">🔥 着火中</span>`;
      if (b.sewageBackedUp) badges += `<span class="badge warn">🚱 污水倒灌</span>`;
      if (b.sick) badges += `<span class="badge warn">🤢 污染致病</span>`;
      if (b.trashPiled) badges += `<span class="badge warn">🗑️ 垃圾堆积</span>`;
      badgesEl.innerHTML = badges;

      gridEl.innerHTML = `
        <div>居住人口：<strong>${st.pop} 人</strong></div>
        <div>就业岗位：<strong>${st.jobs} 个</strong></div>
        <div>海拔 / 地价：<strong>${elev}m / ${Math.round(t.landValue)}</strong></div>
        <div>教育 / 消防：<strong>${Math.round(t.education || 0)} / ${Math.round(t.fireSafety || 0)}</strong></div>
      `;
      hintEl.textContent = this.sim.getUpgradeHint(t);

      if (!b.abandoned && b.level < this.sim.getMaxLevelForZone(b.type) && !b.underConstruction && ['RL','RH','CL','CH','I','O'].includes(b.type)) {
        progWrap.style.display = 'block';
        progFill.style.width = `${Math.min(100, Math.round(b.upgradeProgress || 0))}%`;
      } else {
        progWrap.style.display = 'none';
      }
    } else {
      const deg = (t.roadGround === 1 || t.roadGround === 2) ? this.sim.getRoadIntersectionDegree(x, z) : 0;
      const curJMode = t.junctionMode || 'signal';

      let label = wDepth > 0.08 ? '🌊 天然水体 / 河道' : '⛰️ 自然山河地块';
      if (t.roadElevated > 0 && deg < 3) label = t.ramp ? '↗️ 高架立交上下匝道' : '🌉 二层高架快速路';
      else if (deg >= 3) {
        if (curJMode === 'roundabout') label = '🔄 景观环岛单向流转路口';
        else label = deg >= 4 ? '🚦 四向十字交叉路口' : '🚦 三向丁字交叉路口';
      } else if (t.roadGround === 4) label = '🏔️ 穿山地下公路隧道';
      else if (t.roadGround > 0) label = t.roadGround >= 2 ? '🛤️ 四车道主干道' : '🛣️ 双车道街道';
      else if (t.rail > 0) label = '🚄 高速铁路双线轨道';
      titleEl.textContent = label;

      const jBadgeLabel = {
        signal: '🚦 标准红绿灯',
        yield: '🛑 主路优先(无灯)',
        roundabout: '🔄 环岛流转'
      }[curJMode] || '🚦 标准红绿灯';

      badgesEl.innerHTML = `
        <span class="badge info">海拔 ${elev}m</span>
        ${deg >= 3 ? `<span class="badge ok">${jBadgeLabel}</span>` : ''}
        ${(t.roadGround > 0 || t.roadElevated > 0) && t.outsideConnected === false ? `<span class="badge warn">🚧 未连通城际高速</span>` : ''}
        ${wDepth > 0.08 ? `<span class="badge info">水深 ${wDepth.toFixed(2)}m</span>` : ''}
        ${t.pipe ? `<span class="badge ${t.pipeBroken ? 'warn' : 'ok'}">${t.pipeBroken ? '🔴 水管震裂' : '🔵 已铺地下水管'}</span>` : ''}
        ${t.metro ? `<span class="badge info">🟣 地下地铁隧道</span>` : ''}
      `;
      gridEl.innerHTML = `
        <div>坐标位置：<strong>(${x}, ${z})</strong></div>
        <div>地价评分：<strong>${Math.round(t.landValue)} / 100</strong></div>
        <div>水体污染：<strong>${Math.round((this.sim.waterPoll[z * 56 + x] || 0) * 100)}%</strong></div>
        <div>路面拥堵：<strong>${Math.round((t.congestion || 0) * 100)}%</strong></div>
      `;

      if (deg >= 3 && actionsEl) {
        actionsEl.style.display = 'flex';
        const rbtCost = (t.roundaboutPaid || this.sim.difficulty === 'sandbox') ? '已建/免费' : '¥120';
        actionsEl.innerHTML = `
          <div class="junction-ctrl-lbl">🎛️ 路口交通管制方案（治堵利器）：</div>
          <div class="junction-ctrl-wrap">
            <button class="junction-btn ${curJMode === 'signal' ? 'active' : ''}" data-jmode="signal">
              <span>🚦 标准红绿灯</span>
              <span style="font-size:10px;opacity:0.8;">正交均衡放行</span>
            </button>
            <button class="junction-btn ${curJMode === 'yield' ? 'active' : ''}" data-jmode="yield">
              <span>🛑 支路让主路(无灯)</span>
              <span style="font-size:10px;opacity:0.8;">大道全速直行</span>
            </button>
            <button class="junction-btn ${curJMode === 'roundabout' ? 'active' : ''}" data-jmode="roundabout">
              <span>🔄 改建环岛(${rbtCost})</span>
              <span style="font-size:10px;opacity:0.85;color:#fde68a;">消除红绿灯死锁</span>
            </button>
          </div>
        `;
        actionsEl.querySelectorAll('[data-jmode]').forEach((jbtn) => {
          jbtn.addEventListener('click', () => {
            const nextMode = jbtn.dataset.jmode;
            const res = this.sim.setJunctionMode(x, z, nextMode);
            if (res.ok) {
              this.refreshHUD();
              this.inspectTile(x, z);
            }
          });
        });
        hintEl.textContent = '💡 小支路汇入大道选【🛑 支路让主路】拆红绿灯；四向繁忙十字路口改建【🔄 环岛】可彻底消除排队咬死！';
      } else {
        hintEl.textContent = wDepth > 0.1
          ? '💡 上游干净河岸适合建【抽水站】，西北深V急流峡谷适合横拉【水力发电大坝】！'
          : '💡 在漫游模式下点击路上行驶的【汽车】可追踪其起点、终点与货运/清运任务！';
      }
      progWrap.style.display = 'none';
    }

    card.classList.add('open');
  }

  refreshHUD() {
    document.getElementById('hud-city-name').textContent = this.sim.cityName;
    document.getElementById('hud-city-tier').textContent = `${MILESTONES[this.sim.milestoneIdx].title} · ${this.sim.getFormattedDate()}`;

    const lvInfo = this.sim.getMayorLevelInfo();
    const lvEl = document.getElementById('hud-mayor-lv');
    const lvTitleEl = document.getElementById('hud-mayor-title');
    const xpFillEl = document.getElementById('hud-xp-fill');
    const xpTextEl = document.getElementById('hud-xp-text');
    if (lvEl) lvEl.textContent = `🎖️ Lv.${lvInfo.level}`;
    if (lvTitleEl) lvTitleEl.textContent = lvInfo.title;
    if (xpFillEl) xpFillEl.style.width = `${lvInfo.progressPct}%`;
    if (xpTextEl) {
      xpTextEl.textContent = lvInfo.next
        ? `👥${lvInfo.pop}/${lvInfo.nextPop} · ⭐${lvInfo.xp}/${lvInfo.nextXp}`
        : `🏆 Lv.10 满级都会`;
    }

    if (this.inspectedVehicle && document.getElementById('inspector-card')?.classList.contains('open')) {
      if (Array.isArray(this.traffic?.vehicles) && this.traffic.vehicles.includes(this.inspectedVehicle)) {
        this.inspectVehicle(this.inspectedVehicle, true);
      } else {
        this.inspectedVehicle = null;
        this.renderer.selectedVehicle = null;
        this.renderer.previewTiles = [];
        const badgesEl = document.getElementById('insp-badges');
        if (badgesEl) {
          badgesEl.innerHTML = `<span class="badge ok">✅ 该车辆已抵达终点或结束行程</span>`;
        }
      }
    }

    this.refreshGuideCard();

    const moneyEl = document.getElementById('hud-money');
    moneyEl.textContent = this.sim.difficulty === 'sandbox' ? '∞ 沙盒' : `¥${Math.round(this.sim.money).toLocaleString()}`;
    moneyEl.className = 'stat-val ' + (this.sim.money < 0 ? 'negative' : '');

    const incEl = document.getElementById('hud-income');
    const sign = this.sim.netIncome >= 0 ? '+' : '';
    incEl.textContent = `${sign}¥${this.sim.netIncome}`;
    incEl.className = 'stat-val ' + (this.sim.netIncome >= 0 ? 'positive' : 'negative');

    document.getElementById('hud-pop').textContent = this.sim.population.toLocaleString();

    const happyEl = document.getElementById('hud-happy');
    happyEl.textContent = this.sim.sickCitizens > 0 ? `🤢${this.sim.happiness}%` : `${this.sim.happiness}%`;
    happyEl.className = 'stat-val ' + (this.sim.happiness < 50 ? 'negative' : '');

    const pEl = document.getElementById('hud-power');
    pEl.textContent = `${this.sim.powerDemand}/${this.sim.powerSupply}`;
    pEl.className = 'stat-val ' + (this.sim.powerDemand > this.sim.powerSupply ? 'negative' : 'positive');

    const wEl = document.getElementById('hud-water');
    const sewageOverload = this.sim.waterDemand > (this.sim.sewageSupply || 0) * 1.15;
    wEl.textContent = `${this.sim.waterDemand}/${this.sim.waterSupply}`;
    wEl.className = 'stat-val ' + (
      this.sim.waterDemand > this.sim.waterSupply ||
      this.sim.waterPollutedPct >= 10 ||
      sewageOverload
        ? 'negative'
        : 'positive'
    );

    const trEl = document.getElementById('hud-trash');
    if (trEl) {
      const td = this.sim.trashDemand || 0;
      const ts = this.sim.trashSupply || 0;
      trEl.textContent = `${td}/${ts}`;
      trEl.className = 'stat-val ' + (this.sim.population >= 380 && td > ts ? 'negative' : 'positive');
    }

    if (this.sim.latestChirp) {
      const cu = document.getElementById('chirper-user');
      const ct = document.getElementById('chirper-text');
      if (cu && ct) {
        cu.textContent = this.sim.latestChirp.user;
        ct.textContent = this.sim.latestChirp.text;
      }
    }

    document.getElementById('rci-r').style.height = `${Math.round(this.sim.demand.R * 100)}%`;
    document.getElementById('rci-c').style.height = `${Math.round(this.sim.demand.C * 100)}%`;
    document.getElementById('rci-i').style.height = `${Math.round(this.sim.demand.I * 100)}%`;

    document.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.speed) === this.sim.speed);
    });

    const issueBadge = document.getElementById('hud-issue-count');
    const issueBtn = document.getElementById('btn-issues');
    if (issueBadge && typeof this.sim.getCityIssues === 'function') {
      const report = this.sim.getCityIssues();
      const cnt = report.total;
      issueBadge.textContent = cnt > 99 ? '99+' : String(cnt);
      if (cnt === 0) {
        issueBadge.style.background = 'rgba(34, 197, 94, 0.22)';
        issueBadge.style.color = '#86efac';
        issueBadge.style.border = '1px solid rgba(74, 222, 128, 0.35)';
        if (issueBtn) issueBtn.style.borderColor = '';
      } else if (report.categories.disaster.length > 0 || cnt >= 8) {
        issueBadge.style.background = '#ef4444';
        issueBadge.style.color = '#ffffff';
        issueBadge.style.border = '1px solid #fca5a5';
        if (issueBtn) issueBtn.style.borderColor = 'rgba(248, 113, 113, 0.65)';
      } else {
        issueBadge.style.background = '#f59e0b';
        issueBadge.style.color = '#0f172a';
        issueBadge.style.border = '1px solid #fde68a';
        if (issueBtn) issueBtn.style.borderColor = 'rgba(251, 191, 36, 0.65)';
      }
    }
  }

  flyToTile(x, z) {
    const worldPos = tileToWorld(x, z);
    const elev = this.sim.getTileElev(x, z);
    const startTarget = [
      this.renderer.camTarget[0],
      this.renderer.camTarget[1],
      this.renderer.camTarget[2]
    ];
    const endTarget = [worldPos.wx, elev, worldPos.wz];
    const startDist = this.renderer.camDist;
    const endDist = 13.0;

    if (this._flyRaf) cancelAnimationFrame(this._flyRaf);
    const startTime = performance.now();
    const duration = 450;

    this.selectTool('pan', null);
    this.renderer.selectedTile = { x, z };
    this.renderer.previewTiles = [{ x, z }];
    this.renderer.previewColor = [1.0, 0.76, 0.18];
    this.inspectTile(x, z);

    const step = (now) => {
      const rawT = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - rawT, 3);
      this.renderer.camTarget[0] = startTarget[0] + (endTarget[0] - startTarget[0]) * ease;
      this.renderer.camTarget[1] = startTarget[1] + (endTarget[1] - startTarget[1]) * ease;
      this.renderer.camTarget[2] = startTarget[2] + (endTarget[2] - startTarget[2]) * ease;
      this.renderer.camDist = startDist + (endDist - startDist) * ease;
      if (rawT < 1) {
        this._flyRaf = requestAnimationFrame(step);
      } else {
        this._flyRaf = null;
      }
    };
    this._flyRaf = requestAnimationFrame(step);

    if (this._highlightTimer) clearTimeout(this._highlightTimer);
    this._highlightTimer = setTimeout(() => {
      if (this.activeTool === 'pan') {
        this.renderer.previewTiles = [];
      }
    }, 2200);
  }

  openIssuesModal(activeTab = 'all') {
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '🔔 城市问题定位中心 · 分类诊断与一键跳转';

    const report = this.sim.getCityIssues();
    const cats = report.categories;
    const allItems = [
      ...cats.disaster,
      ...cats.utility,
      ...cats.sanitation,
      ...cats.economy
    ].sort((a, b) => b.severity - a.severity);

    const tabs = [
      { id: 'all', label: `全部 (${report.total})` },
      { id: 'utility', label: `⚡ 水电管网 (${cats.utility.length})` },
      { id: 'sanitation', label: `♻️ 环卫健康 (${cats.sanitation.length})` },
      { id: 'economy', label: `🚦 拥堵经营 (${cats.economy.length})` },
      { id: 'disaster', label: `🏚️ 灾害废弃 (${cats.disaster.length})` }
    ];

    const currentList = activeTab === 'all' ? allItems : (cats[activeTab] || []);
    const displayList = currentList.slice(0, 80);

    body.innerHTML = `
      <div class="modal-section" style="padding-bottom:8px;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
          <button class="${this.muteToasts ? 'btn-danger' : 'btn-secondary'}" id="btn-toggle-mute-toast" style="font-size:12px;padding:6px 11px;">
            ${this.muteToasts ? '🔕 浮动提示开关：已静音' : '🔔 浮动提示开关：开启中'}
          </button>
          ${this.sim.abandonedCount > 0 ? `
            <button class="btn-primary" id="btn-clear-all-abandoned" style="font-size:12px;padding:6px 12px;">
              🚜 一键清理全城废弃楼 (${this.sim.abandonedCount}栋)
            </button>
          ` : `<span style="font-size:11px;color:#94a3b8;">点击任意条目右侧【📍 跳转处理】即可直达对应地块</span>`}
        </div>

        <div class="issue-tabs">
          ${tabs.map((tb) => `
            <button class="issue-tab-btn ${tb.id === activeTab ? 'active' : ''}" data-issue-tab="${tb.id}">
              ${tb.label}
            </button>
          `).join('')}
        </div>

        <div class="issue-list-wrap">
          ${displayList.length === 0 ? `
            <div style="text-align:center;padding:28px 14px;color:#86efac;background:rgba(22,101,52,0.18);border:1px dashed rgba(74,222,128,0.35);border-radius:10px;font-size:13px;">
              ✅ 当前分类下没有任何异常问题，山河大都会运转井然有序！
            </div>
          ` : displayList.map((item) => `
            <div class="issue-item-card">
              <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;">
                  <span style="font-size:15px;">${item.icon}</span>
                  <strong style="color:#f8fafc;font-size:13px;">${item.title}</strong>
                  <span class="badge info" style="font-size:10px;">坐标 (${item.x}, ${item.z})</span>
                </div>
                <div style="font-size:11.5px;color:#fca5a5;line-height:1.4;">${item.reason}</div>
                <div style="font-size:11px;color:#7dd3fc;line-height:1.4;margin-top:2px;">💡 ${item.actionTip}</div>
              </div>
              <button class="btn-primary" data-jump-x="${item.x}" data-jump-z="${item.z}" style="white-space:nowrap;padding:7px 11px;font-size:12px;">
                📍 跳转处理
              </button>
            </div>
          `).join('')}
          ${currentList.length > displayList.length ? `
            <div style="text-align:center;font-size:11px;color:#94a3b8;padding:4px;">
              仅显示前 ${displayList.length} 条高优先级问题（共 ${currentList.length} 条），解决核心管网/环卫后将自动批量消除
            </div>
          ` : ''}
        </div>
      </div>
    `;

    const muteBtn = document.getElementById('btn-toggle-mute-toast');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.sfx.tap();
        this.muteToasts = !this.muteToasts;
        if (this.muteToasts) {
          const tc = document.getElementById('toast-container');
          if (tc) tc.innerHTML = '';
        }
        this.openIssuesModal(activeTab);
      });
    }

    const clearBtn = document.getElementById('btn-clear-all-abandoned');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const res = this.sim.clearAllAbandoned();
        this.refreshHUD();
        this.openIssuesModal(activeTab);
        if (res.cleared > 0) {
          this.showToast(`🚜 已清理全城 ${res.cleared} 栋废弃荒楼（花费 ¥${res.cost}）`);
        }
      });
    }

    body.querySelectorAll('[data-issue-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sfx.tap();
        this.openIssuesModal(btn.dataset.issueTab);
      });
    });

    body.querySelectorAll('[data-jump-x]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tx = Number(btn.dataset.jumpX);
        const tz = Number(btn.dataset.jumpZ);
        this.closeModal();
        this.flyToTile(tx, tz);
      });
    });

    document.getElementById('modal-backdrop').classList.add('open');
  }

  openBudgetModal() {
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '📊 财政预算 · 居民出行车流 · 银行贷款';

    const ms = this.traffic?.modalSplit || {};
    const toPct = (v) => {
      const n = Number(v || 0);
      if (n > 0 && n < 1) return Math.round(n * 100);
      return Math.max(0, Math.round(n));
    };
    const metroPct = toPct(ms.metroSharePct ?? ms.metroPct ?? ms.metroShare ?? ms.metro ?? 0);
    const busPct = toPct(ms.transitPolicyPct ?? ms.busPct ?? ms.transitPct ?? ms.busShare ?? ms.transit ?? (this.sim.policies.freeTransit ? 20 : 0));
    const walkPct = toPct(ms.walkSharePct ?? ms.walkPct ?? ms.walkShare ?? ms.walk ?? 0);
    const seaportPct = toPct(ms.seaportFreightPct ?? ms.seaportPct ?? ms.seaportShare ?? ms.seaport ?? (this.sim.hasSeaport ? 35 : 0));

    const vehList = Array.isArray(this.traffic?.vehicles) ? this.traffic.vehicles : [];
    const fallbackCommute = vehList.filter((v) => v.tripType !== 'freight' && v.tripType !== 'service' && !(v.tripLabel || '').includes('垃圾') && !(v.tripLabel || '').includes('消防')).length;
    const fallbackFreight = vehList.filter((v) => v.tripType === 'freight').length;
    const fallbackService = vehList.filter((v) => v.tripType === 'service' || (v.tripLabel || '').includes('垃圾') || (v.tripLabel || '').includes('消防')).length;

    const commuteCount = ms.activeCommuters ?? ms.commuteCount ?? ms.passengerCount ?? ms.commute ?? fallbackCommute;
    const freightCount = ms.activeFreight ?? ms.freightCount ?? ms.freight ?? fallbackFreight;
    const serviceCount = ms.activeService ?? ms.serviceCount ?? ms.service ?? fallbackService;
    const targetRoadVehicles = ms.targetRoadVehicles ?? Math.max(commuteCount + freightCount + serviceCount, Math.round((this.sim.population || 0) / 35));
    const timeoutCount = ms.gridlockTimeouts ?? ms.abortedTrips ?? ms.timeouts ?? (this.sim.gridlockTimeouts || 0);

    body.innerHTML = `
      <div class="modal-section">
        <h4>💰 每期财政收支明细</h4>
        <div class="insp-grid" style="font-size:12px;">
          <div>税收总收入：<strong style="color:#4ade80">+¥${this.sim.lastTaxIncome}</strong></div>
          <div>基建与部门维护：<strong style="color:#f87171">-¥${this.sim.lastUpkeep}</strong></div>
          <div>银行贷款还本付息：<strong style="color:#fbbf24">-¥${this.sim.lastLoanPay}</strong></div>
          <div>净现金流：<strong>${this.sim.netIncome >= 0 ? '+' : ''}¥${this.sim.netIncome}</strong></div>
          <div>失业率 / 荒废楼宇：<strong>${this.sim.unemploymentPct}% / ${this.sim.abandonedCount}栋</strong></div>
          <div>大坝水电出力：<strong style="color:#38bdf8">${this.sim.hydroPowerMW} MW</strong></div>
          <div style="grid-column: 1 / -1;">供水 / 排污容量：<strong style="color:${this.sim.waterDemand > (this.sim.sewageSupply || 0) * 1.15 ? '#f87171' : '#38bdf8'}">${this.sim.waterSupply} / ${this.sim.sewageSupply}</strong> <span style="color:#94a3b8;font-size:11px;">（当前用水与污水负荷 ${this.sim.waterDemand}）</span></div>
        </div>
      </div>

      <div class="modal-section">
        <h4>🚗 居民出行去向与车流换算总览</h4>
        <div style="font-size:12px;color:#e2e8f0;line-height:1.5;">
          👥 常住人口 <strong>${this.sim.population.toLocaleString()} 人</strong> ➔ 路面目标车流 <strong style="color:#38bdf8">${targetRoadVehicles} 辆</strong>
          <span style="color:#94a3b8;font-size:11px;">（基础每 35 人 1 辆活跃代理车）</span>
        </div>
        <div class="mobility-chips">
          <span class="mobility-chip">🚇 地铁分流 <strong style="color:#a78bfa">-${metroPct}%</strong></span>
          <span class="mobility-chip">🚌 公交政策 <strong style="color:#38bdf8">-${busPct}%</strong></span>
          <span class="mobility-chip">🚶 职住步行 <strong style="color:#4ade80">-${walkPct}%</strong></span>
          <span class="mobility-chip">🚢 海港分流重卡 <strong style="color:#2dd4bf">-${seaportPct}%</strong></span>
        </div>
        <div class="mobility-chips" style="margin-top:6px;">
          <span class="mobility-chip">👷 通勤/购物 <strong>${commuteCount} 辆</strong></span>
          <span class="mobility-chip">🚚 工业货车 <strong>${freightCount} 辆</strong></span>
          <span class="mobility-chip">🚒 市政特种 <strong>${serviceCount} 辆</strong></span>
          <span class="mobility-chip" style="border-color:${timeoutCount > 0 ? 'rgba(248,113,113,0.45)' : 'rgba(148,197,255,0.2)'};">
            ⚠️ 塞车超时放弃 <strong style="color:${timeoutCount > 0 ? '#f87171' : '#cbd5e1'}">${timeoutCount} 次</strong>
          </span>
        </div>
      </div>

      <div class="modal-section">
        <h4>🏛️ 综合税率：<span id="tax-val-lbl">${this.sim.taxRate}%</span>（超过12%市民将抗议撤离！）</h4>
        <div class="slider-row">
          <span>5%</span>
          <input type="range" id="tax-slider" min="5" max="18" step="1" value="${this.sim.taxRate}">
          <span>18%</span>
        </div>
        <h4 style="margin-top:10px;">🎛️ 部门经费预算（前期调低水电预算可大幅省钱防破产！）</h4>
        <div class="slider-row">
          <span>⚡ 电力预算 <strong id="b-pwr-lbl">${this.sim.budgets.power}%</strong></span>
          <input type="range" id="b-pwr" min="50" max="150" step="5" value="${this.sim.budgets.power}">
        </div>
        <div class="slider-row">
          <span>💧 水务预算 <strong id="b-wtr-lbl">${this.sim.budgets.water}%</strong></span>
          <input type="range" id="b-wtr" min="50" max="150" step="5" value="${this.sim.budgets.water}">
        </div>
        <div class="slider-row">
          <span>🚒 市政服务 <strong id="b-svc-lbl">${this.sim.budgets.service}%</strong></span>
          <input type="range" id="b-svc" min="50" max="150" step="5" value="${this.sim.budgets.service}">
        </div>
      </div>

      <div class="modal-section">
        <h4>🏦 市政银行贷款（缺钱建大坝/高铁时可发债融资）</h4>
        ${LOAN_OFFERS.map((off) => {
          const active = this.sim.activeLoans.find((l) => l.id === off.id);
          const reqLv = off.unlockLevel || 2;
          const unlocked = this.sim.unlockAll || this.sim.difficulty === 'sandbox' || (this.sim.mayorLevel || 1) >= reqLv;
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;font-size:12px;">
              <div>
                <strong>${off.name}</strong><br>
                <span style="color:#94a3b8;font-size:11px;">${active ? `待还余额 ¥${active.remaining.toLocaleString()} (每期 -¥${active.periodPay})` : off.desc}</span>
              </div>
              ${active
                ? `<button class="btn-secondary" data-repay="${off.id}">提前结清</button>`
                : (unlocked
                    ? `<button class="btn-primary" data-borrow="${off.id}">贷款 +¥${(off.principal/1000)}k</button>`
                    : `<button class="btn-secondary" style="opacity:0.62;" data-borrow="${off.id}">🔒 Lv.${reqLv} 解锁</button>`)
              }
            </div>
          `;
        }).join('')}
      </div>

      <div class="modal-section">
        <h4>📜 城市法令</h4>
        <label class="policy-toggle">
          <span>🚌 <strong>免费公共交通</strong>（减少路面私家车拥堵）</span>
          <input type="checkbox" id="pol-transit" ${this.sim.policies.freeTransit ? 'checked' : ''}>
        </label>
        <label class="policy-toggle">
          <span>🌿 <strong>绿色环保城市条例</strong>（工业污染减半，提升地价）</span>
          <input type="checkbox" id="pol-green" ${this.sim.policies.greenCity ? 'checked' : ''}>
        </label>
        <label class="policy-toggle">
          <span>🔬 <strong>高科技产业补贴</strong>（提升税收与研发升级速度）</span>
          <input type="checkbox" id="pol-tech" ${this.sim.policies.techBoost ? 'checked' : ''}>
        </label>
      </div>
    `;

    document.getElementById('tax-slider').addEventListener('input', (e) => {
      this.sim.taxRate = Number(e.target.value);
      document.getElementById('tax-val-lbl').textContent = `${this.sim.taxRate}%`;
      this.sim.recomputeNetworksAndFields();
      this.sim.stepEconomy();
      this.refreshHUD();
    });

    const bindBudget = (sliderId, lblId, key) => {
      document.getElementById(sliderId).addEventListener('input', (e) => {
        this.sim.budgets[key] = Number(e.target.value);
        document.getElementById(lblId).textContent = `${this.sim.budgets[key]}%`;
        this.sim.recomputeNetworksAndFields();
        this.sim.stepEconomy();
        this.refreshHUD();
      });
    };
    bindBudget('b-pwr', 'b-pwr-lbl', 'power');
    bindBudget('b-wtr', 'b-wtr-lbl', 'water');
    bindBudget('b-svc', 'b-svc-lbl', 'service');

    body.querySelectorAll('[data-borrow]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.sim.takeLoan(btn.dataset.borrow)) {
          this.refreshHUD();
          this.openBudgetModal();
        }
      });
    });
    body.querySelectorAll('[data-repay]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.sim.repayLoan(btn.dataset.repay)) {
          this.refreshHUD();
          this.openBudgetModal();
        }
      });
    });

    const bindPol = (id, key) => {
      document.getElementById(id).addEventListener('change', (e) => {
        this.sfx.tap();
        this.sim.policies[key] = e.target.checked;
        this.sim.recomputeNetworksAndFields();
        this.sim.stepEconomy();
        this.sim.meshDirty = true;
        this.refreshHUD();
        this.openBudgetModal();
      });
    };
    bindPol('pol-transit', 'freeTransit');
    bindPol('pol-green', 'greenCity');
    bindPol('pol-tech', 'techBoost');

    document.getElementById('modal-backdrop').classList.add('open');
  }

  openDisasterModal() {
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '☄️ 天际线自然灾害与应急演练';
    body.innerHTML = `
      <div class="modal-section">
        <h4>⚡ 立即触发天灾（检验你的大坝、防洪堤与消防队！）</h4>
        <div class="btn-grid">
          <button class="btn-danger" id="dis-meteor">☄️ 陨石撞击（炸出3D弹坑）</button>
          <button class="btn-danger" id="dis-tsunami">🌊 海啸与山洪暴发</button>
          <button class="btn-danger" id="dis-tornado">🌪️ 超级龙卷风过境</button>
          <button class="btn-danger" id="dis-quake">🌍 7.2级强震（震裂水管）</button>
          <button class="btn-secondary" id="dis-fire">🔥 建筑突发大火测试</button>
        </div>
      </div>

      <div class="modal-section">
        <label class="policy-toggle">
          <span>🎲 <strong>开启随机自然灾害挑战</strong>（经营过程中偶发真实天灾考验）</span>
          <input type="checkbox" id="chk-rand-dis" ${this.disasters.randomDisasters ? 'checked' : ''}>
        </label>
      </div>
    `;

    document.getElementById('dis-meteor').addEventListener('click', () => { this.closeModal(); this.disasters.triggerMeteor(); });
    document.getElementById('dis-tsunami').addEventListener('click', () => { this.closeModal(); this.disasters.triggerTsunami(); });
    document.getElementById('dis-tornado').addEventListener('click', () => { this.closeModal(); this.disasters.triggerTornado(); });
    document.getElementById('dis-quake').addEventListener('click', () => { this.closeModal(); this.disasters.triggerEarthquake(); });
    document.getElementById('dis-fire').addEventListener('click', () => { this.closeModal(); this.disasters.triggerFire(); });
    document.getElementById('chk-rand-dis').addEventListener('change', (e) => {
      this.disasters.randomDisasters = e.target.checked;
      this.showToast(e.target.checked ? '⚠️ 已开启随机自然灾害挑战！' : '已关闭随机自然灾害');
    });

    document.getElementById('modal-backdrop').classList.add('open');
  }

  openLevelRoadmapModal() {
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '🎖️ 城市等级双轨解锁路线图 (常住人口 + 施政经验)';

    const lvInfo = this.sim.getMayorLevelInfo();
    const catalogItems = Object.values(CATALOG).filter((it) => it.id !== 'dezone');

    body.innerHTML = `
      <div class="modal-section" style="background:linear-gradient(135deg,rgba(251,191,36,0.12),rgba(14,165,233,0.12));border-color:rgba(251,191,36,0.40);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
          <div style="font-size:15px;font-weight:800;color:#fef3c7;">
            🎖️ 当前规模：Lv.${lvInfo.level} · ${lvInfo.title}
          </div>
          <span class="badge ${this.sim.unlockAll || this.sim.difficulty === 'sandbox' ? 'ok' : 'info'}">
            ${this.sim.unlockAll || this.sim.difficulty === 'sandbox' ? '🔓 全解锁已开启' : `👥 ${lvInfo.pop.toLocaleString()}人 · ⭐ ${lvInfo.xp.toLocaleString()} XP`}
          </span>
        </div>
        <div style="font-size:12px;color:#cbd5e1;margin-bottom:6px;line-height:1.55;">
          ${lvInfo.next
            ? `晋升 <strong style="color:#fde68a;">Lv.${lvInfo.next.level}【${lvInfo.next.title}】</strong> 需同时满足：<br>
               👥 常住人口：<strong>${lvInfo.pop.toLocaleString()} / ${lvInfo.nextPop.toLocaleString()} 人</strong> ${lvInfo.pop >= lvInfo.nextPop ? '<span style="color:#4ade80;">(✅达标)</span>' : `<span style="color:#fbbf24;">(还差 ${(lvInfo.nextPop - lvInfo.pop).toLocaleString()} 人)</span>`} ｜
               ⭐ 施政经验：<strong>${lvInfo.xp.toLocaleString()} / ${lvInfo.nextXp.toLocaleString()} XP</strong> ${lvInfo.xp >= lvInfo.nextXp ? '<span style="color:#4ade80;">(✅达标)</span>' : `<span style="color:#fbbf24;">(还差 ${(lvInfo.nextXp - lvInfo.xp).toLocaleString()} XP)</span>`}`
            : '🏆 您已登顶最高职级【传奇超级都会】，核裂变电站、峡谷水电大坝与国际空港全部解锁！'}
        </div>
        <div class="progress-bar" style="height:8px;margin-top:4px;margin-bottom:8px;">
          <div class="progress-fill" style="width:${lvInfo.progressPct}%;background:linear-gradient(90deg,#fbbf24,#38bdf8);"></div>
        </div>
        <div style="font-size:11px;color:#94a3b8;line-height:1.45;">
          💡 <strong>双轨晋升规则：</strong>遵循《城市：天际线》核心法则——只有<strong>扩建住宅/商业/工业提升常住人口</strong>并配合教育、医疗、公园与畅通交通使楼宇升级，才能稳步迈入万人核能与航空大都会！
        </div>
      </div>

      <div class="roadmap-list">
        ${MAYOR_LEVELS.map((tier) => {
          const isCurrent = tier.level === lvInfo.level;
          const isUnlocked = lvInfo.level >= tier.level || this.sim.unlockAll || this.sim.difficulty === 'sandbox';
          const popMet = (this.sim.population || 0) >= tier.popReq;
          const xpMet = (this.sim.mayorXP || 0) >= tier.xpReq;
          const tierItems = catalogItems.filter((it) => (it.unlockLevel || 1) === tier.level);
          const tierLoans = LOAN_OFFERS.filter((ln) => (ln.unlockLevel || 2) === tier.level);

          return `
            <div class="roadmap-card ${isCurrent ? 'current' : (isUnlocked ? 'unlocked' : 'locked')}">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <strong style="font-size:13.5px;color:${isCurrent ? '#fde68a' : (isUnlocked ? '#f8fafc' : '#cbd5e1')};">
                    Lv.${tier.level} · ${tier.title}
                  </strong>
                  ${isCurrent ? `<span class="badge ok">👈 当前职级</span>` : (isUnlocked ? `<span class="badge info">✅ 已解锁</span>` : '')}
                  ${tier.level > 1 ? `
                    <span class="badge ${isUnlocked || popMet ? 'ok' : 'warn'}">👥 需人口 ${tier.popReq.toLocaleString()}</span>
                    <span class="badge ${isUnlocked || xpMet ? 'ok' : 'warn'}">⭐ 需经验 ${tier.xpReq.toLocaleString()}</span>
                  ` : ''}
                </div>
                <span style="font-size:11.5px;font-weight:700;color:#fbbf24;">
                  ${tier.reward > 0 ? `💰 晋升奖 +¥${tier.reward.toLocaleString()}` : '🌱 初始解锁'}
                </span>
              </div>
              <div class="roadmap-unlocks">
                ${tierItems.map((it) => `
                  <span class="roadmap-unlock-chip">${it.icon} ${it.name}</span>
                `).join('')}
                ${tierLoans.map((ln) => `
                  <span class="roadmap-unlock-chip">🏦 ${ln.name}</span>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('modal-backdrop').classList.add('open');
  }

  openSaveAndCityModal() {
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '🏙️ 经营模式 · 新手教学 · 示范城与存档';

    const slotInfo = (slot) => {
      try {
        const raw = localStorage.getItem(`mini_skylines_pro_slot_${slot}`);
        if (!raw) return '空槽位';
        const d = JSON.parse(raw);
        return `${d.cityName || '存档'} (Lv.${d.mayorLevel || 1} · ¥${Math.round(d.money || 0).toLocaleString()})`;
      } catch {
        return '空槽位';
      }
    };

    body.innerHTML = `
      <div class="modal-section">
        <h4>🎮 经营难度与市长等级开关</h4>
        <div class="btn-grid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:8px;">
          <button class="${this.sim.difficulty === 'hardcore' ? 'btn-primary' : 'btn-secondary'}" data-diff="hardcore">🔥 硬核天际线</button>
          <button class="${this.sim.difficulty === 'normal' ? 'btn-primary' : 'btn-secondary'}" data-diff="normal">⚖️ 标准经营</button>
          <button class="${this.sim.difficulty === 'sandbox' ? 'btn-primary' : 'btn-secondary'}" data-diff="sandbox">♾️ 无限钱沙盒</button>
        </div>
        <label class="policy-toggle">
          <span>🔓 <strong>免等级限制直接解锁核电站/大坝/机场/高铁</strong></span>
          <input type="checkbox" id="chk-unlock-all" ${this.sim.unlockAll ? 'checked' : ''}>
        </label>
        <div style="margin-top:8px;">
          <button class="btn-secondary" id="btn-open-roadmap-from-menu" style="width:100%;font-size:12px;">
            🎖️ 查看《市长等级解锁路线图 (Lv.1 ~ Lv.10)》
          </button>
        </div>
      </div>

      <div class="modal-section">
        <h4>🌆 预设剧本与从零开新档</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn-primary" id="btn-new-tutorial" style="background:linear-gradient(135deg,#059669,#0284c7);">
            🆕 🎓 新手教学从零建城（¥42,000宽裕起步 · 10步手把手建城指引）
          </button>
          <button class="btn-primary" id="btn-load-metro">🏞️ 一键加载【山河立体大都会示范城】（Lv.10满级：大坝+高架立交+高铁+空港）</button>
          <div class="btn-grid">
            <button class="btn-secondary" id="btn-new-starter">🌱 新建【硬核起步山谷镇】</button>
            <button class="btn-secondary" id="btn-new-blank">🗺️ 新建【纯空高山峡谷图】</button>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <h4>🎨 画质档位 & 实景视听设置 (iPhone 性能调优)</h4>
        <div class="btn-grid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:8px;">
          <button class="${(this.renderer.qualityMode || 'high') === 'high' ? 'btn-primary' : 'btn-secondary'}" data-quality="high">✨ 高清旗舰</button>
          <button class="${this.renderer.qualityMode === 'medium' ? 'btn-primary' : 'btn-secondary'}" data-quality="medium">⚖️ 均衡流畅</button>
          <button class="${this.renderer.qualityMode === 'eco' ? 'btn-primary' : 'btn-secondary'}" data-quality="eco">🔋 极致省电</button>
        </div>
        <label class="policy-toggle">
          <span>🎵 <strong>舒缓城市背景乐 (BGM)</strong></span>
          <input type="checkbox" id="chk-bgm-enabled" ${this.sfx.bgmEnabled !== false ? 'checked' : ''}>
        </label>
        <label class="policy-toggle" style="margin-top:5px;">
          <span>🌊 <strong>实景动态环境音 (山风 / 水坝激流 / 城市车声)</strong></span>
          <input type="checkbox" id="chk-ambient-enabled" ${this.sfx.ambientEnabled !== false ? 'checked' : ''}>
        </label>
      </div>

      <div class="modal-section">
        <h4>✈️ iPhone 全离线高清包 (添加到主屏幕后飞行模式畅玩)</h4>
        <div class="cache-status-pill">
          <span id="offline-cache-status">正在检测离线缓存状态...</span>
          <span id="offline-cache-ver" style="color:#7dd3fc;font-size:11px;">v7.0</span>
        </div>
        <div class="cache-bar-track" id="offline-cache-bar"><div class="cache-bar-fill" id="offline-cache-fill"></div></div>
        <div class="btn-grid">
          <button class="btn-primary" id="btn-download-offline">📥 一键下载全量离线包</button>
          <button class="btn-secondary" id="btn-check-update">🔄 检查新版本更新</button>
        </div>
      </div>

      <div class="modal-section">
        <h4>✏️ 城市改名 & 手机双保险离线存档 (IndexedDB)</h4>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <input id="city-name-input" type="text" maxlength="14" value="${this.sim.cityName}"
            style="flex:1;background:#1e293b;border:1px solid #475569;color:#fff;padding:7px 10px;border-radius:9px;font-size:13px;">
          <button class="btn-primary" id="btn-save-name">改名</button>
        </div>
        ${[1, 2, 3].map((s) => `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:7px;font-size:12px;">
            <span id="slot-lbl-${s}" style="color:#cbd5e1;">槽位 ${s}：${slotInfo(s)}</span>
            <div style="display:flex;gap:5px;">
              <button class="btn-secondary" data-save-slot="${s}" style="padding:5px 9px;">保存</button>
              <button class="btn-primary" data-load-slot="${s}" style="padding:5px 9px;">读取</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Graphics tier switcher
    body.querySelectorAll('[data-quality]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sfx.tap();
        const mode = btn.dataset.quality;
        try { localStorage.setItem('ms_quality_tier', mode); } catch {}
        if (typeof this.renderer.setQualityMode === 'function') {
          this.renderer.setQualityMode(mode);
        }
        const labels = {
          high: '✨ 已切换至【高清旗舰】(2048阴影 + 全套PBR法线/粗糙度 + 夜景辉光)',
          medium: '⚖️ 已切换至【均衡流畅】(1024阴影 + 全套PBR贴图，iPhone 高帧推荐)',
          eco: '🔋 已切换至【极致省电】(关闭阴影与高耗特效，低发热超长续航)'
        };
        this.showToast(labels[mode] || '已切换画质');
        this.openSaveAndCityModal();
      });
    });

    const chkBgm = document.getElementById('chk-bgm-enabled');
    if (chkBgm) {
      chkBgm.addEventListener('change', (e) => {
        if (typeof this.sfx.setBgmEnabled === 'function') this.sfx.setBgmEnabled(e.target.checked);
        this.sfx.tap();
        this.showToast(e.target.checked ? '🎵 已开启城市背景音乐' : '🔇 已静音背景音乐');
      });
    }
    const chkAmb = document.getElementById('chk-ambient-enabled');
    if (chkAmb) {
      chkAmb.addEventListener('change', (e) => {
        if (typeof this.sfx.setAmbientEnabled === 'function') this.sfx.setAmbientEnabled(e.target.checked);
        this.sfx.tap();
        this.showToast(e.target.checked ? '🌊 已开启实景动态环境音' : '🔇 已关闭实景环境音');
      });
    }

    // Offline cache pack manager
    const refreshCacheStatus = async () => {
      const statusEl = document.getElementById('offline-cache-status');
      const verEl = document.getElementById('offline-cache-ver');
      if (!statusEl) return;
      if (!this.assetManager || !this.assetManager.isExternalSupported) {
        statusEl.textContent = '📦 当前为本地单文件运行，无需额外离线下载';
        return;
      }
      const st = await this.assetManager.getOfflineCacheStatus();
      if (verEl && st.version) verEl.textContent = st.version;
      const mb = (st.totalBytes / 1024 / 1024).toFixed(1);
      if (!st.supported) {
        statusEl.textContent = '⚠️ 仅 HTTPS / Safari 主屏幕模式支持离线包缓存';
      } else if (st.complete) {
        statusEl.textContent = `✅ 已完整缓存 ${st.cachedCount}/${st.totalCount} 项 (约 ${mb} MB) · 飞行模式畅玩`;
      } else {
        statusEl.textContent = `☁️ 已缓存 ${st.cachedCount}/${st.totalCount} 项 (全包约 ${mb} MB)`;
      }
    };
    refreshCacheStatus();

    const dlBtn = document.getElementById('btn-download-offline');
    if (dlBtn) {
      dlBtn.addEventListener('click', async () => {
        this.sfx.tap();
        if (!this.assetManager || !this.assetManager.isExternalSupported) {
          this.showToast('ℹ️ 请在 iPhone Safari 访问 GitHub Pages 网址并添加到主屏幕使用离线包');
          return;
        }
        dlBtn.disabled = true;
        dlBtn.textContent = '⏳ 正在下载离线资源...';
        const bar = document.getElementById('offline-cache-bar');
        const fill = document.getElementById('offline-cache-fill');
        const statusEl = document.getElementById('offline-cache-status');
        if (bar) bar.classList.add('active');
        const res = await this.assetManager.cacheAllOfflineAssets((frac, done, total) => {
          if (fill) fill.style.width = `${Math.round(frac * 100)}%`;
          if (statusEl) statusEl.textContent = `📥 正在离线缓存 (${done}/${total})...`;
        });
        dlBtn.disabled = false;
        dlBtn.textContent = '📥 一键下载全量离线包';
        if (res.ok) {
          this.sfx.milestone();
          this.showToast(`✈️ 离线高清包已全部就绪 (${res.cached} 项)！开启飞行模式也能完整畅玩！`, 3600);
        } else {
          this.showToast(`⚠️ 离线缓存部分未完成 (${res.cached || 0}/${res.total || 0})，请检查网络后重试`);
        }
        refreshCacheStatus();
      });
    }

    const updBtn = document.getElementById('btn-check-update');
    if (updBtn) {
      updBtn.addEventListener('click', async () => {
        this.sfx.tap();
        if (!this.assetManager) return;
        const r = await this.assetManager.checkForUpdates();
        if (!r.supported) {
          this.showToast('ℹ️ 当前为本地离线模式，无远程更新服务');
        } else if (r.updated) {
          this.showToast('🎉 发现新版本！关闭重开主屏幕图标或刷新页面即可升级');
        } else {
          this.showToast('✅ 当前已是最新旗舰版 v7.0');
        }
      });
    }

    body.querySelectorAll('[data-diff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sfx.tap();
        this.sim.difficulty = btn.dataset.diff;
        if (this.sim.difficulty === 'sandbox') this.sim.unlockAll = true;
        this.sim.stepEconomy();
        this.refreshSubToolbarUnlocks();
        this.refreshHUD();
        this.openSaveAndCityModal();
      });
    });

    document.getElementById('chk-unlock-all').addEventListener('change', (e) => {
      this.sfx.tap();
      this.sim.unlockAll = e.target.checked;
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.showToast(e.target.checked ? '🔓 已解锁全部核电站、大坝、国际机场与高铁地标！' : '🔒 已恢复市长等级 Lv.1~Lv.10 逐步解锁挑战');
    });

    document.getElementById('btn-open-roadmap-from-menu').addEventListener('click', () => {
      this.sfx.tap();
      this.openLevelRoadmapModal();
    });

    document.getElementById('btn-save-name').addEventListener('click', () => {
      const val = document.getElementById('city-name-input').value.trim();
      if (val) {
        this.sim.cityName = val;
        this.refreshHUD();
        this.showToast(`✅ 城市已命名为【${val}】`);
      }
    });

    document.getElementById('btn-new-tutorial').addEventListener('click', () => {
      this.sfx.milestone();
      this.sim.setupTutorialCity(2026);
      this.traffic.reset();
      this._userToggledGuide = false;
      this.guideCollapsed = false;
      const c = tileToWorld(22, 46);
      this.renderer.camTarget = [c.wx, 0.35, c.wz];
      this.renderer.camDist = 21.0;
      this.renderer.camPitch = 0.65;
      this.renderer.camYaw = 0.35;
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.closeModal();
      this.showToast('🎓 新手教学城已开启（启动资金 ¥42,000）！请点击左上角《📋 建城指引》开始第 1 步！', 4200, 'levelup');
    });

    document.getElementById('btn-load-metro').addEventListener('click', () => {
      this.sfx.milestone();
      this.sim.setupMetropolisShowcase();
      this.traffic.reset();
      this._userToggledGuide = false;
      this.guideCollapsed = true;
      const c = tileToWorld(21, 34);
      this.renderer.camTarget = [c.wx, 0.4, c.wz];
      this.renderer.camDist = 26.0;
      this.renderer.camPitch = 0.62;
      this.renderer.camYaw = 0.52;
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.closeModal();
      this.showToast('🏞️ 已加载 Lv.10【山河立体大都会】！西北山谷有水电大坝，城内有高架立交与复兴号高铁');
    });

    document.getElementById('btn-new-starter').addEventListener('click', () => {
      this.sfx.tap();
      this.sim.setupStarterTown(Math.floor(1000 + Math.random() * 8999));
      this.traffic.reset();
      this._userToggledGuide = false;
      this.guideCollapsed = false;
      const c = tileToWorld(22, 45);
      this.renderer.camTarget = [c.wx, 0.35, c.wz];
      this.renderer.camDist = 20.0;
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.closeModal();
      this.showToast('🔥 硬核起步山谷镇已开启！基础水电已就绪，跟随左上角指引扩建城区冲刺 Lv.2！', 3400);
    });

    document.getElementById('btn-new-blank').addEventListener('click', () => {
      this.sfx.tap();
      this.sim.setupBlankMap();
      this.traffic.reset();
      this._userToggledGuide = false;
      this.guideCollapsed = false;
      const c = tileToWorld(22, 46);
      this.renderer.camTarget = [c.wx, 0.35, c.wz];
      this.renderer.camDist = 25.0;
      this.refreshSubToolbarUnlocks();
      this.refreshHUD();
      this.closeModal();
      this.showToast('🗺️ 全新高山峡谷空白地图已生成！可跟随左上角指引一步步升至 Lv.10');
    });

    body.querySelectorAll('[data-save-slot]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const s = btn.dataset.saveSlot;
        try {
          const payload = this.sim.toJSON();
          const ok = await saveStorage.save(`mini_skylines_pro_slot_${s}`, payload);
          const lbl = document.getElementById(`slot-lbl-${s}`);
          if (lbl) lbl.textContent = `槽位 ${s}：${payload.cityName || '存档'} (Lv.${payload.mayorLevel || 1} · ¥${Math.round(payload.money || 0).toLocaleString()})`;
          if (ok) {
            this.sfx.buildCivic();
            this.showToast(`💾 已双保险保存至槽位 ${s} (IndexedDB + 本地)`);
          } else {
            this.showToast('⚠️ 浏览器本地存储空间不足');
          }
        } catch {
          this.showToast('⚠️ 浏览器本地存储空间不足');
        }
      });
    });

    body.querySelectorAll('[data-load-slot]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const s = btn.dataset.loadSlot;
        try {
          const parsed = await saveStorage.load(`mini_skylines_pro_slot_${s}`);
          if (!parsed) { this.showToast(`槽位 ${s} 暂无存档`); return; }
          if (this.sim.fromJSON(parsed)) {
            this.traffic.reset();
            this.refreshSubToolbarUnlocks();
            this.refreshHUD();
            this.closeModal();
            this.sfx.milestone();
            this.showToast(`📂 已读取槽位 ${s}：【${this.sim.cityName}】(Lv.${this.sim.mayorLevel})`);
          }
        } catch {
          this.showToast('⚠️ 读取失败');
        }
      });
    });

    document.getElementById('modal-backdrop').classList.add('open');
  }

  closeModal() {
    document.getElementById('modal-backdrop').classList.remove('open');
  }

  showToast(msg, durationMs = 2400, extraClass = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
      this._toastTimer = null;
    }
    if (this._toastRemoveTimer) {
      clearTimeout(this._toastRemoveTimer);
      this._toastRemoveTimer = null;
    }
    container.innerHTML = '';
    if (this.muteToasts) return;

    const el = document.createElement('div');
    el.className = 'toast' + (extraClass ? ` ${extraClass}` : '');
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
    el.style.display = 'inline-flex';
    el.style.alignItems = 'center';
    el.style.gap = '8px';
    el.title = '点击立即关闭';

    const textSpan = document.createElement('span');
    textSpan.textContent = msg;
    const closeSpan = document.createElement('span');
    closeSpan.textContent = '✖';
    closeSpan.style.opacity = '0.78';
    closeSpan.style.fontSize = '12px';

    el.appendChild(textSpan);
    el.appendChild(closeSpan);
    el.addEventListener('click', () => {
      if (this._toastTimer) clearTimeout(this._toastTimer);
      if (this._toastRemoveTimer) clearTimeout(this._toastRemoveTimer);
      el.remove();
    });

    container.appendChild(el);
    this._toastTimer = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      this._toastRemoveTimer = setTimeout(() => el.remove(), 260);
    }, durationMs);
  }
}

Object.assign(__M, { GameUI });
})();

// ====== MODULE: main.js ======
(function () {
const { SoundFX } = __M;
const { AssetManager, saveStorage } = __M;
const { CitySimulation } = __M;
const { WaterPhysics } = __M;
const { DisasterManager } = __M;
const { TrafficManager } = __M;
const { CityRenderer3D } = __M;
const { GameUI } = __M;
const { tileToWorld, HALF_GRID, inBounds, idx } = __M;

function setSplashProgress(frac, text) {
  const bar = document.getElementById('boot-bar-fill');
  const lbl = document.getElementById('boot-status');
  if (bar) bar.style.width = `${Math.max(5, Math.min(100, Math.round(frac * 100)))}%`;
  if (lbl && text) lbl.textContent = text;
}

function dismissSplash() {
  const el = document.getElementById('boot-splash');
  if (el && !el.classList.contains('hidden')) {
    el.classList.add('hidden');
  }
}

function bootGame() {
  setSplashProgress(0.18, '初始化 WebGL 三维引擎与地形...');
  const canvas = document.getElementById('game-canvas');
  const sfx = new SoundFX();
  const assetManager = new AssetManager('./');
  const sim = new CitySimulation(sfx);
  const waterPhysics = new WaterPhysics(sim);
  sim.waterPhysics = waterPhysics;

  const disasters = new DisasterManager(sim, waterPhysics, sfx);
  const traffic = new TrafficManager(sim);
  sim.traffic = traffic;
  const renderer = new CityRenderer3D(canvas, sim, traffic, disasters, waterPhysics);

  // Restore saved graphics tier (high / medium / eco)
  let savedQuality = 'high';
  try {
    const q = localStorage.getItem('ms_quality_tier');
    if (q === 'high' || q === 'medium' || q === 'eco') savedQuality = q;
  } catch {}
  if (typeof renderer.setQualityMode === 'function') {
    renderer.setQualityMode(savedQuality);
  }

  // Restore offline autosave synchronously from localStorage (instant zero-delay boot!)
  setSplashProgress(0.32, '读取离线城市档案...');
  let restored = false;
  try {
    const autoSync = saveStorage.loadSync('mini_skylines_pro_autosave');
    if (autoSync) {
      restored = sim.fromJSON(autoSync);
    }
  } catch {
    restored = false;
  }

  if (!restored) {
    sim.setupStarterTown(2026);
  }

  const startFocus = tileToWorld(22, 45);
  renderer.camTarget = [startFocus.wx, 0.35, startFocus.wz];
  renderer.camDist = 21.0;
  renderer.camPitch = 0.66;
  renderer.camYaw = 0.50;

  const ui = new GameUI(canvas, sim, traffic, disasters, renderer, sfx, assetManager);
  window.__skylines = { sim, traffic, renderer, ui, disasters, sfx, assetManager, saveStorage };

  traffic.refreshRoadGraph();
  for (let i = 0; i < 10; i++) traffic.trySpawnVehicle();

  // Asynchronous IndexedDB recovery (if localStorage was cleared by iOS) + External Binary PBR Texture Loading
  (async () => {
    if (!restored) {
      try {
        const autoIdb = await Promise.race([
          saveStorage.load('mini_skylines_pro_autosave'),
          new Promise((r) => setTimeout(() => r(null), 650))
        ]);
        if (autoIdb && sim.fromJSON(autoIdb)) {
          restored = true;
          traffic.refreshRoadGraph();
          ui.refreshSubToolbarUnlocks();
          ui.refreshHUD();
        }
      } catch {}
    }

    if (assetManager.isExternalSupported && globalThis.THREE) {
      setSplashProgress(0.45, '加载旗舰 PBR 物理材质包...');
      const pbrPromise = assetManager.loadPBRTextures(globalThis.THREE, {
        quality: savedQuality,
        onProgress: (f, msg) => setSplashProgress(0.45 + f * 0.50, msg)
      });
      const loadedTex = await Promise.race([
        pbrPromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 4200))
      ]);
      if (loadedTex && typeof renderer.applyExternalPBRTextures === 'function') {
        renderer.applyExternalPBRTextures(loadedTex);
      } else if (!loadedTex) {
        pbrPromise.then((tex) => {
          if (tex && typeof renderer.applyExternalPBRTextures === 'function') {
            renderer.applyExternalPBRTextures(tex);
          }
        }).catch(() => {});
      }
    }

    setSplashProgress(1.0, '就绪！欢迎回到山河天际线');
    setTimeout(dismissSplash, 160);
  })();

  setTimeout(() => {
    ui.showToast(
      restored
        ? `👋 已恢复离线进度【${sim.cityName}】(${sim.getFormattedDate()})`
        : '🏞️ 山河天际线 Pro v7.0 已启动！点右上【示范/存档】可切换画质、下载 iPhone 全离线高清包或体验满级大都会'
    );
  }, 550);

  let lastTime = performance.now();
  let hudTimer = 0;
  let saveTimer = 0;
  let audioTimer = 0;

  const saveAuto = () => {
    try {
      saveStorage.saveSyncAndAsync('mini_skylines_pro_autosave', sim.toJSON());
    } catch {}
  };

  window.addEventListener('pagehide', saveAuto);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveAuto();
  });

  function sampleAudioEnv() {
    const cx = Math.floor(renderer.camTarget[0] + HALF_GRID);
    const cz = Math.floor(renderer.camTarget[2] + HALF_GRID);
    let waterSum = 0;
    let damNear = false;
    let samples = 0;
    for (let dz = -3; dz <= 3; dz++) {
      for (let dx = -3; dx <= 3; dx++) {
        const tx = cx + dx, tz = cz + dz;
        if (!inBounds(tx, tz)) continue;
        samples++;
        const i = idx(tx, tz);
        if (sim.waterDepth[i] > 0.08) waterSum += 1;
        if (sim.grid[i].dam) damNear = true;
      }
    }
    const focusElev = inBounds(cx, cz) ? sim.getTileElev(cx, cz) : 0.3;
    const sunAngle = (sim.dayProgress - 0.25) * Math.PI * 2;
    const night = Math.max(0, Math.min(1, (-Math.sin(sunAngle) + 0.16) / 0.42));
    return {
      camDist: renderer.camDist,
      focusElev,
      waterNear: samples > 0 ? Math.min(1, (waterSum / samples) * 2.5) : 0,
      damNear,
      population: sim.population || 0,
      night,
      disasterActive: Boolean((disasters.meteors && disasters.meteors.length > 0) || disasters.tornado || disasters.shakeTime > 0)
    };
  }

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    ui.updateKeyboardCamera(dt);
    sim.update(dt);
    disasters.update(dt);
    traffic.update(dt);
    renderer.render(dt);

    audioTimer += dt;
    if (audioTimer >= 0.12) {
      if (typeof sfx.update === 'function') sfx.update(audioTimer, sampleAudioEnv());
      audioTimer = 0;
    }

    hudTimer += dt;
    if (hudTimer >= 0.4) {
      hudTimer = 0;
      ui.refreshHUD();
    }

    saveTimer += dt;
    if (saveTimer >= 15.0) {
      saveTimer = 0;
      saveAuto();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootGame);
} else {
  bootGame();
}
})();

})();
