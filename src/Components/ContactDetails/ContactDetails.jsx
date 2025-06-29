import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactDetails() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-[#274760] text-2xl font-semibold capitalize mb-6 mt-10 rtl:text-start">
        {t("findUsHere")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2 bg-[#D2EAEF] p-3 rounded-xl w-full">
          <Phone size={40} className="text-[#274760]" aria-label="phone" />
          <div>
            <h3 className="font-semibold">{t("Phone")}</h3>
            <p className="text-gray-600">123-456-7890</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-[#D2EAEF] p-3 rounded-lg w-full">
          <Mail size={40} className="text-[#274760]" aria-label="email" />
          <div>
            <h3 className="font-semibold">{t("Email")}</h3>
            <p className="text-gray-600">hellocallcenter@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-[#D2EAEF] p-3 rounded-lg w-full">
          <MapPin size={40} className="text-[#274760]" aria-label="location" />
          <div>
            <h3 className="font-semibold">{t("Location")}</h3>
            <p className="text-gray-600">123 Anywhere St., Any City, 12345</p>
          </div>
        </div>
      </div>
      <div className="w-full md:h-[500px] sm:h-[500px] h-[400px] pb-6 md:pb-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059445337!2d-74.25986853484057!3d40.69714941693755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1613145885584!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title= "Google Map"
        ></iframe>
      </div>
    </div>
  );
}