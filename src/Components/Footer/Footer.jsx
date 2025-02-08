import React from 'react';
import { MapPin, Phone, Mail, Shield, MoveRight } from 'lucide-react';
import { FaFacebook, FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
  const {t} = useTranslation();
  return (
    <footer className="relative mt-16 bottom-0 end-0 start-0">
      {/* Wave Shape */}
      <div className="absolute mt-16 left-0 right-0 h-32 bg-gradient-to-b from-white to-sky-100 transform -translate-y-full"></div>
      
      {/* Shield Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-sky-400 rounded-full p-8 border-4 border-white">
          <Shield className="w-14 h-14 text-white" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-b from-sky-100 to-sky-200 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Contact Info */}
            <div className="space-y-4">
              <img src={Logo} className="w-12 h-12" alt="logo-img" />
              <h2 className="text-2xl font-bold text-gray-800">{t("Delma")}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>123 Anywhere St., Any City 12345</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>123-456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>hellocallcenter@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links 1 */}
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("AboutUs")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Departments")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Doctors")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Timetable")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Appointments")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Testimonials")}</Link></li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("Blog")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("ContactUs")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("FAQ")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("PrivacyPolicy")}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-800">{t("TermsAndConditions")}</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t("Subscription")}</h3>
              <p className="text-gray-600 text-md font-medium mb-4">{t("GetAdviceFromOurExperts")}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/50 border border-sky-200 focus:outline-none focus:border-sky-400"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {t("Submit")} <MoveRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span>{t("FollowUs")}</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-sky-200 transition-colors"><FaFacebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-sky-200 transition-colors"><FaLinkedinIn className="w-5 h-5" /></a>
                <a href="#" className="hover:text-sky-200 transition-colors"><FaTwitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <p>{t("CopyRights")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;