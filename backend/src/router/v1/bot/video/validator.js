const Joi = require("joi");

const createVideoApproval = Joi.object({
  telegram_id: Joi.number().integer().required(),
  file_id: Joi.string().required(),
  message_id: Joi.number().integer().required(),
});

module.exports = { createVideoApproval };
