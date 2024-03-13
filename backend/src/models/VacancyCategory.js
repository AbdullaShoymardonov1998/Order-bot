const mongoose = require("mongoose");
const VacancyCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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

exports.VacancyCategory = mongoose.model(
  "VacancyCategory",
  VacancyCategorySchema
);
