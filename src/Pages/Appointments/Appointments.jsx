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
  FaFlask,
  FaHospital,
  FaClinicMedical,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

// Define auth globally so it's available in the component
const auth = getAuth();

const fetchAppointments = async (filters, userId) => {
  if (!userId) return [];
  
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
    .select(`
      id,
      status,
      payment_method,
      type,
      clinic_id,
      hos_id,
      doctor_id,
      lab_id,
      date,
      time,
      patient,
      patient_id,
      lab_services,
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
    `)
    .eq("patient_id", userData.id)
    .order("date", { ascending: false });

  // Apply filters
  if (filters.status) {
    query = query.ilike('status', `%${filters.status}%`);
  }
  if (filters.payment_method) {
    query = query.ilike('payment_method', `%${filters.payment_method}%`);
  }
  if (filters.type) {
    query = query.ilike('type', `%${filters.type}%`);
  }

  // Location filters
  if (filters.location === "clinic") {
    query = query.not("clinic_id", "is", null);
  } else if (filters.location === "hospital") {
    query = query.not("hos_id", "is", null);
  } else if (filters.location === "laboratory") {
    query = query.not("lab_id", "is", null);
  }

  // Date filters
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

  const { data: appointmentsData, error } = await query;
  if (error) throw new Error(error.message);
  
  if (!appointmentsData || appointmentsData.length === 0) {
    return [];
  }

  // Fetch laboratory data separately for appointments with lab_id
  const labIds = appointmentsData
    .filter(apt => apt.lab_id)
    .map(apt => apt.lab_id);

  let laboratoriesData = [];
  let laboratoriesInfoData = [];
  
  if (labIds.length > 0) {
    // Fetch Laboratories data
    const { data: labs, error: labsError } = await supabase
      .from("Laboratories")
      .select(`
        id,
        description,
        description_ar,
        name_ar,
        name,
        rate,
        image,
        rate_count,
        services,
        patients
      `)
      .in("id", labIds);
    
    if (labsError) {
      console.error("Error fetching laboratories:", labsError);
    } else {
      laboratoriesData = labs || [];
    }

    // Fetch LaboratoriesInfo data
    const { data: labsInfo, error: labsInfoError } = await supabase
      .from("LaboratoriesInfo")
      .select(`
        id,
        government,
        city,
        lab_id,
        location,
        images,
        work_times,
        services
      `)
      .in("lab_id", labIds);
    
    if (labsInfoError) {
      console.error("Error fetching laboratories info:", labsInfoError);
    } else {
      laboratoriesInfoData = labsInfo || [];
    }
  }

  // Combine the data
  const combinedData = appointmentsData.map(appointment => {
    if (appointment.lab_id) {
      const laboratory = laboratoriesData.find(lab => lab.id === appointment.lab_id);
      const lab_info = laboratoriesInfoData.find(info => info.lab_id === appointment.lab_id);
      
      return {
        ...appointment,
        laboratory,
        lab_info
      };
    }
    return appointment;
  });

  return combinedData;
};

// Format clinic address
  const formatClinicAddress = (address) => {
    if (!address) return "Address not available";
    const { building, floor, streat } = address;
    return `${building || ""}, ${floor ? `${floor} Floor` : ""}, ${streat || ""}`;
  };

  // Format lab location
  const formatLabLocation = (labInfo) => {
    if (!labInfo) return "Location not available";
    const { government, city, address } = labInfo;

    // If address is an object, try to extract its fields, else use as string
    let addressStr = "";
    if (typeof address === "string") {
      addressStr = address;
    } else if (typeof address === "object" && address !== null) {
      // Try to extract common fields from address object
      const { street, streat, building, floor } = address;
      addressStr = [
        building,
        floor ? `${floor} Floor` : "",
        street || streat || ""
      ].filter(Boolean).join(", ");
    }

    return [government, city, addressStr]
      .filter((part) => part && part !== "[object Object]")
      .join(", ") || "Location not available";
  };

