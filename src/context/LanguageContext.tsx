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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple translations object to avoid import issues
const translations = {
  es: {
    'app.title': 'Contador Lorcana',
    'nav.tournaments': 'Torneos',
    'tabs.register_match': 'Registrar Partida',
    'tabs.statistics': 'Estadísticas',
    'tabs.my_decks': 'Mis Mazos',
    'auth.access_required': 'Acceso Requerido',
    'auth.login_required_decks': 'Necesitas iniciar sesión para gestionar tus mazos.',
    'nav.login': 'Iniciar Sesión'
  },
  en: {
    'app.title': 'Lorcana Counter',
    'nav.tournaments': 'Tournaments',
    'tabs.register_match': 'Register Match',
    'tabs.statistics': 'Statistics',
    'tabs.my_decks': 'My Decks',
    'auth.access_required': 'Access Required',
    'auth.login_required_decks': 'You need to login to manage your decks.',
    'nav.login': 'Login'
  }
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
    return currentTranslations[key] || key;
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