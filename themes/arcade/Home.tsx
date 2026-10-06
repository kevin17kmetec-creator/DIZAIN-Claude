import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { sortedProjects } from '../../data/projects';
import { ROUTES } from '../../routes';
import PixelSprite from '../../components/fx/PixelSprite';
import Marquee from '../../components/fx/Marquee';
import CountUp from '../../components/CountUp';
import ThemePicker from '../../components/ThemePicker';
import Pricing from '../../components/Pricing';
import ContactForm from '../../components/ContactForm';
import Breakout from './Breakout';
import { sfx } from '../../lib/sfx';

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const SectionTitle: React.FC<{ title: string; hint?: string; color?: string }> = ({ title, hint, color = 'var(--c4)' }) => (
  <div className="text-center mb-12">
    <h2 className="font-display text-[var(--text-main)]" style={{ fontSize: 'clamp(1.2rem,4vw,2.4rem)', textShadow: `3px 3px 0 ${color}` }}>{title}</h2>
    {hint && <p className="mt-3 text-xl text-[var(--text-secondary)]">{hint}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/* 1. NASLOVNI ZASLON                                                  */
/* ------------------------------------------------------------------ */
const Stars: React.FC = () => {
  const stars = useRef(Array.from({ length: 70 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 62, d: (i % 5) * 0.6, s: i % 7 === 0 ? 3 : 2 })));
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.current.map((s, i) => (
        <span key={i} className="absolute bg-white blink" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s`, animationDuration: `${2 + (i % 3)}s`, opacity: 0.8 }} />
      ))}
    </div>
  );
};

const TitleScreen: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  const navigate = useNavigate();
  const [sel, setSel] = useState(0);
  const [word, setWord] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const sunY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setWord((n) => (n + 1) % t.hero.words.length), 2200);
    return () => clearInterval(id);
  }, [t.hero.words.length, reduce]);

  const actions = [
    () => navigate(ROUTES.contact),
    () => go('cartridges'),
    () => go('options'),
    () => go('bonus'),
  ];

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 px-4">
      <Stars />
      {/* sonce */}
      <motion.div aria-hidden="true" style={{ y: sunY }} className="absolute left-1/2 -translate-x-1/2 bottom-[38%] w-[min(60vw,380px)] aspect-square rounded-full opacity-40"
        >
        <div className="w-full h-full rounded-full" style={{
          background: 'linear-gradient(to bottom, var(--c6), var(--c5) 45%, var(--c4) 80%)',
          WebkitMaskImage: 'repeating-linear-gradient(to bottom, #000 0 70%, transparent 70% 76%, #000 76% 82%, transparent 82% 86%, #000 86% 90%, transparent 90% 93%, #000 93% 100%)',
          maskImage: 'linear-gradient(to bottom, #000 0 55%, transparent 55% 60%, #000 60% 70%, transparent 70% 75%, #000 75% 83%, transparent 83% 88%, #000 88% 94%, transparent 94% 97%, #000 97%)',
        }} />
      </motion.div>
      {/* tla v perspektivi */}
      <motion.div aria-hidden="true" style={{ y: gridY }} className="absolute inset-x-[-20%] bottom-0 h-[40%] origin-top"
        >
        <div className="w-full h-full" style={{
          transform: 'perspective(260px) rotateX(62deg)', transformOrigin: 'top',
          backgroundImage: 'linear-gradient(var(--c4) 2px, transparent 2px), linear-gradient(90deg, var(--c2) 2px, transparent 2px)',
          backgroundSize: '60px 60px', animation: reduce ? undefined : 'gridmove 1.4s linear infinite',
          maskImage: 'linear-gradient(to bottom, transparent, #000 40%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 40%)',
        }} />
      </motion.div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        <div className="font-display text-[10px] md:text-xs text-[var(--c6)] mb-6 flex justify-center gap-8">
          <span>{a.hi} 099999</span>
          <span className="blink text-[var(--c4)]">{a.pressStart}</span>
        </div>
        <h1 className="font-display text-[var(--text-main)] leading-none mb-3" style={{ fontSize: 'clamp(2.2rem, 10vw, 5.5rem)', textShadow: '0.06em 0.06em 0 var(--c4), 0.12em 0.12em 0 var(--c2)' }}>
          DIZAIN
          <span className="sr-only"> - Izdelava spletnih strani, spletnih trgovin in aplikacij</span>
        </h1>
        <p className="font-display text-[10px] md:text-sm text-[var(--c2)] mb-3">{a.tagline}</p>
        <p className="text-2xl md:text-3xl text-[var(--text-main)] mb-8">
          {t.hero.build} <span className="text-[var(--c6)]">{t.hero.words[word]}</span><span className="blink">_</span>
        </p>

        <ul className="inline-block text-left pixel-box p-4 md:p-6 min-w-[min(100%,24rem)]">
          {a.menu.map((m, i) => (
            <li key={m.label}>
              <button
                onMouseEnter={() => { setSel(i); sfx.blip(); }}
                onFocus={() => setSel(i)}
                onClick={() => { sfx.select(); actions[i](); }}
                className={`w-full flex items-baseline gap-3 py-2 px-2 font-display text-xs md:text-sm text-left ${sel === i ? 'text-[var(--c6)] bg-[var(--text-main)]/10' : 'text-[var(--text-main)]'}`}
              >
                <span className={`w-4 ${sel === i ? 'blink' : 'opacity-0'}`}>▶</span>
                <span>{m.label}</span>
                <span className="ml-auto text-lg normal-case text-[var(--text-secondary)] font-sans hidden sm:inline">{m.sub}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-lg text-[var(--text-secondary)] max-w-md mx-auto hidden md:block">{t.hero.pitch}</p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 2. IZBIRA NIVOJA (proces)                                           */
/* ------------------------------------------------------------------ */
const LevelMap: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.55'] });
  const [p, setP] = useState(0);
  useEffect(() => scrollYProgress.on('change', setP), [scrollYProgress]);
  const steps = t.process.steps;
  const colors = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)'];

  return (
    <section id="levels" className="py-24 px-4">
      <SectionTitle title={a.mapTitle} hint={a.mapHint} color="var(--c2)" />
      <div ref={ref} className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-[var(--border-color)]/50" aria-hidden="true" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, var(--text-muted) 0 8px, transparent 8px 16px)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-2 bg-[var(--c1)]" aria-hidden="true" style={{ height: `${Math.min(100, p * 100)}%`, boxShadow: '0 0 12px var(--c1)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-[var(--c6)]" aria-hidden="true" style={{ top: `${Math.min(100, Math.max(0, p * 100))}%` }}>
          <PixelSprite sprite="hero" size={5} accent="#fff" />
        </div>
        {steps.map((s, i) => {
          const done = p >= (i + 0.2) / steps.length;
          const left = i % 2 === 0;
          return (
            <div key={i} className={`relative flex ${left ? 'justify-start' : 'justify-end'} mb-16 last:mb-0`}>
              <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10 w-10 h-10 grid place-items-center font-display text-xs border-4"
                style={{ borderColor: done ? colors[i] : 'var(--text-muted)', background: done ? colors[i] : 'var(--bg-main)', color: done ? '#000' : 'var(--text-muted)' }} aria-hidden="true">{i + 1}</div>
              <motion.div initial={{ opacity: 0, x: left ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }}
                className="pixel-box w-[calc(50%-2.5rem)] max-md:w-[calc(100%-3.5rem)] max-md:ml-14 p-4 md:p-5" style={{ borderColor: done ? colors[i] : undefined }}>
                <div className="flex items-center justify-between font-display text-[9px] md:text-[10px] mb-2" style={{ color: colors[i] }}>
                  <span>{a.stage} {String(i + 1).padStart(2, '0')}</span>
                  {done && <span className="text-[var(--c1)]">{a.cleared} ★</span>}
                </div>
                <h3 className="font-display text-xs md:text-sm text-[var(--text-main)] mb-2 leading-snug">{s.title}</h3>
                <p className="text-lg leading-tight text-[var(--text-secondary)]">{s.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3. POWER-UPI (storitve)                                             */
/* ------------------------------------------------------------------ */
const PowerCard: React.FC<{ name: string; desc: string; level: number; color: string; sprite: 'star' | 'coin' | 'invader' | 'ghost' }> = ({ name, desc, level, color, sprite }) => {
  const a = useLanguage().t.tc.arcade;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} whileHover={{ y: -6 }} onMouseEnter={() => sfx.blip()} className="pixel-box p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4" style={{ color }}>
        <PixelSprite sprite={sprite} size={6} accent="#fff" />
        <span className="font-display text-[10px]">{a.level} {Math.round(level / 10)}</span>
      </div>
      <h3 className="font-display text-xs md:text-sm mb-3 text-[var(--text-main)]">{name}</h3>
      <p className="text-lg leading-tight text-[var(--text-secondary)] flex-1 mb-4">{desc}</p>
      <div className="h-4 border-2 border-[var(--text-main)] p-[2px]" role="img" aria-label={`${level}%`}>
        <div className="h-full transition-[width] duration-[1400ms] ease-out" style={{ width: inView ? `${level}%` : '0%', background: color }} />
      </div>
    </motion.div>
  );
};

const PowerUps: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  const levels = [92, 88, 96, 84];
  const cols = ['var(--c1)', 'var(--c4)', 'var(--c2)', 'var(--c5)'];
  const sprites = ['star', 'coin', 'invader', 'ghost'] as const;
  return (
    <section id="powerups" className="py-24 px-4 bg-[var(--bg-secondary)]/70 border-y-4 border-[var(--border-color)]">
      <SectionTitle title={a.powerTitle} hint={a.powerHint} color="var(--c5)" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.services.items.map((s, i) => (
          <PowerCard key={s} name={s} desc={t.services.descriptions[i]} level={levels[i]} color={cols[i]} sprite={sprites[i]} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to={ROUTES.services} onClick={() => sfx.select()} className="inline-block pixel-btn bg-[var(--c2)] text-black font-display text-xs px-6 py-4">{t.nav.services} ▶</Link>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 4. KASETE (reference)                                               */
/* ------------------------------------------------------------------ */
const Cartridge: React.FC<{ title: string; sub: string; image?: string; to?: string; color: string; imageClass?: string }> = ({ title, sub, image, to, color, imageClass }) => {
  const { t } = useLanguage();
  const body = (
    <div className="group relative w-full max-w-[18rem] mx-auto transition-transform duration-300 hover:-translate-y-3" onMouseEnter={() => sfx.blip()}>
      <div className="relative border-4 border-[var(--text-main)] bg-[var(--bg-tertiary)] pt-5 px-4 pb-4" style={{ boxShadow: `6px 6px 0 ${color}`, clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}>
        <div className="absolute top-0 inset-x-6 h-3 bg-[var(--text-main)]/20" aria-hidden="true" />
        <div className="crt-screen border-4 border-[var(--bg-main)] aspect-[4/3] bg-black grid place-items-center">
          {image ? <img src={image} alt={title} referrerPolicy="no-referrer" loading="lazy" className={`w-full h-full ${imageClass || 'object-cover'}`} /> : <span className="font-display text-3xl text-[var(--text-muted)]">?</span>}
        </div>
        <div className="mt-3 font-display text-[10px] md:text-xs text-[var(--text-main)] truncate">{title}</div>
        <div className="font-display text-[8px] md:text-[9px] mt-1" style={{ color }}>{sub}</div>
        <div className="mt-3 grid grid-cols-8 gap-[3px]" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i} className="h-3 bg-[var(--text-main)]/40" />)}</div>
      </div>
      {to && <div className="mt-4 text-center font-display text-[10px] text-[var(--c6)] opacity-0 group-hover:opacity-100 transition-opacity blink">{t.tc.arcade.insert} ▶</div>}
    </div>
  );
  return to ? <Link to={to} onClick={() => sfx.select()} aria-label={`${title} - ${t.portfolio.livePreview}`}>{body}</Link> : body;
};

const Cartridges: React.FC = () => {
  const { t, language } = useLanguage();
  const a = t.tc.arcade;
  return (
    <section id="cartridges" className="py-24 px-4">
      <SectionTitle title={a.cartTitle} hint={a.cartHint} color="var(--c1)" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {sortedProjects.slice(0, 4).map((p, i) => (
          <Cartridge key={p.id} title={p.title} sub={p.specs.join(' · ')} image={p.image} imageClass={p.imageClass} to={p.link ? ROUTES.preview(p.id) : undefined} color={['var(--c1)', 'var(--c2)', 'var(--c4)'][i % 3]} />
        ))}
        <Cartridge title="???" sub={t.portfolio.more} color="var(--c6)" />
        <Cartridge title="???" sub={language === 'sl' ? 'KMALU' : 'SOON'} color="var(--c5)" />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 5. DOSEŽKI                                                          */
/* ------------------------------------------------------------------ */
const Achievements: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  interface Ach { title: string; desc: string; value?: { value: number; prefix: string; suffix: string } }
  const items: Ach[] = [
    ...t.whyUs.items.map((w) => ({ title: w.title, desc: w.desc })),
    ...t.facts.items.map((f) => ({ title: `${f.prefix}${f.value}${f.suffix}`, desc: f.label, value: f })),
  ];
  const cols = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)', 'var(--c1)'];
  return (
    <section className="py-24 px-4 bg-[var(--bg-secondary)]/70 border-y-4 border-[var(--border-color)]">
      <SectionTitle title={a.achTitle} color="var(--c6)" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.08 }}
            className="pixel-box flex items-center gap-4 p-4">
            <span className="shrink-0" style={{ color: cols[i] }}><PixelSprite sprite="trophy" size={5} accent="#fff" /></span>
            <div className="min-w-0">
              <div className="font-display text-xs mb-1 text-[var(--text-main)]">
                {it.value ? <CountUp to={it.value.value} prefix={it.value.prefix} suffix={it.value.suffix} /> : it.title}
              </div>
              <div className="text-lg leading-tight text-[var(--text-secondary)]">{it.desc}</div>
            </div>
            <span className="ml-auto font-display text-[8px] hidden sm:block" style={{ color: cols[i] }}>{a.unlocked}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 6. MOŽNOSTI, BONUS, ŽETON                                           */
/* ------------------------------------------------------------------ */
const Options: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  return (
    <section id="options" className="py-24 px-4">
      <SectionTitle title={a.menu[2].label} hint={t.try.desc} color="var(--c3)" />
      <div className="max-w-5xl mx-auto"><ThemePicker /></div>
      <div className="max-w-5xl mx-auto mt-4 grid sm:grid-cols-2 gap-4">
        {[{ to: `${ROUTES.demo}?tab=configurator`, c: t.try.cards[0] }, { to: `${ROUTES.demo}?tab=shop`, c: t.try.cards[1] }].map(({ to, c }) => (
          <Link key={to} to={to} onClick={() => sfx.select()} className="pixel-box p-4 flex items-center justify-between hover:bg-[var(--text-main)]/10">
            <span><span className="font-display text-xs text-[var(--text-main)] block mb-1">{c.title}</span><span className="text-lg text-[var(--text-secondary)]">{c.desc}</span></span>
            <span className="font-display text-[var(--c6)]">▶</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Bonus: React.FC = () => {
  const a = useLanguage().t.tc.arcade;
  return (
    <section id="bonus" className="py-24 px-4 bg-[var(--bg-secondary)]/70 border-y-4 border-[var(--border-color)]">
      <SectionTitle title={a.bonusTitle} color="var(--c4)" />
      <Breakout />
    </section>
  );
};

const InsertCoin: React.FC = () => {
  const { t } = useLanguage();
  const a = t.tc.arcade;
  return (
    <section id="coin" className="py-24 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div className="text-center lg:text-left lg:sticky lg:top-24">
          <div className="text-[var(--c6)] mb-6 flex justify-center lg:justify-start"><PixelSprite sprite="coin" size={10} accent="#fff" /></div>
          <h2 className="font-display text-[var(--text-main)] blink" style={{ fontSize: 'clamp(1.6rem,6vw,3.2rem)', textShadow: '4px 4px 0 var(--c4)' }}>{a.coinTitle}</h2>
          <p className="mt-4 text-2xl text-[var(--text-secondary)]">{a.coinSub}</p>
          <p className="mt-8 font-display text-[10px] leading-loose text-[var(--c2)]">dizain.slo@gmail.com<br />+386 70 311 260<br />Maribor, SI</p>
        </div>
        <div className="pixel-box p-6 md:p-8"><ContactForm /></div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { t } = useLanguage();
  return (
    <>
      <TitleScreen />
      <Marquee speed={28} className="border-y-4 border-[var(--border-color)] bg-[var(--bg-secondary)] py-3 font-display text-xs text-[var(--c6)]">
        {[...t.hero.words, t.hero.pitch].map((w) => <span key={w} className="px-8 whitespace-nowrap">★ {w.toUpperCase()}</span>)}
      </Marquee>
      <LevelMap />
      <PowerUps />
      <Cartridges />
      <Achievements />
      <Pricing />
      <Options />
      <Bonus />
      <InsertCoin />
    </>
  );
};

export default Home;
