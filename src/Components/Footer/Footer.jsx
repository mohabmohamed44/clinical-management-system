import React from 'react';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';
import { FaFacebook, FaLinkedinIn, FaTwitter } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="relative">
      {/* Wave Shape */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-sky-100 transform -translate-y-full"></div>
      
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
              <h2 className="text-2xl font-bold text-gray-800">MediCare</h2>
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
                <li><a href="#" className="text-gray-600 hover:text-gray-800">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Departments</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Doctors</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Timetable</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Appointment</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Testimonials</a></li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800">Terms and Conditions</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Be Our Subscribers</h3>
              <p className="text-gray-600 mb-4">To get the latest news about health from our experts</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/50 border border-sky-200 focus:outline-none focus:border-sky-400"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit →
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
              <span>Follow Us</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-sky-200 transition-colors"><FaFacebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-sky-200 transition-colors"><FaLinkedinIn className="w-5 h-5" /></a>
                <a href="#" className="hover:text-sky-200 transition-colors"><FaTwitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <p>Copyright © 2024 All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;