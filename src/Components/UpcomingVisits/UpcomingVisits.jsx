import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Doctor from "../../assets/doctor_home.webp";

export default function UpcomingVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('large');
  const [cardsPerView, setCardsPerView] = useState(3);

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

  // This function would connect to your Supabase instance
  const fetchUpcomingVisits = async () => {
    try {
      setLoading(true);
      
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
          notes: "fet check for joint pain",
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
  };

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
      <div className="w-full p-6 bg-red-50 rounded-lg border border-red-200">
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
    <div className="w-full bg-white rounded-lg shadow-md mt-20 overflow-hidden">
      {/* Header */}
      <div className="bg-[#11319E] text-white p-4 rounded-t-lg flex items-center justify-between">
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
            {/* Navigation buttons for larger screens */}
            {screenSize !== 'mobile' && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center z-10">
                  <button 
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className={`bg-white rounded-full p-2 shadow-md mx-2 ${
                      currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="text-blue-600 w-5 h-5" />
                  </button>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center z-10">
                  <button 
                    onClick={nextSlide}
                    disabled={currentIndex >= visits.length - cardsPerView}
                    className={`bg-white rounded-full p-2 shadow-md mx-2 ${
                      currentIndex >= visits.length - cardsPerView ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="text-blue-600 w-5 h-5" />
                  </button>
                </div>
              </>
            )}
            
            {/* Cards container */}
            <div className="overflow-hidden py-2">
              <div 
                className="flex gap-4 transition-transform duration-300 ease-in-out px-2 md:px-8" 
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` 
                }}
              >
                {visits.map((visit) => (
                  <div 
                    key={visit.id} 
                    className={`flex-shrink-0 ${
                      screenSize === 'mobile' ? 'w-full' : 
                      screenSize === 'medium' ? 'w-1/2' : 'w-1/3'
                    } rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow bg-white`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <img 
                        src={visit.doctor_photo} 
                        alt={visit.doctor_name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <h3 className="font-bold text-base md:text-lg line-clamp-1">{visit.doctor_name}</h3>
                        <p className="text-blue-600 text-sm">{visit.specialty}</p>
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {getDaysRemaining(visit.visit_date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
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
                    
                    {/* Buttons stacked vertically on all screen sizes */}
                    <div className="mt-4 pt-3 border-t flex flex-col space-y-2">
                      <button className="w-full px-3 py-1.5 text-sm bg-[#11319E] text-white rounded hover:bg-blue-700 transition-colors">
                        Reschedule
                      </button>
                      <button className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile navigation buttons */}
          {screenSize === 'mobile' && visits.length > 1 && (
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
                      screenSize === 'mobile' ? 'w-3 h-3' : 'w-2 h-2'
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