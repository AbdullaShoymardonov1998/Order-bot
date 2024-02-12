const Joi = require("joi");

const ColorSchema = Joi.object({
  name: Joi.string().required(),
  picture: Joi.object({
    uuid: Joi.string().allow(null),
  }),
});

const SizeSchema = Joi.object({
  name: Joi.string().required(),
});

const create = Joi.object({
  title: {
    UZ: Joi.string().required(),
    RU: Joi.string().required(),
  },
  description: {
    UZ: Joi.string().allow(""),
    RU: Joi.string().allow(""),
  },
  picture: {
    uuid: Joi.string().allow(null),
  },
  parent: Joi.string().required(),
  price: Joi.number().integer().positive().required(),
  min_order: Joi.number().positive().required(),
  max_order: Joi.number()
    .positive()
    .greater(Joi.ref("min_order"))
    .min(1)
    .required(),
  is_active: Joi.boolean().required(),
  colors: Joi.array().items(ColorSchema),
  sizes: Joi.array().items(SizeSchema),
  thumbnail: Joi.string().allow(null), // Assuming thumbnail is just a string UUID reference
});
const getAll = Joi.object({
  page: Joi.number().integer().positive().required(),
});

const get = Joi.object({
  id: Joi.string().required(),
});

const remove = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  create,
  getAll,
  get,
  delete: remove,
  update: create,
};
