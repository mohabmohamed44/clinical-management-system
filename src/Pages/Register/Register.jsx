import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, MapPin, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import MetaData from "../../Components/MetaData/MetaData";
import Doctor from "../../assets/doctor-register.webp";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaGoogle } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { registerUser, storeGoogleUserInSupabase } from "../../services/AuthService";
import { supabase } from "../../Config/Supabase";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  profileImage: "",
  bloodType: "",
  weight: "",
  height: "",
  city: "",
  area: "",
  street: "",
  location: "",
  medicalHistory: "",
};

export default function Register() {
  const { t } = useTranslation();
  const auth = getAuth();
  const navigate = useNavigate();

  // Validation Schemas
  const personalInfoSchema = Yup.object().shape({
    firstName: Yup.string().required(t("FirstNameRequired")),
    lastName: Yup.string().required(t("LastNameRequired")),
    email: Yup.string().email(t("InvalidEmail")).required(t("EmailRequired")),
    password: Yup.string()
      .min(8, t("PasswordMinLength"))
      .required(t("PasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("PasswordsMustMatch"))
      .required(t("ConfirmPasswordRequired")),
    phone: Yup.string().required(t("PhoneNumberRequired")),
    gender: Yup.string().required(t("GenderRequired")),
  });

  const patientInfoSchema = Yup.object().shape({
    dateOfBirth: Yup.string().required(t("DateOfBirthRequired")),
    profileImage: Yup.string().optional(), // Optional field
    bloodType: Yup.string().required(t("BloodTypeRequired")),
    weight: Yup.string()  // Changed from number to string to match AuthService
      .required(t("WeightRequired"))
      .test('is-positive', t("WeightMustBePositive"), 
        value => !value || parseFloat(value) > 0),
    height: Yup.string()  // Changed from number to string to match AuthService
      .required(t("HeightRequired"))
      .test('is-positive', t("HeightMustBePositive"), 
        value => !value || parseFloat(value) > 0),
    medicalHistory: Yup.string().required(t("MedicalHistoryRequired")),
  });

  const addressInfoSchema = Yup.object().shape({
    city: Yup.string().required(t("CityRequired")),
    area: Yup.string().required(t("AreaRequired")),
    street: Yup.string().required(t("StreetRequired")),
    location: Yup.string().required(t("LocationRequired")),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { number: 1, icon: UserCircle, label: t("PersonalInfo") },
    { number: 2, icon: FaHeartbeat, label: t("PatientInfo") },
    { number: 3, icon: MapPin, label: t("AddressInfo") },
  ];

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Import GoogleAuthProvider and signInWithPopup dynamically to reduce bundle size
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // The signed-in user info
      const user = result.user;

      // Create a clean user object that matches what AuthService expects
      // with proper data formatting
      const userData = {
        uid: user.uid,
        displayName: user.displayName ? user.displayName.trim() : "",
        email: user.email ? user.email.trim() : "",
        photoURL: user.photoURL || ""
        // photoURL will be truncated in AuthService if needed
      };
      
      // Store Google user in Supabase
      const supabaseResult = await storeGoogleUserInSupabase(userData);
      
      if (supabaseResult.success) {
        setRegistrationSuccess(true);
        setCurrentStep(4);
      } else {
        throw new Error(supabaseResult.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (file) => {
    if (!file) return null;

    try {
      // Convert the image to a base64 string
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Check if the base64 string is too large
          const base64String = reader.result;
          // If image is too large (larger than ~700KB when encoded), 
          // we'll need to resize or compress it
          // Firebase Auth has a limit of ~1024 characters for photoURL
          if (base64String.length > 500000) {
            console.warn("Image is too large, it may cause issues with storage.");
            // For now, we'll still return it and let AuthService truncate if needed
          }
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error("Image conversion error:", error);
      throw error;
    }
  };

  const handleNext = async (values, actions) => {
    setError(null);
    let schema;

    if (currentStep === 1) {
      schema = personalInfoSchema;
    } else if (currentStep === 2) {
      schema = patientInfoSchema;
    } else if (currentStep === 3) {
      schema = addressInfoSchema;
    }

    try {
      await schema.validate(values, { abortEarly: false });

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        actions.setTouched({});
      } else {
        actions.setSubmitting(true);
        setIsLoading(true);

        let imageUrl = values.profileImage;
        if (selectedFile) {
          try {
            imageUrl = await uploadProfileImage(selectedFile);
            values.profileImage = imageUrl || "";
          } catch (err) {
            setError(t("ImageUploadFailed") + ": " + err.message);
            actions.setSubmitting(false);
            setIsLoading(false);
            return;
          }
        }

        // Converting values to proper format before registration
        const formattedValues = {
          ...values,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          password: values.password,
          phone: values.phone.trim(),
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          // Convert weight and height to strings with trim
          weight: values.weight ? values.weight.toString().trim() : "",
          height: values.height ? values.height.toString().trim() : "",
          bloodType: values.bloodType,
          // Ensure medical history is a string
          medicalHistory: values.medicalHistory.trim(),
          // Individual address fields for the AuthService
          city: values.city ? values.city.trim() : "",
          area: values.area ? values.area.trim() : "",
          street: values.street ? values.street.trim() : "",
          location: values.location ? values.location.trim() : ""
          // Note: In AuthService, these fields will be converted to JSON string 
          // using JSON.stringify to create the addresses object
        };

        const result = await registerUser(auth, formattedValues);

        if (result.success) {
          setRegistrationSuccess(true);
          setCurrentStep(4);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const formattedErrors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        actions.setErrors(formattedErrors);
      } else {
        setError(err.message);
      }
    } finally {
      actions.setSubmitting(false);
      setIsLoading(false);
    }
  };

  const getGeolocation = async (setFieldValue) => {
    const getPosition = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  
    const getAddress = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'User-Agent': 'Your-App-Name' // Required by Nominatim usage policy
            }
          }
        );
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        return data.display_name || `${latitude}, ${longitude}`;
      } catch (error) {
        console.error('Error getting address:', error);
        return `${latitude}, ${longitude}`;
      }
    };
  
    try {
      if (!navigator.geolocation) {
        throw new Error(t("GeolocationNotSupported"));
      }
  
      const position = await getPosition();
      const { latitude, longitude } = position.coords;
      const address = await getAddress(latitude, longitude);
      setFieldValue("location", address);
      
    } catch (error) {
      console.error("Error getting location:", error);
      
      // If we have coordinates but address fetch failed
      if (error.message !== 'Network response was not ok') {
        alert(t("GeolocationFailed"));
      }
      
      // If coordinates were obtained but address lookup failed
      if (error instanceof GeolocationPositionError) {
        const fallback = error.coords 
          ? `${error.coords.latitude}, ${error.coords.longitude}`
          : '';
        setFieldValue("location", fallback);
      }
    }
  };

  return (
    <>
      <MetaData
        title="Register | Clinical Management System"
        description="Register for an account on our clinical management system. Enjoy a seamless and accessible registration experience."
        keywords="register, account, patient, doctor, accessibility, SEO"
        author="Mohab Mohammed"
      />
      <div className="max-h-screen flex flex-col lg:flex-row items-center justify-center p-10">
        <div className="hidden lg:block lg:w-full lg:pr-5 rtl:lg:pl-5">
          <img
            src={Doctor}
            alt="Doctor image showing registration"
            className="rounded-xl w-full h-auto max-w-[600px] max-h-[800px] object-cover"
          />
        </div>

        <div className="w-full lg:w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow mb-6 p-8 mt-14">
            <nav
              aria-label="Registration steps"
              className="flex justify-center mb-6 px-4 sm:px-0"
            >
              <div className="flex items-center flex-wrap sm:flex-nowrap">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        currentStep >= step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                      aria-current={currentStep === step.number ? "step" : undefined}
                    >
                      <step.icon size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 sm:w-16 h-1 transition-colors duration-200 ${
                          currentStep > step.number
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 px-4">
              {currentStep === 1
                ? t("PersonalInfo")
                : currentStep === 2
                ? t("PatientInfo")
                : currentStep === 3
                ? t("AddressInfo")
                : t("RegistrationComplete")}
            </h1>
            {currentStep === 2 && (
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 px-4">
                {t("ExtraInfo")}
              </p>
            )}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">{t("Error")}: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {currentStep === 4 && registrationSuccess && (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("RegistrationSuccessful")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("AccountCreatedSuccessfully")}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    aria-label={t("ProceedToLogin")}
                  >
                    {t("ProceedToLogin")}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    aria-label={t("BackToHome")}
                  >
                    {t("BackToHome")}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70"
                  aria-label={t("ContinueWithGoogle")}
                >
                  <FaGoogle className="text-red-500" aria-hidden="true" />
                  {isLoading ? t("Loading") : t("ContinueWithGoogle")}
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="relative flex items-center justify-center mb-6">
                <div className="flex-grow border-t border-gray-300" aria-hidden="true"></div>
                <span className="mx-4 text-gray-500">{t("Or")}</span>
                <div className="flex-grow border-t border-gray-300" aria-hidden="true"></div>
              </div>
            )}

            {currentStep < 4 && (
              <Formik
                initialValues={initialValues}
                onSubmit={handleNext}
                validateOnMount
              >
                {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                  <Form className="space-y-4 sm:space-y-6 px-4 sm:px-0" role="form" aria-label={t("RegistrationForm")}>
                    {currentStep === 1 && (
                      <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative mt-5">
                            <Field
                              name="firstName"
                              type="text"
                              aria-label={t("FirstName")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.firstName && touched.firstName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("FirstName")}
                            />
                            <label
                              htmlFor="firstName"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("FirstName")}
                            </label>
                            {errors.firstName && touched.firstName && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.firstName}
                              </div>
                            )}
                          </div>

                          <div className="relative mt-5">
                            <Field
                              name="lastName"
                              type="text"
                              aria-label={t("LastName")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.lastName && touched.lastName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("LastName")}
                            />
                            <label
                              htmlFor="lastName"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("LastName")}
                            </label>
                            {errors.lastName && touched.lastName && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.lastName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="email"
                            type="email"
                            aria-label={t("Email")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.email && touched.email
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder={t("Email")}
                          />
                          <label
                            htmlFor="email"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("Email")}
                          </label>
                          {errors.email && touched.email && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.email}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            aria-label={t("Password")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.password && touched.password
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent pr-12`}
                            placeholder={t("Password")}
                          />
                          <label
                            htmlFor="password"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("Password")}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? t("HidePassword") : t("ShowPassword")}
                            className="absolute right-3 rtl:right-auto rtl:left-3 top-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff size={24} aria-hidden="true" />
                            ) : (
                              <Eye size={24} aria-hidden="true" />
                            )}
                          </button>
                          {errors.password && touched.password && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.password}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            aria-label={t("ConfirmPassword")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.confirmPassword && touched.confirmPassword
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent pr-12`}
                            placeholder={t("ConfirmPassword")}
                          />
                          <label
                            htmlFor="confirmPassword"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("ConfirmPassword")}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? t("HidePassword") : t("ShowPassword")}
                            className="absolute right-3 rtl:right-auto rtl:left-3 top-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff size={24} aria-hidden="true" />
                            ) : (
                              <Eye size={24} aria-hidden="true" />
                            )}
                          </button>
                          {errors.confirmPassword && touched.confirmPassword && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.confirmPassword}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="phone"
                            type="tel"
                            aria-label={t("Phone")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.phone && touched.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder={t("Phone")}
                          />
                          <label
                            htmlFor="phone"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("Phone")}
                          </label>
                          {errors.phone && touched.phone && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.phone}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 pt-3">
                          <label className="text-lg text-gray-700 mt-3 rtl:text-right">
                            {t("Gender")}
                          </label>
                          <div className="flex items-center mb-4 mt-4 rtl:flex-row">
                            <label className="flex items-center gap-2 ltr:mr-4 rtl:ml-4">
                              <Field
                                type="radio"
                                name="gender"
                                value="male"
                                aria-label={t("Male")}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="rtl:text-right">{t("Male")}</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <Field
                                type="radio"
                                name="gender"
                                value="female"
                                aria-label={t("Female")}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="rtl:text-right">{t("Female")}</span>
                            </label>
                          </div>
                          {errors.gender && touched.gender && (
                            <div className="text-red-500 text-sm rtl:text-right">
                              {errors.gender}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        <div className="relative mt-5">
                          <Field
                            name="dateOfBirth"
                            type="date"
                            aria-label={t("DateOfBirth")}
                            aria-required="true"
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
                            {t("DateOfBirth")}
                          </label>
                          {errors.dateOfBirth && touched.dateOfBirth && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.dateOfBirth}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("ProfileImage")}
                          </label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              aria-label={t("UploadProfileImage")}
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                if (file) {
                                  setSelectedFile(file);
                                  setFieldValue("profileImage", "pending-upload");

                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setFilePreview(reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className={`w-full px-4 py-2 rounded-lg border ${
                                errors.profileImage && touched.profileImage
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500`}
                            />
                            {filePreview && (
                              <div className="h-16 w-17 rounded-full overflow-hidden">
                                <img
                                  src={filePreview}
                                  alt={t("ProfileImagePreview")}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          {errors.profileImage && touched.profileImage && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.profileImage}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <Field name="bloodType">
                            {({ field, form }) => (
                              <select
                                {...field}
                                aria-label={t("BloodType")}
                                className={`peer w-full px-4 py-3 rounded-lg border ${
                                  errors.bloodType && touched.bloodType
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } focus:outline-none focus:border-blue-500 rtl:text-right`}
                                value={field.value || ""}
                                onChange={(e) =>
                                  form.setFieldValue("bloodType", e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  {t("SelectBloodType")}
                                </option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                            )}
                          </Field>
                          <label
                            htmlFor="bloodType"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 rtl:text-right"
                          >
                            {t("BloodType")}
                          </label>
                          {errors.bloodType && touched.bloodType && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.bloodType}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative mt-5">
                            <Field
                              name="weight"
                              type="number"
                              aria-label={t("WeightInKg")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.weight && touched.weight
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("Weight")}
                            />
                            <label
                              htmlFor="weight"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("Weight")} (kg)
                            </label>
                            {errors.weight && touched.weight && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.weight}
                              </div>
                            )}
                          </div>

                          <div className="relative mt-5">
                            <Field
                              name="height"
                              type="number"
                              aria-label={t("HeightInCm")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.height && touched.height
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("Height")}
                            />
                            <label
                              htmlFor="height"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("Height")} (cm)
                            </label>
                            {errors.height && touched.height && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.height}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="medicalHistory"
                            as="textarea"
                            aria-label={t("MedicalHistory")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.medicalHistory && touched.medicalHistory
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder={t("MedicalHistory")}
                          />
                          <label
                            htmlFor="medicalHistory"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("MedicalHistory")}
                          </label>
                          {errors.medicalHistory && touched.medicalHistory && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.medicalHistory}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="animate-fade-in space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative mt-5">
                            <Field
                              name="city"
                              type="text"
                              aria-label={t("City")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.city && touched.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("City")}
                            />
                            <label
                              htmlFor="city"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("City")}
                            </label>
                            {errors.city && touched.city && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.city}
                              </div>
                            )}
                          </div>

                          <div className="relative mt-5">
                            <Field
                              name="area"
                              type="text"
                              aria-label={t("Area")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.area && touched.area
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("Area")}
                            />
                            <label
                              htmlFor="area"
                              className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                            >
                              {t("Area")}
                            </label>
                            {errors.area && touched.area && (
                              <div className="text-red-500 text-sm mt-1 rtl:text-right">
                                {errors.area}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="relative mt-5">
                          <Field
                            name="street"
                            type="text"
                            aria-label={t("Street")}
                            aria-required="true"
                            className={`peer w-full px-4 py-3 rounded-lg border ${
                              errors.street && touched.street
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                            placeholder={t("Street")}
                          />
                          <label
                            htmlFor="street"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("Street")}
                          </label>
                          {errors.street && touched.street && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.street}
                            </div>
                          )}
                        </div>

                        <div className="relative mt-5">
                          <div className="flex gap-2">
                            <Field
                              name="location"
                              type="text"
                              aria-label={t("Location")}
                              aria-required="true"
                              className={`peer w-full px-4 py-3 rounded-lg border ${
                                errors.location && touched.location
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:border-blue-500 placeholder-transparent`}
                              placeholder={t("Location")}
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() => getGeolocation(setFieldValue)}
                              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              aria-label={t("GetLocation")}
                            >
                              {t("GetLocation")}
                            </button>
                          </div>
                          <label
                            htmlFor="location"
                            className="absolute left-4 rtl:left-auto rtl:right-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 rtl:text-right"
                          >
                            {t("Location")}
                          </label>
                          {errors.location && touched.location && (
                            <div className="text-red-500 text-sm mt-1 rtl:text-right">
                              {errors.location}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep < 4 && (
                      <div className="flex justify-between space-x-4 rtl:space-x-reverse mt-8">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="w-full bg-gray-100 text-gray-800 rounded-lg px-4 py-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            aria-label={t("Back")}
                          >
                            {t("Back")}
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                          aria-label={currentStep === 3 ? t("CompleteRegistration") : t("Next")}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t("Loading")}
                            </span>
                          ) : currentStep === 3 ? (
                            t("CompleteRegistration")
                          ) : (
                            t("Next")
                          )}
                        </button>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="mt-6 text-center">
                        <span className="text-gray-600">
                          {t("AlreadyHaveAccount")}{" "}
                        </span>
                        <Link
                          to="/login"
                          className="text-blue-600 hover:underline"
                          aria-label={t("Login")}
                        >
                          {t("Login")}
                        </Link>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </>
  );
}