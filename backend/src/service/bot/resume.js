const { userStorage } = require("../../storage/mongo/bot/user");
const { resumeStorage } = require("../../storage/mongo/bot/resume");

exports.resumeService = {
  create: async (request) => {
    return {
      user: await userStorage.getByTelegramId(request.telegram_id),
      resume: await resumeStorage.create(request),
    };
  },
  getResumeById: async (query) => {
    return await resumeStorage.getResumeById(query);
  },
  getResumeByCategory: async (query) => {
    return await resumeStorage.getResumesByCategory(query);
  },
  getAllResumes: async () => {
    return await resumeStorage.getAllResumes();
  },
};
