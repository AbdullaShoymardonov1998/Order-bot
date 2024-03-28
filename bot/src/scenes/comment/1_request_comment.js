const { Composer } = require("telegraf");
const comment = new Composer();
comment.on("callback_query", async (ctx) => {
  const { id, type } = JSON.parse(ctx.callbackQuery.data);

  console.log(id, type);
  ctx.session.id = id;
  ctx.session.type = type;
  await ctx.reply("✍️ Enter your comment");
  return ctx.wizard.next();
});

module.exports = {
  comment,
};
