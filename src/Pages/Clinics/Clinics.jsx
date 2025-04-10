import { useQuery } from "@tanstack/react-query";
import {
  FaClinicMedical,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaStar,
  FaMap,
} from "react-icons/fa";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";

const fetchClinics = async () => {
  const { data, error } = await supabase
    .from("Clinics")
    .select(
      "id, government, city, street, phones, work_times, services, rate, rate_count, fee"
    )
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export default function Clinics() {
  const {
    data: clinics,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clinics"],
    queryFn: fetchClinics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const renderRating = (rate) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`w-4 h-4 ${
              index < Math.round(rate) ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center py-8">
          <DNA height={90} width={80} ariaLabel="dna-clinics-loader" />
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <>
    <MetaData
      title="Clinics"
      description="Find the best clinics in your area with our comprehensive directory. Browse by location, services, and ratings to find the perfect fit for your healthcare needs."
      keywords="clinics, healthcare, medical services, directory, find clinics, healthcare directory"
      author={"Mohab Mohammed"}
    />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FaClinicMedical className="text-blue-600" />
          Our Clinics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={clinic.image || "/default-clinic.jpg"}
                alt={clinic.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {clinic.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {renderRating(clinic.rate)}
                    <span className="text-sm text-gray-500">
                      ({clinic.rate_count})
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{clinic.government}</p>
                      <p className="text-sm">
                        {clinic.city}, {clinic.street}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    <a
                      href={`tel:${clinic.phones}`}
                      className="hover:text-blue-600"
                    >
                      {clinic.phones}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    <div className="text-sm">
                      {clinic.work_times?.map((time, index) => (
                        <div key={index}>
                          {time.day}: {time.start} - {time.end}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-blue-600" />
                    <p className="font-medium">
                      Consultation Fee: ${clinic.fee}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Services:</h3>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services?.map((service, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {service}
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
