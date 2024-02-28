const { Composer } = require("telegraf");
const { WORD } = require("../../messages/dictionary");
const requestVideoText = new Composer();
requestVideoText.on("text", async (ctx) => {
  ctx.wizard.state.videoCaption = ctx.message.text;

  await ctx.telegram.sendVideo(
    ctx.update.message?.from.id,
    ctx.wizard.state.video,
    {
      caption: ctx.wizard.state.videoCaption,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: WORD.UZ.REJECT,
              callback_data: "close",
            },
            {
              text: WORD.UZ.APPROVE,
              callback_data: "confirm",
            },
          ],
        ],
      },
    }
  );

  return ctx.wizard.next();
});
module.exports = {
  requestVideoText,
};
