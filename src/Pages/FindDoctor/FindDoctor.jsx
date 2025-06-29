import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MetaData from "../../Components/MetaData/MetaData";
import Background from "../../assets/background.webp";
import Doctor from "../../assets/find_doctor.webp";
import { useTranslation } from "react-i18next";
import SortDepartment from "../../Components/SortDepartment/SortDepartment";
import DoctorCard from "../../Components/DoctorCard/DoctorCard";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import FilterDoctors from "../../Components/filterDoctors/filterDoctors";
import { useSearchParams } from "react-router-dom";

export default function FindDoctor() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDepartment, setSelectedDepartment] = useState(
    searchParams.get("specialty") || "all"
  );
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const { data: doctors, isLoading, isError, error } = useQuery({
    queryKey: ['doctors', searchParams.toString()],
    queryFn: async () => {
      const specialty = searchParams.get("specialty");
      const location = searchParams.get("location");

      let query = supabase.from("Doctors").select(`
        id, first_name, first_name_ar, last_name_ar, last_name, phone, rate_count, rate, 
        gender, image, specialty, address
      `);

      if (specialty) {
        query = query.ilike("specialty", `%${specialty}%`);
      }

      const { data, error } = await query.order("rate", { ascending: false });
      if (error) throw error;

      // Location filtering
      if (location) {
        return data.filter(doctor => {
          try {
            const address = typeof doctor.address === "string" 
              ? JSON.parse(doctor.address)
              : doctor.address;
            
            const searchLocation = location.toLowerCase();
            
            if (Array.isArray(address)) {
              return address.some(addr => 
                addr?.city?.toLowerCase().includes(searchLocation)
              );
            }
            return address?.city?.toLowerCase().includes(searchLocation);
          } catch (e) {
            return false;
          }
        });
      }
      
      return data;
    }
  });

  useEffect(() => {
    if (doctors) {
      let filtered = [...doctors];

      // Apply rating filter
      if (activeFilters.rating) {
        const minRating = parseInt(activeFilters.rating);
        filtered = filtered.filter(doctor => doctor.rate >= minRating);
      }

      // Apply gender filter
      if (activeFilters.gender) {
        filtered = filtered.filter(doctor => 
          doctor.gender?.toLowerCase() === activeFilters.gender.toLowerCase()
        );
      }

      // Apply location filter
      if (activeFilters.location) {
        filtered = filtered.filter(doctor => {
          try {
            const address = typeof doctor.address === "string" 
              ? JSON.parse(doctor.address)
              : doctor.address;
            const searchLocation = activeFilters.location.toLowerCase();
            
            if (Array.isArray(address)) {
              return address.some(addr => 
                addr?.city?.toLowerCase().includes(searchLocation)
              );
            }
            return address?.city?.toLowerCase().includes(searchLocation);
          } catch (e) {
            return false;
          }
        });
      }

      // Apply price range filter (if price data exists)
      if (activeFilters.priceRange) {
        const [min, max] = activeFilters.priceRange.split('-').map(num => 
          num === '301+' ? 301 : parseInt(num)
        );
        filtered = filtered.filter(doctor => {
          const price = doctor.price; // Ensure this field exists in your data
          if (max === 301) return price >= 301;
          if (max) return price >= min && price <= max;
          return price >= min;
        });
      }

      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [doctors, activeFilters]); // Re-run when doctors or filters change

  // handle function for Department Selection
  const handleDepartmentSelect = (departmentId) => {
    const newParams = new URLSearchParams(searchParams);
    if (departmentId === "all") {
      newParams.delete("specialty");
    } else {
      newParams.set("specialty", departmentId);
    }
    setSearchParams(newParams, { replace: true }); // Add replace option here
    setSelectedDepartment(departmentId);
  };

  // Handler for filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA height={90} width={80} ariaLabel="loading-doctors" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">Error: {error.message}</div>
    );

  return (
    <>
      <MetaData
        title="Find Doctor"
        description="List of specialized and Certified doctors with years of Professional Experience"
        keywords="Doctors, find doctor, specialized doctor"
        author="Mohab Mohammed"
      />
      <main className="w-full object-cover h-screen">
        <header className="absolute top-0 left-0 w-full h-screen">
          <img
            src={Background}
            className="w-full h-screen absolute top-0 left-0 right-0"
            alt="Medical facility background"
            role="presentation"
            loading="lazy"
            width="1920"
            height="1080"
          />
          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-labelledby="main-heading"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              <div className="text-white max-w-lg mt-12 text-3xl text-center lg:text-left">
                <h1 id="main-heading" className="text-3xl rtl:text-right sm:text-5xl font-bold mt-15">
                  {t("Experts")}
                </h1>
                <p className="text-2xl md:text-4xl rtl:text-right font-medium mt-4">
                  {t("ExpertsDescription")}
                </p>
              </div>
              <figure className="mt-auto flex justify-center items-center w-full lg:w-1/2">
                <img
                  src={Doctor}
                  className="w-full h-[360px] max-w-[320px] md:max-h-[360px] object-contain"
                  alt="Healthcare professional"
                  loading="lazy"
                  width="320"
                  height="400"
                />
              </figure>
            </div>
            <div className="mt-10">
              <SortDepartment
                onDepartmentSelect={handleDepartmentSelect}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </section>
        </header>
      </main>

      {/* Doctor Cards Section */}
      <div className="min-h-screen bg-gray-50 p-8 mt-screen">
        <div className="max-w-7xl mx-auto pt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#274760] contrast-check">
            {selectedDepartment === "all"
              ? t("MedicalSpecialist")
              : `${t(selectedDepartment)}`}
          </h2>

          <div className="mb-8">
            <FilterDoctors onFilterChange={handleFilterChange} />
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={
                    i18n.language === "ar"
                      ? `${doctor.first_name_ar || doctor.first_name} ${doctor.last_name_ar || doctor.last_name}`
                      : `${doctor.first_name} ${doctor.last_name}`
                  }
                  specialty={t(doctor.specialty)}
                  description={doctor.description}
                  image={doctor.image}
                  phone={doctor.phone}
                  rate={doctor.rate}
                  rate_count={doctor.rate_count}
                  gender={t(doctor.gender)}
                  address={doctor.address}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[#274760]">
                {t("No doctors found matching your criteria")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}