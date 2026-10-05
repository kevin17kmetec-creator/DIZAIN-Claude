import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';
import ThemeSwitcher from './ThemeSwitcher';
import ThemePicker from './ThemePicker';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.home;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navLinks = [
    { name: t.nav.work, to: ROUTES.works },
    { name: t.nav.services, to: ROUTES.services },
    { name: t.nav.demo, to: ROUTES.demo },
    { name: t.nav.agency, to: ROUTES.agency },
    { name: t.nav.contact, to: ROUTES.contact },
  ];

  const langButton = (lang: 'sl' | 'en', label: string) => (
    <button
      onClick={() => setLanguage(lang)}
      aria-pressed={language === lang}
      className={`text-[10px] font-bold uppercase transition-colors tracking-widest ${
        language === lang ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${
        scrolled || !isHome
          ? 'bg-[var(--bg-main)]/90 backdrop-blur-md border-[var(--border-color)] py-4'
          : 'bg-transparent border-transparent py-8'
      }`}
    >
      <div className="w-full px-6 md:px-12 flex justify-between md:grid md:grid-cols-[1fr_auto_1fr] items-center relative">
        {/* Logo: viden samo na podstraneh */}
        <div className={`transition-opacity duration-300 z-50 justify-self-start ${!isHome ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <Link
            to={ROUTES.home}
            tabIndex={isHome ? -1 : 0}
            className="border-[2px] border-[var(--text-main)] px-3 py-1.5 inline-block hover:bg-[var(--text-main)] group transition-colors duration-300"
          >
            <span className="font-logo font-bold text-xl tracking-[0.2em] text-[var(--text-main)] group-hover:text-[var(--bg-main)] transition-colors duration-300 block">
              DIZAIN
            </span>
          </Link>
        </div>

        {/* Namizni meni */}
        <div className="hidden md:flex justify-self-center items-center gap-8 lg:gap-10 w-max">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors duration-300 font-bold ${
                  isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="justify-self-end flex items-center gap-5 z-50 ml-auto md:ml-0">
          <ThemeSwitcher />

          <div className="flex items-center gap-2">
            {langButton('sl', 'SLO')}
            <span className="text-[var(--text-muted)] text-[10px]">/</span>
            {langButton('en', 'ENG')}
          </div>

          <button
            className="md:hidden text-[var(--text-main)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>
    </nav>

    {/* Mobilni meni: zunaj <nav>, ker backdrop-filter ustvari nov containing block za fixed */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="fixed inset-0 bg-[var(--bg-main)] flex flex-col items-center justify-start gap-7 md:hidden z-30 overflow-y-auto pt-28 pb-12"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-2xl font-display font-bold uppercase tracking-widest hover:text-[var(--text-secondary)] ${
                  isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="w-full max-w-xs px-6 mt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 text-center">{t.nav.style}</div>
            <ThemePicker />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
