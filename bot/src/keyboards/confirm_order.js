const { STATE, WORD, STATIC } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");
const productListHelper = require("../utils/product_list");
const menuKeyboard = require("./menu");

module.exports = async (ctx, messageType) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/user/cart`,
    validateStatus: false,
    params: {
      telegram_id: ctx.chat.id,
    },
  });

  if (status != 200) {
    throw { response: data, status };
  }

  const user = data.data;
  const language = user.language;

  if (user.cart.length > 0 && user.location.length > 0) {
    let info = `${WORD[language].CONFIRM_ORDER}\n`;

    const { productList, total } = await productListHelper(user.cart, language);
    info += productList;
    info += `\n\n📍 <b>${WORD[language].LOCATION}</b>: ${user.location}`;
    info += `\n\n<b>${WORD[language].TOTAL_PRICE}: ${total
      .toLocaleString()
      .replace(",", " ")} ${WORD[language].MONEY}</b>`;

    const keyboard = [
      [
        {
          text: WORD[language].CONFIRM_DELIVERY,
          callback_data: JSON.stringify({
            a: STATE.CONFIRM_DELIVERY,
          }),
        },
      ],
      [
        {
          text: WORD[language].CANCEL_DELIVERY,
          callback_data: JSON.stringify({
            a: STATE.CART,
          }),
        },
      ],
    ];
    if (messageType == STATIC.SEND_MESSAGE) {
      await ctx.reply(info, {
        reply_markup: {
          inline_keyboard: keyboard,
        },
        parse_mode: "HTML",
      });
    } else if (messageType == STATIC.EDIT_MESSAGE) {
      const olala = await ctx.editMessageText(info, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: WORD[language].CONFIRM_DELIVERY,
                callback_data: JSON.stringify({
                  a: STATE.CONFIRM_DELIVERY,
                }),
              },
            ],
          ],
        },
        parse_mode: "HTML",
      });
    }
  } else {
    if (messageType == STATIC.SEND_MESSAGE) {
      await ctx.reply(
        WORD[language].YOU_HAVE_EMPTY_CART,
        menuKeyboard(language, ctx)
      );
    } else if (messageType == STATIC.EDIT_MESSAGE) {
      await ctx.editMessageText(WORD[language].YOU_HAVE_EMPTY_CART, {
        reply_markup: {
          inline_keyboard: [
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
          ],
        },
      });
    }
  }
};
