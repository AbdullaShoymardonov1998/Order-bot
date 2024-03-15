const axios = require("axios");
const { config } = require("../config");
const { STATE, WORD } = require("../messages/dictionary");
module.exports = async (ctx) => {
  await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/vacancy/category/all`,
    validateStatus: false,
  });

  const keyboard = data.data.map((item) => [
    {
      text: `${item.title}`,
      callback_data: JSON.stringify({
        a: STATE.RESUME_LIST,
        v: item._id,
        n: 1,
      }),
    },
  ]);
  const backButton = [
    [
      {
        text: WORD.UZ.BACK,
        callback_data: JSON.stringify({
          a: STATE.RESUME_MAIN,
        }),
      },
    ],
  ];

  let inlineKeyboard = [...keyboard, ...backButton];
  await ctx.reply(WORD.UZ.SELECT_CATEGORY, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
};
