import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Marquee from './fx/Marquee';

interface Props {
  title: string;
  kicker?: string;
  lead?: string;
  index?: number; // zaporedna številka strani (nivo, poglavje ...)
}

// Naslovni del podstrani. V vsaki temi izgleda povsem drugače.
const PageHeader: React.FC<Props> = ({ title, kicker, lead, index = 1 }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const n = String(index).padStart(2, '0');

  if (theme === 'arcade') {
    return (
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16">
        <div className="pixel-box p-6 md:p-10 relative">
          <div className="flex items-center justify-between text-[10px] md:text-xs text-[var(--c2)] mb-6 font-display">
            <span><span className="blink">▶</span> {t.tc.arcade.stage} {n}</span>
            <span className="hidden sm:inline">{kicker ?? t.tc.arcade.tagline}</span>
            <span>{'♥'.repeat(3)}</span>
          </div>
          <h1 className="font-display text-[var(--text-main)] break-words" style={{ fontSize: 'clamp(1.6rem, 6vw, 4rem)', lineHeight: 1.2, textShadow: '4px 4px 0 var(--c4)' }}>{title}</h1>
          {lead && <p className="mt-6 text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl">{lead}</p>}
          <div className="mt-8 h-3 border-2 border-[var(--text-main)] p-[2px]" aria-hidden="true">
            <div className="h-full bg-[var(--c1)]" style={{ width: `${Math.min(100, index * 17)}%` }} />
          </div>
        </div>
      </motion.header>
    );
  }

  if (theme === 'editorial') {
    return (
      <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-20 text-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="flex-1 border-t border-[var(--text-main)]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-color)] font-bold">{kicker ?? `${t.tc.editorial.chapter} ${n}`}</span>
          <span className="flex-1 border-t border-[var(--text-main)]" />
        </div>
        <h1 className="font-display text-[var(--text-main)] italic break-words" style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)', lineHeight: 0.95 }}>{title}</h1>
        {lead && <p className="mt-8 text-xl md:text-2xl text-[var(--text-secondary)] font-display italic leading-snug max-w-2xl mx-auto">{lead}</p>}
        <div className="double-rule mt-10" />
      </motion.header>
    );
  }

  if (theme === 'brutal') {
    return (
      <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16 -mx-6 md:mx-0">
        <div className="px-6 md:px-0">
          <span className="inline-block bg-[var(--text-main)] text-[var(--bg-tertiary)] font-display text-sm px-3 py-1 -rotate-2 mb-6">{n} / {kicker ?? t.nav.menu}</span>
          <h1 className="font-display text-[var(--text-main)] break-words" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', lineHeight: 0.85, textShadow: '6px 6px 0 var(--bg-tertiary)' }}>{title}</h1>
          {lead && <p className="mt-8 text-lg md:text-2xl font-medium max-w-2xl bg-[var(--bg-secondary)] border-2 border-[var(--text-main)] p-4 hard-shadow">{lead}</p>}
        </div>
        <Marquee speed={22} className="mt-12 bg-[var(--text-main)] text-[var(--bg-tertiary)] py-3 border-y-2 border-[var(--text-main)]">
          {t.tc.brutal.marquee.map((m) => <span key={m} className="font-display text-lg md:text-2xl px-6 whitespace-nowrap">{m} ✺</span>)}
        </Marquee>
      </motion.header>
    );
  }

  return (
    <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-24">
      {kicker && <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-6">{kicker}</div>}
      <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-[var(--text-main)] mb-6 break-words leading-[0.95]">{title}</h1>
      <div className="w-24 h-1 bg-[var(--text-main)] mb-8" />
      {lead && <p className="text-[var(--text-secondary)] text-xl max-w-2xl leading-relaxed">{lead}</p>}
    </motion.header>
  );
};

export default PageHeader;
