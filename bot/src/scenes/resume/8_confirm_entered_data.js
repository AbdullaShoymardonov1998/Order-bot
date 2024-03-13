const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const confirmResumeData = new Composer();
confirmResumeData.on("contact", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.contact?.phone_number;
  let message = `<b>#RESUME</b> \n\n <b>#Xodim:</b> ${ctx.wizard.state.fullName}\n<b>Xodim haqida qisqacha:</b> ${ctx.wizard.state.about}\n\n<b>🔖 Xodim tajribasi:</b> ${ctx.wizard.state.experience}\n\n<b>🎯 Qobilyatlari:</b> ${ctx.wizard.state.skills}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.expectedSalary}\n\n<b>☎️ Kontakt: </b> ${ctx.update.message.contact.phone_number}\n
                `;
  await ctx.reply(WORD.UZ.APPROVE + `\n${message}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: WORD.UZ.REJECT,
            callback_data: "cancel",
          },
          {
            text: WORD.UZ.APPROVE,
            callback_data: "confirm",
          },
        ],
      ],
    },
  });
  return ctx.wizard.next();
});
confirmResumeData.on("text", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.text;
  let message = `<b>#RESUME</b> \n\n <b>#Xodim:</b> ${ctx.wizard.state.fullName}\n<b>Xodim haqida qisqacha:</b> ${ctx.wizard.state.about}\n\n<b>🔖 Xodim tajribasi:</b> ${ctx.wizard.state.experience}\n\n<b>🎯 Qobilyatlari:</b> ${ctx.wizard.state.skills}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.expectedSalary}\n\n<b>☎️ Kontakt: </b> ${ctx.update.message.contact.phone_number}\n
  `;
  await ctx.reply(WORD.UZ.APPROVE + `\n${message}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: WORD.UZ.REJECT,
            callback_data: "cancel",
          },
          {
            text: WORD.UZ.APPROVE,
            callback_data: "confirm",
          },
        ],
      ],
    },
  });
  return ctx.wizard.next();
});

module.exports = {
  confirmResumeData,
};
