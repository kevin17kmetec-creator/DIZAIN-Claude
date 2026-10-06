import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { sortedProjects } from '../../data/projects';
import { ROUTES } from '../../routes';
import Marquee from '../../components/fx/Marquee';
import Magnetic from '../../components/fx/Magnetic';
import SplitReveal from '../../components/fx/SplitReveal';
import CountUp from '../../components/CountUp';
import ServiceList from '../../components/ServiceList';
import ContactForm from '../../components/ContactForm';
import TryIt from '../../components/TryIt';

// Trak, ki se ob hitrem drsenju nagne (kinetična tipografija)
const KineticStrip: React.FC<{ children: React.ReactNode; className?: string; reverse?: boolean; speed?: number }> = ({ children, className = '', reverse, speed = 24 }) => {
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skewX = useTransform(smooth, [-3000, 3000], [-14, 14], { clamp: true });
  return (
    <motion.div style={{ skewX }} className="-mx-4 origin-center">
      <Marquee speed={speed} reverse={reverse} className={className}>{children}</Marquee>
    </motion.div>
  );
};

const Sticker: React.FC<{ className: string; children: React.ReactNode; rotate?: number; constraints: React.RefObject<HTMLElement | null> }> = ({ className, children, rotate = 0, constraints }) => (
  <motion.div
    drag dragConstraints={constraints as React.RefObject<Element>} dragMomentum={false} dragElastic={0.15}
    whileDrag={{ scale: 1.12, rotate: rotate + 6, zIndex: 30 }} whileHover={{ scale: 1.05 }}
    initial={{ rotate, opacity: 0, scale: 0.6 }} animate={{ rotate, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.8 }}
    className={`absolute cursor-grab active:cursor-grabbing select-none touch-none ${className}`}
  >
    {children}
  </motion.div>
);

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const b = t.tc.brutal;
  const ref = useRef<HTMLElement>(null);
  const lines = b.lines;
  return (
    <section ref={ref} className="relative px-4 md:px-12 pt-24 md:pt-12 pb-12 overflow-x-clip">
      <div className="flex items-center justify-between font-mono text-xs md:text-sm font-bold mb-6">
        <span>MARIBOR / SI</span>
        <span>{new Date().getFullYear()} ©</span>
      </div>
      <h1 className="font-display leading-[0.88] text-[var(--text-main)] relative z-10" style={{ fontSize: 'clamp(2.6rem, 11.2vw, 10rem)' }}>
        <span className="sr-only">DIZAIN - Izdelava spletnih strani, spletnih trgovin in aplikacij</span>
        <span className="block"><SplitReveal text={lines[0]} /></span>
        <span className="block"><span className="inline-block bg-[var(--bg-tertiary)] border-[3px] border-[var(--text-main)] px-3 -rotate-1 hard-shadow-lg"><SplitReveal text={lines[1]} delay={0.15} /></span></span>
        <span className="block stroke-text"><SplitReveal text={lines[2]} delay={0.3} /></span>
        <span className="block"><SplitReveal text={lines[3]} delay={0.45} /> <span className="text-[var(--accent-color)]">*</span></span>
      </h1>

      <Sticker constraints={ref} rotate={12} className="right-4 md:right-[8%] top-28 md:top-24 z-20">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full keep-round bg-[var(--accent-color)] border-[3px] border-[var(--text-main)] hard-shadow grid place-items-center text-center font-display text-lg md:text-2xl leading-none p-3" style={{ borderRadius: '9999px' }}>{b.sticker1}</div>
      </Sticker>
      <Sticker constraints={ref} rotate={-8} className="right-2 md:right-[24%] top-[30%] md:top-[52%] z-20">
        <div className="bg-[var(--bg-tertiary)] border-[3px] border-[var(--text-main)] hard-shadow px-4 py-3 font-display text-xl md:text-3xl">{b.sticker2}</div>
      </Sticker>
      <p className="hidden md:block absolute right-[10%] bottom-16 font-mono text-xs font-bold -rotate-6">↑ {b.drag}</p>

      <div className="mt-10 grid md:grid-cols-12 gap-8 items-end relative z-10">
        <p className="md:col-span-5 text-lg md:text-2xl font-medium bg-[var(--bg-secondary)] border-[3px] border-[var(--text-main)] p-5 hard-shadow">{t.hero.pitch}</p>
        <div className="md:col-span-7 flex flex-wrap gap-4 md:justify-end">
          <Magnetic><Link to={ROUTES.contact} className="inline-block bg-[var(--text-main)] text-[var(--bg-main)] font-display text-lg md:text-2xl px-8 py-5 border-[3px] border-[var(--text-main)] hover:bg-[var(--accent-color)] hover:text-[var(--text-main)] hard-shadow transition-colors">{t.hero.cta} →</Link></Magnetic>
          <Magnetic><Link to={ROUTES.demo} className="inline-block bg-[var(--bg-secondary)] text-[var(--text-main)] font-display text-lg md:text-2xl px-8 py-5 border-[3px] border-[var(--text-main)] hover:bg-[var(--bg-tertiary)] hard-shadow transition-colors">{t.hero.ctaSecondary}</Link></Magnetic>
        </div>
      </div>
    </section>
  );
};

