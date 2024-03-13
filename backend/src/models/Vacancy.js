const mongoose = require("mongoose");
const VacancySchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  responsibility: {
    type: String,
    required: true,
  },
  requirement: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    ref: "VacancyCategory",
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

exports.Vacancy = mongoose.model("Vacancy", VacancySchema);
