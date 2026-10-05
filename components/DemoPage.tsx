import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import ThemePicker from './ThemePicker';
import Configurator from './demo/Configurator';
import Shop from './demo/Shop';

type Tab = 'style' | 'configurator' | 'shop';
const TABS: { id: Tab; icon: React.ElementType }[] = [
  { id: 'style', icon: Palette },
  { id: 'configurator', icon: SlidersHorizontal },
  { id: 'shop', icon: ShoppingBag },
];

const DemoPage: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.demo.title, t.meta.demo.description);
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: Tab = raw === 'configurator' || raw === 'shop' ? raw : 'style';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-6">{t.demo.kicker}</div>
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-[var(--text-main)] mb-6 break-words">{t.demo.title}</h1>
          <div className="w-24 h-1 bg-[var(--text-main)] mb-8" />
          <p className="text-[var(--text-secondary)] text-xl max-w-2xl leading-relaxed">{t.demo.lead}</p>
        </motion.div>

        <div role="tablist" aria-label={t.demo.title} className="flex flex-wrap gap-2 mb-12 border-b border-[var(--border-color)]">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setParams(id === 'style' ? {} : { tab: id }, { replace: true })}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                tab === id ? 'border-[var(--text-main)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Icon size={16} /> {t.demo.tabs[id]}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {tab === 'style' && (
            <div>
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-10">{t.demo.styleHint}</p>
              <ThemePicker />
            </div>
          )}
          {tab === 'configurator' && <Configurator />}
          {tab === 'shop' && <Shop />}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
