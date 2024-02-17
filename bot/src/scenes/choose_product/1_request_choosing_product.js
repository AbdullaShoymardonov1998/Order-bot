const { Composer } = require("telegraf");
const { config } = require("../../config");
const axios = require("axios");
const { WORD, STATE } = require("../../messages/dictionary");
const chooseColor = new Composer();
chooseColor.on("callback_query", async (ctx) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/product/get-color-id`,
    validateStatus: false,
    params: {
      id: ctx.wizard.state.colorId,
      telegram_id: ctx.chat.id,
    },
  });

  if (status !== 200) {
    throw { response: data, status };
  }
  let info = `${WORD.UZ.SELECT_SIZE}`;
  const product = data.data.product;
  console.log(product.id);
  ctx.wizard.state.productId = product.id;
  console.log("CTX.prod ", ctx.wizard.state.productId);
  const pictureUrl = product.colors.filter(
    (colors) => colors.id === ctx.wizard.state.colorId
  );
  if (pictureUrl.length > 0) {
    info += ` <a href="${pictureUrl[0].picture.url}">&#8205;</a>`;
  }
  const language = data.data.user.language;
  const sizesKeyboard = product.sizes.map((size) => [
    {
      text: size.name,
      callback_data: `${size._id}`,
    },
  ]);
  const keyboard = [
    ...sizesKeyboard,
    [
      {
        text: `${WORD[language].BACK}`,
        callback_data: "null",
      },
    ],
  ];

  await ctx.editMessageText(info, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
    parse_mode: "HTML",
  });
  return ctx.wizard.next();
});

module.exports = {
  chooseColor,
};
