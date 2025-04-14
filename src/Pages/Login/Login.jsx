import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import heroImage from "../../assets/hero_img_1.webp";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
import { signInWithGoogle } from "../../utils/GoogleAuth";
import { signInWithFacebook } from "../../utils/FacebookAuth";
import useCookies from "../../hooks/useCookies"; // Import your custom cookie hook
import toast from "react-hot-toast";

export default function Login() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Initialize cookies for storing user authentication data
  const [userCookie, setUserCookie] = useCookies('user', null, { 
    expires: 7, // 7 days
    path: '/'
  });
  
  const [tokenCookie, setTokenCookie] = useCookies('authToken', null, {
    expires: 7,
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'strict'
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("InvalidEmail"))
      .required(t("EmailRequired")),
    password: Yup.string()
      .min(8, t("PasswordMinLength"))
      .required(t("PasswordRequired")),
  });

  const isRTL = i18n.language === "ar";
  
  // Handle Google Sign-in
  const handleGoogleLogin = async () => {
    try {
      const authData = await signInWithGoogle();
      
      // Store user information in cookies
      setUserCookie({
        uid: authData.user.uid,
        displayName: authData.user.displayName,
        email: authData.user.email,
        photoURL: authData.user.photoURL
      });
      
      // Store the ID token in cookies
      if (authData.idToken) {
        setTokenCookie(authData.idToken);
      }
      
      // Redirect to dashboard or home page after successful login
      navigate('/');
    } catch (error) {
      console.error("Google sign-in failed:", error);
      // Error is already handled in the signInWithGoogle function with toast
      toast.error("Google sign-in failed");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const authData = await signInWithFacebook();

      // set user information in cookies
      setUserCookie({
        uid: authData.user.uid,
        displayName: authData.user.displayName,
        email: authData.user.email,
        photoURL: authData.user.photoURL
      });

      // Store Id token in Cookies
      if(authData.idToken) {
        setTokenCookie(authData.idToken);
      }
      // redirect to home
      navigate('/');
    } catch (error) {
      console.error("Facebook sign-in failed:", error);
      // Error is already handled in the signInWithFacebook function with toast
      toast.error("Facebook sign-in failed");
    }
  };

  return (
    <>
      <MetaData
        title="Login to Your Account | Secure Access"
        description="Securely login to your account. Access your personalized dashboard with our safe and encrypted login system. Supporting both email and social login options."
        keywords="login, secure login, account access, user authentication, sign in, social login, medical portal access"
        author="Mohab Mohammed"
        ogTitle="Login to Your Account | Secure Access"
        ogDescription="Access to delma Medical System. Quick login with email or social accounts."
        canonical={window.location.href}
        language={i18n.language}
      />
      <div
        className={`min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 ${
          isRTL ? "rtl" : "ltr"
        }`}
        role="main"
        aria-labelledby="login-title"
      >
        {/* Left side - Image */}
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 h-full hidden lg:flex items-center justify-center">
          <img
            src={heroImage}
            alt="Healthcare professionals working together"
            className="rounded-xl max-w-[600px] max-h-[700px] object-cover w-full h-auto md:rtl:pl-6"
            loading="lazy"
            width="600"
            height="700"
          />
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm" role="region" aria-label="Login form">
            <h1 id="login-title" className="text-3xl font-bold text-center mb-2" tabIndex="0">
              {t("Hello")}!
            </h1>
            <p className="text-gray-600 text-center mb-8" tabIndex="0">
              {t("WeAreHappy")}
            </p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6" noValidate>
                  {/* Email Field */}
                  <div className="relative">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`peer w-full px-4 py-3 rounded-lg border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-blue-500 placeholder-transparent ${
                        isRTL ? "placeholder:rtl" : "placeholder:ltr"
                      }`}
                      placeholder={t("email")}
                      aria-required="true"
                      aria-invalid={errors.email && touched.email ? "true" : "false"}
                      aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                      autoComplete="email"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute ${
                        isRTL ? "right-4" : "left-4"
                      } -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                      {t("email")}
                    </label>
                    {errors.email && touched.email && (
                      <div id="email-error" className="text-red-500 text-md mt-1 rtl:text-right ltr:text-left" role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`peer w-full px-4 py-3 rounded-lg border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-blue-500 placeholder-transparent pr-12 ${
                        isRTL ? "placeholder:rtl" : "placeholder:ltr"
                      }`}
                      placeholder={t("password")}
                      aria-required="true"
                      aria-invalid={errors.password && touched.password ? "true" : "false"}
                      aria-describedby={errors.password && touched.password ? "password-error" : undefined}
                      autoComplete="current-password"
                    />
                    <label
                      htmlFor="password"
                      className={`absolute ${
                        isRTL ? "right-4" : "left-4"
                      } -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                      {t("password")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${
                        isRTL ? "left-3" : "right-3"
                      } top-3 text-gray-400 hover:text-gray-600`}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && touched.password && (
                      <div id="password-error" className="text-red-500 text-md mt-1 rtl:text-right ltr:text-left" role="alert">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className={`text-${isRTL ? "left" : "right"}`}>
                    <Link
                      to="/forgot_password"
                      className="text-blue-500 hover:text-blue-600 text-lg font-medium"
                      aria-label="Forgot password? Click to reset"
                    >
                      {t("ForgotPassword")}
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#11319e] text-white py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium text-lg"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? t("LoggingIn") : t("Login")}
                  </button>

                  {/* Signup Link */}
                  <div className="text-center text-gray-800 text-lg">
                    <p>
                      {t("NoAccount")}{" "}
                      <Link
                        to="/register"
                        className="text-blue-500 hover:text-blue-600 font-bold"
                        aria-label="Sign up for a new account"
                      >
                        {t("Signup")}
                      </Link>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative" role="separator" aria-label="or">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {t("Or")}
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Login with Google"
                      onClick={handleGoogleLogin}
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt=""
                        className="w-5 h-5"
                        role="presentation"
                      />
                      <span className="font-medium">
                        {t("LoginWithGoogle")}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Login with Facebook"
                      onClick={handleFacebookLogin}
                    >
                      <img
                        src="https://www.facebook.com/favicon.ico"
                        alt=""
                        className="w-5 h-5"
                        role="presentation"
                      />
                      <span className="font-medium">
                        {t("LoginWithFacebook")}
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}