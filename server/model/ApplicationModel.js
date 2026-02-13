import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // Store student details at the time of application (snapshot)
    studentDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      rollNo: { type: String, required: true },
      branch: { type: String, required: true },
      cgpa: { type: Number, required: true },
      resume: { type: String, required: true }, // URL or filename
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
      default: "Applied",
      required: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    remarks: {
      type: String, // Optional admin notes
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

/* Prevent duplicate applications for the same student & company */
applicationSchema.index({ student: 1, company: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
