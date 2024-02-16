const { Composer } = require("telegraf");
const axios = require("axios");
const { config } = require("../../config");
const { WORD, STATE } = require("../../messages/dictionary");
const saveOrder = new Composer();
saveOrder.on("text", async (ctx) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/user/cart`,
    validateStatus: false,
    data: {
      telegram_id: ctx.chat.id,
      product_id: ctx.wizard.state.productId,
      quantity: ctx.message.text,
      color_id: ctx.wizard.state.colorId,
      size_id: ctx.wizard.state.sizeId,
    },
  });

  if (status !== 200) {
    throw { response: data, status };
  }
  const user = data.data.user;
  const language = data.data.user.language;
  let info = `${WORD[language].ADDED_TO_CART}`;
  await ctx.reply(info, {
    reply_markup: {
      inline_keyboard: [
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
      ],
    },
  });
  return ctx.scene.leave();
});
module.exports = {
  saveOrder,
};
