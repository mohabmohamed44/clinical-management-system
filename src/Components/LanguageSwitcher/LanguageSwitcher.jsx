import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    // Save language preference to localStorage
    localStorage.setItem('defaultLanguage', lng);
    
    // Change language and direction
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => changeLanguage("en")} 
        className={`p-2 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇺🇸 {t("language")}
      </button>
      <button 
        onClick={() => changeLanguage("ar")} 
        className={`p-2 rounded ${i18n.language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇸🇦 {t("language")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;