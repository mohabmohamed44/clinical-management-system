import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { supabase } from "../../Config/Supabase";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { format, parseISO, isBefore, startOfDay, isToday } from "date-fns";

const Book = () => {
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  const steps = ["Patient Info", "Time Selection", "Payment"];

  const validationSchema = [
    Yup.object().shape({
      patient: Yup.object().shape({
        name: Yup.string().required("Full name required"),
        age: Yup.number()
          .required("Age required")
          .positive()
          .max(120),
        phone: Yup.string()
          .required("Phone number required")
          .matches(/^01[0125][0-9]{8}$/, "Egyptian number required"),
        gender: Yup.string().required("Gender required"),
        problem: Yup.string().required("Reason required"),
      }),
    }),
    Yup.object().shape({
      date: Yup.date()
        .required("Date required")
        .min(startOfDay(new Date()), "Invalid date"),
      time: Yup.string().required("Time is required"),
    }),
    Yup.object().shape({
      payment_method: Yup.string().required("Payment method required"),
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
        throw new Error(doctorError?.message || "Doctor not found");
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
          name: firebaseUser.displayName || "Patient",
          phone: firebaseUser.phoneNumber || "",
          role: "patient"
        }])
        .select("id")
        .single();

      if (createError) throw createError;
      return newUser.id;

    } catch (error) {
      console.error("User error:", error);
      toast.error("Failed to verify user account");
      throw error;
    }
  };

  const generateTimeSlots = async (selectedDate) => {
    if (!provider || !selectedDate) return [];

    try {
      const selectedDay = format(parseISO(selectedDate), "EEEE");
      const workDay = provider.work_times?.find(w => w.day === selectedDay);

      if (!workDay) return [];

      const [startHour, startMinute] = workDay.start.split(":").map(Number);
      const [endHour, endMinute] = workDay.end.split(":").map(Number);
      const duration = parseInt(workDay.duration) || 30;

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;

      let slots = [];
      for (let minutes = startTotal; minutes + duration <= endTotal; minutes += duration) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const time24 = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
        const isoTime = `${selectedDate}T${time24}:00`;

        if (isToday(parseISO(selectedDate))) {
          const now = new Date();
          if (isBefore(parseISO(isoTime), now)) continue;
        }

        slots.push({
          time24,
          isoTime,
          display: format(parseISO(isoTime), "hh:mm a"),
          available: true
        });
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
      console.error("Slot error:", error);
      toast.error("Failed to load time slots");
      return [];
    }
  };

  const handleSubmit = async (values) => {
    if (!provider || !currentUser) {
      toast.error("Session expired, please login again");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const supabaseUserId = await getSupabaseUserId(currentUser);
      
      const timeOnly = values.time + ':00';
      const dateOnly = values.date;

      const appointmentData = {
        type: "Upcoming",
        status: "pending",
        patient_id: supabaseUserId,
        patient: values.patient,
        fee: provider.fee,
        payment_method: values.payment_method,
        time: timeOnly,
        date: dateOnly,
        doctor_id: id
      };

      if (provider.clinic_id) appointmentData.clinic_id = provider.clinic_id;
      if (provider.hos_id) appointmentData.hos_id = provider.hos_id;

      const { error } = await supabase
        .from("Appointments")
        .insert([appointmentData]);

      if (error) throw error;

      handlePaymentSuccess(values.payment_method);

    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (method) => {
    toast.success(method === "cash" ? 
      "Appointment booked!" : 
      "Payment completed!");
    navigate("/appointments");
  };

  if (criticalError) {
    return (
      <div className="p-4 bg-red-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">System Error</h2>
          <p className="text-red-500 mb-4">{criticalError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Formik
        initialValues={{
          patient: { name: "", age: "", phone: "", gender: "", problem: "" },
          date: "",
          time: "",
          payment_method: "",
        }}
        validationSchema={validationSchema[step]}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Stepper Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <nav className="flex space-x-4 lg:space-x-8">
                {steps.map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                      ${index <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {index + 1}
                    </div>
                    <div className={`ml-2 text-sm font-medium ${index === step ? "text-blue-600" : "text-gray-500"}`}>
                      {stepName}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Provider Info */}
            {provider && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-medium text-blue-800">
                  Booking appointment with Dr. {provider.first_name} {provider.last_name}
                </h2>
                {provider.specialty && (
                  <p className="text-sm text-blue-900 mt-2">{provider.specialty}</p>
                )}
                <p className="text-sm font-medium text-blue-900 mt-2">
                  Consultation Fee: EGP {provider.fee}
                </p>
              </div>
            )}

            {/* Form Steps */}
            <div className="px-4 sm:px-6 py-8">
              {step === 0 && (
                <PatientInfoStep />
              )}

              {step === 1 && (
                <TimeSelectionStep 
                  provider={provider}
                  values={values}
                  setFieldValue={setFieldValue}
                  generateTimeSlots={generateTimeSlots}
                  timeSlots={timeSlots}
                  setTimeSlots={setTimeSlots}
                />
              )}

              {step === 2 && (
                <PaymentStep 
                  provider={provider}
                  values={values}
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
                    Back
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
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Sub-components for better readability
const PatientInfoStep = () => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
        <Field name="patient.name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
        <ErrorMessage name="patient.name" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age
          <Field name="patient.age" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
          <ErrorMessage name="patient.age" component="div" className="text-red-500 text-xs mt-1" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
          <Field as="select" name="patient.gender" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Field>
          <ErrorMessage name="patient.gender" component="div" className="text-red-500 text-xs mt-1" />
        </label>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
        <Field name="patient.phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
        <ErrorMessage name="patient.phone" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Reason for Appointment
        <Field as="textarea" name="patient.problem" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 h-32" />
        <ErrorMessage name="patient.problem" component="div" className="text-red-500 text-xs mt-1" />
      </label>
    </div>
  </div>
);

const TimeSelectionStep = ({ provider, values, setFieldValue, generateTimeSlots, timeSlots, setTimeSlots }) => (
  <div className="space-y-6 p-6">
    {provider?.work_times?.length > 0 ? (
      <>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
          <h3 className="text-sm font-medium text-yellow-800">Available Days</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {provider.work_times.map((workTime) => (
              <span key={workTime.day} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {workTime.day}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
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
              Available Time Slots
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
                        ? "bg-blue-600 text-white"
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
                No available slots for this date
              </div>
            )}
            <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        )}
      </>
    ) : (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        Doctor schedule unavailable
      </div>
    )}
  </div>
);

const PaymentStep = ({ provider, values }) => (
  <div className="space-y-6 p-6">
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
      <dl className="space-y-3">
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Doctor</dt>
          <dd className="text-sm text-gray-900">{provider?.first_name} {provider.last_name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Patient</dt>
          <dd className="text-sm text-gray-900">{values.patient.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Date</dt>
          <dd className="text-sm text-gray-900">
            {values.date && format(parseISO(values.date), "MMM dd, yyyy")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Time</dt>
          <dd className="text-sm text-gray-900">
            {values.time && format(parseISO(`2000-01-01T${values.time}`), "hh:mm a")}
          </dd>
        </div>
        <div className="flex justify-between border-t pt-3">
          <dt className="text-base font-semibold text-gray-900">Total</dt>
          <dd className="text-base font-semibold text-gray-900">EGP {provider?.fee}</dd>
        </div>
      </dl>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
      <div className="space-y-2">
        <label className="flex items-center p-4 border rounded-lg hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
          <Field type="radio" name="payment_method" value="cash" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span className="ml-3 block text-sm font-medium text-gray-700">
            Cash Payment
            <span className="text-gray-500 text-sm block mt-1">Pay at the location</span>
          </span>
        </label>
        <label className="flex items-center p-4 border rounded-lg hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
          <Field type="radio" name="payment_method" value="visa" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span className="ml-3 block text-sm font-medium text-gray-700">
            Credit/Debit Card
            <span className="text-gray-500 text-sm block mt-1">Secure online payment</span>
          </span>
        </label>
      </div>
      <ErrorMessage name="payment_method" component="div" className="text-red-500 text-sm mt-1" />
    </div>
  </div>
);

const SubmitButton = ({ step, setStep, isValid, loading, isSubmitting, timeSlots, values }) => (
  <button
    type={step === 2 ? "submit" : "button"}
    onClick={() => step < 2 && setStep(s => s + 1)}
    disabled={
      !isValid || 
      isSubmitting || 
      loading || 
      (step === 1 && timeSlots.length === 0 && values.date)
    }
    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading || isSubmitting ? (
      <span className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Processing...
      </span>
    ) : step === 2 ? "Confirm Booking" : "Next Step"}
  </button>
);

export default Book;