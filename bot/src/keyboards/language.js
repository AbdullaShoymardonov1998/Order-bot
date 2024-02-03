const axios = require("axios");
const { config } =require("../config");
const { STATE, STATIC, WORD } = require("../messages/dictionary");

module.exports = async (ctx) => {
	const { status, data } = await axios({
		method: "GET",
		url: `${config.apiURL}/user/get-by-telegram-id`,
		validateStatus: false,
		params: {
			telegram_id: ctx.message.from.id
		}
	});

	if (status != 200) {
		throw {
			response: data,
			status
		};
	}

	return await ctx.reply(WORD.GENERAL.SELECT_LANGUAGE, {
		reply_markup: {
			inline_keyboard: [
			[
				{
				text: WORD.UZ.LANGUAGE,
				callback_data: JSON.stringify({
					a: STATE.CHANGE_LANGUAGE,
					language: STATIC.LANGUAGE_UZ
				})
				},
				{
				text: WORD.RU.LANGUAGE,
				callback_data: JSON.stringify({
					a: STATE.CHANGE_LANGUAGE,
					language: STATIC.LANGUAGE_RU
				})
				}
			]
			]
		}
	});
}