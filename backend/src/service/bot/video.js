const { userStorage } = require("../../storage/mongo/bot/user");
const { videoApprovalStorage } = require("../../storage/mongo/bot/video");

exports.videoApprovalService = {
  create: async (request) => {
    return {
      user: await userStorage.getByTelegramId(request.telegram_id),
      video: await videoApprovalStorage.create(request),
    };
  },
  getVideoApprovalById: async (query) => {
    return await videoApprovalStorage.getVideoApprovalById(query.videoId);
  },
  getVideoApprovalByFileId: async (query) => {
    return await videoApprovalStorage.getVideoApprovalByFileId(query.fileId);
  },
  getAllVideoApprovals: async () => {
    return await videoApprovalStorage.getAllVideoApprovals();
  },
  getVideoApprovalsByUserId: async (query) => {
    return await videoApprovalStorage.getVideoApprovalsByUserId(query.userId);
  },
  deleteVideoByFileId: async (query) => {
    return await videoApprovalStorage.deleteVideoByFileId(query.fileId);
  },
};
