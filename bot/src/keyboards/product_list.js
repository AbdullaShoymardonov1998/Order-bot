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
  const product = data.data.product;

  await ctx.editMessageText(
    WORD[user.language].SELECT_PRODUCT,
    await productListKeyboard(product, page, parent, user.language)
  );
};

async function productListKeyboard(response, page, parent, language) {
  let categoryParent = null;
  const inline_keyboard = []; // Renamed to more clearly represent its final use

  const row = []; // Temporary array to hold buttons for products
  response.list.forEach((value, index) => {
    if (index < 6) {
      // Display only the first 5 products
      let number = index + 1;
      if (page > 1) {
        number += (page - 1) * 6; // Assuming STATIC.LIMIT is 5
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

  // Push the first row of product buttons
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

  // Only add the navigation row if it has buttons
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

  // Add the back button row to the keyboard
  inline_keyboard.push(backRow);
  return {
    reply_markup: {
      inline_keyboard: inline_keyboard,
    },
  };
}
