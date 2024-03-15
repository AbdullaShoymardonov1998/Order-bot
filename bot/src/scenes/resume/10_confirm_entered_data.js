const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const confirmResumeData = new Composer();
confirmResumeData.on("document", async (ctx) => {
  console.log(ctx.update.message?.document);
  ctx.wizard.state.fileId = ctx.update.message?.document?.file_id;
  ctx.wizard.state.fileName = ctx.update.message?.document?.file_name;
  ctx.wizard.state.fileMimeType = ctx.update.message?.document?.mime_type;

  let message = `<b>#RESUME</b>\n<b>#${ctx.wizard.state.profession}</b>\n<b>#Xodim:</b> ${ctx.wizard.state.fullName}\n\n<b>Xodim haqida qisqacha:</b> ${ctx.wizard.state.about}\n\n<b>🔖 Xodim tajribasi:</b> ${ctx.wizard.state.experience}\n\n<b>🎯 Qobilyatlari:</b> ${ctx.wizard.state.skills}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.expectedSalary}\n\n<b>☎️ Kontakt: </b> ${ctx.wizard.state.contact}\n\nYuklangan fayl nomi: ${ctx.wizard.state.fileName}\n
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
