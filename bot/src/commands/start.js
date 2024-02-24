const axios = require("axios");
const menuKeyboard = require("../keyboards/menu");
const { logger } = require("../config/logger");
const { WORD, STATIC } = require("../messages/dictionary");
const { config } = require("../config");

exports.start = async (ctx) => {
  logger.error(JSON.stringify(ctx.message, null, 2));

  if (ctx.message.chat.type === "supergroup") {
    const welcomeText = `Assalomu alaykum. Mahsulotlarimiz haqida ma'lumotni telegram botimizdan olishingiz va buyurtma qilishingiz mumkin`;

    return await ctx.reply(welcomeText, {
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
};
