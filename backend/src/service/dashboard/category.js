const { categoryStorage } = require("../../storage/mongo/dashboard/category");
const { productStorage } = require("../../storage/mongo/dashboard/product");

exports.categoryService = {
  create: async (category) => {
    if (category.parent != null) {
      const parent = await categoryStorage.get(category.parent);
      if (parent.parent != null) {
        throw {
          statusCode: 400,
          message: `Category id=${category.parent} has already parent`,
        };
      }
    }

    return await categoryStorage.create(category);
  },
  getAllMainCategories: async () => {
    return await categoryStorage.getAllMainCategories();
  },
  getWithSubCategories: async (id) => {
    await categoryStorage.get(id);
    return await categoryStorage.getWithSubCategories(id);
  },
  update: async (id, body) => {
    await categoryStorage.get(id);
    return await categoryStorage.update(id, body);
  },
  delete: async (id) => {
    const existingCategory = await categoryStorage.get(id);

    if (existingCategory.parent == null) {
      // if parent=null, count sub category
      const countSubCategory = await categoryStorage.countSubCategory(id);
      if (countSubCategory > 0) {
        throw {
          statusCode: 400,
          message: `Category with id=${id} has sub categories with count=${countSubCategory}`,
        };
      }
    } else {
      // if parent != null, count products
      const countChildrenProduct = await productStorage.countChildrenProducts(
        id
      );
      if (countChildrenProduct > 0) {
        throw {
          statusCode: 400,
          message: `Category with id=${id} has sub products with count=${countChildrenProduct}`,
        };
      }
    }

    return await categoryStorage.delete(id);
  },
};
