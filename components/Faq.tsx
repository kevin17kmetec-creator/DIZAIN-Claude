import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Faq: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section data-sec="faq" className="py-24 bg-[var(--bg-main)] transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-12">{t.faq.title}</h2>
        <div className="border-t border-[var(--border-color)]">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-[var(--border-color)]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left text-[var(--text-main)] font-bold hover:text-[var(--text-secondary)] transition-colors"
                >
                  {item.q}
                  <Plus size={20} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
