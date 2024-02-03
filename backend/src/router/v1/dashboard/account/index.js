const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});
const { STATUS_SUCCESS } = require("../../../../states");
const { accountService } = require("../../../../service/dashboard/account");
const validator = require("./validator");
const router = express.Router();
const hasAccess = require("../middleware");

router.post("/", joi.body(validator.create), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Account created successfully",
      data: await accountService.create(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", joi.body(validator.login), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Login successfully",
      data: await accountService.login(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", hasAccess, async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Account obtained successfully",
      data: await accountService.get(res.locals.accountId),
    });
  } catch (error) {
    next(error);
  }
});

exports.AccountRouter = router;
