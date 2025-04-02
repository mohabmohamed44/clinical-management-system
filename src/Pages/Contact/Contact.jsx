import React from "react";
import Image from "../../assets/div-1.webp";
import DoctorImage from "../../assets/contact.webp";
import ContactForm from "../../Components/ContactForm/ContactForm";
import ContactDetails from "../../Components/ContactDetails/ContactDetails";
import MetaData from '../../Components/MetaData/MetaData';
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
    <MetaData 
      title="Contact Us" 
      description="Contact us page" 
      keywords="Contact, contact with us"
      author="Mohab Mohammed"
    />
    <main className="w-full object-cover h-screen mb-[1200px]" aria-label="Contact Page">
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
      <section 
        className="relative z-10 flex flex-col md:flex-col lg:flex-row items-center justify-center w-full h-full px-6 md:px-10 max-w-screen-xl mx-auto text-center lg:text-left"
        aria-label="Contact Information"
      >
        {/* Left Side - Text Section */}
        <div className="text-white max-w-lg mb-6 md:mb-6 lg:mb-0 xl:mb-0">
          <h2 className="text-4xl sm:text-5xl font-bold rtl:text-right" aria-label="Contact Heading">{t("Contact")}</h2>
          <p className="text-lg sm:text-xl mt-4 rtl:text-right" aria-label="Contact Reason">{t("ContactReason")}</p>
        </div>

        {/* Right Side - Doctor Image */}
        <figure className="flex justify-center w-full lg:w-auto" aria-label="Doctor Image">
          <img
            src={DoctorImage}
            className="max-w-md pb-12 sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl xl:pb-10 h-full w-full"
            alt="Doctor"
            loading="lazy"
          />
        </figure>
      </section>

      {/* Contact Form & Details Section */}
      <section className="absolute top-100 left-0 right-0 z-50" aria-label="Contact Form Section">
        <ContactForm />
        <ContactDetails className="mt-8" aria-label="Contact Details" />
      </section>
    </main>
    </>
  );
}
