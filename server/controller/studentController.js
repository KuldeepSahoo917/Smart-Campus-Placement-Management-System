import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../model/studentModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

/* ================= LOGIN STUDENT ================= */
export const loginStudent = async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    // 1️⃣ Validate input
    if (!rollNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Roll number and password are required",
      });
    }

    // 2️⃣ Find student by roll number
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid roll number or password",
      });
    }

    // 3️⃣ Compare password (hashed)
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid roll number or password",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: student._id, rollNo: student.rollNo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        department: student.department,
        year: student.year,
        cgpa: student.cgpa,
        placed: student.placed,
        skills: student.skills || [],
        resume: student.resume || "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};







/* ================= UPDATE STUDENT PROFILE ================= */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;   // ✅ ID from URL

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const { cgpa, year, skills } = req.body;

    const updateData = {
      cgpa,
      year,
      skills: skills ? JSON.parse(skills) : [],
    };

    // ✅ Resume upload
    if (req.file) {
      updateData.resume = req.file.filename;
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student,
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};