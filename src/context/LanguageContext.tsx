
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
    try {
      const currentTranslations = translations[language];
      if (!currentTranslations) {
        console.warn(`No translations found for language: ${language}`);
        return key;
      }

      // 1) Try direct key lookup (flat keys like "match.form.title")
      if (Object.prototype.hasOwnProperty.call(currentTranslations, key)) {
        const direct = (currentTranslations as any)[key];
        if (typeof direct === 'string') return direct;
      }

      // Helper to resolve nested keys (e.g., statistics.filter.title)
      const getNested = (obj: any): string | undefined => {
        const parts = key.split('.');
        let value: any = obj;
        for (const p of parts) {
          if (value && typeof value === 'object' && p in value) {
            value = value[p];
          } else {
            return undefined;
          }
        }
        return typeof value === 'string' ? value : undefined;
      };

      // 2) Try nested resolution in current language
      const nested = getNested(currentTranslations);
      if (nested) return nested;

      // 3) Fallback to Spanish (direct, then nested)
      if (language !== 'es') {
        const fallback = translations['es'];
        if (Object.prototype.hasOwnProperty.call(fallback, key)) {
          const directFallback = (fallback as any)[key];
          if (typeof directFallback === 'string') return directFallback;
        }
        const nestedFallback = getNested(fallback);
        if (nestedFallback) return nestedFallback;
      }

      // 4) As a last resort return the key
      return key;
    } catch (error) {
      console.error('Translation error:', error, 'for key:', key);
      return key;
    }
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
