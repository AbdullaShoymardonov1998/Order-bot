const config = {
  botToken: getConf("BOT_TOKEN"),
  apiURL: getConf("API_URL"),
  channelId: getConf("JOBS_CHANNEL_ID"),
};

function getConf(name, def = "") {
  if (process.env[name]) {
    return process.env[name];
  }
  return def;
}

exports.config = config;
