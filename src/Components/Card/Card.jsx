import React from "react";
import PropTypes from "prop-types";

export const Card = ({ title, description, icon }) => {
  return (
    <div className="w-full max-w-[416px] h-[265px] bg-white rounded-[20px] p-6 
      shadow-[0px_4px_21px_1px_#307bc41a] hover:shadow-lg transition-all duration-300">
      {/* Icon Container */}
      <div className="p-3 bg-[#307bc4]/10 rounded-lg w-fit">
        <div className="text-[#307bc4]">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[#274760] 
        text-[24.4px] leading-[34.1px] mt-6">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#27476085] 
        text-base leading-[26px] mt-4">
        {description}
      </p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};