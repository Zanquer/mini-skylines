import { GRID_SIZE, inBounds, idx, cIdx, tileToWorld, worldToTile } from './mapgen.js';

export class DisasterManager {
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
        let changed = false;
        if (t.trees > 0) {
          t.trees = 0;
          changed = true;
        }
        if (t.pylon && Math.random() < dt * 2.5) {
          t.pylon = false;
          this.sim.recomputeNetworksAndFields();
          changed = true;
        }
        if (t.building && Math.random() < dt * 1.8 && t.building.type !== 'landmark') {
          t.building = null;
          this.sim.recomputeNetworksAndFields();
          changed = true;
        }
        if (changed) {
          this._notifyTransportChanged();
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
