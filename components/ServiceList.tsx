import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Zap, PenTool, Monitor, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import PixelSprite from './fx/PixelSprite';
import { sfx } from '../lib/sfx';

const icons = [Layers, PenTool, Monitor, Zap];

// Seznam storitev: v vsaki temi druga postavitev
const ServiceList: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [open, setOpen] = useState<number | null>(0);
  const items = t.services.items;
  const desc = t.services.descriptions;

  if (theme === 'arcade') {
    const cols = ['var(--c1)', 'var(--c4)', 'var(--c2)', 'var(--c5)'];
    const sprites = ['star', 'coin', 'invader', 'ghost'] as const;
    const lv = [92, 88, 96, 84];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {items.map((s, i) => (
          <motion.div key={s} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onMouseEnter={() => sfx.blip()} className="pixel-box p-6">
            <div className="flex items-center gap-4 mb-4" style={{ color: cols[i] }}>
              <PixelSprite sprite={sprites[i]} size={6} accent="#fff" />
              <h3 className="font-display text-sm md:text-base text-[var(--text-main)]">{s}</h3>
            </div>
            <p className="text-xl leading-tight text-[var(--text-secondary)] mb-4">{desc[i]}</p>
            <div className="h-4 border-2 border-[var(--text-main)] p-[2px]"><div className="h-full" style={{ width: `${lv[i]}%`, background: cols[i] }} /></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (theme === 'editorial') {
    return (
      <div className="mb-28 max-w-4xl mx-auto">
        <h2 className="font-display italic text-3xl text-center mb-10 text-[var(--text-main)]">{t.tc.editorial.indexTitle}</h2>
        <ol>
          {items.map((s, i) => (
            <motion.li key={s} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="py-7 border-t border-[var(--border-color)] last:border-b group">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl md:text-5xl text-[var(--text-main)] group-hover:italic group-hover:text-[var(--accent-color)] transition-all">{s}</span>
                <span className="leader" />
                <span className="font-display italic text-xl text-[var(--text-muted)]">{t.tc.editorial.page} {(i + 1) * 4 + 3}</span>
              </div>
              <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-2xl">{desc[i]}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    );
  }

  if (theme === 'brutal') {
    const bgs = ['var(--bg-tertiary)', 'var(--c2)', 'var(--c4)', 'var(--c1)'];
    return (
      <div className="mb-24 border-y-[3px] border-[var(--text-main)]">
        {items.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s} className="border-b-[3px] last:border-b-0 border-[var(--text-main)]" style={{ background: isOpen ? bgs[i] : 'transparent' }}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 py-5 px-2 text-left hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-sm">0{i + 1}</span>
                  <span className="font-display text-4xl md:text-7xl">{s}</span>
                </span>
                <Plus size={40} strokeWidth={4} className={`shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-2 pb-8 pt-2 text-xl md:text-3xl font-medium max-w-3xl md:ml-14">{desc[i]}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-32">
      {items.map((service, index) => {
        const Icon = icons[index];
        return (
          <motion.div key={service} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, delay: index * 0.05 }}
            className="group relative border-t border-[var(--border-color)] py-16 md:py-24 transition-all duration-500 hover:bg-[var(--text-main)]/[0.03]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-1"><span className="font-mono text-sm md:text-base text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors duration-300">(0{index + 1})</span></div>
              <div className="lg:col-span-6"><h3 className="text-3xl md:text-6xl font-display font-bold text-[var(--text-main)] uppercase tracking-tighter break-words">{service}</h3></div>
              <div className="lg:col-span-5 pl-0 lg:pl-12 border-l-0 lg:border-l border-[var(--border-color)]"><p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed group-hover:text-[var(--text-main)] transition-colors duration-300">{desc[index]}</p></div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none" aria-hidden="true"><Icon className="w-64 h-64 md:w-96 md:h-96 text-[var(--text-main)] rotate-12" /></div>
          </motion.div>
        );
      })}
      <div className="w-full h-[1px] bg-[var(--border-color)]"></div>
    </div>
  );
};

export default ServiceList;
