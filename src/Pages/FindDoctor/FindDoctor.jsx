import React, { useState, useEffect } from "react";
import Style from "./FindDoctor.module.css";
import MetaData from '../../Components/MetaData/MetaData';
import { Meta } from "react-router-dom";
import Backgound from '../../assets/background.png';
import Doctor from '../../assets/find_doctor.png';
import { useTranslation } from "react-i18next";

export default function FindDoctor() {

  const { t } = useTranslation();
  return (
    <>
      <MetaData
        title="Find Doctor"
        description="There is List of specialized and Certified doctors with years of Professional Experience"
        keywords="Doctors, find doctor, specialized doctor"
        author="Mohab Mohammed"
      />
      <main className="w-full object-cover h-screen">
        <header className="absolute top-0 left-0 w-full h-screen">
          <img
            src={Backgound}
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
                  className="text-2xl text-center md:text-5xl sm:text-center leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center lg:text-left rtl:text-right"
                  aria-label="About Heading"
                >
                  {t("Experts")}
                </h2>
                <p
                  className="text-xl font-medium sm:text-2xl mt-4 text-left rtl:text-right"
                  aria-label="Contact Reason"
                >
                  {t("ExpertsDescription")}
                </p>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center items-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Doctor}
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
            </div>
          </section>
        </header>
      </main>
    </>
  );
}
