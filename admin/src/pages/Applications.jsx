

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react"; // close icon

const Applications = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppId, setEditingAppId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [resumeModal, setResumeModal] = useState({ open: false, url: "" });

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/apply`);
      setApplications(res.data.applications);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status
 
  const handleUpdateStatus = async (id) => {
  if (!newStatus) {
    toast.error("Please select a status");
    return;
  }

  try {
    await axios.put(`${BACKEND_URL}/api/apply/${id}/status`, { status: newStatus });
    toast.success("Status updated successfully");
    setEditingAppId(null);
    setNewStatus("");
    fetchApplications();
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
};

  // Delete application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/apply/${id}`);
      toast.success("Application deleted successfully");
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // Check if URL is a PDF
  const isPDF = (url) => url.toLowerCase().endsWith(".pdf");

  return (
    <>
      <main className="pt-20 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl  font-bold text-gray-800">
              Applications
            </h1>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
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
                    <th className="px-6 py-3 text-left font-semibold">Student</th>
                    <th className="px-6 py-3 text-left font-semibold">Company</th>
                    <th className="px-6 py-3 text-left font-semibold">Role</th>
                    <th className="px-6 py-3 text-left font-semibold">Resume</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{app.studentDetails.name}</td>
                      <td className="px-6 py-4">{app.company?.companyName}</td>
                      <td className="px-6 py-4">{app.company?.role}</td>

                      {/* Resume */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setResumeModal({ open: true, url: app.studentDetails.resume })
                          }
                          className="text-blue-600 cursor-pointer hover:underline text-sm font-medium"
                        >
                          View Resume
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {editingAppId === app._id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border px-2 py-1 rounded"
                          >
                            <option value="">Select Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.status === "Selected"
                                ? "bg-green-100 text-green-700"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : app.status === "Shortlisted"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 space-x-2">
                        {editingAppId === app._id ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app._id)}
                              className="text-green-600 cursor-pointer hover:underline text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAppId(null)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingAppId(app._id);
                                setNewStatus(app.status);
                              }}
                              className="text-blue-600 cursor-pointer hover:underline text-sm"
                            >
                              Update
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="text-red-600 cursor-pointer hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Resume Modal */}
        {resumeModal.open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={() => setResumeModal({ open: false, url: "" })}
          >
            <div
              className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon */}
              <button
                className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => setResumeModal({ open: false, url: "" })}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">Resume Preview</h2>

              {/* PDF or Image Preview */}
              {isPDF(resumeModal.url) ? (
                <iframe
                  src={resumeModal.url}
                  title="Resume"
                  className="w-full h-[80vh] border rounded"
                  frameBorder="0"
                ></iframe>
              ) : (
                <img
                  src={resumeModal.url}
                  alt="Resume"
                  className="w-full h-auto max-h-[80vh] object-contain rounded"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Applications;
