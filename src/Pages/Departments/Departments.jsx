// import React, { useState, useEffect } from "react";
// import Style from "./Departments.module.css";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { GiLiver, GiKidneys, GiStomach } from "react-icons/gi";
// import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
// import Doc from '../../assets/doc.png';
// import Image from "../../assets/div-1.webp";
// import {
//   FaBrain,
//   FaFlask,
//   FaHeartbeat,
//   FaLungs,
//   FaTooth,
//   FaWheelchair,
//   FaEye,
//   FaAllergies,
//   FaBaby,
//   FaUserMd,
//   FaXRay,
// } from "react-icons/fa";
// import {
//   MdOutlinePregnantWoman,
//   MdOutlineElderly,
//   MdBloodtype,
// } from "react-icons/md";
// import { RiMentalHealthLine, RiSurgicalMaskLine } from "react-icons/ri";
// import MetaData from "../../Components/MetaData/MetaData";

// export default function Departments() {
//   const { t, i18n } = useTranslation();
//   const isRTL = i18n.dir() === "rtl";
//   const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
//   const departments = [
//     {
//       id: 1,
//       icon: <FaHeartbeat className="text-blue-600" size={24} />,
//       title: "Cardiology",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.1s",
//     },
//     {
//       id: 2,
//       icon: <FaLungs className="text-blue-600" size={24} />,
//       title: "Pulmonary",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.3s",
//     },
//     {
//       id: 3,
//       icon: <FaBrain className="text-blue-600" size={24} />,
//       title: "Neurology",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.5s",
//     },
//     {
//       id: 4,
//       icon: <FaWheelchair className="text-blue-600" size={24} />,
//       title: "Orthopedics",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.1s",
//     },
//     {
//       id: 5,
//       icon: <FaTooth className="text-blue-600" size={24} />,
//       title: "Dental Surgery",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.3s",
//     },
//     {
//       id: 6,
//       icon: <FaFlask className="text-blue-600" size={24} />,
//       title: "Laboratory",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
//       delay: "0.5s",
//     },
//     {
//       id: 7,
//       icon: <GiLiver className="text-blue-600" size={24} />,
//       title: "Hepatology",
//       description:
//         "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet",
//       delay: "0.6s",
//     },
//     {
//       id: 8,
//       icon: <FaEye className="text-blue-600" size={24} />,
//       title: "Ophthalmology",
//       description:
//         "Specialized care for eye conditions and vision problems with advanced diagnostic technology",
//       delay: "0.7s",
//     },
//     {
//       id: 9,
//       icon: <MdOutlinePregnantWoman className="text-blue-600" size={24} />,
//       title: "Obstetrics & Gynecology",
//       description:
//         "Comprehensive care for women including pregnancy, childbirth, and reproductive health",
//       delay: "0.2s",
//     },
//     {
//       id: 10,
//       icon: <FaAllergies className="text-blue-600" size={24} />,
//       title: "Allergy & Immunology",
//       description:
//         "Diagnosis and treatment of allergies, asthma, and disorders of the immune system",
//       delay: "0.4s",
//     },
//     {
//       id: 11,
//       icon: <GiKidneys className="text-blue-600" size={24} />,
//       title: "Nephrology",
//       description:
//         "Specialized care for kidney diseases and disorders with advanced treatment options",
//       delay: "0.3s",
//     },
//     {
//       id: 12,
//       icon: <FaBaby className="text-blue-600" size={24} />,
//       title: "Pediatrics",
//       description:
//         "Comprehensive healthcare for infants, children, and adolescents focusing on growth and development",
//       delay: "0.5s",
//     },
//     {
//       id: 13,
//       icon: <GiStomach className="text-blue-600" size={24} />,
//       title: "Gastroenterology",
//       description:
//         "Diagnosis and treatment of digestive system disorders and gastrointestinal conditions",
//       delay: "0.2s",
//     },
//     {
//       id: 14,
//       icon: <RiMentalHealthLine className="text-blue-600" size={24} />,
//       title: "Psychiatry",
//       description:
//         "Mental health services including diagnosis, treatment, and management of psychological disorders",
//       delay: "0.6s",
//     },
//     {
//       id: 15,
//       icon: <MdOutlineElderly className="text-blue-600" size={24} />,
//       title: "Geriatrics",
//       description:
//         "Specialized healthcare for elderly patients focusing on unique needs and conditions",
//       delay: "0.4s",
//     },
//     {
//       id: 16,
//       icon: <RiSurgicalMaskLine className="text-blue-600" size={24} />,
//       title: "General Surgery",
//       description:
//         "Surgical procedures for various conditions with state-of-the-art equipment and techniques",
//       delay: "0.3s",
//     },
//     {
//       id: 17,
//       icon: <FaUserMd className="text-blue-600" size={24} />,
//       title: "Internal Medicine",
//       description:
//         "Comprehensive care for adults focusing on prevention, diagnosis, and treatment of diseases",
//       delay: "0.5s",
//     },
//     {
//       id: 18,
//       icon: <MdBloodtype className="text-blue-600" size={24} />,
//       title: "Hematology",
//       description:
//         "Diagnosis and treatment of blood disorders and diseases with advanced therapeutic options",
//       delay: "0.7s",
//     },
//   ];

