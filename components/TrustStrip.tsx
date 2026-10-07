import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Globe, RefreshCcw, Receipt } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const ICONS = [Gift, Globe, RefreshCcw, Receipt];
const ROMAN = ['I', 'II', 'III', 'IV'];

// Prednosti, ki jih lahko obiskovalec preveri v cenikih in pogojih. V vsaki temi drugače.
const TrustStrip: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const items = t.trust.items;

  if (theme === 'arcade') {
    const cols = ['var(--c1)', 'var(--c2)', 'var(--c4)', 'var(--c6)'];
    return (
      <section className="px-4 py-16">
        <h2 className="font-display text-center text-[var(--text-main)] mb-10" style={{ fontSize: 'clamp(1rem,3vw,1.8rem)', textShadow: '3px 3px 0 var(--c4)' }}>{t.trust.title}</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <div key={it.title} className="pixel-box p-4">
              <div className="font-display text-[10px] mb-2" style={{ color: cols[i] }}>▶ +{i + 1}</div>
              <div className="font-display text-xs text-[var(--text-main)] mb-2 leading-snug">{it.title}</div>
              <p className="text-lg leading-tight text-[var(--text-secondary)]">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (theme === 'editorial') {
    return (
      <section className="px-4 md:px-10 py-14 border-y border-[var(--text-main)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4">
          {items.map((it, i) => (
            <div key={it.title} className="px-6 py-6 md:border-r last:border-r-0 border-[var(--border-color)]">
              <div className="font-display italic text-[var(--accent-color)] text-3xl mb-2">{ROMAN[i]}.</div>
              <h3 className="font-display text-xl text-[var(--text-main)] mb-1 leading-snug">{it.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (theme === 'brutal') {
    const bg = ['var(--bg-tertiary)', 'var(--c2)', 'var(--c4)', 'var(--c1)'];
    return (
      <section className="px-4 md:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <motion.div key={it.title} whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }} className="border-[3px] border-[var(--text-main)] hard-shadow p-5" style={{ background: bg[i] }}>
            <div className="font-display text-3xl mb-2">0{i + 1}</div>
            <h3 className="font-display text-xl leading-tight mb-1">{it.title}</h3>
            <p className="font-medium">{it.desc}</p>
          </motion.div>
        ))}
      </section>
    );
  }

  return (
    <section className="py-14 border-y border-[var(--border-color)] bg-[var(--bg-main)]">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4">
              <Icon className="shrink-0 text-[var(--text-main)] mt-1" size={26} strokeWidth={1.5} />
              <div>
                <h3 className="font-bold text-[var(--text-main)] mb-1">{it.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{it.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustStrip;
