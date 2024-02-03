const { start } = require("./start");

exports.commands = (bot) => {
    bot.command("start", start);
};