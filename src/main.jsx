import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18.jsx";  // Make sure this path is correct
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </HelmetProvider>
  </StrictMode>
);