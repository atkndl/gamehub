// Web Audio API Synthesizer for high performance zero-network audio effects
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(val) {
    this.enabled = typeof val === 'boolean' ? val : !this.enabled;
    return this.enabled;
  }

  playKey() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playTileReveal(status, index = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const delay = index * 0.1;
      const startTime = this.ctx.currentTime + delay;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = 260; // absent (gray)
      if (status === 'present') freq = 390; // yellow
      if (status === 'correct') freq = 520 + (index * 40); // green

      osc.type = status === 'correct' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    } catch (e) {}
  }

  playError() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playWordSolved() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554, 659, 880]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  }

  playGameWin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const chords = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.36 }
      ];
      chords.forEach(({ f, t }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch (e) {}
  }
}

export const sound = new SoundFX();
