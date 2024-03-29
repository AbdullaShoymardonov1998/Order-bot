const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const vacancyContact = new Composer();
vacancyContact.on("callback_query", async (ctx) => {
  await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  const responseData = JSON.parse(ctx.update.callback_query.data);
  const categoryId = responseData.v;
  ctx.wizard.state.categoryId = categoryId;

  // ctx.wizard.state.categoryId = ctx.update.message?.text;
  ctx.reply("Send your contact information", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Kontakt yuborish",
            request_contact: true,
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  return ctx.wizard.next();
});

module.exports = {
  vacancyContact,
};
