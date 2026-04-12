
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, X } from "lucide-react";
import Navbar from "../components/Navbar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ FULL TECHNICAL SKILLS LIST
const ALL_SKILLS = [
  "C","C++","Java","Python","JavaScript","TypeScript",
  "Go","Rust","Kotlin","Swift","Dart","Ruby","PHP",
  "Scala","Perl","Haskell","Shell Scripting","Bash",
  "HTML","CSS","SASS","Tailwind CSS","Bootstrap",
  "React","Next.js","Vue.js","Nuxt.js","Angular",
  "Redux","Zustand","jQuery",
  "Node.js","Express.js","NestJS",
  "Spring Boot","Spring MVC","Hibernate",
  "Django","Flask","FastAPI",
  "Laravel","CodeIgniter","ASP.NET",
  "MongoDB","MySQL","PostgreSQL","SQLite",
  "Oracle DB","Redis","Cassandra","Firebase",
  "DynamoDB",
  "AWS","Azure","Google Cloud",
  "Docker","Kubernetes","Jenkins",
  "GitHub Actions","CI/CD","Terraform",
  "Ansible","Nginx",
  "Git","GitHub","GitLab","Bitbucket",
  "Postman","Swagger","Webpack","Vite",
  "Figma","Adobe XD",
  "React Native","Flutter","Android","iOS",
  "Kotlin Android","Swift iOS",
  "Machine Learning","Deep Learning",
  "TensorFlow","PyTorch","Scikit-learn",
  "Pandas","NumPy","Data Analysis",
  "Computer Vision","NLP",
  "Power BI","Tableau","Excel",
  "Data Visualization","ETL",
  "Big Data","Hadoop","Spark",
  "Cybersecurity","Ethical Hacking",
  "Penetration Testing","Network Security",
  "Cryptography","OWASP",
  "Computer Networks","TCP/IP","DNS","HTTP",
  "Load Balancing","Firewall",
  "Jest","Mocha","Chai",
  "Cypress","Selenium","JUnit",
  "Unit Testing","Integration Testing",
  "REST API","GraphQL","Microservices",
  "MVC","Design Patterns","OOP",
  "Data Structures","Algorithms",
  "System Design",
  "Unity","Unreal Engine","Game Development",
  "Blockchain","Web3","Solidity",
  "IoT","Embedded Systems",
  "AR/VR"
];

const Profile = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [edit, setEdit] = useState(false);

  const [cgpa, setCgpa] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  const profileCompletion = () => {
    let total = 3;
    let completed = 0;

    if (cgpa) completed++;
    if (year) completed++;
    if (skills.length > 0) completed++;

    return Math.floor((completed / total) * 100);
  };

  const handleSkillChange = (value) => {
    setNewSkill(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = ALL_SKILLS.filter((skill) =>
      skill.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    if (skills.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
      toast.warning("Skill already added");
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
    setSuggestions([]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleUpdate = async () => {
    try {
      const studentId = localStorage.getItem("studentId");

      const form = new FormData();
      form.append("cgpa", cgpa);
      form.append("year", year);
      form.append("skills", JSON.stringify(skills));

      const res = await axios.put(
        `${BACKEND_URL}/api/student/update/${studentId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedStudent = res.data.student;

      localStorage.setItem("student", JSON.stringify(updatedStudent));
      setStudent(updatedStudent);
      setEdit(false);

      toast.success("Profile updated successfully 🚀");
    } catch {
      toast.error("Update failed ❌");
    }
  };

  if (!student) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 pt-28 pb-16 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto backdrop-blur-lg bg-white/60 border border-white/40 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-12">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {student.name}
              </h1>
              <p className="text-gray-600 mt-1">{student.department}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="text-sm font-semibold px-3 sm:px-4 py-2 rounded-full bg-indigo-100 text-indigo-700">
                {profileCompletion()}% Complete
              </div>

              <button
                onClick={() => setEdit(!edit)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
              >
                {edit ? <X size={18} /> : <Pencil size={18} />}
                {edit ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Input label="Email" value={student.email} disabled />
            <Input label="Registration No" value={student.rollNo} disabled />
            <Input label="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} disabled={!edit} type="number" />
            <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} disabled={!edit} type="number" />
          </div>

          {/* SKILLS */}
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-gray-800">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {skills.map((skill, index) => (
                <div key={index} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md">
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
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 relative w-full">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => handleSkillChange(e.target.value)}
                    placeholder="Add new skill"
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border rounded-xl shadow-md mt-2 max-h-40 overflow-y-auto">
                      {suggestions.map((skill, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setNewSkill(skill);
                            setSuggestions([]);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={addSkill}
                  className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {edit && (
            <div className="text-right">
              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-xl hover:scale-105 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
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
