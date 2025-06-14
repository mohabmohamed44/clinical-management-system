import React, { lazy, Suspense } from "react";
import Style from "./Home.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import Background from "../../assets/home.webp";
import BackgroundFallback from "../../assets/home.webp";
import Doctor from "../../assets/doctor_home.webp";
import DoctorFallback from "../../assets/doctor_home.webp";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HomeCard from "../../Components/HomeCard/HomeCard";
import SearchCard from "../../Components/SearchCard/SearchCard";

// Lazy load non-critical components
const UpcomingVisits = lazy(() =>
  import("../../Components/UpcomingVisits/UpcomingVisits")
);
const AdditionalServices = lazy(() =>
  import("../../Components/AdditionalServices/AdditionalServices")
);
const AskQuestion = lazy(() =>
  import("../../Components/AskQuestion/AskQuestion")
);
const FindMedicine = lazy(() =>
  import("../../Components/FindMedicine/FindMedicine")
);
export default function Home() {
  const { t } = useTranslation();

  return (
    <div role="region" aria-label="Home page content">
      <MetaData
        title={`${t("Home")} - Medical Platform`}
        description="Book appointments with qualified healthcare professionals and manage your medical needs"
        keywords="healthcare, medical appointments, doctor booking, medical services"
        author="Mohab Mohammed"
      />

      <main
        className="w-full object-cover h-screen"
        role="main"
        aria-labelledby="main-heading"
      >
        <header className="absolute top-0 left-0 w-full h-screen" role="banner">
          {/* Optimized background image with responsive sources */}
          <picture aria-hidden="true">
            <source srcSet={Background} type="image/avif" />
            <source srcSet={BackgroundFallback} type="image/webp" />
            <img
              src={BackgroundFallback}
              className="w-full h-screen absolute top-0 left-0 right-0"
              alt=""
              role="presentation"
              loading="eager"
              width="1920"
              height="1080"
              style={{ backgroundColor: "#3454c1" }}
            />
          </picture>

          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-labelledby="section-heading"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              <div className="text-[#ffffff] max-w-lg sm:mt-30 mt-15 md:mt-50 text-center lg:text-left order-1 lg:order-1">
                <h1
                  id="main-heading"
                  className="text-3xl text-start rtl:text-start sm:text-4xl leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center"
                  tabIndex="0"
                >
                  {t("Home")}
                </h1>
                <p
                  className={`${Style.text}`}
                  tabIndex="0"
                  aria-label={t("HomeDescription")}
                >
                  {t("HomeDescription")}
                </p>
                <div className="flex justify-start">
                  <Link
                    to="/find_doctor"
                    className="px-8 py-4 block bg-white text-[#2342a1] mt-6 rounded-xl font-semibold text-xl hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[150px] text-center"
                    aria-label={t("Book appointment with a doctor")}
                    role="button"
                    tabIndex="0"
                  >
                    {t("BookNow")}
                  </Link>
                </div>
              </div>

              {/* Optimized doctor image with responsive sources */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor illustration"
              >
                <picture>
                  <source srcSet={Doctor} type="image/avif" />
                  <source srcSet={DoctorFallback} type="image/webp" />
                  <img
                    src={DoctorFallback}
                    className="w-full h-auto max-w-[350px] max-h-[350px] md:max-h-[350px] lg:max-h-[500px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
                    alt={t("Friendly doctor available for consultation")}
                    loading="eager"
                    width="500"
                    height="500"
                    decoding="async"
                  />
                </picture>
              </figure>
            </div>
          </section>

          <div
            className="relative z-30 transform translate-y-[-80%]"
            role="search"
            aria-label="Search for doctors"
          >
            <SearchCard />
          </div>
        </header>
      </main>

      {/* Lazy loaded components with suspense */}
      <div
        className="mt-50 pt-10 sm:mt-50 md:mt-10 lg:mt-20 xl:mt-20 px-4 md:px-8 lg:px-12 py-10"
        role="complementary"
        aria-label="Upcoming appointments section"
      >
        <Suspense
          fallback={
            <div role="status" aria-live="polite">
              Loading appointments...
            </div>
          }
        >
          <UpcomingVisits />
        </Suspense>
      </div>

      <section role="region" aria-label="Medical services overview">
        <HomeCard />
      </section>

      <section role="region" aria-label="Additional services">
        <Suspense
          fallback={
            <div role="status" aria-live="polite">
              Loading services...
            </div>
          }
        >
          <AdditionalServices />
        </Suspense>
      </section>

      <section
        className="mt-7 px-4 md:px-8 lg:px-12"
        role="region"
        aria-label="Questions and support"
      >
        <Suspense
          fallback={
            <div role="status" aria-live="polite">
              Loading question form...
            </div>
          }
        >
          <AskQuestion />
        </Suspense>
      </section>
      <section className="mt-7 px-4 md:px-8 lg:px-12">
        <Suspense
          fallback={
            <div role="status" aria-live="polite">
              Loading question form...
            </div>
          }
        >
          <FindMedicine />
        </Suspense>
      </section>
    </div>
  );
}