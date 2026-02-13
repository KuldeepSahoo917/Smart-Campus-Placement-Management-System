import React from "react";
import { Users, Briefcase, FileText, Award, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Dummy data for chart
const applicationsData = [
  { company: "Infosys", applications: 120 },
  { company: "TCS", applications: 95 },
  { company: "Wipro", applications: 80 },
  { company: "HCL", applications: 60 },
  { company: "Tech Mahindra", applications: 45 },
];

const Dashboard = () => {
  return (
    <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center sm:text-left">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Students", value: "1,250", icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, color: "from-blue-400 to-blue-600" },
            { title: "Companies", value: "48", icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />, color: "from-green-400 to-green-600" },
            { title: "Applications", value: "3,420", icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />, color: "from-purple-400 to-purple-600" },
            { title: "Placed Students", value: "620", icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, color: "from-yellow-400 to-yellow-600" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <h3 className="text-sm sm:text-base font-medium">{card.title}</h3>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Recent Activities
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-gray-600">
            <li>📌 <span className="font-medium">Infosys</span> company added</li>
            <li>📌 25 students applied for <span className="font-medium">TCS</span></li>
            <li>📌 Placement results updated for <span className="font-medium">Wipro</span></li>
            <li>📌 12 new student registrations completed</li>
          </ul>
        </div>

        {/* Metrics Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Applications per Company</h2>
          <div className="w-full h-64 sm:h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#4F46E5" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Companies & Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Top Companies</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>Infosys</span>
                <span className="text-sm sm:text-base text-gray-500">120 Applications</span>
              </li>
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>TCS</span>
                <span className="text-sm sm:text-base text-gray-500">95 Applications</span>
              </li>
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>Wipro</span>
                <span className="text-sm sm:text-base text-gray-500">80 Applications</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Top Placed Students</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>John Doe</span>
                <span className="text-sm sm:text-base text-green-600 font-semibold">Placed at Infosys</span>
              </li>
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>Jane Smith</span>
                <span className="text-sm sm:text-base text-green-600 font-semibold">Placed at TCS</span>
              </li>
              <li className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition">
                <span>David Lee</span>
                <span className="text-sm sm:text-base text-green-600 font-semibold">Placed at Wipro</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
