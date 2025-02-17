import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, MapPin, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import MetaData from "../../Components/MetaData/MetaData";
import Doctor from "../../assets/doctor-register.webp";
import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
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
  const { t } = useTranslation();

  // Validation Schema
  const personalInfoSchema = Yup.object().shape({
    firstName: Yup.string().required(t("FirstNameRequired")),
    lastName: Yup.string().required(t("LastNameRequired")),
    email: Yup.string().email("Invalid email").required(t("EmailRequired")),
    password: Yup.string()
      .min(8, t("PasswordMinLength"))
      .required(t("PasswordRequired")),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      t("PasswordsMustMatch")
    ),
    phone: Yup.string().required(t("phoneNumberRequired")),
    gender: Yup.string().required(t("GenderRequired")),
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

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    { number: 1, icon: UserCircle, label: t("Personal Info") },
    { number: 2, icon: FaHeartbeat, label: t("Patient Info") },
    { number: 3, icon: MapPin, label: t("Address Info") },
  ];

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
      <div className="max-h-screen flex flex-col lg:flex-row items-center justify-center p-10">
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-full lg:pr-5 rtl:lg:pl-5">
          <img
            src={Doctor}
            alt="Doctor"
            className="rounded-xl w-full h-auto max-w-[600px] max-h-[800px] object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-sm mb-6 p-8 mt-14">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        currentStep >= step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon size={24} />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-1 transition-colors duration-200 ${
                          currentStep > step.number
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-6">
              {currentStep === 1
                ? t("personalInfo")
                : currentStep === 2
                ? t("patientInfo")
                : currentStep === 3
                ? t("addressInfo")
                : t("registrationComplete")}
            </h1>
            {currentStep === 2 && (
              <p className="text-gray-600 text-center mb-8 rtl:text-center">
                {t("extraInfo")}
              </p>
            )}

            <Formik initialValues={initialValues} onSubmit={handleNext}>
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  {/* Step 1: Personal Info */}
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
                            placeholder={t("firstName")}
                          />
                          <label
                            htmlFor="firstName"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-mdg text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("firstName")}
                          </label>
                          {errors.firstName && touched.firstName && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            placeholder={t("lastName")}
                          />
                          <label
                            htmlFor="lastName"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("lastName")}
                          </label>
                          {errors.lastName && touched.lastName && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                          placeholder={t("email")}
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("email")}
                        </label>
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                          placeholder={t("password")}
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("password")}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 rtl:right-auto rtl:left-3 top-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={24} />
                          ) : (
                            <Eye size={24} />
                          )}
                        </button>
                        {errors.password && touched.password && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5">
                        <Field
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:border-blue-500 placeholder-transparent pr-12`}
                          placeholder={t("confirmPassword")}
                        />
                        <label
                          htmlFor="confirmPassword"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("confirmPassword")}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 rtl:right-auto rtl:left-3 top-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={24} />
                          ) : (
                            <Eye size={24} />
                          )}
                        </button>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
                            {errors.confirmPassword}
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
                          placeholder={t("phone")}
                        />
                        <label
                          htmlFor="phone"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("phone")}
                        </label>
                        {errors.phone && touched.phone && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 rtl:mr-2">
                        <label className="text-lg text-gray-700 mt-3 rtl:text-right">
                          {t("gender")}
                        </label>
                        <div className="flex items-center mb-4 mt-4 rtl:flex-row">
                          <label className="flex items-center gap-2 ltr:mr-4 rtl:ml-4">
                            <Field
                              type="radio"
                              name="gender"
                              value="male"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="rtl:text-right">{t("male")}</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Field
                              type="radio"
                              name="gender"
                              value="female"
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="rtl:text-right">
                              {t("female")}
                            </span>
                          </label>
                        </div>
                        {errors.gender && touched.gender && (
                          <div className="text-red-500 text-md rtl:text-right">
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
                          } focus:outline-none focus:border-blue-500 rtl:text-right`}
                        />
                        <label
                          htmlFor="dateOfBirth"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 rtl:text-right"
                        >
                          {t("dateOfBirth")}
                        </label>
                        {errors.dateOfBirth && touched.dateOfBirth && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            placeholder={t("occupation")}
                          />
                          <label
                            htmlFor="occupation"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("occupation")}
                          </label>
                          {errors.occupation && touched.occupation && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            } focus:outline-none focus:border-blue-500 rtl:text-right`}
                          >
                            <option value="" selected disabled hidden>{t("SelectBloodType")}</option>
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
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 rtl:text-right"
                          >
                            {t("bloodType")}
                          </label>
                          {errors.bloodType && touched.bloodType && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
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
                            placeholder={t("weight")}
                          />
                          <label
                            htmlFor="weight"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("weight")}
                          </label>
                          {errors.weight && touched.weight && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            placeholder={t("height")}
                          />
                          <label
                            htmlFor="height"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("height")}
                          </label>
                          {errors.height && touched.height && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            placeholder={t("city")}
                          />
                          <label
                            htmlFor="city"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("city")}
                          </label>
                          {errors.city && touched.city && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                            placeholder={t("area")}
                          />
                          <label
                            htmlFor="area"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("area")}
                          </label>
                          {errors.area && touched.area && (
                            <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                          placeholder={t("street")}
                        />
                        <label
                          htmlFor="street"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-md text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("street")}
                        </label>
                        {errors.street && touched.street && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                          placeholder={t("zipCode")}
                        />
                        <label
                          htmlFor="zipCode"
                          className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                        >
                          {t("zipCode")}
                        </label>
                        {errors.zipCode && touched.zipCode && (
                          <div className="text-red-500 text-md mt-1 rtl:text-right">
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 rtl:text-center">
                        {t("registrationComplete")}
                      </h2>
                      <p className="text-gray-600 mb-6 rtl:text-center ">
                        {t("thankYou")}
                      </p>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/login")}
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Link to="/login">{t("goToLogin")}</Link>
                      </button>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {currentStep < 4 && (
                    <div className="flex justify-between space-x-4 rtl:space-x-reverse">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="w-full bg-gray-100 text-gray-800 rounded-lg ml-3 px-4 py-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rtl:text-center"
                        >
                          {t("back")}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rtl:text-center"
                      >
                        {currentStep === 3
                          ? t("completeRegistration")
                          : t("next")}
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
