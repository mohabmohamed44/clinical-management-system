import React from "react";
import Style from "./SortDepartment.module.css";
import { useTranslation } from "react-i18next";

export default function SortDepartment({ onDepartmentSelect, selectedDepartment = 'all' }) {
  const { t } = useTranslation();
  
  // Updated departments to match the ones in the doctor data
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'Cardiology', name: 'Cardiology' },
    { id: 'Neurology', name: 'Neurology' },
    { id: 'Orthopedics', name: 'Orthopedics' },
    { id: 'Pediatrics', name: 'Pediatrics' },
    { id: 'Dermatology', name: 'Dermatology' },
    { id: 'Ophthalmology', name: 'Ophthalmology' },
    { id: 'Gynecology', name: 'Gynecology' },
    { id: 'Urology', name: 'Urology'},
    { id: 'Dentistry', name: 'Dentistry'},
    { id: 'Emergency Medicine', name: 'Emergency Medicine'},
    { id: 'Psychiatry', name: 'Psychiatry'},
    { id: 'Gastroenterology', name: 'Gastroenterology'},
    { id: 'Endocrinology', name: 'Endocrinology'},
    { id: 'Pulmonology', name: 'Pulmonology'},
    { id: 'Rheumatology', name: 'Rheumatology'},
    { id: 'Hematology', name: 'Hematology'},
    { id: 'Oncology', name: 'Oncology'},
    { id: 'Nephrology', name: 'Nephrology'},
    { id: 'Infectious Disease', name: 'Infectious Disease'},
    { id: 'Anesthesiology', name: 'Anesthesiology'},
    { id: 'Radiology', name: 'Radiology'},
    { id: 'Pathology', name: 'Pathology'},
    { id: 'Plastic Surgery', name: 'Plastic Surgery'},
    { id: 'General Surgery', name: 'General Surgery'},
    { id: 'Vascular Surgery', name: 'Vascular Surgery'},
    { id: 'Thoracic Surgery', name: 'Thoracic Surgery'},
    { id: 'Neurosurgery', name: 'Neurosurgery'},
    { id: 'Orthopedic Surgery', name: 'Orthopedic Surgery'},
    { id: 'Pediatric Surgery', name: 'Pediatric Surgery'},
  ];

  const handleDepartmentClick = (departmentId) => {
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