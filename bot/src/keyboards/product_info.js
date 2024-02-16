const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, productId) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/product/get`,
    validateStatus: false,
    params: {
      id: productId,
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
  info += `\n${WORD[language].SELECT_COLOR}`;
  const colorsKeyboard = product.colors.map((color) => [
    {
      text: color.name,
      callback_data: JSON.stringify({
        a: STATE.SELECT_COLOR,
        c: color._id,
      }),
    },
  ]);

  const keyboard = [
    ...colorsKeyboard,
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
