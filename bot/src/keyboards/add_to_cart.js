const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, productId, quantity) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/user/cart`,
    validateStatus: false,
    data: {
      telegram_id: ctx.chat.id,
      product_id: productId,
      quantity,
    },
  });
  if (status != 200) {
    throw { response: data, status };
  }

  const product = data.data.product;
  const user = data.data.user;
  const language = user.language;

  let info = `<b>${product.title[language]}</b>\n`;
  info += `💵 ${quantity} x ${product.price
    .toLocaleString()
    .replace(",", " ")} = ${(product.price * quantity)
    .toLocaleString()
    .replace(",", " ")} ${WORD[language].MONEY}\n\n`;
  info += `${WORD[language].ADDED_TO_CART}`;
  const keyboard = [
    [
      {
        text: `${WORD[language].GO_TO_CART} (${user.cart.length})`,
        callback_data: JSON.stringify({
          a: STATE.CART,
        }),
      },
    ],
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

  await ctx.editMessageText(info, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
    parse_mode: "HTML",
  });
};
