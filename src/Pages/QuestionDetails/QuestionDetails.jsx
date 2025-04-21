// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { supabase } from "../../Config/Supabase";
// import { getAuth } from "firebase/auth";
// import toast from "react-hot-toast";
// import { getUserDataByFirebaseUID } from "../../services/AuthService";
// import { DNA } from "react-loader-spinner";
// import MetaData from "../../Components/MetaData/MetaData";

// export default function QuestionDetails() {
//   const { id } = useParams();
//   const [question, setQuestion] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const currentUser = auth.currentUser;
//         if (!currentUser) {
//           toast.error("Please login to view question details");
//           return;
//         }

//         // Get Supabase user data
//         const { success, userData } = await getUserDataByFirebaseUID(
//           currentUser.uid
//         );
//         if (!success) throw new Error("Failed to fetch user data");

//         // Fetch question
//         const { data, error } = await supabase
//           .from("Questions")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (error) throw error;

//         // Verify ownership using Supabase user ID
//         if (data.user_id !== userData.id) {
//           throw new Error("Unauthorized access to this question");
//         }

//         setQuestion(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching question:", err);
//         setError(err.message);
//         setLoading(false);
//         toast.error(err.message);
//       }
//     };

//     fetchQuestion();
//   }, [id, auth]);

//   // Loading and error states remain the same...

//   if(loading){
//     return (
//       <div className="flex items-center justify-center">
//         <div className="text-center">
//           <DNA width={100} height={100} ariaLabel="dna-loader-QuestionDetail"/>
//         </div>
//       </div>
//     );
//   }

//   // error 
//   if(error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center text-red-500">
//           <h2>Error fetching Question</h2>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//     <MetaData
//       title={"Question Details | Medical System"}
//       keywords={"Questions, details, answers, medical system"}
//       description={"Details of the question asked by the patient"}
//       author={"Mohab Mohammed"}
//     />
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Back button remains the same */}

//       <h2 className="text-[#00155D] text-start text-3xl font-medium mb-6">
//         Question Details
//       </h2>

//       <div className="bg-white rounded-lg  p-6 border border-gray-100">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
//               {question.speciality}
//             </span>
//             <div className="mt-2 text-sm text-gray-500">
//               Asked on {new Date(question.created_at).toLocaleDateString()}
//             </div>
//           </div>
//           <span
//             className={`text-sm font-medium px-3 py-1 rounded-full ${
//               question.answered
//                 ? "bg-green-100 text-green-800"
//                 : "bg-yellow-100 text-yellow-800"
//             }`}
//           >
//             {question.answered ? "Answered" : "Pending"}
//           </span>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Question</h3>
//           <p className="text-gray-600 text-lg">{question.question}</p>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Details</h3>
//           <p className="text-gray-600 whitespace-pre-wrap">
//             {question.question_details}
//           </p>
//         </div>

//         <div className="grid grid-cols-2 gap-4 text-gray-600">
//           <div>
//             <span className="font-medium">Age:</span> {question.age}
//           </div>
//           <div>
//             <span className="font-medium">Gender:</span> {question.gender}
//           </div>
//         </div>

//         {question.answered && (
//           <div className="mt-8 pt-6 border-t border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Doctor's Answer
//             </h3>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-gray-700 whitespace-pre-wrap">
//                 {question.answer}
//               </p>
//               {question.answered_at && (
//                 <div className="mt-4 text-sm text-gray-500">
//                   Answered on{" "}
//                   {new Date(question.answered_at).toLocaleDateString()}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { getUserDataByFirebaseUID } from "../../services/AuthService";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import { FaUserMd } from "react-icons/fa";

