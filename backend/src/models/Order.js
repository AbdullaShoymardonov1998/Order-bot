const mongoose = require("mongoose");
const { PENDING } = require("../states");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [PENDING],
    required: true,
  },
  status_history: [
    {
      status: {
        type: String,
        enum: [PENDING],
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  products: [
    {
      product_id: {
        type: String,
        ref: "Product",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    },
  ],
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

exports.Order = mongoose.model("Order", OrderSchema);
