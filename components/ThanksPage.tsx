import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { ROUTES } from '../routes';

const ThanksPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.thanks.title, t.meta.thanks.description, true);
  return (
    <div className="page-top min-h-screen flex flex-col items-center justify-center gap-6 px-6 pb-24 text-center">
      <CheckCircle size={56} className="text-[var(--text-main)]" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">{t.thanks.eyebrow}</p>
      <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-main)] max-w-3xl leading-tight">{t.thanks.title}</h1>
      <p className="text-[var(--text-secondary)] text-lg max-w-xl leading-relaxed">{t.thanks.text}</p>
      <Link to={ROUTES.home} className="mt-4 px-8 py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-bold uppercase tracking-widest text-xs">
        {t.thanks.back}
      </Link>
    </div>
  );
};

export default ThanksPage;
