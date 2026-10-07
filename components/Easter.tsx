import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { PROMO } from '../data/promo';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Skrivnost: Konami koda sproži konfete in sporočilo
const Easter: React.FC = () => {
  const { t, language } = useLanguage();
  const [shown, setShown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos.current = k === KONAMI[pos.current] ? pos.current + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos.current === KONAMI.length) { pos.current = 0; setShown(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!shown) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setShown(false), 6500);
    const canvas = canvasRef.current;
    if (!canvas || reduce) return () => clearTimeout(timer);
    const ctx = canvas.getContext('2d')!;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const colors = ['#ff2bd6', '#00f0ff', '#ffe500', '#39ff14', '#ff3b1f', '#ffffff'];
    const parts = Array.from({ length: 160 }, () => ({
      x: w / 2, y: h * 0.6, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 18 - 4,
      s: Math.random() * 8 + 4, c: colors[Math.floor(Math.random() * colors.length)], r: Math.random() * 6,
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.r += 0.2;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
      });
      if (parts.some((p) => p.y < h + 40)) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [shown]);

  return (
    <AnimatePresence>
      {shown && (
        <>
          <canvas ref={canvasRef} className="fixed inset-0 z-[400] pointer-events-none" aria-hidden="true" />
          <motion.div
            role="status"
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[401] max-w-sm w-[90vw] p-5 bg-[var(--bg-main)] text-[var(--text-main)] border-2 border-[var(--text-main)] shadow-[6px_6px_0_0_var(--accent-color)] text-center"
          >
            <div className="font-display font-bold tracking-widest mb-2">{PROMO.enabled ? t.easter.promoTitle : t.easter.title}</div>
            {PROMO.enabled ? (
              <>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{PROMO.description[language]}</p>
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.easter.promoLabel}</p>
                <p className="font-mono text-xl font-bold select-all">{PROMO.code}</p>
              </>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">{t.easter.text}</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Easter;
