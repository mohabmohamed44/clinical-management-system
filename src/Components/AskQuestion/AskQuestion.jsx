import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SVG from '../../assets/patient.svg';
export default function AskQuestion() {
  const { t } = useTranslation();
  
  return (
    <div className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-block bg-blue-100 rounded-full px-6 py-2 mb-6">
            <span className="text-blue-600 font-medium text-lg">
              {t("AdditionalServices")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold  mb-6 bg-gradient-to-r from-[#00155D] to-cyan-500 bg-clip-text text-transparent">
            {t("Ask a Question with an Expert")}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Illustration */}
          <div className="animate-fade-in-up">
            <img 
              src={SVG}
              alt="Ask a Question" 
              className="w-full h-auto rounded-lg" 
              loading="lazy" 
            />
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 mb-8 text-lg md:text-xl leading-relaxed">
              {t("Have questions about our labs or services or about Symptoms? Our experts are here to help! Get immediate assistance or schedule a consultation.")}
            </p>
            
            <Link 
              to="/ask-question" 
              className="inline-flex items-center justify-center
                bg-blue-600 hover:bg-blue-700 text-white 
                px-8 py-4 rounded-xl
                transition-all duration-300
                text-lg font-medium
                transform hover:-translate-y-1 hover:shadow-2xl
                shadow-lg"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {t("Ask a Question Now")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}