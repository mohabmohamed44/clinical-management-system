import React from "react";
import { MapPin, Phone, Mail, Shield, MoveRight, MoveLeft } from "lucide-react";
import { FaFacebook, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.webp";
import footerBg from "../../assets/Frame.webp";

export default function Footer() {

  const currentYear = new Date().getFullYear();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  return (
    <footer className="relative mt-16">
      {/* Background Image (Wave Shape for Large Screens) */}
      <picture className="absolute inset-0 w-full h-full">
        <img
          src={footerBg}
          alt="background"
          className="w-full h-full object-cover object-top block"
        />
      </picture>

      {/* Shield Logo with Higher Z-Index */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="bg-[#11319E] rounded-full p-6 border-4 border-white shadow-lg">
          <Shield className="w-14 h-14 text-white" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 pt-60 pb-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Contact Info */}
            <div className="space-y-4">
              <img
                src={Logo}
                className="w-12 h-12"
                alt="logo-img"
                loading="lazy"
              />
              <h2 className="text-2xl font-bold text-white">{t("Delma")}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white :hover:lg:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span>123 Anywhere St., Any City 12345</span>
                </div>
                <div className="flex items-center gap-2 text-white :hover:lg:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>123-456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-white :hover:lg:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>hellocallcenter@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links 1 */}
            <div>
              <ul className="space-y-2 rtl:font-medium rtl:text-lg">
                <li>
                  <Link
                    to="#"
                    className="text-white hover:lg:text-white transition-colors"
                  >
                    {t("AboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/departments"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Departments")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctors"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Doctors")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Timetable")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointments"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Appointments")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Testimonials")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("Blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("ContactUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("FAQ")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("PrivacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white :hover:lg:text-white transition-colors"
                  >
                    {t("TermsAndConditions")}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about"
                    className="text-white hover:lg:text-white transition-colors"
                  >
                    {t("About")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {t("Subscription")}
              </h3>
              <p className="text-white text-lg font-medium mb-4">
                {t("GetAdviceFromOurExperts")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-sky-200 focus:outline-none focus:border-sky-400"
                />
                <button className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {t("Submit")} {isRTL ? <MoveLeft className="inline ml-2" /> : <MoveRight className="inline ml-2" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 bg-blue-600/90 text-white py-4 bottom-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span>{t("FollowUs")}</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-sky-200 transition-colors">
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-sky-200 transition-colors">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-sky-200 transition-colors">
                  <FaXTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <p>{t("CopyRights")} {t(currentYear)}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};