import React from "react";
import { BadgeCheck, UsersRound, Hospital, HandHeart } from "lucide-react";
import doctorImage from "../../assets/doctor-image.png";

export default function _ServiceCards() {
  // existing ChooseUs features..
  const chooseUsFeatures = [
    {
      icon: <Hospital className="w-6 h-6" />,
      title: "Experienced Medical Professionals",
      description: `Our team includes experienced doctors
                    nurses, and other healthcare professionals
                    who are dedicated to providing the best
                    possible care to our patients.`,
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Experienced Medical Professionals",
      description: `Our team includes experienced doctors
                    nurses, and other healthcare professionals
                    who are dedicated to providing the best
                    possible care to our patients`,
    },
    {
      icon: <UsersRound className="w-6 h-6" />,
      title: "Comprehensive Services approach",
      description: `We offer a wide range of healthcare services,
                    from preventive care to specialized
                    treatment for complex conditions.`,
    },
    {
      icon: <HandHeart className="w-6 h-6" />,
      title: "Patient-Centered Approach",
      description: `We believe in treating each patient as an
                    individual, and we take the time to
                    understand your unique health needs and concerns.`,
    },
  ];

  return (
    <section className="w-full py-20">
      <div className="max-w-[1308px] mx-auto px-4">
        {/* Why Choose Us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#307bc4]/10 rounded-full z-0" />
            <img
              src={doctorImage}
              alt="Professional Doctor"
              className="w-full max-w-[500px] hidden md:flex rounded-2xl shadow-lg relative z-10"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#307bc4]/10 rounded-full z-0" />
          </div>

          {/* Right Column - Content */}
          <div>
            <h2 className="text-[#307bc4] text-3xl font-semibold leading-[34.1px] mb-4">
              WHY CHOOSE US
            </h2>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {chooseUsFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="p-3 bg-[#307bc4]/10 rounded-lg w-fit">
                    <div className="text-[#307bc4]">{feature.icon}</div>
                  </div>
                  <h4 className="text-[#274760] text-xl font-semibold">
                    {feature.title}
                  </h4>
                  <p className="text-[#27476085] text-base max-w-md">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
