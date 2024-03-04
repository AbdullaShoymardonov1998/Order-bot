const { Composer } = require("telegraf");
const axios = require("axios"); // Ensure Axios is included
const { WORD, STATE } = require("../../messages/dictionary");
const { config } = require("../../config");
const requestVideoText = new Composer();

requestVideoText.on("text", async (ctx) => {
  ctx.wizard.state.videoCaption = ctx.message.text;
  ctx.wizard.state.userId = ctx.from.id;
  const adminId = process.env.ADMIN_TG_ID;

  try {
    await axios.post(`${config.apiURL}/video/create`, {
      telegram_id: ctx.from.id,
      file_id: ctx.wizard.state.video,
      message_id: ctx.message.message_id,
    });
    await ctx.telegram.sendVideo(adminId, ctx.wizard.state.video, {
      caption:
        ctx.wizard.state.videoCaption + `\nTasdiqlaysizmi?\n` + ctx.from.id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: WORD.UZ.REJECT,
              callback_data: JSON.stringify({
                a: STATE.REJECTED_VIDEO,
              }),
            },
            {
              text: WORD.UZ.APPROVE,
              callback_data: JSON.stringify({
                a: STATE.CONFIRMED_VIDEO,
              }),
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Failed to save submission or send for approval", error);
    await ctx.reply("Videoni yuklashda xatolik yuz berdi");
    return ctx.scene.leave();
  }
  await ctx.reply(
    "Video tasdiqlash uchun jo'natildi.Admin ko'rib, tasdiqlashi bilan video sizga va qolgan foydalanuvchilarga jo'natiladi.Video uchun tashakkur!"
  );
  return ctx.scene.leave();
});

module.exports = {
  requestVideoText,
};
