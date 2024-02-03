const express = require("express");
const router = express.Router();
const { CategoryRouter } = require("./category");
const { ProductRouter } = require("./product");
const { AccountRouter } = require("./account")

router.use("/account", AccountRouter);
router.use("/category", CategoryRouter);
router.use("/product", ProductRouter);

module.exports = router;