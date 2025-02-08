import { Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
  const { t, i18n } = useTranslation(); // Use i18n for language direction
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div
      className="max-h-screen flex items-center justify-center mt-20 p-4"
      dir={i18n.dir()} // Dynamically set direction (ltr or rtl)
    >
      <div className="max-w-5xl w-full mt-30 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8" dir={i18n.dir()}>
          {t('ContactUs')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=" "
              required
              dir={i18n.dir()} // Ensure input direction matches language
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              dir={i18n.dir()} // Add dir attribute to label
            >
              {t('Name')}
            </label>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=" "
              required
              dir={i18n.dir()} // Ensure input direction matches language
            />
            <label
              htmlFor="email"
              className="absolute placeholder:rtl:text-start left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              dir={i18n.dir()} // Add dir attribute to label
            >
              {t('Email')}
            </label>
          </div>

          {/* Subject Field */}
          <div className="relative">
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=" "
              required
              dir={i18n.dir()} // Ensure input direction matches language
            />
            <label
              htmlFor="subject"
              className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              dir={i18n.dir()} // Add dir attribute to label
            >
              {t('Subject')}
            </label>
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder=" "
              required
              dir={i18n.dir()} // Ensure textarea direction matches language
            ></textarea>
            <label
              htmlFor="message"
              className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              dir={i18n.dir()} // Add dir attribute to label
            >
              {t('Message')}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#113193] text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#11319e] focus:ring-offset-2"
          >
            <span className='mr-3 rtl:ml-3'>{t('SendMessage')}</span> <Send />
          </button>
        </form>
      </div>
    </div>
  );
}