const { Category } = require("../../../models/Category");

exports.categoryStorage = {
  create: async (category) => {
    const time = new Date();
    category.created_at = time;
    category.updated_at = time;
    return await Category.create(category);
  },
  get: async (id) => {
    const existingCategory = await Category.findOne({
      _id: id,
      deleted_at: null,
    });
    if (existingCategory == null) {
      throw {
        statusCode: 404,
        message: `Category with id=${id} not found`,
      };
    }

    return existingCategory;
  },
  getWithSubCategories: async (id) => {
    const category = await Category.findOne({
      _id: id,
      deleted_at: null,
    });
    const categories = await Category.find({ parent: id, deleted_at: null });

    return {
      data: category,
      categories,
    };
  },
  getAllMainCategories: async () => {
    const categories = await Category.find({
      deleted_at: null,
      parent: null,
    });

    return categories;
  },
  update: async (id, body) => {
    const category = await Category.findOneAndUpdate(
      { _id: id },
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
          uuid: body.picture.uuid,
        },
        updated_at: new Date(),
      }
    );
    return category;
  },
  delete: async (id) => {
    const filter = {
      _id: id,
      deleted_at: null,
    };
    const update = {
      deleted_at: new Date(),
    };
    const updatedCategory = await Category.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (updatedCategory == null) {
      throw {
        statusCode: 404,
        message: `Category with id=${id} does not exists`,
      };
    }

    return updatedCategory;
  },
  countSubCategory: async (parent) => {
    return await Category.countDocuments({ parent, deleted_at: null });
  },
};
