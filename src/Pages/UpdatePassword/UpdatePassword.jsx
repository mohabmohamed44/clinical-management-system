import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import "./UpdatePassword.module.css";

export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Form submission function
  const handleSubmit = (values) => {
    console.log("Form Data: ", values);
    // Handle form submission (e.g., API call)
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h2 className="text-center text-2xl font-medium mt-6">
          Set Your New Password
        </h2>
        <p className="text-center text-lg font-medium text-gray-600">
          Your New Password must be different from your old Password
        </p>
        <div className="w-full max-w-lg p-8 bg-white rounded-lg">
          <Formik
            initialValues={{
              oldPassword: "",
              password: "",
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
                    name="password"
                    id="password"
                    className={`peer block w-full px-4 py-3 rounded-lg border-2 ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                    placeholder="New Password"
                  />
                  <label
                    htmlFor="password"
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
                    name="password"
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
