import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import MetaData from "../../Components/MetaData/MetaData";
import Doctor from "../../assets/doctor.png";
import { Link } from "react-router-dom";

// Validation schemas for each step
const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phone: Yup.string().required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
});

const patientInfoSchema = Yup.object().shape({
  dateOfBirth: Yup.date().required("Date of birth is required"),
  occupation: Yup.string().required("Occupation is required"),
  bloodType: Yup.string().required("Blood type is required"),
  weight: Yup.number().required("Weight is required"),
  height: Yup.number().required("Height is required"),
});

const addressInfoSchema = Yup.object().shape({
  city: Yup.string().required("City is required"),
  area: Yup.string().required("Area is required"),
  street: Yup.string().required("Street is required"),
  zipCode: Yup.string().required("Zip code is required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  occupation: "",
  bloodType: "",
  weight: "",
  height: "",
  city: "",
  area: "",
  street: "",
  zipCode: "",
};

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = (values, actions) => {
    let schema;
    if (currentStep === 1) {
      schema = personalInfoSchema;
    } else if (currentStep === 2) {
      schema = patientInfoSchema;
    } else if (currentStep === 3) {
      schema = addressInfoSchema;
    }

    schema
      .validate(values, { abortEarly: false })
      .then(() => {
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
          actions.setTouched({});
        } else {
          // Handle form submission here
          console.log("Form submitted:", values);
          setCurrentStep(4); // Move to the completion step
        }
      })
      .catch((err) => {
        actions.setErrors(
          err.inner.reduce((acc, err) => {
            acc[err.path] = err.message;
            return acc;
          }, {})
        );
      });
  };

  return (
    <>
      <MetaData
        title="Register"
        description="Register for an account"
        keywords="register, account, patient, doctor"
        author="Mohab Mohammed"
      />
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-10">
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 lg:pr-5">
          <img
            src={Doctor}
            alt="Doctor"
            className="rounded-xl max-w-full w-100 h-auto"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-full max-w-md">
          <div className="bg-white rounded-2xl p-8">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 ${
                          currentStep > step ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-6">
              {currentStep === 1
                ? "Personal Info"
                : currentStep === 2
                ? "Patient Info"
                : currentStep === 3
                ? "Address Info"
                : "Registration Complete"}
            </h1>
            {currentStep === 2 && (
              <p className="text-gray-600 text-center mb-8">
                You need to provide some extra info to complete your
                registration.
              </p>
            )}

            <Formik initialValues={initialValues} onSubmit={handleNext}>
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  {/* [Previous Steps 1 and 2 remain the same] */}
                  {currentStep === 1 && (
                    <div className="animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative mt-5">
                          <Field
                            name="firstName"
                            type="text"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.firstName && touched.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="First Name"
                          />
                          <label
                            htmlFor="firstName"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            First Name
                          </label>
                          {errors.firstName && touched.firstName && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.firstName}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="lastName"
                            type="text"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.lastName && touched.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="Last Name"
                          />
                          <label
                            htmlFor="lastName"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            Last Name
                          </label>
                          {errors.lastName && touched.lastName && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="email"
                          type="email"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                          placeholder="Email"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Email
                        </label>
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent pr-12`}
                          placeholder="Password"
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                        {errors.password && touched.password && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="phone"
                          type="tel"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                          placeholder="Phone Number"
                        />
                        <label
                          htmlFor="phone"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Phone Number
                        </label>
                        {errors.phone && touched.phone && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3">
                        <label className="text-lg text-gray-700 mt-3">
                          Gender
                        </label>
                        <div className="flex items-center mb-4 mt-4">
                          <label className="flex items-center gap-2">
                            <Field
                              type="radio"
                              name="gender"
                              value="male"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span>Male</span>
                          </label>
                          <label className="flex items-center gap-2 pl-2">
                            <Field
                              type="radio"
                              name="gender"
                              value="female"
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>Female</span>
                          </label>
                        </div>
                        {errors.gender && touched.gender && (
                          <div className="text-red-500 text-sm">
                            {errors.gender}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Patient Info */}
                  {currentStep === 2 && (
                    <div className="animate-fade-in">
                      <div className="relative mt-5">
                        <Field
                          name="dateOfBirth"
                          type="date"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.dateOfBirth && touched.dateOfBirth
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500`}
                        />
                        <label
                          htmlFor="dateOfBirth"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600"
                        >
                          Date of Birth
                        </label>
                        {errors.dateOfBirth && touched.dateOfBirth && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.dateOfBirth}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative mt-5">
                          <Field
                            name="occupation"
                            type="text"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.occupation && touched.occupation
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="Occupation"
                          />
                          <label
                            htmlFor="occupation"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            Occupation
                          </label>
                          {errors.occupation && touched.occupation && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.occupation}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="bloodType"
                            as="select"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.bloodType && touched.bloodType
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500`}
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Field>
                          <label
                            htmlFor="bloodType"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600"
                          >
                            Blood Type
                          </label>
                          {errors.bloodType && touched.bloodType && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.bloodType}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative mt-5">
                          <Field
                            name="weight"
                            type="number"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.weight && touched.weight
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="Weight"
                          />
                          <label
                            htmlFor="weight"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            Weight (kg)
                          </label>
                          {errors.weight && touched.weight && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.weight}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="height"
                            type="number"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.height && touched.height
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="Height"
                          />
                          <label
                            htmlFor="height"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            Height (cm)
                          </label>
                          {errors.height && touched.height && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.height}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address Info */}
                  {currentStep === 3 && (
                    <div className="animate-fade-in space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative mt-5">
                          <Field
                            name="city"
                            type="text"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.city && touched.city
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="City"
                          />
                          <label
                            htmlFor="city"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            City
                          </label>
                          {errors.city && touched.city && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.city}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="area"
                            type="text"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.area && touched.area
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder="Area"
                          />
                          <label
                            htmlFor="area"
                            className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                          >
                            Area
                          </label>
                          {errors.area && touched.area && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.area}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="street"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.street && touched.street
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                          placeholder="Street"
                        />
                        <label
                          htmlFor="street"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Street
                        </label>
                        {errors.street && touched.street && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.street}
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="zipCode"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.zipCode && touched.zipCode
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                          placeholder="Zip Code"
                        />
                        <label
                          htmlFor="zipCode"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                          Zip Code
                        </label>
                        {errors.zipCode && touched.zipCode && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.zipCode}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Completion */}
                  {currentStep === 4 && (
                    <div className="text-center animate-fade-in">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Registration Complete!
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Thank you for registering. You can now log in to your
                        account.
                      </p>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/login")}
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Link to="/login">Go to Log In</Link>
                      </button>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {currentStep < 4 && (
                    <div className="flex justify-between space-x-4">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="w-full bg-gray-100 text-gray-800 rounded-lg px-4 py-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {currentStep === 3 ? "Complete Registration" : "Next"}
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}