const { STATE, WORD } = require("../messages/dictionary");

module.exports = async (ctx) => {
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
        ],
      ],
    },
    parse_mode: "HTML",
  });
};
