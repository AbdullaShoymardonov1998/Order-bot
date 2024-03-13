const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const expectedSalary = new Composer();
expectedSalary.on("text", async (ctx) => {
  ctx.wizard.state.skills = ctx.update.message?.text;
  await ctx.reply("Kutilayotgan oylik maoshni kiriting");
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Ma'lumotni qaytadan to'g'ri kiriting");
  }
  return ctx.wizard.next();
});

module.exports = {
  expectedSalary,
};
