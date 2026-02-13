import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left */}
          <p className="text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Smart Campus Admin Panel
          </p>

          {/* Right */}
          <p className="text-sm text-center sm:text-right">
            All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
