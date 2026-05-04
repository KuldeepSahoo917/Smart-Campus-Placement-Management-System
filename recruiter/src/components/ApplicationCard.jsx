import axios from "axios";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function ApplicationCard({ app, refresh }) {
  const token = localStorage.getItem("token");
  const [resumeModal, setResumeModal] = useState(false);

  // 🛑 Prevent crash if data missing
  if (!app || !app.studentDetails) return null;

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (status) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/recruiter/applications/${app._id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      toast.success(`Status updated to ${status} ✅`);
      refresh();
    } catch (error) {
      toast.error("Update failed ❌");
    }
  };

  /* ================= FILE TYPE ================= */
  const isPDF = (url) => url?.toLowerCase().includes(".pdf");

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-5 border hover:shadow-xl transition duration-300">

        {/* 🔹 Student Info */}
        <h3 className="text-lg font-bold text-gray-800">
          {app?.studentDetails?.name || "No Name"}
        </h3>

        <p className="text-sm text-gray-600">
          {app?.studentDetails?.email || "No Email"}
        </p>

        <p className="text-sm text-gray-600">
          {app?.studentDetails?.branch || "-"} • CGPA:{" "}
          {app?.studentDetails?.cgpa || "-"}
        </p>

        {/* 🔹 Company Info */}
        <div className="mt-2 text-sm text-gray-700">
          <p><strong>Company:</strong> {app?.company?.companyName || "-"}</p>
          <p><strong>Role:</strong> {app?.company?.role || "-"}</p>
        </div>

        {/* 🔹 Status */}
        <div className="mt-3">
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
        </div>

        {/* 🔹 Resume */}
        <div className="mt-3">
          {isPDF(app?.studentDetails?.resume) ? (
            <a
              href={`${app?.studentDetails?.resume}?fl_attachment=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-sm font-medium hover:underline"
            >
              Download Resume
            </a>
          ) : (
            <button
              onClick={() => setResumeModal(true)}
              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
            >
              View Resume
            </button>
          )}
        </div>

        {/* 🔹 Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => updateStatus("Shortlisted")}
            className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"
          >
            Shortlist
          </button>

          <button
            onClick={() => updateStatus("Selected")}
            className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 text-sm cursor-pointer"
          >
            Select
          </button>

          <button
            onClick={() => updateStatus("Rejected")}
            className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
          >
            Reject
          </button>
        </div>
      </div>

      {/* 🔹 Resume Modal */}
      {resumeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setResumeModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setResumeModal(false)}
            >
              <X size={20} />
            </button>

            <img
              src={app?.studentDetails?.resume}
              alt="resume"
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
