import React, { useState, useEffect } from "react";
import Style from "./FindMedicine.module.css";
import findMedicine from "@assets/Medicine.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Pill } from "lucide-react";
export default function FindMedicine() {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block border border-blue-600 rounded-full px-6 py-2 mb-6">
              <span className="text-blue-600 font-medium text-lg">
                {t("FindMedicine")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold  mb-6 bg-gradient-to-r from-[#00155D] to-[#1972EE] bg-clip-text text-transparent">
              {t("Find Your Medicine")}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Illustration */}
            <div className="animate-fade-in-up">
              <img
                src={findMedicine}
                alt="Find Your Medicine"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 mb-8 text-lg md:text-xl leading-relaxed">
                {t(
                  "Need help finding the right medicine? Our experts are here to assist you! Get immediate assistance or schedule a consultation."
                )}
              </p>
              <Link
                to="/find-medicine"
                className="inline-flex items-center justify-center
                bg-blue-600 hover:bg-blue-700 text-white
                px-8 py-4 rounded-xl
                transition-all duration-300
                text-lg font-medium
                transform hover:-translate-y-1 hover:shadow-2xl
                shadow-lg"
              >
                <Pill className="mr-2" />
                {t("Find a Medicine")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
