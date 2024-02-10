const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, id, quantity) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/product/get`,
    validateStatus: false,
    params: {
      id,
      telegram_id: ctx.chat.id,
    },
  });

  if (status != 200) {
    throw { response: data, status };
  }

  const product = data.data.product;
  const language = data.data.user.language;

  let info = "";
  info += `<b>${product.title[language]}</b>\n\n`;
  info += `${product.price.toLocaleString().replace(",", " ")} ${
    WORD[language].MONEY
  } / 1 dona`;

  if (product.picture.uuid) {
    info += ` <a href="${product.picture.url}">&#8205;</a>`;
  }

  if (product.description[language]) {
    info += `\n${product.description[language]}`;
  }

  info += `\n${WORD[language].SELECT_QUANTITY}`;

  const quantityText = `${quantity} dona`;

  let minusButtonQuantity = 0;
  let plusButtonQuantity = 0;

  minusButtonQuantity = parseInt(quantity) - 1;
  plusButtonQuantity = parseInt(quantity) + 1;

  let minusButtonState = STATE.PRODUCT_INFO;
  if (minusButtonQuantity < product.min_order) {
    minusButtonState = STATE.MIN_ORDER_LIMIT;
  }

  let plusButtonState = STATE.PRODUCT_INFO;
  if (plusButtonQuantity > product.max_order) {
    plusButtonState = STATE.MAX_ORDER_LIMIT;
  }
  const keyboard = [
    [
      {
        text: "-",
        callback_data: JSON.stringify({
          a: minusButtonState,
          p: product._id,
          q: minusButtonQuantity,
        }),
      },
      {
        text: quantityText,
        callback_data: JSON.stringify({
          a: STATE.SHOW_QUANTITY,
          d: quantityText,
        }),
      },
      {
        text: "+",
        callback_data: JSON.stringify({
          a: plusButtonState,
          p: product._id,
          q: plusButtonQuantity,
        }),
      },
    ],
    [
      {
        text: WORD[language].ADD_TO_CART,
        callback_data: JSON.stringify({
          a: STATE.ADDED_TO_CART,
          p: product._id,
          n: quantity,
        }),
      },
    ],
    [
      {
        text: WORD[language].BACK,
        callback_data: JSON.stringify({
          a: STATE.PRODUCT,
          p: product.parent._id,
          n: 1,
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
