const mongoose = require("mongoose");
const { config } = require("../config");

const ThumbnailSchema = new mongoose.Schema(
  {
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

ThumbnailSchema.virtual("picture.url").get(function () {
  return this.picture.uuid ? config.cdnURL + this.picture.uuid : null;
});

exports.Thumbnail = mongoose.model("Thumbnail", ThumbnailSchema);
