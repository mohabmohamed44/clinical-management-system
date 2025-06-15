import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import Doctor from "../../assets/doctor_home.webp";
import i18next from "i18next";

export default function OfferDetails() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch the offer details with the related doctor information
      const { data, error: offerError } = await supabase
        .from("Offers")
        .select(`
          id,
          images,
          start_date,
          end_date,
          description,
          title_ar,
          description_ar,
          provider,
          title,
          price,
          original_price,
          discount_percentage,
          usage_limit,
          provider_id,
          Doctors (id, first_name, last_name, image, rate_count, specialty, first_name_ar, last_name_ar)
        `)
        .eq('id', id)
        .single();

      if (offerError) throw offerError;
      
      // Extract doctor data from the nested structure
      const doctorData = data.Doctors;
      setDoctor(doctorData);
      setOffer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  // Use Arabic fields if language is ar
  const isArabic = i18next.language === "ar";
  const offerTitle = offer
    ? isArabic
      ? offer.title_ar || offer.title
      : offer.title
    : "";
  const offerDescription = offer
    ? isArabic
      ? offer.description_ar || offer.description
      : offer.description
    : "";

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <DNA height={100} width={100} ariaLabel="dna-loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-red-600">{error}</p>
            <Link to="/offers" className="mt-4 text-blue-600 hover:underline inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Offers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) return null;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Safe access to properties
  const offerImage = offer.images && offer.images.length > 0 ? offer.images[0] : Doctor;
  const discountPercentage = offer.discount_percentage || 0;
  const originalPrice = offer.original_price || null;
  const usageLimit = offer.usage_limit || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/offers" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Offers
        </Link>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Offer Image */}
            <div className="relative">
              <img
                src={offerImage}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Offer Details */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{offerTitle || t("Offer")}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                {offer.start_date && offer.end_date && (
                  <div
                    className={`flex items-center ${
                      isArabic ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span>
                      {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                    </span>
                  </div>
                )}
                {usageLimit > 0 && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{usageLimit} slots left</span>
                  </div>
                )}
              </div>

              {offerDescription && (
                <div className="mb-6">
                  <p className="text-gray-600">{offerDescription}</p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">${offer.price || 0}</span>
                  {originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${originalPrice}</span>
                  )}
                </div>
              </div>

              {doctor && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">{t("DoctorDetails")}</h2>
                  <div className="flex items-start gap-4">
                    <img
                      src={doctor.profile_image || doctor.image || Doctor}
                      alt={
                        isArabic
                          ? `د. ${doctor.first_name_ar || doctor.first_name} ${doctor.last_name_ar || doctor.last_name}`
                          : `Dr. ${doctor.first_name} ${doctor.last_name}`
                      }
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {isArabic
                          ? `د. ${doctor.first_name_ar || doctor.first_name} ${doctor.last_name_ar || doctor.last_name}`
                          : `Dr. ${doctor.first_name || ""} ${doctor.last_name || ""}`}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1">
                          {doctor.rate_count || 0} {t("ratings")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                {t("BookAppointment")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}