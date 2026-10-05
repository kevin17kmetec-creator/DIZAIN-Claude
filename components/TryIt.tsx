import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';
import ThemePicker from './ThemePicker';

const TryIt: React.FC = () => {
  const { t } = useLanguage();
  const icons = [SlidersHorizontal, ShoppingBag];
  const links = [`${ROUTES.demo}?tab=configurator`, `${ROUTES.demo}?tab=shop`];

  return (
    <section id="try" className="py-32 bg-[var(--bg-secondary)] border-y border-[var(--border-color)] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-6">{t.try.kicker}</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-6 leading-tight">{t.try.title}</h2>
          <p className="text-[var(--text-secondary)] text-lg">{t.try.desc}</p>
        </motion.div>

        <ThemePicker />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {t.try.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={card.title}
                to={links[i]}
                className="group flex items-center gap-6 p-6 border border-[var(--border-color)] hover:border-[var(--text-main)] transition-colors"
              >
                <Icon size={28} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-[var(--text-main)]">{card.title}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{card.desc}</div>
                </div>
                <span className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">
                  {card.cta} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TryIt;
