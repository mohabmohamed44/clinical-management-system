import { Link } from "react-router-dom";
import React from "react";
import { Star } from "lucide-react";

export default function DoctorCard({
  id,
  name,
  specialty,
  image,
  phone,
  rate,
  rate_count,
  gender,
  address,
}) {
  const formatPhone = (phone) => {
    return (
      phone?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") ||
      "Phone not available"
    );
  };

  const location = address?.[0]
    ? `${address[0].city}, ${address[0].street}`
    : "Location not available";

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative w-full h-[800px] rounded-[25px] overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full h-[360px] rounded-[20px] overflow-hidden">
          <img
            src={image || "/default-doctor.jpg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 w-full h-[440px] bg-gray-50 rounded-t-[40px] pt-8 px-6 shadow-top-lg flex flex-col">
          <div className="bg-[#cfdef0] rounded-full py-2 px-6 w-max mx-auto mb-4">
            <span className="text-[#274760] text-sm font-medium">
              {specialty}
            </span>
          </div>

          <h2 className="text-[#274760] text-2xl font-semibold text-center mb-2">
            {name}
          </h2>
          <h4 className="text-[#274760] text-lg font-medium text-center mb-2">
            {gender}
          </h4>
          <div className="flex justify-center gap-4 mb-4">
            <div className="text-center text-[#274760] text-sm">
              {formatPhone(phone)}
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <div className="text-center text-[#274760] text-sm">
              {location}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <span className="text-[#274760] text-sm">
              {rate}/5 ({rate_count} reviews)
            </span>
          </div>

          <div className="pb-6 pt-4">
            <div className="flex justify-center w-full">
              <button className="bg-gradient-to-r from-[#11319E] to-[#061138] text-white px-8 py-4 rounded-full font-medium text-lg hover:from-[#0a216e] hover:to-[#040a2d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap w-full max-w-[280px]">
                <Link to={`/find_doctor/${id}`}>Book Consultation</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}