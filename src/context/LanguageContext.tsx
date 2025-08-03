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

// Debug: Log translations structure on load
console.log('Translations loaded:', {
  es: !!esTranslations,
  esKeys: Object.keys(esTranslations || {}).length,
  sampleEsKey: esTranslations?.['match.form.title'],
  esType: typeof esTranslations,
});

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
    // Simple debug log for all translations
    console.log('Translation requested:', { key, language, translationsAvailable: Object.keys(translations) });
    
    const currentTranslations = translations[language] || translations['es'];
    
    // More specific debug for problematic keys
    if (key === 'match.form.title' || key === 'colors.amber' || key === 'match.best_of_3') {
      console.log('Detailed translation debug:', {
        key,
        language,
        currentTranslations: currentTranslations,
        translationType: typeof currentTranslations,
        matchFormTitle: currentTranslations?.['match.form.title'],
        hasMatchKey: 'match.form.title' in (currentTranslations || {}),
      });
    }
    
    // Handle nested keys like 'statistics.filter.title'
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }
    
    return typeof value === 'string' ? value : key;
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