import multer from "multer";

const storage = multer.memoryStorage(); // memory storage for Cloudinary

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, JPEG, or PNG files are allowed"), false);
};

export const uploadResume = multer({ storage, fileFilter });
