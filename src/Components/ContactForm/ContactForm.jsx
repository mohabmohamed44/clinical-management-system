import { useFormik } from 'formik';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Define handleSubmit function before using it in Formik
  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', values);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      resetForm();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('fullNameRequired')),
    email: Yup.string().email(t('Invalid email address')).required(t('EmailRequired')),
    subject: Yup.string().required(t('SubjectRequired')),
    message: Yup.string().required(t('MessageRequired'))
  });

  // contactForm Formik
  const contactFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });
  
  return (
    <div
      className="max-h-screen flex items-center justify-center mt-20 p-4"
      dir={i18n.dir()}
    >
      <div className="max-w-5xl w-full mt-30 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8" dir={i18n.dir()}>
          {t('ContactUs')}
        </h2>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {t('Your message has been sent successfully! We will get back to you soon.')}
          </div>
        )}

        <form onSubmit={contactFormik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={contactFormik.values.name}
              onChange={contactFormik.handleChange}
              onBlur={contactFormik.handleBlur}
              className={`peer w-full border ${
                contactFormik.touched.name && contactFormik.errors.name 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder=" "
              dir={i18n.dir()}
            />
            <label
              htmlFor="name"
              className={`absolute ${i18n.dir() === 'rtl' ? 'right-4' : 'left-4'} top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500`}
              dir={i18n.dir()}
            >
              {t('Name')}
            </label>
            {contactFormik.touched.name && contactFormik.errors.name && (
              <p className="mt-1 text-red-500 text-xs">{contactFormik.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={contactFormik.values.email}
              onChange={contactFormik.handleChange}
              onBlur={contactFormik.handleBlur}
              className={`peer w-full border ${
                contactFormik.touched.email && contactFormik.errors.email 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder=" "
              dir={i18n.dir()}
            />
            <label
              htmlFor="email"
              className={`absolute ${i18n.dir() === 'rtl' ? 'right-4' : 'left-4'} top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500`}
              dir={i18n.dir()}
            >
              {t('Email')}
            </label>
            {contactFormik.touched.email && contactFormik.errors.email && (
              <p className="mt-1 text-red-500 text-xs">{contactFormik.errors.email}</p>
            )}
          </div>

          {/* Subject Field */}
          <div className="relative">
            <input
              type="text"
              id="subject"
              name="subject"
              value={contactFormik.values.subject}
              onChange={contactFormik.handleChange}
              onBlur={contactFormik.handleBlur}
              className={`peer w-full border ${
                contactFormik.touched.subject && contactFormik.errors.subject 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder=" "
              dir={i18n.dir()}
            />
            <label
              htmlFor="subject"
              className={`absolute ${i18n.dir() === 'rtl' ? 'right-4' : 'left-4'} top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500`}
              dir={i18n.dir()}
            >
              {t('Subject')}
            </label>
            {contactFormik.touched.subject && contactFormik.errors.subject && (
              <p className="mt-1 text-red-500 text-xs">{contactFormik.errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={contactFormik.values.message}
              onChange={contactFormik.handleChange}
              onBlur={contactFormik.handleBlur}
              rows="4"
              className={`peer w-full border ${
                contactFormik.touched.message && contactFormik.errors.message 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
              placeholder=" "
              dir={i18n.dir()}
            ></textarea>
            <label
              htmlFor="message"
              className={`absolute ${i18n.dir() === 'rtl' ? 'right-4' : 'left-4'} top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500`}
              dir={i18n.dir()}
            >
              {t('Message')}
            </label>
            {contactFormik.touched.message && contactFormik.errors.message && (
              <p className="mt-1 text-red-500 text-xs">{contactFormik.errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center ${
              isSubmitting ? 'bg-gray-400' : 'bg-[#113193] hover:bg-blue-700'
            } text-white py-4 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#11319e] focus:ring-offset-2`}
          >
            <span className={`${i18n.dir() === 'rtl' ? 'ml-3' : 'mr-3'}`}>
              {isSubmitting ? t('Sending...') : t('SendMessage')}
            </span> 
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
}