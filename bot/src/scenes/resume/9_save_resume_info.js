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
                  a: STATE.RESUME_CATEGORY,
                  n: 1,
                  p: null,
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
        url: `${config.apiURL}/resume/create`,
        validateStatus: false,
        data: {
          telegram_id: ctx.chat.id,
          fullName: ctx.wizard.state.fullName,
          about: ctx.wizard.state.about,
          experience: ctx.wizard.state.experience,
          skills: ctx.wizard.state.skills,
          salary: ctx.wizard.state.expectedSalary,
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
