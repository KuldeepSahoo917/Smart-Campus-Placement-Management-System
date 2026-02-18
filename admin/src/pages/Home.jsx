import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, FileText, CheckCircle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Home = () => {
  const navigate = useNavigate();

  // Dummy data for charts
  const [chartData, setChartData] = useState([
    { name: "Jan", Applications: 120, Placed: 45 },
    { name: "Feb", Applications: 200, Placed: 90 },
    { name: "Mar", Applications: 150, Placed: 60 },
    { name: "Apr", Applications: 220, Placed: 100 },
    { name: "May", Applications: 300, Placed: 140 },
    { name: "Jun", Applications: 250, Placed: 120 },
  ]);

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-8 sm:p-12 text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to Smart Campus Admin
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-8">
            Manage students, companies, and placement applications efficiently from one central dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-600 cursor-pointer px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-gray-100 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/students")}
              className="border border-white cursor-pointer text-white px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-white hover:text-blue-600 transition"
            >
              Manage Students
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-2"><Users className="w-6 h-6 sm:w-8 sm:h-8" /><h3 className="font-semibold text-lg sm:text-xl">Total Students</h3></div>
            <p className="text-2xl font-bold mt-2">1,250</p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-2"><Briefcase className="w-6 h-6 sm:w-8 sm:h-8" /><h3 className="font-semibold text-lg sm:text-xl">Companies</h3></div>
            <p className="text-2xl font-bold mt-2">48</p>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-2"><FileText className="w-6 h-6 sm:w-8 sm:h-8" /><h3 className="font-semibold text-lg sm:text-xl">Applications</h3></div>
            <p className="text-2xl font-bold mt-2">3,420</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-2"><CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" /><h3 className="font-semibold text-lg sm:text-xl">Placed Students</h3></div>
            <p className="text-2xl font-bold mt-2">620</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center gap-3 mb-3"><Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" /><h3 className="font-semibold text-lg sm:text-xl">Students</h3></div>
            <p className="text-sm sm:text-base mb-4 text-gray-600">View, add, and manage student records and placement status.</p>
            <button onClick={() => navigate("/students")} className="text-blue-600 text-sm sm:text-base font-medium hover:underline">View Students →</button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center gap-3 mb-3"><Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" /><h3 className="font-semibold text-lg sm:text-xl">Companies</h3></div>
            <p className="text-sm sm:text-base mb-4 text-gray-600">Add companies, define eligibility, and track recruitment drives.</p>
            <button onClick={() => navigate("/companies")} className="text-green-600 text-sm sm:text-base font-medium hover:underline">View Companies →</button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center gap-3 mb-3"><FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" /><h3 className="font-semibold text-lg sm:text-xl">Applications</h3></div>
            <p className="text-sm sm:text-base mb-4 text-gray-600">Review applications and update placement results.</p>
            <button onClick={() => navigate("/applications")} className="text-purple-600 text-sm sm:text-base font-medium hover:underline">View Applications →</button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" />Monthly Placement Stats</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Applications" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                <Bar dataKey="Placed" fill="#10b981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
            <li>📌 New company <strong>Infosys</strong> added</li>
            <li>📌 25 students applied for <strong>TCS</strong></li>
            <li>📌 Placement results updated for <strong>Wipro</strong></li>
            <li>📌 10 new student registrations completed</li>
            <li>📌 <strong>Microsoft</strong> recruitment drive scheduled next week</li>
          </ul>
        </div>

      </div>
    </main>
  );
};

export default Home;
