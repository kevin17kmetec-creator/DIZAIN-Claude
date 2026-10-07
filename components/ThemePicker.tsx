import React from 'react';
import { useTheme, THEME_IDS } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { THEME_SWATCH } from './ThemeSwitcher';

// Velik izbirnik sloga za domačo stran in demo
const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div data-anchor="theme-picker" role="radiogroup" aria-label={t.nav.style} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {THEME_IDS.map((id) => {
        const active = theme === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={(e) => setTheme(id, { x: e.clientX, y: e.clientY })}
            className={`text-left p-5 border transition-all duration-300 ${
              active
                ? 'border-[var(--text-main)] bg-[var(--text-main)]/5'
                : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <div className="flex h-12 w-full mb-4 overflow-hidden border border-[var(--border-color)]" aria-hidden="true">
              {THEME_SWATCH[id].map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="text-sm font-bold text-[var(--text-main)] mb-1">{t.themes[id].name}</div>
            <div className="text-xs text-[var(--text-secondary)]">{t.themes[id].desc}</div>
            {active && (
              <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)]">{t.try.current}</div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;
