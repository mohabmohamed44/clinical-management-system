import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Get saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Set initial language and direction
    i18n.changeLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [i18n]);

  const changeLanguage = (lng) => {
    // Save language preference to localStorage
    localStorage.setItem('language', lng);
    
    // Change language and direction
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => changeLanguage("en")} className="p-2 bg-gray-200 rounded">
        🇺🇸 {t("language")}
      </button>
      <button onClick={() => changeLanguage("ar")} className="p-2 bg-gray-200 rounded">
        🇸🇦 {t("language")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
