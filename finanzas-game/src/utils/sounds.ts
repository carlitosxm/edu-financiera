// src/utils/sounds.ts
class SoundEngine {
    private ctx: AudioContext | null = null;
    private init() { if (!this.ctx) this.ctx = new AudioContext(); }
  
    // Sonido tipo moneda (Para compras)
    playCoin() {
      this.init(); if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(987, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1318, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.3);
    }
  
    // Sonido de Caja Registradora "Cha-Ching" (Vuelto correcto)
    playRegister() {
      this.init(); if (!this.ctx) return;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(1400 + (i * 250), this.ctx.currentTime + (i * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15 + (i * 0.04));
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + (i * 0.04)); osc.stop(this.ctx.currentTime + 0.2);
      }
    }
  
    // Sonido de Error grave (Vuelto incorrecto/Quiebra)
    playError() {
      this.init(); if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.25);
    }
  }
  
  export const sounds = new SoundEngine();