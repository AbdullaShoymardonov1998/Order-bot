const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, category_id, page) => {
  const { data, status } = await axios({
    method: "POST",
    url: `${config.apiURL}/vacancy/find`,
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

  const vacancies = data.data;

  await ctx.editMessageText(`${WORD.UZ.SELECT_VACANCY}`, {
    reply_markup: {
      inline_keyboard: await vacancyListKeyboard(vacancies, page, category_id),
    },
    parse_mode: "HTML",
  });
};

async function vacancyListKeyboard(response, page, category_id) {
  const inline_keyboard = [];

  response.list.forEach((value, index) => {
    if (index < 5) {
      let number = index + 1;
      if (page > 1) {
        number += (page - 1) * 5;
      }
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value.created_at));

      const button = [
        {
          text: `${value.title} (💵 ${value.salary} /\n created at: ${formattedDate})`,
          callback_data: JSON.stringify({
            a: STATE.VACANCY_INFO,
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
        a: STATE.VACANCY_LIST,
        v: category_id,
        n: page - 1,
      }),
    });
  }

  if (page < response.total_pages) {
    navigationRow.push({
      text: WORD.UZ.NEXT,
      callback_data: JSON.stringify({
        a: STATE.VACANCY_LIST,
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
        a: STATE.VACANCY_CATEGORY,
        p: null,
        n: 1,
      }),
    },
  ];

  inline_keyboard.push(backRow);
  return inline_keyboard;
}
