const Joi = require("joi");

const find = Joi.object({
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
    parent: Joi.string().allow(null),
    telegram_id: Joi.number().integer().required()
});

module.exports = { find }