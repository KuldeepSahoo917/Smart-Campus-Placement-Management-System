import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Smart Campus
            </h2>
            <p className="text-sm text-gray-400">
              A smart solution for managing campus placements, students,
              and company recruitment processes efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition">
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Placement Policy</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm text-gray-400">
              📍 Campus Placement Cell<br />
              📧 placement@smartcampus.com<br />
              📞 +91 98765 43210
            </p>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Smart Campus Placement System.  
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
