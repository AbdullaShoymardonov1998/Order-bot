const axios = require("axios");
const { Composer } = require("telegraf");
const { config } = require("../../config");
const { WORD, STATE } = require("../../messages/dictionary");

const sendVideo = new Composer();
sendVideo.on("callback_query", async (ctx) => {
  switch (ctx.callbackQuery.data) {
    case "close":
      await ctx.telegram.deleteMessage(
        ctx.update.callback_query.from.id,
        ctx.update.callback_query.message.message_id
      );
      await ctx.reply(
        "Amaliyotni bekor qilib, bosh sahifaga qaytish uchun quyidagi tugmani bosing 👇🏻",
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
          parse_mode: "HTML",
        }
      );
      break;
    case "confirm":
      const { data, status } = await axios({
        method: "GET",
        url: `${config.apiURL}/user/all`,
        validateStatus: false,
      });
      if (status != 200) {
        throw {
          response: data,
          status,
        };
      }
      let counter = data.data.length;
      let blockedUsers = [];
      // let telegramUsers = [];
      for (let i = 0; i < data.data.length; i++) {
        try {
          await ctx.telegram.sendVideo(
            data.data[i].telegram_id,
            ctx.wizard.state.video,
            {
              caption: ctx.wizard.state.videoCaption,
            }
          );
          // telegramUsers.push(data.data[i].first_name);
        } catch (error) {
          counter -= 1;
          blockedUsers.push(data.data[i].first_name);
        }
      }

      await ctx.telegram.deleteMessage(
        ctx.update.callback_query.from.id,
        ctx.update.callback_query.message.message_id
      );

      const message =
        "🔔 Reklama " + counter + " ta 👥 foydalanuvchiga yuborildi ✅";
      await ctx.reply(message);
      const blockedUsersList = `Botni bloklaganlar: ${blockedUsers} `;
      await ctx.reply(blockedUsersList);
      // const users = `Foydalanuvchilar:   ${telegramUsers} ga yuborildi ✅ `;
      // ctx.reply(users);

      break;
    default:
      console.log("Incorrect callback data in sending picture");
  }
  return ctx.scene.leave();
});

module.exports = {
  sendVideo,
};
