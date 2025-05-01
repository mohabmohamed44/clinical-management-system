import { useQuery } from "@tanstack/react-query";
import {
  FaHospital,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const fetchHospitals = async () => {
  const { data, error } = await supabase
    .from("Hospitals")
    .select(`
      id,
      name,
      image,
      HospitalsInfo(
        id,
        hos_id,
        government,
        city,
        services,
        phones
      )
    `)
    .order("name", { ascending: true });

  if (error) { 
    toast.error("Error fetching hospitals data!");
    throw new Error(error.message);
  }

  // Process the data to ensure arrays are properly formatted
  const processedData = data.map(hospital => {
    // Ensure HospitalsInfo exists and is an array
    const hospitalInfoArray = Array.isArray(hospital.HospitalsInfo) 
      ? hospital.HospitalsInfo 
      : hospital.HospitalsInfo ? [hospital.HospitalsInfo] : [];
    
    // Process each HospitalsInfo record
    const processedInfo = hospitalInfoArray.map(info => {
      if (!info) return null;
      
      return {
        ...info,
        // Ensure services is an array
        services: Array.isArray(info.services) 
          ? info.services 
          : info.services ? [info.services].filter(Boolean) : [],
        // Ensure phones is an array
        phones: Array.isArray(info.phones) 
          ? info.phones 
          : info.phones ? [info.phones].filter(Boolean) : []
      };
    }).filter(Boolean);
    
    return {
      ...hospital,
      HospitalsInfo: processedInfo
    };
  });
  
  return processedData;
};

export default function Hospitals() {
  const { 
    data: hospitals,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['hospitals'],
    queryFn: fetchHospitals,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-busy="true" aria-label="Loading hospitals">
        <div className="text-center py-8 text-2xl">
          <DNA width={100} height={100} ariaLabel="Loading hospitals data" />
        </div>
      </div>
    );

  if (isError)
    return <div className="text-red-500 text-center py-8" role="alert">{error.message}</div>;

  return (
    <>
      <MetaData
        title="Find Hospitals Near You | Medical Centers Directory"
        description="Browse our comprehensive list of hospitals and medical centers. Find contact information, services, and locations for healthcare facilities in your area."
        keywords="hospitals, medical centers, healthcare facilities, emergency care, medical services, hospital directory"
        author="Mohab Mohammed"
      />
      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2" id="main-heading">
              <FaHospital className="text-blue-600" aria-hidden="true" />
              <span>Our Hospitals</span>
            </h1>
          </header>

          <section 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            aria-labelledby="main-heading"
          >
            {hospitals.map((hospital) => {
              const hospitalInfo = hospital.HospitalsInfo?.[0] || {};
              
              return (
                <article
                  key={hospital.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link
                    to={`/hospitals/${hospital.id}`}
                    className="block"
                    aria-labelledby={`hospital-name-${hospital.id}`}
                  >
                    <img
                      src={hospital.image || "/default-hospital.jpg"}
                      alt={`${hospital.name} building`}
                      className="w-full h-70 object-cover"
                      loading="lazy"
                    />
                    <div className="p-6">
                      <h2 
                        id={`hospital-name-${hospital.id}`}
                        className="text-xl font-semibold text-gray-800 mb-2"
                      >
                        {hospital.name}
                      </h2>

                      <div className="space-y-3 text-gray-600">
                        {hospitalInfo.city && hospitalInfo.government && (
                          <div className="flex items-center gap-2" aria-label="Location">
                            <FaMapMarkerAlt className="text-blue-600" aria-hidden="true" />
                            <p>{hospitalInfo.city}, {hospitalInfo.government}</p>
                          </div>
                        )}

                        {hospitalInfo.phones?.length > 0 && (
                          <div aria-label="Contact numbers">
                            {hospitalInfo.phones.map((phone, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <FaPhone className="text-blue-600" aria-hidden="true" />
                                <Link 
                                  to={`tel:${phone}`} 
                                  className="hover:text-blue-600"
                                  aria-label={`Call ${hospital.name} at ${phone}`}
                                >
                                  {phone}
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Available Services:</h3>
                        <div 
                          className="flex flex-wrap gap-2"
                          role="list"
                          aria-label="Hospital services"
                        >
                          {hospitalInfo.services?.length > 0 ? 
                            hospitalInfo.services.map((service, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                role="listitem"
                              >
                                {service}
                              </span>
                            )) : (
                              <span className="text-gray-400" role="listitem">No services listed</span>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}