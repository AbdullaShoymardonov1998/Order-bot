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
  const products = response.list.map((value, index) => {
    let number = index + 1;
    if (page > 1) {
      number += (page - 1) * STATIC.LIMIT;
    }
    categoryParent = value.parent.parent;
    return [
      {
        text: `${number}. ${value.title[language]}`,
        callback_data: JSON.stringify({
          a: STATE.PRODUCT_INFO,
          p: value._id,
          q: 1,
        }),
      },
    ];
  });

  products.push([
    {
      text: WORD[language].BACK,
      callback_data: JSON.stringify({
        a: STATE.CATEGORY,
        p: categoryParent,
        n: 1,
      }),
    },
  ]);

  const navigation = [];

  if (page != 1) {
    navigation.push({
      text: WORD.GENERAL.PREVIOUS,
      callback_data: JSON.stringify({
        a: STATE.PRODUCT,
        p: parent,
        n: page - 1,
      }),
    });
  }

  if (page < response.total_pages) {
    navigation.push({
      text: WORD.GENERAL.NEXT,
      callback_data: JSON.stringify({
        a: STATE.PRODUCT,
        p: parent,
        n: page + 1,
      }),
    });
  }

  if (response.total_pages != 1) {
    products.push(navigation);
  }

  return {
    reply_markup: {
      inline_keyboard: products,
    },
  };
}
