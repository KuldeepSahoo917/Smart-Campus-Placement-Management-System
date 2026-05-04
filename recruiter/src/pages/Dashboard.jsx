import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationCard from "../components/ApplicationCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/recruiter/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data.applications);

      // ✅ Optional success toast
      // toast.success("Applications loaded");

    } catch (error) {
      console.log(error);

      // ✅ Show toast on error
      toast.error("Failed to fetch applications ❌");

      // 🔐 Optional: auto logout if token invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔹 Header */}
      <div className="bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* 🔹 Content */}
      <div className="p-4 sm:p-6">

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Applications
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                refresh={fetchApplications}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
