import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Doctor from "../../assets/doctor_home.webp";
import {getAuth} from 'firebase/auth';
import { getUserDataByFirebaseUID } from '../../services/AuthService';
import toast from 'react-hot-toast';
import { supabase } from '../../Config/Supabase';

export default function UpcomingVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('large');
  const [cardsPerView, setCardsPerView] = useState(3);
  const auth = getAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
        setCardsPerView(1);
      } else if (width < 1024) {
        setScreenSize('medium');
        setCardsPerView(2);
      } else {
        setScreenSize('large');
        setCardsPerView(3);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchUpcomingVisits = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("User not authenticated");
        setLoading(false);
        toast.error("Please login to view upcoming visits");
        return;
      }

      const { success, userData } = await getUserDataByFirebaseUID(currentUser.uid);
      if (!success) throw new Error("Failed to fetch user data");

      // Fetch appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('Appointments')
        .select(`
          id,
          date,
          time,
          doctor_id,
          clinic_id,
          hos_id,
          problem_reason
        `)
        .eq('patient_id', userData.id);

      if (appointmentsError) throw appointmentsError;

      // Collect IDs
      const doctorIds = [...new Set(appointments.map(a => a.doctor_id))];
      const clinicIds = appointments.map(a => a.clinic_id).filter(Boolean);
      const hosIds = appointments.map(a => a.hos_id).filter(Boolean);

      // Fetch related data
      const [
        { data: doctors, error: doctorsError },
        { data: clinics, error: clinicsError },
        { data: hospitals, error: hospitalsError },
        { data: specialties, error: specialtiesError }
      ] = await Promise.all([
        supabase.from('Doctors')
          .select('id, first_name, last_name, image, specialty, phone')
          .in('id', doctorIds),
        clinicIds.length > 0 ? supabase.from('Clinics').select('*').in('id', clinicIds) : { data: [] },
        hosIds.length > 0 ? supabase.from('Hospitals').select('*').in('id', hosIds) : { data: [] },
        supabase.from('Specialties').select('id, specialty')
      ]);

      if (doctorsError) throw doctorsError;
      if (clinicsError) throw clinicsError;
      if (hospitalsError) throw hospitalsError;
      if (specialtiesError) throw specialtiesError;

      // Create mappings
      const specialtyMap = new Map(specialties.map(s => [s.id, s.specialty]));
      const facilityMap = new Map();

      clinics.forEach(clinic => {
        facilityMap.set(`clinic-${clinic.id}`, {
          address: `${clinic.government}, ${clinic.city}, ${clinic.street}`
        });
      });

      hospitals.forEach(hospital => {
        facilityMap.set(`hospital-${hospital.id}`, {
          name: hospital.name
        });
      });

      // Process visits
      const processedVisits = appointments.map(appt => {
        const doctor = doctors.find(d => d.id === appt.doctor_id) || {};
        let facilityInfo = {};

        if (appt.clinic_id) {
          const clinic = facilityMap.get(`clinic-${appt.clinic_id}`);
          if (clinic) facilityInfo.location = clinic.address;
        } else if (appt.hos_id) {
          const hospital = facilityMap.get(`hospital-${appt.hos_id}`);
          if (hospital) facilityInfo.location = hospital.name;
        }

        return {
          id: appt.id,
          doctor_photo: doctor.image || Doctor,
          doctor_name: `${doctor.first_name} ${doctor.last_name}`.trim() || 'Unknown Doctor',
          specialty: specialtyMap.get(doctor.specialty) || 'General Practice',
          visit_date: `${appt.date}T${appt.time}`,
          location: facilityInfo.location || 'Address not available',
          phone: doctor.phone || 'Phone not available',
          notes: appt.problem_reason
        };
      });

      setVisits(processedVisits);
      setLoading(false);

    } catch (err) {
      setError("Failed to fetch upcoming visits");
      setLoading(false);
      console.error('Error fetching visits:', err);
      toast.error(err.message || 'Error loading appointments');
    }
  };

  useEffect(() => {
    fetchUpcomingVisits();
  }, []);

  // Formatting functions
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const getDaysRemaining = (dateString) => {
    const visitDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = visitDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `in ${diffDays} days`;
  };

  // Carousel controls
  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, visits.length - cardsPerView));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button onClick={fetchUpcomingVisits} className="ml-2 text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#11319E] text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center">
          <Calendar className="mr-2 w-5 h-5" />
          Upcoming Visits
        </h2>
        <span className="bg-[#2147c5] px-3 py-1 rounded-full text-sm">
          {visits.length} {visits.length === 1 ? 'Visit' : 'Visits'}
        </span>
      </div>

      {visits.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No upcoming appointments</p>
        </div>
      ) : (
        <div className="p-4">
          <div className="relative overflow-hidden">
            {screenSize !== 'mobile' && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= visits.length - cardsPerView}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                >
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </>
            )}

            <div
              className="flex transition-transform duration-300 gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
            >
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className={`flex-shrink-0 ${
                    screenSize === 'mobile' ? 'w-full' :
                    screenSize === 'medium' ? 'w-1/2' : 'w-1/3'
                  } bg-white rounded-lg shadow-md p-4`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={visit.doctor_photo}
                      alt={visit.doctor_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <h3 className="font-bold line-clamp-1">{visit.doctor_name}</h3>
                      <p className="text-blue-600 text-sm">{visit.specialty}</p>
                      <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {getDaysRemaining(visit.visit_date)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div className="ml-2">
                        <p className="text-sm font-medium">{formatDate(visit.visit_date)}</p>
                        <p className="text-xs text-gray-600">{formatTime(visit.visit_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-gray-700 ml-2 line-clamp-2">{visit.location}</p>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-gray-700 ml-2">{visit.phone}</p>
                    </div>

                    {visit.notes && (
                      <div className="mt-2 bg-yellow-50 p-2 rounded text-xs">
                        <p className="font-medium">Reason:</p>
                        <p className="text-gray-700 line-clamp-3">{visit.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t flex flex-col gap-2">
                    <button className="w-full py-2 text-sm bg-[#11319E] text-white rounded hover:bg-blue-700">
                      Reschedule
                    </button>
                    <button className="w-full py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile controls */}
          {screenSize === 'mobile' && visits.length > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= visits.length - cardsPerView}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Indicators */}
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: Math.ceil(visits.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}