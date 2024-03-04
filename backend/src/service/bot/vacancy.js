const { userStorage } = require("../../storage/mongo/bot/user");
const { vacancyStorage } = require("../../storage/mongo/bot/vacancy");

exports.vacancyService = {
  create: async (request) => {
    return {
      user: await userStorage.getByTelegramId(request.telegram_id),
      vacancy: await vacancyStorage.create(request),
    };
  },
  getVacancyById: async (query) => {
    return await vacancyStorage.getVacancyById(query.vacancy_id);
  },
  getAllVacancies: async () => {
    return await vacancyStorage.getAllVacancies();
  },
};
