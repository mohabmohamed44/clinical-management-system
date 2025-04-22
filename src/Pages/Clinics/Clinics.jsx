import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FaClinicMedical,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaStar,
  FaUserMd,
} from "react-icons/fa";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";

// 🧠 Fetch clinics with joined doctors
const fetchClinicsWithDoctors = async () => {
  const { data, error } = await supabase
    .from("Clinics")
    .select(`
      *,
      Doctors(
        id,
        first_name,
        last_name,
        phone,
        image,
        specialty
      )
    `)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  toast.success("Clinics and doctors loaded successfully");
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
    queryFn: fetchClinicsWithDoctors,
    staleTime: 5 * 60 * 1000,
  });

  const renderRating = (rate) => (
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
        description="Find the best clinics in your area with our comprehensive directory."
        keywords="clinics, healthcare, medical services"
        author="Mohab Mohamed"
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <FaClinicMedical className="text-blue-600" />
            Our Clinics
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics?.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
              >
                <img
                  src={clinic.image || "/default-clinic.jpg"}
                  alt={clinic.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
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
                        className="hover:text-blue-600 text-sm"
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
                  </div>

                  {/* Doctors Section */}
                  <div className="mt-4 flex-1">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <FaUserMd className="text-blue-600" />
                      Available Doctors:
                    </h3>
                    <div className="space-y-3">
                      {/* Fix: Changed clinic.doctors to clinic.Doctors */}
                      {clinic.Doctors && clinic.Doctors.length > 0 ? (
                        clinic.Doctors.map((doctor) => (
                          <Link
                            key={doctor.id}
                            to={`/doctors/${doctor.id}`}
                            className="block hover:bg-blue-50 rounded-lg p-2 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                                <FaUserMd className="text-blue-600 text-sm" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  Dr. {doctor.first_name} {doctor.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {doctor.specialty ? `Specialty: ${doctor.specialty}` : 'General Practitioner'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Fee: ${clinic.fee}
                                </p>
                                <p className="text-sm text-blue-600 mt-1">
                                  Contact: {doctor.phone}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No doctors currently available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services Section */}
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

                  {/* View Clinic Button */}
                  <Link
                    to={`/clinics/${clinic.id}`}
                    className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View Clinic Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}