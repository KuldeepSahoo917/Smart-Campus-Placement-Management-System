

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // ✅ Get student from localStorage
        const studentData = localStorage.getItem("student");

        if (!studentData) {
          setError("Student not logged in");
          setLoading(false);
          return;
        }

        const student = JSON.parse(studentData);

        // ✅ Handle both `id` and `_id`
        const studentId = student.id || student._id;

        if (!studentId) {
          setError("Invalid student ID");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${BACKEND_URL}/api/apply/student/${studentId}`
        );

        if (res.data.success) {
          setApplications(res.data.applications);
        } else {
          setError("Failed to fetch applications");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [BACKEND_URL]);

  return (
    <>
      <Navbar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Track the status of your job applications
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-40 gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse">
                Loading applications...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {/* No Applications */}
          {!loading && applications.length === 0 && !error && (
            <p className="text-center text-gray-500">
              You have not applied to any company yet.
            </p>
          )}

          {/* Applications Table */}
          {!loading && applications.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Package
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b">
                      <td className="px-4 py-3">
                        {app.company?.companyName || "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        {app.company?.role || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {app.company?.package
                          ? `${app.company.package} LPA`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              app.status === "Selected"
                                ? "bg-green-100 text-green-600"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-600"
                                : app.status === "Shortlisted"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }
                          `}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Tip: Scroll horizontally on small screens
          </p>

        </div>
      </div>
    </>
  );
};

export default MyApplication;
