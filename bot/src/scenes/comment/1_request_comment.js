const { Composer } = require("telegraf");
const comment = new Composer();
comment.on("callback_query", async (ctx) => {
  const { id, type } = JSON.parse(ctx.callbackQuery.data);

  ctx.session.id = id;
  ctx.session.type = type;
  await ctx.editMessageText("✍️ Izohingizni kiriting...");
  return ctx.wizard.next();
});

module.exports = {
  comment,
};
