


import mongoose from "mongoose";

// Interview schema
const interviewSchema = new mongoose.Schema(
  {
    round: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    mode: { type: String, default: "Online" }, // Online / Onsite
    status: { type: String, default: "Pending" }, // Pending / Cleared / Rejected
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    package: { type: Number, required: true }, // LPA
    eligibilityCgpa: { type: Number, required: true, min: 0, max: 10 },
    eligibleDepartments: { type: [String], required: true },
    lastDate: { type: Date, required: true },
    description: { type: String, default: "" },
    interviews: { type: [interviewSchema], default: [] }, // Multiple interview rounds
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
