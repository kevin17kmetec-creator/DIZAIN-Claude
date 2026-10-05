import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { ROUTES } from '../routes';

const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.notFound.title, t.notFound.title);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="font-display text-6xl md:text-9xl font-bold text-[var(--text-main)]">404</h1>
      <p className="text-[var(--text-secondary)] text-xl">{t.notFound.title}</p>
      <Link to={ROUTES.home} className="px-8 py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-bold uppercase tracking-widest text-xs">{t.notFound.back}</Link>
    </div>
  );
};

export default NotFoundPage;
