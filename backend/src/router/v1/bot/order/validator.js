const Joi = require("joi");

const create = Joi.object({
    telegram_id: Joi.number().integer().required()
});

module.exports = {
    create
}