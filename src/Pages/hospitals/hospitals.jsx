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

const fetchHospitals = async () => {
  const { data, error } = await supabase
    .from("Hospitals")
    .select("*")
    .order("name", { ascending: true });

  if (error) { 
    throw new Error(error.message);
    toast.error("Error fetching hospitals data!");
  }
  toast.success("Hospitals data fetched successfully!");
  return data;
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
      description="Find the best hospitals in your area. Browse our list of hospitals and their specialties."
      keywords="hospitals, healthcare, medical facilities, specialties"
      author="Your Name"
    />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FaHospital className="text-blue-600" />
          Our Hospitals
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={hospital.image || "/default-hospital.jpg"}
                alt={hospital.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {hospital.name}
                </h2>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <p>{hospital.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    <a
                      href={`tel:${hospital.phone}`}
                      className="hover:text-blue-600"
                    >
                      {hospital.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaAmbulance className="text-blue-600" />
                    <p>Emergency: {hospital.emergency_phone}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Specialties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties?.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}