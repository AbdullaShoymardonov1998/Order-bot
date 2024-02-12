const { thumbnailStorage } = require("../../storage/mongo/dashboard/thumbnail");

exports.thumbnailService = {
  create: async (body) => {
    const thumbnail = await thumbnailStorage.create(body);
    return thumbnail;
  },
};
