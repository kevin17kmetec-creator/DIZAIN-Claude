import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const highlightIndex = 1;

  return (
    <section id="pricing" className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-6">{t.pricing.title}</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">{t.pricing.lead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {t.pricing.tiers.map((tier, index) => {
            const highlight = index === highlightIndex;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative flex flex-col p-8 rounded-2xl border ${
                  highlight
                    ? 'bg-[var(--bg-tertiary)] border-[var(--border-color-hover)] shadow-2xl md:scale-105 z-10'
                    : 'bg-[var(--bg-main)]/50 border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                } transition-all duration-300`}
              >
                {highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                    {t.pricing.popular}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-wider mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-display font-bold text-[var(--text-main)]">{tier.price}</span>
                    <span className="text-[var(--text-muted)] text-sm">{t.pricing.perProject}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-4 flex-grow mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <Check className="w-5 h-5 text-[var(--c1)] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(ROUTES.contact, { state: { project: `${tier.name} (${tier.price})` } })}
                  className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm transition-all duration-300 ${
                    highlight
                      ? 'bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--text-secondary)]'
                      : 'bg-[var(--text-main)]/5 text-[var(--text-main)] hover:bg-[var(--text-main)]/10 border border-[var(--border-color)]'
                  }`}
                >
                  {t.pricing.inquiry}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-16 text-center text-[var(--text-muted)] text-sm">{t.pricing.note}</p>
      </div>
    </section>
  );
};

export default Pricing;
