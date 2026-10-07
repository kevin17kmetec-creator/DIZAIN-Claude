import React from 'react';
import { motion } from 'framer-motion';
import { Zap, PenTool, Infinity as InfinityIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WhyUs: React.FC = () => {
  const { t } = useLanguage();
  const icons = [<Zap className="w-8 h-8" />, <PenTool className="w-8 h-8" />, <InfinityIcon className="w-8 h-8" />];

  return (
    <section data-sec="why" className="py-32 bg-[var(--bg-secondary)] text-[var(--text-main)] relative transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight mb-8">
              {t.whyUs.prefix} <br /> {t.whyUs.standard}
            </h2>
            <div className="w-20 h-1 bg-[var(--text-main)] mb-8" />
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{t.whyUs.desc}</p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)]">
            {t.whyUs.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-[var(--bg-secondary)] p-8 md:p-12 hover:bg-[var(--bg-tertiary)] transition-colors duration-500 flex flex-col justify-between min-h-[18rem] ${index === 2 ? 'md:col-span-2' : ''}`}
              >
                <div className="text-[var(--text-muted)] mb-8">{icons[index]}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">{item.desc}</p>
                </div>
                <div className="text-right mt-8" aria-hidden="true">
                  <span className="text-6xl font-display text-[var(--text-main)]/10 font-bold">0{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