export default function QuestionDetails() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          toast.error("Please login to view question details");
          return;
        }

        // Get Supabase user data
        const { success, userData } = await getUserDataByFirebaseUID(
          currentUser.uid
        );
        if (!success) throw new Error("Failed to fetch user data");

        const { data, error } = await supabase
          .from("Questions")
          .select(`
            id,
            question,
            question_details,
            user_id,
            doctor_id,
            gender,
            created_at,
            age,
            answer,
            speciality,
            answered,
            Doctors (
              id,
              first_name,
              last_name,
              specialty,
              image
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;

        // Verify ownership using Supabase user ID
        if (data.user_id !== userData.id) {
          throw new Error("Unauthorized access to this question");
        }

        setQuestion(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.message);
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchQuestion();
  }, [id, auth]);

  // Loading and error states remain the same...

  if(loading){
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <DNA width={100} height={100} ariaLabel="dna-loader-QuestionDetail"/>
        </div>
      </div>
    );
  }

  // error 
  if(error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <h2>Error fetching Question</h2>
        </div>
      </div>
    )
  }

  return (
    <>
      <MetaData
        title={`${question.answered ? 'Answered' : 'Pending'} Question | Medical System`}
        keywords={"Question details, medical query, doctor answer"}
        description={`Details of ${question.answered ? 'an answered' : 'a pending'} medical question`}
        author={"Mohab Mohammed"}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/questions" className="flex items-center text-[#00155D] hover:text-[#11319E] transition-colors">
            {/* Back button icon */}
            Back to Questions
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div className="mb-4 sm:mb-0">
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                <FaUserMd className="mr-2 w-4 h-4" />
                {question.speciality}
              </span>
              <div className="mt-3 text-sm text-gray-500">
                Asked on {new Date(question.created_at).toLocaleDateString()}
                {question.answered_at && ` • Answered on ${new Date(question.answered_at).toLocaleDateString()}`}
              </div>
            </div>
            <span className={`inline-flex items-center text-sm font-semibold px-4 py-2 rounded-full ${
              question.answered 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {question.answered ? "Answered" : "Pending"}
            </span>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-lg mb-8">
            <div className="flex items-center">
              <span className="mr-3 bg-white p-2 rounded-full">👤</span>
              <div>
                <p className="text-sm text-gray-500">Patient Age</p>
                <p className="text-lg font-semibold text-[#00155D]">{question.age} years</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 bg-white p-2 rounded-full">🚻</span>
              <div>
                <p className="text-sm text-gray-500">Patient Gender</p>
                <p className="text-lg font-semibold text-[#00155D] capitalize">{question.gender}</p>
              </div>
            </div>
          </div>

          {/* Question Details */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00155D] mb-4">Medical Question</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{question.question}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00155D] mb-4">Detailed Information</h3>
              <pre className="text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">
                {question.question_details}
              </pre>
            </div>

            {/* Doctor's Answer Section */}
            {question.answered && question.Doctors ? (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start mb-6">
                    <div className="mr-4">
                      {question.Doctors.image ? (
                        <img 
                          src={question.Doctors.image} 
                          alt={`Dr. ${question.Doctors.first_name}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUserMd className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#00155D]">
                        Dr. {question.Doctors.first_name} {question.Doctors.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {question.Doctors.specialty}
                      </p>
                      {question.answered_at && (
                        <p className="text-sm text-gray-500 mt-1">
                          Answered on {new Date(question.answered_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="prose max-w-none text-gray-700 bg-white p-4 rounded-lg border border-gray-100">
                    <pre className="whitespace-pre-wrap font-sans">{question.answer}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <h3 className="text-xl font-semibold text-[#00155D] mb-4">Doctor's Answer</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">Not Answered yet</p>
                </div>
              </div>
            )}

            {question.answered && !question.Doctors && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <h3 className="text-xl font-semibold text-[#00155D] mb-4">Doctor's Answer</h3>
                  <div className="prose max-w-none text-gray-700 bg-white p-4 rounded-lg border border-gray-100">
                    <pre className="whitespace-pre-wrap font-sans">{question.answer}</pre>
                  </div>
                  {question.answered_at && (
                    <div className="mt-4 text-sm text-gray-500">
                      Answered on {new Date(question.answered_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}