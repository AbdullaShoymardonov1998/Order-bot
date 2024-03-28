const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  product_id: {
    ref: "Product",
    type: String,
  },
  video_id: {
    ref: "Video",
    type: String,
  },
  resume_id: {
    ref: "Video",
    type: String,
  },
  vacancy_id: {
    ref: "Video",
    type: String,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
});

exports.Comment = mongoose.model("Comment", CommentSchema);
