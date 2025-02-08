import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CircleArrowLeft, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetaData from '../../Components/MetaData/MetaData';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ResetCode() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

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
    toast(`Submitted Code: ${values.code.join("")}`);
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
          <Link className="flex items-center text-blue-700 dark:text-blue-500 mb-4 cursor-pointer" to="/forgot_password">
            {isRTL ? t("Back") : null}
            <CircleArrowLeft size={24} className={isRTL ? 'mr-2' : 'mr-2'} />
            {!isRTL ? t("Back") : null}
          </Link>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Password reset</h2>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-500 mb-6">
            {t("SentCode")} <span className="font-medium text-blue-700">amelie@untitledui.com</span>
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
                  className="w-full text-white rtl:text-md rtl:font-semibold bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {t("Continue")}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-md font-semibold text-gray-600 dark:text-gray-500">
                    {t("DidNotReceiveEmail")}{' '}
                    <a href="#" className="font-medium mr-2 text-blue-700 hover:underline dark:text-blue-500">
                      {t("Resend")}
                    </a>
                  </p>
                  <Link
                    to="/login"
                    className="text-md font-medium pb-3 text-blue-700 hover:underline dark:text-blue-500 mt-2 flex items-center justify-center"
                  >
                    {isRTL ? t("GoToLogin") : null}
                    <ArrowLeft size={16} className={isRTL ? 'mr-2' : 'mr-2'} />
                    {!isRTL ? t("GoToLogin") : null}
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
