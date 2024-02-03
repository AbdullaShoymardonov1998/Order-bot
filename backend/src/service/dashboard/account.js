const { accountStorage } = require("../../storage/mongo/dashboard/account");

exports.accountService = {
  create: async (account) => {
    return await accountStorage.create(account);
  },
  login: async (account) => {
    return await accountStorage.login(account);
  },
  get: async (id) => {
    return await accountStorage.get(id);
  },
};
