import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { PaletteButton } from '../../components/CommandPalette';
import { ROUTES } from '../../routes';

// EDITORIAL: stran je revija. Naslovnica z žigom, rubrike v vrstici, kolofon na dnu.
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const e = t.tc.editorial;
  const [compact, setCompact] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const on = () => setCompact(window.scrollY > 320);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const links = [
    { to: ROUTES.works, label: t.nav.work },
    { to: ROUTES.services, label: t.nav.services },
    { to: ROUTES.demo, label: t.nav.demo },
    { to: ROUTES.agency, label: t.nav.agency },
    { to: ROUTES.contact, label: t.nav.contact },
  ];

  const date = new Intl.DateTimeFormat(language === 'sl' ? 'sl-SI' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const navLinks = (cls: string) => links.map((l) => (
    <NavLink key={l.to} to={l.to} className={({ isActive }) => `${cls} ${isActive ? 'text-[var(--accent-color)] border-[var(--accent-color)]' : 'text-[var(--text-main)] border-transparent hover:border-[var(--text-main)]'}`}>
      {l.label}
    </NavLink>
  ));

  const langBtns = (
    <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest">
      <button onClick={() => setLanguage('sl')} aria-pressed={language === 'sl'} className={language === 'sl' ? 'font-bold text-[var(--text-main)]' : 'text-[var(--text-muted)]'}>SL</button>
      <span className="text-[var(--text-muted)]">/</span>
      <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={language === 'en' ? 'font-bold text-[var(--text-main)]' : 'text-[var(--text-muted)]'}>EN</button>
    </span>
  );

  return (
    <>
      {/* Lepljiva kompaktna vrstica */}
      <AnimatePresence>
        {compact && (
          <motion.header initial={{ y: -60 }} animate={{ y: 0 }} exit={{ y: -60 }} transition={{ duration: 0.3 }} className="fixed top-0 inset-x-0 z-40 bg-[var(--bg-main)]/95 backdrop-blur border-b border-[var(--text-main)]">
            <div className="px-4 md:px-10 h-12 flex items-center justify-between gap-4">
              <Link to={ROUTES.home} className="font-display font-black text-xl tracking-tight text-[var(--text-main)]">DIZAIN</Link>
              <nav aria-label="Main" className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em]">{navLinks('border-b py-1')}</nav>
              <div className="flex items-center gap-4"><PaletteButton className="hidden md:inline text-[10px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1" /><ThemeSwitcher />{langBtns}</div>
            </div>
            <motion.div aria-hidden="true" className="h-[2px] origin-left bg-[var(--accent-color)]" style={{ scaleX: progress }} />
          </motion.header>
        )}
      </AnimatePresence>

      {/* Žig revije */}
      <header className="relative z-20 px-4 md:px-10 pt-4">
        <div className="flex items-center justify-between text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] pb-3 border-b border-[var(--border-color)]">
          <span className="hidden sm:block">{date}</span>
          <span className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-center">{e.issue} · {e.edition}</span>
          <span className="flex items-center gap-4 ml-auto"><PaletteButton className="hidden md:inline border border-[var(--border-color)] px-2 py-0.5" /><ThemeSwitcher />{langBtns}</span>
        </div>
        <div className="text-center py-5 md:py-8">
          <Link to={ROUTES.home} className="inline-block font-display font-black text-[var(--text-main)] leading-none" style={{ fontSize: 'clamp(3.2rem, 13vw, 10rem)', letterSpacing: '-0.03em' }} aria-label="DIZAIN">
            DIZAIN
          </Link>
          <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">{t.footer.tagline}</p>
        </div>
        <div className="double-rule" />
        <nav aria-label="Main" className="flex justify-start md:justify-center gap-6 md:gap-12 py-3 overflow-x-auto text-[11px] md:text-xs uppercase tracking-[0.25em] whitespace-nowrap">
          {navLinks('border-b py-1')}
        </nav>
        <div className="border-t border-[var(--text-main)]" />
      </header>

      <main id="main" className="relative z-10 w-full flex-grow flex flex-col">{children}</main>

      <footer className="relative z-10 mt-24 border-t-4 border-double border-[var(--text-main)] px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-sm text-[var(--text-secondary)]">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display font-black text-3xl text-[var(--text-main)] mb-3">DIZAIN</div>
            <p className="italic font-display">{e.edition}. {e.issue}.</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-main)] mb-3 font-bold">{e.sections}</div>
            <ul className="space-y-2">{links.map((l) => <li key={l.to}><Link className="hover:text-[var(--accent-color)]" to={l.to}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-main)] mb-3 font-bold">{t.nav.contact}</div>
            <ul className="space-y-2"><li><a className="hover:text-[var(--accent-color)]" href="mailto:dizain.slo@gmail.com">dizain.slo@gmail.com</a></li><li><a className="hover:text-[var(--accent-color)]" href="tel:+38670311260">+386 70 311 260</a></li><li>Karantanska ulica 28, Maribor</li></ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-main)] mb-3 font-bold">{e.colophon}</div>
            <p>© {new Date().getFullYear()} DIZAIN. {t.footer.rights}</p>
            <Link to={ROUTES.privacy} className="underline mt-2 inline-block">{t.footer.privacy}</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Shell;
