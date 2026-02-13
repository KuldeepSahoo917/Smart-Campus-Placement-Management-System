import express from "express";
import { uploadResume } from "../middleware/uplode.js";
import { applyForCompany, deleteApplication, getAllApplications, getStudentApplications, updateApplicationStatus } from "../controller/studentApplication.js";


const router = express.Router();


router.post("/applications", uploadResume.single("resume"), applyForCompany);
router.get("/student/:studentId", getStudentApplications);

// Get all applications
router.get("/", getAllApplications);

// Update application status by ID
router.put("/:id/status", updateApplicationStatus);
// Delete an application
router.delete("/:id", deleteApplication);

export default router;
