
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, Award } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");
  const student = JSON.parse(localStorage.getItem("student"));

  /* ================= FETCH APPLICATIONS ================= */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/apply/student/${studentId}`
        );

        setApplications(res.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [studentId, BACKEND_URL]);

  /* ================= CALCULATIONS ================= */

  const totalApplied = applications.length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const selected = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const placementProgress = [
    { name: "Selected", value: selected },
    { name: "Remaining", value: totalApplied - selected },
  ];

  const COLORS = ["#10B981", "#E5E7EB"];

  const todayDate = new Date().toLocaleDateString();

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ================= WELCOME SECTION ================= */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-indigo-600">
              {student?.name || "Student"}
            </span>{" "}
            👋
          </h1>

          <p className="text-gray-600 mt-2">
            Roll No:{" "}
            <span className="font-medium">
              {student?.rollNo || "N/A"}
            </span>{" "}
            | Branch:{" "}
            <span className="font-medium">
              {student?.department || "N/A"}
            </span>
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Today is {todayDate}
          </p>
        </div>

        {/* ================= STATS SECTION ================= */}
        {loading ? (
        <div className="flex flex-col justify-center items-center h-40 gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm animate-pulse">
            Loading applications...
          </p>
        </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <TrendingUp className="text-blue-600 mb-2" />
              <h3 className="text-xl font-bold">{totalApplied}</h3>
              <p className="text-gray-500 text-sm">Total Applications</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <Award className="text-yellow-600 mb-2" />
              <h3 className="text-xl font-bold">{shortlisted}</h3>
              <p className="text-gray-500 text-sm">Shortlisted</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <Award className="text-red-600 mb-2" />
              <h3 className="text-xl font-bold">{rejected}</h3>
              <p className="text-gray-500 text-sm">Rejected</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <Award className="text-green-600 mb-2" />
              <h3 className="text-xl font-bold">{selected}</h3>
              <p className="text-gray-500 text-sm">Selected 🎉</p>
            </div>

          </div>
        )}

        {/* ================= PIE CHART ================= */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-center gap-8 mb-12">

          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementProgress}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {placementProgress.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Placement Progress
            </h2>
            <p className="text-gray-500">
              You have been selected in{" "}
              <span className="text-green-600 font-bold">
                {selected}
              </span>{" "}
              companies.
            </p>
          </div>

        </div>

        {/* ================= RECENT APPLICATIONS ================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Applications
          </h2>

          {applications.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No applications found.
            </p>
          ) : (
            applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex justify-between items-center border-b pb-3 mb-3"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {app.company?.companyName} – {app.company?.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    app.status === "Selected"
                      ? "bg-green-100 text-green-600"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-600"
                      : app.status === "Shortlisted"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
