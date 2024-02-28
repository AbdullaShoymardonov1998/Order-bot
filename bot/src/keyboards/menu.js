const { WORD } = require("../messages/dictionary");

module.exports = (userLanguage, ctx) => {
  const commonButtons = [
    WORD[userLanguage].MENU_KEYBOARD.ORDER,
    WORD[userLanguage].MENU_KEYBOARD.BUSKET,
    WORD[userLanguage].MENU_KEYBOARD.SETTINGS,
  ];
  let inline_keyboard;
  if (ctx.update.message?.from?.id === 540277582) {
    inline_keyboard = [
      commonButtons,
      [WORD[userLanguage].MENU_KEYBOARD.SEND_VIDEO],
    ];
  } else {
    inline_keyboard = [commonButtons];
  }
  return {
    reply_markup: {
      resize_keyboard: true,
      keyboard: inline_keyboard,
    },
  };
};
