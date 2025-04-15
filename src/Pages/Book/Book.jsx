import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../Config/Supabase';
import { useState } from 'react';
import toast from 'react-hot-toast';

const steps = ['Patient Information', 'Appointment Details', 'Confirmation'];

const validationSchemas = [
  Yup.object().shape({
    patientName: Yup.string().required('Required'),
    patientEmail: Yup.string().email('Invalid email').required('Required'),
    patientPhone: Yup.string().required('Required'),
  }),
  Yup.object().shape({
    appointmentDate: Yup.date().required('Required'),
    appointmentTime: Yup.string().required('Required'),
    doctorId: Yup.string().required('Required'),
    reason: Yup.string().required('Required'),
  }),
  Yup.object().shape({
    agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
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

const Step1 = ({ next, values }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Full Name</label>
      <Field
        name="patientName"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="patientName" component="div" className="text-red-500 text-sm" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <Field
        name="patientEmail"
        type="email"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="patientEmail" component="div" className="text-red-500 text-sm" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Phone</label>
      <Field
        name="patientPhone"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="patientPhone" component="div" className="text-red-500 text-sm" />
    </div>

    <button
      type="button"
      onClick={() => next(values)}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
    >
      Next
    </button>
  </div>
);

const Step2 = ({ next, prev, values }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
      <Field
        name="appointmentDate"
        type="date"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="appointmentDate" component="div" className="text-red-500 text-sm" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
      <Field
        name="appointmentTime"
        type="time"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="appointmentTime" component="div" className="text-red-500 text-sm" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Doctor</label>
      <Field
        as="select"
        name="doctorId"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      >
        <option value="">Select a doctor</option>
        <option value="DOCTOR_ID_1">Dr. John Doe</option>
        <option value="DOCTOR_ID_2">Dr. Jane Smith</option>
      </Field>
      <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm" />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Reason</label>
      <Field
        as="textarea"
        name="reason"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
      <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />
    </div>

    <div className="flex justify-between">
      <button
        type="button"
        onClick={prev}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
      >
        Back
      </button>
      <button
        type="button"
        onClick={() => next(values)}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  </div>
);

const Step3 = ({ prev, submitForm, isSubmitting }) => (
  <div className="space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-medium">Confirm your appointment</h3>
      <p className="text-gray-600 mt-2">Please review your information before submitting</p>
    </div>

    <div className="flex justify-between">
      <button
        type="button"
        onClick={prev}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
      >
        Back
      </button>
      <button
        type="button"
        onClick={submitForm}
        disabled={isSubmitting}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
      >
        {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
      </button>
    </div>
  </div>
);

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
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Book Appointment
          </h2>
          <div className="mt-4 flex justify-center">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${index <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 ${index < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              {step === 0 && <Step1 next={() => setStep(1)} values={values} />}
              {step === 1 && <Step2 next={() => setStep(2)} prev={() => setStep(0)} values={values} />}
              {step === 2 && <Step3 prev={() => setStep(1)} submitForm={handleSubmit} isSubmitting={isSubmitting} />}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}