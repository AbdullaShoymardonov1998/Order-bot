const { categoryStorage } = require("../../storage/mongo/bot/category");
const { userStorage } = require("../../storage/mongo/bot/user");

exports.categoryService = {
    find: async(request) => {
        return {
            user: await userStorage.getByTelegramId(request.telegram_id),
            category: await categoryStorage.find(request)
        };
    }
}