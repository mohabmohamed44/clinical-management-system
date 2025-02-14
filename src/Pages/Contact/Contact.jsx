import React from "react";
import Image from "../../assets/div-1.webp";
import DoctorImage from "../../assets/contact.webp";
import ContactForm from "../../Components/ContactForm/ContactForm";
import ContactDetails from "../../Components/ContactDetails/ContactDetails";
import { useTranslation } from "react-i18next";
export default function Contact() {
  const { t } = useTranslation();
  return (
    <main className="w-full object-cover h-screen mb-[1200px]">
      {/* Background Image */}
      <header>
        <img
          src={Image}
          className="w-full h-screen absolute top-0 left-0 right-0"
          alt="Background"
          role="presentation"
          loading="lazy"
        />
      </header>
      {/* Content Wrapper */}
      <article className="relative z-10 flex flex-col md:flex-col lg:flex-row items-center justify-center w-full h-full px-6 md:px-10 max-w-screen-xl mx-auto text-center lg:text-left">
        {/* Left Side - Text Section */}
        <div className="text-[#274760] max-w-lg mb-6 md:mb-6 lg:mb-0">
          <h2 className="text-4xl sm:text-5xl font-bold">{t("Contact")}</h2>
          <p className="text-lg sm:text-xl mt-4">{t("ContactReason")}</p>
        </div>

        {/* Right Side - Doctor Image */}
        <figure className="flex justify-center w-full lg:w-auto">
          <img
            src={DoctorImage}
            className="max-w-xs sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl"
            alt="Doctor"
            loading="lazy"
          />
        </figure>
      </article>

      {/* Contact Form & Details Section */}
      <section className="absolute top-100 left-0 right-0 z-50">
        <ContactForm />
        <ContactDetails className="mt-8" /> {/* Added with spacing */}
      </section>
    </main>
  );
}