import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { sortedProjects } from '../../data/projects';
import { ROUTES } from '../../routes';
import SplitReveal from '../../components/fx/SplitReveal';
import HScroll from '../../components/fx/HScroll';
import Marquee from '../../components/fx/Marquee';
import CountUp from '../../components/CountUp';
import ServiceList from '../../components/ServiceList';
import ContactForm from '../../components/ContactForm';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const COVER = 'https://wki1ffjfu2uulznl.public.blob.vercel-storage.com/DizainLogo_webp.webp';

const FrontPage: React.FC = () => {
  const { t } = useLanguage();
  const e = t.tc.editorial;
  const toc = [
    { label: t.portfolio.works, id: 'features', page: 12 },
    { label: t.process.title, id: 'chapters', page: 24 },
    { label: t.nav.services, id: 'index', page: 38 },
    { label: e.numbers, id: 'numbers', page: 46 },
    { label: e.letter, id: 'letter', page: 52 },
  ];
  return (
    <section className="px-4 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 order-2 lg:order-1 lg:border-r lg:border-[var(--border-color)] lg:pr-8">
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-5">{e.inThisIssue}</h2>
          <ol className="space-y-4">
            {toc.map((it) => (
              <li key={it.id}>
                <button onClick={() => scrollTo(it.id)} className="group w-full flex items-baseline gap-2 text-left">
                  <span className="font-display text-xl text-[var(--text-main)] group-hover:italic group-hover:text-[var(--accent-color)] transition-all">{it.label}</span>
                  <span className="leader" />
                  <span className="font-display italic text-[var(--text-muted)]">{it.page}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-10 pt-6 border-t border-[var(--text-main)]">
            <p className="font-display italic text-lg leading-snug text-[var(--text-secondary)]">„{e.pull}“</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">{e.pullBy}</p>
          </div>
        </aside>

        <article className="lg:col-span-6 order-1 lg:order-2">
          <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-4">{e.coverKicker}</div>
          <h1 className="font-display text-[var(--text-main)] leading-[0.95]" style={{ fontSize: 'clamp(2.4rem, 6.4vw, 5rem)' }}>
            <span className="sr-only">DIZAIN - Izdelava spletnih strani, spletnih trgovin in aplikacij. </span>
            <SplitReveal text={e.leadA} delay={0.1} />
            <br />
            <SplitReveal text={e.leadB} delay={0.35} className="italic text-[var(--accent-color)]" />
          </h1>
          <p className="mt-6 text-xl md:text-2xl font-display italic text-[var(--text-secondary)] leading-snug">{e.standfirst}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] border-y border-[var(--border-color)] py-2">
            <span>{e.byline}</span><span>·</span><span>{e.readTime}</span>
          </div>
          <motion.figure initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.3 }} className="mt-6">
            <div className="aspect-[16/10] bg-[var(--bg-tertiary)] relative overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: `url('${COVER}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'sepia(0.5) contrast(1.05)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--bg-tertiary), transparent 60%)', mixBlendMode: 'multiply', opacity: 0.6 }} />
            </div>
            <figcaption className="mt-2 text-xs italic text-[var(--text-muted)]">DIZAIN · Maribor, {new Date().getFullYear()}</figcaption>
          </motion.figure>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to={ROUTES.contact} className="px-8 py-4 bg-[var(--text-main)] text-[var(--bg-main)] text-xs uppercase tracking-[0.2em] hover:bg-[var(--accent-color)] transition-colors">{t.hero.cta}</Link>
            <Link to={ROUTES.demo} className="px-8 py-4 border border-[var(--text-main)] text-[var(--text-main)] text-xs uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors">{t.hero.ctaSecondary}</Link>
          </div>
        </article>

        <aside id="numbers" className="lg:col-span-3 order-3 lg:border-l lg:border-[var(--border-color)] lg:pl-8">
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-5">{e.numbers}</h2>
          <ul>
            {t.facts.items.map((f) => (
              <li key={f.label} className="py-5 border-b border-[var(--border-color)] first:pt-0">
                <div className="font-display text-6xl text-[var(--text-main)] leading-none"><CountUp to={f.value} prefix={f.prefix} suffix={f.suffix} /></div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">{f.label}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

const Article: React.FC = () => {
  const { t } = useLanguage();
  const e = t.tc.editorial;
  return (
    <section className="px-4 md:px-10 py-16 border-t border-[var(--text-main)]">
      <div className="max-w-5xl mx-auto">
        <div className="columns-2-balanced font-display text-lg md:text-xl leading-relaxed text-[var(--text-secondary)]">
          {e.body.map((p, i) => <p key={i} className={`mb-5 ${i === 0 ? 'dropcap' : ''}`}>{p}</p>)}
          <p className="mb-5">{t.whyUs.desc}</p>
        </div>
        <blockquote className="my-16 text-center border-y-2 border-[var(--text-main)] py-12">
          <p className="font-display italic text-3xl md:text-5xl text-[var(--text-main)] leading-tight max-w-3xl mx-auto">„{e.pull}“</p>
          <footer className="mt-5 text-[11px] uppercase tracking-[0.3em] text-[var(--accent-color)]">— {e.pullBy}</footer>
        </blockquote>
      </div>
    </section>
  );
};

const Chapters: React.FC = () => {
  const { t } = useLanguage();
  const e = t.tc.editorial;
  return (
    <section id="chapters" className="border-y-2 border-[var(--text-main)] bg-[var(--bg-secondary)]">
      <HScroll
        progressClassName="bg-[var(--accent-color)]"
        stickyClassName="pt-14"
        header={
          <div className="px-6 md:px-[8vw] mb-10 flex items-end justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-2">{e.chapters}</div>
              <h2 className="font-display italic text-4xl md:text-6xl text-[var(--text-main)]">{t.process.title}</h2>
            </div>
            <span className="hidden md:block text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">{t.hero.scroll} →</span>
          </div>
        }
      >
        {t.process.steps.map((s, i) => (
          <article key={i} className="w-full md:w-[36vw] md:min-w-[380px] md:max-w-[520px] shrink-0 border-l-2 border-[var(--text-main)] pl-6 pr-4 py-4 bg-[var(--bg-secondary)]">
            <div className="font-display italic text-[var(--accent-color)] leading-none" style={{ fontSize: 'clamp(5rem, 11vw, 9rem)' }}>{ROMAN[i]}</div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)] mt-2 mb-3">{e.chapter} {i + 1}</div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--text-main)] mb-3 leading-tight">{s.title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
          </article>
        ))}
      </HScroll>
    </section>
  );
};

const Feature: React.FC = () => {
  const { t, language } = useLanguage();
  const e = t.tc.editorial;
  const p = sortedProjects[0];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)']);
  return (
    <section id="features" ref={ref} className="relative py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between border-b border-[var(--text-main)] pb-4 mb-8">
          <h2 className="font-display italic text-4xl md:text-6xl text-[var(--text-main)]">{e.featureTitle}</h2>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)] hidden sm:block">{e.features}</span>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <motion.div style={{ clipPath: clip }} className="lg:col-span-8 relative overflow-hidden aspect-[4/3] bg-[var(--bg-tertiary)]">
            <motion.img src={p.image} alt={`${p.title} - ${p.category}`} referrerPolicy="no-referrer" loading="lazy" style={{ y, scale: 1.2 }} className={`absolute inset-0 w-full h-full ${p.imageClass || 'object-cover'}`} />
          </motion.div>
          <div className="lg:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-3">{p.category}</div>
            <h3 className="font-display text-4xl md:text-5xl text-[var(--text-main)] mb-4 leading-tight">{p.title}</h3>
            <p className="font-display text-lg text-[var(--text-secondary)] leading-relaxed dropcap mb-6">{p.description[language]}</p>
            <div className="flex gap-2 flex-wrap mb-6">{p.specs.map((s) => <span key={s} className="text-[10px] uppercase tracking-[0.2em] border border-[var(--text-main)] px-2 py-1">{s}</span>)}</div>
            {p.link && <Link to={ROUTES.preview(p.id)} className="text-xs uppercase tracking-[0.2em] border-b border-[var(--text-main)] pb-1">{t.portfolio.livePreview} →</Link>}
            <p className="mt-8 text-xs italic text-[var(--text-muted)]">{t.portfolio.more}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="index" className="px-4 md:px-10 py-20 border-t border-[var(--text-main)]">
      <ServiceList />
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-0 border-y border-[var(--text-main)]">
        {t.whyUs.items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 md:border-r last:border-r-0 border-[var(--border-color)]">
            <div className="font-display italic text-[var(--accent-color)] text-5xl mb-3">{ROMAN[i]}.</div>
            <h3 className="font-display text-2xl text-[var(--text-main)] mb-2">{it.title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Letter: React.FC = () => {
  const { t } = useLanguage();
  const e = t.tc.editorial;
  return (
    <section id="letter" className="px-4 md:px-10 py-20 bg-[var(--bg-secondary)] border-y-2 border-[var(--text-main)]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--accent-color)] mb-4">{t.nav.contact}</div>
          <h2 className="font-display italic text-5xl md:text-7xl text-[var(--text-main)] leading-[0.95] mb-6">{e.letter}</h2>
          <p className="font-display text-xl text-[var(--text-secondary)] mb-8">{e.letterSub}</p>
          <address className="not-italic text-sm text-[var(--text-secondary)] space-y-1"><div>Karantanska ulica 28, 2000 Maribor</div><div><a href="mailto:dizain.slo@gmail.com" className="underline">dizain.slo@gmail.com</a></div></address>
        </div>
        <div className="lg:col-span-7 bg-[var(--bg-main)] border border-[var(--text-main)] p-8 md:p-12 shadow-[10px_10px_0_0_rgba(28,26,23,0.12)]"><ContactForm /></div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { t } = useLanguage();
  const items = [...t.hero.words, ...t.services.items];
  return (
    <>
      <FrontPage />
      <Marquee speed={45} className="border-y border-[var(--text-main)] py-3 bg-[var(--text-main)] text-[var(--bg-main)]">
        {items.map((w, i) => <span key={`${w}-${i}`} className="font-display italic text-2xl px-8 whitespace-nowrap">{w} <span className="not-italic text-[var(--accent-color)]">❦</span></span>)}
      </Marquee>
      <Article />
      <Chapters />
      <Feature />
      <Index />
      <Letter />
    </>
  );
};

export default Home;
