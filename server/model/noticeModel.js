// noticeModel.js
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    // Optional title for the notice
    title: {
      type: String,
      trim: true,
    },

    // Optional text content of the notice
    text: {
      type: String,
      trim: true,
    },

    // Optional image URL
    image: {
      type: String,
      trim: true,
    },

    // Admin who posted the notice (optional)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },

    // Optional expiration date
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// ✅ Removed pre-save hook; controller handles validation

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;