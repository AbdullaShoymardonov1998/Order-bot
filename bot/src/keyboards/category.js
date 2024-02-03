const { STATE, STATIC, WORD } = require("../messages/dictionary");
const { config } =require("../config");
const axios = require("axios");

module.exports = async (ctx, messageType, page, parent) => {
	const { data, status } = await axios({
		method: "POST",
		url: `${config.apiURL}/category/find`,
		validateStatus: false,
		data: {
			parent,
			page,
			limit: STATIC.LIMIT,
			telegram_id: parseInt(ctx.chat.id)
		}
	});

	if (status != 200) {
		throw {
			response: data,
			status
		}
	}
	const user = data.data.user;
	const category = data.data.category;

	switch (messageType) {
		case STATIC.SEND_MESSAGE:
			await ctx.reply(WORD[user.language].SELECT_CATEGORY, await categoryKeyboard(category, page, parent, user.language, user.cart.length));
			break;
		case STATIC.EDIT_MESSAGE:
			await ctx.editMessageText(WORD[user.language].SELECT_CATEGORY, await categoryKeyboard(category, page, parent, user.language, user.cart.length));
			break;
		default:
	}
}

async function categoryKeyboard(response, page, parent, language, productTotalInCart) {
	let itemParent = null;

	const category = response.list.map((value, index) => {
		let number = index + 1;
		if (page > 1) {
			number += (page - 1) * STATIC.LIMIT;
		}
		if (value.parent && value.parent.parent) {
			itemParent = value.parent.parent;
		}
		let state = STATE.CATEGORY;
		if (parent) state = STATE.PRODUCT;
		return [{
			text: `${number}. ${value.title[language]}`,
			callback_data: JSON.stringify({
				a: state,
				p: value._id,
				n: 1
			})
		}]
	});

	if (parent) {
		category.push(
			[{
				text: WORD[language].BACK,
				callback_data: JSON.stringify({
					a: STATE.CATEGORY,
					p: itemParent,
					n: 1
				})
			}]
		)
	} else {
		category.push(
			[{
				text: `${WORD[language].GO_TO_CART} (${productTotalInCart})`,
				callback_data: JSON.stringify({
					a: STATE.CART
				})
			}]
		)
	}
	const navigation = [];

	if (page != 1) {
		navigation.push(
			{
				text: WORD.GENERAL.PREVIOUS,
				callback_data: JSON.stringify({
					a: STATE.CATEGORY,
					p: parent,
					n: page - 1
				})
			}
		)
	}

	if (page < response.total_pages) {
		navigation.push(
			{
				text: WORD.GENERAL.NEXT,
				callback_data: JSON.stringify({
					a: STATE.CATEGORY,
					p: parent,
					n: page + 1
				})
			}
		)
	}
	
	if (response.total_pages != 1) {
		category.push(navigation);
	}

    return {
        reply_markup: { inline_keyboard: category }
    }
}