// Helper function to format work times
const formatWorkTimes = (workTimes) => {
  if (!workTimes) return "Hours not available";

  // Handle string format
  if (typeof workTimes === 'string') {
    try {
      // Try to parse JSON string if possible
      const parsed = JSON.parse(workTimes);
      if (Array.isArray(parsed)) workTimes = parsed;
      else return workTimes;
    } catch {
      return workTimes;
    }
  }

  // Handle array of objects (jsonb[])
  if (Array.isArray(workTimes) && workTimes.length > 0 && typeof workTimes[0] === 'object') {
    return workTimes
      .map(
        (wt) =>
          `${wt.day}: ${wt.start?.slice(0, 5) || wt.start} - ${wt.end?.slice(0, 5) || wt.end} (${wt.duration || "?"} min)`
      )
      .join(", ");
  }

  // Handle array of strings
  if (Array.isArray(workTimes)) {
    return workTimes.join(', ');
  }

  // Handle object with open/close
  if (typeof workTimes === 'object' && workTimes.open && workTimes.close) {
    return `${workTimes.open} - ${workTimes.close}`;
  }

  return "Hours not available";
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
          <p className="text-red-500">{this.state.error?.message || "Unknown error"}</p>
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
      pending: { 
        color: "bg-yellow-100 text-yellow-800", 
        icon: <FaClock /> 
      },
      cancelled: { 
        color: "bg-red-100 text-red-800", 
        icon: <FaTimesCircle /> 
      },
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

  const getPaymentMethod = (method) => {
    const normalizedMethod = (method || '').toLowerCase();
    return (
      <div className="flex items-center gap-2">
        {normalizedMethod.includes('visa') ? (
          <FaCcVisa size={20} className="text-[#1972EE]" />
        ) : (
          <SiCashapp size={20} className="text-[#1972EE]" />
        )}
        <span className="capitalize">{method}</span>
      </div>
    );
  };

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

  const getLocationDisplay = (appointment) => {
    if (appointment.clinic_id) {
      const address = formatClinicAddress(appointment.clinic?.address);
      return (
        <div className="flex items-center gap-2">
          <FaClinicMedical className="text-blue-500" />
          <div className="flex flex-col">
            <span className="font-medium">Clinic</span>
            <span className="text-xs text-gray-500">{address}</span>
          </div>
        </div>
      );
    }
    
    if (appointment.hos_id) {
      return (
        <div className="flex items-center gap-2">
          <FaHospital className="text-red-500" />
          <span className="font-medium">Hospital</span>
        </div>
      );
    }
    
    if (appointment.lab_id) {
      const location = formatLabLocation(appointment.lab_info);
      return (
        <div className="flex items-center gap-2">
          <FaFlask className="text-green-500" />
          <div className="flex flex-col">
            <span className="font-medium">Laboratory</span>
            <span className="text-xs text-gray-500">{location}</span>
          </div>
        </div>
      );
    }
    
    return <span>N/A</span>;
  };

  const getProviderInfo = (appointment) => {
    if (appointment.lab_id) {
      return {
        name: appointment.laboratory?.name || appointment.laboratory?.name_ar || "Unknown Lab",
        subtitle: `${appointment.lab_info?.city || ''}, ${appointment.lab_info?.government || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || "Location not available",
        image: appointment.laboratory?.image || "/default-lab.png",
        rating: appointment.laboratory?.rate,
        ratingCount: appointment.laboratory?.rate_count,
        type: "laboratory",
        extraInfo: appointment.lab_services?.length ? `${appointment.lab_services.length} services selected` : null
      };
    } else {
      return {
        name: `Dr. ${appointment.Doctors?.first_name || ''} ${appointment.Doctors?.last_name || ''}`.trim() || "Unknown Doctor",
        subtitle: appointment.Doctors?.specialty || "Specialty not available",
        image: appointment.Doctors?.image || "/default-avatar.png",
        type: "doctor"
      };
    }
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
        Error: {error?.message || "An error occurred"}
      </div>
    );
  }

  // Mobile Card Component
  const AppointmentCard = ({ appointment }) => {
    const providerInfo = getProviderInfo(appointment);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={providerInfo.image}
              alt={providerInfo.type}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">
                {providerInfo.name}
              </div>
              <div className="text-sm text-[#667198]">
                {providerInfo.subtitle}
              </div>
              {providerInfo.rating && (
                <div className="flex items-center gap-1 text-xs">
                  <FaStar className="text-yellow-500" />
                  <span>{providerInfo.rating}</span>
                  {providerInfo.ratingCount && (
                    <span className="text-gray-500">({providerInfo.ratingCount})</span>
                  )}
                </div>
              )}
              {providerInfo.extraInfo && (
                <div className="text-xs text-blue-600">
                  {providerInfo.extraInfo}
                </div>
              )}
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

          {appointment.lab_id && appointment.lab_info?.work_times && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hours:</span>
              <span className="text-gray-900">{formatWorkTimes(appointment.lab_info.work_times)}</span>
            </div>
          )}
        </div>
        
        <Link
          to={`/appointments/${appointment.id}`}
          className="mt-3 block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          View Details
        </Link>
      </div>
    );
  };

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

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow mb-6 border-2 border-[#1972EE] overflow-hidden">
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
                  {/* Status Filter */}
                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      Status
                    </label>
                    <select
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>

                  {/* Payment Method Filter */}
                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      Payment
                    </label>
                    <select
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.payment_method}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          payment_method: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Payments</option>
                      <option value="Visa">Visa</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      Type
                    </label>
                    <select
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.type}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Types</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-1">
                    <label className="block text-sm text-blue-700 font-medium">
                      Location
                    </label>
                    <select
                      className="w-full p-2.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Locations</option>
                      <option value="clinic">Clinic</option>
                      <option value="hospital">Hospital</option>
                      <option value="laboratory">Laboratory</option>
                    </select>
                  </div>
                  
                  {/* Date Filters */}
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

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#00155D] uppercase">
                    Provider
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
                  appointments.map((appointment) => {
                    const providerInfo = getProviderInfo(appointment);
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link to={`/appointments/${appointment.id}`} className="flex items-center gap-3">
                            <img
                              src={providerInfo.image}
                              alt={providerInfo.type}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {providerInfo.name}
                              </div>
                              <div className="text-sm text-[#667198]">
                                {providerInfo.subtitle}
                              </div>
                              {providerInfo.rating && (
                                <div className="flex items-center gap-1 text-xs">
                                  <FaStar className="text-yellow-500" />
                                  <span>{providerInfo.rating}</span>
                                  {providerInfo.ratingCount && (
                                    <span className="text-gray-500">({providerInfo.ratingCount})</span>
                                  )}
                                </div>
                              )}
                              {providerInfo.extraInfo && (
                                <div className="text-xs text-blue-600">
                                  {providerInfo.extraInfo}
                                </div>
                              )}
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
                    );
                  })
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