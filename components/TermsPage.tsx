import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from './PageHeader';

const TermsPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.terms.title, t.meta.terms.description);
  return (
    <div className="min-h-screen bg-[var(--bg-main)] page-top pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <PageHeader title={t.legal.termsTitle} lead={t.legal.termsUpdated} index={6} />
        {t.legal.terms.map((s) => (
          <section key={s.h} className="mb-9">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">{s.h}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
