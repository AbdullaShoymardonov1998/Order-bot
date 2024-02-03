const { Account } = require("../../../models/Account");
const passwordFunctions = require("../../../util/password");
const authFunctions = require("../../../util/auth");
const { logger } = require("../../../config/logger");
const { TOKEN_HOUR } = require("../../../states");

const time = {
  minut: 60,
  hour: 60,
};

exports.accountStorage = {
  create: async (account) => {
    try {
      if (!account.username || !account.password) {
        throw new Error("Username is required");
      }

      const existingAccount = await Account.findOne({
        username: account.username,
      });

      if (existingAccount) throw new Error("Username is taken");

      account.password = await passwordFunctions.hash(account.password);
      const result = await Account.create(account);

      return result;
    } catch (error) {
      logger.error(`Create account: ${error.message}, ${error.stack}`);
      throw error;
    }
  },
  login: async (body) => {
    try {
      if (!body.username || !body.password) {
        throw new Error("Username is required");
      }
      const user = await Account.findOne({ username: body.username });

      if (!user) throw new Error("Username or password is incorrect");

      let isPasswordCorrect = await passwordFunctions.check({
        password: body.password,
        hashed: user.password,
      });

      if (!isPasswordCorrect)
        throw new Error("Username or password is incorrect");

      const jwt = {
        accountId: user.id,
        iat: Math.floor(Date.now() / 1000),
        exp:
          Math.floor(Date.now() / 1000) +
          time.minut * time.hour * TOKEN_HOUR.ACCESS_TOKEN,
      };

      return {
        token: await authFunctions.hash(jwt),
      };
    } catch (error) {
      logger.error(`Login: ${error.message}, ${error.stack}`);
      throw error;
    }
  },
  get: async (id) => {
    try {
      const account = Account.findById(id);
      if (!account) throw new Error("Account not found");
      delete account.password;

      return account;
    } catch (error) {
      logger.error(`Get account by Id: ${error.message}, ${error.stack}`);
      throw error;
    }
  },
};
