const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");

module.exports = async (ctx) => {
	const { data, status } = await axios({
		method: "DELETE",
		url: `${config.apiURL}/user/cart`,
		validateStatus: false,
		params: {
			telegram_id: parseInt(ctx.chat.id)
		}
	});

	if (status != 200) {
		throw {
			response: data,
			status
		}
	}
	const user = data.data;
	const language = user.language;

    await ctx.editMessageText(`${WORD[language].EMPTY_FINISHED}`, await cartListKeyboard(language));
}

async function cartListKeyboard(language) {
	const navigation = [
		[{
			text: WORD[language].CONTINUE_SHOPPING,
			callback_data: JSON.stringify({
				a: STATE.CATEGORY,
				n:  1,
				p: null,
			})
		}]
    ];

    return {
        reply_markup: {
			inline_keyboard: navigation
		},
		parse_mode: "HTML"
    }
}