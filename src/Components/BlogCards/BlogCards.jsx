import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
//import { useTranslation } from "react-i18next";

export default function BlogCard({ image, title, description }) {
  // const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const healthKeywords = [
    'health', 'wellness', 'medicine', 'fitness', 'nutrition',
    'meditation', 'yoga', 'healthcare', 'medical', 'exercise',
    'mindfulness', 'healthy-food', 'mental-health', 'doctor',
    'hospital', 'pharmacy', 'diet', 'workout', 'herbs', 'healing'
  ];

  // Function to get random image with health-related keyword
  const getFallbackImage = (index) => {
    const keyword = healthKeywords[index % healthKeywords.length];
    const randomSeed = Math.floor(Math.random() * 1000);
    return `https://source.unsplash.com/800x600/?${keyword}&sig=${randomSeed}`;
  };

  return (
    <>
      <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <a href="#">
          <img
            className="rounded-t-lg w-full h-48 object-cover"
            src={imageError || !image ? getFallbackImage(0) : image} // Added index parameter
            alt={title}
            onError={handleImageError}
          />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#274760]">
              {title}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700">{description}</p>

          {/* Social Media Icons */}
          <div className="flex gap-4 mb-4 justify-center">
          <a
            href="#"
            className="group p-2 border rounded-full hover:bg-[#274760] transition-colors duration-300 hover:border-transparent"
          >
            <FaFacebookF size={20} className="text-[#274760] group-hover:text-white" alt="facebook" />
          </a>
          <a
            href="#"
            className="group p-2 border rounded-full hover:bg-[#274760] transition-colors duration-300 hover:border-transparent"
          >
            <FaTwitter size={20} className="text-[#274760] group-hover:text-white" alt="twitter" />
          </a>
          <a
            href="#"
            className="group p-2 border rounded-full hover:bg-[#274760] transition-colors duration-300 hover:border-transparent"
          >
            <FaLinkedinIn size={20} className="text-[#274760] group-hover:text-white"  alt="linkedin"/>
          </a>
        </div>

          <a
            href="#"
            className="inline-flex flex-start items-center px-3 py-2 text-md font-medium text-center text-blue-700 rounded-lg hover:text-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5 ms-2" />
          </a>
        </div>
      </section>
    </>
  );
}