import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, THEME_IDS } from '../contexts/ThemeContext';
import { ROUTES } from '../routes';

interface Item { id: string; group: string; label: string; hint?: string; run: () => void; }

export const PALETTE_EVENT = 'dizain:palette';
export const openPalette = () => window.dispatchEvent(new Event(PALETTE_EVENT));

// Ctrl/Cmd + K ali "/" odpre iskalnik po strani. Dela v vseh temah.
const CommandPalette: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(PALETTE_EVENT, onOpen); };
  }, []);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const items: Item[] = useMemo(() => {
    const go = (to: string, state?: object) => () => navigate(to, { state });
    return [
      { id: 'home', group: t.palette.pages, label: 'DIZAIN', run: go(ROUTES.home) },
      { id: 'works', group: t.palette.pages, label: t.nav.work, run: go(ROUTES.works) },
      { id: 'services', group: t.palette.pages, label: t.nav.services, run: go(ROUTES.services) },
      { id: 'demo', group: t.palette.pages, label: t.nav.demo, run: go(ROUTES.demo) },
      { id: 'agency', group: t.palette.pages, label: t.nav.agency, run: go(ROUTES.agency) },
      { id: 'contact', group: t.palette.pages, label: t.nav.contact, run: go(ROUTES.contact) },
      ...THEME_IDS.map((id) => ({ id: `theme-${id}`, group: t.palette.styles, label: t.themes[id].name, hint: t.themes[id].desc, run: () => setTheme(id) })),
      { id: 'draft', group: t.palette.actions, label: t.palette.draft, run: go(ROUTES.contact) },
      { id: 'cfg', group: t.palette.actions, label: t.demo.tabs.configurator, run: go(`${ROUTES.demo}?tab=configurator`) },
      { id: 'shop', group: t.palette.actions, label: t.demo.tabs.shop, run: go(`${ROUTES.demo}?tab=shop`) },
      { id: 'lang', group: t.palette.actions, label: t.palette.langSwitch, run: () => setLanguage(language === 'sl' ? 'en' : 'sl') },
      { id: 'top', group: t.palette.actions, label: t.palette.top, run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ];
  }, [t, language, navigate, setTheme, setLanguage]);

  const filtered = items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ''}`.toLowerCase().includes(q.trim().toLowerCase()));
  const safeActive = Math.min(active, Math.max(0, filtered.length - 1));

  const run = (i: Item) => { setOpen(false); setTimeout(i.run, 30); };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && filtered[safeActive]) { e.preventDefault(); run(filtered[safeActive]); }
  };

  let lastGroup = '';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={t.palette.placeholder}
            initial={{ y: -16, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xl bg-[var(--bg-main)] text-[var(--text-main)] border-2 border-[var(--text-main)] shadow-[8px_8px_0_0_var(--text-main)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-[var(--border-color-hover)]">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onInputKey}
                placeholder={t.palette.placeholder} aria-label={t.palette.placeholder}
                className="flex-1 bg-transparent py-4 outline-none text-base placeholder-[var(--text-muted)]"
              />
              <kbd className="text-[10px] px-2 py-1 border border-[var(--border-color-hover)] text-[var(--text-muted)]">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
              {filtered.length === 0 && <li className="px-4 py-6 text-center text-[var(--text-muted)] text-sm">{t.palette.empty}</li>}
              {filtered.map((it, idx) => {
                const header = it.group !== lastGroup;
                lastGroup = it.group;
                return (
                  <React.Fragment key={it.id}>
                    {header && <li className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]" role="presentation">{it.group}</li>}
                    <li role="option" aria-selected={idx === safeActive}>
                      <button
                        onMouseEnter={() => setActive(idx)} onClick={() => run(it)}
                        className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-sm ${idx === safeActive ? 'bg-[var(--text-main)] text-[var(--bg-main)]' : ''}`}
                      >
                        <span>{it.label}{it.hint && <span className={`ml-3 text-xs ${idx === safeActive ? 'opacity-70' : 'text-[var(--text-muted)]'}`}>{it.hint}</span>}</span>
                        {idx === safeActive && <CornerDownLeft size={14} />}
                      </button>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
            <div className="px-4 py-2 border-t border-[var(--border-color-hover)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{t.palette.navHint}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PaletteButton: React.FC<{ className?: string; label?: string }> = ({ className = '', label }) => {
  const { t } = useLanguage();
  return (
    <button onClick={openPalette} aria-label={t.palette.placeholder} className={className}>
      {label ?? t.palette.hint}
    </button>
  );
};

export default CommandPalette;
