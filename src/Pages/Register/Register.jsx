import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import MetaData from '../../Components/MetaData/MetaData';

// Validation schemas for each step
const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: Yup.string().required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
});

const patientInfoSchema = Yup.object().shape({
  dateOfBirth: Yup.date().required('Date of birth is required'),
  occupation: Yup.string().required('Occupation is required'),
  bloodType: Yup.string().required('Blood type is required'),
  weight: Yup.number().required('Weight is required'),
  height: Yup.number().required('Height is required'),
  city: Yup.string().required('City is required'),
  area: Yup.string().required('Area is required'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  occupation: '',
  bloodType: '',
  weight: '',
  height: '',
  city: '',
  area: '',
};

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = (values, actions) => {
    if (currentStep === 1) {
      personalInfoSchema
        .validate(values)
        .then(() => {
          setCurrentStep(2);
          actions.setTouched({});
        })
        .catch((err) => {
          actions.setErrors(err.inner.reduce((acc, err) => {
            acc[err.path] = err.message;
            return acc;
          }, {}));
        });
    } else if (currentStep === 2) {
      patientInfoSchema
        .validate(values)
        .then(() => {
          setCurrentStep(3);
          actions.setTouched({});
          // Handle form submission here
          console.log('Form submitted:', values);
        })
        .catch((err) => {
          actions.setErrors(err.inner.reduce((acc, err) => {
            acc[err.path] = err.message;
            return acc;
          }, {}));
        });
    }
  };

  return (
    <>
    <MetaData
      title="Register"
      description="Register for an account"
      keywords="register, account, patient, doctor"
      author="Mohab Mohammed"
    />
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-4">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 lg:pr-8">
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=2000"
          alt="Doctor"
          className="rounded-2xl shadow-xl max-w-full h-auto"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-6">
            {currentStep === 1 ? 'Personal Info' : 
             currentStep === 2 ? 'Patient Registration' :
             'Registration Complete'}
          </h1>
          {currentStep === 2 && (
            <p className="text-gray-600 text-center mb-8">
              You need to provide some extra info for complete your registration
            </p>
          )}

          <Formik
            initialValues={initialValues}
            onSubmit={handleNext}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Field
                          name="firstName"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.firstName && touched.firstName
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          name="lastName"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.lastName && touched.lastName
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <Field
                        name="email"
                        type="email"
                        className={`peer w-full px-4 py-3 rounded-lg border ${
                          errors.email && touched.email
                            ? 'border-red-500'
                            : 'border-gray-300'
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
                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                      )}
                    </div>

                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`peer w-full px-4 py-3 rounded-lg border ${
                          errors.password && touched.password
                            ? 'border-red-500'
                            : 'border-gray-300'
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
                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                      )}
                    </div>

                    <div className="relative">
                      <Field
                        name="phone"
                        type="tel"
                        className={`peer w-full px-4 py-3 rounded-lg border ${
                          errors.phone && touched.phone
                            ? 'border-red-500'
                            : 'border-gray-300'
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
                        <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-lg text-gray-700 mt-12">Gender</label>
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
                        <div className="text-red-500 text-sm">{errors.gender}</div>
                      )}
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="relative">
                      <Field
                        name="dateOfBirth"
                        type="date"
                        className={`peer w-full px-4 py-3 rounded-lg border ${
                          errors.dateOfBirth && touched.dateOfBirth
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } focus:outline-none focus:border-blue-500`}
                      />
                      <label
                        htmlFor="dateOfBirth"
                        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600"
                      >
                        Date of Birth
                      </label>
                      {errors.dateOfBirth && touched.dateOfBirth && (
                        <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Field
                          name="occupation"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.occupation && touched.occupation
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.occupation}</div>
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          name="bloodType"
                          as="select"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.bloodType && touched.bloodType
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.bloodType}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Field
                          name="weight"
                          type="number"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.weight && touched.weight
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.weight}</div>
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          name="height"
                          type="number"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.height && touched.height
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.height}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Field
                          name="city"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.city && touched.city
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.city}</div>
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          name="area"
                          type="text"
                          className={`peer w-full px-4 py-3 rounded-lg border ${
                            errors.area && touched.area
                              ? 'border-red-500'
                              : 'border-gray-300'
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
                          <div className="text-red-500 text-sm mt-1">{errors.area}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800">Registration Complete!</h2>
                      <p className="text-gray-600 mt-2">Thank you for registering with us.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                )}

                {currentStep < 3 && (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Next
                  </button>
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