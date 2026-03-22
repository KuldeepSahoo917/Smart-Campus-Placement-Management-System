

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Companies = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    location: "",
    package: "",
    eligibilityCgpa: "",
    eligibleDepartments: [],
    lastDate: "",
    description: "",
  });

  const [interviewData, setInterviewData] = useState([
    { round: "", date: "", mode: "Online", feedback: "" },
  ]);

  const allDepartments = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Chemical",
  ];

  const packageOptions = [3, 4, 5, 6, 7, 8, 9, 10];

  /* ================= FETCH COMPANIES ================= */
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/companies`);
      setCompanies(res.data.companies);
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
    const { name, value, checked } = e.target;

    if (name === "eligibleDepartments") {
      const updated = checked
        ? [...formData.eligibleDepartments, value]
        : formData.eligibleDepartments.filter((d) => d !== value);

      setFormData({ ...formData, eligibleDepartments: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInterviewChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...interviewData];
    updated[index][name] = value;
    setInterviewData(updated);
  };

  const addInterviewRound = () => {
    setInterviewData([
      ...interviewData,
      { round: "", date: "", mode: "Online", feedback: "" },
    ]);
  };

  const removeInterviewRound = (index) => {
    setInterviewData(interviewData.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        package: Number(formData.package),
        eligibilityCgpa: Number(formData.eligibilityCgpa),
        lastDate: new Date(formData.lastDate),
        interviews: interviewData.map((i) => ({
          ...i,
          date: new Date(i.date),
        })),
      };

      if (isEdit) {
        await axios.put(
          `${BACKEND_URL}/api/companies/${currentId}`,
          payload
        );
        toast.success("Company updated successfully");
      } else {
        await axios.post(`${BACKEND_URL}/api/companies`, payload);
        toast.success("Company added successfully");
      }

      closeModal();
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setIsEdit(false);
    setCurrentId(null);
    setFormData({
      companyName: "",
      role: "",
      location: "",
      package: "",
      eligibilityCgpa: "",
      eligibleDepartments: [],
      lastDate: "",
      description: "",
    });
    setInterviewData([{ round: "", date: "", mode: "Online", feedback: "" }]);
  };

  const handleEdit = (c) => {
    setIsEdit(true);
    setCurrentId(c._id);
    setShowForm(true);

    setFormData({
      companyName: c.companyName,
      role: c.role,
      location: c.location,
      package: c.package,
      eligibilityCgpa: c.eligibilityCgpa,
      eligibleDepartments: c.eligibleDepartments,
      lastDate: c.lastDate?.split("T")[0],
      description: c.description,
    });

    setInterviewData(
      c.interviews?.length > 0
        ? c.interviews.map((i) => ({
            round: i.round,
            date: i.date?.split("T")[0],
            mode: i.mode,
            feedback: i.feedback,
          }))
        : [{ round: "", date: "", mode: "Online", feedback: "" }]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      await axios.delete(`${BACKEND_URL}/api/companies/${id}`);
      toast.success("Company deleted");
      fetchCompanies();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Companies</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white cursor-pointer px-5 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Company
          </button>
        </div>

        {/* GRID */}
        {loading ? (
         <div className="flex flex-col justify-center items-center h-40 gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">
              Loading applications...
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold">
                    {c.companyName}
                  </h2>
                  <p className="text-blue-600 font-medium mb-2">
                    {c.role}
                  </p>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📍 {c.location}</p>
                    <p>💰 {c.package} LPA</p>
                    <p>🎓 CGPA: {c.eligibilityCgpa}</p>
                    <p>
                      🏫 {c.eligibleDepartments.join(", ")}
                    </p>
                    <p>
                      📅{" "}
                      {new Date(c.lastDate).toLocaleDateString()}
                    </p>
                  </div>

                  {c.interviews?.length > 0 && (
                    <div className="mt-3 border-t pt-2">
                      <h3 className="font-semibold mb-1">
                        Interview Rounds
                      </h3>
                      {c.interviews.map((i, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-2 rounded text-sm mb-2"
                        >
                          <p>
                            <strong>{i.round}</strong>
                          </p>
                          <p>
                            {new Date(i.date).toLocaleDateString()}
                          </p>
                          <p>{i.mode}</p>
                          <p>
                            {i.feedback || "No feedback"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex-1 bg-red-600 cursor-pointer text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Update Company" : "Add Company"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Package</option>
                {packageOptions.map((p) => (
                  <option key={p} value={p}>
                    {p} LPA
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="eligibilityCgpa"
                placeholder="Eligibility CGPA"
                value={formData.eligibilityCgpa}
                onChange={handleChange}
                required
                min="0"
                max="10"
                step="0.1"
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* INTERVIEW ROUNDS */}
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Interview Rounds
                </h3>

                {interviewData.map((round, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded mb-3 space-y-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      name="round"
                      placeholder="Round Name"
                      value={round.round}
                      onChange={(e) =>
                        handleInterviewChange(index, e)
                      }
                      required
                      className="w-full border p-2 rounded"
                    />

                    <input
                      type="date"
                      name="date"
                      value={round.date}
                      onChange={(e) =>
                        handleInterviewChange(index, e)
                      }
                      required
                      className="w-full border p-2 rounded"
                    />

                    <select
                      name="mode"
                      value={round.mode}
                      onChange={(e) =>
                        handleInterviewChange(index, e)
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="Online">Online</option>
                      <option value="Oncampus">Oncampus</option>
                    </select>

                    <textarea
                      name="feedback"
                      placeholder="Feedback"
                      value={round.feedback}
                      onChange={(e) =>
                        handleInterviewChange(index, e)
                      }
                      className="w-full border p-2 rounded"
                    />

                    {interviewData.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeInterviewRound(index)
                        }
                        className="text-red-600 cursor-pointer text-sm"
                      >
                        Remove Round
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addInterviewRound}
                  className="text-blue-600 cursor-pointer font-medium text-sm"
                >
                  + Add Another Round
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 cursor-pointer bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                >
                  {isEdit ? "Update Company" : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Companies;
