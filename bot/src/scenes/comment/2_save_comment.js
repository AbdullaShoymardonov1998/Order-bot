const { Composer } = require("telegraf");
const { WORD, STATE } = require("../../messages/dictionary");
const axios = require("axios");
const { config } = require("../../config");
const saveComment = new Composer();
saveComment.on("text", async (ctx) => {
  if (
    ctx.message.text === "/start" ||
    ctx.message.text === "➡️ Buyurtma berish" ||
    ctx.message.text === "🛒 Savatcha" ||
    ctx.message.text === "📹  Video" ||
    ctx.message.text === "💼 Vakansiya" ||
    ctx.message.text === "📄 Resume"
  ) {
    await ctx.reply("Bosh sahifaga qaytish!", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: WORD.GENERAL.HOME,
              callback_data: JSON.stringify({
                a: STATE.CATEGORY,
                n: 1,
                p: null,
              }),
            },
          ],
        ],
      },
    });
    return ctx.scene.leave();
  }
  await ctx.reply("Izoh qoldirganingiz uchun tashakkur 🤩");

  const requestData = {
    telegram_id: ctx.from.id,
    comment: ctx.message.text,
  };
  if (ctx.session.type === "product") {
    requestData.product_id = ctx.session.id;
  } else if (ctx.session.type === "vacancy") {
    requestData.vacancy_id = ctx.session.id;
  } else if (ctx.session.type === "resume") {
    requestData.resume_id = ctx.session.id;
  } else if (ctx.session.type === "video") {
    requestData.video_id = ctx.session.id;
  }
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/comment`,
    validateStatus: false,
    data: requestData,
  });

  if (status !== 200) {
    throw { response: data, status };
  }
  return ctx.scene.leave();
});
module.exports = {
  saveComment,
};
