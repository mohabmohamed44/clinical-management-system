// src/pages/SingleLabReservation.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { format, parseISO, addMinutes } from 'date-fns';

export default function BookLab() {
  const { lab_id } = useParams();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    problem_reason: "",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Fetch lab details using TanStack Query
  const { data: lab, isLoading, isError } = useQuery({
    queryKey: ['lab', lab_id],
    queryFn: async () => {
      if (!lab_id) throw new Error('Lab ID is required');

      // Fetch lab details from Laboratories table
      const { data: labData, error: labError } = await supabase
        .from('Laboratories')
        .select(`
          id,
          description,
          description_ar,
          name_ar,
          name,
          image,
          rate,
          rate_count,
          patients
        `)
        .eq('id', lab_id)
        .single();
      
      if (labError) throw labError;
      if (!labData) throw new Error('Lab not found');
      
      // Fetch lab info from LaboratoriesInfo table
      const { data: infoData, error: infoError } = await supabase
        .from('LaboratoriesInfo')
        .select('*')
        .eq('id', lab_id) // Change from lab_id to id
        .maybeSingle();
      
      if (infoError) throw infoError;
      
      // Combine the data
      return {
        ...labData,
        ...infoData,
        services: infoData?.services || []
      };
    },
    enabled: !!lab_id, // Only run query when lab_id is available
    retry: false // Don't retry on failure
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (appointmentData) => {
      const { error } = await supabase
        .from("appointments")
        .insert([appointmentData]);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      navigate('/booking-confirmation');
    },
    onError: (error) => {
      alert(`Booking failed: ${error.message}`);
    }
  });

  // Handle service selection
  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };

  // Calculate total fee
  const calculateTotalFee = () => {
    if (!lab) return 0;
    return selectedServices.reduce((total, serviceId) => {
      const service = lab.services.find(s => s.service === serviceId);
      return total + (Number(service?.price) || 0);
    }, 0);
  };

  // Generate time slots based on work times
  const generateTimeSlots = (workTime) => {
    try {
      const startTime = parseISO(`2000-01-01T${workTime.start}`);
      const endTime = parseISO(`2000-01-01T${workTime.end}`);
      const duration = parseInt(workTime.duration) || 30; // Default to 30 minutes
      const slots = [];
      let currentTime = startTime;

      while (currentTime < endTime) {
        slots.push(format(currentTime, 'HH:mm'));
        currentTime = addMinutes(currentTime, duration);
      }

      return slots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      return [];
    }
  };

  // Update time slots when date changes
  useEffect(() => {
    if (lab?.work_times?.length) {
      const selectedDate = new Date(bookingDetails.date);
      const dayOfWeek = format(selectedDate, 'EEEE');
      
      const workTime = lab.work_times.find(
        time => time.day.toLowerCase() === dayOfWeek.toLowerCase()
      );

      if (workTime) {
        const slots = generateTimeSlots(workTime);
        setAvailableTimeSlots(slots);
        
        // Set default time to first available slot if not set
        if (slots.length > 0 && !bookingDetails.time) {
          setBookingDetails(prev => ({ ...prev, time: slots[0] }));
        }
      } else {
        setAvailableTimeSlots([]);
        setBookingDetails(prev => ({ ...prev, time: "" }));
      }
    }
  }, [bookingDetails.date, lab]);

  // Add this helper function to format location
  const formatLocation = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      const { latitude, longitude } = location;
      return `${latitude}, ${longitude}`;
    }
    return '';
  };

  // Update renderLabDetails to handle location object
  const renderLabDetails = () => {
    if (!lab) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {formatLocation(lab.location)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Government:</span> {lab.government}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">City:</span> {lab.city}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Working Hours:</p>
            {lab.work_times?.map((time, index) => (
              <p key={index} className="text-sm text-gray-600">
                {time.day}: {time.start} - {time.end} (Duration: {time.duration} min)
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Gallery:</p>
          <div className="grid grid-cols-4 gap-2">
            {lab.images?.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Lab ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Lab';
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Handle booking submission
  const handleBookAppointment = async () => {
    if (!lab || selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    if (!bookingDetails.time) {
      alert("Please select a time slot");
      return;
    }

    const appointmentData = {
      lab_id: lab.id,
      appointment_date: bookingDetails.date,
      appointment_time: bookingDetails.time,
      problem_reason: bookingDetails.problem_reason,
      fee: calculateTotalFee(),
      lab_services: selectedServices,
      status: "pending",
      created_at: new Date().toISOString(),
      government: lab.government,
      city: lab.city,
      location: typeof lab.location === 'object' ? JSON.stringify(lab.location) : lab.location
    };

    bookingMutation.mutate(appointmentData);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  // Render time slots as buttons
  const renderTimeSlots = () => {
    if (availableTimeSlots.length === 0) {
      return <p className="text-red-500 text-sm py-4">No available time slots for selected date</p>;
    }

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-2">
        {availableTimeSlots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => setBookingDetails(prev => ({ ...prev, time }))}
            className={`p-2 text-sm rounded-lg border transition-colors ${
              bookingDetails.time === time
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    );
  };

  // Render lab services
  const renderServices = () => (
    <div className="space-y-3">
      {lab?.services?.map((service, index) => (
        <div 
          key={index}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center ${
            selectedServices.includes(service.service)
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
          onClick={() => toggleService(service.service)}
        >
          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
            selectedServices.includes(service.service)
              ? "bg-indigo-500 border-indigo-500"
              : "border-gray-300"
          }`}>
            {selectedServices.includes(service.service) && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{service.service_ar}</div>
            <div className="text-sm text-gray-600">{service.service}</div>
          </div>
          <div className="font-semibold text-indigo-600">${service.price}</div>
        </div>
      ))}
    </div>
  );

  // Render selected services
  const renderSelectedServices = () => (
    <div className="bg-gray-50 rounded-lg p-4">
      <ul className="space-y-2">
        {selectedServices.map((serviceId, index) => {
          const service = lab.services.find(s => s.service === serviceId);
          return (
            <li key={index} className="flex justify-between">
              <span className="text-gray-700">{service?.service_ar}</span>
              <span className="font-medium">${service?.price}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !lab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-semibold mt-4">Lab not found</h2>
        <p className="text-gray-600 mt-2">The lab you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/labs')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Browse Labs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Labs
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Book Your Test at {lab.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Schedule your lab tests with this trusted laboratory. Choose from a wide range of services and get accurate results.
          </p>
        </div>

        {/* Lab Information */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="relative w-32 h-32">
                  <img 
                    src={lab.image} 
                    alt={lab.name_ar}
                    className="absolute inset-0 w-full h-full rounded-xl object-cover shadow-lg" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=Lab';
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{lab.name_ar}</h2>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(lab.rate) ? 'fill-current' : 'fill-none stroke-current'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({lab.rate_count} reviews)</span>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700">About</h3>
                  <p className="text-gray-600 mt-1">{lab.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {lab.patients}+ Patients
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Accredited Lab
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    Fast Results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Test</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                {renderTimeSlots()}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Test
              </label>
              <textarea
                name="problem_reason"
                value={bookingDetails.problem_reason}
                onChange={handleInputChange}
                rows={3}
                placeholder="Please describe your symptoms or reason for testing..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Services</h3>
              {lab?.services?.length > 0 ? (
                renderServices()
              ) : (
                <p className="text-gray-500 text-center py-8">No services available for this lab</p>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Selected Services</h4>
              </div>
              
              {selectedServices.length > 0 ? (
                renderSelectedServices()
              ) : (
                <p className="text-gray-500 text-center py-4">No services selected</p>
              )}
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
              <div>
                <p className="text-sm text-gray-600">Total Fee</p>
                <p className="text-2xl font-bold text-indigo-600">${calculateTotalFee()}</p>
              </div>
              <button
                onClick={handleBookAppointment}
                disabled={bookingMutation.isPending || selectedServices.length === 0}
                className={`px-6 py-3 rounded-lg font-medium text-white ${
                  bookingMutation.isPending || selectedServices.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition-colors`}
              >
                {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Lab Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lab Details</h2>
            {renderLabDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}