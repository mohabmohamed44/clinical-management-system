import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { supabase } from "../../Config/Supabase";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { format, parseISO, isBefore, startOfDay, isToday } from "date-fns";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18next from "i18next";

// Paymob Configuration
const PAYMOB_CONFIG = {
  API_KEY: import.meta.env.VITE_PAYMOB_API_KEY, 
  INTEGRATION_ID: import.meta.env.VITE_PAYMOB_INTEGRATION_ID, 
  IFRAME_ID: import.meta.env.VITE_PAYMOB_IFRAME_ID, 
  BASE_URL: "https://accept.paymobsolutions.com/api", 
  IS_TEST_MODE: true
};

const Book = () => {
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState(null);
  const [paymentToken, setPaymentToken] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const isArabic = i18next.language === "ar";

  const steps = [
    t("PatientInfo"),
    t("TimeSelection"),
    t("Payment")
  ];

  // Create validation schemas with translated messages
  const validationSchema = [
    Yup.object().shape({
      patient: Yup.object().shape({
        name: Yup.string().required(t("NameRequired")),
        age: Yup.number()
          .required(t("AgeRequired"))
          .positive()
          .max(120),
        phone: Yup.string()
          .required(t("PhoneRequired"))
          .matches(/^01[0125][0-9]{8}$/, t("PhoneNumbersOnly")),
        gender: Yup.string().required(t("GenderRequired")),
        problem: Yup.string().required(t("ProblemRequired")),
      }),
    }),
    Yup.object().shape({
      date: Yup.date()
        .required(t("DateRequired"))
        .min(startOfDay(new Date()), t("InvalidDate")),
      time: Yup.string().required(t("TimeRequired")),
    }),
    Yup.object().shape({
      payment_method: Yup.string().required(t("PaymentMethodRequired")),
    }),
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      try {
        await fetchProvider();
      } catch (error) {
        setCriticalError(error);
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      const { data: doctorData, error: doctorError } = await supabase
        .from("Doctors")
        .select(`
          *,
          clinic:Clinics(*, doctor_id),
          hospitals:HospitalsDoctors(
            doc_id,
            hospital:HospitalsInfo(*)
          )
        `)
        .eq("id", id)
        .single();

      if (doctorError || !doctorData) {
        throw new Error(doctorError?.message || t("DoctorNotFound"));
      }

      const primaryHospital = doctorData.hospitals?.length > 0 ? 
        doctorData.hospitals[0].hospital : null;

      const workTimes = doctorData.clinic?.work_times || 
                       primaryHospital?.work_times || 
                       doctorData.work_times;

      const parsedWorkTimes = typeof workTimes === 'string' ? 
        JSON.parse(workTimes) : 
        Array.isArray(workTimes) ? workTimes : [];

      setProvider({
        ...doctorData,
        work_times: parsedWorkTimes,
        clinic_id: doctorData.clinic?.id,
        hos_id: primaryHospital?.id,
        fee: doctorData.fee || 500,
      });

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
      navigate("/find_doctor");
    } finally {
      setLoading(false);
    }
  };

  const getSupabaseUserId = async (firebaseUser) => {
    try {
      // Check for existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from("Users")
        .select("id")
        .eq("uid", firebaseUser.uid)
        .single();

      if (existingUser) return existingUser.id;

      // Create new user if not exists
      const { data: newUser, error: createError } = await supabase
        .from("Users")
        .insert([{
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || t("Patient"),
          phone: firebaseUser.phoneNumber || "",
          role: "patient"
        }])
        .select("id")
        .single();

      if (createError) throw createError;
      return newUser.id;

    } catch (error) {
      console.error("User error:", error);
      toast.error(t("UserAccountError"));
      throw error;
    }
  };

  const generateTimeSlots = async (selectedDate) => {
    if (!provider || !selectedDate) return [];

    try {
      const selectedDay = format(parseISO(selectedDate), "EEEE");
      const workDay = provider.work_times?.find(w => w.day === selectedDay);

      if (!workDay) return [];

      let slots = [];
      try {
        const [startHour, startMinute] = workDay.start.split(":").map(Number);
        const [endHour, endMinute] = workDay.end.split(":").map(Number);
        const duration = parseInt(workDay.duration) || 30;

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        for (let minutes = startTotal; minutes + duration <= endTotal; minutes += duration) {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          const time24 = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
          
          // Create date string in correct format
          const timeString = `${selectedDate}T${time24}:00`;
          const slotDate = parseISO(timeString);

          if (isToday(parseISO(selectedDate))) {
            const now = new Date();
            if (isBefore(slotDate, now)) continue;
          }

          slots.push({
            time24,
            isoTime: timeString,
            display: format(slotDate, "hh:mm a"),
            available: true
          });
        }
      } catch (timeError) {
        console.error("Time parsing error:", timeError);
        return [];
      }

      let orConditions = [];
      if (provider.clinic_id) orConditions.push(`clinic_id.eq.${provider.clinic_id}`);
      if (provider.hos_id) orConditions.push(`hos_id.eq.${provider.hos_id}`);
      
      const { data: existing } = await supabase
        .from("Appointments")
        .select("time")
        .eq("doctor_id", id)
        .eq("date", selectedDate)
        .or(orConditions.join(','));

      const bookedTimes = new Set(existing?.map(a => 
        format(parseISO(a.time), "HH:mm")));

      return slots.map(slot => ({
        ...slot,
        available: !bookedTimes.has(slot.time24)
      }));

    } catch (error) {
      console.error("Slot generation error:", error);
      toast.error(t("TimeSlotGenerationError"));
      return [];
    }
  };

  // Paymob Payment Integration Steps
  const authenticatePaymob = async () => {
    try {
      if (!PAYMOB_CONFIG.API_KEY) {
        throw new Error(t("PaymobConfigError"));
      }

      const { data } = await axios.post(
        `${PAYMOB_CONFIG.BASE_URL}/auth/tokens`, 
        {
          api_key: PAYMOB_CONFIG.API_KEY
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!data || !data.token) {
        throw new Error(t("InvalidPaymentResponse"));
      }

      return data.token;
    } catch (error) {
      console.error("Paymob authentication error details:", {
        message: error.message,
        response: error.response?.data
      });
      throw new Error(error.response?.data?.message || t("PaymentAuthError"));
    }
  };
  
  const registerOrder = async (authToken, amount) => {
    try {
      const { data } = await axios.post(`${PAYMOB_CONFIG.BASE_URL}/ecommerce/orders`, {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: "EGP",
        items: [] 
      });
      return data.id;
    } catch (error) {
      console.error("Paymob order registration error:", error);
      throw new Error(t("OrderRegistrationError"));
    }
  };
  
  const getPaymentKey = async (authToken, orderId, amount, billingData) => {
    try {
      const { data } = await axios.post(`${PAYMOB_CONFIG.BASE_URL}/acceptance/payment_keys`, {
        auth_token: authToken,
        order_id: orderId,
        amount_cents: amount,
        currency: "EGP",
        integration_id: PAYMOB_CONFIG.INTEGRATION_ID,
        billing_data: billingData
      });
      return data.token;
    } catch (error) {
      console.error("Paymob payment key error:", error);
      throw new Error(t("PaymentInitiationError"));
    }
  };
  
  const processCardPayment = async (values, appointmentId) => {
    try {
      setLoading(true);
      
      if (!PAYMOB_CONFIG.API_KEY || !PAYMOB_CONFIG.INTEGRATION_ID) {
        throw new Error(t("PaymobConfigError"));
      }

      const authToken = await authenticatePaymob();
      if (!authToken) throw new Error(t("PaymentAuthTokenError"));

      const orderId = await registerOrder(authToken, provider.fee);
      
      const billingData = {
        first_name: values.patient.name.split(' ')[0] || t("Patient"),
        last_name: values.patient.name.split(' ').slice(1).join(' ') || t("User"),
        email: currentUser.email,
        phone_number: values.patient.phone,
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Cairo",
        country: "Egypt",
        state: "NA"
      };
      
      const paymentToken = await getPaymentKey(authToken, orderId, provider.fee * 100, billingData);

      await supabase
        .from("Appointments")
        .update({
          payment_reference: orderId,
          payment_token: paymentToken
        })
        .eq("id", appointmentId);
      
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_CONFIG.IFRAME_ID}?payment_token=${paymentToken}`;
      const paymentWindow = window.open(iframeUrl);
      
      if (paymentWindow) {
        setTimeout(() => {
          navigate('/appointments');
        }, 1000);
      } else {
        toast.error(t("PopupBlockedError"));
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      await supabase
        .from("Appointments")
        .update({ 
          status: "failed"
        })
        .eq("id", appointmentId);
      
      toast.error(t("PaymentProcessingError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!provider || !currentUser) {
      toast.error(t("SessionExpired"));
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const supabaseUserId = await getSupabaseUserId(currentUser);
      
      const appointmentData = {
        type: "Upcoming",
        status: "pending",
        doctor_id: id,
        clinic_id: provider.clinic_id || null,
        hos_id: provider.hos_id || null,
        patient_id: supabaseUserId,
        time: values.time + ':00',
        date: values.date,
        fee: provider.fee,
        lab_id: null,
        lab_services: null,
        payment_method: values.payment_method,
        patient: {
          name: values.patient.name,
          age: values.patient.age,
          gender: values.patient.gender,
          phone: values.patient.phone,
          problem: values.patient.problem
        }
      };

      const { data: newAppointment, error: appointmentError } = await supabase
        .from("Appointments")
        .insert([appointmentData])
        .select("id")
        .single();

      if (appointmentError) throw appointmentError;

      if (values.payment_method === "cash") {
        handlePaymentSuccess("cash");
      } else {
        await processCardPayment(values, newAppointment.id);
      }

    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || t("BookingFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (method) => {
    toast.success(method === "cash" ? 
      t("AppointmentBooked") : 
      t("PaymentCompleted"));
    navigate("/appointments");
  };

  if (criticalError) {
    return (
      <div className={`p-4 bg-red-50 min-h-screen flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}
           dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">{t("SystemError")}</h2>
          <p className="text-red-500 mb-4">{criticalError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {t("ReloadApplication")}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}
           dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t("LoadingDoctorInfo")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}
         dir={isRTL ? 'rtl' : 'ltr'}>
      <Formik
        initialValues={{
          patient: { name: "", age: "", phone: "", gender: "", problem: "" },
          date: "",
          time: "",
          payment_method: "",
        }}
        validationSchema={validationSchema[step]}
        onSubmit={handleSubmit}
        validateOnMount={true}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto rounded-xl shadow overflow-hidden">
            {/* Stepper Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <nav className="flex flex-col sm:flex-row sm:space-x-4 lg:space-x-8 space-y-4 sm:space-y-0 items-start sm:items-center sm:justify-between">
                {steps.map((stepName, index) => (
                  <div key={stepName} className="flex items-center w-full sm:w-auto">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${index <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {index + 1}
                    </div>
                    <div className={`ml-2 text-sm font-medium ${index === step ? "text-blue-600" : "text-gray-500"}`}>
                      {stepName}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden sm:block ml-4 text-gray-300">→</div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Provider Info */}
            {provider && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-medium text-blue-800">
                {t("BookingAppointmentWith")}{" "}
                {isArabic
                  ? `د. ${provider.first_name_ar || provider.first_name} ${provider.last_name_ar || provider.last_name}`
                  : `Dr. ${provider.first_name} ${provider.last_name}`}
              </h2>
                {provider.specialty && (
                  <p className="text-md text-blue-900 mt-2">{t(provider.specialty)}</p>
                )}
                <p className="text-md font-medium text-blue-900 mt-2">
                  {t("ConsultationFee")}: EGP {provider.fee}
                </p>
              </div>
            )}

            {/* Form Steps */}
            <div className="px-4 sm:px-6 py-8">
              {step === 0 && (
                <PatientInfoStep t={t} isRTL={isRTL} />
              )}

              {step === 1 && (
                <TimeSelectionStep 
                  provider={provider}
                  values={values}
                  setFieldValue={setFieldValue}
                  generateTimeSlots={generateTimeSlots}
                  timeSlots={timeSlots}
                  setTimeSlots={setTimeSlots}
                  t={t}
                  isRTL={isRTL}
                />
              )}

              {step === 2 && (
                <PaymentStep 
                  provider={provider}
                  values={values}
                  t={t}
                  isRTL={isRTL}
                />
              )}

              {/* Navigation Controls */}
              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-4 px-4 sm:px-6 py-4 bg-gray-50">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    {t("Back")}
                  </button>
                )}
                
                <SubmitButton 
                  step={step}
                  setStep={setStep}
                  isValid={isValid}
                  loading={loading}
                  isSubmitting={isSubmitting}
                  timeSlots={timeSlots}
                  values={values}
                  t={t}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Sub-components
