import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { supabase } from "../../Config/Supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Questions() {
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch questions query
  const { 
    data: questions,
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("Questions")
        .select("*")
        .eq("user_id", currentUser.uid)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Auth state check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        toast.error("Please login to view questions");
        navigate("/login");
      } else {
        refetch();
      }
    });
    return unsubscribe;
  }, [navigate, refetch]);

  const currentUser = auth.currentUser;

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading your questions...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-700 mb-4">{error?.message || "Failed to load questions"}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Questions</h1>
            </div>
            
            {currentUser && (
              <div className="flex items-center gap-4">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="text-gray-800 font-medium">
                    {currentUser.displayName || "User"}
                  </div>
                  <div className="text-sm text-gray-500">{currentUser.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Questions ({questions?.length || 0})
          </h2>
          <button
            onClick={() => navigate("/ask-question")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ask New Question
          </button>
        </div>

        {questions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map(question => (
              <Link 
                to={`/questions/${question.id}`} 
                key={question.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="p-5 flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {question.speciality}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(question.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {question.question}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {question.question_details}
                  </p>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      {question.gender}, {question.age} years
                    </span>
                  </div>
                  <div>
                    {question.answered ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Answered
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No questions yet</h3>
              <p className="mt-1 text-gray-500">You haven't asked any medical questions.</p>
            </div>
            <button
              onClick={() => navigate("/ask-question")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Ask Your First Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}