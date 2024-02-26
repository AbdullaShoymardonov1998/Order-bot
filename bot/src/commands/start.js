const axios = require("axios");
const cron = require("node-cron");
const menuKeyboard = require("../keyboards/menu");
// const { logger } = require("../config/logger");
const { WORD, STATIC } = require("../messages/dictionary");
const { config } = require("../config");

async function sendWelcomeMessage(ctx) {
  return await ctx.reply(WORD.GENERAL.WELCOME_TEXT, {
    disable_web_page_preview: true,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            url: `${WORD.UZ.BOT_LINK}`,
            text: WORD.UZ.JOIN_BOT,
          },
        ],
      ],
    },
  });
}

exports.start = async (ctx) => {
  // logger.error(JSON.stringify(ctx.message, null, 2));
  if (ctx.message.chat.type === "supergroup") {
    await sendWelcomeMessage(ctx);
    let botOperational = true;

    process.on("SIGINT", function () {
      console.log("Shutting down...");
      botOperational = false;
    });

    cron.schedule("0,30 8-23 * * *", async () => {
      if (botOperational) {
        await sendWelcomeMessage(ctx);
      }
    });
  }
  if (ctx.message.chat.type === "private") {
    const telegram_id = ctx.message.from.id;
    const first_name = ctx.message.from.first_name;
    const last_name = ctx.message?.from?.last_name
      ? ctx.message.from.last_name
      : null;
    const { status, data } = await axios({
      method: "POST",
      url: `${config.apiURL}/user/create`,
      validateStatus: false,
      data: {
        telegram_id,
        first_name,
        last_name,
        language: STATIC.DEFAULT_LANGUAGE,
      },
    });
    const message = `Assalomu Alaykum, ${data.data.first_name} \n\nHaoomas tovarlariga qiziqish bildirganingiz uchun tashakkur!\n\n
Buyurtmalar berish va tovarlar bilan yaqindan tanishib chiqish uchun, “➡️ Buyurtma berish” bo'limiga o'ting.\n`;
    switch (status) {
      case 409:
        ctx.reply(message, menuKeyboard(STATIC.DEFAULT_LANGUAGE));
        break;
      case 200:
        ctx.reply(message, menuKeyboard(data.data.language));
        break;
      default:
        throw {
          response: data,
          status,
        };
    }
  }
};
