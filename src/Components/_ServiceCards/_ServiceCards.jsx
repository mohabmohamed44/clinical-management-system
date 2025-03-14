import React from "react";
import { Card } from "../Card/Card";
import { useTranslation } from "react-i18next";
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Activity, 
  UserCog,
} from "lucide-react";

export default function Details() {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: t("DiagnosticTesting"),
      description: t("DiagnosticTestingCard")
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t("RehabilitationServices"),
      description: t("RehabilitationServicesCard")
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t("MentalHealthServices"),
      description: t("HealthMonitoringCard")
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: t("HealthMonitoring"),
      description: t("HealthMonitoringCard")
    },
    {
      icon: <UserCog className="w-6 h-6" />,
      title: t("PreventiveCare"),
      description: t("PreventiveCareCard")
    }
  ];

  return (
    <section className="w-full py-20">
      <div className="max-w-[1308px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Header Section */}
          <div className="lg:col-span-1 mt-6">
            <h2 className="text-[#307bc4] font-semibold text-[25.3px] leading-[34.1px]">
              {t("Services")}
            </h2>
            <h1 className="text-[#274760] text-5xl leading-[63.8px] mt-6">
              {t("Provide")}<br />
              {t("bestService")}
            </h1>
          </div>

          {/* Service Cards */}
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
