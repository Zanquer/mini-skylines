import { SoundFX } from './audio.js';
import { CitySimulation } from './simulation.js';
import { WaterPhysics } from './water_physics.js';
import { DisasterManager } from './disasters.js';
import { TrafficManager } from './traffic.js';
import { CityRenderer3D } from './renderer3d.js';
import { GameUI } from './ui.js';
import { tileToWorld } from './mapgen.js';

function bootGame() {
  const canvas = document.getElementById('game-canvas');
  const sfx = new SoundFX();
  const sim = new CitySimulation(sfx);
  const waterPhysics = new WaterPhysics(sim);
  sim.waterPhysics = waterPhysics;

  const disasters = new DisasterManager(sim, waterPhysics, sfx);
  const traffic = new TrafficManager(sim);
  sim.traffic = traffic;
  const renderer = new CityRenderer3D(canvas, sim, traffic, disasters, waterPhysics);

  // Restore Pro v3 offline autosave or launch Hardcore Starter Canyon Town
  let restored = false;
  try {
    const auto = localStorage.getItem('mini_skylines_pro_autosave');
    if (auto) {
      restored = sim.fromJSON(JSON.parse(auto));
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

  const ui = new GameUI(canvas, sim, traffic, disasters, renderer, sfx);
  window.__skylines = { sim, traffic, renderer, ui, disasters };

  traffic.refreshRoadGraph();
  for (let i = 0; i < 10; i++) traffic.trySpawnVehicle();

  setTimeout(() => {
    ui.showToast(
      restored
        ? `👋 已恢复离线进度【${sim.cityName}】(${sim.getFormattedDate()})`
        : '🏞️ 硬核天际线 Pro 已启动！左上角高山峡谷可筑水电大坝，点右上【示范/存档】可一键看全系统立体大都会'
    );
  }, 450);

  let lastTime = performance.now();
  let hudTimer = 0;
  let saveTimer = 0;

  const saveAuto = () => {
    try {
      localStorage.setItem('mini_skylines_pro_autosave', JSON.stringify(sim.toJSON()));
    } catch {}
  };

  window.addEventListener('pagehide', saveAuto);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveAuto();
  });

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    ui.updateKeyboardCamera(dt);
    sim.update(dt);
    disasters.update(dt);
    traffic.update(dt);
    renderer.render(dt);

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
