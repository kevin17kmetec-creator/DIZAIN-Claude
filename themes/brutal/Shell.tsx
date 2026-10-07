import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { PaletteButton } from '../../components/CommandPalette';
import Marquee from '../../components/fx/Marquee';
import { ROUTES } from '../../routes';
import LegalLine from '../../components/LegalLine';
import LegalLinks from '../../components/LegalLinks';
import { COMPANY } from '../../data/company';

// BRUTAL: navigacija je navpični trak ob levem robu, vsebina je surova in glasna.
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const b = t.tc.brutal;
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { to: ROUTES.works, label: t.nav.work },
    { to: ROUTES.services, label: t.nav.services },
    { to: ROUTES.demo, label: t.nav.demo },
    { to: ROUTES.agency, label: t.nav.agency },
    { to: ROUTES.contact, label: t.nav.contact },
  ];

  const langBtns = (
    <span className="flex md:flex-col items-center gap-1 font-bold text-sm">
      <button onClick={() => setLanguage('sl')} aria-pressed={language === 'sl'} className={`px-1 ${language === 'sl' ? 'bg-[var(--text-main)] text-[var(--bg-tertiary)]' : ''}`}>SL</button>
      <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`px-1 ${language === 'en' ? 'bg-[var(--text-main)] text-[var(--bg-tertiary)]' : ''}`}>EN</button>
    </span>
  );

  return (
    <>
      {/* Navpični trak (namizje) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-[84px] z-40 flex-col items-center justify-between py-5 bg-[var(--bg-tertiary)] border-r-[3px] border-[var(--text-main)]">
        <Link to={ROUTES.home} aria-label="DIZAIN" className="font-display text-3xl text-[var(--text-main)] hover:text-[var(--accent-color)] transition-colors" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>DIZAIN</Link>
        <nav aria-label="Main">
          <ul className="flex flex-col gap-3">
            {links.map((l, i) => (
              <li key={l.to} className="relative group">
                <NavLink to={l.to} className={({ isActive }) => `block w-12 h-12 grid place-items-center font-display text-lg border-[3px] border-[var(--text-main)] transition-all ${isActive ? 'bg-[var(--text-main)] text-[var(--bg-tertiary)]' : 'bg-[var(--bg-secondary)] hover:bg-[var(--accent-color)] hover:-translate-y-1 hover:shadow-[0_4px_0_0_#0a0a0a]'}`}>
                  0{i + 1}
                  <span className="sr-only">{l.label}</span>
                </NavLink>
                <span aria-hidden="true" className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-[var(--text-main)] text-[var(--bg-tertiary)] font-display text-sm px-3 py-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">{l.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-4">
          <PaletteButton label="⌘K" className="font-display text-xs border-2 border-[var(--text-main)] px-1.5 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--text-main)] hover:text-[var(--bg-tertiary)]" />
          <ThemeSwitcher placement="right" />
          {langBtns}
        </div>
      </aside>

      {/* Zgornja vrstica (mobilno) */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-[var(--bg-tertiary)] border-b-[3px] border-[var(--text-main)]">
        <Link to={ROUTES.home} className="font-display text-2xl text-[var(--text-main)]">DIZAIN</Link>
        <div className="flex items-center gap-3">
          {langBtns}
          <ThemeSwitcher />
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={b.menu} className="border-[3px] border-[var(--text-main)] bg-[var(--bg-secondary)] p-1.5">{open ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}</button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="md:hidden fixed inset-0 z-30 bg-[var(--bg-tertiary)] pt-20 px-6 flex flex-col justify-center gap-2 overflow-y-auto">
            {links.map((l, i) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `font-display text-5xl border-b-[3px] border-[var(--text-main)] py-3 flex justify-between items-baseline ${isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-main)]'}`}>
                {l.label}<span className="font-mono text-base">0{i + 1}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main" className="relative z-10 w-full flex-grow flex flex-col md:pl-[84px]">{children}</main>

      <footer className="relative z-10 md:pl-[84px] bg-[var(--text-main)] text-[var(--bg-main)]">
        <Marquee speed={26} className="border-b-[3px] border-[var(--bg-tertiary)] py-4 text-[var(--bg-tertiary)]">
          {b.marquee.map((m) => <span key={m} className="font-display text-3xl md:text-5xl px-6 whitespace-nowrap">{m} ✺</span>)}
        </Marquee>
        <div className="px-6 md:px-12 py-12 grid md:grid-cols-3 gap-8 font-medium">
          <div>
            <div className="font-display text-4xl text-[var(--bg-tertiary)] mb-2">DIZAIN</div>
            <p>{t.footer.tagline}</p>
          </div>
          <div>
            <a href={`mailto:${COMPANY.email}`} className="block hover:text-[var(--bg-tertiary)] underline decoration-4">{COMPANY.email}</a>
            <span className="block">{COMPANY.street}, {COMPANY.city}</span>
          </div>
          <div className="md:text-right">
            <p>© {new Date().getFullYear()} {COMPANY.shortName} {t.footer.rights}</p>
            <LegalLinks className="mt-1" linkClassName="underline decoration-4 hover:text-[var(--bg-tertiary)]" />
          </div>
        </div>
        <LegalLine className="px-6 md:px-12 pb-10 text-sm opacity-80 leading-relaxed" />
      </footer>
    </>
  );
};

export default Shell;
