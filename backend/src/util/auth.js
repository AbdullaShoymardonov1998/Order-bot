const { SECRET_KEYS } = require("../states");
const jwt = require("jsonwebtoken");
const { logger } = require("../config/logger");

let authFunctions = {
  hash: async (info) => {
    try {
      let token = await jwt.sign(info, SECRET_KEYS.KEY);
      return token;
    } catch (error) {
      logger.error(`Error on hashing token: ${error.message}`);
      throw new Error(error.message);
    }
  },
  decode: async (token) => {
    try {
      let decoded = await jwt.verify(token, SECRET_KEYS.KEY);

      return decoded;
    } catch (error) {
      return null;
    }
  },
};

module.exports = authFunctions;
