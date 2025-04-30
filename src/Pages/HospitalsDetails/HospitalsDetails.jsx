import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaUserMd,
  FaArrowRight,
} from "react-icons/fa";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";

export default function HospitalsDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // Fetch hospital base info
        const { data: hospitalData, error: hospitalError } = await supabase
          .from("Hospitals")
          .select(
            `
            id, 
            name, 
            image,
            HospitalsInfo!hos_id(
              id,
              government,
              city,
              phones,
              services,
              address,
              rate,
              rate_count
            )
          `
          )
          .eq("id", id)
          .single();

        if (hospitalError) throw hospitalError;

        // Get hospital info ID to fetch doctors
        const hospitalInfoId = hospitalData.HospitalsInfo?.[0]?.id;

        // Fetch doctors data using the hospital info ID
        const { data: doctorsData, error: doctorsError } = await supabase
          .from("HospitalsDoctors")
          .select(
            `
            doc_id,
            Doctors!doc_id(
              id,
              first_name,
              last_name,
              image,
              specialty
            )
          `
          )
          .eq("hos_id", hospitalInfoId);

        if (doctorsError) throw doctorsError;

        // Format doctors data
        const formattedDoctors = doctorsData
          ? doctorsData
              .map((item) => item.Doctors)
              .filter((doctor) => doctor !== null)
          : [];

        setHospital(hospitalData);
        setHospitalDetails(hospitalData.HospitalsInfo?.[0]);
        setDoctors(formattedDoctors);

        console.log("Hospital data:", hospitalData);
        console.log("HospitalInfo ID:", hospitalInfoId);
        console.log("Doctors data:", formattedDoctors);
      } catch (err) {
        console.error("Error fetching hospital details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA height={90} width={80} ariaLabel="dna-loading" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;

  if (!hospital || !hospitalDetails)
    return <div className="text-center p-8">Hospital not found</div>;

  // Parse the address JSONB
  const address = hospitalDetails.address
    ? typeof hospitalDetails.address === "string"
      ? JSON.parse(hospitalDetails.address)
      : hospitalDetails.address
    : {};

  // Get the first phone number for call button
  const mainPhone =
    hospitalDetails.phones && hospitalDetails.phones.length > 0
      ? hospitalDetails.phones[0]
      : null;

  return (
    <>
      <MetaData
        title={`${hospital.name} - Hospital Details`}
        description={`Details about ${hospital.name}, including contact information, facilities, and doctors.`}
        keywords="hospital, details, contact, facilities, doctors"
        author={"Mohab Mohammed"}
      />
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {hospital.name}
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-80 w-80 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={hospital.image || "/default-hospital.jpg"}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-grow">
              <div className="space-y-6">
                {/* Location Details */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Location Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <p><span className="font-medium">City:</span> {hospitalDetails.city}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <p><span className="font-medium">Government:</span> {hospitalDetails.government}</p>
                    </div>
                    {address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <p>
                          <span className="font-medium">Address:</span>
                          {address.streat && <span> {address.streat}</span>}
                          {address.building && <span>, Building {address.building}</span>}
                          {address.floor && <span>, Floor {address.floor}</span>}
                          {address.sgin && <span>, {address.sgin}</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Contact Details
                  </h2>
                  {hospitalDetails.phones && hospitalDetails.phones.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-blue-600" />
                        <div className="space-y-1">
                          {hospitalDetails.phones.map((phone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="font-medium">Phone {index + 1}:</span>
                              <a href={`tel:${phone}`} className="hover:text-blue-600">
                                {phone}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Hospital Information
                  </h2>

                  {hospitalDetails.rate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStar className="text-yellow-500" />
                      <p>
                        Rating: {hospitalDetails.rate} (
                        {hospitalDetails.rate_count || 0} reviews)
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Services:</h3>
                    <div className="flex flex-wrap gap-2">
                      {hospitalDetails.services &&
                      hospitalDetails.services.length > 0 ? (
                        hospitalDetails.services.map((service, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">
                          No services listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaUserMd className="text-blue-600 mr-2" />
              Hospital Doctors ({doctors.length})
            </h2>

            {doctors && doctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center p-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                        <img
                          src={doctor.image || "/default-doctor.jpg"}
                          alt={doctor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {doctor.first_name} {doctor.last_name}
                        </h3>
                        <p className=""></p>
                        <p className="text-blue-600 text-sm">
                          {t(doctor.specialty) || ""}
                        </p>
                      </div>
                      <Link
                        to={`/find_doctor/${doctor.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                No doctors currently listed for this hospital.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}