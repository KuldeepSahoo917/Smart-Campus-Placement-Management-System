import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const StudentNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch notices
  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notice`);
      setNotices(res.data.notices);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mt-10 mb-8 text-gray-800">
        Notices
      </h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-40 gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm animate-pulse">
            Loading applications...
          </p>
        </div>
      ) : notices.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No notices available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
            >
              {notice.image && (
                <img
                  src={notice.image}
                  alt={notice.title || "Notice"}
                  className="w-full h-52 md:h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setPreviewImage(notice.image)}
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                {notice.title && (
                  <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-800">
                    {notice.title}
                  </h3>
                )}
                {notice.text && (
                  <p className="text-gray-700 text-sm md:text-base flex-1">{notice.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-lg object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 shadow-md"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotice;
