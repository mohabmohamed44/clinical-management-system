import React, { useState, useEffect } from "react";
import MetaData from "../../Components/MetaData/MetaData";
import Background from "../../assets/background.png";
import Doctor from "../../assets/find_doctor.png";
import DoctorImage from "../../assets/doc.png";
import { useTranslation } from "react-i18next";
import SortDepartment from "../../Components/SortDepartment/SortDepartment";
import DoctorCard from "../../Components/DoctorCard/DoctorCard";

export default function FindDoctor() {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Mock data - Replace this with actual API call later
  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Lisa Chen, MD",
      department: "Emergency Medicine",
      experience: "10+ Years of Experience",
      description:
        "Board-certified emergency medicine specialist with advanced training in trauma management and critical care.",
      image: DoctorImage,
    },
    {
      id: 2,
      name: "Dr. Michael Johnson, MD",
      department: "Cardiology",
      experience: "15+ Years of Experience",
      description:
        "Expert in interventional cardiology and preventive heart care. Pioneer in minimally invasive procedures.",
      image: DoctorImage,
    },
    {
      id: 3,
      name: "Dr. Sarah Wilson, MD",
      department: "Pediatrics",
      experience: "8+ Years of Experience",
      description:
        "Specialized in child development and neonatal care. Passionate about preventive pediatric health.",
      image: DoctorImage,
    },
    {
      id: 4,
      name: "Dr. David Smith, MD",
      department: "Orthopedics",
      experience: "12+ Years of Experience",
      description:
        "Expert in joint replacement surgeries and sports injury rehabilitation.",
      image: DoctorImage,
    },
    {
      id: 5,
      name: "Dr. Emily Brown, MD",
      department: "Dermatology",
      experience: "9+ Years of Experience",
      description:
        "Specialist in cosmetic dermatology and skin cancer prevention.",
      image: DoctorImage,
    },
    {
      id: 6,
      name: "Dr. James Wilson, MD",
      department: "Neurology",
      experience: "14+ Years of Experience",
      description:
        "Expert in neurodegenerative disorders and headache management.",
      image: DoctorImage,
    },
    {
      id: 7,
      name: "Dr. Robert Davis, MD",
      department: "Urology",
      experience: "11+ Years of Experience",
      description:
        "Specialized in minimally invasive urological procedures and men's health.",
      image: DoctorImage,
    },
    {
      id: 8,
      name: "Dr. Patricia Martinez, MD",
      department: "Gynecology",
      experience: "13+ Years of Experience",
      description:
        "Expert in women's health and reproductive medicine with focus on fertility treatments.",
      image: DoctorImage,
    },
    {
      id: 9,
      name: "Dr. Thomas Wright, DDS",
      department: "Dentistry",
      experience: "7+ Years of Experience",
      description:
        "Specialized in cosmetic dentistry and advanced dental restoration techniques.",
      image: DoctorImage,
    },
    {
      id: 10,
      name: "Dr. Jennifer Adams, MD",
      department: "Ophthalmology",
      experience: "9+ Years of Experience",
      description:
        "Expert in retinal disorders and laser vision correction procedures.",
      image: DoctorImage,
    },
    {
      id: 11,
      name: "Dr. Charles Taylor, MD",
      department: "Psychiatry",
      experience: "20+ Years of Experience",
      description:
        "Specialized in cognitive behavioral therapy and psychopharmacology.",
      image: DoctorImage,
    },
    {
      id: 12,
      name: "Dr. Elizabeth Anderson, MD",
      department: "Gastroenterology",
      experience: "16+ Years of Experience",
      description:
        "Expert in digestive health and advanced endoscopic procedures.",
      image: DoctorImage,
    },
    {
      id: 13,
      name: "Dr. Christopher Thomas, MD",
      department: "Endocrinology",
      experience: "10+ Years of Experience",
      description:
        "Specialized in diabetes management and hormonal disorders.",
      image: DoctorImage,
    },
    {
      id: 14,
      name: "Dr. Jessica White, MD",
      department: "Pulmonology",
      experience: "12+ Years of Experience",
      description:
        "Expert in respiratory diseases and critical care medicine.",
      image: DoctorImage,
    },
    {
      id: 15,
      name: "Dr. Daniel Harris, MD",
      department: "Rheumatology",
      experience: "8+ Years of Experience",
      description:
        "Specialized in autoimmune disorders and joint diseases.",
      image: DoctorImage,
    },
    {
      id: 16,
      name: "Dr. Sarah Lee, MD",
      department: "Hematology",
      experience: "11+ Years of Experience",
      description:
        "Expert in blood disorders and hematologic malignancies.",
      image: DoctorImage,
    },
    {
      id: 17,
      name: "Dr. William Clark, MD",
      department: "Oncology",
      experience: "15+ Years of Experience",
      description:
        "Specialized in cancer treatment and research with focus on personalized medicine.",
      image: DoctorImage,
    },
    {
      id: 18,
      name: "Dr. Mary Lewis, MD",
      department: "Nephrology",
      experience: "9+ Years of Experience",
      description:
        "Expert in kidney diseases and dialysis management.",
      image: DoctorImage,
    },
    {
      id: 19,
      name: "Dr. Robert Walker, MD",
      department: "Infectious Disease",
      experience: "13+ Years of Experience",
      description:
        "Specialized in infectious diseases and travel medicine.",
      image: DoctorImage,
    },
    {
      id: 20,
      name: "Dr. Patricia Hall, MD",
      department: "Anesthesiology",
      experience: "10+ Years of Experience",
      description:
        "Expert in pain management and anesthesia for surgical procedures.",
      image: DoctorImage,
    },
  ];

  // Set initial doctors data
  useEffect(() => {
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  // Filter doctors when department changes
  useEffect(() => {
    filterDoctorsByDepartment(selectedDepartment);
  }, [selectedDepartment, doctors]);

  // Filter function
  const filterDoctorsByDepartment = (department) => {
    if (department === 'all') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor => 
        doctor.department.toLowerCase() === department.toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  };
  
  // Handler for department selection
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

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
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              {/* Text Content - Left Side */}
              <div className="text-white max-w-lg mt-12 text-3xl  text-center lg:text-left order-1 lg:order-1">
                <h2
                  className="text-3xl text-center sm:text-5xl sm:text-center leading-11 rtl:leading-13 items-start font-bold mt-15 justify-center lg:text-left rtl:text-right"
                  aria-label="About Heading"
                >
                  {t("Experts")}
                </h2>
                <p
                  className="text-3xl md:text-4xl text-center md:text-left font-medium sm:text-2xl mt-4 rtl:text-right"
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
                    max-h-[360px]
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
            <div className="mt-10">
              <SortDepartment onDepartmentSelect={handleDepartmentClick} selectedDepartment={selectedDepartment} />
            </div>
          </section>
        </header>
      </main>
      
      {/* Doctor Cards Section */}
      <div className="min-h-screen bg-gray-50 p-8 mt-screen">
        <div className="max-w-7xl mx-auto pt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#274760]">
            {selectedDepartment === 'all' 
              ? 'Our Medical Specialists' 
              : `${selectedDepartment} Specialists`}
          </h2>
          
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} {...doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[#274760]">No doctors found in this department. Please try another category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

