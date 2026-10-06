import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from './PageHeader';

const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.privacy.title, t.meta.privacy.description);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] page-top pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <PageHeader title={t.privacy.title} lead={t.privacy.updated} index={6} />
        {t.privacy.sections.map((s) => (
          <section key={s.h} className="mb-10">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-3">{s.h}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
