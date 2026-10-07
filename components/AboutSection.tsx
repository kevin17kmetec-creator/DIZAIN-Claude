import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANY } from '../data/company';
import { ROUTES } from '../routes';

const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();
  const l = t.legal.labels;
  return (
    <section data-sec="about" className="py-20 px-6 border-t border-[var(--border-color)]">
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-7">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)] mb-4">{t.about.kicker}</div>
          <h2 className="font-display text-3xl md:text-5xl text-[var(--text-main)] mb-6 leading-tight">{t.about.title}</h2>
          {t.about.text.map((p) => <p key={p} className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">{p}</p>)}
          <Link to={ROUTES.contact} className="inline-block mt-4 px-8 py-4 bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--text-secondary)] transition-colors">{t.about.cta}</Link>
        </motion.div>
        <dl className="lg:col-span-5 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 text-sm">
          {[
            [l.name, COMPANY.legalName],
            [l.address, `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, ${COMPANY.country[language]}`],
            [l.reg, COMPANY.registrationNumber],
            [l.tax, COMPANY.taxNumber],
            [l.email, COMPANY.email],
          ].map(([k, v]) => (
            <div key={k} className="py-3 border-b last:border-b-0 border-[var(--border-color)]">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{k}</dt>
              <dd className="text-[var(--text-main)] break-words">{v}</dd>
            </div>
          ))}
          <Link to={ROUTES.company} className="inline-block mt-4 text-xs underline text-[var(--text-secondary)] hover:text-[var(--text-main)]">{t.footer.company} →</Link>
        </dl>
      </div>
    </section>
  );
};

export default AboutSection;
