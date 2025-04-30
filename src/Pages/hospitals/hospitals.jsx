// HospitalsPage.jsx
import { useQuery } from "@tanstack/react-query";
import {
  FaHospital,
  FaPhone,
  FaMapMarkerAlt,
  FaAmbulance,
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center py-8 text-2xl">
          <DNA width={100} height={100} ariaLabel="dna-hospitals-loader" />
        </div>
      </div>
    );

  if (isError)
    return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <>
    <MetaData
      title="Hospitals"
      description="Find the best hospitals in your area"
      keywords="hospitals, healthcare"
      author={"Mohab Mohammed"}
    />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FaHospital className="text-blue-600" />
          Our Hospitals
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => {
            // Get the first HospitalInfo record for this hospital (or an empty object if none)
            const hospitalInfo = hospital.HospitalsInfo && hospital.HospitalsInfo.length > 0 
              ? hospital.HospitalsInfo[0] 
              : {};
            
            return (
              <Link
                key={hospital.id}
                to={`/hospitals/${hospital.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={hospital.image || "/default-hospital.jpg"}
                  alt={hospital.name}
                  className="w-full h-70 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {hospital.name}
                  </h2>

                  <div className="space-y-3 text-gray-600">
                    {hospitalInfo.city && hospitalInfo.government && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <p>{hospitalInfo.city}, {hospitalInfo.government}</p>
                      </div>
                    )}

                    {hospitalInfo.phones && hospitalInfo.phones.length > 0 && 
                      hospitalInfo.phones.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaPhone className="text-blue-600" />
                          <Link to={`tel:${phone}`} className="hover:text-blue-600">
                            {phone}
                          </Link>
                        </div>
                      ))
                    }
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Services:</h3>
                    <div className="flex flex-wrap gap-2">
                      {hospitalInfo.services && hospitalInfo.services.length > 0 ? 
                        hospitalInfo.services.map((service, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        )) : (
                          <span className="text-gray-400">No services listed</span>
                        )
                      }
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}