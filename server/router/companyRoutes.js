import express from "express";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controller/companyContoller.js";


const companyRouter = express.Router();

companyRouter.post("/", createCompany);          // Create company
companyRouter.get("/", getAllCompanies);          // Get all companies
companyRouter.get("/:id", getCompanyById);        // Get single company
companyRouter.put("/:id", updateCompany);         // Update company
companyRouter.delete("/:id", deleteCompany);      // Delete company

export default companyRouter;
