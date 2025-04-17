import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Style from "./AskQuestion.module.css";

export default function AskQuestion() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="w-full bg-gray-50">
        <div className="text-center mx-auto mb-10 max-w-xl">
          <p className="inline-block border rounded-full border-blue-600 py-1 px-4 text-blue-600 mb-4">
            {t("AdditionalServices")}
          </p>
          <h1 className="text-4xl font-bold mt-2 mb-6">
            {t("Ask a Question with an Expert")}
          </h1>
        </div>
      
        <div className="flex flex-col items-center justify-center w-full bg-gray-50">
          <div className="text-center max-w-2xl px-4">
            <p className="text-gray-600 mb-8 text-lg">
              {t("Have questions about our labs or services or about Symptoms? Our experts are here to help! Get immediate assistance or schedule a consultation.")}
            </p>
            
            <Link 
              to="/ask-question" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg
                hover:bg-blue-700 transition-colors duration-300 text-lg
                shadow-lg hover:shadow-xl"
            >
              {t("Ask a Question Now")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}