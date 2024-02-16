const { Composer } = require("telegraf");
const { WORD } = require("../../messages/dictionary");
const requestChoosingQuantity = new Composer();
requestChoosingQuantity.on("callback_query", async (ctx) => {
  let info = `${WORD.UZ.SELECT_QUANTITY}`;
  ctx.wizard.state.sizeId = ctx.callbackQuery.data;
  await ctx.editMessageText(info);
  return ctx.wizard.next();
});
module.exports = {
  requestChoosingQuantity,
};
