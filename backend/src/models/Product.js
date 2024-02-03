const mongoose = require("mongoose");
const { LanguageRequired, LanguageDefault } = require("./Language");
const { UNIT_QUANTITY, UNIT_MASS } = require("../states");
const { config } = require("../config");

const ProductSchema = new mongoose.Schema(
  {
    title: LanguageRequired,
    description: LanguageDefault,
    picture: {
      uuid: {
        type: String,
        default: null,
      },
    },
    parent: {
      type: String,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: [UNIT_QUANTITY, UNIT_MASS],
      required: true,
    },
    min_order: {
      type: Number,
      default: 1,
    },
    max_order: {
      type: Number,
      default: 1,
    },
    order_difference: {
      type: Number,
      default: 1,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("picture.url").get(function () {
  return this.picture.uuid ? config.cdnURL + this.picture.uuid : null;
  // return "https://storage.kun.uz/source/10/clGSFA_B8zWBPnaEAT7b_8KehNs3N5mc.jpg";
});

exports.Product = mongoose.model("Product", ProductSchema);
