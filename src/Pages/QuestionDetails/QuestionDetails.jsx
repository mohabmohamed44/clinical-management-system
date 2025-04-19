import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { getUserDataByFirebaseUID } from "../../services/AuthService";
import { DNA } from "react-loader-spinner";

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

        // Fetch question
        const { data, error } = await supabase
          .from("Questions")
          .select("*")
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button remains the same */}

      <h2 className="text-[#00155D] text-start text-3xl font-medium mb-6">
        Question Details
      </h2>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              {question.speciality}
            </span>
            <div className="mt-2 text-sm text-gray-500">
              Asked on {new Date(question.created_at).toLocaleDateString()}
            </div>
          </div>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              question.answered
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {question.answered ? "Answered" : "Pending"}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Question</h3>
          <p className="text-gray-600 text-lg">{question.question}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Details</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {question.question_details}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <span className="font-medium">Age:</span> {question.age}
          </div>
          <div>
            <span className="font-medium">Gender:</span> {question.gender}
          </div>
        </div>

        {question.answered && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Doctor's Answer
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {question.answer}
              </p>
              {question.answered_at && (
                <div className="mt-4 text-sm text-gray-500">
                  Answered on{" "}
                  {new Date(question.answered_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
