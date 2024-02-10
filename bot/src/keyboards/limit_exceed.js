const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, id, type) => {
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

  let text = "";

  if (type == STATE.MIN_ORDER_LIMIT) {
    text = `${WORD[language].MINIMUM_ORDER} ${product.min_order} `;
  } else if (type == STATE.MAX_ORDER_LIMIT) {
    text = `${WORD[language].MAXIMUM_ORDER} ${product.max_order} `;
  }
  await ctx.answerCbQuery(text);
};
