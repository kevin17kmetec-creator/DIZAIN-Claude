import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';

const KEY = 'dizain-hint';

// Enkraten namig na domači strani, da obiskovalec odkrije izbirnik slogov
const ThemeHint: React.FC = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch { /* ignore */ }
    if (seen || pathname !== ROUTES.home) { setShow(false); return; }
    const id = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(id);
  }, [pathname]);

  const close = () => {
    setShow(false);
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed left-4 bottom-4 md:left-[104px] z-[150] max-w-[18rem] flex items-start gap-3 p-4 bg-[var(--bg-main)] text-[var(--text-main)] border-2 border-[var(--text-main)] shadow-[4px_4px_0_0_var(--text-main)]"
        >
          <Palette size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="mb-2">{t.hint.text}</p>
            <Link to={ROUTES.demo} onClick={close} className="font-bold underline">{t.hint.cta} →</Link>
          </div>
          <button onClick={close} aria-label={t.hint.close} className="shrink-0 -mr-1 -mt-1 p-1 hover:opacity-70"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeHint;
