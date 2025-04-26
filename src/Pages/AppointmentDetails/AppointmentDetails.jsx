import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { useParams } from "react-router-dom";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStethoscope,
} from "react-icons/fa";

const fetchAppointment = async (appointmentId) => {
  try {
    // Query the Appointments table
    const { data, error } = await supabase
      .from("Appointments")
      .select(
        `
        *,
        Doctors(id, first_name, last_name, specialty, image, specialty),
        Users(first_name, last_name, email, gender)
        `
      )
      .eq("id", appointmentId)
      .single();
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

export default function AppointmentDetails() {
  const { id } = useParams();
  const {
    data: appointment,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => fetchAppointment(id),
    onError: (err) => {
      toast.error(`Failed to load appointment: ${err.message}`);
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl p-5">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex gap-4 mb-5">
            <div className="bg-gray-200 rounded-full h-14 w-14"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl p-6 text-center">
        <div className="text-red-500 mb-3">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Appointment
        </h3>
        <p className="text-gray-600 mb-4">
          {error?.message || "Unable to load appointment details"}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No data state
  if (!appointment) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl p-5 text-center">
        <p className="text-gray-500">No appointment found</p>
      </div>
    );
  }

  // Status configuration
  const statusConfig = {
    confirmed: {
      color: "bg-[#00155D]",
      icon: <FaCheckCircle className="mr-1" />,
    },
    pending: {
      color: "bg-yellow-500",
      icon: <FaClock className="mr-1" />,
    },
    cancelled: {
      color: "bg-red-500",
      icon: <FaTimesCircle className="mr-1" />,
    },
    completed: {
      color: "bg-green-500",
      icon: <FaCheckCircle className="mr-1" />,
    },
  };

  const status = appointment.status?.toLowerCase() || "pending";
  const statusStyle = statusConfig[status] || statusConfig.pending;

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get location display
  const getLocationDisplay = () => {
    if (appointment.clinic_id) return `Clinic #${appointment.clinic_id}`;
    if (appointment.hos_id) return `Hospital #${appointment.hos_id}`;
    return "Not specified";
  };

  return (
    <>
      <MetaData
        title={`Appointment Details - ${appointment.id}`}
        name="Appointment Details"
        description={`Appointment with Dr. ${appointment.Doctors?.first_name} ${appointment.Doctors?.last_name}`}
      />

      <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        {/* Status Banner */}
        <div
          className={`${statusStyle.color} text-white px-4 py-2 text-sm font-medium flex items-center justify-between`}
        >
          <div className="flex items-center">
            {statusStyle.icon}
            <span className="capitalize">{status} Appointment</span>
          </div>
          <span className="text-sm">{formatDateTime(appointment.date)}</span>
        </div>

        {/* Main Content */}
        <div className="p-5">
          {/* Doctor Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Doctor Information
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <img
                  src={appointment.Doctors?.image || "/default-avatar.png"}
                  alt={`Dr. ${appointment.Doctors?.first_name} ${appointment.Doctors?.last_name}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Dr. {appointment.Doctors?.first_name}{" "}
                    {appointment.Doctors?.last_name}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <FaStethoscope className="mr-1" />
                    {appointment.Doctors?.specialty ||
                      "Specialty not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Appointment Details */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#00155D] mb-3">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-800">
                    {formatDateTime(appointment.date)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <FaMapMarkerAlt className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">
                    {getLocationDisplay()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <FaMoneyBillWave className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {appointment.payment_method || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Appointment Type</p>
                <p className="font-medium text-gray-800 capitalize">
                  {appointment.type || "Not specified"}
                </p>
              </div>
            </div>
          </div>
          {/* Notes Section */}
          {appointment.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <h3 className="font-medium text-gray-800 mb-1">Notes</h3>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          )}
          {/* Update the Patient Data section in the JSX */}
          {appointment.patient ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-[#005] mb-3">
                Patient Information
              </h2>
              <p className="text-lg text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                {appointment.patient?.name || "Not specified"}
              </p>
              <p className="text-lg text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">
                {appointment.patient?.gender || "Not specified"}
              </p>
              <p className="text-lg text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">
                {appointment.patient?.phone || "Not specified"}
              </p>
              <p className="text-lg text-gray-500">Reason</p>
              <p className="font-medium text-gray-800">
                {appointment.patient?.problem || "Not specified"}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-[#005] mb-3">
                There is no Patient Information
              </h2>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex border-t border-gray-200">
          <button className="flex-1 py-3 text-blue-600 font-medium hover:bg-blue-100 transition duration-150">
            Reschedule
          </button>
          <div className="w-px bg-gray-200"></div>
          <button className="flex-1 py-3 text-red-600 font-medium hover:bg-red-100 transition duration-150 ">
            Cancel Appointment
          </button>
        </div>
      </div>
    </>
  );
}
