const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});
const { STATUS_SUCCESS } = require("../../../../states");
const { productService } = require("../../../../service/dashboard/product");
const validator = require("./validator");
const router = express.Router();
const hasAccess = require("../middleware");

// Create a new product
router.post(
  "/",
  hasAccess,
  joi.body(validator.create),
  async (req, res, next) => {
    try {
      const product = await productService.create(req.body);
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all products with pagination
router.get(
  "/",
  hasAccess,
  joi.query(validator.getAll),
  async (req, res, next) => {
    try {
      const products = await productService.getAll(req.query.page);
      return res.json({
        status: STATUS_SUCCESS,
        message: "Products obtained successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get a single product by ID
router.get(
  "/:id",
  hasAccess,
  joi.params(validator.get),
  async (req, res, next) => {
    try {
      const product = await productService.get(req.params.id);
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product obtained successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a product by ID
router.delete(
  "/:id",
  hasAccess,
  joi.params(validator.delete),
  async (req, res, next) => {
    try {
      await productService.delete(req.params.id);
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product deleted successfully",
        data: null, // Or provide some identifier if needed
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update a product by ID
router.put(
  "/:id",
  hasAccess,
  joi.body(validator.update),
  async (req, res, next) => {
    try {
      const updatedProduct = await productService.update(
        req.params.id,
        req.body
      );
      return res.json({
        status: STATUS_SUCCESS,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.ProductRouter = router;
