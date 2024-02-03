const { KEYBOARD_STATE, WORD } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");
const menu =  require("./menu");

module.exports = async (ctx) => {
	const { data, status } = await axios({
		method: "PATCH",
		url: `${config.apiURL}/user/keyboard`,
		validateStatus: false,
		data: {
			telegram_id: ctx.chat.id,
			keyboard_state: KEYBOARD_STATE.DEFAULT
		}
	})
	
	if (status != 200) {
		throw { response: data, status }
	}
    
    const language = data.data.language;
    await ctx.reply(WORD[language].MENU, menu(language));
}