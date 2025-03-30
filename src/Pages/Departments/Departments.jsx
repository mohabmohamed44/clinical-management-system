import React, { useState, useEffect } from "react";
import Style from "./Departments.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiKidneys, GiStomach } from "react-icons/gi";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TbGenderMale } from "react-icons/tb";
import Cardiology from "../../assets/Cardio.svg";
import Liver from "../../assets/liver.svg";
import Gynecologist from "../../assets/Gynecologist.svg";
import Lungs from "../../assets/Lungs.svg";
import Backgound from "../../assets/background.png";
import Doc from "../../assets/doc.png";

import {
  FaBrain,
  FaTooth,
  FaWheelchair,
  FaEye,
  FaAllergies,
  FaBaby,
  FaUserMd,
} from "react-icons/fa";
import {
  MdOutlinePregnantWoman,
  MdOutlineElderly,
  MdBloodtype,
} from "react-icons/md";
import { RiMentalHealthLine, RiSurgicalMaskLine } from "react-icons/ri";
import MetaData from "../../Components/MetaData/MetaData";

export default function Departments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const DirectedArrow = isRTL ? ChevronLeft : ChevronRight;
  const departments = [
    {
      id: 1,
      icon: <img src={Cardiology} className="text-[#11319E] h-12 w-12" />,
      title: "Cardiology",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      delay: "0.1s",
    },
    {
      id: 2,
      icon: <img src={Lungs} className="text-[#11319E] h-9 w-9" />,
      title: "Pulmonary",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      delay: "0.3s",
    },
    {
      id: 3,
      icon: <FaBrain className="text-[#11319E]" size={24} />,
      title: "Neurology",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      delay: "0.5s",
    },
    {
      id: 4,
      icon: <FaWheelchair className="text-[#11319E]" size={24} />,
      title: "Orthopedics",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      delay: "0.1s",
    },
    {
      id: 5,
      icon: <FaTooth className="text-[#11319E]" size={24} />,
      title: "Dental Surgery",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      delay: "0.3s",
    },
    {
      id: 7,
      icon: <img src={Liver} className="text-[#11319E] h-8 w-8" />,
      title: "Hepatology",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet",
      delay: "0.6s",
    },
    {
      id: 8,
      icon: <FaEye className="text-[#11319E]" size={24} />,
      title: "Ophthalmology",
      description:
        "Specialized care for eye conditions and vision problems with advanced diagnostic technology",
      delay: "0.7s",
    },
    {
      id: 9,
      icon: <img src={Gynecologist} className="text-[#11319E] h-9 w-9" />,
      title: "Obstetrics & Gynecology",
      description:
        "Comprehensive care for women including pregnancy, childbirth, and reproductive health",
      delay: "0.2s",
    },
    {
      id: 11,
      icon: <TbGenderMale className="text-[#11319E]" size={30} />,
      title: "Men's Health",
      description:
        "Specialized care for men including reproductive health, prostate health, and hormonal disorders",
      delay: "0.2s",
    },
    {
      id: 12,
      icon: <FaAllergies className="text-[#11319E]" size={24} />,
      title: "Allergy & Immunology",
      description:
        "Diagnosis and treatment of allergies, asthma, and disorders of the immune system",
      delay: "0.4s",
    },
    {
      id: 13,
      icon: <GiKidneys className="text-[#11319E]" size={24} />,
      title: "Nephrology",
      description:
        "Specialized care for kidney diseases and disorders with advanced treatment options",
      delay: "0.3s",
    },
    {
      id: 14,
      icon: <FaBaby className="text-[#11319E]" size={24} />,
      title: "Pediatrics",
      description:
        "Comprehensive healthcare for infants, children, and adolescents focusing on growth and development",
      delay: "0.5s",
    },
    {
      id: 15,
      icon: <GiStomach className="text-[#11319E]" size={24} />,
      title: "Gastroenterology",
      description:
        "Diagnosis and treatment of digestive system disorders and gastrointestinal conditions",
      delay: "0.2s",
    },
    {
      id: 16,
      icon: <RiMentalHealthLine className="text-[#11319E]" size={24} />,
      title: "Psychiatry",
      description:
        "Mental health services including diagnosis, treatment, and management of psychological disorders",
      delay: "0.6s",
    },
    {
      id: 17,
      icon: <MdOutlineElderly className="text-[#11319E]" size={24} />,
      title: "Geriatrics",
      description:
        "Specialized healthcare for elderly patients focusing on unique needs and conditions",
      delay: "0.4s",
    },
    {
      id: 18,
      icon: <RiSurgicalMaskLine className="text-[#11319E]" size={24} />,
      title: "General Surgery",
      description:
        "Surgical procedures for various conditions with state-of-the-art equipment and techniques",
      delay: "0.3s",
    },
    {
      id: 19,
      icon: <FaUserMd className="text-[#11319E]" size={24} />,
      title: "Internal Medicine",
      description:
        "Comprehensive care for adults focusing on prevention, diagnosis, and treatment of diseases",
      delay: "0.5s",
    },
    {
      id: 20,
      icon: <MdBloodtype className="text-[#11319E]" size={24} />,
      title: "Hematology",
      description:
        "Diagnosis and treatment of blood disorders and diseases with advanced therapeutic options",
      delay: "0.7s",
    },
  ];

  return (
    <>
      <MetaData
        title="Departments | Delma"
        description="There is List of specialized and Certified doctors with years of Professional Experience"
        keywords="Doctors, Departments"
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
                  className="text-4xl text-left md:text-5xl sm:text-center leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center lg:text-left rtl:text-right"
                  aria-label="Departments Heading"
                >
                  Get to Know Delma Departments
                </h2>
                <p
                  className="text-xl/5 font-medium  leading-8 sm:text-2xl mt-4 text-left rtl:text-right"
                  aria-label="Department Description"
                >
                  At Delma, we offer a wide range of medical and healthcare
                  services that are designed to meet your individual needs and
                  help you achieve optimal health.
                </p>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center items-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Doc}
                  className="
                    w-full 
                    h-auto
                    max-w-[320px]
                    max-h-[350px]
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
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-3 px-4 md:px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-md">
            <li>
              <Link to="/" className="text-[#3454c1] hover:underline">
                {t("Home")}
              </Link>
            </li>
            <li className="flex items-center">
              <DirectedArrow className="text-[#3454c1]" />
            </li>
            <li className="text-gray-700 font-medium">{t("Departments")}</li>
          </ol>
        </div>
      </nav>

      <div className="text-center ">
        <h1 className="inline-block border text-xl font-semibold rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
          {t("Departments")}
        </h1>
        <p className="text-xl font-medium text-black mt-3 tracking-wide">
          Here is all Departments
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {departments.map((service) => (
          <div
            key={service.id}
            className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="inline-flex items-center justify-center bg-[#1972EE]/10 rounded-full mb-4 w-16 h-16 shadow-sm">
              {service.icon}
            </div>
            <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
            <p className="mb-4 text-gray-600">{service.description}</p>
            <Link
              className="inline-flex items-center text-[#11319E] hover:text-blue-800 transition-colors duration-300"
              href="#"
            >
              Show Doctors
              <span className="mr-2">
                <ArrowIcon size={20} />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
