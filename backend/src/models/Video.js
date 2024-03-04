const mongoose = require("mongoose");

const videoApprovalSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  file_id: {
    type: String,
    required: true,
  },
  message_id: {
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
});

videoApprovalSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

exports.VideoApproval = mongoose.model("VideoApproval", videoApprovalSchema);
