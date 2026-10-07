import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ContactForm from './ContactForm';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" data-sec="contact" className="py-32 bg-[var(--bg-main)] relative border-t border-[var(--border-color)] overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-noise opacity-[var(--noise-opacity)] mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[var(--text-main)]/50"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t.nav.contact}</span>
            </div>

            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--text-main)] mb-8 leading-[0.9]">{t.contact.title}</h2>

            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-md mb-12 border-l border-[var(--border-color)] pl-6">{t.contact.subtitle}</p>

            <div className="flex flex-col gap-6">
              <a href="mailto:dizain.slo@gmail.com" className="group flex items-center gap-4 text-[var(--text-main)] hover:text-[var(--text-secondary)] transition-colors">
                <div className="keep-round w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--text-main)] group-hover:text-[var(--bg-main)] transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-lg md:text-xl font-display break-all">dizain.slo@gmail.com</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 md:p-12 shadow-2xl relative"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
