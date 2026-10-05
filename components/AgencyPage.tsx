import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import Facts from './Facts';

const AgencyPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.agency.title, t.meta.agency.description);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10 mb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-[var(--text-main)] mb-8 leading-[0.9]">{t.nav.agency}</h1>
          <div className="w-full h-[1px] bg-gradient-to-r from-[var(--text-main)]/50 to-transparent mb-12"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-main)] mb-6">{t.whyUs.standard}</h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{t.whyUs.desc}</p>
            </div>
            <blockquote className="border-l border-[var(--border-color)] pl-8 flex flex-col justify-center">
              <p className="text-2xl text-[var(--text-main)] italic opacity-80">„{t.agency.quote}“</p>
            </blockquote>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {t.whyUs.items.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border-t border-[var(--border-color-hover)] pt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 block">0{index + 1}</span>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3">{item.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Facts />
    </div>
  );
};

export default AgencyPage;
