const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});
const { STATUS_SUCCESS } = require("../../../../states");
const { categoryService } = require("../../../../service/dashboard/category");
const validator = require("./validator");
const router = express.Router();
const hasAccess = require("../middleware");

router.post(
  "/",
  hasAccess,
  joi.body(validator.create),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Category created successfully",
        data: await categoryService.create(req.body),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", hasAccess, async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Category obtained successfully",
      data: await categoryService.getAllMainCategories(),
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  hasAccess,
  joi.params(validator.get),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Category obtained successfully",
        data: await categoryService.getWithSubCategories(req.params.id),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  hasAccess,
  joi.params(validator.update),
  async (req, res, next) => {
    try {
      return res.json({
        status: STATUS_SUCCESS,
        message: "Category updated successfully",
        data: await categoryService.update(req.params.id, req.body),
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
        message: "Category deleted successfully",
        data: await categoryService.delete(req.params.id),
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.CategoryRouter = router;
