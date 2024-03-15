const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const resumeFile = new Composer();
resumeFile.on("contact", async (ctx) => {
  console.log(ctx.update.message?.contact);
  ctx.wizard.state.contact = ctx.update.message?.contact?.phone_number;
  ctx.reply("📌 Send your resume");
  return ctx.wizard.next();
});
resumeFile.on("text", async (ctx) => {
  console.log(ctx.update.message?.text);
  ctx.wizard.state.contact = ctx.update.message?.text;
  ctx.reply("📌 Send your resume");
  return ctx.wizard.next();
});

module.exports = {
  resumeFile,
};
