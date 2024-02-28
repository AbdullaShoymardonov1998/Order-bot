const axios = require("axios");
const { config } =require("../config");
const { WORD } = require("../messages/dictionary");
const menuKeyboard =  require("./menu");

module.exports = async (ctx, language) => {
    const response = await axios({
        method: "PATCH",
        url: `${config.apiURL}/user/language`,
        validateStatus: false,
        data: {
            telegram_id: parseInt(ctx.chat.id),
            language: language
        }
    });

    if (response.status != 200 ){
        throw {
            response: response.data,
            status: response.status
        };
    }

    await ctx.editMessageText(WORD[language].SAVED);
    await ctx.reply(WORD[language].MENU, menuKeyboard(language, ctx));
}