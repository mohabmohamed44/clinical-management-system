import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../Config/Supabase';
import { useState } from 'react';
import toast from 'react-hot-toast';

const steps = ['Patient Information', 'Appointment Details', 'Confirmation'];

const validationSchemas = [
  Yup.object().shape({
    patientName: Yup.string().required('Patient name is required'),
    patientEmail: Yup.string().email('Invalid email address').required('Email is required'),
    patientPhone: Yup.string().required('Phone number is required'),
  }),
  Yup.object().shape({
    appointmentDate: Yup.date().required('Date is required'),
    appointmentTime: Yup.string().required('Time is required'),
    doctorId: Yup.string().required('Please select a doctor'),
    reason: Yup.string().required('Reason for visit is required'),
  }),
  Yup.object().shape({
    agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  }),
];

const initialValues = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  appointmentDate: '',
  appointmentTime: '',
  doctorId: '',
  reason: '',
  agreeTerms: false,
};

// Floating label input component
const FloatingInput = ({ label, name, type = "text", as, children, ...props }) => {
  return (
    <div className="relative">
      <Field
        name={name}
        type={type}
        as={as}
        id={name}
        className={`peer h-14 w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 ${props.className || ''}`}
        placeholder=" "
        {...props}
      />
      <label 
        htmlFor={name} 
        className="absolute left-3 top-1 z-10 origin-[0] -translate-y-1 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100 peer-focus:-translate-y-1 peer-focus:scale-75 peer-focus:text-blue-600"
      >
        {label}
      </label>
      {children}
      <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
    </div>
  );
};

const Step1 = ({ next, values, validateForm, setTouched, setFieldTouched }) => {
  const handleNext = async () => {
    // Touch all fields to trigger validation
    setTouched({
      patientName: true,
      patientEmail: true,
      patientPhone: true
    });

    // Validate the form
    const errors = await validateForm();
    
    // Check if there are any errors in step 1 fields
    const step1HasErrors = errors.patientName || errors.patientEmail || errors.patientPhone;
    
    // Only proceed if there are no errors
    if (!step1HasErrors) {
      next(values);
    }
  };

  return (
    <div className="space-y-6">
      <FloatingInput label="Full Name" name="patientName" onBlur={() => setFieldTouched('patientName', true)} />
      <FloatingInput label="Email Address" name="patientEmail" type="email" onBlur={() => setFieldTouched('patientEmail', true)} />
      <FloatingInput label="Phone Number" name="patientPhone" onBlur={() => setFieldTouched('patientPhone', true)} />

      <button
        type="button"
        onClick={handleNext}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Next
      </button>
    </div>
  );
};

