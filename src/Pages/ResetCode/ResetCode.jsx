import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CircleArrowLeft, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetaData from '../../Components/MetaData/MetaData';

export default function ResetCode() {
  const validationSchema = Yup.object().shape({
    code: Yup.array()
      .of(Yup.string().length(1, 'Each field must be 1 character').required('Code Required'))
      .min(6, 'Complete the code')
      .max(6, 'Only 6 characters allowed'),
  });

  const initialValues = {
    code: ["", "", "", "", "", ""],
  };

  const handleSubmit = (values) => {
    alert(`Submitted Code: ${values.code.join("")}`);
  };

  return (
    <>
    <MetaData 
      title="Reset Code" 
      description="Reset code page"
      keywords="code, reset, password"
      author="Mohab Mohammed"
    />
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <Link className="flex items-center mr-4 text-blue-700 dark:text-blue-500 mb-4 cursor-pointer" to="/forgot_password">
        <CircleArrowLeft size={24} className='mr-2' />
          Back
        </Link>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Password reset</h2>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-500 mb-6">
          We sent a code to <span className="font-medium text-blue-700">amelie@untitledui.com</span>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="flex justify-between mb-6">
                {values.code.map((digit, index) => (
                  <Field
                    key={index}
                    name={`code[${index}]`}
                    render={({ field }) => (
                      <input
                        {...field}
                        id={`code-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => {
                          setFieldValue(`code[${index}]`, e.target.value);
                          // Move to the next input if a value is entered
                          if (e.target.value && index < 5) {
                            document.getElementById(`code-input-${index + 1}`).focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            document.getElementById(`code-input-${index - 1}`).focus();
                          }
                        }}
                        className="w-14 h-14 text-center text-lg font-bold text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    )}
                  />
                ))}
              </div>
              {errors.code && touched.code && (
                <p className="text-md font-medium pb-4 text-red-500">{Array.isArray(errors.code) ? errors.code[0] : errors.code}</p>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Continue
              </button>

              <div className="mt-4 text-center">
                <p className="text-md font-semibold text-gray-600 dark:text-gray-500">
                  Didn’t receive the email?{' '}
                  <a href="#" className="font-medium text-blue-700 hover:underline dark:text-blue-500">
                    Click to resend
                  </a>
                </p>
                <Link
                  to="/login"
                  className="text-md font-medium text-blue-700 hover:underline dark:text-blue-500 mt-2 block"
                >
                  <ArrowLeft size={16} className="inline-block mr-1" />
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    </>
  );
};
