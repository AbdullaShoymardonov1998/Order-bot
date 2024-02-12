const express = require("express");
const router = express.Router();
const { CategoryRouter } = require("./category");
const { ProductRouter } = require("./product");
const { AccountRouter } = require("./account");
const { PictureRouter } = require("./picture");
const { ThumbnailRouter } = require("./thumbnail");

router.use("/account", AccountRouter);
router.use("/category", CategoryRouter);
router.use("/product", ProductRouter);
router.use("/picture", PictureRouter);
router.use("/thumbnail", ThumbnailRouter);

module.exports = router;
