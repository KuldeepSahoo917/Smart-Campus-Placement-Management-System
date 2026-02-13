

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Companies = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    rollNo: "",
    branch: "",
    cgpa: "",
    resume: null,
  });

  /* ================= FETCH COMPANIES ================= */
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/companies`);
      setCompanies(res.data.companies || []);
    } catch (error) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= SUBMIT APPLICATION ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, mobile, rollNo, branch, cgpa, resume } = formData;

    if (!fullname || !email || !mobile || !rollNo || !branch || !cgpa || !resume) {
      toast.error("Please fill all fields and upload resume");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullname", fullname);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("registrationNumber", rollNo);
      data.append("branch", branch);
      data.append("cgpa", cgpa);
      data.append("resume", resume);
      data.append("companyId", selectedCompany._id);

      await axios.post(`${BACKEND_URL}/api/apply/applications`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Application submitted successfully 🎉");

      setShowForm(false);
      setSelectedCompany(null);
      setFormData({
        fullname: "",
        email: "",
        mobile: "",
        rollNo: "",
        branch: "",
        cgpa: "",
        resume: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed ❌");
    }
  };

  /* ================= CHECK APPLICATION DEADLINE ================= */
  const isApplicationOpen = (lastDate) => {
    if (!lastDate) return true;
    const today = new Date();
    const endDate = new Date(lastDate);
    return today <= endDate;
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Eligible Companies
            </h1>
            <p className="text-gray-600 mt-1">
              View all companies and apply to the ones matching your profile
            </p>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : companies.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No companies available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => {
                const open = isApplicationOpen(company.lastDate);

                return (
                  <div
                    key={company._id}
                    className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {company.companyName}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Role: {company.role}</p>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>💰 Package: {company.package} LPA</p>
                        <p>🎓 Min CGPA: {company.eligibilityCgpa}</p>
                        <p>🏫 Dept: {company.eligibleDepartments.join(", ")}</p>
                        <p>📍 Location: {company.location}</p>
                        <p>📝 Description: {company.description || "No description"}</p>
                        <p>🗓 Last Date: {company.lastDate ? new Date(company.lastDate).toLocaleDateString() : "N/A"}</p>
                      </div>

                      {/* Interview rounds */}
                      {company.interviews.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <h3 className="font-medium text-gray-700">Interviews Data and Rounds:</h3>
                          {company.interviews.map((i, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {i.round} - {new Date(i.date).toLocaleDateString()} ({i.mode}) | Status: {i.status} | Feedback: {i.feedback || "N/A"}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {open ? (
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowForm(true);
                        }}
                        className="mt-6 w-full cursor-pointer  bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-6 w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
                      >
                        Applications Closed
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= APPLY MODAL ================= */}
        {showForm && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4 text-center">
                Apply for {selectedCompany.companyName}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="Roll Number / Registration Number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ME">ME</option>
                  <option value="EE">EE</option>
                  <option value="CE">CE</option>
                </select>

                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="CGPA"
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input
                  type="file"
                  name="resume"
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedCompany(null);
                    }}
                    className="px-4 py-2 border cursor-pointer rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 cursor-pointer  text-white rounded"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Companies;


