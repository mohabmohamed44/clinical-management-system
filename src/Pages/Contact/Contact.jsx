import React from "react";
import Image from "../../assets/div-1.png";
import DoctorImage from "../../assets/contact.png";
import ContactForm from "../../Components/ContactForm/ContactForm";
import ContactDetails from "../../Components/ContactDetails/ContactDetails";
import { useTranslation } from "react-i18next";
export default function Contact() {
  const { t } = useTranslation();
  return (
    <main className="w-full object-cover h-screen sm:mb-[1100px]">
      {/* Background Image */}
      <img src={Image} className="w-full h-screen absolute top-0 left-0 right-0" alt="Background" role="presentation" loading="lazy"/>

      {/* Content Wrapper */}
      <article className="relative z-10 flex items-center justify-between w-full h-full px-10 max-w-screen-xl mx-auto">
        
        {/* Left Side - Text Section */}
        <div className="text-[#274760] max-w-lg">
          <h2 className="text-5xl font-bold">{t('Contact')}</h2>
          <p className="text-xl mt-4">{t("ContactReason")}</p>
        </div>

        {/* Right Side - Doctor Image */}
        <figure className="flex justify-end">
          <img src={DoctorImage} className="max-w-xs md:max-w-2xl md:mb-16" alt="Doctor" loading="lazy" />
        </figure>
      </article>  

      {/* Contact Form & Details Section */}
      <section className="absolute top-100 left-0 right-0 z-50">
        <ContactForm />
        <ContactDetails className="mt-8" />  {/* Added with spacing */}
      </section>
    </main>
  );
}