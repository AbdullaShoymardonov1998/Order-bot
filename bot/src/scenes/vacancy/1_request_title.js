const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyTitle = new Composer();
vacancyTitle.on("callback_query", async (ctx) => {
  await ctx.editMessageText("Vakansiya nomi");
  return ctx.wizard.next();
});

module.exports = {
  vacancyTitle,
};
