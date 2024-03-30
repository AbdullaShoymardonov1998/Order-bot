const { config } = require("../config");
const axios = require("axios");
const { STATE, WORD } = require("../messages/dictionary");

const backRow = [
  {
    text: WORD.UZ.BACK,
    callback_data: JSON.stringify({
      a: STATE.SEND_VIDEO_COMMENTS,
    }),
  },
];

module.exports = async (ctx) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/video/`,
    validateStatus: false,
  });

  if (status != 200) {
    throw { response: data, status };
  }
  const userName = ctx.update.callback_query.from.first_name;
  const inlineKeyboard = {
    inline_keyboard: [
      ...data.data.map((video) => [
        {
          text: `${userName}ning jo'natgan videosi - 🎬 #${video.message_id}`,
          callback_data: JSON.stringify({
            a: STATE.COMMENT_RESPONSE,
            id: video._id,
            type: "video",
          }),
        },
      ]),
      backRow, // Add the backRow after displaying all the videos
    ],
  };

  ctx.editMessageText("👇🏻 Videolar", {
    reply_markup: inlineKeyboard,
  });
};
