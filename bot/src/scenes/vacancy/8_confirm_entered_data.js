const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const confirmVacancyData = new Composer();
confirmVacancyData.on("contact", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.contact?.phone_number;
  let message = `<b>💼Vakansiya</b> \n\n${ctx.wizard.state.vacancyTitle}\n<b>Kompaniya:</b> ${ctx.wizard.state.vacancyCompany}\n\n<b>🔖 Xodim majburiyatlari:</b> ${ctx.wizard.state.vacancyResponsibility}\n\n<b>🎯 Talablar:</b> ${ctx.wizard.state.vacancyRequirement}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.vacancySalary}\n\n<b>☎️ Kontakt: </b> ${ctx.update.message.contact.phone_number}\n
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
confirmVacancyData.on("text", async (ctx) => {
  ctx.wizard.state.contact = ctx.update.message?.text;
  let message = `\n<b>#Vakansiya</b>\n\n<b>${ctx.wizard.state.vacancyTitle}</b>\n\n<b>Kompaniya:</b> ${ctx.wizard.state.vacancyCompany}\n\n<b>🎯 Talablar:</b> ${ctx.wizard.state.vacancyRequirement}\n\n<b>🔖 Xodim majburiyatlari:</b> ${ctx.wizard.state.vacancyResponsibility}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.vacancySalary}\n\n<b>☎️ Kontakt: </b> ${ctx.update.message.text}\n
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
  confirmVacancyData,
};
