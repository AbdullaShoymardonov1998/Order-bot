const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const skills = new Composer();
skills.on("text", async (ctx) => {
  ctx.wizard.state.experience = ctx.update.message?.text;
  await ctx.reply("Qobiliyatlar va ko'nikmalaringizni kiriting");
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Ma'lumotni qaytadan to'g'ri kiriting");
  }
  return ctx.wizard.next();
});

module.exports = {
  skills,
};
