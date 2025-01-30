import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import heroImage from "../../assets/hero_img_1.png";
import { Link } from "react-router-dom";
import MetaData from "../../Components/MetaData/MetaData";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <MetaData
        title="Login"
        description="Login to your account"
        keywords="login, account, signin"
        author="Mohab Mohammed"
      />
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4">
        {/* Left side - Image */}
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 h-full">
          <img
            src={heroImage}
            alt="Medical professionals"
            className="rounded-xl max-w-[600px] max-h-[700px] object-cover hidden lg:block"
          />
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-18">
            <h1 className="text-3xl font-bold text-center mb-2">Hello!</h1>
            <p className="text-gray-600 text-center mb-8">
              We are really happy to see you again!
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
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="relative">
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

                  <div className="relative">
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
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <Link
                      to="/forgot_password"
                      className="text-blue-500 hover:text-blue-600 text-lg font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#11319e] text-white py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium text-lg"
                  >
                    Login
                  </button>

                  <div className="text-center text-gray-800 text-lg">
                    <p>
                      Do not have an account ?{" "}
                      <Link
                        to="/register"
                        className="text-blue-500 hover:text-blue-600 font-bold"
                      >
                        Signup
                      </Link>
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      <span className="font-medium">Login with Google</span>
                    </button>

                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src="https://www.facebook.com/favicon.ico"
                        alt="Facebook"
                        className="w-5 h-5"
                      />
                      <span className="font-medium">Login with Facebook</span>
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
