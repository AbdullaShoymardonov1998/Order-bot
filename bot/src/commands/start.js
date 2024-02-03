const axios = require("axios");
const menuKeyboard = require("../keyboards/menu");
const { WORD, STATIC } = require("../messages/dictionary");
const { config } = require("../config");

exports.start = async (ctx) => {
  logger.error(JSON.stringify(ctx.message, null, 2));
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

  switch (status) {
    case 409:
      ctx.reply(
        WORD[data.data.language].MENU,
        menuKeyboard(data.data.language)
      );
      break;
    case 200:
      ctx.reply(
        WORD[STATIC.DEFAULT_LANGUAGE].MENU,
        menuKeyboard(STATIC.DEFAULT_LANGUAGE)
      );
      break;
    default:
      throw {
        response: data,
        status,
      };
  }
};
