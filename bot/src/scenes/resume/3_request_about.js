const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const about = new Composer();
about.on("text", async (ctx) => {
  ctx.wizard.state.profession = ctx.update.message?.text;
  if (ctx.update.message?.text === "/start") {
    return ctx.reply(
      "Ism sharif noto'g'ri kiritildi, qaytadan to'g'ri kiriting"
    );
  }

  await ctx.reply("✍️ O'zingiz haqingizda qisqacha ma'lumot kiriting");
  return ctx.wizard.next();
});
module.exports = {
  about,
};
