import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";
// import { Search } from "lucide-react";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3">
            <img src={Logo} className="h-10" alt="Logo" />
            <span className="self-center text-xl font-semibold text-gray-800">
              MediCare
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Contact
            </NavLink>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <NavLink to="/login" className="text-gray-600 hover:text-blue-700">
            Login
          </NavLink>
          <NavLink to="/register" className="text-gray-600 hover:text-blue-700">
            Register
          </NavLink>
        </div>

        {/* Search Input - Desktop */}
        {/* <div className="hidden md:block relative ml-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {navbarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white ${navbarOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col items-start px-4 py-4 space-y-4">
          <NavLink
            to="/"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            Contact
          </NavLink>
          <NavLink
            to="/login"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="text-gray-600 hover:text-blue-700"
            onClick={() => setNavbarOpen(false)}
          >
            Register
          </NavLink>
          <input
            type="text"
            placeholder="Search..."
            className="block w-3/4 p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </nav>
  );
}
