// noticeController.js
import { uploadToCloudinary, cloudinary } from "../config/cloudinary.js";
import Notice from "../model/noticeModel.js";

/* =========================
   ADD NOTICE
========================= */
export const addNotice = async (req, res) => {
  try {
    const { title, text, postedBy } = req.body;
    let imageUrl = null;

    // Upload file to Cloudinary if exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "notices");
      imageUrl = result.secure_url;
    }

    // Validation: must have text or image
    if (!text && !imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Notice must have text or image" });
    }

    const notice = await Notice.create({
      title,
      text,
      image: imageUrl,
      postedBy,
    });

    return res.status(201).json({ success: true, notice });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

/* =========================
   GET ALL NOTICES
========================= */
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json({ success: true, notices });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

/* =========================
   DELETE NOTICE
========================= */
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    // Delete image from Cloudinary if exists
    if (notice.image) {
      const parts = notice.image.split("/");
      const filename = parts[parts.length - 1].split(".")[0]; // remove extension
      await cloudinary.uploader.destroy(`notices/${filename}`);
    }

    await notice.deleteOne();

    return res.status(200).json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};