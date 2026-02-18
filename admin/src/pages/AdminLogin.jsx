import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/home");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isRegister
        ? `${BACKEND_URL}/api/admin/register`
        : `${BACKEND_URL}/api/admin/login`;

      const response = await axios.post(url, formData);

      // save token in localStorage
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminName", response.data.admin.name);
      localStorage.setItem("adminEmail", response.data.admin.email);

      toast.success(response.data.message || "Success 🎉");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isRegister ? "Admin Registration" : "Admin Login"}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Smart Campus Placement System
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 cursor-pointer text-blue-600 font-medium hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
