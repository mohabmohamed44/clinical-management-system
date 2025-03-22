import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Import the images
import doctorImage from '../../assets/doctor-1.svg';
import scheduleImage from '../../assets/book.svg';
import locationImage from '../../assets/location.svg';

const FeatureCard = ({ image, title, description, linkText, linkUrl }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="w-full p-4 flex justify-center">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-contain" 
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        <a 
          href={linkUrl} 
          className={`flex items-center text-[#3454c1] font-medium hover:underline ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {linkText}
          <ArrowIcon className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
        </a>
      </div>
    </div>
  );
};

export default function FeatureSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      image: doctorImage,
      title: t('Find a Doctor'),
      description: t('Our team of specialists is here to provide you with the best medical care and ensure your health needs are met.'),
      linkText: t('Find Now'),
      linkUrl: '/find_doctor'
    },
    {
      image: scheduleImage,
      title: t('Book an Appointment'),
      description: t('Easily schedule your visit with our convenient online appointment booking system.'),
      linkText: t('Book Now'),
      linkUrl: '/appointments'
    },
    {
      image: locationImage,
      title: t('Find a Location'),
      description: t('Locate our medical facilities and clinics nearest to you for accessible healthcare.'),
      linkText: t('View Locations'),
      linkUrl: '/locations'
    }
  ];
  
  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className='text-center text-[#3454c1] font-semibold text-3xl py-3 mx-2'>Providing the best medical services for you</h1>
        <p className='text-center text-[#3454c1] font-medium text-xl py-3 pt-2'>
          {t('World-class care for everyone. Our health System offers unmatched, expert health care.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
              linkText={feature.linkText}
              linkUrl={feature.linkUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 