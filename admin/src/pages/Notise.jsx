import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash, Upload, X } from "lucide-react";

const AdminNotice = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // for modal preview

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notice`);
      setNotices(res.data.notices);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Add notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!text && !image) return toast.error("Please provide text or upload an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/notice`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Notice added successfully");
      setTitle("");
      setText("");
      setImage(null);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add notice");
    } finally {
      setLoading(false);
    }
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`${API_URL}/api/notice/${id}`);
      toast.success("Notice deleted successfully");
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 mt-10 text-center text-gray-800">Admin Notices</h1>

      {/* Add Notice Form */}
      <div className="max-w-3xl mx-auto mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold cursor-pointer mb-4 text-gray-700">Add New Notice</h2>
        <form onSubmit={handleAddNotice} className="space-y-4">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            placeholder="Notice text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={3}
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center  cursor-pointer text-gray-600 hover:text-gray-800">
              <Upload className="mr-2" /> Upload Image (optional)
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>
            {image && <span className="text-sm text-gray-500">{image.name}</span>}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {loading ? "Adding..." : "Add Notice"}
            </button>
          </div>
        </form>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col"
          >
            {notice.image && (
              <img
                src={notice.image}
                alt={notice.title || "Notice"}
                className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => setPreviewImage(notice.image)}
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              {notice.title && <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>}
              {notice.text && <p className="text-gray-700 flex-1">{notice.text}</p>}
            </div>
            <button
              onClick={() => handleDelete(notice._id)}
              className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700"
            >
              <Trash />
            </button>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img src={previewImage} alt="Preview" className="max-h-[80vh] max-w-[90vw] rounded" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute cursor-pointer top-2 right-2 text-white bg-red-500 p-1 rounded-full hover:bg-red-600"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotice;