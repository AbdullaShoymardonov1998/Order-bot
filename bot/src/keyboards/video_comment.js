// const { STATE, STATIC, WORD } = require("../messages/dictionary");
// const { config } = require("../config");
// const axios = require("axios");

// module.exports = async (ctx) => {
//   const { data, status } = await axios({
//     method: "GET",
//     url: `${config.apiURL}/comment/videos-comments`,
//     validateStatus: false,
//   });
//   if (status != 200) {
//     throw { response: data, status };
//   }

//   const comments = data.data.comment.flatMap(
//     (commentObj) => commentObj.comments
//   );

//   const info = comments.join("\n");

//   ctx.editMessageText(info, {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: WORD.UZ.BACK,
//             callback_data: JSON.stringify({
//               a: STATE.SEND_VIDEO_COMMENTS,
//             }),
//           },
//         ],
//       ],
//     },
//     parse_mode: "HTML",
//   });
// };
