const { STATE, WORD } = require("../messages/dictionary");

module.exports = async (ctx) => {
  if (ctx.update.callback_query) {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  }
  await ctx.reply("Video junatish bo'limiga xush kelibsiz!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: WORD.UZ.SEND_VIDEO,
            callback_data: JSON.stringify({
              a: STATE.SEND_VIDEO,
            }),
          },
          {
            text: WORD.UZ.VIDEO_COMMENT,
            callback_data: JSON.stringify({
              a: STATE.VIDEO_LIST,
            }),
          },
        ],
      ],
    },
    parse_mode: "HTML",
  });
};
