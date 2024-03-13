const { WORD, STATE } = require("../messages/dictionary");

module.exports = async (ctx) => {
  const inlineKeyboard = [
    [
      {
        text: WORD.UZ.SEND_RESUME,
        callback_data: JSON.stringify({
          a: STATE.RESUME,
        }),
      },
    ],
    [
      {
        text: WORD.UZ.RESUMES,
        callback_data: JSON.stringify({
          a: STATE.RESUME_CATEGORY,
        }),
      },
    ],
  ];

  const replyOptions = {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
    parse_mode: "HTML",
  };

  if (ctx.updateType === "callback_query") {
    const chatId = ctx.callbackQuery.message.chat.id;
    const messageId = ctx.callbackQuery.message.message_id;

    await ctx.telegram.deleteMessage(chatId, messageId);
  }

  await ctx.reply(WORD.UZ.SELECT_CATEGORY, replyOptions);
};
