const Joi = require("joi");

const create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  create,
  login,
};
