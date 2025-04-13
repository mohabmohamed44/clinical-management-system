import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Doctor from "../../assets/doctor_home.webp";
import MetaData from "../../Components/MetaData/MetaData";
import Background from "../../assets/home.webp";
import Style from "./Offers.module.css";
import Doc from "../../assets/nurse.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DNA } from "react-loader-spinner";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  // Mock doctor image (replace with actual import in your app)
  const doctorPlaceholder = Doctor;

  // Helper function to format time
  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes =
      minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : "";
    return `${formattedHours}${formattedMinutes} ${ampm}`;
  };

  // This function would connect to your Supabase instance
  const fetchOffers = async () => {
    try {
      setLoading(true);

      // For demo purposes, using mock data
      const mockData = [
        {
          id: 1,
          title: "Complete Health Checkup",
          description:
            "Comprehensive health assessment including blood work, vital signs, and consultation with a specialist.",
          price: 299,
          salePrice: 199,
          onSale: true,
          start_duration: 9,
          end_duration: 10,
          doctor: {
            name: "Dr. Robert Smith",
            photo: doctorPlaceholder,
            specialty: "General Physician",
          },
          image:
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        },
        {
          id: 2,
          title: "Dental Cleaning & Whitening",
          description:
            "Professional teeth cleaning, oral examination and preventative dental care package.",
          price: 150,
          salePrice: 99,
          onSale: true,
          start_duration: 10,
          end_duration: 11,
          doctor: {
            name: "Dr. Jessica Chen",
            photo: doctorPlaceholder,
            specialty: "Cosmetic Dentist",
          },
          image:
            "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        },
        {
          id: 3,
          title: "Nutrition Consultation",
          description:
            "Personalized nutrition plan with certified dietitian including follow-up session.",
          price: 120,
          salePrice: null,
          onSale: false,
          start_duration: 11,
          end_duration: 11.75,
          doctor: {
            name: "Dr. Maria Rodriguez",
            photo: doctorPlaceholder,
            specialty: "Nutritionist",
          },
          image:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        },
        {
          id: 4,
          title: "Massage Therapy Session",
          description:
            "One-hour physical therapy session with experienced therapist focusing on mobility and pain management.",
          price: 85,
          salePrice: null,
          onSale: false,
          start_duration: 14,
          end_duration: 15,
          doctor: {
            name: "Dr. Sarah Johnson",
            photo: doctorPlaceholder,
            specialty: "Physical Therapist",
          },
          image:
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        },
        {
          id: 5,
          title: "Mental Health Package",
          description:
            "Three therapy sessions with licensed counselor to address stress, anxiety, or other concerns.",
          price: 275,
          salePrice: 225,
          onSale: true,
          start_duration: 13,
          end_duration: 14,
          doctor: {
            name: "Dr. Michael Brown",
            photo: doctorPlaceholder,
            specialty: "Psychologist",
          },
          image:
            "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        },
        {
          id: 6,
          title: "Orthodontics",
          description:
            "Orthodontics corrects misaligned teeth and jaw issues using braces.",
          price: 95,
          salePrice: null,
          onSale: false,
          start_duration: 15,
          end_duration: 16.25,
          doctor: {
            name: "Dr. James Wilson",
            photo: doctorPlaceholder,
            specialty: "Orthodontist",
          },
          image:
            "https://images.unsplash.com/photo-1598531228433-d9f0cb960816?q=80&w=2070",
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setOffers(mockData);
        setLoading(false);
      }, 500);
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
          <DNA height={100} width={100} ariaLabel="dna-loading"/>
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
                  className="text-2xl sm:text-5xl  rtl:leading-13 items-start font-semibold mt-15 justify-center"
                  aria-label="Departments Heading"
                >
                  {t("OffersHeading")}
                </h2>
                <p
                  className={Style.OffersParagraph}
                  aria-label="Departments Description"
                >
                  {t("DepartmentsDescription")}
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
                              max-h-[330px]
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
              {/* Text Content - Left Side */}
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
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-75 object-cover"
                  />
                  {offer.onSale && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      HOT
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {offer.title}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {formatTime(offer.start_duration)} -{" "}
                        {formatTime(offer.end_duration)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {offer.description}
                  </p>

                  {/* Doctor info */}
                  <div className="flex items-center mt-3 pb-3 border-b">
                    <img
                      src={offer.doctor.photo}
                      alt={offer.doctor.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {offer.doctor.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {offer.doctor.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    {offer.onSale ? (
                      <>
                        <span className="text-2xl font-bold text-blue-600">
                          ${offer.salePrice}
                        </span>
                        <span className="ml-2 text-gray-500 line-through">
                          ${offer.price}
                        </span>
                        <span className="ml-2 text-red-500 text-sm font-medium">
                          {Math.round(
                            ((offer.price - offer.salePrice) / offer.price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        ${offer.price}
                      </span>
                    )}
                  </div>

                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                    <Link to="/book">{t("BookNow")}</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
