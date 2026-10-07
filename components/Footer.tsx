import React from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANY } from '../data/company';
import LegalLine from './LegalLine';
import LegalLinks from './LegalLinks';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--bg-main)] py-12 border-t border-[var(--border-color)] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="border-[2px] border-[var(--text-main)] px-3 py-1.5 mb-4 inline-block">
              <span className="font-logo font-bold text-xl tracking-[0.2em] text-[var(--text-main)] block">DIZAIN</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 text-sm">
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
              <Mail size={16} /> {COMPANY.email}
            </a>
            <LegalLinks className="text-[var(--text-muted)]" />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center md:text-left text-xs leading-relaxed text-[var(--text-muted)]">
          <LegalLine />
          <p className="mt-2">© {new Date().getFullYear()} {COMPANY.shortName} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
