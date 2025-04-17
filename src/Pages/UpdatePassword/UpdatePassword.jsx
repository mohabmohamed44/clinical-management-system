import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import "./UpdatePassword.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import { updateExistingPassword } from "../../utils/ForgotPasswordAuth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import for navigation after success
import { TailSpin } from "react-loader-spinner";

export default function UpdatePassword() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    message: "",
  });
  const [needsReauth, setNeedsReauth] = useState(false);
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, t("PasswordMinLength"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        t("PasswordRequirements")
      )
      .required(t("newPasswordIsRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("PasswordsMustMatch"))
      .required(t("ConfirmPasswordRequired")),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setFeedbackMessage({ type: "", message: "" });

    try {
      // Call the updateExistingPassword function with the form values
      const result = await updateExistingPassword(
        values.newPassword,
        values.confirmPassword
      );

      if (result.success) {
        // Show success message
        setFeedbackMessage({
          type: "success",
          message: t("PasswordUpdatedSuccess"),
        });

        // Reset the form on success
        resetForm();

        // Redirect to login page or dashboard after short delay
        setTimeout(() => {
          navigate("/login"); // Adjust the route as needed
        }, 2000);
      } else if (result.requiresReauth) {
        // Handle re-authentication requirement
        setNeedsReauth(true);
        setFeedbackMessage({
          type: "warning",
          message: t("ReauthenticationRequired"),
        });

        // Optionally navigate to login page with return URL
        setTimeout(() => {
          navigate("/login?returnTo=/update-password");
        }, 2000);
      } else {
        // Show error message
        setFeedbackMessage({
          type: "error",
          message: result.message || t("PasswordUpdateFailed"),
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
      setFeedbackMessage({
        type: "error",
        message: t("PasswordUpdateFailed"),
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <MetaData
        title="Update Password"
        description="Update password page"
        keywords="password, update, security"
        author="Mohab Mohammed"
        dir={i18n.dir()}
      />
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h2
          className={`text-center text-2xl font-medium mt-6 ${
            isRTL ? "text-right" : ""
          }`}
        >
          {t("UpdatePassword")}
        </h2>
        <p
          className={`text-center text-lg font-semibold text-gray-600 ${
            isRTL ? "text-right rtl:pt-3" : ""
          }`}
        >
          {t("UpdatePasswordRequired")}
        </p>
        <div className="w-full max-w-lg p-8 bg-white rounded-lg">
          {/* Feedback message display */}
          {feedbackMessage.message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                feedbackMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : feedbackMessage.type === "warning"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              } ${isRTL ? "text-right" : ""}`}
            >
              {feedbackMessage.message}
            </div>
          )}

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, isSubmitting: formikSubmitting }) => (
              <Form className="space-y-6">
                {/* New Password Field */}
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
                    placeholder={t("newPassword")}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <label
                    htmlFor="newPassword"
                    className={`absolute ${
                      isRTL ? "right-4" : "left-4"
                    } -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                  >
                    {t("newPassword")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-4 text-gray-400 hover:text-gray-600`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className={`text-red-500 text-md font-medium mt-1 ${
                      isRTL ? "text-right" : ""
                    }`}
                  />
                </div>

                {/* Confirm Password Field */}
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
                    placeholder={t("confirmNewPassword")}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute ${
                      isRTL ? "right-4" : "left-4"
                    } -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500`}
                  >
                    {t("confirmNewPassword")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-4 text-gray-400 hover:text-gray-600`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className={`text-red-500 text-md font-medium mt-1 ${
                      isRTL ? "text-right" : ""
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className={`w-full text-white bg-[#11319e] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center ${
                    isSubmitting || formikSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting || formikSubmitting ? (
                    <div className="flex justify-center items-center">
                      <TailSpin color="#fff" width="24px" height="24px" />
                    </div>
                  ) : (
                    t("UpdatePassword")
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
