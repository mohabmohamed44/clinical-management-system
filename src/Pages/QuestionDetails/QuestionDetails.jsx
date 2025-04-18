import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import Style from "./QuestionDetails.module.css";

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

        const { data, error } = await supabase
          .from("Questions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data.user_id !== currentUser.uid) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <Link to="/questions" className="text-blue-500 hover:underline">
          Back to Questions
        </Link>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 text-lg mb-4">Question not found</div>
        <Link to="/questions" className="text-blue-500 hover:underline">
          Back to Questions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/questions" className="text-blue-500 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Questions
        </Link>
      </div>

      <h2 className="text-[#00155D] text-start text-3xl font-medium mb-6">Question Details</h2>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              {question.speciality}
            </span>
            <div className="mt-2 text-sm text-gray-500">
              Asked on {new Date(question.created_at).toLocaleDateString()}
            </div>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            question.answered 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {question.answered ? "Answered" : "Pending"}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Question</h3>
          <p className="text-gray-600 text-lg">{question.question}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Details</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{question.question_details}</p>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Doctor's Answer</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{question.answer}</p>
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
  );
}