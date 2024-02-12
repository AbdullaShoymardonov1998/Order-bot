const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, page, parent) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/product/find`,
    validateStatus: false,
    data: {
      parent,
      page,
      limit: STATIC.LIMIT,
      telegram_id: parseInt(ctx.chat.id),
    },
  });

  if (status != 200) {
    throw {
      response: data,
      status,
    };
  }
  const user = data.data.user;
  const products = data.data.product;

  const thumbnail = products.list[0]?.thumbnail?.picture?.url;

  await ctx.editMessageText(
    `${WORD[user.language].SELECT_PRODUCT} <a href="${thumbnail}">&#8205;</a>`,
    {
      reply_markup: {
        inline_keyboard: await productListKeyboard(
          products,
          page,
          parent,
          user.language
        ),
      },
      parse_mode: "HTML",
    }
  );
};

async function productListKeyboard(response, page, parent, language) {
  let categoryParent = null;
  const inline_keyboard = [];

  const row = [];
  response.list.forEach((value, index) => {
    if (index < 6) {
      let number = index + 1;
      if (page > 1) {
        number += (page - 1) * 6;
      }
      categoryParent = value.parent.parent;

      row.push({
        text: `${number}`,
        callback_data: JSON.stringify({
          a: STATE.PRODUCT_INFO,
          p: value._id,
          q: 1,
        }),
      });
    }
  });

  if (row.length) inline_keyboard.push(row);

  // Navigation buttons
  const navigationRow = [];

  if (page != 1) {
    navigationRow.push({
      text: WORD.GENERAL.PREVIOUS,
      callback_data: JSON.stringify({
        a: STATE.PRODUCT,
        p: parent,
        n: page - 1,
      }),
    });
  }

  if (page < response.total_pages) {
    navigationRow.push({
      text: WORD.GENERAL.NEXT,
      callback_data: JSON.stringify({
        a: STATE.PRODUCT,
        p: parent,
        n: page + 1,
      }),
    });
  }

  if (navigationRow.length) inline_keyboard.push(navigationRow);
  // Back button row
  const backRow = [
    {
      text: WORD[language].BACK,
      callback_data: JSON.stringify({
        a: STATE.CATEGORY,
        p: categoryParent,
        n: 1,
      }),
    },
  ];

  inline_keyboard.push(backRow);
  return inline_keyboard;
}
