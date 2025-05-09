// AppointmentsPage.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCcVisa,
  FaUser,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

// NEW: Define auth globally so it's available in the component.
const auth = getAuth();

const fetchAppointments = async (filters, userId) => {
  if (!userId) return [];
  const auth = getAuth();
  // First get Supabase user ID from Firebase UID
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("id")
    .eq("uid", userId)
    .single();

  if (userError) throw new Error(userError.message);
  if (!userData) return [];

  let query = supabase
    .from("Appointments")
    .select(
      `
      id,
      status,
      payment_method,
      type,
      clinic_id,
      hos_id,
      doctor_id,
      date,
      time,
      patient,
      patient_id,
      Doctors (
        id,
        first_name,
        last_name,
        specialty,
        image
      ),
      clinic:Clinics (
        id,
        address
      )
    `
    )
    .eq("patient_id", userData.id)
    .order("date", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.payment_method)
    query = query.eq("payment_method", filters.payment_method);
  if (filters.type) query = query.eq("type", filters.type);

  if (filters.location === "clinic") {
    query = query.not("clinic_id", "is", null);
  } else if (filters.location === "hospital") {
    query = query.not("hos_id", "is", null);
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    start.setHours(0, 0, 0, 0);
    query = query.gte("date", start.toISOString());
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    query = query.lte("date", end.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Add formatClinicAddress helper function
const formatClinicAddress = (address) => {
  if (!address) return "Address not available";
  const { building, floor, streat } = address;
  return `${building || ''}, ${floor ? `${floor} Floor` : ''}, ${streat || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h1 className="text-2xl font-semibold mb-4">Something went wrong.</h1>
          <p className="text-red-500">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppointmentsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    payment_method: "",
    type: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointments", filters, currentUser?.uid],
    queryFn: () => fetchAppointments(filters, currentUser?.uid),
    staleTime: 5 * 60 * 1000,
    enabled: !!currentUser?.uid,
  });

  const resetFilters = () => {
    setFilters({
      status: "",
      payment_method: "",
      type: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    toast.success("Filters reset successfully");
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <FaCheckCircle />,
      },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <FaClock /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <FaTimesCircle /> },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: <FaCheckCircle />,
      },
    };

    const normalizedStatus = (status || "").toLowerCase();
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          statusStyles[normalizedStatus]?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusStyles[normalizedStatus]?.icon}
        <span className="capitalize">{normalizedStatus}</span>
      </span>
    );
  };

  const getPaymentMethod = (method) => (
    <div className="flex items-center gap-2">
      {method === "Visa" ? (
        <FaCcVisa size={20} className="text-[#1972EE]" />
      ) : (
        <SiCashapp size={20} className="text-[#1972EE]" />
      )}
      <span className="capitalize">{method}</span>
    </div>
  );

  const formatDate = (dateString, timeString) => {
    try {
      const date = new Date(`${dateString}T${timeString}`);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Update getLocationDisplay function
  const getLocationDisplay = (appointment) => {
    if (appointment.clinic_id) {
      const address = formatClinicAddress(appointment.clinic?.address);
      return (
        <div className="flex flex-col">
          <span className="font-medium">Clinic</span>
          <span className="text-xs text-gray-500">{address}</span>
        </div>
      );
    }
    if (appointment.hos_id) return <span>Hospital</span>;
    return <span>N/A</span>;
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-semibold mb-4">
          Please login to view appointments
        </div>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Login Now
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA width={90} height={90} ariaLabel="loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );
  }

  // Add responsive table/card view component
  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={appointment.Doctors?.image || "/default-avatar.png"}
            alt="Doctor"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">
              Dr. {appointment.Doctors?.first_name} {appointment.Doctors?.last_name}
            </div>
            <div className="text-sm text-[#667198]">
              {appointment.Doctors?.specialty}
            </div>
          </div>
        </div>
        {getStatusBadge(appointment.status)}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date & Time:</span>
          <span className="text-gray-900">{formatDate(appointment.date, appointment.time)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment:</span>
          <span>{getPaymentMethod(appointment.payment_method)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Location:</span>
          <span>{getLocationDisplay(appointment)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Type:</span>
          <span className="capitalize">{appointment.type}</span>
        </div>
      </div>
      
      <Link
        to={`/appointments/${appointment.id}`}
        className="mt-3 block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        View Details
      </Link>
    </div>
  );

  // Update the return statement
  return (
    <ErrorBoundary>
      <MetaData
        title={"My Appointments | HealthCare"}
        description={"Manage your medical appointments"}
        name={"Appointments"}
        type="website"
        url={window.location.href}
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            My Appointments
          </h1>

          {/* Filters Section - Mobile Responsive */}
          <div className="bg-white rounded-lg shadow mb-6 border-2 border-[#1972EE] overflow-hidden">
            {/* Filter Header - Always Visible */}
            <button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="w-full p-4 flex items-center justify-between md:hidden"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-[#00155D]" />
                <h2 className="text-base font-semibold text-[#00155D]">
                  Filter Appointments
                </h2>
              </div>
              {isFiltersVisible ? (
                <FaChevronUp className="text-[#00155D]" />
              ) : (
                <FaChevronDown className="text-[#00155D]" />
              )}
            </button>

            {/* Filter Content - Collapsible on Mobile */}
            <div
              className={`${
                isFiltersVisible ? "max-h-[1000px]" : "max-h-0 md:max-h-[1000px]"
              } transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="p-4 md:p-6 border-t md:border-t-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="hidden md:flex items-center gap-2">
                    <FaFilter className="text-[#00155D]" />
                    <h2 className="text-base md:text-lg font-semibold text-[#00155D]">
                      Filter Appointments
                    </h2>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="w-full md:w-auto px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {/* Filter Fields - Updated for better mobile spacing */}
                  {[
                    { label: "Status", value: "status", options: ["Completed", "Pending", "Cancelled", "Confirmed"] },
                    { label: "Payment", value: "payment_method", options: ["Visa", "Cash"] },
                    { label: "Type", value: "type", options: ["Completed", "Upcoming"] },
                    { label: "Location", value: "location", options: ["clinic", "hospital"] }
                  ].map((filter) => (
                    <div key={filter.value} className="space-y-1">
                      <label className="block text-sm text-blue-700 font-medium">
                        {filter.label}
                      </label>
                      <select
                        className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters[filter.value]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [filter.value]: e.target.value,
                          }))
                        }
                      >
                        <option value="">All {filter.label}s</option>
                        {filter.options.map((option) => (
                          <option key={option} value={option.toLowerCase()}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  
                  {/* Date Fields */}
                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      From
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      To
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Table/Card View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            {/* Original table markup for tablet and desktop */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Patient
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments?.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={
                              appointment.Doctors?.image ||
                              "/default-avatar.png"
                            }
                            alt="Doctor"
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {appointment.Doctors?.first_name}{" "}
                              {appointment.Doctors?.last_name}
                            </div>
                            <div className="text-sm text-[#667198]">
                              {appointment.Doctors?.specialty}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#667198]">
                        {formatDate(appointment.date, appointment.time)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getPaymentMethod(appointment.payment_method)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#667198] capitalize">
                        {appointment.type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#667198]">
                        {getLocationDisplay(appointment)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FaUser className="w-6 h-6 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {appointment.patient?.name || "N/A"}
                            </div>
                            <div className="text-sm text-[#667198]">
                              {appointment.patient?.phone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-[#667198]"
                    >
                      No appointments found.{" "}
                      <Link
                        to="/book"
                        className="text-blue-500 hover:underline"
                      >
                        Book an appointment
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {appointments?.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">No appointments found.</p>
                <Link to="/book" className="text-blue-500 hover:underline mt-2 inline-block">
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
