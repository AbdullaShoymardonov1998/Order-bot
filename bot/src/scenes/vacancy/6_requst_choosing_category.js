const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyCategory = new Composer();
vacancyCategory.on("text", async (ctx) => {
  ctx.wizard.state.vacancySalary = ctx.update.message?.text;
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/vacancy/category/all`,
    validateStatus: false,
  });

  const keyboard = data.data.map((item) => [
    { text: `${item.title}`, callback_data: `${item._id}` },
  ]);
  await ctx.reply("Choose category", {
    reply_markup: {
      inline_keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  return ctx.wizard.next();
});

module.exports = {
  vacancyCategory,
};
