import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeartbeat, FaLungs, FaBrain, FaWheelchair, FaTooth, FaFlask } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function HealthcareServices() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const services = [
    {
      id: 1,
      icon: <FaHeartbeat className="text-blue-600" size={24} />,
      title: 'Cardiology',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.1s'
    },
    {
      id: 2,
      icon: <FaLungs className="text-blue-600" size={24} />,
      title: 'Pulmonary',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.3s'
    },
    {
      id: 3,
      icon: <FaBrain className="text-blue-600" size={24} />,
      title: 'Neurology',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.5s'
    },
    {
      id: 4,
      icon: <FaWheelchair className="text-blue-600" size={24} />,
      title: 'Orthopedics',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.1s'
    },
    {
      id: 5,
      icon: <FaTooth className="text-blue-600" size={24} />,
      title: 'Dental Surgery',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.3s'
    },
    {
      id: 6,
      icon: <FaFlask className="text-blue-600" size={24} />,
      title: 'Laboratory',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.',
      delay: '0.5s'
    }
  ];

  return (
    <div className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mx-auto mb-10 max-w-xl">
          <p className="inline-block border rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">{t("Departments")}</p>
          <h1 className="text-4xl font-bold mt-2">{t("DoctorExpertise")}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-100 rounded-lg h-full p-6 shadow-sm transition-transform duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center bg-[#1972EE]/10 rounded-full mb-4 w-16 h-16 shadow-sm">
                {service.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
              <p className="mb-4 text-gray-600">{service.description}</p>
              <Link className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300" href="#">
                <span className="mr-2">+</span>
                Show Doctors
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-end w-full">
          <Link
            to="/departments"
            className='inline-flex mt-3 hover:underline duration-300 items-center text-blue-600 hover:text-blue-800 text-lg font-medium'
          >
            {t('Departments')}
            <ArrowIcon className="ml-2 h-5 w-5 rtl:mr-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};