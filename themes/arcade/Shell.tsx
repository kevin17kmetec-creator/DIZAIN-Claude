import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useScroll, useMotionValueEvent, motion, useSpring } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { PaletteButton } from '../../components/CommandPalette';
import PixelSprite from '../../components/fx/PixelSprite';
import { ROUTES } from '../../routes';
import { sfx } from '../../lib/sfx';

const hiScore = () => { try { return Number(localStorage.getItem('dizain-hi') || 0); } catch { return 0; } };

// ARCADE: stran je igralni zaslon. Zgoraj HUD s točkami, spodaj dok z menijem na tipkah 1-5.
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const a = t.tc.arcade;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState(sfx.enabled);
  const { scrollY, scrollYProgress } = useScroll();
  const xp = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  useMotionValueEvent(scrollY, 'change', (v) => setScore(Math.floor(v * 3)));

  const links = [
    { to: ROUTES.works, label: t.nav.work },
    { to: ROUTES.services, label: t.nav.services },
    { to: ROUTES.demo, label: t.nav.demo },
    { to: ROUTES.agency, label: t.nav.agency },
    { to: ROUTES.contact, label: t.nav.contact },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= links.length) { sfx.select(); navigate(links[n - 1].to); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, language]);

  const toggleSound = () => { const next = !sound; sfx.set(next); setSound(next); };
  const hi = Math.max(hiScore(), score);

  return (
    <>
      {/* HUD */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[var(--bg-main)]/90 backdrop-blur-sm border-b-4 border-[var(--border-color)]">
        <div className="px-3 md:px-6 h-14 flex items-center justify-between gap-3 font-display text-[10px] md:text-xs">
          <Link to={ROUTES.home} onClick={() => sfx.coin()} className="flex items-center gap-2 text-[var(--text-main)] shrink-0" aria-label="DIZAIN">
            <span className="text-[var(--c4)]"><PixelSprite sprite="invader" size={3} /></span>
            <span className="tracking-widest">DIZAIN</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-[var(--text-main)]">
            <span><span className="text-[var(--c4)]">1UP</span> {String(score).padStart(6, '0')}</span>
            <span><span className="text-[var(--c6)]">{a.hi}</span> {String(hi).padStart(6, '0')}</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden md:flex items-center gap-1 text-[var(--c4)]" aria-label={a.lives}>
              {[0, 1, 2].map((i) => <PixelSprite key={i} sprite="heart" size={3} />)}
            </span>
            <PaletteButton className="hidden md:inline px-2 py-1 border-2 border-[var(--border-color-hover)] text-[var(--c2)]" />
            <button onClick={toggleSound} aria-pressed={sound} aria-label={`${a.sound} ${sound ? a.on : a.off}`} className="text-[var(--c2)] hover:text-[var(--text-main)]">
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <ThemeSwitcher />
            <div className="flex items-center gap-1">
              <button onClick={() => setLanguage('sl')} aria-pressed={language === 'sl'} className={language === 'sl' ? 'text-[var(--c6)]' : 'text-[var(--text-muted)]'}>SL</button>
              <span className="text-[var(--text-muted)]">/</span>
              <button onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={language === 'en' ? 'text-[var(--c6)]' : 'text-[var(--text-muted)]'}>EN</button>
            </div>
          </div>
        </div>
        <motion.div aria-hidden="true" className="h-1 origin-left bg-[var(--c1)]" style={{ scaleX: xp }} />
      </header>

      <main id="main" className="relative z-10 w-full flex-grow flex flex-col">{children}</main>

      {/* Dok z menijem */}
      <nav aria-label="Main" className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-2 pointer-events-none">
        <ul className="pointer-events-auto flex gap-1 md:gap-2 p-2 bg-[var(--bg-main)]/95 border-4 border-[var(--border-color-hover)] shadow-[0_0_24px_var(--glow)]">
          {links.map((l, i) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onMouseEnter={() => sfx.blip()}
                onClick={() => sfx.select()}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 md:px-4 py-2 font-display text-[9px] md:text-xs transition-colors ${isActive ? 'bg-[var(--c4)] text-black' : 'text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)]'}`
                }
              >
                <span className="hidden md:inline-block w-5 h-5 leading-5 text-center border-2 border-current text-[10px]">{i + 1}</span>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="relative z-10 border-t-4 border-[var(--border-color)] bg-[var(--bg-secondary)] pb-28 pt-10 text-center font-display">
        <div className="text-[var(--c4)] text-xs md:text-sm mb-3" style={{ textShadow: '2px 2px 0 var(--c2)' }}>{a.continueQ}</div>
        <Link to={ROUTES.contact} className="inline-block text-[var(--c6)] text-3xl md:text-5xl blink" aria-label={t.hero.cta}>9</Link>
        <p className="mt-6 text-[10px] md:text-xs text-[var(--text-secondary)]">© {new Date().getFullYear()} DIZAIN · {t.footer.rights}</p>
        <p className="mt-2 text-lg text-[var(--text-muted)] font-sans">
          <a href="mailto:dizain.slo@gmail.com" className="hover:text-[var(--text-main)]">dizain.slo@gmail.com</a> · <a href="tel:+38670311260" className="hover:text-[var(--text-main)]">+386 70 311 260</a> · <Link to={ROUTES.privacy} className="underline">{t.footer.privacy}</Link>
        </p>
        <p className="mt-3 text-sm text-[var(--text-muted)] font-sans">{a.keys}</p>
      </footer>
      <span className="sr-only" aria-live="polite">{pathname}</span>
    </>
  );
};

export default Shell;
