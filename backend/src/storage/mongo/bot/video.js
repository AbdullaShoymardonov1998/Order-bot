const { VideoApproval } = require("../../../models/Video");

module.exports.videoApprovalStorage = {
  create: async (video) => {
    const time = new Date();
    video.created_at = time;
    video.updated_at = time;
    video.user_id = video.telegram_id;
    try {
      return await VideoApproval.create(video);
    } catch (error) {
      throw error;
    }
  },

  getAllVideoApprovals: async () => {
    try {
      return await VideoApproval.find();
    } catch (error) {
      throw error;
    }
  },

  getVideoApprovalById: async (videoId) => {
    try {
      return await VideoApproval.findOne({
        video_id: videoId,
      });
    } catch (error) {
      throw error;
    }
  },

  getVideoApprovalByFileId: async (fileId) => {
    try {
      return await VideoApproval.findOne({
        file_id: fileId,
      });
    } catch (error) {
      throw error;
    }
  },

  getVideoApprovalsByUserId: async (userId) => {
    try {
      return await VideoApproval.find({
        user_id: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  deleteVideoByFileId: async (fileId) => {
    try {
      return await VideoApproval.deleteOne({
        where: {
          file_id: fileId,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
