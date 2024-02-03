const { Product } = require("../../../models/Product");
const { PAGE_LIMIT } = require("../../../states");

exports.productStorage = {
  create: async (product, picture) => {
    const time = new Date();
    product.created_at = time;
    product.updated_at = time;
    return await Product.create({ ...product, picture: { uuid: picture } });
  },
  get: async (id) => {
    const product = await Product.findOne({
      _id: id,
      deleted_at: null,
    }).populate("parent");
    if (product == null) {
      throw {
        statusCode: 404,
        message: `Product with id=${id} not found`,
      };
    }

    return product;
  },
  getAll: async (page) => {
    const filter = {
      deleted_at: null,
    };
    const options = {
      skip: (page - 1) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
      sort: {
        created_at: -1,
      },
    };

    const products = await Product.find(filter, {}, options);

    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / PAGE_LIMIT);

    return {
      products,
      total,
      pages,
    };
  },
  update: async (id, body, picture) => {
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        deleted_at: null,
      },
      {
        title: {
          UZ: body.title.UZ,
          RU: body.title.RU,
        },
        description: {
          UZ: body.description.UZ,
          RU: body.description.RU,
        },
        picture: {
          uuid: picture,
        },
        parent: body.parent,
        price: body.price,
        unit: body.unit,
        min_order: body.min_order,
        max_order: body.max_order,
        order_difference: body.order_difference,
        is_active: body.is_active,
        updated_at: new Date(),
      }
    );
    return product;
  },
  delete: async (id) => {
    const filter = {
      _id: id,
      deleted_at: null,
    };
    const update = {
      deleted_at: new Date(),
      picture: {
        uuid: null,
      },
    };
    const updatedProduct = await Product.findOneAndUpdate(filter, update);

    return updatedProduct;
  },
  countChildrenProducts: async (parent) => {
    return await Product.countDocuments({ parent, deleted_at: null });
  },
};
