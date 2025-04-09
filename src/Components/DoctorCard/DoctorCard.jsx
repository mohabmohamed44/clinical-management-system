import { Link } from "react-router-dom";
import React from "react";
export default function DoctorCard({ name, department, experience, description, image }) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative w-full h-[800px] bg-gradient-to-b from-[#D2EAEF46] to-[#86BBF146] rounded-[25px] overflow-hidden transition-transform duration-300 hover:scale-105">
        {/* Image Section */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] h-[360px] rounded-[20px] overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Info Card */}
        <div className="absolute bottom-0 w-full h-[440px] bg-gray-50 rounded-t-[40px] pt-8 px-6 shadow-top-lg flex flex-col">
          {/* Department Badge */}
          <div className="bg-[#cfdef0] rounded-full py-2 px-6 w-max mx-auto mb-4">
            <span className="text-[#274760] text-sm font-medium font-poppins">
              {department}
            </span>
          </div>

          {/* Doctor Name */}
          <h2 className="text-[#274760] text-2xl font-semibold text-center font-inter mb-2">
            {name}
          </h2>

          {/* Experience */}
          <div className="text-center text-[#274760] font-poppins text-sm mb-6">
            {experience}
          </div>

          {/* Description */}
          <p className="text-[#274760B3] text-center font-poppins leading-6 mb-4 px-4 flex-1 overflow-y-auto">
            {description}
          </p>

          {/* Fixed Bottom Button Container */}
          <div className="pb-6 pt-4">
            <div className="flex justify-center w-full">
              <button
                className="bg-gradient-to-r from-[#11319E] to-[#061138] text-white 
                px-8 py-4 rounded-full font-poppins font-medium text-lg
                hover:from-[#0a216e] hover:to-[#040a2d] transition-all duration-300
                shadow-lg hover:shadow-xl transform hover:scale-105 
                whitespace-nowrap w-full max-w-[280px]"
              >
                <Link to="/doctorDetails">Book Consultation</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};