const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");
const {
  underwearIds,
  sleepwearIds,
  socksId,
  blanketIds,
} = require("../utils/consts");

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

  const parentId = product.parent._id;
  let unitPrice = product.price * 1.5;
  let smallClientsPrice = product.price * 1.1;
  let info = "";
  const getPriceString = (priceValue) =>
    `${priceValue.toLocaleString().replace(",", " ")} ${WORD[language].MONEY}`;
  info += `🛍 Mahsulot kodi: <b>${product.title[language]}</b>\n\n`;
  info += `${WORD.UZ.UNIT_PRICE}<b><i> ${getPriceString(
    unitPrice
  )} / 1 dona</i></b>`;

  if (underwearIds.includes(parentId)) {
    info += `\n\n${
      WORD.UZ.BIG_CLIENTS
    } (12 ta minimum zakaz): <b><i>${getPriceString(
      product.price
    )} / 1 dona</i></b>`;

    info += `\n\n${
      WORD.UZ.SMALL_CLIENTS
    }(5 tadan 11 tagacha zakaz): <b><i>${getPriceString(
      smallClientsPrice
    )} / 1 dona</i></b>\n`;
  } else if (sleepwearIds.includes(parentId)) {
    info += `\n\n${
      WORD.UZ.BIG_CLIENTS
    }(6 ta minimum zakaz):<b><i> ${getPriceString(
      product.price
    )} / 1 dona</i></b>`;

    info += `\n\n${
      WORD.UZ.SMALL_CLIENTS
    }(3 - 6 ta zakaz):<b><i> ${getPriceString(
      smallClientsPrice
    )} / 1 dona</i></b>\n`;
  } else if (socksId.includes(parentId)) {
    info += `\n\n${
      WORD.UZ.BIG_CLIENTS
    }(24 ta minimum zakaz):<b><i> ${getPriceString(
      product.price
    )} / 1 dona</i></b>`;

    info += `\n\n${
      WORD.UZ.SMALL_CLIENTS
    }(12 - 24 ta zakaz):<b><i> ${getPriceString(
      smallClientsPrice
    )} / 1 dona</i></b>\n`;
  } else if (blanketIds.includes(parentId)) {
    info += `\n\n${
      WORD.UZ.BIG_CLIENTS
    }(5 ta minimum zakaz):<b><i> ${getPriceString(
      product.price
    )} / 1 dona</i></b>`;

    info += `\n\n${
      WORD.UZ.SMALL_CLIENTS
    }(3 - 5 ta zakaz):<b><i> ${getPriceString(
      smallClientsPrice
    )} / 1 dona</i></b>\n`;
  } else {
    info += `\n\n${
      WORD.UZ.BIG_CLIENTS
    }(10 ta minimum zakaz): <b><i>${getPriceString(
      product.price
    )} / 1 dona </i></b>`;

    info += `\n\n${
      WORD.UZ.SMALL_CLIENTS
    }(5 ta minimum zakaz):<b><i> ${getPriceString(
      smallClientsPrice
    )} / 1 dona </i></b>\n`;
  }

  if (product.picture.uuid) {
    info += ` <a href="${product.picture.url}">&#8205;</a>`;
  }

  if (product.description[language]) {
    info += `\nMahsulot ta'rifi : <i>${product.description[language]}</i>\n`;
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
