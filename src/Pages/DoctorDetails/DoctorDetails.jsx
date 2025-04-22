import { Link, useParams } from "react-router-dom";
import React, { useState } from "react";
import { supabase } from "../../Config/Supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import MetaData from "../../Components/MetaData/MetaData";
import { DNA } from "react-loader-spinner";
import {
  getDoctorReviews,
  createDoctorReview,
} from "../../services/AuthService";

export default function DoctorDetails() {
  const auth = getAuth();
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data: doctorData, error: doctorError } = await supabase
        .from("Doctors")
        .select(
          `
          id,
          first_name,
          last_name,
          fee,
          phone,
          image,
          email,
          specialty,
          DoctorsInfo (
            about,
            experience,
            education
          )
        `
        )
        .eq("id", id)
        .single();

      if (doctorError) throw doctorError;

      const info = doctorData.DoctorsInfo?.[0] || {};
      const experience = info.experience ? JSON.parse(info.experience) : [];
      const education = info.education ? JSON.parse(info.education) : [];

      return {
        ...doctorData,
        info: {
          ...info,
          experience,
          education,
        },
      };
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["doctorReviews", id],
    queryFn: () => getDoctorReviews(id),
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login to submit a review");
      return;
    }

    const result = await createDoctorReview({
      doctorId: id,
      userId: auth.currentUser.uid,
      review: newReview,
      rate: rating,
    });

    if (result.success) {
      setNewReview("");
      setRating(5);
      queryClient.invalidateQueries(["doctorReviews", id]);
    } else {
      alert(result.error || "Failed to submit review");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <DNA height={90} width={80} ariaLabel="loading-indicator" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <MetaData
        title={`Dr. ${data.first_name} ${data.last_name} | ProHealth Medical HealthCare`}
        description="Detailed information about the doctor"
        keywords="doctor, details, information"
        author="Mohab Mohammed"
      />
      <div className="w-full object-cover min-h-screen">
        {/* Header Banner */}
        <div className="flex justify-start">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4 sm:px-0">
            Doctor Details
          </h2>
        </div>
        <div className="w-full absolute right-0 left-0">
          <div className="h-[300px] md:h-[400px] bg-[#00155D] w-full right-0 left-0 z-50">
            <div className="container mx-auto p-2 h-full md:flex md:justify-end md:items-start">
              <div className="max-w-lg text-left mt-2 px-4 md:px-0 md:lg:xl:mr-107 py-7">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
                  Dr. {data.first_name} {data.last_name}
                </h1>
                <h2 className="text-lg sm:text-xl mb-2 text-white">
                  {data.specialty}
                </h2>
                <p className="text-white text-sm sm:text-base">
                  {data.info?.about ||
                    "Experienced medical professional specializing in patient care"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:mt-68 mt-65 md:mt-32 relative z-10">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column - Doctor Info */}
            <div className="md:col-span-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg transform translate-y-0">
                <img
                  src={
                    data.image ||
                    "https://placehold.co/400x400/0A2357/FFFFFF.png"
                  }
                  alt={`Dr. ${data.first_name} ${data.last_name}`}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="bg-[#3182CE] text-white py-3 px-4 text-center text-lg font-semibold">
                  {data.specialty} Department
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Contact Info</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <p className="flex items-center">
                        <span>{data.phone}</span>
                      </p>
                      <p className="flex items-center">
                        <span>{data.email}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Doctor Details */}
            <div className="md:col-span-8 mt-10 md:mt-40">
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg space-y-8">
                {/* Degrees Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 3.94 1.687a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3z" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      Degrees
                    </h3>
                  </div>
                  <ul className="space-y-4 text-gray-600 text-sm sm:text-base">
                    {data.info.education.map((edu, index) => (
                      <li key={index}>
                        <h4 className="font-semibold">{edu.university}</h4>
                        <p className="text-sm">{edu.degree}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Experience Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      Experiences
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                    {data.info.experience.map((exp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          {exp.years} years of experience with{" "}
                          {exp.cases_handled}+ cases handled
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Book Now Button */}
                <Link
                  to={`/book/${data.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 mt-4 text-xl font-semibold text-white 
                  bg-[#11319E] hover:bg-[#0d2a8a] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 
                  transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  relative overflow-hidden group"
                >
                  <span className="relative z-10">Book Now</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
