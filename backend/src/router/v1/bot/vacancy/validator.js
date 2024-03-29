const Joi = require("joi");
const { TRANSLATOR, MANAGER, ACCOUNTANT } = require("../../../../states");

const create = Joi.object({
  telegram_id: Joi.number().integer().required(),
  title: Joi.string().required(),
  company: Joi.string().required(),
  responsibility: Joi.string().required(),
  requirement: Joi.string().required(),
  salary: Joi.string().required(),
  contact: Joi.string().required(),
  category_id: Joi.string().required(),
  status: Joi.string().valid("open", "closed").default("open"),
  canPublish: Joi.boolean().default(true),
});

const get = Joi.object({
  category_id: Joi.string().required(),
});
const categoryCreate = Joi.object({
  title: Joi.string().required(),
});

module.exports = { create, get, categoryCreate };
