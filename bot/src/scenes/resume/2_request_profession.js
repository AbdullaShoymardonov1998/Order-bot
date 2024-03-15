const { Composer } = require("telegraf");
const profession = new Composer();
profession.on("text", async (ctx) => {
  ctx.wizard.state.fullName = ctx.update.message?.text;
  if (ctx.update.message?.text === "/start") {
    return ctx.reply(
      "Ism sharif noto'g'ri kiritildi, qaytadan to'g'ri kiriting"
    );
  }

  await ctx.reply(
    "✍️ Mutaxassisligingizni kiriting \n\nmasalan : <i>\n-Xitoy tilidan tarjimon\n-Dasturchi\n-Buxgalter\n-Sotuv menejeri...</i>,",
    {
      parse_mode: "HTML",
    }
  );
  return ctx.wizard.next();
});
module.exports = {
  profession,
};
