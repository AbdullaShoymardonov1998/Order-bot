const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const fullName = new Composer();
fullName.on("callback_query", async (ctx) => {
  await ctx.editMessageText("✍️ Ism sharifingizni kiriting");
  return ctx.wizard.next();
});

module.exports = {
  fullName,
};
