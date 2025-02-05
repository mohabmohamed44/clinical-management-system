import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "Welcome to delma": "Welcome to delma",
            "language": "English (US)"
        }
    },
    ar: {
        translation: {
            "Welcome to delma":"مرحبا بك في دلما",
            "language": "العربية"
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // default language
    interpolation: {
        escapeValue: false
    }
});

export default i18n;