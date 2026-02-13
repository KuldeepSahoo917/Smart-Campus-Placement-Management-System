import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./router/adminRouter.js";
import companyRouter from "./router/companyRoutes.js";
import adminStudentrouter from "./router/adminStudentRoutes.js";
import studentRouter from "./router/studentRouter.js";
import router from "./router/applicatonRouter.js";
import path from "path";
import { connectCloudinary } from "./config/cloudinary.js";
import noticerouter from "./router/noticeRouter.js";


dotenv.config();
//DB connection
connectDB()
connectCloudinary()
const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());


// Serve uploaded resumes statically
app.use("/resumes", express.static(path.join(process.cwd(), "uploads", "resumes")));


/* ===== ROUTES ===== */
app.use("/api/admin",adminRouter );
app.use("/api/companies", companyRouter);
app.use("/api/adminstudent",adminStudentrouter );
app.use("/api/student",studentRouter)
app.use("/api/apply",router)
app.use("/api/notice",noticerouter)

/* ===== TEST ROUTE ===== */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
