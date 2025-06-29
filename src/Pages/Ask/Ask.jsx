import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MetaData from "../../Components/MetaData/MetaData";
import { DNA } from "react-loader-spinner";
import {
  FaUser,
  FaStethoscope,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { getUserDataByFirebaseUID } from "../../services/AuthService";

const QuestionSchema = Yup.object().shape({
  speciality: Yup.string().required("Specialty is required"),
  gender: Yup.string()
    .required("Gender is required")
    .notOneOf(["Choose"], "Please select a gender"),
  age: Yup.number()
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .required("Age is required"),
  question: Yup.string()
    .min(10, "Question must be at least 10 characters")
    .required("Question is required"),
  question_details: Yup.string()
    .min(20, "Details must be at least 20 characters")
    .required("Details are required"),
});

export default function AskQuestionForm() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { t } = useTranslation();
  const { data: specialties, isLoading: specialtiesLoading } = useQuery({
    queryKey: ["Specialties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Specialties")
        .select("specialty")
        .order("specialty", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // In AskQuestionForm component
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");

      // Get Supabase user data using Firebase UID
      const { userData } = await getUserDataByFirebaseUID(currentUser.uid);
      if (!userData) throw new Error("User not found in database");

      const questionData = {
        id: generateQuestionId(),
        user_id: userData.id, // Use Supabase user ID (PAT-...)
        speciality: formData.speciality,
        gender: formData.gender,
        age: formData.age,
        question: formData.question,
        question_details: formData.question_details,
        answered: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("Questions")
        .insert([questionData]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Question submitted successfully!");
      navigate("/questions");
    },
    onError: (error) => toast.error(error.message),
  });

  const generateQuestionId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    // Convert the string format to a number for INT8 compatibility
    return parseInt(`${year}${month}${randomNum}`, 10);
  };

  if (specialtiesLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA width={90} height={90} ariaLabel="loading" />
      </div>
    );

  return (
    <>
      <MetaData
        title={"Ask Question | HealthCare"}
        description={"Ask medical questions to professionals"}
        name={"Ask Question"}
        type="website"
        author={"Mohab Mohammed"}
        url={window.location.href}
      />

      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00155D] mb-4 sm:mb-6 text-center">
            {t("Ask")}
          </h1>

          <Formik
            initialValues={{
              speciality: "",
              gender: "Choose",
              age: "",
              question: "",
              question_details: "",
            }}
            validationSchema={QuestionSchema}
            onSubmit={(values) => mutation.mutate(values)}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form className="p-3 sm:p-4 md:p-6 rounded-lg w-full">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Specialty Field with Headless UI Menu */}
                  <div className="w-full">
                    <label className="text-sm font-medium text-[#00155D] mb-2 flex items-center justify-start gap-2">
                      <FaStethoscope className="text-[#1972EE]" />
                      {t("specialty")}
                    </label>
                    <Menu as="div" className="relative w-full">
                      <MenuButton
                        className={`w-full outline-0 px-4 py-2 sm:py-3 border-2 text-start flex items-center justify-between ${
                          errors.speciality && touched.speciality
                            ? "border-red-500"
                            : "border-[#1972EE]"
                        } rounded-md focus:ring-2 focus:ring-[#1972EE] bg-white`}
                      >
                        <span
                          className={`block truncate ${
                            !values.speciality && "text-gray-400"
                          }`}
                        >
                          {values.speciality || t("SelectSpecialty")}
                        </span>
                        <ChevronDown
                          className="h-5 w-5 text-[#1972EE]"
                          aria-hidden="true"
                        />
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <div className="py-1">
                          {specialties?.map((spec) => (
                            <MenuItem
                              key={spec.specialty}
                              value={spec.specialty}
                            >
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={`${
                                    active
                                      ? "bg-[#1972EE] text-white"
                                      : "text-gray-900"
                                  } group flex w-full items-center px-4 py-2 text-sm`}
                                  onClick={() =>
                                    setFieldValue(
                                      "speciality",
                                      t(spec.specialty),
                                    )
                                  }
                                >
                                  {t(spec.specialty)}
                                </button>
                              )}
                            </MenuItem>
                          ))}
                        </div>
                      </MenuItems>
                    </Menu>
                    <ErrorMessage
                      name="speciality"
                      component="div"
                      className="text-red-500 text-sm mt-1 text-center"
                    />
                  </div>

                  {/* Gender and Age Fields Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Gender Field */}
                    <div>
                      <label className="text-sm font-medium text-[#00155D] mb-2 flex items-center justify-start gap-2">
                        <FaVenusMars className="text-[#1972EE]" />
                        {t("gender")}
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        className={`w-full outline-0 px-4 py-2 sm:py-3 border-2 text-center appearance-none ${
                          errors.gender && touched.gender
                            ? "border-red-500"
                            : "border-[#1972EE]"
                        } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      >
                        <option value="Choose" disabled>
                          {t("SelectGender")}
                        </option>
                        <option value="male">{t("Male")}</option>
                        <option value="female">{t("Female")}</option>
                        <option value="other">{t("Notprefertosay")}</option>
                      </Field>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="text-red-500 text-sm mt-1 text-center"
                      />
                    </div>

                    {/* Age Field */}
                    <div>
                      <label className="text-sm font-medium text-[#00155D] mb-2 flex items-center justify-start gap-2">
                        <FaBirthdayCake className="text-[#1972EE]" />
                        {t("age")}
                      </label>
                      <Field
                        type="number"
                        name="age"
                        className={`w-full outline-0 px-4 py-2 sm:py-3 border-2 text-center ${
                          errors.age && touched.age
                            ? "border-red-500"
                            : "border-[#1972EE]"
                        } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      />
                      <ErrorMessage
                        name="age"
                        component="div"
                        className="text-red-500 text-sm mt-1 text-center"
                      />
                    </div>
                  </div>

                  {/* Question Fields */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-[#00155D] mb-2 text-start">
                      {t("YourQuestion")}
                    </label>
                    <Field
                      name="question"
                      as="textarea"
                      rows="3"
                      className={`w-full px-4 py-2 sm:py-3 border-2 ${
                        errors.question && touched.question
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      placeholder={t("QuestionMain")}
                    />
                    <ErrorMessage
                      name="question"
                      component="div"
                      className="text-red-500 text-sm mt-1 text-center"
                    />
                  </div>

                  {/* Details Field */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-[#00155D] mb-2 text-start">
                      {t("DetailedInformation")}
                    </label>
                    <Field
                      name="question_details"
                      as="textarea"
                      rows="5"
                      className={`w-full px-4 py-2 sm:py-3 border-2 ${
                        errors.question_details && touched.question_details
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      placeholder={t("DetailsPlaceholder")}
                    />
                    <ErrorMessage
                      name="question_details"
                      component="div"
                      className="text-red-500 text-sm mt-1 text-center"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border-2 cursor-pointer border-[#00155D] text-[#00155D] rounded-md hover:bg-gray-50 w-full sm:w-auto"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 bg-[#1972EE] text-white rounded-md hover:bg-[#00155D] disabled:bg-gray-400 w-full sm:w-auto"
                  >
                    {mutation.isPending ? (
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
                      t("SubmitRequest")
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
