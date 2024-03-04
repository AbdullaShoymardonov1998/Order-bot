const Joi = require("joi");

const create = Joi.object({
  telegram_id: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  salary: Joi.string().required(),
  contact: Joi.string().required(),
  status: Joi.string().valid("open", "closed").default("open"),
  canPublish: Joi.boolean().default(true),
});

module.exports = { create };
