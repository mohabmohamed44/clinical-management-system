import { Link, useParams } from "react-router-dom";
import React, { useState} from "react";
import { supabase } from "../../Config/Supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import MetaData from "../../Components/MetaData/MetaData";
import toast from "react-hot-toast";
import { DNA } from "react-loader-spinner";
import {
  getDoctorReviews,
  createDoctorReview,
} from "../../services/AuthService";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaMoneyBillWave,
  FaClinicMedical,
} from "react-icons/fa";

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
          rate,
          rate_count,
          DoctorsInfo (
            about,
            experience,
            education
          ),
          Clinics (
            id,
            government,
            city,
            street,
            phones,
            work_times,
            rate,
            rate_count,
            fee,
            services
          )
        `
        )
        .eq("id", id)
        .single();

      if (doctorError) throw doctorError;

      return {
        ...doctorData,
        info: doctorData.DoctorsInfo || {},
        clinic: doctorData.Clinics || null,
        work_times: doctorData.Clinics?.work_times || [],
      };
    },
  });

  const { 
    data: reviewsData, 
    refetch: refetchReviews,
    isLoading: reviewsLoading
  } = useQuery({
    queryKey: ["doctorReviews", id],
    queryFn: () => getDoctorReviews(id),
    enabled: !!id, // Only run query if id is available
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      const result = await createDoctorReview({
        doctorId: id,
        userId: auth.currentUser.uid,
        review: newReview,
        rate: rating
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit review");
      }

      setNewReview("");
      setRating(5);
      
      // Force refetch reviews
      await refetchReviews();
      
      // Also invalidate doctor data to update ratings
      queryClient.invalidateQueries(["doctor", id]);
      
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (count, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <FaStar
          key={index}
          className={`${index < count ? "text-yellow-400" : "text-gray-300"} ${
            interactive ? "cursor-pointer" : ""
          }`}
          onClick={interactive ? () => setRating(index + 1) : undefined}
          size={interactive ? 24 : 18}
        />
      ));
  };

  const formatDay = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (typeof day === "string") {
      const foundDay = days.find((d) => d.toLowerCase() === day.toLowerCase());
      return foundDay || day;
    }
    return typeof day === "number" && day >= 0 && day < 7 ? days[day] : day;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    } catch {
      return "Invalid time";
    }
  };

  const getReviewAuthor = (review) => {
    if (auth.currentUser?.uid === review.user_id) return "You";
    return `${review.Users?.first_name || "Anonymous"} ${
      review.Users?.last_name || ""
    }`;
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
        description={data.info?.about || "Experienced medical professional"}
        keywords={`doctor, ${data.specialty}, healthcare`}
        author="Mohab Mohammed"
      />

      <div className="w-full object-cover min-h-screen">
        <div className="flex justify-start">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4 sm:px-0">
            Doctor Details
          </h2>
        </div>

        {/* Doctor Profile Header */}
        <div className="w-full absolute right-0 left-0">
          <div className="h-[300px] md:h-[400px] bg-gradient-to-b from-[#11319E] to-[#061138] w-full right-0 left-0 z-50">
            <div className="container mx-auto p-2 h-full md:flex md:justify-end md:items-start">
              <div className="max-w-xl text-left mt-4 px-4 md:px-0 md:lg:xl:mr-112 md:lg:xl:pr-30 py-7">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
                  Dr. {data.first_name} {data.last_name}
                </h1>
                <h2 className="text-lg sm:text-xl mb-2 text-white">
                  {data.specialty}
                </h2>
                <div className="flex items-center text-white mb-2">
                  <div className="flex">
                    {renderStars(Math.round(data.rate || 0))}
                  </div>
                  <span className="ml-2 text-sm">
                    ({data.rate_count?.toLocaleString() || 0} reviews)
                  </span>
                </div>
                <p className="text-white text-sm sm:text-base">
                  {data.info?.about || "Experienced medical professional"}
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
              <div className="bg-white rounded-lg overflow-hidden shadow transform translate-y-0">
                <img
                  src={
                    data.image ||
                    "https://placehold.co/400x400/0A2357/FFFFFF.png"
                  }
                  alt={`Dr. ${data.first_name} ${data.last_name}`}
                  className="w-full h-64 sm:h-80 object-cover"
                  width={400}
                  height={400}
                  loading="lazy"
                />

                <div className="bg-[#3182CE] text-white py-3 px-4 text-center text-lg font-semibold">
                  {data.specialty} Department
                </div>

                <div className="p-6 space-y-6">
                  {/* Doctor Fee */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Consultation Fee
                    </h3>
                    <p className="text-2xl font-bold text-blue-800">
                      {data.fee ? `${data.fee} EGP` : "Not specified"}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Contact Info</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <p>{data.phone || "N/A"}</p>
                      <p>{data.email || "N/A"}</p>
                    </div>
                  </div>

                  {/* Clinic Information */}
                  {data.clinic && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        Clinic Information
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-gray-600">
                            {[
                              data.clinic.government,
                              data.clinic.city,
                              data.clinic.street,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>

                      {/* Contact Numbers */}
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-blue-600" />
                        <div>
                          <p className="font-medium">Contact Numbers</p>
                          <div className="flex flex-wrap gap-2">
                            {data.clinic.phones && Array.isArray(data.clinic.phones) && data.clinic.phones.length > 0 ? (
                              data.clinic.phones.map((phone, index) => (
                                <a
                                  key={index}
                                  href={`tel:${phone}`}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  {phone}
                                </a>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">
                                No phone numbers available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        <div>
                          <p className="font-medium">Rating</p>
                          <p className="text-sm text-gray-600">
                            {data.clinic.rate?.toFixed(1) || "N/A"} (
                            {data.clinic.rate_count || 0} reviews)
                          </p>
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-blue-600" />
                        <div>
                          <p className="font-medium">Consultation Fee</p>
                          <p className="text-sm text-gray-600">
                            {data.clinic.fee
                              ? `${data.clinic.fee} EGP`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Services */}
                      {data.clinic.services && (
                        <div className="flex items-center gap-2">
                          <FaClinicMedical className="text-blue-600" />
                          <div>
                            <p className="font-medium">Services</p>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(data.clinic.services) ? (
                                data.clinic.services.map((service, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                  >
                                    {service}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No services listed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Work Times */}
                      {data.clinic.work_times && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-600" />
                          <div>
                            <p className="font-medium">Working Hours</p>
                            <div className="mt-1 space-y-1">
                              {Array.isArray(data.clinic.work_times) ? (
                                data.clinic.work_times.map((timeSlot, index) => (
                                  <div key={index} className="text-xs text-gray-600">
                                    <span className="font-medium">{formatDay(timeSlot.day)}: </span>
                                    {timeSlot.from && timeSlot.to ? (
                                      `${formatTime(timeSlot.from)} - ${formatTime(timeSlot.to)}`
                                    ) : (
                                      "Not available"
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No working hours specified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-8 mt-10 md:mt-40">
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow space-y-8">
                {/* Education Section */}
                <div>
                  <h3 className="text-lg sm:text-3xl font-semibold mb-4">
                    Education
                  </h3>
                  {data.info.education?.length > 0 ? (
                    <div className="space-y-4">
                      {data.info.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800">
                            {edu.degree || "Medical Degree"}
                          </h4>
                          <p className="text-sm">
                            {edu.university || "University of Medicine"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No education information available
                    </p>
                  )}
                </div>

                {/* Experience Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">
                    Experience
                  </h3>
                  {data.info.experience?.length > 0 ? (
                    <div className="space-y-4">
                      {data.info.experience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium">
                            {exp.years || "Several"} years of experience
                          </p>
                          <p className="text-sm">
                            Handled{" "}
                            {exp.cases_handled?.toLocaleString() || "numerous"}{" "}
                            cases
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No experience information available
                    </p>
                  )}
                </div>

                {/* Book Now Button */}
                <Link
                  to={`/book/${data.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 text-xl font-semibold text-white 
                  bg-[#11319E] hover:bg-[#0d2a8a] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 
                  transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Book Appointment
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
              <div className="mt-10 shadow rounded-lg p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  Patient Reviews
                </h3>

                {/* Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-6 bg-gray-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium mb-2">Share Your Experience</h4>
                  <div className="flex items-center mb-4">
                    <span className="mr-2">Rating:</span>
                    <div className="flex">{renderStars(rating, true)}</div>
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="How was your experience with this doctor?"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-0"
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex justify-center py-4">
                    <DNA height={40} width={40} ariaLabel="loading-reviews" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                      reviewsData.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <img
                              src={
                                review.Users?.image ||
                                "https://placehold.co/50x50/0A2357/FFFFFF.png"
                              }
                              alt="User"
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">
                                {getReviewAuthor(review)}
                              </p>
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {renderStars(Math.round(review.rate || 0))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.review}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No reviews yet. Be the first to share your experience!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}