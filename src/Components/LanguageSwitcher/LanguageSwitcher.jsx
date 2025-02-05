import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
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
