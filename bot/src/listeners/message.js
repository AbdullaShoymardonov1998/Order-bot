const { WORD, STATIC, KEYBOARD_STATE } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");

const category = require("../keyboards/category");
const language = require("../keyboards/language");
const cart = require("../keyboards/cart");
const cancelAddLocation = require("../keyboards/cancel_add_location");
const saveLocation = require("../keyboards/save_location");
const confirmOrder = require("../keyboards/confirm_order");

exports.message = async (ctx) => {
    logger.error(JSON.stringify(err, null, 2));
    const msg = ctx.message.text;

    if (msg == WORD.UZ.MENU_KEYBOARD.ORDER || msg == WORD.RU.MENU_KEYBOARD.ORDER) {
        return category(ctx, STATIC.SEND_MESSAGE, 1, null);
    } else if (msg == WORD.UZ.MENU_KEYBOARD.BUSKET || msg == WORD.RU.MENU_KEYBOARD.BUSKET) {
        return cart(ctx, STATIC.SEND_MESSAGE);
    } else if (msg == WORD.UZ.MENU_KEYBOARD.SETTINGS || msg == WORD.RU.MENU_KEYBOARD.SETTINGS) {
        return language(ctx);
    } else if (msg == WORD.UZ.CANCEL_ADD_LOCATION || msg == WORD.RU.CANCEL_ADD_LOCATION) {
        return cancelAddLocation(ctx);
    } else {
        const { data, status } = await axios({
            method: "GET",
            url: `${config.apiURL}/user/get-by-telegram-id`,
            validateStatus: false,
            params: {
                telegram_id: ctx.chat.id
            }
        })
        
        if (status != 200) {
            throw { response: data, status }
        }
        const user = data.data;

        if (user.keyboard_state == KEYBOARD_STATE.ADD_LOCATION) {
            await saveLocation(ctx, msg);
            await confirmOrder(ctx, STATIC.SEND_MESSAGE);
        } else {
            console.log("not keyboard");
        }
    }
}