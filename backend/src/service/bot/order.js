const { orderStorage } = require("../../storage/mongo/bot/order");
const { userStorage } = require("../../storage/mongo/bot/user");
const {
  underwearIds,
  sleepwearIds,
  blanketIds,
  socksId,
} = require("../../util/const");
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
    function findNameById(data, id) {
      for (const item of data) {
        const itemId = item._id.toString();
        if (itemId === id) {
          return item.name;
        }
      }
      return null;
    }

    for (let index = 0; index < user.cart.length; index++) {
      const cart = user.cart[index];
      const quantity = parseInt(cart.quantity);
      const isUnderwear = underwearIds.includes(cart.product_id.parent);
      const isSleepwear = sleepwearIds.includes(cart.product_id.parent);
      const isBlanket = blanketIds.includes(cart.product_id.parent);
      const isSocks = socksId.includes(cart.product_id.parent);

      let unit = 1.5;
      if (isUnderwear && quantity >= 12) {
        unit = 1.0;
      } else if (isUnderwear && quantity >= 6 && quantity < 12) {
        unit = 1.1;
      } else if (isSleepwear && quantity >= 6) {
        unit = 1.0;
      } else if (isSleepwear && quantity > 2 && quantity < 6) {
        unit = 1.1;
      } else if (isSocks && quantity >= 24) {
        unit = 1.0;
      } else if (isSocks && quantity >= 12 && quantity < 24) {
        unit = 1.1;
      } else if (isBlanket && quantity >= 5) {
        unit = 1.0;
      } else if (isBlanket && quantity > 2 && quantity < 5) {
        unit = 1.1;
      } else if (quantity >= 10) {
        unit = 1.0;
      } else if (quantity >= 5 && quantity <= 10) {
        unit = 1.1;
      }
      const productFinalPrice = cart.product_id.price * unit;
      total += productFinalPrice * cart.quantity;
      const color = findNameById(cart.product_id.colors, cart.color_id);
      const size = findNameById(cart.product_id.sizes, cart.size_id);

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
    }

    request.products = products;
    request.total = total;
    request.location = user.location;

    const newOrder = await orderStorage.create(request);
    await userStorage.emptyCart(request.telegram_id);
    await telegram.sendNotification(
      `🆕 Zakaz \n\nBuyurtmachi: <a href="tg://user?id=${
        request.telegram_id
      }"><b>${user.first_name}</b></a>\n\n📍 Manzil: ${
        request.location
      }\n\n🛍🛍🛍 \n ${productsInfo}\n\n<b><u><i>Umumiy: ${request.total
        .toLocaleString()
        .replace(",", " ")} so'm</i></u></b>`
    );
    return { user, order: newOrder };
  },
};
