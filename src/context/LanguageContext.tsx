
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

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

const translations = {
  es: esTranslations,
  en: enTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lorcana-language') as Language;
    if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
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

      // Handle nested keys like 'match.initial_turn' or 'statistics.filter.title'
      const keys = key.split('.');
      let value: any = currentTranslations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // If key not found, try fallback to Spanish
          if (language !== 'es') {
            const fallbackTranslations = translations['es'];
            let fallbackValue: any = fallbackTranslations;
            
            for (const fk of keys) {
              if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
                fallbackValue = fallbackValue[fk];
              } else {
                return key; // Return original key if not found in fallback either
              }
            }
            
            return typeof fallbackValue === 'string' ? fallbackValue : key;
          }
          
          return key; // Return original key if not found
        }
      }
      
      return typeof value === 'string' ? value : key;
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
