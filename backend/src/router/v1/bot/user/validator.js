const Joi = require("joi");
const {
    LANGUAGE_UZ,
    LANGUAGE_RU,
    DEFAULT_STATE,
    ADD_LOCATION
} = require("../../../../states");

const create = Joi.object({
    telegram_id: Joi.number().integer().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow(null),
    language: Joi.string().valid(LANGUAGE_UZ, LANGUAGE_RU).required()
});

const get = Joi.object({
    telegram_id: Joi.number().integer().required()
});

const changeLanguage = Joi.object({
    telegram_id: Joi.number().integer().required(),
    language: Joi.string().valid(LANGUAGE_UZ, LANGUAGE_RU).required()
});

const addToCart = Joi.object({
    telegram_id: Joi.number().integer().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().positive().required()
});

const getCart = Joi.object({
    telegram_id: Joi.number().integer().required()
});

const emptyCart = Joi.object({
    telegram_id: Joi.number().integer().required()
});

const state = Joi.object({
    telegram_id: Joi.number().integer().required(),
    keyboard_state: Joi.string().valid(DEFAULT_STATE, ADD_LOCATION).required()
});

const location = Joi.object({
    telegram_id: Joi.number().integer().required(),
    location: Joi.string().required(),
    keyboard_state: Joi.string().valid(DEFAULT_STATE, ADD_LOCATION).required()
});

module.exports = {
    create,
    get,
    changeLanguage,
    addToCart,
    getCart,
    emptyCart,
    state,
    location
}