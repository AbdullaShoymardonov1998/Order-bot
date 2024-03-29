const axios = require("axios");
const { config } = require("../config");
const { logger } = require("../config/logger");

const telegram = {
  sendNotification: async (message) => {
    try {
      await axios.post(
        `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
        {
          chat_id: `${config.telegramChannelId}`,
          text: message,
          parse_mode: "HTML",
        }
      );
    } catch (error) {
      logger.error(
        `Sending telegram notification: ${error.message}, ${error.stack}`
      );
    }
  },
};

module.exports = telegram;
