// iOS-Unlocked WebAudio Procedural SFX + Dynamic City Ambient Soundscape + Soothing Procedural BGM
export class SoundFX {
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
    this._rainGain = null;
    this._thunderAccum = 8.0;

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
      if (this._rainGain) this._rampParam(this._rainGain.gain, 0.0001, now, 0.15);
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
      const rain = makeLayer('bandpass', 1850, 0.55);

      this._windFilter = wind.flt;
      this._windGain = wind.g;
      this._waterGain = water.g;
      this._cityGain = city.g;
      this._rainGain = rain.g;
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
        const rainLevel = Math.max(0, Math.min(1, state.rainIntensity || 0));
        if (this._rainGain) {
          this._rampParam(this._rainGain.gain, Math.max(0.0001, rainLevel * 0.072), now, 0.35);
        }
        if (this._windFilter) {
          this._rampParam(this._windFilter.frequency, 340 + Math.sin(now * 0.35) * 90 + elev * 80 + rainLevel * 140, now, 0.4);
        }

        // Distant atmospheric thunder rumbles during thunderstorms
        if (state.weatherState === 'storm' && !state.disasterActive) {
          this._thunderAccum -= dt;
          if (this._thunderAccum <= 0) {
            this._thunderAccum = 9.0 + Math.random() * 14.0;
            this._playThunder();
          }
        }

        // Occasional gentle daytime bird chirp near green areas (silent during rain/storm/snow)
        this._chirpAccum -= dt;
        if (this._chirpAccum <= 0) {
          this._chirpAccum = 6.5 + Math.random() * 9.0;
          if (night < 0.35 && camDist < 28 && rainLevel < 0.2 && state.weatherState !== 'snow' && !state.disasterActive) {
            this._playBirdChirp();
          }
        }
      } else {
        this._rampParam(this._windGain.gain, 0.0001, now, 0.15);
        this._rampParam(this._waterGain.gain, 0.0001, now, 0.15);
        this._rampParam(this._cityGain.gain, 0.0001, now, 0.15);
        if (this._rainGain) this._rampParam(this._rainGain.gain, 0.0001, now, 0.15);
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

  _playThunder() {
    if (!this.ctx || !this._masterGain) return;
    this.tone(76, 34, 1.45, 'triangle', 0.042, 0);
    this.tone(54, 28, 1.85, 'sine', 0.038, 0.18);
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
