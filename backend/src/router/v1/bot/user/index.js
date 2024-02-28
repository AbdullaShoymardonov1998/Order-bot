const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const { userService } = require("../../../../service/bot/user");
const validator = require("./validator");

const router = express.Router();

router.post("/create", joi.body(validator.create), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "User created successfully",
      data: await userService.create(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "All users obtained successfully",
      data: await userService.getAllTelegramUsers(),
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-by-telegram-id",
  joi.query(validator.get),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "User obtained successfully",
        data: await userService.getByTelegramId(req.query),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/language",
  joi.body(validator.changeLanguage),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "User language changed successfully",
        data: await userService.changeLanguage(req.body),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/cart", joi.body(validator.addToCart), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "User cart added successfully",
      data: await userService.addToCart(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/cart", joi.query(validator.getCart), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "User cart obtained successfully",
      data: await userService.getCart(req.query),
    });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/cart",
  joi.query(validator.emptyCart),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "User cart cleared successfully",
        data: await userService.emptyCart(req.query),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/keyboard", joi.body(validator.state), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "User keyboard state changed successfully",
      data: await userService.keyboardSate(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/location",
  joi.body(validator.location),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "User location changed successfully",
        data: await userService.location(req.body),
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.UserRouter = router;
