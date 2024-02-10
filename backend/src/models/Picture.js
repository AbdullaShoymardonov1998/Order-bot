// pictureId
const PictureSchema = new mongoose.Schema({
  thumbnail: {
    uuid: {
      type: String,
      default: null,
    },
  },
});

PictureSchema.virtual("picture.url").get(function () {
  return this.thumbnail.uuid ? config.cdnURL + this.thumbnail.uuid : null;
});

export const Picture = mongoose.model("Picture", PictureSchema);
