import React from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      

      {/* Hero Section */}
      <section className="pt-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Smart Campus Placement System
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            A smarter way to manage campus placements, track applications,
            and connect students with top companies.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 cursor-pointer bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Student Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
            Why Smart Campus?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-semibold text-lg mb-2">
                Student-Centric
              </h3>
              <p className="text-gray-600 text-sm">
                Track applications, eligibility, and placement status easily.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="font-semibold text-lg mb-2">
                Company Listings
              </h3>
              <p className="text-gray-600 text-sm">
                View eligible companies and apply with a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">
                Smart Dashboard
              </h3>
              <p className="text-gray-600 text-sm">
                Get real-time updates and placement insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        © 2026 Smart Campus Placement System. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
