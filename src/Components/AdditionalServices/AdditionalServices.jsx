import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Doctor from "../../assets/doctor_home.webp";
import { Link } from "react-router-dom";

export default function AdditionalServices() {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Helper function to format time
  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';
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
          title: t("Physiotherapy"),
          description: "Professional physiotherapy sessions to help with recovery and pain management",
          price: 120,
          salePrice: 89,
          onSale: true,
          start_duration: 9,
          end_duration: 10,
          doctor: {
            name: "Dr. Robert Smith",
            photo: Doctor,
            specialty: "Physical Therapist"
          },
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          id: 2,
          title: "Dental Whitening",
          description: "Professional teeth whitening for a brighter, more confident smile",
          price: 200,
          salePrice: 149,
          onSale: true,
          start_duration: 10,
          end_duration: 11,
          doctor: {
            name: "Dr. Jessica Chen",
            photo: Doctor,
            specialty: "Cosmetic Dentist"
          },
          image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          id: 3,
          title: "Nutritional Consultation",
          description: "Personalized nutrition plans tailored to your health goals and needs",
          price: 85,
          salePrice: null,
          onSale: false,
          start_duration: 11,
          end_duration: 11.5,
          doctor: {
            name: "Dr. Maria Rodriguez",
            photo: Doctor,
            specialty: "Nutritionist"
          },
          image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          id: 4,
          title: "Massage Therapy",
          description: "Therapeutic massage to relieve stress and muscle tension",
          price: 95,
          salePrice: 75,
          onSale: true,
          start_duration: 14,
          end_duration: 15,
          doctor: {
            name: "Dr. Sarah Johnson",
            photo: Doctor,
            specialty: "Massage Therapist"
          },
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          id: 5,
          title: t("Acupuncture"),
          description: "Traditional Chinese medicine to promote natural healing and restore body balance",
          price: 110,
          salePrice: null,
          onSale: false,
          start_duration: 13,
          end_duration: 13.5,
          doctor: {
            name: "Dr. Li Wei",
            photo: Doctor,
            specialty: "Acupuncturist"
          },
          image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          id: 6,
          title: "Orthodontics",
          description: "Orthodontics corrects misaligned teeth and jaw issues using braces.",
          price: 12000,
          salePrice: 10000,
          onSale: true,
          start_duration: 15,
          end_duration: 16.25,
          doctor: {
            name: "Dr. James Wilson",
            photo: Doctor,
            specialty: "Orthodontist"
          },
          image: "https://images.unsplash.com/photo-1598531228433-d9f0cb960816?q=80&w=2070"
        }
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

  const isRTL = i18n.dir() === "rtl";
  const ArrowIconLink = isRTL ? ArrowLeft : ArrowRight;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === Math.max(0, offers.length - 3) ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, offers.length - 3) : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading offers...</div>
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
    <div className="py-12 w-full bg-gray-50">
      <div className="text-center mx-auto mb-10 max-w-xl">
        <p className="inline-block border rounded-full border-blue-600 py-1 px-4 text-blue-600">
          {t("AdditionalServices")}
        </p>
        <h1 className="text-4xl font-bold mt-2">{t("ChooseFromTopOffers")}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Carousel Navigation */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {offers.slice(0, offers.length - 2).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === idx ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Carousel */}
        <div className="overflow-hidden" ref={carouselRef}>
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
          >
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="flex-none w-full sm:w-1/2 lg:w-1/3 px-3 pb-4"
              >
                {/* Modified card to use flex for sticky button */}
                <div className="bg-white rounded-xl shadow overflow-hidden transition-all hover:shadow-sm h-full flex flex-col">
                  <div className="relative">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-48 object-cover"
                    />
                    {offer.onSale && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        HOT
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{offer.title}</h3>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {formatTime(offer.start_duration)} - {formatTime(offer.end_duration)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                      
                      {/* Doctor info */}
                      <div className="flex items-center mt-3 pb-3 border-b">
                        <img 
                          src={offer.doctor.photo} 
                          alt={offer.doctor.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{offer.doctor.name}</p>
                          <p className="text-sm text-gray-500">{offer.doctor.specialty}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        {offer.onSale ? (
                          <>
                            <span className="text-2xl font-bold text-blue-600">${offer.salePrice}</span>
                            <span className="ml-2 text-gray-500 line-through">${offer.price}</span>
                            <span className="ml-2 text-red-500 text-sm font-medium">
                              {Math.round((offer.price - offer.salePrice) / offer.price * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">${offer.price}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Button always sticks to bottom with mt-auto */}
                    <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                      {t("BookNow")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* View all link */}
        <div className="flex justify-end w-full mt-6 pb-2">
          <Link
            to="/offers"
            className="inline-flex hover:underline duration-300 items-center text-blue-600 hover:text-blue-800 text-lg font-medium"
          >
            {t("ViewAllOffers")}
            <ArrowIconLink className="ml-2 h-5 w-5 rtl:mr-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}