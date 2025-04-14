import React from "react";
import Style from "./Home.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import Background from '../../assets/home.webp';
import Doctor from '../../assets/doctor_home.webp';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HomeCard from "../../Components/HomeCard/HomeCard";
import SearchCard from "../../Components/SearchCard/SearchCard";
import AdditionalServices from "../../Components/AdditionalServices/AdditionalServices";
import UpcomingVisits from "../../Components/UpcomingVisits/UpcomingVisits";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <MetaData
        title="Home"
        description="This is the home page"
        keywords="home, page, welcome"
        author="Mohab Mohammed"
      />
      <main className="w-full object-cover h-screen">
        <header className="absolute top-0 left-0 w-full h-screen">
          <img
            src={Background}
            className="w-full h-screen absolute top-0 left-0 right-0"
            alt="Background"
            role="presentation"
            loading="lazy"
          />
          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-label="About Information"
          >
            {/* Text Content - Left Side */}
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              {/* Text Content - Left Side */}
              <div className="text-[#ffffff] max-w-lg mt-20 lg:mt-0 text-center lg:text-left order-1 lg:order-1">
                <h2
                  className="text-3xl text-start rtl:text-start sm:text-4xl leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center"
                  aria-label="About Heading"
                >
                  {t("Home")}
                </h2>
                <p className={`${Style.text}`} aria-label="Home Description">
                  {t("HomeDescription")}
                </p>
                <button className="px-5 py-3 flex items-center justify-start bg-white text-[#3454c1] mt-6 rounded-xl font-semibold text-xl">
                  <Link to="/doctors">
                    {t("BookNow")}
                  </Link>
                </button>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Doctor}
                  className="
                    w-full 
                    h-auto
                    max-w-[330px]
                    max-h-[330px]
                    md:max-h-[350px]
                    lg:max-h-[500px]
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

          {/* Search Input Card */}
          <div className="relative z-30 transform translate-y-[-80%]">
            <SearchCard />
          </div>
          {/* Services Heading */}
        </header>
      </main>
      <div className="mt-77 pt-10 sm:mt-20 md:mt-10 lg:mt-20 xl:mt-20">
        <UpcomingVisits/>
      </div>
      <HomeCard/>
      <AdditionalServices/>
    </>
  );
}