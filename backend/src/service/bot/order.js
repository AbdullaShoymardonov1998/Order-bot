const { orderStorage } = require("../../storage/mongo/bot/order");
const { userStorage } = require("../../storage/mongo/bot/user");
const telegram = require("../../util/telegram");

exports.orderService = {
  create: async (request) => {
    const user = await userStorage.getCart(request.telegram_id);

    if (user.cart.length == 0) {
      throw {
        statusCode: 400,
        message: `User with telegram_id=${request.telegram_id} has empty cart`,
      };
    } else if (user.location.length == 0) {
      throw {
        statusCode: 400,
        message: `User with telegram_id=${request.telegram_id} does not have location`,
      };
    }

    let total = 0;
    let products = [];
    let productsInfo = "";
    user.cart.forEach((cart, index) => {
      total += cart.product_id.price * cart.quantity;
      products.push({
        product_id: cart.product_id._id,
        price: cart.product_id.price,
        quantity: cart.quantity,
        title: cart.title,
      });
      productsInfo += `\n<b>${index + 1}.${
        cart.product_id.title.UZ
      }</b>\n ✨ <i>${cart.product_id.description.UZ} ➖ ${cart.quantity} </i>`;
    });

    request.products = products;
    request.total = total;
    request.location = user.location;

    const newOrder = await orderStorage.create(request);
    await userStorage.emptyCart(request.telegram_id);
    await telegram.sendNotification(
      `🆕 Zakaz \n\nBuyurtmachi: <a href="tg://user?id=${request.telegram_id}"><b>${user.first_name}</b></a>\n\n📍 Manzil: ${request.location}\n\n🛍🛍🛍 \n ${productsInfo} \n \n\n<b>Umumiy: ${request.total} so'm</b>`
    );
    return { user, order: newOrder };
  },
};
