const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const saveResumeInfo = new Composer();
saveResumeInfo.on("callback_query", async (ctx) => {
  switch (ctx.callbackQuery.data) {
    case "cancel":
      await ctx.editMessageText(WORD.UZ.CONTINUE_SHOPPING, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: WORD.GENERAL.HOME,
                callback_data: JSON.stringify({
                  a: STATE.RESUME_MAIN,
                }),
              },
            ],
          ],
        },
      });

      break;

    case "confirm":
      let message = `<b>#RESUME</b>\n<b>#${ctx.wizard.state.profession}</b>\n<b>#Xodim:</b> ${ctx.wizard.state.fullName}\n\n<b>Xodim haqida qisqacha:</b> ${ctx.wizard.state.about}\n\n<b>🔖 Xodim tajribasi:</b> ${ctx.wizard.state.experience}\n\n<b>🎯 Qobilyatlari:</b> ${ctx.wizard.state.skills}\n\n<b>💵 Oylik maosh:</b> ${ctx.wizard.state.expectedSalary}\n\n<b>☎️ Kontakt: </b> ${ctx.wizard.state.contact}\n\n<a href = "https://t.me/HaoomasBot">Telegram bot</a>
      `;

      const result = await ctx.telegram.sendDocument(
        config.channelId,
        ctx.wizard.state.fileId,
        {
          caption: message,
          parse_mode: "HTML",
        }
      );

      const { data, status } = await axios({
        method: "POST",
        url: `${config.apiURL}/resume/create`,
        validateStatus: false,
        data: {
          telegram_id: ctx.chat.id,
          fullName: ctx.wizard.state.fullName,
          profession: ctx.wizard.state.profession,
          about: ctx.wizard.state.about,
          experience: ctx.wizard.state.experience,
          skills: ctx.wizard.state.skills,
          salary: ctx.wizard.state.expectedSalary,
          contact: ctx.wizard.state.contact,
          resume: {
            file_id: ctx.wizard.state.fileId,
            file_name: ctx.wizard.state.fileName,
            mime_type: ctx.wizard.state.fileMimeType,
          },
          message_id: result.message_id,
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
        WORD.UZ.SAVED +
          "\n Resume qoldirganingiz uchun tashakkur, tez kunda siz kutgan kompaniyada ish boshlashingizga tilakdoshmiz😊",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: WORD.GENERAL.HOME,
                  callback_data: JSON.stringify({
                    a: STATE.CATEGORY,
                  }),
                },
              ],
            ],
          },
        }
      );
  }

  return ctx.scene.leave();
});

module.exports = {
  saveResumeInfo,
};
