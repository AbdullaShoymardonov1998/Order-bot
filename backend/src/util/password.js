const { SALT } = require("../states");
const bcrypt = require("bcryptjs");
const { logger } = require("../config/logger");

let passwordFunctions = {
  hash: async (password) => {
    try {
      let hashedPassword = await bcrypt.hash(password, SALT.ROUND);
      return hashedPassword;
    } catch (error) {
      logger.error("Error on hashing the password:", error.message);
      throw new Error(error.message);
    }
  },
  check: async (req) => {
    try {
      let isCorrect = await bcrypt.compare(req.password, req.hashed);
      return isCorrect;
    } catch (error) {
      logger.error("Error on checking the password:", error.message);
      throw new Error(error.message);
    }
  },
};

module.exports = passwordFunctions;
