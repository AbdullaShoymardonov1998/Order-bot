const { User } = require("../../../models/User");
const { TELEGRAM_USER } = require("../../../states");

exports.userStorage = {
  create: async (user) => {
    const existingUser = await User.findOne({
      telegram_id: parseInt(user.telegram_id),
    });
    if (existingUser) {
      throw {
        statusCode: 409,
        message: `User with telegram_id=${user.telegram_id} is already existes`,
        body: existingUser,
      };
    }
    const time = new Date();
    return await User.create({
      telegram_id: parseInt(user.telegram_id),
      first_name: user.first_name,
      last_name: user.last_name || "",
      language: user.language,
      role: TELEGRAM_USER,
      cart: [],
      created_at: time,
      updated_at: time,
    });
  },
  getAllUsers: async () => {
    const allUsers = await User.find();
    return allUsers;
  },
  getByTelegramId: async (id) => {
    const existingUser = await User.findOne({ telegram_id: parseInt(id) });
    if (existingUser == null) {
      throw {
        statusCode: 409,
        message: `User with telegram_id=${id} does not exist`,
      };
    }

    return existingUser;
  },
  changeLanguage: async (user) => {
    const filter = {
      telegram_id: user.telegram_id,
    };
    const update = {
      language: user.language,
      updated_at: new Date(),
    };
    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (updatedUser == null) {
      throw {
        statusCode: 404,
        message: `User with id=${user.telegram_id} does not exist`,
      };
    }

    return updatedUser;
  },
  addToCart: async (request) => {
    const filter = {
      telegram_id: request.telegram_id,
    };
    const newProduct = {
      product_id: request.product_id,
      quantity: request.quantity,
      size_id: request.size_id,
      color_id: request.color_id,
    };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      {
        $push: {
          cart: newProduct,
        },
      },
      {
        new: true,
      }
    );
    if (updatedUser == null) {
      throw {
        statusCode: 404,
        message: `User with id=${request.telegram_id} does not exist`,
      };
    }
    return updatedUser;
  },
  getCart: async (id) => {
    const existingUser = await User.findOne({
      telegram_id: parseInt(id),
    }).populate({ model: "Product", path: "cart.product_id" });
    if (existingUser == null) {
      throw {
        statusCode: 409,
        message: `User with telegram_id=${id} does not exist`,
      };
    }

    return existingUser;
  },
  emptyCart: async (telegram_id) => {
    const filter = { telegram_id };
    const update = {
      cart: [],
    };
    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (updatedUser == null) {
      throw {
        statusCode: 404,
        message: `User with id=${telegram_id} does not exist`,
      };
    }

    return updatedUser;
  },
  keyboardSate: async (request) => {
    const filter = { telegram_id: request.telegram_id };
    const update = {
      keyboard_state: request.keyboard_state,
    };
    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (updatedUser == null) {
      throw {
        statusCode: 404,
        message: `User with id=${request.telegram_id} does not exist`,
      };
    }

    return updatedUser;
  },
  location: async (request) => {
    const filter = { telegram_id: request.telegram_id };
    const update = {
      location: request.location,
      keyboard_state: request.keyboard_state,
    };
    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    }).populate({ model: "Product", path: "cart.product_id" });

    if (updatedUser == null) {
      throw {
        statusCode: 404,
        message: `User with id=${request.telegram_id} does not exist`,
      };
    }

    return updatedUser;
  },
};
