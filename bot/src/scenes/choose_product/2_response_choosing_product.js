const { Composer } = require("telegraf");
const { WORD, STATE } = require("../../messages/dictionary");
const requestChoosingQuantity = new Composer();
requestChoosingQuantity.on("callback_query", async (ctx) => {
  ctx.wizard.state.sizeId = ctx.callbackQuery.data;
  console.log(WORD[ctx.wizard.state.language].PREVIOUS);
  if (ctx.callbackQuery.data === "null") {
    await ctx.editMessageText("Davom etish", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: WORD[ctx.wizard.state.language].PREVIOUS,
              callback_data: JSON.stringify({
                a: STATE.PRODUCT_INFO,
                p: ctx.wizard.state.productId,
              }),
            },
          ],
        ],
      },
    });
    return ctx.scene.leave();
  }
  await ctx.editMessageText(
    `${WORD[ctx.wizard.state.language].SELECT_QUANTITY}`
  );

  return ctx.wizard.next();
});
module.exports = {
  requestChoosingQuantity,
};
