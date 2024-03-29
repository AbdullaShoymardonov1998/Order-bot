const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const resumeFile = new Composer();
resumeFile.on("contact", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.contact?.phone_number;
  ctx.reply("📌 Send your resume");
  return ctx.wizard.next();
});
resumeFile.on("text", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.text;
  if (ctx.update.message?.text === "/start") {
    return ctx.reply("Ma'lumotni qaytadan to'g'ri kiriting");
  }
  ctx.reply("📌 Send your resume");
  return ctx.wizard.next();
});

module.exports = {
  resumeFile,
};
