import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import "./UpdatePassword.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";

export default function UpdatePassword() {
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required(t("newPasswordIsRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("PasswordsMustMatch"))  
      .required(t("ConfirmPasswordRequired")),
  });

  // Form submission function
  const handleSubmit = (values) => {
    console.log("Form Data: ", values);
    // Handle form submission (e.g., API call)
  };

  return (
    <>
      {/* MetaData for the page */}
      <MetaData
        title="Update Password"
        description="Update password page"
        keywords="password, update, security"
        author="Mohab Mohammed"
      />
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h2 className="text-center text-2xl font-medium mt-6">
          {t("UpdatePassword")}
        </h2>
        <p className="text-center text-lg font-semibold text-gray-600 rtl:pt-3 rtl:font-semibold">
          {t("UpdatePasswordRequired")}
        </p>
        <div className="w-full max-w-lg p-8 bg-white rounded-lg">
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors }) => (
              <Form className="space-y-6">
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    className={`peer block w-full px-4 py-3 rounded-lg border-2 ${
                      touched.newPassword && errors.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                    placeholder="New Password"
                  />
                  <label
                    htmlFor="newPassword"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-md font-medium mt-1"
                  />
                </div>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`peer block w-full px-4 py-3 rounded-lg border-2 ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                    placeholder="Confirm Password"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-md font-medium mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-[#11319e] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                >
                  Update Password
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
