import React from "react";
import { Card } from "../Card/Card";
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Activity, 
  UserCog,
} from "lucide-react";

export default function _ServiceCards() {
  const services = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Diagnostic Testing",
      description: "Blood tests, imaging studies, and other tests to diagnose health conditions"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Rehabilitation Services",
      description: "Physical therapy, occupational therapy, and other services to help patients recover"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Mental Health Services",
      description: "Counseling, therapy, and other services to help manage mental health conditions"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Monitoring",
      description: "Regular health checkups and continuous monitoring services"
    },
    {
      icon: <UserCog className="w-6 h-6" />,
      title: "Preventive Care",
      description: "Annual checkups, immunizations, and health screenings"
    }
  ];

  return (
    <section className="w-full py-20">
      <div className="max-w-[1308px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Header Section */}
          <div className="lg:col-span-1 mt-6">
            <h2 className="text-[#307bc4] font-semibold text-[25.3px] leading-[34.1px]">
              SERVICES
            </h2>
            <h1 className="text-[#274760] text-5xl leading-[63.8px] mt-6">
              Provides Our<br />
              Best Services
            </h1>
          </div>

          {/* First Row - 2 Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.slice(0, 2).map((service, index) => (
              <Card
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>

          {/* Second Row - 3 Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(2, 5).map((service, index) => (
              <Card
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}