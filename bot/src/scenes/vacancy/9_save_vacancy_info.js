const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const saveVacancyInfo = new Composer();
saveVacancyInfo.on("callback_query", async (ctx) => {
  switch (ctx.callbackQuery.data) {
    case "cancel":
      await ctx.editMessageText(WORD.UZ.CONTINUE_SHOPPING, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: WORD.GENERAL.HOME,
                callback_data: JSON.stringify({
                  a: STATE.CHECK_GROUP,
                }),
              },
            ],
          ],
        },
      });

      break;

    case "confirm":
      const { data, status } = await axios({
        method: "POST",
        url: `${config.apiURL}/vacancy/create`,
        validateStatus: false,
        data: {
          telegram_id: ctx.chat.id,
          title: ctx.wizard.state.vacancyTitle,
          company: ctx.wizard.state.vacancyCompany,
          responsibility: ctx.wizard.state.vacancyResponsibility,
          requirement: ctx.wizard.state.vacancyRequirement,
          salary: ctx.wizard.state.vacancySalary,
          contact: ctx.wizard.state.contact,
          category_id: ctx.wizard.state.categoryId,
        },
      });

      if (status != 201) {
        throw {
          response: data,
          status,
        };
      }

      await ctx.editMessageText(
        WORD.UZ.SAVED + "\n Vakansiya berganingiz uchun minnatdormiz 😊",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: WORD.GENERAL.HOME,
                  callback_data: JSON.stringify({
                    a: STATE.CHECK_GROUP,
                  }),
                },
              ],
            ],
          },
        }
      );
      let message = `<b>#Vakansiya</b>\n\n${ctx.wizard.state.vacancyTitle}\n<b>Kompaniya:</b> ${ctx.wizard.state.vacancyCompany}\n\n<b>🔖 Xodim majburiyatlari:</b> ${ctx.wizard.state.vacancyResponsibility}\n\n<b>🎯 Talablar:</b> ${ctx.wizard.state.vacancyRequirement}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.vacancySalary}\n\n<b>☎️ Kontakt: </b> ${ctx.wizard.state.contact}\n\n<a href = "https://t.me/HaoomasBot">👉🏻 Telegram bot</a>
                `;
      await axios.post(
        `https://api.telegram.org/bot${config.botToken}/sendMessage`,
        {
          chat_id: `${config.channelId}`,
          text: message,
          parse_mode: "HTML",
        }
      );
  }

  return ctx.scene.leave();
});

module.exports = {
  saveVacancyInfo,
};
