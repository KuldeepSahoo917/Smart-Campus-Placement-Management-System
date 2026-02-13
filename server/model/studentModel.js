import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password:{
     type:String,
     required:true,
     unique:true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    skills: {
      type: [String],
      default: [],
    },

    resume: {
      type: String, // URL or filename
      default: "",
    },

    placed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
