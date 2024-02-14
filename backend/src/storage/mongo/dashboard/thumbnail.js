const { Thumbnail } = require("../../../models/Thumbnail");
const { Product } = require("../../../models/Product");

exports.thumbnailStorage = {
  create: async (thumbnail) => {
    const newThumbnail = await Thumbnail.create(thumbnail);

    await Product.updateMany(
      { _id: { $in: thumbnail.products } },
      {
        thumbnail: newThumbnail._id,
      }
    );

    return newThumbnail;
  },
};