const Strips: React.FC = () => {
  const b = useLanguage().t.tc.brutal;
  return (
    <div className="py-6 overflow-x-clip">
      <div className="-rotate-1"><KineticStrip className="bg-[var(--text-main)] text-[var(--bg-tertiary)] py-3 border-y-[3px] border-[var(--text-main)]">{b.marquee.map((m) => <span key={m} className="font-display text-3xl md:text-6xl px-6 whitespace-nowrap">{m} ✺</span>)}</KineticStrip></div>
      <div className="rotate-1 -mt-3"><KineticStrip reverse speed={30} className="bg-[var(--accent-color)] text-[var(--text-main)] py-3 border-y-[3px] border-[var(--text-main)]">{[...b.marquee].reverse().map((m) => <span key={m} className="font-display text-3xl md:text-6xl px-6 whitespace-nowrap">{m} →</span>)}</KineticStrip></div>
    </div>
  );
};

const Services: React.FC = () => {
  const b = useLanguage().t.tc.brutal;
  return (
    <section className="px-4 md:px-12 py-20">
      <h2 className="font-display text-5xl md:text-9xl mb-10">{b.servicesTitle}</h2>
      <ServiceList />
    </section>
  );
};

const StackedProcess: React.FC = () => {
  const { t } = useLanguage();
  const b = t.tc.brutal;
  const cols = ['var(--bg-tertiary)', 'var(--c2)', 'var(--c4)', 'var(--c1)', 'var(--c5)', 'var(--bg-secondary)'];
  return (
    <section className="px-4 md:px-12 py-20 border-t-[3px] border-[var(--text-main)]">
      <h2 className="font-display text-5xl md:text-9xl mb-12">{b.processTitle}</h2>
      <div className="relative">
        {t.process.steps.map((s, i) => (
          <div key={i} className="sticky mb-10 md:mb-20" style={{ top: `${88 + i * 18}px` }}>
            <div className="border-[3px] border-[var(--text-main)] hard-shadow-lg p-6 md:p-10 grid md:grid-cols-12 gap-4 items-center" style={{ background: cols[i], transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
              <div className="md:col-span-3 font-display leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>0{i + 1}</div>
              <div className="md:col-span-9">
                <h3 className="font-display text-3xl md:text-6xl mb-3 leading-none">{s.title}</h3>
                <p className="text-lg md:text-2xl font-medium max-w-3xl">{s.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Works: React.FC = () => {
  const { t, language } = useLanguage();
  const b = t.tc.brutal;
  const p = sortedProjects[0];
  return (
    <section className="px-4 md:px-12 py-20 border-t-[3px] border-[var(--text-main)] bg-[var(--bg-tertiary)]">
      <div className="flex items-end justify-between gap-6 mb-10">
        <h2 className="font-display text-5xl md:text-9xl">{b.worksTitle}</h2>
        <Link to={ROUTES.works} className="font-display text-lg md:text-2xl underline decoration-4 hover:text-[var(--accent-color)]">{t.portfolio.seeAll} →</Link>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <motion.div whileHover={{ rotate: -1.5, x: -6, y: -6 }} className="lg:col-span-8">
          <Link to={ROUTES.preview(p.id)} className="group block border-[3px] border-[var(--text-main)] bg-[var(--bg-secondary)] hard-shadow-lg">
            <div className="aspect-[16/10] bg-black relative overflow-hidden border-b-[3px] border-[var(--text-main)]">
              <img src={p.image} alt={`${p.title} - ${p.category}`} referrerPolicy="no-referrer" loading="lazy" className={`w-full h-full ${p.imageClass || 'object-cover'} group-hover:scale-105 transition-transform duration-500`} />
              <span className="absolute top-4 left-4 bg-[var(--bg-tertiary)] border-[3px] border-[var(--text-main)] px-3 py-1 font-display text-sm">{p.category}</span>
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <h3 className="font-display text-3xl md:text-6xl">{p.title}</h3>
              <ArrowUpRight size={56} strokeWidth={4} className="shrink-0 group-hover:rotate-45 transition-transform" />
            </div>
          </Link>
        </motion.div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <p className="text-xl font-medium bg-[var(--bg-secondary)] border-[3px] border-[var(--text-main)] p-5 hard-shadow">{p.description[language]}</p>
          <div className="flex flex-wrap gap-2">{p.specs.map((s) => <span key={s} className="border-[3px] border-[var(--text-main)] bg-[var(--bg-secondary)] px-3 py-1 font-bold">{s}</span>)}</div>
          <div className="border-[3px] border-dashed border-[var(--text-main)] p-6 grid place-items-center text-center font-display text-2xl flex-1 min-h-[10rem] -rotate-2">{t.portfolio.more}</div>
        </div>
      </div>
    </section>
  );
};

const Numbers: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-[var(--text-main)] text-[var(--bg-main)] border-y-[3px] border-[var(--text-main)] px-4 md:px-12 py-20">
      <h2 className="font-display text-5xl md:text-9xl text-[var(--bg-tertiary)] mb-12">{t.tc.brutal.factsTitle}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 border-[3px] border-[var(--bg-tertiary)]">
        {t.facts.items.map((f, i) => (
          <div key={f.label} className={`p-6 md:p-10 ${i % 2 === 0 ? 'border-r-[3px]' : ''} ${i < 2 ? 'border-b-[3px] lg:border-b-0' : ''} lg:border-r-[3px] lg:last:border-r-0 border-[var(--bg-tertiary)]`}>
            <div className="font-display text-[var(--bg-tertiary)] leading-none" style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}><CountUp to={f.value} prefix={f.prefix} suffix={f.suffix} /></div>
            <div className="mt-3 font-bold uppercase text-sm md:text-base">{f.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Why: React.FC = () => {
  const { t } = useLanguage();
  const bg = ['var(--c4)', 'var(--bg-tertiary)', 'var(--c2)'];
  return (
    <section className="px-4 md:px-12 py-20 grid md:grid-cols-3 gap-8">
      {t.whyUs.items.map((it, i) => (
        <motion.div key={it.title} whileHover={{ rotate: i % 2 ? 1.5 : -1.5, y: -6 }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="border-[3px] border-[var(--text-main)] hard-shadow-lg p-6 md:p-8" style={{ background: bg[i] }}>
          <div className="font-display text-7xl leading-none mb-4">0{i + 1}</div>
          <h3 className="font-display text-3xl mb-3">{it.title}</h3>
          <p className="text-lg font-medium">{it.desc}</p>
        </motion.div>
      ))}
    </section>
  );
};

const SayHi: React.FC = () => {
  const { t } = useLanguage();
  const b = t.tc.brutal;
  return (
    <section className="px-4 md:px-12 py-20 border-t-[3px] border-[var(--text-main)] bg-[var(--bg-tertiary)]">
      <h2 className="font-display leading-[0.85]" style={{ fontSize: 'clamp(3.5rem, 15vw, 14rem)' }}><SplitReveal text={b.sayHi} /></h2>
      <p className="mt-4 text-xl md:text-3xl font-medium max-w-2xl">{b.sayHiSub}</p>
      <div className="mt-10 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <Magnetic strength={0.2}>
            <a href="mailto:dizain.slo@gmail.com" className="inline-block bg-[var(--text-main)] text-[var(--bg-tertiary)] font-display text-xl md:text-3xl px-6 py-5 border-[3px] border-[var(--text-main)] hard-shadow-lg hover:bg-[var(--accent-color)] hover:text-[var(--text-main)] transition-colors break-all">dizain.slo@gmail.com ↗</a>
          </Magnetic>
          <p className="mt-6 font-mono font-bold">+386 70 311 260<br />Karantanska ulica 28, Maribor</p>
        </div>
        <div className="lg:col-span-7 bg-[var(--bg-secondary)] border-[3px] border-[var(--text-main)] hard-shadow-lg p-6 md:p-10"><ContactForm /></div>
      </div>
    </section>
  );
};

const Home: React.FC = () => (
  <>
    <Hero />
    <Strips />
    <Services />
    <StackedProcess />
    <Works />
    <Numbers />
    <Why />
    <TryIt />
    <SayHi />
  </>
);

export default Home;