const PatientInfoStep = ({ t, isRTL }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("FullName")}
        <Field name="patient.name" className={`mt-1 block w-full rounded-md border-1 border-blue-700 outline-0 focus:border-blue-900 focus:border-2 shadow-sm p-3 ${isRTL ? 'rtl' : ''}`} />
        <ErrorMessage name="patient.name" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Age")}
          <Field name="patient.age" type="number" className={`mt-1 block w-full rounded-md border-1 border-blue-700 outline-0 shadow-sm p-3 focus:border-blue-900 focus:border-2 ${isRTL ? 'rtl' : ''}`} />
          <ErrorMessage name="patient.age" component="div" className="text-red-500 text-xs mt-1" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Gender")}
          <Field as="select" name="patient.gender" className={`mt-1 block w-full rounded-md border-1 border-blue-700 outline-0 shadow-sm p-3 focus:border-blue-900 focus:border-2 ${isRTL ? 'rtl' : ''}`}>
            <option value="">{t("SelectGender")}</option>
            <option value="Male">{t("Male")}</option>
            <option value="Female">{t("Female")}</option>
          </Field>
          <ErrorMessage name="patient.gender" component="div" className="text-red-500 text-xs mt-1" />
        </label>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("PhoneNumber")}
        <Field name="patient.phone" className={`mt-1 block w-full rounded-md border-1 border-blue-700 outline-0 shadow-sm p-3 focus:border-blue-900 focus:border-2 ${isRTL ? 'rtl' : ''}`} />
        <ErrorMessage name="patient.phone" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("ReasonForAppointment")}
        <Field as="textarea" name="patient.problem" className={`mt-1 block w-full rounded-md border-1 border-blue-700 outline-0 shadow-sm p-3 focus:border-blue-900 focus:border-2 h-32 ${isRTL ? 'rtl' : ''}`} />
        <ErrorMessage name="patient.problem" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>
  </div>
);

