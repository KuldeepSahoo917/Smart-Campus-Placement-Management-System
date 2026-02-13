// noticeRouter.js
import express from "express";

import { addNotice, deleteNotice, getNotices } from "../controller/noticeController.js";
import { uploadResume } from "../middleware/uplode.js";

const noticerouter = express.Router();

// Add a new notice (text or image)
noticerouter.post("/", uploadResume.single("image"), addNotice);

// Get all notices
noticerouter.get("/", getNotices);

// Delete a notice by ID
noticerouter.delete("/:id", deleteNotice);

export default noticerouter;