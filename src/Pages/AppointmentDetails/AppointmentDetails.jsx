import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { useParams } from "react-router-dom";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
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
    const { data, error } = await supabase
      .from("Appointments")
      .select(`
        *,
        Doctors(id, first_name, last_name, specialty, image),
        Users(first_name, last_name, email, gender),
        clinic:Clinics(id, address)
      `)
      .eq("id", appointmentId)
      .single();
    if (error) throw error;
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

  const [isOpen, setIsOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const handleCancellation = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("Appointments")
        .update({
          status: "cancelled",
          problem_reason: cancelReason
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Appointment cancelled successfully");
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error(`Failed to cancel appointment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to fetch available slots
  const fetchAvailableSlots = async (date) => {
    try {
      setLoadingSlots(true);
      
      // Get clinic work times
      const { data: clinicData, error: clinicError } = await supabase
        .from('Clinics')
        .select('work_times')
        .eq('id', appointment.clinic_id)
        .single();

      if (clinicError) throw clinicError;

      if (!clinicData?.work_times?.length) {
        toast.error('Clinic schedule not found');
        return;
      }

      // Get the day of week for the selected date
      const selectedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find the schedule for the selected day
      const daySchedule = clinicData.work_times.find(
        schedule => schedule.day === selectedDay
      );

      if (!daySchedule) {
        toast.error('No schedule available for selected day');
        return;
      }

      // Get booked slots for the selected date
      const { data: bookedSlots, error: bookedError } = await supabase
        .from('Appointments')
        .select('time')
        .eq('doctor_id', appointment.doctor_id)
        .eq('date', date)
        .neq('status', 'cancelled');

      if (bookedError) throw bookedError;

      // Generate available slots based on clinic's schedule
      const slots = [];
      let currentTime = daySchedule.start.slice(0, 5); // Remove seconds
      const endTime = daySchedule.end.slice(0, 5);
      
      while (currentTime <= endTime) {
        const isBooked = bookedSlots?.some(slot => slot.time === currentTime);
        if (!isBooked) {
          slots.push({
            time: currentTime,
            formatted: new Date(`2000-01-01T${currentTime}`).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        }
        // Add duration minutes
        const [hours, minutes] = currentTime.split(':');
        const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
        date.setMinutes(date.getMinutes() + parseInt(daySchedule.duration));
        currentTime = date.toTimeString().slice(0, 5);
      }

      setAvailableSlots(slots);
    } catch (error) {
      toast.error('Failed to load available slots');
      console.error(error);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Modify handleReschedule function
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
      setIsRescheduleOpen(false);
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
    return `${building || ''}, ${floor ? `${floor} Floor` : ''}, ${streat || ''}`.replace(/^[,\s]+|[,\s]+$/g, '');
  };

  // Get location display with address
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
    return <span className="text-gray-800">Location not specified</span>;
  };

  return (
    <div className="p-4 md:p-8">
      <MetaData
        title="Appointment Details | HealthCare"
        description="View your appointment details"
        name="Appointment Details"
        type="website"
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
          <span className="text-sm">{formatDateTime(appointment.date, appointment.time)}</span>
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
          <button 
            onClick={() => setIsRescheduleOpen(true)}
            className="flex-1 py-3 text-blue-600 font-medium hover:bg-blue-100 transition duration-150"
          >
            Reschedule
          </button>
          <div className="w-px bg-gray-200"></div>
          <button 
            onClick={() => setIsOpen(true)}
            className="flex-1 py-3 text-red-600 font-medium hover:bg-red-100 transition duration-150"
          >
            Cancel Appointment
          </button>
        </div>

        {/* Cancellation Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Cancel Appointment
              </Dialog.Title>

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
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
                  onClick={() => setIsOpen(false)}
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
          open={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
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
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
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
                    min={new Date().toISOString().split('T')[0]}
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
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
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
                  onClick={() => setIsRescheduleOpen(false)}
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
