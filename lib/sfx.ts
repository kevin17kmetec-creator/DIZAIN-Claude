// Preprosti 8-bitni zvoki prek Web Audio. Privzeto izklopljeni, vklopi jih uporabnik.
let ctx: AudioContext | null = null;
let enabled = false;
try { enabled = localStorage.getItem('dizain-sfx') === '1'; } catch { /* ignore */ }

const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
};

export const sfx = {
  get enabled() { return enabled; },
  set(on: boolean) {
    enabled = on;
    try { localStorage.setItem('dizain-sfx', on ? '1' : '0'); } catch { /* ignore */ }
    if (on) sfx.coin();
  },
  tone(freq: number, dur = 0.08, type: OscillatorType = 'square', vol = 0.05, when = 0) {
    if (!enabled) return;
    const c = audio();
    if (!c) return;
    const t0 = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur);
  },
  blip() { sfx.tone(660, 0.05); },
  select() { sfx.tone(440, 0.06); sfx.tone(880, 0.08, 'square', 0.05, 0.06); },
  coin() { sfx.tone(988, 0.07); sfx.tone(1319, 0.2, 'square', 0.05, 0.07); },
  hit() { sfx.tone(220, 0.06, 'square', 0.06); },
  lose() { sfx.tone(300, 0.15, 'sawtooth'); sfx.tone(200, 0.3, 'sawtooth', 0.05, 0.15); },
  win() { [523, 659, 784, 1047].forEach((f, i) => sfx.tone(f, 0.12, 'square', 0.05, i * 0.1)); },
};
