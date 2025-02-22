import React from "react";
import BlogCards from "../../Components/BlogCards/BlogCards";
import MetaData from "../../Components/MetaData/MetaData";
import Style from "./Blog.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const blogPosts = [
  {
    title: "The Importance of a Balanced Diet",
    description:
      "A balanced diet is crucial for maintaining good health. Learn how to incorporate essential nutrients into your daily meals.",
    image: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    alt: "Fresh vegetables and fruits arranged on a wooden table"
  },
  {
    title: "5 Effective Home Workouts",
    description:
      "Stay fit without going to the gym! Here are five effective home workouts that require no equipment to exercise and boost your health.",
    image: "https://images.pexels.com/photos/347134/pexels-photo-347134.jpeg?",
    alt: "Person doing workout exercises at home"
  },
  {
    title: "Meditation for Mental Wellness",
    description:
      "Discover the benefits of meditation and how it can improve your mental well-being and reduce stress.",
    image: "https://images.pexels.com/photos/8849272/pexels-photo-8849272.jpeg",
    alt: "Person meditating in a peaceful setting"
  },
  {
    title: "Understanding the Importance of Hydration",
    description:
      "Water is essential for our body. Learn why staying hydrated is key to overall health.",
    image: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg",
    alt: "Glass of clean water with water drops"
  },
  {
    title: "Tips for Better Sleep",
    description:
      "A good night's sleep is vital for health. Follow these tips to improve your sleep quality.",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg",
    alt: "Comfortable bedroom setting with cozy pillows"
  },
  {
    title: "Yoga Poses for Beginners",
    description:
      "Start your yoga journey with these simple yet effective poses for beginners and intermediates that will help to relax.",
    image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg",
    alt: "Person practicing yoga in a peaceful environment"
  },
];

export default function Blog() {
  const { t } = useTranslation();
  return (
    <>
      <MetaData
        title="Health & Wellness Blog"
        description="Read the latest health and wellness articles from our blog. Expert advice on nutrition, fitness, mental health, and overall wellbeing."
        keywords="health, wellness, fitness, nutrition, medicine, healthcare, mental health, meditation, yoga, sleep, hydration, diet"
        author="Mohab Mohammed"
      />
      
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="breadcrumbs bg-base-200 rounded-md text-md font-medium">
          <ul className="flex items-center text-[#274760] space-x-1">
            <li>
              <Link to="/" className="hover:underline" aria-label="Go to homepage">
                {t("Home")}
              </Link>
            </li>
            <li className="text-gray-500" aria-hidden="true">
              <ChevronRight size={16} />
            </li>
            <li aria-current="page">
              <Link to="/blog" className="text-primary hover:underline">
                {t("Blog")}
              </Link>
            </li>
          </ul>
        </nav>

        <h1
          className={`text-4xl ${Style.text} font-bold mb-8 text-left rtl:text-right`}
          tabIndex="-1"
        >
          {t("Blog")}
        </h1>

        <section 
          aria-label="Blog posts"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogPosts.map((post, index) => (
            <article key={index}>
              <BlogCards
                title={post.title}
                description={post.description}
                image={post.image}
                imageAlt={post.alt}
              />
            </article>
          ))}
        </section>
      </main>
    </>
  );
}