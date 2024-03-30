// Assuming the existing code for fetching product data and constructing product information
const { config } = require("../config");
const axios = require("axios");
const { WORD, STATE } = require("../messages/dictionary");
module.exports = async (ctx) => {
  const { id, type } = JSON.parse(ctx.callbackQuery.data);
  let url, paramsKey;
  let backButton = [];
  if (type === "product") {
    url = `${config.apiURL}/comment/product`;
    paramsKey = "product_id";
    backButton = [
      [
        {
          text: WORD.UZ.BACK,
          callback_data: JSON.stringify({
            a: STATE.PRODUCT_INFO,
            p: id,
          }),
        },
      ],
    ];
  } else if (type === "vacancy") {
    url = `${config.apiURL}/comment/vacancy`;
    paramsKey = "vacancy_id";
    backButton = [
      [
        {
          text: WORD.UZ.BACK,
          callback_data: JSON.stringify({
            a: STATE.VACANCY_INFO,
            v: id,
          }),
        },
      ],
    ];
  } else if (type === "resume") {
    url = `${config.apiURL}/comment/resume`;
    paramsKey = "resume_id";
    backButton = [
      [
        {
          text: WORD.UZ.BACK,
          callback_data: JSON.stringify({
            a: STATE.RESUME_INFO,
            v: id,
          }),
        },
      ],
    ];
  } else if (type === "video") {
    url = `${config.apiURL}/comment/video`;
    paramsKey = "video_id";
    backButton = [
      [
        {
          text: WORD.UZ.BACK,
          callback_data: JSON.stringify({
            a: STATE.VIDEO_LIST,
            v: id,
          }),
        },
      ],
    ];
  } else {
    console.error("Unsupported type:", type);
    return;
  }

  try {
    const { data, status } = await axios({
      method: "GET",
      url: url,
      params: {
        telegram_id: ctx.from.id,
        [paramsKey]: id,
      },
    });

    let comments = [];

    if (status === 200) {
      comments = data.data.comment;
    }
    let info = "";
    if (comments.length === 0) {
      return ctx.editMessageText("Komment topilmadi", {
        reply_markup: {
          inline_keyboard: backButton,
        },
      });
    }
    comments.forEach((comment) => {
      info += `<b><i> ${data.data.user.first_name}</i></b>\n- <i>"${comment.comment}"</i>\n\n`;
    });
    await ctx.editMessageText(info, {
      reply_markup: {
        inline_keyboard: backButton,
      },
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};
