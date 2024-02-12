const fileUpload = require("../../util/minio");

exports.pictureService = {
  upload: async (file) => {
    const fileId = await fileUpload.upload(file);
    return fileId;
  },
};
