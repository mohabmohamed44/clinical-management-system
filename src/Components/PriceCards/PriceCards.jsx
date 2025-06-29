import React from "react";
import itemImg from "../../assets/item-img.svg";
import { MoveRight } from "lucide-react";

// Plan data to avoid repetition
const plans = [
  {
    title: "Dental Health Plan",
    description:
      "Smile with confidence. Enjoy regular dental check-ups, emergency coverage, and exclusive discounts on dental procedures.",
    price: "$79",
    features: [
      "Dental Check-ups",
      "Procedure Discounts",
      "Emergency Coverage",
      "Oral Health Advice",
    ],
  },
  {
    title: "Sports & Fitness Plan",
    description:
      "Optimized for athletes. Access sports injury assessments, physiotherapy, and expert advice for peak performance and recovery.",
    price: "$119",
    features: [
      "Sports Injury Assessments",
      "Physiotherapy Sessions",
      "Sports Medicine Experts",
      "Fitness Support",
    ],
  },
  {
    title: "Women's Health Plan",
    description:
      "Comprehensive women's health services. Receive expert gynecological care, family planning support, and prenatal/postnatal.",
    price: "$169",
    features: [
      "Women's Health Services",
      "Gynecological Care",
      "Fall Prevention Programs",
      "Family Planning",
      "Prenatal & Postnatal Support",
    ],
  },
  
];

const PlanCard = ({ title, badge, description, price, features }) => (
  <article className="relative flex flex-col bg-white rounded-2xl shadow-xs hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <header className="bg-gradient-to-br from-[#11319E] to-[#061138] p-8 text-white">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="px-4 py-2 bg-gradient-to-b from-[#11319E] to-[#061138] text-[#ffffff] font-semibold rounded-full border-2 border-white shadow-sm">
          {title}
        </span>
        {badge && (
          <span className="px-3 py-1 bg-white text-[#11319e] font-semibold rounded-full border-2 border-[#86bbf1] shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-6 text-base lg:text-lg text-gray-100">{description}</p>
      <div className="mt-6 flex items-baseline">
        <span className="text-4xl lg:text-5xl font-bold">{price}</span>
        <span className="text-lg lg:text-xl ml-2 text-gray-200">/month</span>
      </div>
    </header>

    <div className="flex-1 p-8 border-x border-b border-gray-200 flex flex-col justify-between">
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-[#061138]">
            <img 
              src={itemImg} 
              alt="" 
              className="w-5 h-5 mt-1 flex-shrink-0 text-[#061138]" 
            />
            <span className="text-base lg:text-lg">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button
          className="
            w-full 
            py-4 
            px-6
            flex 
            items-center 
            justify-center 
            gap-2
            text-base
            lg:text-lg
            font-semibold
            text-white
            bg-gradient-to-r 
            from-[#11319E] 
            to-[#061138]
            rounded-full 
            shadow-md 
            hover:shadow-lg 
            transition-all 
            duration-300
            hover:-translate-y-0.5
          "
        >
          <span className="text-white">Get Started</span>
          <MoveRight size={24} />
        </button>
      </div>
    </div>
  </article>
);

export default function PriceCards() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}