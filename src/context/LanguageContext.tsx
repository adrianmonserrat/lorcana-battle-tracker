import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en' | 'de' | 'fr' | 'it';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide a fallback instead of throwing error to prevent app crashes
    console.warn('useLanguage called outside of LanguageProvider, using fallback');
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    };
  }
  return context;
};

// Import translations
import esTranslations from '../translations/es.json';
import enTranslations from '../translations/en.json';  
import deTranslations from '../translations/de.json';
import frTranslations from '../translations/fr.json';
import itTranslations from '../translations/it.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  it: itTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lorcana-language') as Language;
    if (savedLanguage && ['es', 'en', 'de', 'fr', 'it'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('lorcana-language', newLanguage);
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations['es'];
    return (currentTranslations as Record<string, string>)[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};