const config = {
  mongoHost: getConf("MONGO_HOST"),
  mongoPort: getConf("MONGO_PORT"),
  mongoUser: getConf("MONGO_USER"),
  mongoPassword: getConf("MONGO_PASSWORD"),
  mongoDatabase: getConf("MONGO_DATABASE"),
  HTTPPORT: getConf("HTTP_PORT"),
  cdnURL: getConf("CDN_URL"),
  minioBucket: getConf("MINIO_BUCKET"),
  minioHost: getConf("MINIO_HOST"),
  minioPort: getConf("MINIO_PORT"),
  minioAccessKey: getConf("MINIO_ACCESS_KEY"),
  minioSecretKey: getConf("MINIO_SECRET_KEY"),
  telegramBotToken: getConf("TELEGRAM_BOT_TOKEN", "example"),
  telegramGroupId: getConf("TELEGRAM_GROUP_ID", "example"),
  telegramChannelId: getConf("TELEGRAM_CHANNEL_ID", "example"),
};

function getConf(name, def = "") {
  if (process.env[name]) {
    return process.env[name];
  }
  return def;
}

exports.config = config;
