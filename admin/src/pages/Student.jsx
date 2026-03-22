import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Students = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    password: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/adminstudent`);
      setStudents(res.data.students);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNo || !formData.department || (!isEdit && !formData.password)) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/api/adminstudent/${currentId}`, formData);
        toast.success("Student updated successfully");
      } else {
        await axios.post(`${BACKEND_URL}/api/adminstudent`, formData);
        toast.success("Student added successfully");
      }
      setShowForm(false);
      setIsEdit(false);
      setCurrentId(null);
      setFormData({ name: "", email: "", rollNo: "", department: "", password: "" });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/adminstudent/${id}`);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (student) => {
    setIsEdit(true);
    setCurrentId(student._id);
    setShowForm(true);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      department: student.department,
      password: "",
    });
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Students</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            + Add Student
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">
              Loading applications...
            </p>
          </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Registration No</th>
                  <th className="px-6 py-3 text-left font-semibold">Department</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4">{s.rollNo}</td>
                    <td className="px-6 py-4">{s.department}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 cursor-pointer hover:underline text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 cursor-pointer hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {loading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse">
                Loading applications...
              </p>
            </div>
          ) : (
            students.map((s) => (
              <div key={s._id} className="bg-white rounded-xl shadow p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {s.department}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{s.email}</p>
                <p className="text-sm text-gray-600">Registration No: {s.rollNo}</p>
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 text-sm cursor-pointer font-medium hover:underline"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600 text-sm cursor-pointer font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Update Student" : "Add Student"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="Registration Number"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ME">ME</option>
                <option value="EE">EE</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
              </select>
              {!isEdit && (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 cursor-pointer border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded">
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Students;
