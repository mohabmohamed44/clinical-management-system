import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../Config/Supabase';
import { DNA } from 'react-loader-spinner';
import { ChevronRight } from 'lucide-react';
import MetaData from "@components/MetaData/MetaData";
import Background from "@assets/home.webp";

export default function DepartmentDetails() {
  const { specialty } = useParams();
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentDoctors = async () => {
      try {
        setLoading(true);
        
        // Query doctors by specialty
        const { data, error } = await supabase
          .from('Doctors')
          .select(`
            id, 
            first_name, 
            last_name, 
            specialty, 
            image, 
            phone, 
            gender, 
            rate, 
            rate_count,
            address
          `)
          .eq('specialty', specialty);

        if (error) {
          throw new Error(error.message);
        }

        setDoctors(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDepartmentDoctors();
  }, [specialty]);

  // Helper function to format phone number
  const formatPhone = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") || "Phone not available";
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-gray-50">
        <DNA height={100} width={100} ariaLabel="dna-loading"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-red-600">Error: {error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title={`${t(specialty)} Doctors - HealthCare App`}
        description={`Find and book appointments with ${t(specialty)} specialists.`}
        keywords={`${t(specialty)}, doctors, healthcare, appointments`}
        author={"Mohab Mohammed"}
      />
      
      {/* Hero Section */}
      <main className="w-full object-cover h-64 relative">
        <header className="absolute top-0 left-0 w-full h-64">
          <img
            src={Background}
            className="w-full h-64 absolute top-0 left-0 right-0 object-cover"
            alt="Background"
            role="presentation"
            loading="lazy"
          />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{t(specialty)} {t('Specialists')}</h1>
              <p className="mt-2 text-lg">{t('FindYourDoctor')}</p>
            </div>
          </div>
        </header>
      </main>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-md">
            <li>
              <Link to="/" className="text-blue-600 hover:underline">
                {t("Home")}
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </li>
            <li>
              <Link to="/departments" className="text-blue-600 hover:underline">
                {t("Departments")}
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </li>
            <li className="text-gray-700 font-medium">{t(specialty)}</li>
          </ol>
        </div>
      </nav>

      <div className="py-12 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">{t(specialty)} {t('Doctors')}</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              {t('BookAppointmentWith')} {t(specialty)} {t('Specialists')}
            </p>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {t('NoDoctorsFound')} {t(specialty)} {t('Department')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative h-60">
                    <img
                      src={doctor.image || "/default-doctor.jpg"}
                      alt={`${doctor.first_name} ${doctor.last_name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-doctor.jpg";
                      }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </h3>
                    
                    <p className="text-blue-600 mt-1">
                      {t(doctor.specialty)}
                    </p>
                    
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(doctor.rate) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({doctor.rate_count} {t('Reviews')})
                      </span>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>{t(doctor.gender)}</p>
                      <p className="mt-1">{formatPhone(doctor.phone)}</p>
                      {doctor.address && doctor.address[0] && (
                        <p className="mt-1">
                          {doctor.address[0].city}, {doctor.address[0].street}
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/find_doctor/${doctor.id}`}
                      className="mt-4 block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      {t('BookConsultation')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}