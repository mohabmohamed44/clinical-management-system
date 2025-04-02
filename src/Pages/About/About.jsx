import React, { useState, useEffect } from "react";
import Style from "./About.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
import Image from "../../assets/div-1.webp";
import Banner from "../../assets/nurse.png";
import ServiceCards from "../../Components/ServiceCards/ServiceCards";
import Details from "../../Components/_ServiceCards/_ServiceCards";
export default function About() {

  const { t } = useTranslation();
  return (
    <>
      <MetaData
        title="about"
        description="about"
        keywords="about, our services"
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
              <div className="text-[#ffffff] max-w-lg mt-20 lg:mt-0 text-center lg:text-left order-1 lg:order-1">
                <h2
                  className="text-4xl sm:text-4xl leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center"
                  aria-label="About Heading"
                >
                  {t("WelcomeMessage")}
                </h2>
                <p className={Style.About} aria-label="Contact Reason">
                  {t("partner")}
                </p>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Banner}
                  className="
                    w-full 
                    h-auto
                    max-w-[320px]
                    max-h-[340px]
                    md:max-h-[350px]
                    lg:max-h-[500px]
                    sm:max-w-md
                    md:max-w-md
                    lg:max-w-lg
                    xl:max-w-xl
                    object-contain
                  "
                  alt="Doctor"
                  loading="lazy"
                />
              </figure>
              {/* Text Content - Left Side */}
            </div>
          </section>
        </header>
      </main>
      <Details/>
      <ServiceCards/>
    </>
  );
}
