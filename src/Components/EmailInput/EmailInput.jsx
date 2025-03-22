import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaPaperPlane } from 'react-icons/fa';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const EmailInput = () => {
  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    // Handle form submission logic here
    console.log('Form submitted with:', values);
    
    // Simulate API call
    setTimeout(() => {
      alert(`Subscribed with: ${values.email}`);
      resetForm();
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Subscribe to our Newsletter</h2>
      
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full">
            <div className="relative">
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 pr-20 rounded-full border ${
                  errors.email && touched.email 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2`}
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition-colors duration-300 flex items-center"
              >
                <FaPaperPlane className="mr-1" size={14} />
                <span>Send</span>
              </button>
            </div>
            
            <ErrorMessage 
              name="email" 
              component="div" 
              className="text-red-500 text-sm mt-1 ml-4" 
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailInput;