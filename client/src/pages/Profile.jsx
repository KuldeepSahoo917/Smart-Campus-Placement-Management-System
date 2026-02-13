

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, X, Upload } from "lucide-react";
import Navbar from "../components/Navbar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [edit, setEdit] = useState(false);

  const [cgpa, setCgpa] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [resume, setResume] = useState(null);

  const [showResume, setShowResume] = useState(false);

  /* ================= LOAD STUDENT ================= */
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    const studentId = localStorage.getItem("studentId");

    if (!storedStudent || !studentId) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedStudent);
    setStudent(parsed);
    setCgpa(parsed.cgpa || "");
    setYear(parsed.year || "");
    setSkills(parsed.skills || []);
  }, [navigate]);

  /* ================= PROFILE COMPLETION ================= */
  const profileCompletion = () => {
    let total = 4;
    let completed = 0;

    if (cgpa) completed++;
    if (year) completed++;
    if (skills.length > 0) completed++;
    if (student?.resume) completed++;

    return Math.floor((completed / total) * 100);
  };

  /* ================= SKILLS ================= */
  const addSkill = () => {
    if (!newSkill.trim()) return;

    if (skills.includes(newSkill.trim())) {
      toast.warning("Skill already added");
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    try {
      const studentId = localStorage.getItem("studentId");

      const form = new FormData();
      form.append("cgpa", cgpa);
      form.append("year", year);
      form.append("skills", JSON.stringify(skills));

      if (resume) {
        form.append("resume", resume);
      }

      const res = await axios.put(
        `${BACKEND_URL}/api/student/update/${studentId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedStudent = res.data.student;

      localStorage.setItem("student", JSON.stringify(updatedStudent));
      setStudent(updatedStudent);
      setEdit(false);
      setResume(null);

      toast.success("Profile updated successfully 🚀");
    } catch (error) {
      toast.error("Update failed ❌");
    }
  };

  if (!student) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto backdrop-blur-lg bg-white/60 border border-white/40 rounded-3xl shadow-2xl p-6 md:p-12">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {student.name}
              </h1>
              <p className="text-gray-600 mt-1">{student.department}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold px-4 py-2 rounded-full bg-indigo-100 text-indigo-700">
                {profileCompletion()}% Complete
              </div>

              <button
                onClick={() => setEdit(!edit)}
                className="flex items-center gap-2 px-5 py-2 cursor-pointer bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
              >
                {edit ? <X size={18} /> : <Pencil size={18} />}
                {edit ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Input label="Email" value={student.email} disabled />
            <Input label="Roll No" value={student.rollNo} disabled />
            <Input
              label="CGPA"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              disabled={!edit}
              type="number"
            />
            <Input
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!edit}
              type="number"
            />
          </div>

          {/* SKILLS */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3 mb-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm flex items-center gap-2 shadow-md"
                >
                  {skill}
                  {edit && (
                    <button onClick={() => removeSkill(skill)}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {edit && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill"
                  className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl cursor-pointer hover:bg-green-600"
                >
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {/* RESUME */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Resume
            </h2>

            {!edit && student.resume && (
              <button
                onClick={() => setShowResume(true)}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                View Uploaded Resume
              </button>
            )}

            {edit && (
              <label className="flex items-center gap-3 px-5 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-indigo-50">
                <Upload size={18} />
                Upload PDF Resume
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>
            )}
          </div>

          {edit && (
            <div className="text-right">
              <button
                onClick={handleUpdate}
                className="px-10 py-3 bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 text-white rounded-full shadow-xl hover:scale-105 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= PROFESSIONAL RESUME MODAL ================= */}
      {showResume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h2 className="text-lg md:text-xl font-semibold">
                My Resume
              </h2>

              <button
                onClick={() => setShowResume(false)}
                className="bg-white/20 cursor-pointer hover:bg-white/30 p-2 rounded-full transition"
              >
                ✕
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-100">
              <iframe
                src={student.resume}
                title="Resume"
                className="w-full h-full"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-4 bg-white">
              <a
                href={student.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-indigo-600 text-white cursor-pointer rounded-full hover:bg-indigo-700 transition"
              >
                Open in New Tab
              </a>

              <button
                onClick={() => setShowResume(false)}
                className="px-5 py-2 bg-gray-200 cursor-pointer rounded-full hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
    />
  </div>
);

export default Profile;