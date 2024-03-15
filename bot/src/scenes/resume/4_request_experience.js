const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const experience = new Composer();
experience.on("text", async (ctx) => {
  ctx.wizard.state.about = ctx.update.message?.text;
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("✍️ Ma'lumotlarni qaytadan, to'g'ri kiriting");
  }
  await ctx.reply("✍️ Tajribangiz haqida ma'lumotlar kiriting");
  return ctx.wizard.next();
});

module.exports = {
  experience,
};
