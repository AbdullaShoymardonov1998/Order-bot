const { VacancyCategory } = require("../../../models/VacancyCategory");

module.exports.vacancyCategoryStorage = {
  create: async (vacancyCategory) => {
    const existingCategory = await VacancyCategory.findOne({
      title: vacancyCategory.title,
    });

    if (existingCategory) {
      throw new Error("Vacancy category with the same title already exists");
    }
    const time = new Date();
    vacancyCategory.created_at = time;
    vacancyCategory.updated_at = time;
    try {
      return await VacancyCategory.create(vacancyCategory);
    } catch (error) {
      throw error;
    }
  },
  getAllCategories: async () => {
    try {
      return await VacancyCategory.find();
    } catch (error) {
      throw error;
    }
  },
};
