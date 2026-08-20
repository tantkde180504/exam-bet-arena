/**
 * Web Audio API Sound Synthesizer
 * Provides instant, zero-dependency sound effects for Exam Bet Arena
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Quick UI Click Blip
  playClick() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Gavel / Chốt Kèo Impact Sound
  playGavel() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.3);

    subGain.gain.setValueAtTime(0.3, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.35);

    // High metal ring
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(1200, t);
    ringOsc.frequency.exponentialRampToValueAtTime(880, t + 0.5);

    ringGain.gain.setValueAtTime(0.18, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    ringOsc.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ringOsc.start(t);
    ringOsc.stop(t + 0.5);
  }

  // Victory Fanfare / Mở Bát Thắng Cuộc
  playVictory() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      gain.gain.setValueAtTime(0.001, t + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + (idx === 3 ? 0.8 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + (idx === 3 ? 0.8 : 0.25));
    });
  }

  // Defeat / Thua Kèo Sound
  playDefeat() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.2);

      gain.gain.setValueAtTime(0.15, t + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.2 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.2);
      osc.stop(t + idx * 0.2 + 0.25);
    });
  }
}

const soundEngine = new SoundEngine();
