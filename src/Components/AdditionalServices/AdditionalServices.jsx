// import React, { useState, useEffect } from "react";
// import Style from "./AdditionalServices.module.css";
// export default function AdditionalServices() {
//   return (
//     <>
//       <div className="py-12 w-full">
//         <div className="text-center mx-auto mb-10 max-w-xl">
//           <p className="inline-block border rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">Additional Services</p>
//           <h1 className="text-4xl font-bold mt-2">Choose from top offers</h1>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import Style from "./AdditionalServices.module.css";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdditionalServices() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      id: 1,
      title: "Physiotherapy",
      description: "Professional physiotherapy sessions to help with recovery and pain management",
      price: 120,
      salePrice: 89,
      onSale: true,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
    },
    {
      id: 2,
      title: "Dental Whitening",
      description: "Professional teeth whitening for a brighter, more confident smile",
      price: 200,
      salePrice: 149,
      onSale: true,
      image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
    },
    {
      id: 3,
      title: "Nutritional Consultation",
      description: "Personalized nutrition plans tailored to your health goals and needs",
      price: 85,
      salePrice: null,
      onSale: false,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
    },
    {
      id: 4,
      title: "Massage Therapy",
      description: "Therapeutic massage to relieve stress and muscle tension",
      price: 95,
      salePrice: 75,
      onSale: true,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
    },
    {
      id: 5,
      title: "Acupuncture",
      description: "Traditional Chinese medicine to promote natural healing",
      price: 110,
      salePrice: null,
      onSale: false,
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80"
    },
    {
      id:6,
      title: 'Orthodontics',
      description: 'Orthodontics corrects misaligned teeth and jaw issues using braces.',
      price: 12000,
      salePrice: 10000,
      onSale: true,
      image: 'https://images.unsplash.com/photo-1598531228433-d9f0cb960816?q=80&w=2070',
    }
  ];

  const visibleItems = () => {
    // Responsive number of items
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(visibleItems());

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(visibleItems());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= services.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? services.length - 1 : prevIndex - 1
    );
  };

  const getVisibleServices = () => {
    const result = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % services.length;
      result.push(services[index]);
    }
    return result;
  };

  return (
    <>
      <div className="py-12 w-full bg-gray-50">
        <div className="text-center mx-auto mb-10 max-w-xl">
          <p className="inline-block border rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
            {t("Additional Services")}
          </p>
          <h1 className="text-4xl font-bold mt-2">{t("Choose from top offers")}</h1>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Carousel Navigation */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevSlide}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-[#3454c1]" />
            </button>
          </div>
          
          {/* Services Carousel */}
          <div className="flex gap-6 overflow-hidden py-8">
            {getVisibleServices().map((service) => (
              <div 
                key={service.id} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-48 object-cover"
                  />
                  {service.onSale && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      HOT
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{service.description}</p>
                  <div className="mt-4 flex items-center">
                    {service.onSale ? (
                      <>
                        <span className="text-2xl font-bold text-[#3454c1]">${service.salePrice}</span>
                        <span className="ml-2 text-gray-500 line-through">${service.price}</span>
                        <span className="ml-2 text-red-500 text-sm font-medium">
                          {Math.round((service.price - service.salePrice) / service.price * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-[#3454c1]">${service.price}</span>
                    )}
                  </div>
                  <button className="mt-4 w-full bg-[#3454c1] hover:bg-[#2a43a0] text-white py-2 px-4 rounded-md transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Next button */}
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextSlide}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-[#3454c1]" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-[#3454c1]" : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}