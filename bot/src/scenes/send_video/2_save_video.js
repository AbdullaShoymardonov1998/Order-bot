const { Composer } = require("telegraf");
const { WORD } = require("../../messages/dictionary");

const saveVideo = new Composer();
saveVideo.on("video", async (ctx) => {
  ctx.wizard.state.video = ctx.update.message.video.file_id;

  await ctx.reply(WORD.UZ.VIDEO_CAPTION);
  return ctx.wizard.next();
});

module.exports = {
  saveVideo,
};
