import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Translations } from './translations';

export type Language = 'sl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const initialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem('dizain-lang');
    if (stored === 'sl' || stored === 'en') return stored;
  } catch { /* zasebno brskanje */ }
  return 'sl';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    try { localStorage.setItem('dizain-lang', lang); } catch { /* zasebno brskanje */ }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
