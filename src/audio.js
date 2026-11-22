// Zero-asset WebAudio procedural SFX for Mini Skylines Pro 2.0
export class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastUpgradeTime = 0;
    this.lastSculptTime = 0;
  }

  unlock() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  tone(freq, endFreq, dur, type = 'sine', vol = 0.07, delay = 0) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.ctx) return;
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
    gain.connect(this.ctx.destination);
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
    const t = performance.now();
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
    const t = performance.now();
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
