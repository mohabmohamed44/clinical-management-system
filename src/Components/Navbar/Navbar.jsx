import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="bg-gray-200 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center w-full">
        {/* Logo and Links Section */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/" onClick={() => setNavbarOpen(false)}>
              <img src={Logo} className="h-15 w-15" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md font-medium"
              onClick={() => setNavbarOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/Doctors"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md font-medium"
              onClick={() => setNavbarOpen(false)}
            >
              Doctor
            </NavLink>
            <NavLink
              to="/contact"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md font-medium"
              onClick={() => setNavbarOpen(false)}
            >
              Contact
            </NavLink>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md font-medium"
              onClick={() => setNavbarOpen(false)}
            >
              Login
            </Link>
            <NavLink
              to="/register"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md font-medium"
              onClick={() => setNavbarOpen(false)}
            >
              Register
            </NavLink>
          </div>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex">
          <input
            type="text"
            placeholder="Search..."
            className="block px-2.5 pb-2.5 pt-4 w-fit placeholder:text-start text-md text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {navbarOpen ? (
            <X size={24} className="mr-2" />
          ) : (
            <Menu size={24} className="mr-2" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-gray-200 ${navbarOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-start ml-10 space-y-4 py-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setNavbarOpen(false)}
          >
            Profile
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="block px-2.5 pb-2.5 pt-4 w-3/4 text-md text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
        </div>
      </div>
    </nav>
  );
}