const axios = require("axios");
const menuKeyboard = require("../keyboards/menu");
const { logger } = require("../config/logger");
const { WORD, STATIC } = require("../messages/dictionary");
const { config } = require("../config");

exports.start = async (ctx) => {
  // logger.error(JSON.stringify(ctx.message, null, 2));
  if (ctx.message.chat.type === "supergroup") {
    return;
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
  const message = `Assalomu Alaykum, ${data.data.first_name} \n\nIjodimizga qiziqish bildirganingiz uchun tashakkur!\nHozircha siz uchun futbolka, xudi, svitshot, kepka va stikerlar mavjud. \n
  Yaqin orada tanlovni kengaytiramiz. \n\n
Agar bu shartlar sizni qoniqtirsa, “🔥 Mahsulotlar” bo'limiga o'tish orqali buyurtma berishni boshlashingiz mumkin.\n`;
  switch (status) {
    case 409:
      ctx.reply(message, menuKeyboard(data.data.language));
      break;
    case 200:
      ctx.reply(message, menuKeyboard(STATIC.DEFAULT_LANGUAGE));
      break;
    default:
      throw {
        response: data,
        status,
      };
  }
};
