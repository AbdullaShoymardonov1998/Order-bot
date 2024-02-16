const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const { productService } = require("../../../../service/bot/product");
const validator = require("./validator");

const router = express.Router();

router.post("/find", joi.body(validator.find), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Product list obtained successfully",
      data: await productService.find(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/get", joi.query(validator.get), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Product obtained successfully",
      data: await productService.get(req.query),
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-color-id",
  joi.query(validator.get),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product with colorid obtained successfully",
        data: await productService.getByColorId(req.query),
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.ProductRouter = router;
