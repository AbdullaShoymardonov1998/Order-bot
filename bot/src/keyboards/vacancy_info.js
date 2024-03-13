const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, vacancyId) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/vacancy/single`,
    validateStatus: false,
    params: {
      vacancy_id: vacancyId,
    },
  });
  if (status != 200) {
    throw { response: data, status };
  }
  let vacancy = data.data;

  let info = "<b>#Vakansiya</b> \n\n";

  info += `<b>${vacancy.title}</b>\n\n`;
  info += `<b><i>Kompaniya:</i> </b>${vacancy.company}\n\n`;
  info += `<b>🔖 <i>Xodim majburiyatlari:</i></b>\n${vacancy.responsibility}\n\n`;
  info += `<b>🎯 <i>Ish o'rni uchun talablar:</i></b>\n${vacancy.requirement}\n\n`;
  info += `<b>💵<i> Oylik maosh</i>: </b>${vacancy.salary}\n\n`;
  info += `<b>☎️ <i>Kontakt:</i> </b>${vacancy.contact}\n\n`;
  info += `<a href="https://t.me/XitoyoptomHaoomas">Telegram</a>`;

  const keyboard = [
    [
      {
        text: WORD.UZ.BACK,
        callback_data: JSON.stringify({
          a: STATE.VACANCY_LIST,
          v: vacancy.category_id,
          n: 1,
        }),
      },
    ],
  ];
  await ctx.editMessageText(info, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
    parse_mode: "HTML",
  });
};
