import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--bg-main)] py-12 border-t border-[var(--border-color)] transition-colors duration-500">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <div className="border-[2px] border-[var(--text-main)] px-3 py-1.5 mb-4 inline-block">
            <span className="font-logo font-bold text-xl tracking-[0.2em] text-[var(--text-main)] block">DIZAIN</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-2">{t.footer.tagline}</p>
          <p className="text-[var(--text-muted)] text-sm">© {new Date().getFullYear()} DIZAIN. {t.footer.rights}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-sm">
          <a href="mailto:dizain.slo@gmail.com" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
            <Mail size={16} /> dizain.slo@gmail.com
          </a>
          <Link to={ROUTES.privacy} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors underline">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
