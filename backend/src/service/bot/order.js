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
    let color;
    let size;
    let products = [];
    let productsInfo = "";
    function findNameById(data, id) {
      for (const item of data) {
        const itemId = item._id.toString();
        if (itemId === id) {
          return item.name;
        }
      }
      return null;
    }
    user.cart.forEach((cart, index) => {
      total += cart.product_id.price * cart.quantity;
      color = findNameById(cart.product_id.colors, cart.color_id);
      size = findNameById(cart.product_id.sizes, cart.size_id);

      products.push({
        title: cart.product_id.title.UZ,
        product_id: cart.product_id._id,
        price: cart.product_id.price,
        quantity: cart.quantity,
        color,
        size,
      });
      productsInfo += `\n<b>${index + 1}</b> - mahsulot\n\n<b><i>${
        cart.product_id.title.UZ
      }(${color} , ${size})  -  <u>${cart.quantity} ta</u></i></b>\n\n`;
    });

    request.products = products;
    request.total = total;
    request.location = user.location;

    const newOrder = await orderStorage.create(request);
    await userStorage.emptyCart(request.telegram_id);
    await telegram.sendNotification(
      `🆕 Zakaz \n\nBuyurtmachi: <a href="tg://user?id=${request.telegram_id}"><b>${user.first_name}</b></a>\n\n📍 Manzil: ${request.location}\n\n🛍🛍🛍 \n ${productsInfo}\n\n<b><u><i>Umumiy: ${request.total} so'm</i></u></b>`
    );
    return { user, order: newOrder };
  },
};
