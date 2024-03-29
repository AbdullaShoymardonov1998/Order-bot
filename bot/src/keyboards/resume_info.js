const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx, resumeId) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/resume/single`,
    validateStatus: false,
    params: {
      resume_id: resumeId,
    },
  });
  if (status != 200) {
    throw { response: data, status };
  }
  let resume = data.data;

  const fileData = await ctx.telegram.getFile(resume.resume.file_id);

  const fileUrl = `https://api.telegram.org/file/bot${config.botToken}/${fileData.file_path}`;

  let employeeStatus;
  if (resume.status === "available") {
    employeeStatus = "🔎 Aktiv holda ish qidirmoqda";
  } else {
    employeeStatus = "Ishga qabul qilingan🤩";
  }
  let info = "<b>#Resume</b> \n\n";
  info += `<b>Xodim: </b><i>${resume.fullName}</i>\n\n`;
  info += `<b>Mutaxasissligi: </b><i>${resume.profession}</i>\n\n`;
  info += `<b>Xodim haqida qisqacha:</b> <i>${resume.about}</i>\n\n`;
  info += `<b>Tajriba: </b><i>${resume.experience}</i>\n\n`;
  info += `<b>🎯 Qobilyatlari: </b><i>${resume.skills}</i>\n\n`;
  info += `<b>💵 Kutilayotgan oylik maosh: </b><i>${resume.salary}</i>\n\n`;
  info += `<b>☎️ Kontakt: </b><i>${resume.contact}</i>\n\n`;
  info += `<b>🟢 Holati: </b><i>${employeeStatus}</i>\n\n`;

  info += `<b><i><a href="https://t.me/XitoyoptomHaoomas">👨‍👨‍👧 👙 👗 🧦 Xitoy optom tovarlari bu yerda</a></i></b>`;

  const keyboard = [
    [
      {
        text: `${WORD.UZ.COMMENT}`,
        callback_data: JSON.stringify({
          a: STATE.COMMENT,
          id: resumeId,
          type: "resume",
        }),
      },
      {
        text: `${WORD.UZ.VIEW_COMMENT}`,
        callback_data: JSON.stringify({
          a: STATE.COMMENT_RESPONSE,
          id: resumeId,
          type: "resume",
        }),
      },
    ],
    [
      {
        text: "📥 Resumeni yuklab olish",
        url: fileUrl,
      },
    ],
    [
      {
        text: WORD.UZ.BACK,
        callback_data: JSON.stringify({
          a: STATE.RESUME_LIST,
          v: resume.category_id,
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
