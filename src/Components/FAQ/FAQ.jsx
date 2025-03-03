import React, { useState } from "react";
import group109 from "../../assets/Group-112.png";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import {useTranslation} from "react-i18next";

const faqs = [
  { question: "What services does Delma ProHealth offer?", 
    answer: "Delma ProHealth offers a wide range of services including primary care, dental care, mental health, and more. Our team of experienced professionals is dedicated to providing you with the best care possible." 
  },
  { question: "How do I schedule an appointment with ProHealth?", 
    answer: "schedule an appointment with ProHealth, simply call our office at (123) 456-7890 or visit our website to book online. We offer same-day appointments for urgent care needs." 
  },
  {
    question: "Do you accept insurance?",
    answer:"Yes, we accept most insurance plans. Please provide your insurance information at the time of your appointment.",
  },
  { question: "What should I bring to my appointment?", 
    answer: "Please bring your insurance card, photo ID, and a list of any medications you are currently taking. If you are a new patient, please arrive 15 minutes early to complete the necessary paperwork." 
  },
  { question: "How do I request a prescription refill?",
    answer: "To request a prescription refill, please call our office or send us a message through the patient portal. Be sure to include your name, date of birth, and the name of the medication you need refilled." 
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const {t} = useTranslation();
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* FAQ Content */}
        <div className="lg:col-span-8">
          <h2 className="text-[#11319E] sm:text-5xl max-w-md  text-3xl font-medium leading-[1.2]">
            {t("FAQ")}
          </h2>

          <div className="mt-10">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border border-[#307bc4] rounded-[20px] mb-4 overflow-hidden transition-all ${
                  openIndex === index
                    ? "bg-gradient-to-b from-[#061138] to-[#11319E] text-white"
                    : "bg-white"
                }`}
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left text-[#11319E] text-xl md:text-[22.5px] font-normal"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="w-7 h-7">
                    {openIndex === index ? <CircleChevronDown /> : <CircleChevronUp />}
                  </span>
                </button>
                {openIndex === index && (
                  <p className="px-6 pb-4 text-[#fff] text-base leading-[26px]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-4 flex justify-center lg:items-center">
          <div className="relative w-[183px] h-[183px]">
            <img 
              className="max-w-sm md:max-w-md lg:flex hidden mx-auto object-contain" 
              alt="Group" 
              src={group109} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}