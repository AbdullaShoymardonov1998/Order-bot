const { WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");
const productListHelper = require("../utils/product_list");

module.exports = async (ctx) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/order`,
    validateStatus: false,
    data: {
      telegram_id: ctx.chat.id,
    },
  });
  if (status != 200) {
    throw { response: data, status };
  }

  const user = data.data.user;
  const newOrder = data.data.order;
  const language = user.language;

  let info = `${WORD[language].ORDER_CONFIRMED}\n\n🛍🛍🛍`;
  const { productList } = await productListHelper(user.cart, language);
  info += productList;
  info += `\n\n📍 <b>${WORD[language].LOCATION}</b>: ${newOrder.location}`;
  info += `\n\n<b>${WORD[language].TOTAL_PRICE}: ${newOrder.total
    .toLocaleString()
    .replace(",", " ")} ${WORD[language].MONEY}</b>`;
  info += `\n---------------------------------------------------------------------\n<b>${WORD[language].ORDER_STATUS}</b>: ${WORD[language].PENDING_ORDER}`;

  await ctx.editMessageText(info, {
    parse_mode: "HTML",
  });
};
