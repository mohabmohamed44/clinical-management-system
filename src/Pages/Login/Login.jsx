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
import useCookies from "../../hooks/useCookies";
import toast from "react-hot-toast";
import { emailAndPasswordSign } from "../../utils/LoginAuthGoogle";
import { TailSpin } from "react-loader-spinner";

export default function Login() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize cookies
  const [userCookie, setUserCookie] = useCookies("user", null, {
    expires: 7,
    path: "/",
  });

  const [tokenCookie, setTokenCookie] = useCookies("authToken", null, {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t("InvalidEmail")).required(t("EmailRequired")),
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
        photoURL: authData.user.photoURL,
      });

      // Store the ID token in cookies
      if (authData.idToken) {
        setTokenCookie(authData.idToken);
      }

      // Redirect to dashboard or home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
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
        photoURL: authData.user.photoURL,
      });

      // Store Id token in Cookies
      if (authData.idToken) {
        setTokenCookie(authData.idToken);
      }
      // redirect to home
      navigate("/");
    } catch (error) {
      console.error("Facebook sign-in failed:", error);
      // Error is already handled in the signInWithFacebook function with toast
    }
  };

  // Handle SignInWithEmailAndPassword here
  const handleSignInWithEmailAndPassword = async (values) => {
    try {
      const authData = await emailAndPasswordSign(
        values.email,
        values.password
      );

      // Store user information in cookies
      setUserCookie({
        uid: authData.user.uid,
        displayName: authData.user.displayName,
        email: authData.user.email,
        photoURL: authData.user.photoURL,
      });

      // Store the ID token in cookies
      if (authData.idToken) {
        setTokenCookie(authData.idToken);
      }

      // Redirect to dashboard or home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Email/Password sign-in failed:", error);
      // Toast notifications are already handled in the emailAndPasswordSign function
    }
  };

  return (
    <>
      <MetaData
        title="Login to Your Account | Secure Access"
        description="Securely login to your account."
        keywords="login, secure login, account access"
        author="Mohab Mohammed"
        ogTitle="Login to Your Account"
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
        {/* Image Section - Hidden on mobile */}
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 h-full hidden lg:flex items-center justify-center">
          <img
            src={heroImage}
            alt="Healthcare professionals working together"
            className="rounded-xl max-w-[600px] max-h-[700px] object-cover w-full h-auto"
            loading="lazy"
            width="600"
            height="700"
            role="img"
            aria-labelledby="image-description"
          />
          <span id="image-description" className="sr-only">
            {t("Healthcare professionals collaborating in a modern medical facility")}
          </span>
        </div>

        {/* Form Section - Responsive Adjustments */}
        <div className="lg:w-1/2 w-full max-w-md mx-4">
          <div
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
            role="region"
            aria-label="Login form"
          >
            <h1
              id="login-title"
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              tabIndex="0"
            >
              {t("Hello")}!
            </h1>
            <p className="text-gray-600 text-center mb-6 md:mb-8" tabIndex="0">
              {t("WeAreHappy")}
            </p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await handleSignInWithEmailAndPassword(values);
                } catch (error) {
                  console.error("Login failed:", error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6" noValidate>
                  {/* Email Input */}
                  <div className="relative">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`peer w-full px-4 py-3 text-base md:text-md rounded-lg border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-transparent`}
                      placeholder={t("email")}
                      aria-required="true"
                      aria-invalid={!!(errors.email && touched.email)}
                      aria-describedby="email-error"
                      autoComplete="email"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute ${
                        isRTL ? "right-4" : "left-4"
                      } -top-2.5 bg-white px-1 text-sm md:text-md text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                      {t("email")}
                    </label>
                    {errors.email && touched.email && (
                      <div
                        id="email-error"
                        className="text-red-500 text-sm mt-1 rtl:text-right ltr:text-left"
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`peer w-full px-4 py-3 text-base md:text-md rounded-lg border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-transparent pr-12`}
                      placeholder={t("password")}
                      aria-required="true"
                      aria-invalid={!!(errors.password && touched.password)}
                      aria-describedby="password-error"
                      autoComplete="current-password"
                    />
                    <label
                      htmlFor="password"
                      className={`absolute ${
                        isRTL ? "right-4" : "left-4"
                      } -top-2.5 bg-white px-1 text-sm md:text-md text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                      {t("password")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${
                        isRTL ? "left-3" : "right-3"
                      } top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1`}
                      aria-label={
                        showPassword ? t("HidePassword") : t("ShowPassword")
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && touched.password && (
                      <div
                        id="password-error"
                        className="text-red-500 text-sm mt-1 rtl:text-right ltr:text-left"
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className={`text-${isRTL ? "left" : "right"} mb-4`}>
                    <Link
                      to="/forgot_password"
                      className="text-blue-500 hover:text-blue-600 text-sm md:text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={t("ForgotPasswordAria")}
                    >
                      {t("ForgotPassword")}
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#11319e] text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium text-md md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex justify-center items-center">
                        <TailSpin
                          color="#fff"
                          width="24"
                          height="24"
                          aria-label={t("Loading")}
                          role="status"
                        />
                      </div>
                    ) : (
                      t("Login")
                    )}
                  </button>

                  {/* Signup Link */}
                  <div className="text-center text-gray-800 text-sm md:text-md">
                    <p>
                      {t("NoAccount")}{" "}
                      <Link
                        to="/register"
                        className="text-blue-500 hover:text-blue-600 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={t("SignupAria")}
                      >
                        {t("Signup")}
                      </Link>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6" role="separator">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-gray-500 text-sm">
                        {t("Or")}
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 md:px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      onClick={handleGoogleLogin}
                      aria-label={t("LoginWithGoogleAria")}
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google logo"
                        className="w-4 h-4 md:w-5 md:h-5"
                        role="presentation"
                      />
                      {t("LoginWithGoogle")}
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 md:px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      onClick={handleFacebookLogin}
                      aria-label={t("LoginWithFacebookAria")}
                    >
                      <img
                        src="https://www.facebook.com/favicon.ico"
                        alt="Facebook logo"
                        className="w-4 h-4 md:w-5 md:h-5"
                        role="presentation"
                      />
                      {t("LoginWithFacebook")}
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