import { SoundFX } from './audio.js';
import { AssetManager, saveStorage } from './asset_loader.js';
import { CitySimulation } from './simulation.js';
import { WaterPhysics } from './water_physics.js';
import { DisasterManager } from './disasters.js';
import { TrafficManager } from './traffic.js';
import { CityRenderer3D } from './renderer3d.js';
import { GameUI } from './ui.js';
import { tileToWorld, HALF_GRID, inBounds, idx } from './mapgen.js';

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
      setSplashProgress(0.45, '流式加载高清 PBR 主贴图（双桶缓存秒开）...');
      let resolveAlbedo = null;
      const albedoReadyPromise = new Promise((res) => { resolveAlbedo = res; });
      let albedoDone = false;
      const pbrPromise = assetManager.loadPBRTextures(globalThis.THREE, {
        quality: savedQuality,
        onProgress: (f, msg) => {
          if (!albedoDone) setSplashProgress(0.45 + f * 0.50, msg);
        },
        onSuiteUpdate: (tex) => {
          if (tex && typeof renderer.applyExternalPBRTextures === 'function') {
            renderer.applyExternalPBRTextures(tex);
          }
        },
        onAlbedoReady: (tex) => {
          albedoDone = true;
          if (tex && typeof renderer.applyExternalPBRTextures === 'function') {
            renderer.applyExternalPBRTextures(tex);
          }
          if (resolveAlbedo) resolveAlbedo(tex);
        }
      });
      // Only wait up to 2.4s for the 14 lightweight Albedo color maps, then enter immediately while Normal/Roughness & GLBs stream live!
      await Promise.race([
        albedoReadyPromise,
        pbrPromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 2400))
      ]);
      pbrPromise.then((tex) => {
        if (tex && typeof renderer.applyExternalPBRTextures === 'function') {
          renderer.applyExternalPBRTextures(tex);
        }
      }).catch(() => {});

      // Stream CC0 3D GLB pack (Zoo Wildlife Animals + Kenney Vehicles/Villas/Boats) asynchronously in background
      if (typeof assetManager.loadGLBModels === 'function') {
        assetManager.loadGLBModels(globalThis.THREE).then((glbs) => {
          if (glbs && typeof renderer.applyExternalGLBModels === 'function') {
            renderer.applyExternalGLBModels(glbs);
          }
        }).catch(() => {});
      }
    }

    setSplashProgress(1.0, '就绪！欢迎回到山河天际线');
    setTimeout(dismissSplash, 140);
  })();

  setTimeout(() => {
    ui.showToast(
      restored
        ? `👋 已恢复离线进度【${sim.cityName}】(${sim.getFormattedDate()})`
        : '🏞️ 山河天际线 Pro v8.5 已启动！全尺寸物理防穿模、行人避车、高架零倒车与未竣工封闭全面升级！'
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
    const wObj = sim.weather || { state: 'clear', intensity: 0 };
    const rainInt = (wObj.state === 'rain' || wObj.state === 'storm') ? Math.max(0.35, wObj.intensity || 0.7) : 0;
    return {
      camDist: renderer.camDist,
      focusElev,
      waterNear: samples > 0 ? Math.min(1, (waterSum / samples) * 2.5) : 0,
      damNear,
      population: sim.population || 0,
      night,
      rainIntensity: rainInt,
      weatherState: wObj.state || 'clear',
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
