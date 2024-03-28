const Joi = require("joi");

const create = Joi.object({
  telegram_id: Joi.number().integer().required(),
  comment: Joi.string().required(),
  product_id: Joi.string().optional(),
  video_id: Joi.string().optional(),
  resume_id: Joi.string().optional(),
  vacancy_id: Joi.string().optional(),
});

module.exports = { create };
