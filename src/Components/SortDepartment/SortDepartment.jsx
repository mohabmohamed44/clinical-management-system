import React, { useState } from "react";
import Style from "./SortDepartment.module.css";
import { useTranslation } from "react-i18next";

export default function SortDepartment({ onDepartmentSelect }) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const {t} = useTranslation();
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'cardiology', name: t('Cardiology') },
    { id: 'neurology', name: 'Neurology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'ophthalmology', name: 'Ophthalmology' },
    { id: 'gynecology', name: 'Gynecology' },
    { id: 'urology', name: 'Urology'},
    { id: 'dentistry', name: 'Dentistry'},
    { id: 'general', name: 'General'},
    { id: 'hematology', name:'Hematology'},
    { id: 'Gastroenterology', name:'Gastroenterology'},
    { id: 'hepatology', name: 'Hepatology'},
    { id: 'internal medicine', name: 'Internal Medicine'},
    { id: 'geriatrics', name: 'Geriatrics'},
  ];

  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(departmentId);
    if (onDepartmentSelect) {
      onDepartmentSelect(departmentId);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="flex items-center gap-2 sm:gap-3 py-2">
          <span className="font-medium text-gray-700 whitespace-nowrap text-sm sm:text-base">Sort by:</span>
          <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
              {departments.map((department) => (
                <button
                  key={department.id}
                  onClick={() => handleDepartmentClick(department.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 border ${
                    selectedDepartment === department.id
                      ? 'bg-[#11319E] text-white border-[#11319E]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#11319E] hover:text-[#11319E]'
                  }`}
                >
                  {department.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
