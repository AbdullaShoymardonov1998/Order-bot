const { Category } = require("../../../models/Category");

exports.categoryStorage = {
  find: async (req) => {
    const DEFAULT_LIMIT = 10;
    let filter = {
      deleted_at: null,
      is_active: true,
      parent: req.parent,
    };
    const page = req.page ? req.page - 1 : 0;
    let options = {
      skip: page * (req.limit ? req.limit : DEFAULT_LIMIT),
      limit: req.limit ? req.limit : DEFAULT_LIMIT,
    };
    const findCategory = () =>
      new Promise((resolve, reject) => {
        Category.find(filter, null, options)
          .sort({ created_at: 1 })
          .populate({ model: "Category", path: "parent" })
          .exec((err, templates) => {
            if (err) {
              reject(err);
            }
            return resolve(templates || []);
          });
      });
    const countCategory = () =>
      new Promise((resolve, reject) => {
        Category.countDocuments(filter, (err, count) => {
          if (err) {
            reject(err);
          }
          return resolve(count);
        });
      });

    const [list, total] = await Promise.all([findCategory(), countCategory()]);
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
