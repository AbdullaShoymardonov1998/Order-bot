const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");
const productListHelper = require("../utils/product_list");
const { logger } = require("../config/logger");

module.exports = async (ctx, messageType) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/user/cart`,
    validateStatus: false,
    params: {
      telegram_id: parseInt(ctx.chat.id),
    },
  });

  if (status != 200) {
    throw {
      response: data,
      status,
    };
  }
  const user = data.data;
  const language = user.language;

  let info = `${WORD[language].IN_CART}`;

  let hasProducts = false;
  if (user.cart.length > 0) {
    hasProducts = true;
  }
  const { productList, total } = await productListHelper(user.cart, language);
  logger.error(`Create account: ${error.message}, ${error.stack}`);
  info += productList;
  info += `\n\n<b>${WORD[language].TOTAL_PRICE}: ${total
    .toLocaleString()
    .replace(",", " ")} ${WORD[language].MONEY}</b>`;
  switch (messageType) {
    case STATIC.SEND_MESSAGE:
      await ctx.reply(info, await cartListKeyboard(language, hasProducts));
      break;
    case STATIC.EDIT_MESSAGE:
      await ctx.editMessageText(
        info,
        await cartListKeyboard(language, hasProducts)
      );
      break;
    default:
  }
};

async function cartListKeyboard(language, hasProducts) {
  const navigation = [
    [
      {
        text: WORD[language].CONTINUE_SHOPPING,
        callback_data: JSON.stringify({
          a: STATE.CATEGORY,
          n: 1,
          p: null,
        }),
      },
    ],
  ];

  if (hasProducts) {
    navigation.unshift([
      {
        text: WORD[language].EMPTY_CART,
        callback_data: JSON.stringify({
          a: STATE.EMPTY_CART,
        }),
      },
    ]);
    navigation.unshift([
      {
        text: WORD[language].ORDER_NOW,
        callback_data: JSON.stringify({
          a: STATE.SELECT_LOCATION,
        }),
      },
    ]);
  }

  return {
    reply_markup: {
      inline_keyboard: navigation,
    },
    parse_mode: "HTML",
  };
}
