import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  
  // Using the custom hook to store the language
  const [language, setLanguage] = useLocalStorage("defaultLanguage", "en");

  const changeLanguage = (lng) => {
    setLanguage(lng); // Save in localStorage using the hook
    i18n.changeLanguage(lng); // Change language in i18next
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr"; // Change direction
  };

  // Load the saved language when the component mounts
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, i18n]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`p-2 rounded ${language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        🇺🇸 {t("language")}
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`p-2 rounded ${language === "ar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        🇸🇦 {t("language")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
