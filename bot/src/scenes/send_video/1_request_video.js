const { Composer } = require("telegraf");
const { WORD, STATE } = require("../../messages/dictionary");
const requestVideo = new Composer();
requestVideo.on("callback_query", async (ctx) => {
  await ctx.editMessageText(WORD.UZ.SEND_VIDEO);
  return ctx.wizard.next();
});
module.exports = {
  requestVideo,
};
