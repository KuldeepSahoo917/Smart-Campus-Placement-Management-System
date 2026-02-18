



import Company from "../model/companyModel.js";
import { sendEmail } from "../service/emailService.js";
import Student from "../model/studentModel.js";



/* CREATE COMPANY */
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    // Get all students
    const students = await Student.find({}, "name email");

    // Send email to each student
    for (const student of students) {
      await sendEmail({
        to: student.email,
        subject: `New Job Opportunity – ${company.companyName}`,
        message: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color:#2c3e50;">New Placement Opportunity</h2>

            <p>Dear ${student.name || "Student"},</p>

            <p>
              We are pleased to inform you that a new job opportunity has been announced 
              by <strong>${company.companyName}</strong>.
            </p>

            <p>
              <strong>Position:</strong> ${company.role} <br/>
              <strong>Package:</strong> ${company.package || "As per company norms"} <br/>
              <strong>Location:</strong> ${company.location || "Not specified"}
            </p>

            <p>
              Interested candidates are advised to log in to the placement portal 
              and submit their applications before the deadline.
            </p>

            <br/>

            <p>Yours sincerely,</p>
            <p><strong>Placement Cell</strong></p>
          </div>
        `,
      });
    }

    res.status(201).json({
      success: true,
      message: "Company added successfully and email sent to all students",
      company,
    });

  } catch (error) {
    console.error("Create Company Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* GET ALL COMPANIES */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET SINGLE COMPANY */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company)
      return res.status(404).json({ success: false, message: "Company not found" });

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* UPDATE COMPANY */
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company)
      return res.status(404).json({ success: false, message: "Company not found" });

    res.status(200).json({ success: true, message: "Company updated successfully", company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* DELETE COMPANY */
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company)
      return res.status(404).json({ success: false, message: "Company not found" });

    res.status(200).json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

