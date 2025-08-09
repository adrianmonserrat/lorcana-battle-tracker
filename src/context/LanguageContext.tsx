
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
    // Provide a resilient fallback to avoid crashes and visible keys
    console.warn('useLanguage called outside of LanguageProvider, using fallback');
    const stored = (typeof window !== 'undefined'
      ? (localStorage.getItem('lorcana-language') as Language | null)
      : null);
    const supported: Language[] = ['es', 'en', 'de', 'fr', 'it'];
    const safeLang: Language = stored && (supported as readonly string[]).includes(stored)
      ? (stored as Language)
      : 'es';

    const translate = (key: string): string => {
      try {
        const current: any = (translations as any)[safeLang];
        const parts = key.split('.');
        let value: any = current;
        for (const p of parts) {
          if (value && typeof value === 'object' && p in value) {
            value = value[p];
          } else {
            value = undefined;
            break;
          }
        }
        if (typeof value === 'string') return value;
        if (safeLang !== 'es') {
          let v: any = (translations as any)['es'];
          for (const p of parts) v = v && typeof v === 'object' ? v[p] : undefined;
          if (typeof v === 'string') return v;
        }
        return key;
      } catch {
        return key;
      }
    };

    return {
      language: safeLang,
      setLanguage: () => {},
      t: translate
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
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('lorcana-language') as Language | null;
        if (savedLanguage && ['es', 'en', 'de', 'fr', 'it'].includes(savedLanguage)) {
          return savedLanguage;
        }
      }
      return 'es';
    } catch {
      return 'es';
    }
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('lorcana-language', newLanguage);
  };

  const t = (key: string): string => {
    try {
      const supported: Language[] = ['es', 'en', 'de', 'fr', 'it'];
      const lang: Language = (supported as readonly string[]).includes(language)
        ? language
        : 'es';
      const currentTranslations: any = (translations as any)[lang];

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

      // 1) Try direct key lookup (flat keys like "match.form.title")
      if (Object.prototype.hasOwnProperty.call(currentTranslations, key)) {
        const direct = (currentTranslations as any)[key];
        if (typeof direct === 'string') return direct;
      }

      // 2) Try nested resolution in current language
      const nested = getNested(currentTranslations);
      if (nested) return nested;

      // 3) Fallback to Spanish (direct, then nested)
      if (lang !== 'es') {
        const fallback: any = (translations as any)['es'];
        if (Object.prototype.hasOwnProperty.call(fallback, key)) {
          const directFallback = fallback[key];
          if (typeof directFallback === 'string') return directFallback;
        }
        const nestedFallback = getNested(fallback);
        if (nestedFallback) return nestedFallback;
      }

      // 4) As a last resort return the key
      return key;
    } catch {
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