const TimeSelectionStep = ({ provider, values, setFieldValue, generateTimeSlots, timeSlots, setTimeSlots, t, isRTL }) => (
  <div className="space-y-6 p-6">
    {provider?.work_times?.length > 0 ? (
      <>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
          <h3 className="text-sm font-medium text-yellow-800">{t("AvailableDays")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {provider.work_times.map((workTime) => (
              <span key={workTime.day} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {t(workTime.day)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("SelectDate")}
            <Field name="date">
              {({ field, meta }) => (
                <div>
                  <input
                    {...field}
                    type="date"
                    min={format(new Date(), "yyyy-MM-dd")}
                    className={`mt-1 block w-full rounded-md border ${
                      meta.touched && meta.error ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-3`}
                    onChange={async (e) => {
                      setFieldValue("date", e.target.value);
                      setFieldValue("time", "");
                      const slots = await generateTimeSlots(e.target.value);
                      setTimeSlots(slots);
                    }}
                  />
                  {meta.touched && meta.error && (
                    <div className="text-red-500 text-sm mt-1">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
          </label>
        </div>

        {values.date && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t("AvailableTimeSlots")}
            </h3>
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time24}
                    type="button"
                    onClick={() => setFieldValue("time", slot.time24)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      values.time === slot.time24
                        ? "bg-blue-800 text-white"
                        : slot.available
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!slot.available}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg mt-4">
                {t("NoAvailableSlots")}
              </div>
            )}
            <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        )}
      </>
    ) : (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        {t("DoctorScheduleUnavailable")}
      </div>
    )}
  </div>
);

const PaymentStep = ({ provider, values, t, isRTL }) => (
  <div className="space-y-6 p-6">
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("AppointmentSummary")}</h3>
      <dl className="space-y-3">
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">{t("Doctor")}</dt>
          <dd className="text-sm text-gray-900">{provider?.first_name} {provider?.last_name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">{t("Patient")}</dt>
          <dd className="text-sm text-gray-900">{values.patient.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">{t("Date")}</dt>
          <dd className="text-sm text-gray-900">
            {values.date && format(parseISO(values.date), "MMM dd, yyyy")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">{t("Time")}</dt>
          <dd className="text-sm text-gray-900">
            {values.time && format(parseISO(`2000-01-01T${values.time}`), "hh:mm a")}
          </dd>
        </div>
        <div className="flex justify-between border-t pt-3">
          <dt className="text-base font-semibold text-gray-900">{t("Total")}</dt>
          <dd className="text-base font-semibold text-gray-900">EGP {provider?.fee}</dd>
        </div>
      </dl>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{t("PaymentMethod")}</label>
      <div className="space-y-2">
        <label className="flex items-center p-4 border rounded-lg hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
          <Field type="radio" name="payment_method" value="cash" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span className={`ml-3 block text-sm font-medium text-gray-700 ${isRTL ? 'rtl' : ''}`}>
            {t("CashPayment")}
            <span className="text-gray-500 text-sm block mt-1">{t("PayAtLocation")}</span>
          </span>
        </label>
        <label className="flex items-center p-4 border rounded-lg hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
          <Field type="radio" name="payment_method" value="visa" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span className={`ml-3 block text-sm font-medium text-gray-700 ${isRTL ? 'rtl' : ''}`}>
            {t("CardPayment")}
            <span className="text-gray-500 text-sm block mt-1">{t("SecureOnlinePayment")}</span>
          </span>
        </label>
      </div>
      <ErrorMessage name="payment_method" component="div" className="text-red-500 text-sm mt-1" />
    </div>
  </div>
);

const SubmitButton = ({ step, setStep, isValid, loading, isSubmitting, timeSlots, values, t }) => (
  <button
    type={step === 2 ? "submit" : "button"}
    onClick={() => step < 2 && setStep(s => s + 1)}
    disabled={
      !isValid || 
      isSubmitting || 
      loading || 
      (step === 1 && timeSlots.length === 0 && values.date)
    }
    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading || isSubmitting ? (
      <span className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {t("Processing")}...
      </span>
    ) : step === 2 ? t("ConfirmBooking") : t("NextStep")}
  </button>
);

export default Book;