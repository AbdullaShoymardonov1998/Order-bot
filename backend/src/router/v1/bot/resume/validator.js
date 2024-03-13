const Joi = require("joi");
const { TRANSLATOR, MANAGER, ACCOUNTANT } = require("../../../../states");

const create = Joi.object({
  telegram_id: Joi.number().integer().required(),
  fullName: Joi.string().required(),
  about: Joi.string().required(),
  experience: Joi.string().required(),
  skills: Joi.string().required(),
  salary: Joi.string().required(),
  contact: Joi.string().required(),
  category_id: Joi.string().required(),
  status: Joi.string().valid("available", "hired").default("available"),
  canPublish: Joi.boolean().default(true),
});

const get = Joi.object({
  category_id: Joi.string().required(),
});

module.exports = { create, get };
