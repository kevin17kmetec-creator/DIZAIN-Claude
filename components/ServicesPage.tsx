import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { ROUTES } from '../routes';
import { Layers, Zap, PenTool, Monitor, Database, LayoutTemplate } from 'lucide-react';
import Pricing from './Pricing';
import Faq from './Faq';

const icons = [Layers, PenTool, Monitor, Zap];

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.services.title, t.meta.services.description);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="mb-32 border-b border-[var(--border-color)] pb-12">
          <h1 className="font-display text-5xl md:text-9xl font-bold uppercase text-[var(--text-main)] mb-8 tracking-tight leading-[0.85] break-words">{t.nav.services}</h1>
          <p className="text-[var(--text-secondary)] text-xl md:text-2xl max-w-2xl leading-relaxed">{t.services.expertise}</p>
        </motion.div>

        <div className="flex flex-col mb-32">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="group relative border-t border-[var(--border-color)] py-16 md:py-24 transition-all duration-500 hover:bg-[var(--text-main)]/[0.03]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-1">
                    <span className="font-mono text-sm md:text-base text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors duration-300">(0{index + 1})</span>
                  </div>
                  <div className="lg:col-span-6">
                    <h3 className="text-3xl md:text-6xl font-display font-bold text-[var(--text-main)] uppercase tracking-tighter break-words">{service}</h3>
                  </div>
                  <div className="lg:col-span-5 pl-0 lg:pl-12 border-l-0 lg:border-l border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed group-hover:text-[var(--text-main)] transition-colors duration-300">{t.services.descriptions[index]}</p>
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none" aria-hidden="true">
                  <Icon className="w-64 h-64 md:w-96 md:h-96 text-[var(--text-main)] rotate-12" />
                </div>
              </motion.div>
            );
          })}
          <div className="w-full h-[1px] bg-[var(--border-color)]"></div>
        </div>

        {/* CMS */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-32 relative rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-main)] z-0"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text-main)]/10 border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-widest mb-8">
                <Database size={14} />
                <span>{t.services.cmsBadge}</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-8 leading-tight">
                {t.services.cmsTitle} <br /> <span className="text-[var(--text-muted)]">{t.services.cmsTitleMuted}</span>
              </h3>
              <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed mb-12 max-w-lg">{t.services.cmsText}</p>
              <ul className="flex flex-col gap-4">
                {t.services.cmsPoints.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-[var(--text-main)]">
                    <span className="keep-round w-6 h-6 rounded-full bg-[var(--text-main)] flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 bg-[var(--bg-main)] rounded-full"></span>
                    </span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-[360px] bg-[var(--bg-main)]/50 rounded-xl border border-[var(--border-color)] p-6 flex items-center justify-center overflow-hidden" aria-hidden="true">
              <div className="w-full h-full bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] overflow-hidden flex flex-col shadow-2xl">
                <div className="h-10 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center px-4 gap-2">
                  <div className="keep-round w-3 h-3 rounded-full bg-[var(--c4)]/40"></div>
                  <div className="keep-round w-3 h-3 rounded-full bg-[var(--c6)]/40"></div>
                  <div className="keep-round w-3 h-3 rounded-full bg-[var(--c1)]/40"></div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/4 bg-[var(--bg-tertiary)]/50 border-r border-[var(--border-color)] p-4 space-y-3">
                    {[1 / 2, 3 / 4, 2 / 3, 1 / 2, 3 / 4].map((w, i) => <div key={i} className="h-2 bg-[var(--text-main)]/10 rounded" style={{ width: `${w * 100}%` }} />)}
                  </div>
                  <div className="flex-1 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-1/3 bg-[var(--text-main)]/20 rounded"></div>
                      <div className="h-8 w-24 bg-[var(--c2)]/20 rounded border border-[var(--c2)]/40"></div>
                    </div>
                    <div className="h-36 bg-[var(--bg-tertiary)] rounded border border-[var(--border-color)] border-dashed flex flex-col items-center justify-center gap-3">
                      <LayoutTemplate size={32} className="text-[var(--text-muted)]" />
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{t.services.cmsDrop}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-[var(--text-main)]/10 rounded"></div>
                      <div className="h-2 w-5/6 bg-[var(--text-main)]/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Pricing />
      <Faq />

      <div className="container mx-auto px-6 text-center pb-12">
        <h3 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-8">{t.services.ctaTitle}</h3>
        <Link to={ROUTES.contact} className="inline-block px-12 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-bold uppercase tracking-widest hover:bg-[var(--text-secondary)] transition-colors rounded-full">
          {t.services.ctaButton}
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
