import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowRight, ArrowLeft, Image as ImageIcon } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logo.webp'
import { supabase } from "../../Config/Supabase";
import { Listbox, ListboxButton, ListboxOptions } from "@headlessui/react";

export default function SearchCard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const { data, error } = await supabase
        .from("Specialties")
        .select("id, specialty, image")
        .order("specialty", { ascending: true })
        .eq("type", "Doctor");

      if (error) {
        console.error("Error fetching specialties:", error);
        return;
      }

      setSpecialties(data.map(spec => ({
        id: spec.id,
        name: i18n.language === "ar" ? spec.name_ar || spec.specialty : spec.specialty,
        logo: spec.image || Logo,
      })));
    };

    fetchSpecialties();
  }, [i18n.language]);

  const searchValidationSchema = Yup.object().shape({
    specialty: Yup.object()
      .shape({
        id: Yup.string().required(),
        name: Yup.string().required(),
        logo: Yup.string().nullable()
      })
      .required(t("SpecialtyRequired")),
    location: Yup.string().required(t("LocationInputRequired"))
  });

  const formik = useFormik({
    initialValues: {
      specialty: null,
      location: "",
    },
    validationSchema: searchValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        // Translate Arabic city names to English for search
        let locationTerm = values.location.trim();
        // Add more mappings as needed
        const cityTranslations = {
          "القاهرة": "Cairo",
          "الجيزة": "Giza",
          "الإسكندرية": "Alexandria",
        };
        if (cityTranslations[locationTerm]) {
          locationTerm = cityTranslations[locationTerm];
        }
        const specialtyTerm = encodeURIComponent(values.specialty.name);
        locationTerm = encodeURIComponent(locationTerm);

        navigate(`/find_doctor?specialty=${specialtyTerm}&location=${locationTerm}`);
      } catch (err) {
        console.error("Search error:", err);
        setError(t("SearchError"));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-70 sm:mt-60 md:mt-32 lg:mt-36">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
          {t("FindDoctor")}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Specialty Select */}
            <div className="col-span-1 md:col-span-2">
              <Listbox
                value={formik.values.specialty}
                onChange={(value) => formik.setFieldValue("specialty", value)}
                as="div"
                className="relative"
              >
                <Listbox.Label
                  className={`block text-md font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("specialty")}
                </Listbox.Label>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-3 pl-4 pr-10 text-left shadow-sm border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                    <span className="block truncate">
                      {formik.values.specialty ? (
                        <div className="flex items-center">
                          <img
                            src={formik.values.specialty.logo}
                            alt={formik.values.specialty.name}
                            className="h-8 w-8 flex-shrink-0 rounded-full object-contain"
                          />
                          <span
                            className={`block truncate ${
                              isRTL ? "mr-3" : "ml-3"
                            }`}
                          >
                            {t(formik.values.specialty.name)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {t("SelectSpecialty")}
                        </span>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ArrowIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {specialties.map((specialty) => (
                      <Listbox.Option
                        key={specialty.id}
                        value={specialty}
                        className={({ active, selected }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active
                              ? "bg-blue-50 text-blue-900"
                              : "text-gray-900"
                          } ${selected ? "bg-blue-50" : ""}`
                        }
                      >
                        {({ selected, active }) => (
                          <div className="flex items-center">
                            <img
                              src={specialty.logo}
                              alt={specialty.name}
                              className="h-8 w-8 flex-shrink-0 rounded-full object-contain"
                            />
                            <span
                              className={`${
                                isRTL ? "mr-3" : "ml-3"
                              } block truncate ${
                                selected ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {t(specialty.name)}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {formik.touched.specialty && formik.errors.specialty && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.specialty}
                </p>
              )}
            </div>

            {/* Location Input */}
            <div className="col-span-1">
              <label
                htmlFor="location"
                className={`block text-md font-medium text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("City")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div
                  className={`absolute inset-y-0 ${
                    isRTL ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`block w-full rounded-md border ${
                    formik.touched.location && formik.errors.location
                      ? "border-red-500"
                      : "border-gray-300"
                  } py-3 ${
                    isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
                  } focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  placeholder={t("e.g. Cairo")}
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Error message display */}
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

          {/* Search Button */}
          <div
            className={`mt-4 flex ${isRTL ? "justify-start" : "justify-end"}`}
          >
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#00155D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-300 disabled:opacity-70"
            >
              {loading ? t("Searching") : t("FindDoctor")}
              {!loading && <ArrowIcon className="ml-2 h-5 w-5 rtl:mr-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
