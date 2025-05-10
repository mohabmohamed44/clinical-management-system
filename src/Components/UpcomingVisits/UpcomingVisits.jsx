import { useState, useEffect } from "react";
import { supabase } from "../../Config/Supabase";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Doctor from "../../assets/doctor_home.webp";
import useModal from "../../hooks/useModal";
import RescheduleModal from "../RescheduleModal/RescheduleModal";
import { getCurrentUser } from "../../utils/GoogleAuth";
import { Link } from "react-router-dom";

export default function UpcomingVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState("large");
  const [cardsPerView, setCardsPerView] = useState(3);
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
        setCardsPerView(1);
      } else if (width < 1024) {
        setScreenSize("medium");
        setCardsPerView(2);
      } else {
        setScreenSize("large");
        setCardsPerView(3);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    // Extract relevant parts from the address object if they exist
    const building = address.building || "";
    const floor = address.floor ? `${address.floor} Floor` : "";
    const street = address.streat || address.street || "";
    const sign = address.sign || "";

    // Filter out empty parts and join with commas
    return [building, floor, street, sign].filter((part) => part).join(", ");
  };

  const fetchUpcomingVisits = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setError("No authenticated user found");
        return;
      }

      setLoading(true);

      // First get the Supabase user ID
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("id")
        .eq("uid", user.uid)
        .single();

      if (userError) throw userError;

      const { data: appointments, error: appointmentsError } = await supabase
        .from("Appointments")
        .select(
          `
          id,
          date,
          time,
          fee,
          payment_method,
          patient,
          doctor:Doctors(
            id, 
            first_name,
            last_name,
            specialty,
            phone,
            fee,
            image
          ),
          clinic:Clinics(
            id,
            address
          )
        `
        )
        .eq("patient_id", userData.id) // Use Supabase user ID instead of Firebase UID
        .eq("type", "Upcoming")
        .neq("status", "Cancelled")
        .order("date", { ascending: true });

      if (appointmentsError) throw appointmentsError;

      const formattedAppointments = appointments.map((appointment) => ({
        id: appointment.id,
        date: new Date(`${appointment.date}T${appointment.time}`),
        patient: appointment.patient,
        reason: appointment.patient?.problem || "",
        payment: {
          method: appointment.payment_method,
          amount: appointment.fee,
        },
        doctor: {
          ...appointment.doctor,
          name: `${appointment.doctor.first_name} ${appointment.doctor.last_name}`,
          phone: appointment.doctor.phone,
          photo_url: appointment.doctor.image,
        },
        clinic: {
          ...appointment.clinic,
          name: appointment.clinic.address?.name || "Clinic",
          formattedAddress: formatAddress(appointment.clinic.address),
        },
      }));

      setVisits(formattedAppointments);
    } catch (err) {
      setError("Failed to fetch upcoming visits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingVisits();
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString(undefined, options);
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `in ${diffDays} days`;
  };

  // Carousel navigation
  const nextSlide = () => {
    const maxIndex = visits.length - cardsPerView;
    if (currentIndex < maxIndex) {
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

  const handleReschedule = (updatedVisit) => {
    setVisits(
      visits.map((visit) =>
        visit.id === updatedVisit.id ? updatedVisit : visit
      )
    );
    // Here you would typically make an API call to update the visit
  };

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="animate-pulse text-gray-600">
          Loading upcoming visits...
        </div>
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
    <div className="w-full bg-white rounded-lg shadowP mt-20 overflow-hidden">
      {/* Header */}
      <div className="bg-[#11319E] text-white p-4 rounded-t-lg flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold flex items-center">
          <Calendar className="mr-2 w-5 h-5" />
          Upcoming Visits
        </h2>
        <span className="text-xs md:text-sm bg-[#2147c5] px-2 py-1 md:px-3 rounded-full">
          {visits.length} {visits.length === 1 ? "visit" : "visits"} scheduled
        </span>
      </div>

      {visits.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p>No upcoming visits scheduled</p>
        </div>
      ) : (
        <div className="p-4">
          {/* Carousel container */}
          <div className="relative">
            {/* Navigation buttons for larger screens */}
            {screenSize !== "mobile" && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center z-10">
                  <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className={`bg-white rounded-full p-2 shadow-md mx-2 ${
                      currentIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
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
                      currentIndex >= visits.length - cardsPerView
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
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
                  transform: `translateX(-${
                    currentIndex * (100 / cardsPerView)
                  }%)`,
                }}
              >
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className={`flex-shrink-0 ${
                      screenSize === "mobile"
                        ? "w-full"
                        : screenSize === "medium"
                        ? "w-1/2"
                        : "w-1/3"
                    } rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow bg-white`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src={visit.doctor?.photo_url || Doctor}
                        alt={visit.doctor?.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <h3 className="font-bold text-base md:text-lg line-clamp-1">
                          {visit.doctor?.name}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {visit.doctor?.specialty}
                        </p>
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {getDaysRemaining(visit.date)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Clock className="flex-shrink-0 w-4 h-4 mt-0.5 text-gray-500" />
                        <div className="ml-2">
                          <p className="text-sm font-medium">
                            {formatDate(visit.date)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTime(visit.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="flex-shrink-0 w-4 h-4 mt-0.5 text-gray-500" />
                        <div className="ml-2">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {visit.clinic?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {visit.clinic?.formattedAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-700 ml-2">
                          {visit.doctor?.phone || visit.clinic?.phone}
                        </p>
                      </div>

                      {visit.reason && (
                        <div className="mt-2 bg-yellow-50 p-2 rounded text-sm">
                          <p className="font-medium">Appointment Reason:</p>
                          <p className="text-gray-700">{visit.reason}</p>
                        </div>
                      )}
                    </div>
                    {/* Buttons */}
                    <div className="mt-4 pt-3 border-t flex flex-col space-y-2">
                      <button
                        className="w-full px-3 py-1.5 text-sm bg-[#11319E] text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => openModal(visit)}
                      >
                        Reschedule
                      </button>
                      <Link to={`/appointments/${visit.id}`} className="w-full">
                        <button className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile navigation buttons */}
          {screenSize === "mobile" && visits.length > 1 && (
            <div className="flex justify-between mt-4 px-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= visits.length - cardsPerView}
                className={`px-4 py-2 rounded-lg ${
                  currentIndex >= visits.length - cardsPerView
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Carousel indicators */}
          <div className="flex justify-center mt-4 space-x-1">
            {visits
              .map((_, index) => {
                // Only show indicators that can be starting points
                if (index <= visits.length - cardsPerView) {
                  return (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index <= currentIndex &&
                        currentIndex < index + cardsPerView
                          ? "bg-blue-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      } ${screenSize === "mobile" ? "w-3 h-3" : "w-2 h-2"}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  );
                }
                return null;
              })
              .filter(Boolean)}
          </div>
        </div>
      )}
      <RescheduleModal
        isOpen={isOpen}
        onClose={closeModal}
        visitData={modalData}
        onReschedule={handleReschedule}
      />
    </div>
  );
}