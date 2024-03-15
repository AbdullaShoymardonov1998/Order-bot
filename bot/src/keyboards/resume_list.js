const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, category_id, page) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/resume/find`,
    validateStatus: false,
    data: {
      category_id,
      page,
      limit: 5,
      telegram_id: parseInt(ctx.chat.id),
    },
  });

  if (status != 200) {
    throw {
      response: data,
      status,
    };
  }

  const resumes = data.data;

  await ctx.editMessageText(`${WORD.UZ.SELECT_VACANCY}`, {
    reply_markup: {
      inline_keyboard: await resumeListKeyboard(resumes, page, category_id),
    },
    parse_mode: "HTML",
  });
};

async function resumeListKeyboard(response, page, category_id) {
  const inline_keyboard = [];

  response.list.forEach((value, index) => {
    if (index < 5) {
      let number = index + 1;
      if (page > 1) {
        number += (page - 1) * 5;
      }
      const date = new Date(value.created_at);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0, so we add 1
      const year = date.getFullYear();

      const formattedDate = `${day}.${month}.${year}`;
      const button = [
        {
          text: `${value.profession}-💵 ${value.salary}\n(${formattedDate})`,
          callback_data: JSON.stringify({
            a: STATE.RESUME_INFO,
            v: value._id,
            n: 1,
          }),
        },
      ];

      inline_keyboard.push(button);
    }
  });

  // Navigation buttons
  const navigationRow = [];

  if (page != 1) {
    navigationRow.push({
      text: WORD.UZ.PREVIOUS,
      callback_data: JSON.stringify({
        a: STATE.RESUME_LIST,
        v: category_id,
        n: page - 1,
      }),
    });
  }

  if (page < response.total_pages) {
    navigationRow.push({
      text: WORD.UZ.NEXT,
      callback_data: JSON.stringify({
        a: STATE.RESUME_LIST,
        v: category_id,
        n: page + 1,
      }),
    });
  }

  if (navigationRow.length) inline_keyboard.push(navigationRow);
  // Back button row
  const backRow = [
    {
      text: WORD.UZ.BACK,
      callback_data: JSON.stringify({
        a: STATE.RESUME_CATEGORY,
        p: null,
        n: 1,
      }),
    },
  ];

  inline_keyboard.push(backRow);
  return inline_keyboard;
}
