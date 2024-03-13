const {
  vacancyCategoryStorage,
} = require("../../storage/mongo/bot/vacancy_category");

exports.vacancyCategoryService = {
  create: async (request) => {
    return {
      vacancyCategory: await vacancyCategoryStorage.create(request),
    };
  },

  getAllCategories: async () => {
    return await vacancyCategoryStorage.getAllCategories();
  },
};
