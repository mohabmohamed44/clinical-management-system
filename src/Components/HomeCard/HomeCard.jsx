import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CalendarClock, ShieldCheck, Stethoscope, Brain } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, isRTL }) => (
  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100`}>
    <div className="flex-shrink-0 p-3 bg-gradient-to-r from-[#11319E] to-[#061138] rounded-full">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className={`${isRTL ? 'mr-4 text-right' : 'ml-4'}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default function HomeCard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const features = [
    {
      icon: Clock,
      title: t('24/7 Medical Care'),
      description: t('Round-the-clock medical services for all your healthcare needs')
    },
    {
      icon: CalendarClock,
      title: t('Online Scheduling'),
      description: t('Easily book appointments with your preferred healthcare providers')
    },
    {
      icon: ShieldCheck,
      title: t('Certified Professionals'),
      description: t('Our doctors and staff are experienced and highly qualified')
    },
    {
      icon: Stethoscope,
      title: t('Comprehensive Services'),
      description: t('From preventive care to specialized treatments, all under one roof')
    },
    {
      icon: Brain,
      title: t('Mental Health Support'),
      description: t('Professional counseling and therapy services for mental well-being')
    },
    
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
}

