import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { TESTIMONIALS } from '../data/testimonials';

// Prikaže se samo, če so v data/testimonials.ts prava, potrjena mnenja strank.
const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-display text-3xl md:text-5xl text-[var(--text-main)] mb-10">{t.trust.testimonialsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((q) => (
            <motion.figure key={q.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--text-main)]">„{q.quote[language]}“</blockquote>
              <figcaption className="mt-5 text-sm text-[var(--text-secondary)]">
                <span className="font-bold text-[var(--text-main)]">{q.author}</span>{q.role ? `, ${q.role}` : ''}{q.project ? ` · ${q.project}` : ''}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
