const Joi = require("joi");
const { TRANSLATOR, MANAGER, ACCOUNTANT } = require("../../../../states");

const create = Joi.object({
  telegram_id: Joi.number().integer().required(),
  fullName: Joi.string().required(),
  profession: Joi.string().required(),
  about: Joi.string().required(),
  experience: Joi.string().required(),
  skills: Joi.string().required(),
  salary: Joi.string().required(),
  contact: Joi.string().required(),
  resume: {
    file_id: Joi.string().required(),
    file_name: Joi.string(),
    mime_type: Joi.string(),
  },
  category_id: Joi.string().required(),
  message_id: Joi.number(),
  status: Joi.string().valid("available", "hired").default("available"),
  canPublish: Joi.boolean().default(true),
});

const get = Joi.object({
  category_id: Joi.string().required(),
});

module.exports = { create, get };
