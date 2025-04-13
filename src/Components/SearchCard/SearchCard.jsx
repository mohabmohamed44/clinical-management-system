import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export default function SearchCard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [error, setError] = useState(false);
  // Validation schema
  const searchValidationSchema = Yup.object().shape({
    search: Yup.string().required(t("SearchInputRequired")),
    location: Yup.string().required(t("LocationInputRequired")),
    date: Yup.string().required(t("DateInputRequired"))
  });
  
  // Formik implementation
  const formik = useFormik({
    initialValues: {
      search: '',
      location: '',
      date: '',
    },
    validationSchema: searchValidationSchema,
    onSubmit: (values) => {
      // Navigate to search results page with query parameters
      navigate(`/find_doctor?query=${values.search}&location=${values.location}&date=${values.date}`);
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-80 sm:mt-60 md:mt-32 lg:mt-36">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('FindDoctor')}
        </h2>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="search" className={`block text-md font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('searchway')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className={`block w-full rounded-md border ${formik.touched.search && formik.errors.search 
                    ? 'border-red-500' 
                    : 'border-gray-300'} py-3 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} focus:border-blue-500 focus:ring-blue-500 text-gray-900 shadow-sm`}
                  placeholder={t('e.g. Cardiology, Dr. Smith')}
                  value={formik.values.search}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.search && formik.errors.search && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.search}</p>
              )}
            </div>

            {/* Location Input */}
            <div className="col-span-1">
              <label htmlFor="location" className={`block text-md font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Location')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`block w-full rounded-md border ${formik.touched.location && formik.errors.location 
                    ? 'border-red-500' 
                    : 'border-gray-300'} py-3 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  placeholder={t('Any City')}
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
              )}
            </div>

            {/* Date Input */}
            <div className="col-span-1">
              <label htmlFor="date" className={`block text-md font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Date')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`block w-full rounded-md border ${formik.touched.date && formik.errors.date 
                    ? 'border-red-500' 
                    : 'border-gray-300'} py-3 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.date && formik.errors.date && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className={`mt-4 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-300"
            >
              {t('FindDoctor')}
              <ArrowIcon className="ml-2 h-5 w-5 rtl:mr-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
