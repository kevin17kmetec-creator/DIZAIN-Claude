import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { COMPANY } from '../data/company';
import PageHeader from './PageHeader';

const CompanyPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageMeta(t.meta.company.title, t.meta.company.description);
  const l = t.legal.labels;
  const rows: [string, string][] = [
    [l.name, COMPANY.legalName],
    [l.address, `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, ${COMPANY.country[language]}`],
    [l.reg, COMPANY.registrationNumber],
    [l.tax, COMPANY.taxNumber],
    [l.vat, COMPANY.vatId],
    [l.capital, COMPANY.shareCapital],
    [l.register, COMPANY.register],
    [l.rep, COMPANY.representative],
    [l.email, COMPANY.email],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] page-top pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <PageHeader title={t.legal.companyTitle} lead={t.legal.companyLead} index={6} />
        <dl className="border-t border-[var(--border-color)]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-3 gap-2 py-4 border-b border-[var(--border-color)]">
              <dt className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{k}</dt>
              <dd className="sm:col-span-2 text-[var(--text-main)] break-words">
                {k === l.email ? <a className="underline" href={`mailto:${v}`}>{v}</a> : v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default CompanyPage;
