const { WORD, KEYBOARD_STATE } = require("../messages/dictionary");
const { config } = require("../config");
const axios = require("axios");
const menuKeyboard =  require("../keyboards/menu");

module.exports = async (ctx, location) => {
	const { data, status } = await axios({
		method: "POST",
		url: `${config.apiURL}/user/location`,
		validateStatus: false,
		data: {
			telegram_id: ctx.chat.id,
			keyboard_state: KEYBOARD_STATE.DEFAULT,
			location
		}
	})
	
	if (status != 200) {
		throw { response: data, status }
	}
	const language = data.data.language;

	await ctx.reply(WORD[language].MENU, menuKeyboard(language));
}