import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { sfx } from '../../lib/sfx';

const W = 640;
const H = 360;
const COLS = 10;
const ROWS = 5;
const BW = W / COLS;
const BH = 20;

type State = 'idle' | 'playing' | 'won' | 'lost';

// Mini igra Breakout, narejena samo s canvasom
const Breakout: React.FC = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const stateRef = useRef<State>('idle');
  const game = useRef({
    px: W / 2, bx: W / 2, by: H - 40, vx: 3, vy: -3.4, bricks: [] as boolean[], score: 0, lives: 3, keys: { l: false, r: false }, visible: true,
  });

  const reset = () => {
    const g = game.current;
    g.px = W / 2; g.bx = W / 2; g.by = H - 40; g.vx = (Math.random() > 0.5 ? 1 : -1) * 3; g.vy = -3.4;
    g.bricks = Array(COLS * ROWS).fill(true); g.score = 0; g.lives = 3;
    setScore(0); setLives(3);
  };

  const start = () => {
    if (stateRef.current === 'playing') return;
    if (stateRef.current !== 'idle' || game.current.bricks.length === 0) reset();
    stateRef.current = 'playing';
    setState('playing');
    sfx.select();
  };

  useEffect(() => {
    reset();
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const css = getComputedStyle(document.documentElement);
    const col = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const palette = [col('--c4', '#ff2bd6'), col('--c5', '#ff9f1c'), col('--c6', '#fff200'), col('--c1', '#39ff14'), col('--c2', '#00f0ff')];
    const fg = col('--text-main', '#fff');
    const bg = col('--bg-main', '#0b0720');
    const g = game.current;
    let raf = 0;

    const io = new IntersectionObserver(([e]) => { g.visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(canvas);

    const movePointer = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      g.px = Math.max(40, Math.min(W - 40, ((clientX - r.left) / r.width) * W));
    };
    const onMove = (e: PointerEvent) => movePointer(e.clientX);
    const onKey = (e: KeyboardEvent) => {
      if (!g.visible) return;
      if (e.key === 'ArrowLeft') { g.keys.l = e.type === 'keydown'; }
      if (e.key === 'ArrowRight') { g.keys.r = e.type === 'keydown'; }
    };
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    const finish = (s: State) => {
      stateRef.current = s;
      setState(s);
      if (s === 'won') sfx.win(); else sfx.lose();
      try {
        const hi = Number(localStorage.getItem('dizain-hi') || 0);
        if (g.score > hi) localStorage.setItem('dizain-hi', String(g.score));
      } catch { /* ignore */ }
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!g.visible) return;
      if (stateRef.current === 'playing') {
        if (g.keys.l) g.px = Math.max(40, g.px - 7);
        if (g.keys.r) g.px = Math.min(W - 40, g.px + 7);
        g.bx += g.vx; g.by += g.vy;
        if (g.bx < 6 || g.bx > W - 6) { g.vx *= -1; g.bx = Math.max(6, Math.min(W - 6, g.bx)); sfx.blip(); }
        if (g.by < 6) { g.vy = Math.abs(g.vy); sfx.blip(); }
        // lopar
        if (g.by > H - 26 && g.by < H - 14 && Math.abs(g.bx - g.px) < 46 && g.vy > 0) {
          g.vy = -Math.abs(g.vy);
          g.vx = ((g.bx - g.px) / 46) * 5;
          sfx.hit();
        }
        // kocke
        const cx = Math.floor(g.bx / BW), cy = Math.floor((g.by - 30) / BH);
        if (cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS && g.bricks[cy * COLS + cx]) {
          g.bricks[cy * COLS + cx] = false;
          g.vy *= -1;
          g.score += 10; setScore(g.score);
          sfx.tone(300 + (ROWS - cy) * 120, 0.05);
          if (g.bricks.every((b) => !b)) finish('won');
        }
        if (g.by > H + 10) {
          g.lives -= 1; setLives(g.lives);
          if (g.lives <= 0) finish('lost');
          else { g.bx = g.px; g.by = H - 40; g.vy = -3.4; g.vx = 3; sfx.lose(); }
        }
      }
      // risanje
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      g.bricks.forEach((alive, i) => {
        if (!alive) return;
        const x = (i % COLS) * BW, y = 30 + Math.floor(i / COLS) * BH;
        ctx.fillStyle = palette[Math.floor(i / COLS)];
        ctx.fillRect(x + 2, y + 2, BW - 4, BH - 4);
      });
      ctx.fillStyle = fg;
      ctx.fillRect(g.px - 40, H - 20, 80, 8);
      ctx.fillRect(g.bx - 5, g.by - 5, 10, 10);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const a = t.tc.arcade;
  return (
    <div ref={wrap} className="max-w-3xl mx-auto">
      <div className="flex justify-between font-display text-[10px] md:text-xs text-[var(--c2)] mb-3">
        <span>{a.score} {String(score).padStart(4, '0')}</span>
        <span>{a.lives} {'♥'.repeat(Math.max(0, lives))}</span>
      </div>
      <div className="pixel-box crt-screen relative cursor-pointer" onClick={start} role="application" aria-label={a.bonusTitle}>
        <canvas ref={ref} width={W} height={H} className="w-full block touch-none" style={{ imageRendering: 'pixelated' }} />
        {state !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 text-center">
            <div className="font-display text-sm md:text-xl text-[var(--text-main)]" style={{ textShadow: '3px 3px 0 var(--c4)' }}>
              {state === 'won' ? a.bonusWin : state === 'lost' ? a.bonusOver : a.bonusStart}
            </div>
            {state !== 'idle' && <button className="pixel-btn bg-[var(--c4)] text-black font-display text-xs px-5 py-3" onClick={(e) => { e.stopPropagation(); start(); }}>{a.bonusAgain}</button>}
            <div className="text-lg text-[var(--text-secondary)] px-4">{a.bonusHint}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breakout;
