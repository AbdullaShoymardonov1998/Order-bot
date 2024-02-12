const Joi = require("joi");

const create = Joi.object({
  picture: {
    uuid: Joi.string().allow(null),
  },
  products: Joi.array().items(Joi.string()),
});

module.exports = {
  create,
};
