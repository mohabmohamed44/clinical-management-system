import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../Config/Supabase';
import Logo from '../../assets/logo.webp';
import { DNA } from 'react-loader-spinner';
import { FaStethoscope } from 'react-icons/fa';

export default function HomeCard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Specialties')
        .select('*')
        .limit(6)
        ;  // Limit to 6 specialties for the home page

      if (error) throw error;
      
      return data.map(specialty => ({
        id: specialty.id,
        icon: specialty.image ? (
          <img 
            src={specialty.image || Logo} 
            alt={specialty.specialty} 
            className="w-fit h-9 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <img src={Logo} className="text-[#3454c1] w-9 h-9" />
        ),
        title: t(specialty.specialty),
        description: specialty.description || `Specialized in ${t(specialty.specialty)}`,
        delay: '0.3s'
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <DNA height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        Error loading specialties
      </div>
    );
  }

  return (
    <div className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mx-auto mb-10 max-w-xl">
          <p className="inline-block border rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
            {t("Departments")}
          </p>
          <h1 className="text-4xl font-bold mt-2">{t("DoctorExpertise")}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <div key={service.id} className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center bg-[#1972EE]/10 rounded-full mb-4 w-16 h-16 shadow-sm">
                {service.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
              <p className="mb-4 text-gray-600">{service.description}</p>
              <Link 
                to={`/doctors?specialty=${service.title}`} 
                className="inline-flex items-center text-[#00155D] hover:text-blue-800 transition-colors duration-300"
              >
                <span className="mr-2">+</span>
                {t('Show Doctors')}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-end w-full">
          <Link
            to="/departments"
            className='inline-flex mt-3 hover:underline duration-300 items-center text-[#3454c1] hover:text-blue-800 text-lg font-medium'
          >
            {t('Departments')}
            <ArrowIcon className="ml-2 h-5 w-5 rtl:mr-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}