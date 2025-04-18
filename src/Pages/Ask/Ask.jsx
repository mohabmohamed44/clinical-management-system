import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const generateQuestionId = () => {
  // Generate a random 8-digit integer as string
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Validation schema
const QuestionSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"),
  gender: Yup.string().notOneOf(["Choose"], "Please select a gender"),
  age: Yup.number()
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .required("Age is required"),
  question_details: Yup.string()
    .min(10, "Question details must be at least 10 characters")
    .required("Question details are required"),
});

export default function AskQuestionForm() {
  const navigate = useNavigate();
  const auth = getAuth(); // Get Firebase auth instance

  // Initial form values
  const initialValues = {
    specialty: "",
    gender: "Choose",
    age: "",
    question: "",
    question_details: "",
  };

  // Fetch specialties from database
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

  const mutation = useMutation({
    mutationFn: async (formData) => {
      try {
        // Get current Firebase user
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        // Debug log to verify what's being sent
        const questionData = {
          id: generateQuestionId(),
          speciality: formData.speciality,
          gender: formData.gender,
          age: parseInt(formData.age),
          question_details: formData.question_details,
          question: formData.question,
          user_id: currentUser.uid, // Use Firebase UID
          doctor_id: null, // Set to null as we're not selecting a doctor
          answer: null,
          answered: false,
          created_at: new Date().toISOString(),
        };
        
        console.log("Submitting to Supabase:", {
          table: "Questions", // Note: capital 'Q' in Questions
          data: questionData
        });

        // Make sure the table name has the correct case - "Questions" with capital Q
        const { data, error } = await supabase
          .from("Questions") 
          .insert([questionData]);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Submission error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      navigate("/questions");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      alert(`Error submitting question: ${error.message || "Unknown error"}`);
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
        Ask a Medical Question
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={QuestionSchema}
        onSubmit={(values, { setSubmitting }) => {
          mutation.mutate(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialty Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-blue-700">
                  Specialty
                </label>
                <Field
                  as="select"
                  name="specialty"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.specialty && touched.specialty
                      ? "border-red-500"
                      : "border-blue-200"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                >
                  <option value="" disabled>
                    Select a specialty
                  </option>
                  {specialtiesLoading ? (
                    <option>Loading specialties...</option>
                  ) : (
                    specialties?.map((spec) => (
                      <option key={spec.specialty} value={spec.specialty}>
                        {spec.specialty}
                      </option>
                    ))
                  )}
                </Field>
                <ErrorMessage
                  name="specialty"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-700">
                  Gender
                </label>
                <Field
                  as="select"
                  name="gender"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.gender && touched.gender
                      ? "border-red-500"
                      : "border-blue-200"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                >
                  <option value="Choose" disabled>
                    Choose Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-700">
                  Age
                </label>
                <Field
                  type="number"
                  name="age"
                  min="0"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.age && touched.age ? "border-red-500" : "border-blue-200"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                />
                <ErrorMessage
                  name="age"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Question Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-blue-700">
                  Question
                </label>
                <Field
                  type="text"
                  name="question"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.question && touched.question
                      ? "border-red-500"
                      : "border-blue-200"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                  placeholder="Enter your question..."
                />
                <ErrorMessage
                  name="question"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Question Details Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-blue-700">
                  Question Details
                </label>
                <Field
                  as="textarea"
                  name="question_details"
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.question_details && touched.question_details
                      ? "border-red-500"
                      : "border-blue-200"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                  placeholder="Please describe your question in detail..."
                />
                <ErrorMessage
                  name="question_details"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 disabled:bg-blue-300 transition-all font-semibold
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {mutation.isPending ? "Submitting..." : "Submit Question"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}