import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';

const LegalLinks: React.FC<{ className?: string; linkClassName?: string; separator?: string }> = ({ className = '', linkClassName = 'underline hover:text-[var(--text-main)]', separator = ' · ' }) => {
  const { t } = useLanguage();
  const items = [
    { to: ROUTES.terms, label: t.footer.terms },
    { to: ROUTES.privacy, label: t.footer.privacy },
    { to: ROUTES.company, label: t.footer.company },
  ];
  return (
    <p className={className}>
      {items.map((it, i) => (
        <React.Fragment key={it.to}>
          {i > 0 && <span aria-hidden="true">{separator}</span>}
          <Link to={it.to} className={linkClassName}>{it.label}</Link>
        </React.Fragment>
      ))}
    </p>
  );
};

export default LegalLinks;
