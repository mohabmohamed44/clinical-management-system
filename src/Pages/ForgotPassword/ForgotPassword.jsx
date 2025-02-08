import React from "react";
import { Formik, Form, Field } from "formik";
import { ArrowLeft } from "lucide-react";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
export default function ForgotPassword(){
  const {t, i18n} = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t("InvalidEmail")).required(t("EmailRequired")),
  });

  return (
    <>
    <MetaData
      title="Forgot Password"
      description="Forgot password page"
      keywords="forgot, password, email"
      author="Mohab Mohammed"
    />
    <div className="flex items-center justify-center min-h-screen">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      >
        {({ errors, touched }) => (
          <Form className="w-full max-w-sm bg-white rounded-lg p-6">
            <h1 className="text-2xl font-medium text-center mb-10">{t("ForgotPassword")}</h1>
            <div className="relative z-0 w-full mb-6 group">
              <Field
                type="email"
                name="email"
                id="email"
                className="block px-2.5 pb-2.5 pt-5 w-full text-lg text-gray-900 bg-transparent rounded-lg border border-gray-100 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 left-2.5 z-10 origin-[0] peer-focus:left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                {t("Email")}
              </label>
              {errors.email && touched.email && (
                <p className="mt-2 text-md font-medium text-red-600 dark:text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#11319e] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              {t("SendInstruction")}
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-lg font-medium text-blue-700 hover:underline dark:text-blue-500"
              >
                {isRTL ? t("GoToLogin") : null}
                <ArrowLeft size={16} className="inline-block mr-1" />
                {isRTL ? null : t("GoToLogin")}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </>
  );
};

