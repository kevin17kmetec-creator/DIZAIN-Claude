import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import ContactForm from './ContactForm';
import PageHeader from './PageHeader';

interface ContactState {
  project?: string;
  details?: string;
}

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.contact.title, t.meta.contact.description);
  const state = (useLocation().state ?? {}) as ContactState;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] page-top pb-24 relative overflow-hidden flex flex-col transition-colors duration-500">
      <div className="absolute inset-0 bg-noise opacity-[var(--noise-opacity)] mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col">
        <PageHeader title={t.nav.contact} lead={t.contact.subtitle} index={5} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">{t.contact.location}</h2>
              <address className="not-italic text-[var(--text-secondary)]">Karantanska ulica 28<br />2000 Maribor<br />Slovenija</address>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">{t.contact.contactLabel}</h2>
              <p className="text-[var(--text-secondary)]">
                <a href="mailto:info@dizainstudio.si" className="hover:text-[var(--text-main)] transition-colors">info@dizainstudio.si</a>
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 md:p-12 shadow-2xl relative">
            <ContactForm initialProject={state.project} initialDetails={state.details} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
