import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { priceView } from '../lib/pricing';
import { ROUTES } from '../routes';

// Povzetek cen na domači strani, da obiskovalec ne išče po podstraneh
const PricingTeaser: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const brutal = theme === 'brutal';
  const editorial = theme === 'editorial';
  const bg = ['var(--bg-secondary)', 'var(--bg-tertiary)', 'var(--c2)', 'var(--c3)'];

  const cards = [
    ...t.pricing.tiers.map((tier, i) => ({ key: tier.name, name: tier.name, big: `${t.pricing.from} ${priceView(i, language).excl}`, small: `${t.pricing.exVat}${priceView(i, language).incl ? ` · ${priceView(i, language).incl} ${t.pricing.incVat}` : ''}` })),
    { key: 'custom', name: t.pricing.custom.name, big: t.pricing.custom.price, small: '' },
  ];

  return (
    <section className={`py-20 ${brutal ? 'px-4 md:px-12 border-t-[3px] border-[var(--text-main)]' : 'px-6'}`}>
      <div className={brutal ? '' : 'container mx-auto max-w-6xl'}>
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <h2 className={`font-display text-[var(--text-main)] ${brutal ? 'text-5xl md:text-8xl' : editorial ? 'italic text-4xl md:text-6xl' : 'text-3xl md:text-5xl'}`}>{t.pricing.title}</h2>
          <Link to={ROUTES.services} className={`text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4 text-[var(--text-main)] ${brutal ? 'text-base' : ''}`}>{t.teaser.cta} →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c, i) => (
            <motion.div key={c.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className={`p-6 flex flex-col justify-between min-h-[10rem] ${brutal ? 'border-[3px] border-[var(--text-main)] hard-shadow' : 'border border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}
              style={brutal ? { background: bg[i] } : undefined}>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">{c.name}</div>
              <div>
                <div className={`font-display text-[var(--text-main)] ${i === 3 ? 'text-2xl' : 'text-3xl'}`}>{c.big}</div>
                {c.small && <div className="text-xs mt-1 text-[var(--text-muted)]">{c.small}</div>}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--text-muted)] max-w-3xl">{t.pricing.note}</p>
      </div>
    </section>
  );
};

export default PricingTeaser;
