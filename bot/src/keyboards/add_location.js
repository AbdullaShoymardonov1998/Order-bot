const { WORD, KEYBOARD_STATE } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");

module.exports = async (ctx) => {
	const { data, status } = await axios({
		method: "PATCH",
		url: `${config.apiURL}/user/keyboard`,
		validateStatus: false,
		data: {
			telegram_id: ctx.chat.id,
			keyboard_state: KEYBOARD_STATE.ADD_LOCATION
		}
	})
	
	if (status != 200) {
		throw { response: data, status }
	}
    
	const user = data.data;
	const language = user.language;

    await ctx.editMessageText(WORD[language].LOCATION_EXAMPLE, { parse_mode: "HTML" });
    await ctx.reply("✏️✏️✏️", {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [
                    WORD[language].CANCEL_ADD_LOCATION
                ]
            ]
        }
    });
}