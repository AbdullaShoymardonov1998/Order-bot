const Joi = require("joi");
const { UNIT_QUANTITY, UNIT_MASS } = require("../../../../states");

const create = Joi.object({
  title: {
    UZ: Joi.string().required(),
    RU: Joi.string().required(),
  },
  description: {
    UZ: Joi.string().allow(""),
    RU: Joi.string().allow(""),
  },
  image: Joi.string().allow(null),
  parent: Joi.string().required(),
  price: Joi.number().integer().positive().required(),
  unit: Joi.string().valid(UNIT_QUANTITY, UNIT_MASS).required(),
  min_order: Joi.number()
    .positive()
    .multiple(Joi.ref("order_difference"))
    .required(),
  max_order: Joi.number()
    .positive()
    .multiple(Joi.ref("order_difference"))
    .greater(Joi.ref("min_order"))
    .min(1)
    .required(),
  order_difference: Joi.number().valid(0.2, 0.5, 1).required(),
  is_active: Joi.boolean().required(),
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
