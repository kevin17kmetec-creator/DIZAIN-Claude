import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

const Facts: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-[var(--bg-main)] border-y border-[var(--border-color)] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl mb-6 text-[var(--text-main)]"
            >
              {t.facts.title}
            </motion.h2>
            <p className="text-[var(--text-secondary)] mb-12 max-w-md">{t.facts.desc}</p>

            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {t.facts.items.map((item) => (
                <div key={item.label} className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-2">
                    <CountUp to={item.value} prefix={item.prefix} suffix={item.suffix} />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10 border border-[var(--border-color)] bg-[var(--bg-secondary)]/40">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-6">{t.facts.stackTitle}</h3>
            <ul className="flex flex-wrap gap-3 mb-8">
              {t.facts.stack.map((s) => (
                <li key={s} className="px-4 py-2 border border-[var(--border-color-hover)] text-[var(--text-main)] text-sm font-bold">
                  {s}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed">{t.facts.stackNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facts;
