const { STATE, WORD } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");

module.exports = async (ctx) => {
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
	const language = user.language;

    let info = `${WORD[language].SELECT_LOCATION}`;

    const keyboard = [
        [{
            text: WORD[language].ENTER_NEW_LOCATION,
            callback_data: JSON.stringify({
                a: STATE.ADD_LOCATION
            })
        }],
        [{
            text: WORD[language].CANCEL_ADD_LOCATION,
            callback_data: JSON.stringify({
                a: STATE.CART
            })
        }]
    ];

    if (user.location.length > 0) {
        info += `\n\n<b>${WORD[language].LOCATION}</b>:\n${user.location}`;

        keyboard.unshift(
            [{
                text: WORD[language].CONTINUE_CURRENT_LOCATION,
                callback_data: JSON.stringify({
                    a: STATE.CONFIRM_ORDER
                })
            }]
        )
    }

    if (user.cart.length > 0) {
        await ctx.editMessageText(info, {
            reply_markup: {
                inline_keyboard: keyboard
            },
            parse_mode: "HTML"
        })
    } else {
        await ctx.editMessageText(WORD[language].YOU_HAVE_EMPTY_CART, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: WORD[language].CONTINUE_SHOPPING,
                        callback_data: JSON.stringify({
                            a: STATE.CATEGORY,
                            n:  1,
                            p: null
                        })
                    }]
                ]
            }
        });
    }
}