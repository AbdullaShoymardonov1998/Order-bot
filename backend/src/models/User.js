const mongoose = require("mongoose");

const {
  LANGUAGE_UZ,
  LANGUAGE_RU,
  USER_DISPATCHER,
  USER_DELIVER_PERSON,
  TELEGRAM_USER,
  DEFAULT_STATE,
  ADD_LOCATION,
} = require("../states");

const UserSchema = new mongoose.Schema({
  telegram_id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: [USER_DISPATCHER, USER_DELIVER_PERSON, TELEGRAM_USER],
    default: TELEGRAM_USER,
  },
  language: {
    type: String,
    enum: [LANGUAGE_UZ, LANGUAGE_RU],
    default: LANGUAGE_UZ,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  keyboard_state: {
    type: String,
    enum: [ADD_LOCATION, DEFAULT_STATE],
    default: DEFAULT_STATE,
  },
  cart: [
    {
      product_id: {
        type: String,
        ref: "Product",
      },
      quantity: Number,
      size_id: String,
      color_id: String,
    },
  ],
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
});

exports.User = mongoose.model("User", UserSchema);
