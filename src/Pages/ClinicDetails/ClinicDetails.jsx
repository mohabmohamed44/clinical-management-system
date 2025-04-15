import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../Config/Supabase';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { DNA } from 'react-loader-spinner';
import MetaData from '../../Components/MetaData/MetaData';
import ClinicImg from '../../assets/clinic.webp';

export default function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const { data, error } = await supabase
          .from('Clinics') // Match exact table name case
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setClinic(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
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

  return (
    <>
    <MetaData
      title={"Clinic Details"}
      description={"Detailed information about the clinic"}
      keywords={"clinic, details, information"}
      author={"Mohab Mohammed"}
    />
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{clinic.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={clinic.image || ClinicImg }
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="text-blue-600" />
                <p>{clinic.government}, {clinic.city}, {clinic.street}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-blue-600" />
                <a href={`tel:${clinic.phones}`} className="hover:text-blue-600">
                  {clinic.phones}
                </a>
              </div>
              {clinic.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-blue-600" />
                  <a href={`mailto:${clinic.email}`} className="hover:text-blue-600">
                    {clinic.email}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Working Hours</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-blue-600" />
                <div className="space-y-1">
                  {clinic.work_times?.map((time, index) => (
                    <div key={index} className="text-sm">
                      {time.day}: {time.start} - {time.end}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">Pricing</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMoneyBillWave className="text-blue-600" />
                <p>Consultation Fee: ${clinic.fee}</p>
              </div>
            </div>
          </div>
        </div>

        {clinic.services && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {clinic.services.map((service, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {clinic.description && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">About Us</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {clinic.description}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
