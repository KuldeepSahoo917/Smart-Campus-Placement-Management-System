




import { uploadToCloudinary } from "../config/cloudinary.js";
import Application from "../model/ApplicationModel.js";
import Student from "../model/studentModel.js";


/* ================= APPLY FOR COMPANY ================= */
export const applyForCompany = async (req, res) => {
  try {
    const { fullname, email, registrationNumber, branch, cgpa, companyId } = req.body;

    if (!fullname || !email || !registrationNumber || !branch || !cgpa || !companyId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "Resume is required" });
    }

    // Find student
    const student = await Student.findOne({ rollNo: registrationNumber });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    // Upload resume to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, "resumes");

    // Create application
    const application = await Application.create({
      student: student._id,
      company: companyId,
      studentDetails: {
        name: fullname,
        email,
        rollNo: registrationNumber,
        branch,
        cgpa,
        resume: result.secure_url, // Cloudinary URL
      },
      status: "Applied",
    });

    res.status(201).json({ success: true, message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Apply Error:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already applied" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
/* ================= GET STUDENT APPLICATIONS ================= */
export const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ success: false, message: "Student ID is required" });

    const applications = await Application.find({ student: studentId })
      .populate("company", "companyName role package")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL APPLICATIONS (ADMIN) ================= */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("company", "companyName role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE APPLICATION STATUS ================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true, runValidators: true }
    );

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    res.status(200).json({ success: true, message: "Application status updated successfully", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= DELETE APPLICATION ================= */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params; // application ID
    if (!id) return res.status(400).json({ success: false, message: "Application ID is required" });

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    await application.deleteOne();

    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
