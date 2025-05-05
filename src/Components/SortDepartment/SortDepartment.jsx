import React, { useEffect, useState } from "react";
import Style from "./SortDepartment.module.css";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";

export default function SortDepartment({
  onDepartmentSelect,
  selectedDepartment = "all",
}) {
  const { t } = useTranslation();
  const [initialSpecialtyFromProps, setSelectedDepartment] =
    useState(selectedDepartment);
  const {
    data: specialties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Specialties")
        .select("specialty")
        .order("specialty")
        .eq("type", "Doctor");

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Translated departments
  const departments = [
    { id: "all", name: t("All") }, // Translated "All"
    ...(specialties || []).map((spec) => ({
      id: spec.specialty,
      name: t(spec.specialty), // Translate each specialty
    })),
  ];

  const handleDepartmentClick = (departmentId) => {
    onDepartmentSelect?.(departmentId);
  };
  // In SortDepartment component
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSpecialty = urlParams.get("specialty");
    if (urlSpecialty) {
      setSelectedDepartment(urlSpecialty);
      onDepartmentSelect?.(urlSpecialty);
    }
  }, []);

  if (isLoading)
    return <div className="text-center py-4">Loading specialties...</div>;
  if (isError)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading specialties
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="flex items-center gap-2 sm:gap-3 py-2">
          <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
              {departments.map((department) => (
                <button
                  key={department.id}
                  onClick={() => handleDepartmentClick(department.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 border ${
                    selectedDepartment === department.id
                      ? "bg-[#11319E] text-white border-[#11319E]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#11319E] hover:text-[#11319E]"
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