const { WORD } = require("../messages/dictionary");

module.exports = (userLanguage) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [
                    WORD[userLanguage].MENU_KEYBOARD.ORDER,
                    WORD[userLanguage].MENU_KEYBOARD.BUSKET,
                    WORD[userLanguage].MENU_KEYBOARD.SETTINGS
                ]
            ]
        }
    }
}