const Step2 = ({ next, prev, values, validateForm, setTouched, setFieldTouched }) => {
  const handleNext = async () => {
    // Touch all fields to trigger validation
    setTouched({
      appointmentDate: true,
      appointmentTime: true,
      doctorId: true,
      reason: true
    });

    // Validate the form
    const errors = await validateForm();
    
    // Check if there are any errors in step 2 fields
    const step2HasErrors = errors.appointmentDate || errors.appointmentTime || errors.doctorId || errors.reason;
    
    // Only proceed if there are no errors
    if (!step2HasErrors) {
      next(values);
    }
  };

  return (
    <div className="space-y-6">
      <FloatingInput 
        label="Appointment Date" 
        name="appointmentDate" 
        type="date" 
        className="peer h-14 w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
        onBlur={() => setFieldTouched('appointmentDate', true)}
      />
      
      <FloatingInput 
        label="Appointment Time" 
        name="appointmentTime" 
        type="time" 
        onBlur={() => setFieldTouched('appointmentTime', true)}
      />

      
      <FloatingInput 
        label="Reason for Visit" 
        name="reason" 
        as="textarea"
        className="peer h-24 w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
        onBlur={() => setFieldTouched('reason', true)}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          className="rounded-lg bg-gray-200 px-5 py-3 text-center text-base font-medium text-gray-700 transition duration-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:w-auto w-full"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto w-full"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step3 = ({ prev, submitForm, isSubmitting, values, validateForm, setTouched }) => {
  const handleSubmit = async () => {
    // Touch terms checkbox to trigger validation
    setTouched({ agreeTerms: true });

    // Validate the form
    const errors = await validateForm();
    
    // Only submit if there are no errors
    if (!errors.agreeTerms) {
      submitForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Confirm your appointment</h3>
        <p className="text-gray-600 mt-2">Please review your information before submitting</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Patient Name</p>
            <p className="font-medium">{values.patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium">{values.patientEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{values.patientPhone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="font-medium">
              {values.doctorId === 'DOCTOR_ID_1' ? 'Dr. John Doe' : 
              values.doctorId === 'DOCTOR_ID_2' ? 'Dr. Jane Smith' : ''}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {values.appointmentDate} at {values.appointmentTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reason</p>
            <p className="font-medium">{values.reason}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start mb-4">
        <div className="flex items-center h-5">
          <Field
            type="checkbox"
            name="agreeTerms"
            id="agreeTerms"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
          I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
        </label>
      </div>
      <ErrorMessage name="agreeTerms" component="p" className="mt-1 text-sm text-red-600" />

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          className="rounded-lg bg-gray-200 px-5 py-3 text-center text-base font-medium text-gray-700 transition duration-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:w-auto w-full"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-green-600 px-5 py-3 text-center text-base font-medium text-white transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-green-300 sm:w-auto w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  );
};

export default function AppointmentBooking() {
  const [step, setStep] = useState(0);
  const currentValidationSchema = validationSchemas[step];
  const isLastStep = step === steps.length - 1;

  const handleSubmit = async (values, actions) => {
    if (!isLastStep) {
      setStep(step + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Appointments')
        .insert([{
          patient_name: values.patientName,
          patient_email: values.patientEmail,
          patient_phone: values.patientPhone,
          doctor_id: values.doctorId,
          date: `${values.appointmentDate}T${values.appointmentTime}`,
          reason: values.reason,
          status: 'pending'
        }]);

      if (error) throw error;
      
      toast.success('Appointment booked successfully!');
      actions.resetForm();
      setStep(0);
    } catch (error) {
      toast.error(`Error booking appointment: ${error.message}`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Book Your Appointment
          </h2>
          <div className="flex justify-center mb-8">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${index < step ? 'bg-green-500 border-green-500 text-white' : 
                      index === step ? 'bg-blue-600 border-blue-600 text-white' : 
                      'bg-gray-100 border-gray-300 text-gray-500'}`}
                >
                  {index < step ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 sm:w-24 ${index < step ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-center flex justify-between mb-6 px-4">
            <span className={step === 0 ? "font-semibold text-blue-600" : "text-gray-500"}>{steps[0]}</span>
            <span className={step === 1 ? "font-semibold text-blue-600" : "text-gray-500"}>{steps[1]}</span>
            <span className={step === 2 ? "font-semibold text-blue-600" : "text-gray-500"}>{steps[2]}</span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={currentValidationSchema}
            onSubmit={handleSubmit}
            validateOnMount={false}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, values, submitForm, validateForm, setTouched, setFieldTouched }) => (
              <Form>
                {step === 0 && <Step1 next={() => setStep(1)} values={values} validateForm={validateForm} setTouched={setTouched} setFieldTouched={setFieldTouched} />}
                {step === 1 && <Step2 next={() => setStep(2)} prev={() => setStep(0)} values={values} validateForm={validateForm} setTouched={setTouched} setFieldTouched={setFieldTouched} />}
                {step === 2 && <Step3 prev={() => setStep(1)} submitForm={submitForm} isSubmitting={isSubmitting} values={values} validateForm={validateForm} setTouched={setTouched} />}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}