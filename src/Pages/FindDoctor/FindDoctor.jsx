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

export default function FindDoctor() {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    rating: '',
    gender: '',
    location: '',
    priceRange: ''
  });

  // Fetch doctors using TanStack Query
  const { data: doctors, isLoading, isError, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Doctors')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          rate_count,
          rate,
          gender,
          image,
          specialty,
          address
        `)
        .order('rate', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Update useEffect to handle filters more precisely
  useEffect(() => {
    if (!doctors) return;
    
    let filtered = [...doctors];
    
    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(doctor => 
        t(doctor.specialty?.toLowerCase() || '') === t(selectedDepartment.toLowerCase())
      );
    }

    // Rating filter
    if (activeFilters.rating) {
      filtered = filtered.filter(doctor => 
        doctor.rate >= parseInt(activeFilters.rating)
      );
    }

    // Gender filter
    if (activeFilters.gender) {
      filtered = filtered.filter(doctor => 
        doctor.gender?.toLowerCase() === activeFilters.gender.toLowerCase()
      );
    }

    // Location filter - Add null check
    if (activeFilters.location) {
      filtered = filtered.filter(doctor => 
        doctor.address && typeof doctor.address === 'string' && 
        doctor.address.toLowerCase().includes(activeFilters.location.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [selectedDepartment, doctors, t, activeFilters]);

  // Handler for filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  // Loading and error states
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <DNA height={90} width={80} ariaLabel="loading-doctors" />
    </div>
  );

  if (isError) return (
    <div className="text-red-500 text-center py-8">
      Error: {error.message}
    </div>
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
            alt="Background"
            role="presentation"
            loading="lazy"
          />
          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-label="Doctor Information"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              <div className="text-white max-w-lg mt-12 text-3xl text-center lg:text-left">
                <h2 className="text-3xl sm:text-5xl font-bold mt-15">
                  {t("Experts")}
                </h2>
                <p className="text-2xl md:text-4xl font-medium mt-4">
                  {t("ExpertsDescription")}
                </p>
              </div>
              <figure className="mt-auto flex justify-center items-center w-full lg:w-1/2">
                <img
                  src={Doctor}
                  className="w-full h-auto max-w-[320px] md:max-h-[4000px] object-contain"
                  alt="Doctor"
                  loading="lazy"
                />
              </figure>
            </div>
            <div className="mt-10">
              <SortDepartment 
                onDepartmentSelect={setSelectedDepartment} 
                selectedDepartment={selectedDepartment} 
              />
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
              : `${t(selectedDepartment)} Specialists`}
          </h2>
          
          {/* Add FilterDoctors component */}
          <div className="mb-8">
            <FilterDoctors onFilterChange={handleFilterChange} />
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id}
                  id={doctor.id}
                  name={`${doctor.first_name} ${doctor.last_name}`}
                  specialty={t(doctor.specialty)}
                  description={doctor.description}
                  image={doctor.image}
                  phone={doctor.phone}
                  rate={doctor.rate}
                  rate_count={doctor.rate_count}
                  gender={doctor.gender}
                  address={doctor.address}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[#274760]">
                No doctors found in this department. Please try another category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}