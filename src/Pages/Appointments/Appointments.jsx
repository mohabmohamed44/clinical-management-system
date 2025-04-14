// AppointmentsPage.jsx
import { useState } from "react";
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
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";

const fetchAppointments = async (filters) => {
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
      patient,
      Doctors (
        id,
        first_name,
        last_name,
        specialty,
        image
      )
    `
    )
    .order("date", { ascending: false });

  // Apply filters
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.payment_method)
    query = query.eq("payment_method", filters.payment_method);
  if (filters.type) query = query.eq("type", filters.type);

  // Location filter
  if (filters.location === "clinic") {
    query = query.not("clinic_id", "is", null);
  } else if (filters.location === "hospital") {
    query = query.not("hos_id", "is", null);
  }

  // Date filter fix
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

export default function AppointmentsPage() {
  const [filters, setFilters] = useState({
    status: "",
    payment_method: "",
    type: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const {
    data: appointments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => fetchAppointments(filters),
    staleTime: 5 * 60 * 1000,
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: "",
      payment_method: "",
      type: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    toast.success("Reset Done!");
  };

  // Status badge component
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

  // Payment method component
  const getPaymentMethod = (method) => (
    <div className="flex items-center gap-2 ">
      {method === "Visa" ? (
        <FaCcVisa size={24} className="text-[#1972EE]" />
      ) : (
        <SiCashapp size={24} className="text-[#1972EE]" />
      )}
      <span className="capitalize">{method}</span>
    </div>
  );

  // Date formatting
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get location display text
  const getLocationDisplay = (appointment) => {
    if (appointment.clinic_id) return `Clinic #${appointment.clinic_id}`;
    if (appointment.hos_id) return `Hospital #${appointment.hos_id}`;
    return "N/A";
  };

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA width={90} height={90} ariaLabel="loading" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <MetaData
        title={"Appointments | HealthCare"}
        description={"Appointments management page"}
        name={"Appointments"}
        type="website"
        url={window.location.href}
      />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Appointments
          </h1>

          {/* Filter Section - Updated with shorter inputs */}
          <div className="bg-white p-6 rounded-lg shadow mb-8 border-2 border-[#1972EE]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-[#00155D]" />
                <h2 className="text-lg font-semibold text-[#00155D]">
                  Filter Appointments
                </h2>
              </div>
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs text-blue-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Statuses</option>
                  {["Completed", "Pending", "Cancelled", "Confirmed"].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs text-blue-700 mb-1">
                  Payment
                </label>
                <select
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.payment_method}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      payment_method: e.target.value,
                    }))
                  }
                >
                  <option value="">All Payments</option>
                  {["Visa", "Cash"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-blue-700 mb-1">Type</label>
                <select
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="">All Types</option>
                  {["Completed", "Upcoming"].map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-blue-700 mb-1">
                  Location
                </label>
                <select
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                </select>
              </div>

              <div>
                <label className="block text-xs text-blue-700 mb-1">From</label>
                <input
                  type="date"
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-blue-700 mb-1">To</label>
                <input
                  type="date"
                  className="w-full py-1 px-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-md font-medium text-[#00155D] capitalize">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments?.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={appointment.Doctors?.image || "/default-avatar.png"}
                            alt="Doctor"
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {appointment.Doctors?.first_name}{" "}
                              {appointment.Doctors?.last_name}
                            </div>
                            <div className="text-sm text-[#667198]">
                              {appointment.Doctors.specialty}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#667198]">
                        {formatDate(appointment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentMethod(appointment.payment_method)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#667198] capitalize">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#667198]">
                        {getLocationDisplay(appointment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FaUser className="w-8 h-8 text-gray-400" />
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
                      <td className="px-6 py-4 text-sm text-[#667198] max-w-xs">
                        <div className="truncate hover:text-clip hover:overflow-visible">
                          {appointment.patient?.problem || "No Reason Provided"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-[#667198]">
                      No appointments found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}