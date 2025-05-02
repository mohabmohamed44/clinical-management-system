import React, { useEffect } from "react";
import { X } from 'lucide-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Please select a future date')
    .typeError('Invalid date format'),
  time: Yup.string()
    .required('Time is required')
    .test('is-valid-time', 'Please select a valid time', value => {
      if (!value) return false;
      const [hours, minutes] = value.split(':');
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }),
});

export default function RescheduleModal({ isOpen, onClose, visitData, onReschedule }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  const formik = useFormik({
    initialValues: {
      date: '',
      time: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onReschedule({
        ...visitData,
        visit_date: `${values.date}T${values.time}`,
      });
      onClose();
    },
  });

  if (!isOpen) return null;

  const closeModal = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-lg transform transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
        <p className="text-gray-600 mb-4">
          Current appointment with {visitData?.doctor_name}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4" >
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              New Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                formik.touched.date && formik.errors.date 
                  ? 'border-red-500' 
                  : 'border-blue-600'
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              New Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                formik.touched.time && formik.errors.time 
                  ? 'border-red-500' 
                  : 'border-blue-600'
              }`}
            />
            {formik.touched.time && formik.errors.time && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.time}</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => closeModal()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className={`flex-1 px-4 py-2 rounded-md text-white
                ${formik.isSubmitting || !formik.isValid 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-[#11319E] hover:bg-blue-700'
                }`}
            >
              {formik.isSubmitting ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
