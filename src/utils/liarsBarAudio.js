/**
 * Procedural Web Audio API Sound Synthesizer for Liar's Bar
 * 100% Code-based: Zero external audio files (.mp3/.wav)!
 */

class LiarsBarAudioEngine {
  constructor() {
    this.ctx = null;
    this.heartbeatTimer = null;
    this.heartbeatRate = 1.0;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Helper: White noise buffer
   */
  createNoiseBuffer(duration = 0.5) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Card sliding / dealing on felt: Filtered white noise with bandpass sweep
   */
  playCardSlide() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.25);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);
    } catch (e) {}
  }

  /**
   * Card flip click: Snappy high-frequency click + subtle low knock
   */
  playCardFlip() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Low thump
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.13);
    } catch (e) {}
  }

  /**
   * Card Select / Hover: Subtle wooden tactile click
   */
  playCardSelect() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  /**
   * Challenge slammed: "YALANCI!" Table slam + deep dramatic impact chord
   */
  playLiarCall() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Heavy sub slam (45Hz)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.6);

      subGain.gain.setValueAtTime(0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.75);

      // Noise table thump
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.35);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.5, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.36);

      // Dramatic tension brass stabs (diminished chord)
      const freqs = [185, 220, 261]; // F#3, A3, C4
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);

        const bFilter = this.ctx.createBiquadFilter();
        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(1400, now);
        bFilter.frequency.exponentialRampToValueAtTime(300, now + 0.8);

        g.gain.setValueAtTime(0.15 / (idx + 1), now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(bFilter);
        bFilter.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    } catch (e) {}
  }

  /**
   * Heartbeat pulse for bomb defusal screen
   */
  playSingleHeartbeat(intense = false) {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(intense ? 68 : 55, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain1.gain.setValueAtTime(intense ? 0.6 : 0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Dub (slightly quieter and delayed)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(intense ? 60 : 48, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.32);

      gain2.gain.setValueAtTime(intense ? 0.45 : 0.28, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  startHeartbeatLoop(bpm = 75) {
    this.stopHeartbeatLoop();
    const interval = (60 / bpm) * 1000;
    this.playSingleHeartbeat(bpm > 100);
    this.heartbeatTimer = setInterval(() => {
      this.playSingleHeartbeat(bpm > 100);
    }, interval);
  }

  stopHeartbeatLoop() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Wire snip: Metal clipper snap + electric spark sizzle
   */
  playWireSnip() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Metallic clipper snap
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Electrical spark crackle
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.2);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2500, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.35, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.2);
    } catch (e) {}
  }

  /**
   * Safe wire survival: Warm chime + exhale sigh of relief
   */
  playSafeSigh() {
    this.init();
    if (!this.ctx) return;
    try {
      this.stopHeartbeatLoop();
      const now = this.ctx.currentTime;

      // Resonant safe chime (E5 -> G#5 -> B5 major chord)
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        g.gain.setValueAtTime(0.001, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + 1.25);
      });

      // Warm exhale sigh (filtered breath noise)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(1.0);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.9);
      filter.Q.setValueAtTime(1.5, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.01, now + 0.15);
      nGain.gain.linearRampToValueAtTime(0.2, now + 0.35);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now + 0.15);
      noise.stop(now + 1.0);
    } catch (e) {}
  }

  /**
   * Catastrophic Bomb Explosion: Deep sub-bass boom + shockwave noise + distortion
   */
  playExplosion() {
    this.init();
    if (!this.ctx) return;
    try {
      this.stopHeartbeatLoop();
      const now = this.ctx.currentTime;

      // 1. Instant sharp detonation crack
      const crackOsc = this.ctx.createOscillator();
      const crackGain = this.ctx.createGain();
      crackOsc.type = 'sawtooth';
      crackOsc.frequency.setValueAtTime(320, now);
      crackOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      crackGain.gain.setValueAtTime(0.8, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      crackOsc.connect(crackGain);
      crackGain.connect(this.ctx.destination);
      crackOsc.start(now);
      crackOsc.stop(now + 0.2);

      // 2. Heavy sub-bass earthquake rumble (30Hz)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(120, now);
      sub.frequency.exponentialRampToValueAtTime(26, now + 1.8);

      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 2.1);

      // 3. Fireball shockwave roar (brown noise explosion)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(2.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 2.0);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.9, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 2.2);
    } catch (e) {}
  }

  /**
   * Noir Victory Fanfare
   */
  playWinFanfare() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const melody = [
        { f: 293.66, t: 0.0, d: 0.25 }, // D4
        { f: 349.23, t: 0.25, d: 0.25 }, // F4
        { f: 440.00, t: 0.5, d: 0.35 },  // A4
        { f: 587.33, t: 0.9, d: 0.85 }   // D5
      ];

      melody.forEach(n => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        g.gain.setValueAtTime(0.01, now + n.t);
        g.gain.linearRampToValueAtTime(0.3, now + n.t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    } catch (e) {}
  }
}

export const liarsAudio = new LiarsBarAudioEngine();
