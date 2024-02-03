const Joi = require("joi");

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
  parent: Joi.string().allow(null),
});

const update = Joi.object({
  id: Joi.string().required(),
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
});

const get = Joi.object({
  id: Joi.string().required(),
});

const remove = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  create,
  update,
  get,
  delete: remove,
};
