const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyCompany = new Composer();
vacancyCompany.on("text", async (ctx) => {
  ctx.wizard.state.vacancyTitle = ctx.update.message?.text;
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Vakansiya nomini qaytadan to'g'ri kiriting");
  }

  await ctx.reply("Kompaniyangiz nomini kiriting");
  return ctx.wizard.next();
});
module.exports = {
  vacancyCompany,
};
