import bcrypt from "bcryptjs";
import Student from "../model/studentModel.js";
import { sendEmail } from "../service/emailService.js";



/* ================= CREATE STUDENT ================= */
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, rollNo, department } = req.body;

    if (!name || !email || !password || !rollNo || !department) {
      return res.status(400).json({
        message: "Name, Email, Password, Roll No, and Department are required",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this email or roll number already exists",
      });
    }

    // Save original password for email
    const plainPassword = password;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      year: 1,
      cgpa: 0,
      skills: [],
      resume: "",
      placed: false,
    });

    /* ===== SEND LOGIN EMAIL ===== */
    await sendEmail({
      to: email,
      subject: "Placement Portal Registration Details",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#2c3e50;">Registration Successful</h2>

          <p>Dear ${name},</p>

          <p>
            You have been successfully registered on the Placement Portal.
            Below are your login credentials:
          </p>

          <p>
            <strong>Registration Number:</strong> ${rollNo} <br/>
            <strong>Password:</strong> ${plainPassword}
          </p>

          <p>
            You may now log in using the above credentials and complete your profile.
            For security reasons. 
          </p>

          <br/>

          <p>Yours sincerely,</p>
          <p><strong>Placement Cell</strong></p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully and login email sent",
      student,
    });

  } catch (error) {
    console.error("Create Student Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};





/* ================= GET ALL STUDENTS ================= */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE STUDENT ================= */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE STUDENT ================= */
export const updateStudent = async (req, res) => {
  try {
    const { password } = req.body;

    // If password is provided, hash it
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE STUDENT ================= */
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
