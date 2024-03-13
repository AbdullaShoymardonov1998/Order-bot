const { WORD } = require("../messages/dictionary");

module.exports = (userLanguage, ctx) => {
  const commonButtons = [
    [
      WORD[userLanguage].MENU_KEYBOARD.ORDER,
      WORD[userLanguage].MENU_KEYBOARD.BUSKET,
      WORD[userLanguage].MENU_KEYBOARD.SETTINGS,
    ],
    [
      WORD[userLanguage].MENU_KEYBOARD.SEND_VIDEO,
      WORD[userLanguage].MENU_KEYBOARD.VACANCY,
      // WORD[userLanguage].MENU_KEYBOARD.RESUME,
    ],
  ];

  return {
    reply_markup: {
      resize_keyboard: true,
      keyboard: commonButtons,
    },
  };
};
