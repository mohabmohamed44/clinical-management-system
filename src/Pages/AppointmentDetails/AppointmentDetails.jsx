import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { supabase } from "../../Config/Supabase";
import MetaData from "../../Components/MetaData/MetaData";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStethoscope,
  FaFlask,
} from "react-icons/fa";

// Fetch appointment with Doctor details and Lab details separately
const fetchAppointment = async (appointmentId) => {
  // First, get the appointment data
  const { data: appointment, error: appointmentError } = await supabase
    .from("Appointments")
    .select(
      `
      *,
      Doctors (
        id,
        first_name,
        last_name,
        specialty,
        image
      ),
      Users (
        first_name,
        last_name,
        email,
        gender
      ),
      clinic:Clinics (
        id,
        address
      )
    `
    )
    .eq("id", appointmentId)
    .single();

  if (appointmentError) throw appointmentError;

  // If there's a lab_id, fetch lab data separately
  let labData = null;
  let labInfoData = null;
  
  if (appointment.lab_id) {
    // Fetch lab data
    const { data: lab, error: labError } = await supabase
      .from("Laboratories")
      .select("id, name, image, rate, services")
      .eq("id", appointment.lab_id)
      .single();
    
    if (labError) {
      console.warn("Could not fetch lab data:", labError);
    } else {
      labData = lab;
    }

    // Fetch lab info data (fix: use id instead of lab_id)
    const { data: labInfo, error: labInfoError } = await supabase
      .from("LaboratoriesInfo")
      .select("government, city, address, work_times, services")
      .eq("id", appointment.lab_id)
      .single();
    
    if (labInfoError) {
      console.warn("Could not fetch lab info data:", labInfoError);
    } else {
      labInfoData = labInfo;
    }
  }

  // Combine the data
  return {
    ...appointment,
    lab: labData,
    lab_info: labInfoData
  };
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
    onError: (err) =>
      toast.error(`Failed to load appointment: ${err.message}`),
  });

  // Modal states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Status config
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

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not specified";
    const datetime = new Date(`${date}T${time}`);
    return datetime.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Get location display
  const getLocationDisplay = () => {
    if (appointment.clinic_id) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">Clinic</span>
          <span className="text-sm text-gray-600">
            {formatClinicAddress(appointment.clinic?.address)}
          </span>
        </div>
      );
    }

    if (appointment.lab_id) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">Lab</span>
          <span className="text-sm text-gray-600">
            {formatLabLocation(appointment.lab_info)}
          </span>
        </div>
      );
    }

    return <span className="text-gray-800">Location not specified</span>;
  };

  // Fetch available slots (clinic or lab)
  const fetchAvailableSlots = async (date) => {
    try {
      setLoadingSlots(true);
      let workTimes = [];

      if (appointment.clinic_id) {
        const { data: clinicData, error: clinicError } = await supabase
          .from("Clinics")
          .select("work_times")
          .eq("id", appointment.clinic_id)
          .single();
        if (clinicError) throw clinicError;
        workTimes = clinicData?.work_times || [];
      }

      if (appointment.lab_id) {
        const { data: labData, error: labError } = await supabase
          .from("LaboratoriesInfo")
          .select("work_times")
          .eq("lab_id", appointment.lab_id)
          .single();
        if (labError) throw labError;
        workTimes = labData?.work_times || [];
      }

      if (!workTimes.length) {
        toast.error("Schedule not found");
        return;
      }

      const selectedDay = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });

      const daySchedule = workTimes.find(
        (schedule) => schedule.day === selectedDay
      );
      if (!daySchedule) {
        toast.error("No schedule available for selected day");
        return;
      }

      const { data: bookedSlots, error: bookedError } = await supabase
        .from("Appointments")
        .select("time")
        .eq(appointment.clinic_id ? "clinic_id" : "lab_id", appointment.clinic_id || appointment.lab_id)
        .eq("date", date)
        .neq("status", "cancelled");

      if (bookedError) throw bookedError;

      const slots = [];
      let currentTime = daySchedule.start.slice(0, 5);
      const endTime = daySchedule.end.slice(0, 5);

      while (currentTime <= endTime) {
        const isBooked = bookedSlots?.some((slot) => slot.time === currentTime);
        if (!isBooked) {
          slots.push({
            time: currentTime,
            formatted: new Date(`2000-01-01T${currentTime}`).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }

        const [hours, minutes] = currentTime.split(":");
        const dateObj = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
        dateObj.setMinutes(dateObj.getMinutes() + parseInt(daySchedule.duration));
        currentTime = dateObj.toTimeString().slice(0, 5);
      }

      setAvailableSlots(slots);
    } catch (error) {
      toast.error("Failed to load available slots");
      console.error(error);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle cancellation
  const handleCancellation = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("Appointments")
        .update({
          status: "Cancelled",
          problem_reason: cancelReason,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Appointment cancelled successfully");
      setIsCancelModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(`Failed to cancel appointment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rescheduling
  const handleReschedule = async () => {
    if (!selectedSlot || !newDate) return;
    try {
      setIsRescheduling(true);
      const { error } = await supabase
        .from("Appointments")
        .update({
          date: newDate,
          time: selectedSlot.time,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Appointment rescheduled successfully");
      setIsRescheduleModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(`Failed to reschedule appointment: ${error.message}`);
    } finally {
      setIsRescheduling(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
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

  // Status logic after data is confirmed
  const status = appointment.status?.toLowerCase() || "pending";
  const statusStyle = statusConfig[status] || statusConfig.pending;

  return (
    <div className="p-4 md:p-8">
      <MetaData title="Appointment Details | HealthCare" />
      <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        {/* Status Banner */}
        <div
          className={`${statusStyle.color} text-white px-4 py-2 text-sm font-medium flex items-center justify-between`}
        >
          <div className="flex items-center">
            {statusStyle.icon}
            <span className="capitalize">{status} Appointment</span>
          </div>
          <span className="text-sm">
            {formatDateTime(appointment.date, appointment.time)}
          </span>
        </div>

        {/* Main Content */}
        <div className="p-5">
          {/* Doctor or Lab Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {appointment.doctor_id ? "Doctor" : "Lab"} Information
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {appointment.doctor_id && (
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
              )}

              {appointment.lab_id && (
                <div className="flex items-center">
                  <img
                    src={appointment.lab?.image || "/default-lab.png"}
                    alt={appointment.lab?.name || "Lab"}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.lab?.name || "Lab Name Not Available"}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <FaFlask className="mr-1" />
                      Laboratory Services
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {formatLabLocation(appointment.lab_info)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lab Services */}
          {appointment.lab_id && appointment.lab_services && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 mt-4">
              <h3 className="font-medium text-gray-800 mb-2">Requested Lab Services</h3>
              <div className="space-y-2">
                {Array.isArray(appointment.lab_services) ? (
                  appointment.lab_services.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white rounded p-2">
                      <div>
                        <span className="font-medium text-gray-800">
                          {typeof service === 'object' ? service.service : service}
                        </span>
                        {typeof service === 'object' && service.service_ar && (
                          <div className="text-sm text-gray-600">{service.service_ar}</div>
                        )}
                      </div>
                      {typeof service === 'object' && service.price && (
                        <span className="text-blue-600 font-medium">
                          ${service.price}
                        </span>
                      )}
                    </div>
                  ))
                ):( typeof appointment.lab_services === 'object' ? (
                  <div className="flex justify-between items-center bg-white rounded p-2">
                    <div>
                      <span className="font-medium text-gray-800">
                        {appointment.lab_services.service}
                      </span>
                      {appointment.lab_services.service_ar && (
                        <div className="text-sm text-gray-600">{appointment.lab_services.service_ar}</div>
                      )}
                    </div>
                    {appointment.lab_services.price && (
                      <span className="text-blue-600 font-medium">
                        ${appointment.lab_services.price}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-800">{appointment.lab_services}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    {formatDateTime(appointment.date, appointment.time)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Location</span>
                  {getLocationDisplay()}
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

          {/* Patient Data */}
          {appointment.patient ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-[#005] mb-3">
                Patient Information
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {appointment.patient?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">
                    {appointment.patient?.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {appointment.patient?.phone || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium text-gray-800">
                    {appointment.patient?.problem || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-[#005] mb-3">
                Patient Information
              </h2>
              <p className="text-gray-500">No patient information available</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {status !== 'cancelled' && status !== 'completed' && (
          <div className="flex border-t border-gray-200">
            <button
              onClick={() => setIsRescheduleModalOpen(true)}
              className="flex-1 py-3 text-blue-600 font-medium hover:bg-blue-50 transition duration-150"
            >
              Reschedule
            </button>
            <div className="w-px bg-gray-200"></div>
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="flex-1 py-3 text-red-600 font-medium hover:bg-red-50 transition duration-150"
            >
              Cancel Appointment
            </button>
          </div>
        )}

        {/* Cancellation Modal */}
        <Dialog
          open={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Cancel Appointment
              </Dialog.Title>
              <div className="mb-4">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Cancellation
                </label>
                <textarea
                  id="reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                  onClick={handleCancellation}
                  disabled={isSubmitting || !cancelReason.trim()}
                >
                  {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Reschedule Modal */}
        <Dialog
          open={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Reschedule Appointment
              </Dialog.Title>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select New Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      setSelectedSlot(null);
                      fetchAvailableSlots(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {newDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Available Time Slot
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-4">Loading available slots...</div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2 text-sm rounded-md transition-colors ${
                              selectedSlot?.time === slot.time
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                          >
                            {slot.formatted}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No available slots for this date
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setIsRescheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleReschedule}
                  disabled={isRescheduling || !newDate || !selectedSlot}
                >
                  {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}