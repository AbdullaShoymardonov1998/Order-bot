const { productStorage } = require("../../storage/mongo/bot/product");
const { userStorage } = require("../../storage/mongo/bot/user");

exports.productService = {
  find: async (filter) => {
    let user = null;
    if (filter.telegram_id) {
      user = await userStorage.getByTelegramId(filter.telegram_id);
    }
    return {
      user,
      product: await productStorage.find(filter),
    };
  },
  get: async (query) => {
    return {
      user: await userStorage.getByTelegramId(query.telegram_id),
      product: await productStorage.get(query.id),
    };
  },
};
