import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { format, parseISO, addMinutes } from "date-fns";
import {
  processAppointmentPayment,
  getSupabaseUserId,
} from "../../services/PaymentService";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { auth } from "../../Config/FirebaseConfig";

export default function BookLab() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const currentLang = i18n.language;
  const { lab_id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    payment_method: "cash",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Helper function to get localized content
  const getLocalizedContent = (item, field) => {
    if (!item) return "";
    return currentLang === "ar" && item[`${field}_ar`]
      ? item[`${field}_ar`]
      : item[field];
  };

  // Fetch lab details using TanStack Query
  const {
    data: lab,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lab", lab_id],
    queryFn: async () => {
      if (!lab_id) throw new Error(t("PhoneNumberRequired"));

      const { data: labData, error: labError } = await supabase
        .from("Laboratories")
        .select(
          `
            id,
            description,
            description_ar,
            name_ar,
            name,
            image,
            rate,
            rate_count,
            patients
          `
        )
        .eq("id", lab_id)
        .single();

      if (labError) throw labError;
      if (!labData) throw new Error(t("LabNotFound"));

      const { data: infoData, error: infoError } = await supabase
        .from("LaboratoriesInfo")
        .select("*")
        .eq("id", lab_id)
        .maybeSingle();

      if (infoError) throw infoError;

      return {
        ...labData,
        ...infoData,
        services: infoData?.services || [],
      };
    },
    enabled: !!lab_id,
    retry: false,
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (appointmentData) => {
      const { error } = await supabase
        .from("Appointments")
        .insert([appointmentData]);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      navigate("/appointments");
    },
    onError: (error) => {
      toast.error(`${t("BookingFailed")}: ${error.message}`);
    },
  });

  // Handle service selection
  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Calculate total fee
  const calculateTotalFee = () => {
    if (!lab) return 0;
    return selectedServices.reduce((total, serviceId) => {
      const service = lab.services.find((s) => s.service === serviceId);
      return total + (Number(service?.price) || 0);
    }, 0);
  };

  // Generate time slots based on work times
  const generateTimeSlots = (workTime) => {
    try {
      const startTime = parseISO(`2000-01-01T${workTime.start}`);
      const endTime = parseISO(`2000-01-01T${workTime.end}`);
      const duration = parseInt(workTime.duration) || 30;
      const slots = [];
      let currentTime = startTime;

      while (currentTime < endTime) {
        slots.push(format(currentTime, "HH:mm"));
        currentTime = addMinutes(currentTime, duration);
      }

      return slots;
    } catch (error) {
      console.error(t("TimeSlotGenerationError"), error);
      return [];
    }
  };

  // Update time slots when date changes
  useEffect(() => {
    if (lab?.work_times?.length) {
      const selectedDate = new Date(bookingDetails.date);
      const dayOfWeek = format(selectedDate, "EEEE");

      const workTime = lab.work_times.find(
        (time) => time.day.toLowerCase() === dayOfWeek.toLowerCase()
      );

      if (workTime) {
        const slots = generateTimeSlots(workTime);
        setAvailableTimeSlots(slots);

        if (slots.length > 0 && !bookingDetails.time) {
          setBookingDetails((prev) => ({ ...prev, time: slots[0] }));
        }
      } else {
        setAvailableTimeSlots([]);
        setBookingDetails((prev) => ({ ...prev, time: "" }));
      }
    }
  }, [bookingDetails.date, lab]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Render lab details
  const renderLabDetails = () => {
    if (!lab) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t("Government")}:</span>{" "}
              {lab.government}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t("City")}:</span> {lab.city}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              {t("WorkingHours")}:
            </p>
            {lab.work_times?.map((time, index) => (
              <p key={index} className="text-sm text-gray-600">
                {time.day}: {time.start} - {time.end} ({t("Duration")}:{" "}
                {time.duration} {t("Minutes")})
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {t("Gallery")}:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {lab.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={t("LabImageAlt", { index: index + 1 })}
                className="w-full h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Lab";
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Validation schema
  const PatientSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("NameMin"))
      .max(50, t("NameMax"))
      .required(t("NameRequired")),
    age: Yup.number()
      .min(1, t("AgeMin"))
      .max(120, t("AgeMax"))
      .required(t("AgeRequired")),
    phone: Yup.string()
      .matches(/^[0-9]+$/, t("PhoneNumbersOnly"))
      .min(11, t("PhoneMin"))
      .required(t("PhoneRequired")),
    gender: Yup.string()
      .oneOf(["Male", "Female"], t("GenderInvalid"))
      .required(t("GenderRequired")),
    problem: Yup.string()
      .min(3, t("ProblemMin"))
      .required(t("ProblemRequired")),
  });

  const initialPatientForm = {
    name: "",
    age: "",
    phone: "",
    gender: "",
    problem: "",
  };

  // Update booking mutation
  const handleBookAppointment = async (patientData, { resetForm }) => {
    try {
      if (!lab || selectedServices.length === 0) {
        toast.error(t("SelectService"));
        return;
      }

      if (!bookingDetails.time) {
        toast.error(t("SelectTime"));
        return;
      }

      const totalFee = calculateTotalFee();
      const supabaseUserId = await getSupabaseUserId(currentUser);

      const labServices = selectedServices.map((serviceId) => {
        const service = lab.services.find((s) => s.service === serviceId);
        return {
          service: service.service,
          service_ar: service.service_ar,
          price: service.price,
        };
      });

      const appointmentData = {
        lab_id: lab.id,
        date: bookingDetails.date,
        patient_id: supabaseUserId,
        time: bookingDetails.time,
        fee: totalFee,
        type: "Upcoming",
        lab_services: labServices,
        status:
          bookingDetails.payment_method === "visa"
            ? "pending_payment"
            : "pending",
        payment_method: bookingDetails.payment_method,
        patient: {
          name: patientData.name,
          age: parseInt(patientData.age),
          phone: patientData.phone,
          gender: patientData.gender,
          problem: patientData.problem,
        },
      };

      if (bookingDetails.payment_method === "visa") {
        const { data: appointment, error: insertError } = await supabase
          .from("Appointments")
          .insert(appointmentData)
          .select("id")
          .single();

        if (insertError) {
          console.error(t("InsertError"), insertError);
          throw insertError;
        }

        const paymentResult = await processAppointmentPayment({
          fee: totalFee,
          patientInfo: {
            name: patientData.name,
            email: currentUser.email,
            phone: patientData.phone,
            providerName: getLocalizedContent(lab, "name"),
          },
          appointmentId: appointment.id,
        });

        if (paymentResult.success) {
          const { error: updateError } = await supabase
            .from("Appointments")
            .update({
              status: "pending",
            })
            .eq("id", appointment.id);

          if (updateError) throw updateError;

          window.location.href = paymentResult.iframeUrl;
        } else {
          throw new Error(paymentResult.error);
        }
      } else {
        const { error } = await supabase
          .from("Appointments")
          .insert(appointmentData);

        if (error) throw error;

        resetForm();
        toast.success(t("BookingSuccess"));
      }
    } catch (error) {
      console.error(t("BookingError"), error);
      toast.error(error.message || t("BookingFailedTryAgain"));
    }
  };

  // Render patient form
  const renderPatientForm = () => (
    <Formik
      initialValues={initialPatientForm}
      validationSchema={PatientSchema}
      onSubmit={handleBookAppointment}
    >
      {({ errors, touched, handleSubmit }) => (
        <Form
          id="patient-form"
          onSubmit={handleSubmit}
          className="space-y-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("FullName")}
            </label>
            <Field
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("FullNamePlaceholder")}
            />
            {errors.name && touched.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Age")}
              </label>
              <Field
                name="age"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.age && touched.age && (
                <div className="text-red-500 text-sm mt-1">{errors.age}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Gender")}
              </label>
              <Field
                as="select"
                name="gender"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">{t("SelectGender")}</option>
                <option value="Male">{t("Male")}</option>
                <option value="Female">{t("Female")}</option>
              </Field>
              {errors.gender && touched.gender && (
                <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("PhoneNumber")}
            </label>
            <Field
              name="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("PhonePlaceholder")}
            />
            {errors.phone && touched.phone && (
              <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("ProblemDescription")}
            </label>
            <Field
              as="textarea"
              name="problem"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("ProblemPlaceholder")}
            />
            {errors.problem && touched.problem && (
              <div className="text-red-500 text-sm mt-1">{errors.problem}</div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );

  // Render time slots as buttons
  const renderTimeSlots = () => {
    if (availableTimeSlots.length === 0) {
      return <p className="text-red-500 text-sm py-4">{t("NoTimeSlots")}</p>;
    }

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-2">
        {availableTimeSlots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => setBookingDetails((prev) => ({ ...prev, time }))}
            className={`p-2 text-sm rounded-lg border transition-colors ${
              bookingDetails.time === time
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50"
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
          <div
            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
              selectedServices.includes(service.service)
                ? "bg-indigo-500 border-indigo-500"
                : "border-gray-300"
            }`}
          >
            {selectedServices.includes(service.service) && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">
              {getLocalizedContent(service, "service")}
            </div>
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
          const service = lab.services.find((s) => s.service === serviceId);
          return (
            <li key={index} className="flex justify-between">
              <span className="text-gray-700">
                {getLocalizedContent(service, "service")}
              </span>
              <span className="font-medium">${service?.price}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  // Payment section
  const renderPaymentSection = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("PaymentMethod")}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() =>
            setBookingDetails((prev) => ({ ...prev, payment_method: "cash" }))
          }
          className={`p-4 border rounded-lg flex items-center justify-center ${
            bookingDetails.payment_method === "cash"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-300 hover:border-indigo-300"
          }`}
        >
          <svg
            className={`w-6 h-6 ${isRTL ? "ml-2" : "mr-2"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {t("CashPayment")}
        </button>
        <button
          type="button"
          onClick={() =>
            setBookingDetails((prev) => ({ ...prev, payment_method: "visa" }))
          }
          className={`p-4 border rounded-lg flex items-center justify-center ${
            bookingDetails.payment_method === "visa"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-300 hover:border-indigo-300"
          }`}
        >
          <svg
            className={`w-6 h-6 ${isRTL ? "ml-2" : "mr-2"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          {t("VisaPayment")}
        </button>
      </div>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !lab) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-semibold mt-4">{t("LabNotFound")}</h2>
        <p className="text-gray-600 mt-2 text-center">{t("LabNotFoundDesc")}</p>
        <button
          onClick={() => navigate("/labs")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {t("BrowseLabs")}
        </button>
      </div>
    );
  }

  const localizedLabName = getLocalizedContent(lab, "name");
  const localizedLabDescription = getLocalizedContent(lab, "description");

  return (
    <>
      <MetaData
        title={t("BookLabMetaTitle", { labName: localizedLabName })}
        description={t("BookLabMetaDescription")}
        keywords={t("BookLabMetaKeywords")}
        author="Mohab Mohammed"
      />
      <div
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <svg
                className={`w-5 h-5 ${isRTL ? "ml-1" : "mr-1"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isRTL
                      ? "M14 5l7 7m0 0l-7 7m7-7H3"
                      : "M10 19l-7-7m0 0l7-7m-7 7h18"
                  }
                />
              </svg>
              {t("BackToLabs")}
            </button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {t("BookYourTestAt", { labName: localizedLabName })}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("BookLabDescription")}
            </p>
          </div>

          {/* Lab Information */}
          <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative w-50 h-50">
                    <img
                      src={lab.image}
                      alt={localizedLabName}
                      className="absolute inset-0 w-full h-full rounded-xl object-cover shadow-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300?text=Lab";
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {localizedLabName}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(lab.rate)
                              ? "fill-current"
                              : "fill-none stroke-current"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">
                      ({lab.rate_count} {t("Reviews")})
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700">
                      {t("About")}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {localizedLabDescription}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {lab.patients}+ {t("Patients")}
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {t("AccreditedLab")}
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {t("FastResults")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t("BookYourTest")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                  <h3 className="text-sm font-medium text-yellow-800">
                    {t("AvailableDays")}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {lab?.work_times?.length > 0 ? (
                      lab.work_times.map((time, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
                        >
                          {time.day}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {t("NoAvailableDays")}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("AppointmentDate")}
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
                    {t("AppointmentTime")}
                  </label>
                  {renderTimeSlots()}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("PatientInformation")}
                </h3>
                {renderPatientForm()}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("SelectServices")}
                </h3>
                {lab?.services?.length > 0 ? (
                  renderServices()
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {t("NoServicesAvailable")}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">
                    {t("SelectedServices")}
                  </h4>
                </div>

                {selectedServices.length > 0 ? (
                  renderSelectedServices()
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {t("NoServicesSelected")}
                  </p>
                )}
              </div>

              {/* Payment Method section */}
              {renderPaymentSection()}

              <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm text-gray-600">{t("TotalFee")}</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${calculateTotalFee()}
                  </p>
                </div>
                <button
                  type="submit"
                  form="patient-form"
                  className={`px-6 py-3 rounded-lg font-medium text-white ${
                    bookingMutation.isPending || selectedServices.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transition-colors`}
                  disabled={
                    bookingMutation.isPending || selectedServices.length === 0
                  }
                  onClick={() => {
                    if (selectedServices.length === 0) {
                      toast.error(t("SelectService"));
                      return;
                    }
                    if (!bookingDetails.time) {
                      toast.error(t("SelectTime"));
                      return;
                    }
                    document
                      .getElementById("patient-form")
                      .dispatchEvent(
                        new Event("submit", { cancelable: true, bubbles: true })
                      );
                  }}
                >
                  {bookingMutation.isPending ? (
                    <div className="flex justify-center items-center">
                      <TailSpin
                        color="#fff"
                        width="24"
                        height="24"
                        aria-label={t("Loading")}
                        role="status"
                      />
                    </div>
                  ) : (
                    t("ConfirmBooking")
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Lab Details */}
          <div className="bg-white rounded-xl shadow overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t("LabDetails")}
              </h2>
              {renderLabDetails()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
