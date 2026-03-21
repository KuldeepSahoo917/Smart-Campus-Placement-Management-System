
import React, { useEffect, useState } from "react";
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
import axios from "axios";

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    applications: 0,
    placed: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  /* ================= FETCH ================= */
  const fetchDashboardData = async () => {
    try {
      const [studentsRes, companiesRes, applicationsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/adminstudent`),
        axios.get(`${BACKEND_URL}/api/companies`),
        axios.get(`${BACKEND_URL}/api/apply`),
      ]);

      const students = studentsRes.data.students || [];
      const companies = companiesRes.data.companies || [];
      const applications = applicationsRes.data.applications || [];

      const placed = applications.filter((a) => a.status === "Selected");

      /* ===== STATS ===== */
      setStats({
        students: students.length,
        companies: companies.length,
        applications: applications.length,
        placed: placed.length,
      });

      /* ===== CHART ===== */
      const map = {};
      applications.forEach((a) => {
        const name = a.company?.companyName || "Unknown";
        map[name] = (map[name] || 0) + 1;
      });

      const chartArr = Object.keys(map).map((key) => ({
        company: key,
        applications: map[key],
      }));

      setChartData(chartArr);

      /* ===== TOP COMPANIES ===== */
      const sortedCompanies = [...chartArr]
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 3);

      setTopCompanies(sortedCompanies);

      /* ===== TOP STUDENTS ===== */
      const topPlaced = placed.slice(0, 3).map((p) => ({
        name: p.studentDetails?.name,
        company: p.company?.companyName,
      }));

      setTopStudents(topPlaced);

      /* ===== RECENT ===== */
      const activities = [
        ...companies.slice(-2).map((c) => `📌 ${c.companyName} added`),
        ...applications.slice(-2).map(
          (a) =>
            `📌 ${a.studentDetails?.name} applied for ${a.company?.companyName}`
        ),
      ];

      setRecentActivities(activities.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Students",
              value: stats.students,
              icon: <Users />,
              color: "from-blue-400 to-blue-600",
            },
            {
              title: "Companies",
              value: stats.companies,
              icon: <Briefcase />,
              color: "from-green-400 to-green-600",
            },
            {
              title: "Applications",
              value: stats.applications,
              icon: <FileText />,
              color: "from-purple-400 to-purple-600",
            },
            {
              title: "Placed Students",
              value: stats.placed,
              icon: <Award />,
              color: "from-yellow-400 to-yellow-600",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transition`}
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <h3>{card.title}</h3>
              </div>
              <p className="text-3xl font-bold mt-4">{card.value}</p>
            </div>
          ))}
        </div>

        {/* ================= RECENT ================= */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Recent Activities
          </h2>

          {recentActivities.length === 0 ? (
            <p className="text-gray-500">No activity</p>
          ) : (
            <ul className="space-y-2 text-gray-600">
              {recentActivities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= CHART ================= */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Applications per Company
          </h2>

          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= EXTRA SECTIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TOP COMPANIES */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Companies</h2>

            {topCompanies.length === 0 ? (
              <p className="text-gray-500">No data</p>
            ) : (
              <ul className="space-y-2">
                {topCompanies.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <span>{c.company}</span>
                    <span className="text-gray-500">
                      {c.applications} Applications
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* TOP STUDENTS */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Top Placed Students
            </h2>

            {topStudents.length === 0 ? (
              <p className="text-gray-500">No placements yet</p>
            ) : (
              <ul className="space-y-2">
                {topStudents.map((s, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <span>{s.name}</span>
                    <span className="text-green-600 font-medium">
                      Placed at {s.company}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
