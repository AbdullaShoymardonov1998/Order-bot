const { productStorage } = require("../../storage/mongo/dashboard/product");
const { categoryStorage } = require("../../storage/mongo/dashboard/category");
const { UNIT_QUANTITY } = require("../../states");
const fileUpload = require("../../util/minio");

exports.productService = {
  create: async (product, file) => {
    const parent = await categoryStorage.get(product.parent);
    const subParent = await categoryStorage.get(parent.parent);
    if (subParent.parent == null) {
      throw {
        statusCode: 400,
        message: `Category id=${product.parent} is not subcategory`,
      };
    }

    if (product.unit === UNIT_QUANTITY && product.order_difference !== 1) {
      throw {
        statusCode: 400,
        message: "order_difference should be integer",
      };
    }
    let picture = null;
    if (file) {
      picture = await fileUpload.upload(file);
    }

    return await productStorage.create(product, picture);
  },
  get: async (id) => {
    return await productStorage.get(id);
  },
  getAll: async (page) => {
    return await productStorage.getAll(page);
  },
  update: async (id, body, file) => {
    const parent = await categoryStorage.get(body.parent);
    if (parent.parent == null) {
      throw {
        statusCode: 400,
        message: `Category id=${body.parent} is not subcategory`,
      };
    }

    if (body.unit === UNIT_QUANTITY && body.order_difference !== 1) {
      throw {
        statusCode: 400,
        message: "order_difference should be integer",
      };
    }

    const oldProduct = await productStorage.get(id);

    let picture = oldProduct.picture.uuid;
    if (picture && file) {
      await fileUpload.delete(picture);

      picture = await fileUpload.upload(file);
    } else if (file) {
      picture = await fileUpload.upload(file);
    }

    return await productStorage.update(id, body, picture);
  },
  delete: async (id) => {
    const product = await productStorage.get(id);

    if (product.picture.uuid) {
      await fileUpload.delete(product.picture.uuid);
    }
    return await productStorage.delete(id);
  },
};
