const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancySalary = new Composer();
vacancySalary.on("text", async (ctx) => {
  ctx.wizard.state.vacancyRequirement = ctx.update.message?.text;
  await ctx.reply("Vakansiya uchun oylik maoshni kiriting");
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Vakansiya nomini qaytadan to'g'ri kiriting");
  }
  return ctx.wizard.next();
});

module.exports = {
  vacancySalary,
};
