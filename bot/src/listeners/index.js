const { message } = require("./message");
const { callback } = require("./callback");

exports.listeners = (bot) => {
  bot.on("message", message);
  bot.on("callback_query", callback);
};
