const Minio = require("minio");
const fs = require("fs");
const { logger } = require("../config/logger");
const { config } = require("../config/index");
const minioClient = new Minio.Client({
  endPoint: config.minioHost,
  port: Number(config.minioPort),
  useSSL: false,
  accessKey: config.minioAccessKey,
  secretKey: config.minioSecretKey,
});

const uploadFile = {
  upload: async (file) => {
    try {
      let fileExtention = file.originalname.split(".");
      fileExtention = fileExtention[fileExtention.length - 1];
      const fileName = `images/${Date.now()}.${fileExtention}`;

      const metaData = {
        "Content-Type": file.mimetype,
      };
      const fileLocation = `./uploads/${file.filename}`;

      const uploadMinio = new Promise((resolve, reject) => {
        minioClient.fPutObject(
          config.minioBucket,
          fileName,
          fileLocation,
          metaData,
          function (err, etag) {
            if (err) reject(new Error("Error occured on uploading file"));
            if (fs.existsSync(fileLocation)) {
              fs.unlink(fileLocation, (err) => {
                if (err)
                  reject(new Error("Error occured on deleting temp file"));
              });
            }

            resolve(fileName);
          }
        );
      });
      return await uploadMinio;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async (file) => {
    try {
      minioClient.statObject(config.minioBucket, file, function (err, stat) {
        if (err) {
          logger.error(`Delete file. File not found: ${file}`);
          return console.log(err);
        }
        minioClient.removeObject(config.minioBucket, file, function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
module.exports = uploadFile;
