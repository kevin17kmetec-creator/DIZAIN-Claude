import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { priceView } from '../lib/pricing';
import { useTheme } from '../contexts/ThemeContext';
import { ROUTES } from '../routes';
import PixelSprite from './fx/PixelSprite';
import TiltCard from './fx/TiltCard';
import { sfx } from '../lib/sfx';

const HIGHLIGHT = 1;

const Pricing: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tiers = t.pricing.tiers;
  const pv = (i: number) => priceView(i, language);
  const ask = (i: number) => {
    sfx.select();
    navigate(ROUTES.contact, { state: { project: `${tiers[i].name} (${t.pricing.from} ${pv(i).excl} ${t.pricing.exVat})` } });
  };
  const askCustom = () => {
    sfx.select();
    navigate(ROUTES.contact, { state: { project: t.pricing.custom.name } });
  };
  // Cena: "od 490 €" in manjša vrstica z DDV
  const Vat: React.FC<{ i: number; className?: string }> = ({ i, className = '' }) => {
    const v = pv(i);
    return <div className={className}>{t.pricing.exVat}{v.incl ? ` · ${v.incl} ${t.pricing.incVat}` : ''}</div>;
  };
  const c = t.pricing.custom;

  /* ---------------- ARCADE: izbira igralca ---------------- */
  if (theme === 'arcade') {
    const a = t.tc.arcade;
    const sprites = ['ghost', 'hero', 'invader'] as const;
    const cols = ['var(--c2)', 'var(--c4)', 'var(--c6)'];
    const bars = [[40, 50, 60], [75, 80, 85], [100, 100, 100]];
    const statNames = ['SPD', 'PWR', 'MAG'];
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-center text-[var(--text-main)] mb-2" style={{ fontSize: 'clamp(1.2rem,4vw,2.4rem)', textShadow: '3px 3px 0 var(--c4)' }}>{a.playerTitle}</h2>
          <p className="text-center text-xl text-[var(--text-secondary)] mb-12">{t.pricing.lead}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`pixel-box p-6 flex flex-col relative ${i === HIGHLIGHT ? 'scale-[1.03]' : ''}`} style={{ borderColor: cols[i] }}>
                {i === HIGHLIGHT && <div className="absolute -top-4 left-4 bg-[var(--c6)] text-black font-display text-[10px] px-2 py-1 blink">{t.pricing.popular}</div>}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-sm" style={{ color: cols[i] }}>{tier.name}</span>
                  <span style={{ color: cols[i] }}><PixelSprite sprite={sprites[i]} size={5} accent="#fff" /></span>
                </div>
                <div className="font-display text-2xl text-[var(--text-main)] mb-1"><span className="text-xs text-[var(--text-secondary)]">{t.pricing.from} </span>{pv(i).excl}</div>
                <Vat i={i} className="text-base text-[var(--text-muted)] mb-4" />
                <p className="text-lg text-[var(--text-secondary)] mb-4 leading-tight">{tier.description}</p>
                <div className="space-y-2 mb-5">
                  {statNames.map((s, k) => (
                    <div key={s} className="flex items-center gap-2 font-display text-[10px]">
                      <span className="w-8 text-[var(--text-muted)]">{s}</span>
                      <div className="flex-1 h-3 border-2 border-[var(--text-main)] p-[1px]"><div className="h-full" style={{ width: `${bars[i][k]}%`, background: cols[i] }} /></div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-1 flex-grow mb-6 text-lg">
                  {tier.features.map((f) => <li key={f} className="flex gap-2 text-[var(--text-secondary)] leading-tight"><span style={{ color: cols[i] }}>▸</span>{f}</li>)}
                </ul>
                <button onClick={() => ask(i)} onMouseEnter={() => sfx.blip()} className="pixel-btn font-display text-xs py-3 text-black" style={{ background: cols[i] }}>{a.select}</button>
              </motion.div>
            ))}
          </div>
          <div className="pixel-box max-w-6xl mx-auto mt-8 p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between" style={{ borderColor: 'var(--c3)' }}>
            <div>
              <div className="font-display text-sm text-[var(--c3)] mb-2">{c.name}</div>
              <p className="text-xl text-[var(--text-secondary)] leading-tight max-w-xl">{c.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-lg text-[var(--text-main)]">{c.price}</span>
              <button onClick={askCustom} onMouseEnter={() => sfx.blip()} className="pixel-btn font-display text-xs py-3 px-5 text-black bg-[var(--c3)]">{c.cta}</button>
            </div>
          </div>
          <p className="text-center text-lg text-[var(--text-muted)] mt-10 max-w-4xl mx-auto">{t.pricing.note}</p>
        </div>
      </section>
    );
  }

  /* ---------------- EDITORIAL: cenik kot naročniški list ---------------- */
  if (theme === 'editorial') {
    return (
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent-color)] font-bold mb-4">{t.pricing.title}</div>
            <h2 className="font-display italic text-5xl md:text-6xl text-[var(--text-main)] mb-5">{t.pricing.title}</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto font-display italic text-xl">{t.pricing.lead}</p>
          </div>
          <div className="border-y-2 border-[var(--text-main)]">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 py-10 ${i > 0 ? 'border-t border-[var(--border-color)]' : ''}`}>
                <div className="md:col-span-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)] mb-2">№ {i + 1}{i === HIGHLIGHT && <span className="ml-2 text-[var(--accent-color)]">· {t.pricing.popular}</span>}</div>
                  <h3 className="font-display text-3xl text-[var(--text-main)] italic">{tier.name}</h3>
                  <div className="font-display text-4xl mt-3 text-[var(--accent-color)]"><span className="text-base italic text-[var(--text-muted)]">{t.pricing.from} </span>{pv(i).excl}</div>
                  <Vat i={i} className="text-xs text-[var(--text-muted)]" />
                </div>
                <div className="md:col-span-6">
                  <p className="font-display italic text-xl text-[var(--text-secondary)] mb-4">{tier.description}</p>
                  <ul className="columns-1 sm:columns-2 gap-8 text-[var(--text-secondary)] text-sm">
                    {tier.features.map((f) => <li key={f} className="py-1 break-inside-avoid">— {f}</li>)}
                  </ul>
                </div>
                <div className="md:col-span-3 flex md:justify-end items-start">
                  <button onClick={() => ask(i)} className="px-6 py-3 border border-[var(--text-main)] text-[var(--text-main)] text-xs uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors">{t.pricing.inquiry} →</button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-t-2 border-[var(--text-main)]">
            <div className="md:col-span-3">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)] mb-2">№ 4</div>
              <h3 className="font-display text-3xl text-[var(--text-main)] italic leading-tight">{c.name}</h3>
              <div className="font-display text-3xl mt-3 text-[var(--accent-color)]">{c.price}</div>
            </div>
            <div className="md:col-span-6">
              <p className="font-display italic text-xl text-[var(--text-secondary)] mb-4">{c.description}</p>
              <ul className="text-[var(--text-secondary)] text-sm">{c.features.map((f) => <li key={f} className="py-1">— {f}</li>)}</ul>
            </div>
            <div className="md:col-span-3 flex md:justify-end items-start">
              <button onClick={askCustom} className="px-6 py-3 border border-[var(--text-main)] text-[var(--text-main)] text-xs uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors">{c.cta} →</button>
            </div>
          </div>
          <p className="mt-8 text-center text-[var(--text-muted)] text-sm italic max-w-3xl mx-auto">{t.pricing.note}</p>
        </div>
      </section>
    );
  }

  /* ---------------- BRUTAL: trdi bloki ---------------- */
  if (theme === 'brutal') {
    const bgs = ['var(--bg-secondary)', 'var(--bg-tertiary)', 'var(--c2)'];
    return (
      <section id="pricing" className="py-24 border-y-2 border-[var(--text-main)]">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-5xl md:text-8xl mb-4 text-[var(--text-main)]">{t.pricing.title}</h2>
          <p className="text-xl font-medium max-w-2xl mb-14">{t.pricing.lead}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} whileHover={{ x: -4, y: -4 }}
                className="border-[3px] border-[var(--text-main)] hard-shadow-lg p-6 flex flex-col" style={{ background: bgs[i] }}>
                {i === HIGHLIGHT && <span className="self-start bg-[var(--text-main)] text-[var(--bg-tertiary)] font-display text-xs px-2 py-1 mb-3 -rotate-3">★ {t.pricing.popular}</span>}
                <h3 className="font-display text-3xl mb-1">{tier.name}</h3>
                <div className="font-display text-6xl my-2"><span className="text-xl">{t.pricing.from} </span>{pv(i).excl}</div>
                <Vat i={i} className="font-mono text-sm font-bold -mt-1 mb-3" />
                <p className="font-medium mb-5">{tier.description}</p>
                <ul className="space-y-2 flex-grow mb-6">
                  {tier.features.map((f) => <li key={f} className="flex gap-2 font-medium"><Check className="shrink-0 mt-0.5" size={18} strokeWidth={4} />{f}</li>)}
                </ul>
                <button onClick={() => ask(i)} className="bg-[var(--text-main)] text-[var(--bg-main)] font-display py-4 text-lg border-[3px] border-[var(--text-main)] hover:bg-[var(--accent-color)] hover:text-[var(--text-main)] transition-colors">{t.pricing.inquiry} →</button>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 border-[3px] border-[var(--text-main)] hard-shadow-lg bg-[var(--c3)] text-white p-6 md:p-8 grid md:grid-cols-12 gap-4 items-center">
            <h3 className="md:col-span-4 font-display text-3xl md:text-4xl">{c.name}</h3>
            <p className="md:col-span-5 text-lg font-medium">{c.description}</p>
            <div className="md:col-span-3 flex md:justify-end items-center gap-4 flex-wrap">
              <span className="font-display text-2xl">{c.price}</span>
              <button onClick={askCustom} className="bg-[var(--text-main)] text-[var(--bg-main)] font-display px-5 py-3 border-[3px] border-[var(--text-main)] hover:bg-[var(--accent-color)] hover:text-[var(--text-main)] transition-colors">{c.cta} →</button>
            </div>
          </div>
          <p className="mt-10 font-medium max-w-4xl">{t.pricing.note}</p>
        </div>
      </section>
    );
  }

  /* ---------------- MINIMAL ---------------- */
  return (
    <section id="pricing" className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-6">{t.pricing.title}</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">{t.pricing.lead}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => {
            const highlight = index === HIGHLIGHT;
            return (
              <TiltCard key={tier.name} max={5}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`relative flex flex-col p-8 rounded-2xl border h-full ${highlight ? 'bg-[var(--bg-tertiary)] border-[var(--border-color-hover)] shadow-2xl md:scale-105 z-10' : 'bg-[var(--bg-main)]/50 border-[var(--border-color)] hover:border-[var(--border-color-hover)]'} transition-all duration-300`}
                >
                  {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">{t.pricing.popular}</div>}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-wider mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-[var(--text-muted)] text-sm mr-1">{t.pricing.from}</span>
                      <span className="text-4xl font-display font-bold text-[var(--text-main)]">{pv(index).excl}</span>
                    </div>
                    <Vat i={index} className="text-xs text-[var(--text-muted)] -mt-3 mb-4" />
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{tier.description}</p>
                  </div>
                  <ul className="space-y-4 flex-grow mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"><Check className="w-5 h-5 text-[var(--c1)] shrink-0" /><span>{feature}</span></li>
                    ))}
                  </ul>
                  <button onClick={() => ask(index)} className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm transition-all duration-300 ${highlight ? 'bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--text-secondary)]' : 'bg-[var(--text-main)]/5 text-[var(--text-main)] hover:bg-[var(--text-main)]/10 border border-[var(--border-color)]'}`}>{t.pricing.inquiry}</button>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>
        <div className="max-w-7xl mx-auto mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 p-8 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-wider">{c.name}</h3>
            <div className="mt-2 text-3xl font-display font-bold text-[var(--text-main)]">{c.price}</div>
          </div>
          <p className="md:col-span-5 text-[var(--text-secondary)] leading-relaxed">{c.description}</p>
          <div className="md:col-span-3 md:text-right">
            <button onClick={askCustom} className="w-full md:w-auto py-3 px-6 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--text-secondary)] transition-colors">{c.cta}</button>
          </div>
        </div>
        <p className="mt-12 text-center text-[var(--text-muted)] text-sm max-w-4xl mx-auto leading-relaxed">{t.pricing.note}</p>
      </div>
    </section>
  );
};

export default Pricing;
