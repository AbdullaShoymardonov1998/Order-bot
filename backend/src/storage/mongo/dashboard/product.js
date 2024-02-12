const { Product } = require("../../../models/Product");
const { PAGE_LIMIT } = require("../../../states");

exports.productStorage = {
  create: async (product) => {
    const time = new Date();
    product.created_at = time;
    product.updated_at = time;
    return await Product.create(product);
  },
  get: async (id) => {
    const product = await Product.findOne({
      _id: id,
    })
      .populate("parent")
      .populate("thumbnail");
    if (product == null) {
      throw {
        statusCode: 404,
        message: `Product with id=${id} not found`,
      };
    }

    return product;
  },
  getAll: async (page) => {
    const filter = {};
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
  update: async (id, body) => {
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
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
        picture: body.picture,
        parent: body.parent,
        price: body.price,
        min_order: body.min_order,
        max_order: body.max_order,
        is_active: body.is_active,
        updated_at: new Date(),
        colors: body.colors,
        sizes: body.sizes,
        thumbnail: body.thumbnail,
      }
    );
    return product;
  },
  delete: async (id) => {
    const filter = {
      _id: id,
    };

    const updatedProduct = await Product.deleteOne(filter);
    return updatedProduct;
  },
  countChildrenProducts: async (parent) => {
    return await Product.countDocuments({ parent });
  },
};
