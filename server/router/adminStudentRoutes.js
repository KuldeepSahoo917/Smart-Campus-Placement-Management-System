import express from "express";
import { createStudent, deleteStudent, getAllStudents, getStudentById, updateStudent } from "../controller/adminStudentContoller.js";


const adminStudentrouter = express.Router();

// Admin-only routes
adminStudentrouter.post("/", createStudent);
adminStudentrouter.get("/", getAllStudents);
adminStudentrouter.get("/:id", getStudentById);
adminStudentrouter.put("/:id", updateStudent);
adminStudentrouter.delete("/:id", deleteStudent);

export default adminStudentrouter;
