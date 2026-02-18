
import { uploadToCloudinary } from "../config/cloudinary.js";
import Application from "../model/ApplicationModel.js";
import Student from "../model/studentModel.js";
import { sendEmail } from "../service/emailService.js";

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

    const student = await Student.findOne({ rollNo: registrationNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "resumes");

    const application = await Application.create({
      student: student._id,
      company: companyId,
      studentDetails: {
        name: fullname,
        email,
        rollNo: registrationNumber,
        branch,
        cgpa,
        resume: result.secure_url,
      },
      status: "Applied",
    });

    // Populate company details for email
    const populatedApplication = await Application.findById(application._id)
      .populate("company", "companyName role package");

    /* ===== SEND EMAIL AFTER APPLY ===== */
    await sendEmail({
      to: email,
      subject: `Application Confirmation – ${populatedApplication.company.companyName}`,
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#2c3e50;">Application Received</h2>

          <p>Dear ${fullname},</p>

          <p>
            This is to formally confirm that your application for the position of 
            <strong>${populatedApplication.company.role}</strong> at 
            <strong>${populatedApplication.company.companyName}</strong>
            has been successfully submitted.
          </p>

          <p>
            <strong>Offered Package:</strong> ${populatedApplication.company.package || "As per company norms"} LPA
          </p>

          <p>
            Our recruitment team will carefully review your profile. 
            You will be notified regarding further updates in due course.
          </p>

          <br/>

          <p>Yours sincerely,</p>
          <p><strong>Placement Cell</strong></p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("Apply Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= UPDATE APPLICATION STATUS ================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const application = await Application.findById(req.params.id).populate(
      "company",
      "companyName role"
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    application.remarks = remarks || "";
    await application.save();

    /* ===== SEND EMAIL WHEN STATUS UPDATED ===== */
    await sendEmail({
      to: application.studentDetails.email,
      subject: `Application Status Update – ${application.company.companyName}`,
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#2c3e50;">Application Status Notification</h2>

          <p>Dear ${application.studentDetails.name},</p>

          <p>
            We would like to inform you that there has been an update regarding your application for the position of 
            <strong>${application.company.role}</strong> at 
            <strong>${application.company.companyName}</strong>. 
            Kindly log in to your account to review the latest information.
          </p>


          <p><strong>Latest Update on Your Application:</strong> ${status}</p>


          ${
            remarks
              ? `<p><strong>Additional Remarks:</strong> ${remarks}</p>`
              : ""
          }

          ${
            status === "Shortlisted"
              ? `<p style="color:green;">
                   Congratulations! You have been shortlisted for the next stage of the selection process.
                   Further details will be communicated shortly.
                 </p>`
              : status === "Selected"
              ? `<p style="color:green;">
                   Congratulations! You have been selected. Our team will contact you with onboarding details.
                 </p>`
              : status === "Rejected"
              ? `<p style="color:red;">
                   We appreciate your interest in this opportunity. Although you were not selected this time,
                   we encourage you to apply for future openings.
                 </p>`
              : `<p>
                   Please log in to your dashboard for more details regarding this update.
                 </p>`
          }

          <br/>

          <p>Yours sincerely,</p>
          <p><strong>Placement Cell</strong></p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Application status updated and email sent",
      application,
    });

  } catch (error) {
    console.error("Update Error:", error.message);
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





/* ================= GET ALL APPLICATIONS (ADMIN Panel) ================= */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $lookup: {
          from: "companies", // collection name in MongoDB
          localField: "company",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      {
        $sort: { "company.companyName": 1 } // 1 = A to Z
      }
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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
