const { WORD } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");

module.exports = async (ctx) => {
  const caption = ctx.update.callback_query.message.caption;
  const part = caption.split("\n");
  const userId = Number(part[2]);
  let video;
  const { data, status } = await axios({
    method: "GET",
    url: `${config.apiURL}/video/user`,
    validateStatus: false,
    params: {
      userId,
    },
  });
  if (status != 200) {
    throw new Error("Failed to fetch users");
  }
  if (data.data.length > 0) {
    const sortedVideos = data.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const mostRecentVideo = sortedVideos[0];

    video = mostRecentVideo.file_id;
  }

  if (video) {
    await deleteVideo(video);
    await ctx.telegram.sendMessage(userId, WORD.UZ.REJECTED_VIDEO);
    return await ctx.reply("Video o'chirildi ✅");
  } else {
    ctx.reply("Video xabar topilmadi!");
  }
};

async function deleteVideo(videoId) {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${config.apiURL}/video/delete-by-file-id`,
      params: {
        file_id: videoId,
      },
      validateStatus: false,
    });

    if (response.status != 200) {
      throw new Error("Failed to delete video");
    }

    console.log("Video deleted successfully");
  } catch (error) {
    console.error("Error deleting video:", error.message);
  }
}
