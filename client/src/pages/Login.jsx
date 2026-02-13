

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rollNo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/login`,
        formData
      );

      // ✅ DEBUG LOGS (VERY IMPORTANT)
      console.log("FULL RESPONSE 👉", res.data);
      console.log("STUDENT OBJECT 👉", res.data.student);
      console.log("STUDENT ID 👉", res.data.student.id);

      if (res.data.success) {
        // ✅ Store in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("studentId", res.data.student.id);
        localStorage.setItem("student", JSON.stringify(res.data.student));

        console.log(
          "LOCAL STORAGE ID 👉",
          localStorage.getItem("studentId")
        );

        // 🔴 Delay navigation so console is visible
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (err) {
      console.error("LOGIN ERROR 👉", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Student Login
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Smart Campus Placement System
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
             Registration Number
            </label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
