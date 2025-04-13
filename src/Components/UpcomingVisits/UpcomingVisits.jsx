import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Doctor from "../../assets/doctor_home.webp";

export default function UpcomingVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCardsPerView(mobile ? 1 : 3);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // This function would connect to your Supabase instance
  const fetchUpcomingVisits = async () => {
    try {
      setLoading(true);
      
      // Replace this with your actual Supabase client code
      // Example:
      // const { data, error } = await supabase
      //   .from('visits')
      //   .select('*')
      //   .eq('patient_id', currentPatientId)
      //   .gte('visit_date', new Date().toISOString())
      //   .order('visit_date', { ascending: true });
      
      // For demo purposes, using mock data
      const mockData = [
        {
          id: 1,
          doctor_name: "Dr. Sarah Johnson",
          doctor_photo: Doctor,
          specialty: "Cardiologist",
          visit_date: "2025-04-15T09:30:00",
          location: "Memorial Hospital, Room 302",
          phone: "555-123-4567",
          notes: "Bring latest test results"
        },
        {
          id: 2,
          doctor_name: "Dr. Michael Chen",
          doctor_photo: Doctor,
          specialty: "Neurologist",
          visit_date: "2025-04-20T14:00:00",
          location: "Medical Center West, Suite 145",
          phone: "555-987-6543",
          notes: "Follow-up on medication adjustment"
        },
        {
          id: 3,
          doctor_name: "Dr. Lisa Rodriguez",
          doctor_photo: Doctor,
          specialty: "Endocrinologist",
          visit_date: "2025-05-03T11:15:00",
          location: "Wellness Clinic, Floor 5",
          phone: "555-456-7890",
          notes: "Fasting required before appointment"
        },
        {
          id: 4,
          doctor_name: "Dr. James Wilson",
          doctor_photo: Doctor,
          specialty: "Dermatologist",
          visit_date: "2025-05-10T10:00:00",
          location: "Skin Health Center, Room 204",
          phone: "555-111-2222",
          notes: "Annual skin examination"
        },
        {
          id: 5,
          doctor_name: "Dr. Emily Parker",
          doctor_photo: Doctor,
          specialty: "Rheumatologist",
          visit_date: "2025-05-17T13:45:00",
          location: "Arthritis Treatment Center, Suite 110",
          phone: "555-333-4444",
          notes: "Joint pain assessment",
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setVisits(mockData);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError("Failed to fetch upcoming visits");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUpcomingVisits();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Calculate days remaining until appointment
  const getDaysRemaining = (dateString) => {
    const visitDate = new Date(dateString);
    const today = new Date();
    const diffTime = visitDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `in ${diffDays} days`;
  };

  // Carousel navigation
  const nextSlide = () => {
    const maxIndex = visits.length - cardsPerView;
    if(currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    // Make sure we don't scroll beyond available cards
    const maxStartIndex = Math.max(0, visits.length - cardsPerView);
    const newIndex = Math.min(index, maxStartIndex);
    setCurrentIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="animate-pulse text-gray-600">Loading upcoming visits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 rounded-lg border-red-200">
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={fetchUpcomingVisits}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md mt-3 overflow-hidden">
      {/* Header */}
      <div className="bg-[#11319E] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold flex items-center">
          <Calendar className="mr-2 w-5 h-5" />
          Upcoming Visits
        </h2>
        <span className="text-xs md:text-sm bg-[#2147c5] px-2 py-1 md:px-3 rounded-full">
          {visits.length} {visits.length === 1 ? 'visit' : 'visits'} scheduled
        </span>
      </div>

      {visits.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p>No upcoming visits scheduled</p>
          <button className="mt-4 px-4 py-2 bg-[#11319E] text-white rounded hover:bg-blue-700 transition-colors">
            Schedule New Visit
          </button>
        </div>
      ) : (
        <div className="p-4">
          {/* Carousel container */}
          <div className="relative">
            {/* Navigation buttons */}
            {!isMobile && (
              <>
                <button 
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="text-blue-600 w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={currentIndex >= visits.length - cardsPerView}
                  className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 ${
                    currentIndex >= visits.length - cardsPerView ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="text-blue-600 w-5 h-5" />
                </button>
              </>
            )}

            {/* Cards container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out gap-4"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
                }}
              >
                {visits.map((visit) => (
                  <div 
                    key={visit.id}
                    className={`flex-shrink-0 ${
                      isMobile ? 'w-full' : 'w-1/3'
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-sm p-4 mx-1 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={visit.doctor_photo} 
                          alt={visit.doctor_name}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-blue-100"
                        />
                        <div>
                          <h3 className="font-bold text-base md:text-lg line-clamp-1">{visit.doctor_name}</h3>
                          <p className="text-blue-600 text-sm">{visit.specialty}</p>
                          <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {getDaysRemaining(visit.visit_date)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start">
                          <Clock className="flex-shrink-0 w-4 h-4 mt-0.5 text-gray-500" />
                          <div className="ml-2">
                            <p className="text-sm font-medium">{formatDate(visit.visit_date)}</p>
                            <p className="text-xs text-gray-600">{formatTime(visit.visit_date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="flex-shrink-0 w-4 h-4 mt-0.5 text-gray-500" />
                          <p className="text-sm text-gray-700 ml-2 line-clamp-2">{visit.location}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-700 ml-2">{visit.phone}</p>
                        </div>
                        
                        {visit.notes && (
                          <div className="mt-2 bg-yellow-50 p-2 rounded text-xs">
                            <p className="font-medium">Notes:</p>
                            <p className="text-gray-700">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                        <button className="px-3 py-1.5 text-sm bg-[#11319E] text-white rounded hover:bg-blue-700 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile navigation buttons */}
          {isMobile && visits.length > 1 && (
            <div className="flex justify-between mt-4 px-2">
              <button 
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                Previous
              </button>
              <button 
                onClick={nextSlide}
                disabled={currentIndex >= visits.length - cardsPerView}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex >= visits.length - cardsPerView
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Carousel indicators */}
          <div className="flex justify-center mt-4 space-x-1">
            {visits.map((_, index) => {
              // Only show indicators that can be starting points
              if (index <= visits.length - cardsPerView) {
                return (
                  <button 
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index <= currentIndex && currentIndex < index + cardsPerView
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    } ${
                      isMobile ? 'w-3 h-3' : 'w-2 h-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              }
              return null;
            }).filter(Boolean)}
          </div>
        </div>
      )}
    </div>
  );
}