//   return (
//     <>
//       <MetaData
//         title="Departments"
//         description="this is Departments contains all medical departments"
//         keywords="Departments, our services"
//       />
//       <main className="w-full object-cover h-screen">
//               <header className="absolute top-0 left-0 w-full h-screen">
//                 <img
//                   src={Image}
//                   className="w-full h-screen absolute top-0 left-0 right-0"
//                   alt="Background"
//                   role="presentation"
//                   loading="lazy"
//                 />
//                 <section
//                   className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
//                   aria-label="About Information"
//                 >
//                   <div className="flex flex-col lg:flex-row items-center justify-between h-full">
//                     {/* Text Content - Left Side */}
//                     <div className="text-[#ffffff] max-w-lg mt-10 flex flex-col items-center justify-center lg:mt-22 text-center lg:text-left order-1 lg:order-1">
//                       <h2
//                         className="text-2xl sm:text-5xl leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center"
//                         aria-label="Departments Heading"
//                       >
//                         {t("DepartmentsHeading")}
//                       </h2>
//                       <p className={Style.Departments} aria-label="Departments Description">
//                         {t("DepartmentsDescription")}
//                       </p>
//                     </div>
//                     {/* Image - Right Side */}
//                     <figure
//                       className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2"
//                       aria-label="Doctor Image"
//                     >
//                       <img
//                         src={Doc}
//                         className="
//                           w-full
//                           h-auto
//                           max-w-[300px]
//                           max-h-[300px]
//                           md:max-h-[350px]
//                           lg:max-h-[500px]
//                           sm:max-w-md
//                           md:max-w-md
//                           lg:max-w-lg
//                           xl:max-w-xl
//                           object-contain
//                         "
//                         alt="Doctor"
//                         loading="lazy"
//                       />
//                     </figure>
//                     {/* Text Content - Left Side */}
//                   </div>
//                 </section>
//               </header>
//             </main>
//       {/* Breadcrumb Navigation */}
//       <nav className="bg-gray-50 py-3 px-4 md:px-6 mb-6">
//         <div className="max-w-7xl mx-auto">
//           <ol className="flex items-center space-x-2 text-md">
//             <li>
//               <Link to="/" className="text-[#3454c1] hover:underline">
//                 {t("Home")}
//               </Link>
//             </li>
//             <li className="flex items-center">
//               <ChevronRight className="text-[#3454c1]" />
//             </li>
//             <li className="text-gray-700 font-medium">{t("Departments")}</li>
//           </ol>
//         </div>
//       </nav>

//       <div className="text-center ">
//         <h1 className="inline-block border text-xl font-semibold rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
//           Departments
//         </h1>
//         <p className="text-xl font-medium text-black mt-3 tracking-wide">
//           Here is all Departments
//         </p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {departments.map((service) => (
//           <div
//             key={service.id}
//             className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105"
//           >
//             <div className="inline-flex items-center justify-center bg-white rounded-full mb-4 w-16 h-16 shadow-sm">
//               {service.icon}
//             </div>
//             <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
//             <p className="mb-4 text-gray-600">{service.description}</p>
//             <Link
//               className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
//               href="#"
//             >
//               Show Doctors
//               <span className="mr-2">
//                 <ArrowIcon size={20} />
//               </span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserMd } from "react-icons/fa";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import MetaData from "../../Components/MetaData/MetaData";
import Doc from "../../assets/doc.webp";
import Image from "../../assets/div-1.webp";
import Logo from "../../assets/logo.webp";

const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from("Specialties")
    .select("id, specialty, image, type")
    .eq("type", "Doctor")
    .order('id', {ascending: true});

  if (error) throw new Error(error.message);
  return data;
};

export default function Departments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const {
    data: doctors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA height={90} width={80} ariaLabel="loading-indicator" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <MetaData
        title="Departments | Medical Professionals"
        description="Browse our team of qualified doctors"
        keywords="doctors, medical specialists, healthcare professionals"
        author={"Mohab Mohammed"}
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
            aria-label="Doctor Information"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              <div className="text-[#ffffff] max-w-lg mt-20 flex flex-col items-center justify-center lg:mt-22 text-center lg:text-left order-1 lg:order-1">
                <h2 className="text-2xl sm:text-5xl rtl:text-right leading-11 rtl:leading-13 items-start font-bold mt-20 justify-center">
                  {t("DepartmentsHeading")}
                </h2>
                <p className="text-lg mt-4 rtl:text-right rtl:text-lg">{t("DepartmentsDescription")}</p>
              </div>
              <figure className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2">
                <img
                  src={Doc}
                  className="w-full 
                           h-auto
                           max-w-[300px]
                           max-h-[300px]
                           md:max-h-[350px]
                           lg:max-h-[500px]
                           sm:max-w-md
                           md:max-w-md
                           lg:max-w-lg
                           xl:max-w-xl
                           object-contain"
                  alt="Doctor"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>
        </header>
      </main>

      <nav className="bg-gray-50 py-3 px-4 md:px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-md">
            <li>
              <Link to="/" className="text-[#3454c1] hover:underline">
                {t("Home")}
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="text-[#3454c1]" />
            </li>
            <li className="text-gray-700 font-medium">{t("Departments")}</li>
          </ol>
        </div>
      </nav>

      <div className="text-center">
        <h1 className="inline-block border text-xl font-semibold rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
          {t("Departments")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
        {doctors?.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="inline-flex items-center justify-center bg-[#1972EE]/10 rounded-full mb-4 w-16 h-16 shadow-sm overflow-hidden">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={t(doctor.specialty)}
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-doctor.jpg";
                  }}
                />
              ) : (
                <img
                  src={Logo}
                  className="w-9 h-9 object-cover text-blue-700/70"
                />
              )}
            </div>

            <h4 className="text-xl font-semibold mb-3">
              {t(doctor.specialty)}
            </h4>

            <p className="mb-4 text-gray-600">
              {t("Specializedin")} {t(doctor.specialty)}
            </p>

            <Link to={`/departments/${doctor.specialty}/doctors`} 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              {t("ShowDoctors")}
              <span className="ml-2">
                <ArrowIcon size={20} />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
