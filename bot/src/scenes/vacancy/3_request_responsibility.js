const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyResponsibility = new Composer();
vacancyResponsibility.on("text", async (ctx) => {
  ctx.wizard.state.vacancyCompany = ctx.update.message?.text;
  await ctx.reply("Vakansiya haqida ma'lumotlar kiriting");
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Vakansiya nomini qaytadan to'g'ri kiriting");
  }
  return ctx.wizard.next();
});

module.exports = {
  vacancyResponsibility,
};
