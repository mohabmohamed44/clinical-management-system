import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaBed, FaAmbulance, FaUserMd } from "react-icons/fa";
import { DNA } from "react-loader-spinner";
import Style from "./HospitalsDetails.module.css";

export default function HospitalsDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const { data, error } = await supabase
          .from('Hospitals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setHospital(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <DNA height={90} width={80} ariaLabel="dna-loading" />
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-8">
      Error: {error}
    </div>
  );

  if (!hospital) return (
    <div className="text-center p-8">
      Hospital not found
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{hospital.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={hospital.image || "/default-hospital.jpg"}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="text-blue-600" />
                <p>{hospital.government}, {hospital.city}, {hospital.street}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-blue-600" />
                <a href={`tel:${hospital.phones}`} className="hover:text-blue-600">
                  {hospital.phones}
                </a>
              </div>
              {hospital.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-blue-600" />
                  <a href={`mailto:${hospital.email}`} className="hover:text-blue-600">
                    {hospital.email}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Working Hours</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-blue-600" />
                <div className="space-y-1">
                  {hospital.work_times?.map((time, index) => (
                    <div key={index} className="text-sm">
                      {time.day}: {time.start} - {time.end}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Hospital Information</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBed className="text-blue-600" />
                <p>Capacity: {hospital.capacity} beds</p>
              </div>
              {hospital.emergency_available && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaAmbulance className="text-blue-600" />
                  <p>24/7 Emergency Services Available</p>
                </div>
              )}
              {hospital.doctors_count && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUserMd className="text-blue-600" />
                  <p>{hospital.doctors_count} Medical Specialists</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {hospital.departments && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospital.departments.map((department, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600">{department}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hospital.facilities && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Facilities & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospital.facilities.map((facility, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-green-600">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hospital.insurance_providers && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Accepted Insurance Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospital.insurance_providers.map((provider, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-yellow-700">{provider}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hospital.description && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">About Us</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {hospital.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}