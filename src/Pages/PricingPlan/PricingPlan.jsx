import React, { useState, useEffect } from "react";
import Banner from "../../assets/banner_img.png";
import Image from "../../assets/div-1.webp";
import { useTranslation } from "react-i18next";
import PriceCards from "../../Components/PriceCards/PriceCards";
import FAQSection from "../../Components/FAQ/FAQ";
import MetaData from "../../Components/MetaData/MetaData";
export default function PricingPlan() {
  const { t } = useTranslation();
  return (
    <>
      <MetaData
        title="Pricing Plan"
        description="Choose your ProHealth membership plan. Get access to premium healthcare services and benefits."
        keywords="pricing, membership, healthcare, plans"
        author="Mohab Mohammed"
      />
      <main className="w-full object-cover h-screen">
        <header className="absolute top-0 left-0 w-full h-screen">
          <img
            src={Image}
            className="w-full h-screen absolute top-0 left-0 right-0"
            alt="Background"
            role="presentation"
            loading="lazy"
          />
          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-label="About Information"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              {/* Text Content - Left Side */}
              <div className="text-white max-w-lg mt-20 lg:mt-0 text-center lg:text-left order-1 lg:order-1">
                <h2
                  className="text-5xl text-center md:text-5xl lg:text-left sm:text-center leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center rtl:text-right"
                  aria-label="About Heading"
                >
                  {t("pricing")}
                </h2>
                <p
                  className="text-2xl font-medium sm:text-2xl mt-4"
                  aria-label="Contact Reason"
                >
                  {t("pricingDetails")}
                </p>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center items-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Banner}
                  className="
                    w-full 
                    h-auto
                    max-w-[400px]
                    sm:max-w-sm
                    md:max-w-md
                    lg:max-w-lg
                    xl:max-w-xl
                    object-contain
                  "
                  alt="Doctor"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>
        </header>
      </main>
      <div>
        <h1 className="text-4xl font-bold text-[#3454c1] leading-11 rtl:leading-12 rtl:max-w-lg text-center max-w-2xl mx-auto">
          {t("PricingHeading")}
        </h1>
        <PriceCards />
        <FAQSection />
      </div>
    </>
  );
}
