const { Vacancy } = require("../../../models/Vacancy");

module.exports.vacancyStorage = {
  create: async (vacancy) => {
    const time = new Date();
    vacancy.created_at = time;
    vacancy.updated_at = time;
    vacancy.user_id = vacancy.telegram_id;
    vacancy.status = "open";
    try {
      return await Vacancy.create(vacancy);
    } catch (error) {
      throw error;
    }
  },

  getVacancyById: async (vacancyId) => {
    try {
      return await Vacancy.findById(vacancyId);
    } catch (error) {
      throw error;
    }
  },

  getAllVacancies: async () => {
    return await Vacancy.find();
  },
};
