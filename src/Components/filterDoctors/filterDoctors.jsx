import React, { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function FilterDoctors({ onFilterChange }) {
  const [filters, setFilters] = useState({
    rating: "",
    gender: "",
    location: "",
    priceRange: "",
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Emit the changes to parent
  };

  const handleReset = () => {
    const resetFilters = {
      rating: "",
      gender: "",
      location: "",
      priceRange: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  return (
    <div className="w-full bg-white rounded-xl shadow transition-all duration-300 hover:shadow-lg">
      {/* Filter Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        role="button"
        aria-expanded={isFiltersVisible}
        aria-controls="filter-options"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsFiltersVisible(!isFiltersVisible);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-800">
              Filter Options
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Clear Filters
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {activeFiltersCount}
                </span>
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isFiltersVisible ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div
          id="filter-options"
          className={`overflow-hidden transition-all duration-300 mt-4 ${
            isFiltersVisible ? "max-h-[500px]" : "max-h-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Rating Filter */}
            <div className="relative group">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full min-h-[44px] px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     appearance-none cursor-pointer transition-all duration-200
                     group-hover:border-blue-400"
                aria-label="Filter by rating"
              >
                <option value="">Select Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 py-3 mt-5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Gender Filter */}
            <div className="relative group">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full min-h-[44px] px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     appearance-none cursor-pointer transition-all duration-200
                     group-hover:border-blue-400"
                aria-label="Filter by gender"
              >
                <option value="" disabled>
                  Filter by Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 py-3 mt-5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Location Filter */}
            <div className="relative group">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full min-h-[44px] px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     appearance-none cursor-pointer transition-all duration-200
                     group-hover:border-blue-400"
                aria-label="Filter by location"
              >
                <option value="" disabled>
                  Filter by Location
                </option>
                <option value="cairo">Cairo</option>
                <option value="giza">Giza</option>
                <option value="alexandria">Alexandria</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 py-3 mt-5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="relative group">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full min-h-[44px] px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     appearance-none cursor-pointer transition-all duration-200
                     group-hover:border-blue-400"
                aria-label="Filter by price range"
              >
                <option value="" disabled>
                  Filter by Price
                </option>
                <option value="0-100">$0 - $100</option>
                <option value="101-200">$101 - $200</option>
                <option value="201-300">$201 - $300</option>
                <option value="301+">$301+</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 py-3 mt-5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}