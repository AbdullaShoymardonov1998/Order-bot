const mongoose = require("mongoose");
const ResumeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  // format: {
  //   type: String,
  //   enum: ["remote", "office", "hybrid"],
  //   required: true,
  // },
  experience: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  // resume: {
  //   type: Document,
  //   required: true,
  // },
  status: {
    type: String,
    enum: ["available", "hired"],
    default: "available",
  },
  category_id: {
    type: String,
    ref: "VacancyCategory",
    required: true,
  },
  canPublish: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

exports.Resume = mongoose.model("Resume", ResumeSchema);
