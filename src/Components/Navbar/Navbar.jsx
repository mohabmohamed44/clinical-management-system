import { Menu, X, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.webp";
import { useTranslation } from "react-i18next";
import ar from "../../assets/circle.webp";
import en from "../../assets/united-states.webp";
import { useLanguage } from "../../Lib/Context/LanguageContext";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { language, changeLanguage, languageDropdownOpen, toggleLanguageDropdown } = useLanguage();
  const { t } = useTranslation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow w-full top-0 z-100 sticky left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3" aria-label="go to home">
            <img src={Logo} className="h-10 w-10 object-contain" alt="Logo" loading="lazy"/>
            <span className="self-center text-xl font-semibold text-gray-800">{t("Delma")}</span>
          </Link>
          
          <div className="hidden lg:flex space-x-6">
            <NavLink to="/" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{t("Home")}</NavLink>
            <NavLink to="/find_doctor" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{t("FindDoctor")}</NavLink>
            <NavLink to="/about" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{t("About")}</NavLink>
            <NavLink to="/departments" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{t("Departments")}</NavLink>
            <NavLink to="/pricing" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{t("pricing")}</NavLink>
            <NavLink to="/blog" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{(t("Blog"))}</NavLink>
            <NavLink to="/contact" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer">{(t("Contact"))}</NavLink>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/login" className="text-gray-600 hover:text-blue-700 cursor-pointer">{t("Login")}</NavLink>
          <NavLink to="/register" className="text-gray-600 hover:text-blue-700 cursor-pointer">{t("Register")}</NavLink>
          
          {/* Language Dropdown */}
          <div className="relative" aria-label="Language Dropdown" aria-expanded="false" aria-haspopup="true" data-toggle="dropdown">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <img loading="lazy" src={language === "ar" ? ar : en} alt="flag" className="h-5 w-5" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <button onClick={() => changeLanguage("en")} className="flex items-center px-4 py-2 hover:bg-gray-100 w-full" aria-label="english language">
                  <img loading="lazy" src={en} alt="English" className="h-5 w-5 mr-2" /> English
                </button>
                <button onClick={() => changeLanguage("ar")} className="flex items-center px-4 py-2 hover:bg-gray-100 w-full" aria-label="arabic language">
                  <img loading="lazy" src={ar} alt="Arabic" className="h-5 w-5 mr-2" /> Arabic
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600 hover:text-gray-800" onClick={() => setNavbarOpen(!navbarOpen)}>
          {navbarOpen ? <X aria-label="close menu" size={24} /> : <Menu size={24} aria-label="menu button" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white ${navbarOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col items-start px-4 py-4 space-y-4">
          <NavLink to="/" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Home")}</NavLink>
          <NavLink to="/find_doctor" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("FindDoctor")}</NavLink>
          <NavLink to="/about" className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("About")}</NavLink>
          <NavLink to="/departments" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Departments")}</NavLink>
          <NavLink to="/blog" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Blog")}</NavLink>
          <NavLink to="/pricing" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("pricing")}</NavLink>
          <NavLink to="/contact" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Contact")}</NavLink>
          <NavLink to="/login" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Login")}</NavLink>
          <NavLink to="/register" className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => setNavbarOpen(false)}>{t("Register")}</NavLink>
          
          {/* Language Dropdown Mobile */}
          <div className="relative w-fit" aria-label="Language Dropdown" aria-expanded="false" aria-haspopup="true" data-toggle="dropdown">
            <button onClick={toggleLanguageDropdown} className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <img loading="lazy" src={language === "ar" ? ar : en} alt="flag" className="h-5 w-5" />
              <ChevronDown className="ml-auto w-4 h-4" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute left-4 mt-2 w-36 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <button onClick={() => changeLanguage("en")} className="flex items-center px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">
                  <img loading="lazy" src={en} alt="English" className="h-5 w-5 mr-2" /> English
                </button>
                <button onClick={() => changeLanguage("ar")} className="flex items-center px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">
                  <img loading="lazy" src={ar} alt="Arabic" className="h-5 w-5 mr-2" /> Arabic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
