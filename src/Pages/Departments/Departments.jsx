import React, { useState, useEffect } from "react";
import Style from "./Departments.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiLiver, GiKidneys, GiStomach } from "react-icons/gi";
import { ChevronRight } from "lucide-react";
import { 
  FaBrain, 
  FaFlask, 
  FaHeartbeat, 
  FaLungs, 
  FaTooth, 
  FaWheelchair, 
  FaEye, 
  FaAllergies,
  FaBaby,
  FaUserMd,
  FaXRay
} from "react-icons/fa";
import { 
  MdOutlinePregnantWoman, 
  MdOutlineElderly,
  MdBloodtype
} from "react-icons/md";
import { RiMentalHealthLine, RiSurgicalMaskLine } from "react-icons/ri";

export default function Departments() {
  const { t } = useTranslation();
  const departments = [
    {
      id: 1,
      icon: <FaHeartbeat className="text-blue-600" size={24} />,
      title: 'Cardiology',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.1s'
    },
    {
      id: 2,
      icon: <FaLungs className="text-blue-600" size={24} />,
      title: 'Pulmonary',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.3s'
    },
    {
      id: 3,
      icon: <FaBrain className="text-blue-600" size={24} />,
      title: 'Neurology',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.5s'
    },
    {
      id: 4,
      icon: <FaWheelchair className="text-blue-600" size={24} />,
      title: 'Orthopedics',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.1s'
    },
    {
      id: 5,
      icon: <FaTooth className="text-blue-600" size={24} />,
      title: 'Dental Surgery',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.3s'
    },
    {
      id: 6,
      icon: <FaFlask className="text-blue-600" size={24} />,
      title: 'Laboratory',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.5s'
    },
    {
      id: 7,
      icon: <GiLiver className="text-blue-600" size={24}/>,
      title: 'Hepatology',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet',
      delay: '0.6s',
    },
    {
      id: 8,
      icon: <FaEye className="text-blue-600" size={24}/>,
      title: 'Ophthalmology',
      description: 'Specialized care for eye conditions and vision problems with advanced diagnostic technology',
      delay: '0.7s',
    },
    {
      id: 9,
      icon: <MdOutlinePregnantWoman className="text-blue-600" size={24}/>,
      title: 'Obstetrics & Gynecology',
      description: 'Comprehensive care for women including pregnancy, childbirth, and reproductive health',
      delay: '0.2s',
    },
    {
      id: 10,
      icon: <FaAllergies className="text-blue-600" size={24}/>,
      title: 'Allergy & Immunology',
      description: 'Diagnosis and treatment of allergies, asthma, and disorders of the immune system',
      delay: '0.4s',
    },
    {
      id: 11,
      icon: <GiKidneys className="text-blue-600" size={24}/>,
      title: 'Nephrology',
      description: 'Specialized care for kidney diseases and disorders with advanced treatment options',
      delay: '0.3s',
    },
    {
      id: 12,
      icon: <FaBaby className="text-blue-600" size={24}/>,
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for infants, children, and adolescents focusing on growth and development',
      delay: '0.5s',
    },
    {
      id: 13,
      icon: <GiStomach className="text-blue-600" size={24}/>,
      title: 'Gastroenterology',
      description: 'Diagnosis and treatment of digestive system disorders and gastrointestinal conditions',
      delay: '0.2s',
    },
    {
      id: 14,
      icon: <RiMentalHealthLine className="text-blue-600" size={24}/>,
      title: 'Psychiatry',
      description: 'Mental health services including diagnosis, treatment, and management of psychological disorders',
      delay: '0.6s',
    },
    {
      id: 15,
      icon: <MdOutlineElderly className="text-blue-600" size={24}/>,
      title: 'Geriatrics',
      description: 'Specialized healthcare for elderly patients focusing on unique needs and conditions',
      delay: '0.4s',
    },
    {
      id: 16,
      icon: <RiSurgicalMaskLine className="text-blue-600" size={24}/>,
      title: 'General Surgery',
      description: 'Surgical procedures for various conditions with state-of-the-art equipment and techniques',
      delay: '0.3s',
    },
    {
      id: 17,
      icon: <FaUserMd className="text-blue-600" size={24}/>,
      title: 'Internal Medicine',
      description: 'Comprehensive care for adults focusing on prevention, diagnosis, and treatment of diseases',
      delay: '0.5s',
    },
    {
      id: 18,
      icon: <MdBloodtype className="text-blue-600" size={24}/>,
      title: 'Hematology',
      description: 'Diagnosis and treatment of blood disorders and diseases with advanced therapeutic options',
      delay: '0.7s',
    },
    {
      id: 19,
      icon: <FaXRay className="text-blue-600" size={24}/>,
      title: 'Radiology',
      description: 'Advanced imaging services including X-rays, MRI, CT scans, and ultrasound for accurate diagnosis',
      delay: '0.2s',
    }
  ];
  
  return (
    <>
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
              <ChevronRight className="text-[#3454c1]" />
            </li>
            <li className="text-gray-700 font-medium">
              {t("Departments")}
            </li>
          </ol>
        </div>
      </nav>

      <div className="text-center ">
        <h1 className="inline-block border text-xl font-semibold rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
          Departments
        </h1>
        <p className="text-xl font-medium text-black mt-3 tracking-wide">Here is all Departments</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {departments.map((service) => (
          <div key={service.id} className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105">
            <div className="inline-flex items-center justify-center bg-white rounded-full mb-4 w-16 h-16 shadow-sm">
              {service.icon}
            </div>
            <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
            <p className="mb-4 text-gray-600">{service.description}</p>
            <Link className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300" href="#">
              <span className="mr-2">+</span>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
