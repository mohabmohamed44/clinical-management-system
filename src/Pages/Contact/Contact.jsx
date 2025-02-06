import React from "react";
import Image from "../../assets/div-1.png";
import DoctorImage from "../../assets/contact.png";
import ContactForm from "../../Components/ContactForm/ContactForm";
import ContactDetails from "../../Components/ContactDetails/ContactDetails";

export default function Contact() {
  return (
    <div className="w-full object-cover h-screen mb-[1000px]">
      {/* Background Image */}
      <img src={Image} className="w-full h-screen absolute top-0 left-0 right-0" alt="Background" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex items-center justify-between w-full h-full px-10 max-w-screen-xl mx-auto">
        
        {/* Left Side - Text Section */}
        <div className="text-[#274760] max-w-lg">
          <h2 className="text-5xl font-bold">Contact Us</h2>
          <p className="text-xl mt-4">Kindly reach us to get the fastest response and treatment</p>
        </div>

        {/* Right Side - Doctor Image */}
        <div className="flex justify-end">
          <img src={DoctorImage} className="max-w-xs md:max-w-xl" alt="Doctor" />
        </div>
      </div>  

      {/* Contact Form & Details Section */}
      <div className="absolute top-100 left-0 right-0 z-50">
        <ContactForm />
        <ContactDetails className="mt-8" />  {/* Added with spacing */}
      </div>
    </div>
  );
}