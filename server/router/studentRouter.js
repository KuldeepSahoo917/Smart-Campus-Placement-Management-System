import express from "express";
import { loginStudent, updateStudent } from "../controller/studentController.js";
import { uploadResume } from "../middleware/uplode.js";


const studentRouter = express.Router();


studentRouter.post("/login", loginStudent);
// ✅ Add uploadResume middleware
studentRouter.put("/update/:id", uploadResume.single("resume"), updateStudent);

export default studentRouter;
