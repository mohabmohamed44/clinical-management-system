import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";

export default function AdditionalServices() {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const carouselRef = useRef(null);

  // Format date from ISO string to show only day and month
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "long",
    });
  };

  // Calculate discount amount
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!discountPercentage) return originalPrice; // if there's no discount, return original price
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
  };

  // Update visible items based on screen size
  const updateVisibleItems = () => {
    if (window.innerWidth < 640) {
      setVisibleItems(1);
    } else if (window.innerWidth < 1024) {
      setVisibleItems(2);
    } else {
      setVisibleItems(3);
    }
  };

  // Fetch offers with doctor data
  const fetchOffers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Offers")
        .select(
          `
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
          Doctors (id, first_name, last_name, image, rate_count)
        `
        )
        .order("start_date", { ascending: true });

      if (error) throw error;

      const formattedOffers = data.map((offer) => {
        // Use Arabic fields if language is ar
        const isArabic = i18n.language === "ar";
        const offerTitle = isArabic ? offer.title_ar || offer.title : offer.title;
        const offerDescription = isArabic ? offer.description_ar || offer.description : offer.description;

        return {
          ...offer,
          mainImage: offer.images[0], // Use first image from array
          doctor: {
            name: `${offer.Doctors.first_name} ${offer.Doctors.last_name}`,
            image: offer.Doctors.image,
            rate: offer.Doctors.rate_count,
          },
          finalPrice: offer.discount_percentage
            ? calculateDiscountedPrice(
                offer.original_price,
                offer.discount_percentage
              )
            : offer.price,
          title: offerTitle,
          description: offerDescription,
        };
      });

      setOffers(formattedOffers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    // Set initial visible items
    updateVisibleItems();

    // Add event listener for window resize
    window.addEventListener("resize", updateVisibleItems);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateVisibleItems);
    };
  }, []);

  // Carousel controls
  const isRTL = i18n.dir() === "rtl";
  const ArrowIconLink = isRTL ? ArrowLeft : ArrowRight;

  // Improved nextSlide and prevSlide functions
  const nextSlide = () => {
    const maxIndex = Math.max(0, offers.length - visibleItems);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, offers.length - visibleItems);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    // Calculate the actual position based on the slide group
    const adjustedIndex = index * visibleItems;
    const maxIndex = Math.max(0, offers.length - visibleItems);
    setCurrentIndex(Math.min(adjustedIndex, maxIndex));
  };

  // Calculate total number of slide groups
  const totalSlideGroups = Math.ceil(offers.length / visibleItems);

  // Calculate which slide group is currently active
  const currentSlideGroup = Math.floor(currentIndex / visibleItems);

  if (loading)
    return (
      <div className="w-full py-12 flex justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">{t("Loading")}...</div>
      </div>
    );

  if (error)
    return (
      <div className="w-full py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={fetchOffers}
            >
              {t("TryAgain")}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`py-12 w-full bg-gray-50 ${
        i18n.language === "ar" ? "rtl" : ""
      }`}
    >
      <div
        className={`text-center mx-auto mb-10 max-w-xl ${
          i18n.language === "ar" ? "text-center" : ""
        }`}
      >
        <p
          className={`inline-block border text-center rounded-full border-blue-600 py-1 px-4 text-blue-600 ${
            i18n.language === "ar" ? "ml-0 mr-0" : ""
          }`}
        >
          {t("SpecialServices")}
        </p>
        <h2 className="text-4xl font-bold mt-4 text-center">{t("FeaturedOffers")}</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Carousel Controls */}
        <div
          className={`flex justify-between mb-6 ${
            i18n.language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex gap-2 ${
              i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div
            className={`flex items-center gap-2 ${
              i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {Array.from({ length: totalSlideGroups }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full ${
                  currentSlideGroup === idx ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide group ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Items */}
        <div className="overflow-hidden" ref={carouselRef}>
          <div
            className={`flex transition-transform duration-300 ${
              i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            }}
          >
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`flex-none px-3 pb-4 ${
                  visibleItems === 1
                    ? "w-full"
                    : visibleItems === 2
                    ? "w-1/2"
                    : "w-1/3"
                }`}
              >
                <div className="bg-white rounded-xl shadow hover:shadow-md h-full flex flex-col">
                  {/* Offer Image */}
                  <div className="relative h-48">
                    <img
                      src={offer.mainImage}
                      alt={offer.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <div
                      className={`absolute top-2 ${
                        i18n.language === "ar" ? "left-2" : "right-2"
                      } bg-red-500 text-white px-3 py-1 rounded-full text-sm`}
                    >
                      {offer.usage_limit} {t("SlotsLeft")}
                    </div>
                    {offer.discount_percentage > 0 && (
                      <div
                        className={`absolute top-2 ${
                          i18n.language === "ar" ? "right-2" : "left-2"
                        } bg-green-500 text-white px-3 py-1 rounded-full text-sm`}
                      >
                        {offer.discount_percentage}% {t("Off")}
                      </div>
                    )}
                  </div>

                  {/* Offer Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {offer.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatTime(offer.start_date)} -{" "}
                        {formatTime(offer.end_date)}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 flex-1">
                      {offer.description}
                    </p>

                    {/* Price Information */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-blue-600">
                          ${offer.finalPrice}
                        </span>
                        {offer.discount_percentage > 0 && (
                          <span className="text-gray-500 line-through">
                            ${offer.original_price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div
                      className={`flex items-center mb-6 ${
                        i18n.language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <img
                        src={offer.doctor.image}
                        alt={offer.doctor.name}
                        className={`w-10 h-10 rounded-full object-cover ${
                          i18n.language === "ar" ? "ml-3" : "mr-3"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {offer.doctor.name}
                        </p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {offer.doctor.rate}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/offers/${offer.id}`}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors block text-center"
                    >
                      {t("BookNow")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div
          className={`flex justify-end mt-6 ${
            i18n.language === "ar" ? "justify-start" : ""
          }`}
        >
          <Link
            to="/offers"
            className={`flex items-center text-blue-600 hover:text-blue-800 font-medium ${
              i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {t("ViewAllServices")}
            <ArrowIconLink
              className={`${
                i18n.language === "ar" ? "mr-2" : "ml-2"
              } h-5 w-5`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}