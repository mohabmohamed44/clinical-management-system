import { useState, useEffect } from "react";
import { Calendar, Clock, Star } from "lucide-react";
import Doctor from "../../assets/doctor_home.webp";
import MetaData from "../../Components/MetaData/MetaData";
import Background from "../../assets/home.webp";
import Style from "./Offers.module.css";
import Doc from "../../assets/nurse.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import i18next from "i18next";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const doctorPlaceholder = Doctor;

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "long",
    });
  };

  // Function to calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, price) => {
    if (!originalPrice || !price || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // This function would connect to your Supabase instance
  const fetchOffers = async () => {
    try {
      setLoading(true);

      // connect to your Supabase instance and fetch data
      const { data, error } = await supabase.from("Offers").select(`
          id,
          images,
          start_date,
          end_date,
          description,
          provider,
          title,
          title_ar,
          description_ar,
          price,
          original_price,
          discount_percentage,
          usage_limit,
          provider_id,
          start_date,
          end_date,
          Doctors (id, first_name, last_name, image, rate_count)
        `);

      if (error) {
        throw new Error(error.message);
      }

      setOffers(data); // Update state with fetched data
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch offers");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center bg-gray-50">
        <div className="animate-pulse text-gray-600 font-medium text-lg flex items-center justify-center h-screen">
          <DNA height={100} width={100} ariaLabel="dna-loading" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={fetchOffers}
              role="button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title={"Offers - HealthCare App"}
        description={
          "Explore our exclusive offers and discounts on health services."
        }
        keywords={"healthcare, offers, discounts, health services"}
        author={"Mohab Mohammed"}
      />
      <main className="w-full object-cover h-screen">
        <header className="absolute top-0 left-0 w-full h-screen">
          <img
            src={Background}
            className="w-full h-screen absolute top-0 left-0 right-0"
            alt="Background"
            role="presentation"
            loading="lazy"
          />
          <section
            className="relative z-10 h-full px-6 md:px-10 max-w-screen-xl mx-auto"
            aria-label="About Information"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between h-full">
              {/* Text Content - Left Side */}
              <div className="text-[#ffffff] max-w-xl leading-12 mt-20 flex flex-col items-center justify-center lg:mt-22 text-center lg:text-left order-1 lg:order-1">
                <h2
                  className="text-2xl sm:text-5xl rtl:leading-13 items-start font-semibold mt-15 justify-center"
                  aria-label="Offers Heading"
                >
                  {t("OffersHeading")}
                </h2>
                <p
                  className={Style.OffersParagraph}
                  aria-label="Offers Description"
                >
                  {t("OffersDescription")}
                </p>
              </div>
              {/* Image - Right Side */}
              <figure
                className="mt-auto lg:mt-auto flex justify-center w-full lg:w-1/2 order-2 lg:order-2"
                aria-label="Doctor Image"
              >
                <img
                  src={Doc}
                  className="
                              w-full 
                              h-auto
                              max-w-[350px]
                              max-h-[300px]
                              md:max-h-[350px]
                              lg:max-h-[500px]
                              sm:max-w-md
                              md:max-w-md
                              lg:max-w-lg
                              xl:max-w-xl
                              object-contain
                            "
                  alt="Doctor"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>
        </header>
      </main>
      <div className="py-12 w-full bg-gray-50">
        <div className="text-center mx-auto mb-10 max-w-xl">
          <p className="inline-block border rounded-full border-blue-600 py-1 px-4 text-blue-600">
            {t("AdditionalServices")}
          </p>
          <h1 className="text-4xl font-bold mt-2">
            {t("ChooseFromTopOffers")}
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Services Grid - Now with 2 columns for wider cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {offers.map((offer) => {
              // Get the first image from the images array or use a placeholder
              const offerImage =
                offer.images && offer.images.length > 0
                  ? offer.images[0]
                  : Doctor;

              // Get doctor information
              const doctor = offer.Doctors || {};
              const doctorName =
                doctor.first_name && doctor.last_name
                  ? `${doctor.first_name} ${doctor.last_name}`
                  : "Unknown Doctor";

              // Calculate if there's a discount
              const hasDiscount =
                offer.original_price &&
                offer.price &&
                offer.original_price > offer.price;

              // Use Arabic fields if language is ar
              const isArabic = i18next.language === "ar";
              const offerTitle = isArabic ? offer.title_ar || offer.title : offer.title;
              const offerDescription = isArabic ? offer.description_ar || offer.description : offer.description;

              // Calculate discount percentage safely
              const discountPercentage = hasDiscount
                ? offer.discount_percentage ||
                  calculateDiscountPercentage(offer.original_price, offer.price)
                : 0;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={offerImage}
                      alt={offer.title}
                      className="w-full h-64 object-cover"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {offer.usage_limit} {t("SlotsLeft")}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[#00155D]">
                        {offerTitle}
                      </h3>
                      {offer.start_date && offer.end_date && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {formatTime(offer.start_date)} -{" "}
                            {formatTime(offer.end_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {offerDescription}
                    </p>

                    {/* Doctor info */}
                    {doctor && (
                      <div className="flex items-center mt-3 pb-3 border-b">
                        <img
                          src={doctor.image || doctorPlaceholder}
                          alt={doctorName}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {doctorName}
                          </p>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {doctor.rate}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center">
                      {hasDiscount ? (
                        <>
                          <span className="text-2xl font-bold text-blue-600">
                            ${offer.price}
                          </span>
                          <span className="ml-2 text-gray-500 line-through">
                            ${offer.original_price}
                          </span>
                          <span className="ml-2 text-red-500 text-sm font-medium">
                            {discountPercentage}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          ${offer.price || "Contact Us"}
                        </span>
                      )}
                    </div>

                    <Link 
                      to={`/offers/${offer.id}`}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors block text-center"
                    >
                      {t("BookNow")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
