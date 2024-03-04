const express = require("express");
const router = express.Router();
const { UserRouter } = require("./user");
const { CategoryRouter } = require("./category");
const { ProductRouter } = require("./product");
const { OrderRouter } = require("./order");
const { VacancyRouter } = require("./vacancy");
const { VideoApprovalRouter } = require("./video");

router.use("/user", UserRouter);
router.use("/category", CategoryRouter);
router.use("/product", ProductRouter);
router.use("/order", OrderRouter);
router.use("/vacancy", VacancyRouter);
router.use("/video", VideoApprovalRouter);

module.exports = router;
