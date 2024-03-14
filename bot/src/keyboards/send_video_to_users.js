const axios = require("axios");
const { config } = require("../config");
const { WORD } = require("../messages/dictionary");

module.exports = async (ctx) => {
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/user/all`,
    validateStatus: false,
  });
  if (status != 200) {
    throw new Error("Failed to fetch users");
  }

  let video;
  let counter = data.data.length;
  let blockedUsers = [];
  const caption = ctx.update.callback_query.message.caption;
  const part = caption.split("\n");
  const videoCaption = part[0];
  const userId = Number(part[2]);

  const videoData = await axios({
    method: "GET",
    url: `${config.apiURL}/video/user`,
    validateStatus: false,
    params: {
      userId,
    },
  });

  if (videoData.data.status === "SUCCESS" && videoData.data.data.length > 0) {
    const sortedVideos = videoData.data.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const mostRecentVideo = sortedVideos[0];

    video = mostRecentVideo.file_id;
  }
  console.log(video);
  if (video) {
    await ctx.telegram.sendMessage(userId, WORD.UZ.CONFIRMED_VIDEO);

    for (let i = 0; i < data.data.length; i++) {
      try {
        await ctx.telegram.sendVideo(data.data[i].telegram_id, video, {
          caption: videoCaption,
        });
      } catch (error) {
        counter -= 1;
        blockedUsers.push(data.data[i].first_name);
      }
    }

    const message = `🔔 The advertisement was sent to ${counter} users ✅`;
    await ctx.reply(message);

    if (blockedUsers.length > 0) {
      const blockedUsersList = `Blocked users: ${blockedUsers.join(", ")}`;
      await ctx.reply(blockedUsersList);
    }
  } else {
    return await ctx.reply("Jo'natish uchun video topilmadi");
  }
};
