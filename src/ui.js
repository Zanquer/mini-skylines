import { CATALOG, MILESTONES, LOAN_OFFERS, MAYOR_LEVELS, MAYOR_QUESTS } from './simulation.js';
import { tileToWorld } from './mapgen.js';

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

export class GameUI {
  constructor(canvas, sim, traffic, disasters, renderer, sfx) {
    this.canvas = canvas;
    this.sim = sim;
    this.traffic = traffic;
    this.disasters = disasters;
    this.renderer = renderer;
    this.sfx = sfx;

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
    document.getElementById('btn-sfx').addEventListener('click', (e) => {
      this.sfx.enabled = !this.sfx.enabled;
      e.currentTarget.textContent = this.sfx.enabled ? '🔊' : '🔇';
      if (this.sfx.enabled) this.sfx.tap();
    });

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
        <h4>✏️ 城市改名 & 手机离线存档</h4>
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
      btn.addEventListener('click', () => {
        const s = btn.dataset.saveSlot;
        try {
          localStorage.setItem(`mini_skylines_pro_slot_${s}`, JSON.stringify(this.sim.toJSON()));
          document.getElementById(`slot-lbl-${s}`).textContent = `槽位 ${s}：${slotInfo(s)}`;
          this.sfx.buildCivic();
          this.showToast(`💾 已保存至离线槽位 ${s}`);
        } catch {
          this.showToast('⚠️ 浏览器本地存储空间不足');
        }
      });
    });

    body.querySelectorAll('[data-load-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = btn.dataset.loadSlot;
        try {
          const raw = localStorage.getItem(`mini_skylines_pro_slot_${s}`);
          if (!raw) { this.showToast(`槽位 ${s} 暂无存档`); return; }
          if (this.sim.fromJSON(JSON.parse(raw))) {
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
