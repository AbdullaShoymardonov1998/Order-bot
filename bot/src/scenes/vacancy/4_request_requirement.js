const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyRequirement = new Composer();
vacancyRequirement.on("text", async (ctx) => {
  ctx.wizard.state.vacancyResponsibility = ctx.update.message?.text;
  await ctx.reply("Vakansiya uchun talablaringizni kiriting");
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Vakansiya nomini qaytadan to'g'ri kiriting");
  }
  return ctx.wizard.next();
});

module.exports = {
  vacancyRequirement,
};
