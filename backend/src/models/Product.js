const mongoose = require("mongoose");
const { LanguageRequired, LanguageDefault } = require("./Language");
const { config } = require("../config");
const { Comment } = require("./Comment");

const ColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    picture: {
      uuid: {
        type: String,
        default: null,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SizeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    title: LanguageRequired,
    description: LanguageDefault,
    picture: {
      // main picture
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
    thumbnail: {
      // picture which will be shown in pagination
      type: String,
      ref: "Thumbnail",
    },
    price: {
      type: Number,
      default: 0,
    },
    colors: [ColorSchema],
    sizes: [SizeSchema],
    min_order: {
      type: Number,
      default: 1,
    },
    max_order: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("picture.url").get(function () {
  return this.picture.uuid ? config.cdnURL + this.picture.uuid : null;
});

ColorSchema.virtual("picture.url").get(function () {
  return this.picture.uuid ? config.cdnURL + this.picture.uuid : null;
});

exports.Product = mongoose.model("Product", ProductSchema);
