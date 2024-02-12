const { Product } = require("../../../models/Product");

exports.productStorage = {
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
    const findProduct = () =>
      new Promise((resolve, reject) => {
        Product.find(filter, null, options)
          .sort({ created_at: -1 })
          .populate({ model: "Category", path: "parent" })
          .populate({ model: "Thumbnail", path: "thumbnail" })
          .exec((err, templates) => {
            if (err) {
              reject(err);
            }
            return resolve(templates || []);
          });
      });
    const coundProduct = () =>
      new Promise((resolve, reject) => {
        Product.countDocuments(filter, (err, count) => {
          if (err) {
            reject(err);
          }
          return resolve(count);
        });
      });

    const [list, total] = await Promise.all([findProduct(), coundProduct()]);
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
  get: async (id) => {
    const filter = {
      _id: id,
      deleted_at: null,
      is_active: true,
    };
    const existingProduct = await Product.findOne(filter).populate({
      model: "Category",
      path: "parent",
    });

    if (existingProduct == null) {
      throw {
        statusCode: 404,
        message: `Product with id=${id} does not exists`,
      };
    }

    return existingProduct;
  },
};
