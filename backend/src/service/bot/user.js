const { userStorage } = require("../../storage/mongo/bot/user");
const { productStorage } = require("../../storage/mongo/bot/product");

exports.userService = {
  create: async (user) => {
    return await userStorage.create(user);
  },
  getByTelegramId: async (user) => {
    return await userStorage.getByTelegramId(user.telegram_id);
  },
  changeLanguage: async (user) => {
    return await userStorage.changeLanguage(user);
  },
  addToCart: async (cart) => {
    const product = await productStorage.get(cart.product_id);

    return {
      user: await userStorage.addToCart(cart),
      product,
    };
  },
  getCart: async (request) => {
    return await userStorage.getCart(request.telegram_id);
  },
  emptyCart: async (request) => {
    return await userStorage.emptyCart(request.telegram_id);
  },
  keyboardSate: async (request) => {
    return await userStorage.keyboardSate(request);
  },
  location: async (request) => {
    return await userStorage.location(request);
  },
};
