import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'minimal' | 'arcade' | 'editorial' | 'terminal';
export type Mode = 'dark' | 'light';

export const THEME_IDS: ThemeId[] = ['minimal', 'arcade', 'editorial', 'terminal'];

interface ThemeContextType {
  theme: ThemeId;
  mode: Mode;
  setTheme: (theme: ThemeId) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const read = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* zasebno brskanje */ }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => read('dizain-theme', THEME_IDS, 'minimal'));
  const [mode, setMode] = useState<Mode>(() => read('dizain-mode', ['dark', 'light'] as const, 'dark'));

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.mode = mode;
  }, [theme, mode]);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    write('dizain-theme', t);
  };

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      write('dizain-mode', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
