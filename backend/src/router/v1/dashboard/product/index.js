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

// Create a new product
router.post(
  "/",
  hasAccess,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  joi.body(validator.create),
  async (req, res, next) => {
    try {
      const productData = { ...req.body };

      // Process main product image
      if (req.files && req.files["image"] && req.files["image"][0]) {
        productData.image = req.files["image"][0].path;
      }

      // Process thumbnail image
      if (req.files && req.files["thumbnail"] && req.files["thumbnail"][0]) {
        productData.thumbnail = req.files["thumbnail"][0].path;
      }

      // Process colors
      if (req.body.colors && req.body.colors.length > 0) {
        productData.colors = req.body.colors.map((color) => {
          const colorWithPicture = { ...color };

          // if (color.picture) {
          //   // Upload the color picture and update the path
          //   const picturePath = req.file.path;
          //   colorWithPicture.picture = picturePath;
          // }

          return colorWithPicture;
        });
      }

      // Process sizes
      if (req.body.sizes && req.body.sizes.length > 0) {
        productData.sizes = req.body.sizes;
      }

      const product = await productService.create(productData);
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
  upload.single("image"), // For handling the main image update
  hasAccess,
  joi.body(validator.update),
  async (req, res, next) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = req.file.path; // Adjust based on your file handling
      }
      const updatedProduct = await productService.update(
        req.params.id,
        updateData
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
