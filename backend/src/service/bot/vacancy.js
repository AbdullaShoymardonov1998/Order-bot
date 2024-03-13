const { userStorage } = require("../../storage/mongo/bot/user");
const { vacancyStorage } = require("../../storage/mongo/bot/vacancy");

exports.vacancyService = {
  create: async (request) => {
    return {
      user: await userStorage.getByTelegramId(request.telegram_id),
      vacancy: await vacancyStorage.create(request),
    };
  },
  getVacancyById: async (id) => {
    return await vacancyStorage.getVacancyById(id);
  },

  getVacanciesByCategory: async (query) => {
    return await vacancyStorage.getVacanciesByCategory(query);
  },

  getAllVacancies: async () => {
    return await vacancyStorage.getAllVacancies();
  },
  find: async (query) => {
    return await vacancyStorage.find(query);
  },
};
