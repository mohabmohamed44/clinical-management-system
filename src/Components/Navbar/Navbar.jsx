import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.webp";
import { useTranslation } from "react-i18next";
import ar from "../../assets/circle.webp";
import en from "../../assets/united-states.webp";
import { useLanguage } from "../../Lib/Context/LanguageContext";
import { useAuth } from "../../Lib/Context/AuthContext";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const {
    language,
    changeLanguage,
    languageDropdownOpen,
    toggleLanguageDropdown,
  } = useLanguage();
  const { t } = useTranslation();
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      setNavbarOpen(false);
      setAuthDropdownOpen(false);
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const toggleAuthDropdown = () => {
    setAuthDropdownOpen(!authDropdownOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow w-full top-0 z-50 sticky left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center space-x-3"
            aria-label="go to home"
          >
            <img
              src={Logo}
              className="h-8 sm:h-10 w-8 sm:w-10 object-contain"
              alt="Logo"
              loading="lazy"
            />
            <span className="self-center text-lg sm:text-xl font-semibold text-gray-800 ml-3">
              {t("Delma")}
            </span>
          </Link>

          {/* Navigation links - only visible on lg screens and up */}
          <div className="hidden lg:flex ml-6 space-x-4 lg:space-x-6">
            <NavLink
              to="/find_doctor"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("Doctors")}
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("About")}
            </NavLink>
            <NavLink
              to="/departments"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("Departments")}
            </NavLink>
            <NavLink
              to="/pricing"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("pricing")}
            </NavLink>
            <NavLink
              to="/labs"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("Labs")}
            </NavLink>
            <NavLink
              to="/hospitals"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("Hospitals")}
            </NavLink>
            <NavLink
              to="/contact"
              className="text-gray-600 hover:text-gray-700 font-medium cursor-pointer text-sm lg:text-base"
            >
              {t("Contact")}
            </NavLink>
          </div>
        </div>

        {/* Auth & Language Dropdowns - only visible on lg screens and up */}
        <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
          {/* Auth Dropdown */}
          <div className="relative">
            <button
              onClick={toggleAuthDropdown}
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-label="Authentication options"
              aria-expanded={authDropdownOpen}
            >
              <User size={20} />
              <span>
                {currentUser
                  ? t(currentUser.displayName) || t("Account")
                  : t("Account")}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {authDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50">
                {currentUser ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => setAuthDropdownOpen(false)}
                    >
                      <User size={18} className="mr-2" />
                      {t("Profile")}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={18} className="mr-2" />
                      {t("Logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => setAuthDropdownOpen(false)}
                    >
                      {t("Login")}
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => setAuthDropdownOpen(false)}
                    >
                      {t("Register")}
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-expanded={languageDropdownOpen}
              aria-haspopup="true"
              aria-controls="language-dropdown-menu"
              role="button"
              aria-label="Select language"
            >
              <img
                loading="lazy"
                src={language === "ar" ? ar : en}
                alt={language === "ar" ? "Arabic" : "English"}
                className="h-5 w-5"
              />
              <ChevronDown className="w-4 h-4" />
            </button>
            {languageDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50"
                id="language-dropdown-menu"
                role="menu"
                aria-label="Language options"
              >
                <button
                  onClick={() => changeLanguage("en")}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                  role="menuitem"
                >
                  <img
                    loading="lazy"
                    src={en}
                    alt="English"
                    className="h-5 w-5 mr-2"
                  />{" "}
                  English
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                  role="menuitem"
                >
                  <img
                    loading="lazy"
                    src={ar}
                    alt="Arabic"
                    className="h-5 w-5 mr-2"
                  />{" "}
                  Arabic
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - visible below lg screens */}
        <button
          className="lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {navbarOpen ? (
            <X aria-label="close menu" size={24} />
          ) : (
            <Menu size={24} aria-label="menu button" />
          )}
        </button>
      </div>

      {/* Mobile Menu - visible below lg screens when menu is open */}
      <div
        className={`lg:hidden bg-white transition-all duration-300 ease-in-out ${
          navbarOpen ? "max-h-screen py-4" : "max-h-0 py-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-start px-4 space-y-4">
          <NavLink
            to="/find_doctor"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("Doctors")}
          </NavLink>
          <NavLink
            to="/about"
            className="w-full py-2 text-gray-600 hover:text-gray-700 font-medium cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("About")}
          </NavLink>
          <NavLink
            to="/departments"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("Departments")}
          </NavLink>
          <NavLink
            to="/hospitals"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("Hospitals")}
          </NavLink>
          <NavLink
            to="/pricing"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("pricing")}
          </NavLink>
          <NavLink
            to="/labs"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("Labs")}
          </NavLink>
          <NavLink
            to="/contact"
            className="w-full py-2 text-gray-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setNavbarOpen(false)}
          >
            {t("Contact")}
          </NavLink>

          {/* Authentication Dropdown for Mobile */}
          <div className="w-full relative">
            <button
              onClick={toggleAuthDropdown}
              className="flex items-center justify-between w-full py-2 text-gray-600 hover:text-blue-700"
              aria-label="Authentication options"
              aria-expanded={authDropdownOpen}
            >
              <div className="flex items-center">
                <User size={20} className="mr-2 rtl:ml-2" />
                <span>
                  {currentUser
                    ? currentUser.displayName || t("Account")
                    : t("Account")}
                </span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {authDropdownOpen && (
              <div className="mt-2 bg-gray-50 rounded-lg w-full overflow-hidden border border-gray-200">
                {currentUser ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => {
                        setAuthDropdownOpen(false);
                        setNavbarOpen(false);
                      }}
                    >
                      <User size={18} className="mr-2 ltr:ml-3" />
                      {t("Profile")}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={18} className="mr-2 ltr:ml-2" />
                      {t("Logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => {
                        setAuthDropdownOpen(false);
                        setNavbarOpen(false);
                      }}
                    >
                      {t("Login")}
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      onClick={() => {
                        setAuthDropdownOpen(false);
                        setNavbarOpen(false);
                      }}
                    >
                      {t("Register")}
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Language Dropdown Mobile */}
          <div
            className="relative w-full py-2"
            aria-label="Language Dropdown"
            aria-expanded={languageDropdownOpen}
            aria-haspopup="true"
          >
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <img
                loading="lazy"
                src={language === "ar" ? ar : en}
                alt="flag"
                className="h-5 w-5 mr-2"
              />
              <span className="mr-auto">
                {language === "ar" ? "Arabic" : "English"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full max-w-xs bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-50">
                <button
                  onClick={() => {
                    changeLanguage("en");
                    setNavbarOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src={en}
                    alt="English"
                    className="h-5 w-5 mr-2"
                  />{" "}
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage("ar");
                    setNavbarOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src={ar}
                    alt="Arabic"
                    className="h-5 w-5 mr-2"
                  />{" "}
                  Arabic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}