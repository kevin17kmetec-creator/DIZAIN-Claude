import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { useTheme, THEME_IDS, ThemeId } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const THEME_SWATCH: Record<ThemeId, string[]> = {
  minimal: ['#050505', '#ffffff', '#a3a3a3'],
  arcade: ['#0b0720', '#ff2bd6', '#00f0ff'],
  editorial: ['#f4efe6', '#1c1a17', '#8a5a2b'],
  brutal: ['#f1efe7', '#ffe500', '#0a0a0a'],
};

export const Swatch: React.FC<{ id: ThemeId }> = ({ id }) => (
  <span className="flex h-4 w-10 shrink-0 overflow-hidden border border-[var(--border-color)]" aria-hidden="true">
    {THEME_SWATCH[id].map((c) => (
      <span key={c} className="flex-1" style={{ background: c }} />
    ))}
  </span>
);

const ThemeSwitcher: React.FC<{ placement?: 'down' | 'right' | 'up' }> = ({ placement = 'down' }) => {
  const { theme, setTheme, mode, toggleMode } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.nav.style}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
      >
        <Palette size={18} />
        {placement !== 'right' && <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest">{t.themes[theme].name}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`absolute w-72 max-w-[85vw] bg-[var(--bg-main)] border border-[var(--border-color-hover)] shadow-2xl z-50 ${placement === 'right' ? 'left-full bottom-0 ml-4' : placement === 'up' ? 'right-0 bottom-full mb-4' : 'right-0 top-full mt-4'}`}
          >
            <div className="px-4 py-3 border-b border-[var(--border-color)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {t.nav.style}
            </div>
            {THEME_IDS.map((id) => (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={theme === id}
                onClick={(e) => { setTheme(id, { x: e.clientX, y: e.clientY }); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--text-main)]/5 transition-colors"
              >
                <Swatch id={id} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-[var(--text-main)]">{t.themes[id].name}</span>
                  <span className="block text-xs text-[var(--text-muted)] truncate">{t.themes[id].desc}</span>
                </span>
                {theme === id && <Check size={16} className="text-[var(--text-main)] shrink-0" />}
              </button>
            ))}
            {theme === 'minimal' && (
              <button
                onClick={toggleMode}
                className="w-full flex items-center gap-3 px-4 py-3 border-t border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-colors"
              >
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {mode === 'dark' ? t.themes.light : t.themes.dark}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
