import React, { useState, useEffect } from "react";
import Style from "./LabFilters.module.css";
import { supabase } from "../../Config/Supabase";
import {useTranslation} from 'react-i18next';

export default function LabFilters({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {t, i18n} = useTranslation();
  const [error, setError] = useState(null);
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Laboratories')
        .select('specialty')
        .not('specialty', 'is', null);

      if (error) throw error;

      // Get unique specialties and count
      const specialtyCounts = data.reduce((acc, item) => {
        acc[item.specialty] = (acc[item.specialty] || 0) + 1;
        return acc;
      }, {});

      const uniqueSpecialties = Object.keys(specialtyCounts).map(specialty => ({
        name: specialty,
        count: specialtyCounts[specialty]
      }));

      setSpecialties(uniqueSpecialties);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialtyChange = (specialty) => {
    const updatedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(updatedSpecialties);
    onFilterChange?.(updatedSpecialties); // Callback to parent component
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-end p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center gap-2 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
          type="button"
        >
          <span className={isRTL ? 'ml-2' : 'mr-2'}>
            {selectedSpecialties.length > 0 
              ? `${selectedSpecialties.length} ${t('selected')}`
              : t("Filter by specialty")}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        <div 
          className={`absolute z-10 w-60 p-3 mt-1 bg-white rounded-lg shadow-lg ${
            isOpen ? 'block' : 'hidden'
          } ${isRTL ? 'right-0 text-right' : 'left-0 text-left'}`}
        >
          <h6 className={`mb-3 text-sm font-medium text-gray-900 border-b pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("Lab Specialties")}
          </h6>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <ul className={`space-y-1.5 text-sm max-h-60 overflow-y-auto ${isRTL ? 'pl-2 text-right' : 'pr-2 text-left'}`}>
              {specialties.map(({ name, count }) => (
                <li 
                  key={name} 
                  className={`relative flex items-center hover:bg-blue-50 p-2 rounded-md transition-colors duration-150 cursor-pointer group ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`relative ${isRTL ? 'order-2' : 'order-1'}`}>
                    <input
                      id={name}
                      type="checkbox"
                      checked={selectedSpecialties.includes(name)}
                      onChange={() => handleSpecialtyChange(name)}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all checked:border-blue-500 checked:bg-blue-500 hover:checked:bg-blue-600"
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <label 
                    htmlFor={name} 
                    className={`flex justify-between w-full cursor-pointer ${
                      isRTL ? 'mr-3 flex-row-reverse' : 'ml-3'
                    }`}
                  >
                    <span className={`font-medium text-gray-700 group-hover:text-blue-600 transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}>
                      {t(name)}
                    </span>
                    <span className="text-gray-500 bg-gray-100 px-2 rounded-full text-xs font-medium py-0.5 group-hover:bg-blue-100">
                      {count}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          
          <button
            onClick={() => {
              setSelectedSpecialties([]);
              onFilterChange?.([]);
            }}
            className={`mt-3 w-full text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-md transition-colors ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {t("Clear all filters")}
          </button>
        </div>
      </div>
    </div>
  );
}