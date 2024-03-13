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

  getVacanciesByCategory: async (category_id) => {
    try {
      return await Vacancy.find({ category_id: category_id, status: "open" });
    } catch (error) {
      throw error;
    }
  },

  getAllVacancies: async () => {
    return await Vacancy.find({
      status: "open",
    });
  },
  find: async (req) => {
    const DEFAULT_LIMIT = 10;
    let filter = {
      deleted_at: null,
      category_id: req.category_id,
    };
    const page = req.page ? req.page - 1 : 0;
    let options = {
      skip: page * (req.limit ? req.limit : DEFAULT_LIMIT),
      limit: req.limit ? req.limit : DEFAULT_LIMIT,
    };
    const findVacancy = () =>
      new Promise((resolve, reject) => {
        Vacancy.find(filter, null, options)
          .sort({ created_at: 1 })
          .exec((err, templates) => {
            if (err) {
              reject(err);
            }
            return resolve(templates || []);
          });
      });
    const countVacancy = () =>
      new Promise((resolve, reject) => {
        Vacancy.countDocuments(filter, (err, count) => {
          if (err) {
            reject(err);
          }
          return resolve(count);
        });
      });

    const [list, total] = await Promise.all([findVacancy(), countVacancy()]);
    const total_pages =
      total % options.limit == 0
        ? parseInt(total / options.limit)
        : parseInt(total / options.limit) + 1;
    return {
      list,
      total,
      total_pages,
      page: page + 1,
      page_total: list.length,
      limit: options.limit,
    };
  },
};
