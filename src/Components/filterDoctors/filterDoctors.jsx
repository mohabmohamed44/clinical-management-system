import React, { useState } from "react";

export default function FilterDoctors({ onFilterChange }) {
  const [filters, setFilters] = useState({
    rating: '',
    gender: '',
    location: '',
    priceRange: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Emit the changes to parent
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="" selected hidden>Filter by Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="" selected hidden>Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="" selected hidden>Filter by Location</option>
            <option value="cairo">Cairo</option>
            <option value="giza">Giza</option>
            <option value="alexandria">Alexandria</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="" selected hidden>Filter by Price</option>
            <option value="0-100">$0 - $100</option>
            <option value="101-200">$101 - $200</option>
            <option value="201-300">$201 - $300</option>
            <option value="301+">$301+</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
