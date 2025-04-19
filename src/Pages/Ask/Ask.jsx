import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MetaData from "../../Components/MetaData/MetaData";
import { DNA } from "react-loader-spinner";
import { FaUser, FaStethoscope, FaVenusMars, FaBirthdayCake } from "react-icons/fa";
import toast from "react-hot-toast";
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    // Convert the string format to a number for INT8 compatibility
    return parseInt(`${year}${month}${randomNum}`, 10);
  };

  if (specialtiesLoading) return (
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
        url={window.location.href}
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Ask a Medical Question
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
            {({ isSubmitting, errors, touched }) => (
              <Form className="bg-white p-4 md:p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Specialty Field - Fixed key warning */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#00155D] mb-2 flex items-center gap-2">
                      <FaStethoscope className="text-[#1972EE]" />
                      Specialty
                    </label>
                    <Field
                      as="select"
                      name="speciality"
                      className={`w-full outline-0 px-4 py-3 border-2 ${
                        errors.speciality && touched.speciality
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                    >
                      <option value="" disabled>Select Specialty</option>
                      {specialties?.map((spec) => (
                        <option key={spec.specialty} value={spec.specialty}>
                          {spec.specialty}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="speciality"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#00155D] mb-2 flex items-center gap-2">
                      <FaVenusMars className="text-[#1972EE]" />
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className={`w-full outline-0 px-4 py-3 border-2 ${
                        errors.gender && touched.gender
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                    >
                      <option value="Choose" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Age Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#00155D] mb-2 flex items-center gap-2">
                      <FaBirthdayCake className="text-[#1972EE]" />
                      Age
                    </label>
                    <Field
                      type="number"
                      name="age"
                      className={`w-full outline-0 px-4 py-3 border-2 ${
                        errors.age && touched.age
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Question Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#00155D] mb-2">
                      Your Question
                    </label>
                    <Field
                      name="question"
                      as="textarea"
                      rows=" outline-03"
                      className={`w-full px-4 py-3 border-2 ${
                        errors.question && touched.question
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      placeholder="Enter your main question..."
                    />
                    <ErrorMessage
                      name="question"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Details Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#00155D] mb-2">
                      Detailed Information
                    </label>
                    <Field
                      name="question_details"
                      as="textarea"
                      rows=" outline-05"
                      className={`w-full px-4 py-3 border-2 ${
                        errors.question_details && touched.question_details
                          ? "border-red-500"
                          : "border-[#1972EE]"
                      } rounded-md focus:ring-2 focus:ring-[#1972EE]`}
                      placeholder="Include relevant details about your medical history, symptoms, duration, etc."
                    />
                    <ErrorMessage
                      name="question_details"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>


                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border-2 border-[#00155D] text-[#00155D] rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 bg-[#1972EE] text-white rounded-md hover:bg-[#00155D] disabled:bg-gray-400"
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Question"}
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