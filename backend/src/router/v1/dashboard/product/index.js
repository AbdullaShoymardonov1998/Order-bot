const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});
const { STATUS_SUCCESS } = require("../../../../states");
const { productService } = require("../../../../service/dashboard/product");
const validator = require("./validator");
const router = express.Router();
const hasAccess = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  hasAccess,
  upload.single("image"),
  joi.body(validator.create),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product created successfully",
        data: await productService.create(req.body, req.file),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  hasAccess,
  joi.query(validator.getAll),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Products obtained successfully",
        data: await productService.getAll(req.query.page),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  hasAccess,
  joi.params(validator.get),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product obtained successfully",
        data: await productService.get(req.params.id),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  hasAccess,
  joi.params(validator.delete),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product deleted successfully",
        data: await productService.delete(req.params.id),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  upload.single("image"),
  hasAccess,
  joi.body(validator.update),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product updated successfully",
        data: await productService.update(req.params.id, req.body, req.file),
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.ProductRouter = router;
