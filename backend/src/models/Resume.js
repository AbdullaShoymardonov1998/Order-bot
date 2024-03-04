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
  description: {
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
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
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
