

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
  const [student, setStudent] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    rollNo: "",
    branch: "",
    cgpa: "",
    resume: null,
  });

  /* ================= LOAD STUDENT ================= */
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);

      setFormData({
        fullname: parsed.name || "",
        email: parsed.email || "",
        mobile: "",
        rollNo: parsed.rollNo || "",
        branch: parsed.department || "",
        cgpa: parsed.cgpa || "",
        resume: null,
      });
    }
  }, []);

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

    if (!mobile) {
      toast.error("Please enter mobile number");
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
      data.append("companyId", selectedCompany._id);

      // User can upload new resume OR use profile resume
      if (resume) {
        data.append("resume", resume);
      } else if (student?.resume) {
        data.append("resume", student.resume);
      }

      await axios.post(
        `${BACKEND_URL}/api/apply/applications`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      toast.success("Application submitted successfully 🎉");

      setShowForm(false);
      setSelectedCompany(null);
      setFormData({
        ...formData,
        mobile: "",
        resume: null,
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed ❌");
    }
  };

  /* ================= CHECK DEADLINE ================= */
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

          {/* HEADER */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Eligible Companies
            </h1>
            <p className="text-gray-600 mt-1">
              View all companies and apply to the ones matching your profile
            </p>
          </div>

          {/* COMPANIES GRID */}
          {loading ? (
           <div className="flex flex-col justify-center items-center h-40 gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">
              Loading applications...
            </p>
          </div>
          ) : companies.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              No companies available yet.
            </p>
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
                      <p className="text-sm text-gray-500 mt-1">
                        Role: {company.role}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>💰 Package: {company.package} LPA</p>
                        <p>🎓 Min CGPA: {company.eligibilityCgpa}</p>
                        <p>🏫 Dept: {company.eligibleDepartments.join(", ")}</p>
                        <p>📍 Location: {company.location}</p>
                        <p>📝 Description: {company.description || "No description"}</p>
                        <p>
                          🗓 Last Date:{" "}
                          {company.lastDate
                            ? new Date(company.lastDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      {company.interviews.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <h3 className="font-medium text-gray-700">
                            Interviews Data and Rounds:
                          </h3>
                          {company.interviews.map((i, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {i.round} -{" "}
                              {new Date(i.date).toLocaleDateString()} ({i.mode}) |
                              Status: {i.status} | Feedback:{" "}
                              {i.feedback || "N/A"}
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
                        className="mt-6 w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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
            <div className="bg-white rounded-xl w-full max-w-lg p-6 sm:p-8">

              <h2 className="text-xl font-bold mb-4 text-center">
                Apply for {selectedCompany.companyName}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input type="text" value={formData.fullname} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

                <input type="email" value={formData.email} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />

                <input type="text" value={formData.rollNo} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

                <input type="text" value={formData.branch} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

                <input type="text" value={formData.cgpa} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

                {/* Resume Upload */}
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleChange}
                  className="w-full border cursor-pointer px-3 py-2 rounded"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 cursor-pointer border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded"
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
