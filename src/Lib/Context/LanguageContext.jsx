import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Create the context
const LanguageContext = createContext();

// Create a provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('defaultLanguage', 'en');
  const { i18n } = useTranslation();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setLanguage(lng);
    setLanguageDropdownOpen(false);
  };

  // Initialize language on component mount
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, i18n]);

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(prev => !prev);
  };

  // Value to be provided to consumers
  const value = {
    language,
    changeLanguage,
    isRTL: language === 'ar',
    languageDropdownOpen,
    toggleLanguageDropdown,
    closeLanguageDropdown: () => setLanguageDropdownOpen(false)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 