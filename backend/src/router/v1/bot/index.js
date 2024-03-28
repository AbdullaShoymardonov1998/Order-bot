const express = require("express");
const router = express.Router();
const { UserRouter } = require("./user");
const { CategoryRouter } = require("./category");
const { ProductRouter } = require("./product");
const { OrderRouter } = require("./order");
const { VacancyRouter } = require("./vacancy");
const { VideoApprovalRouter } = require("./video");
const { ResumeRouter } = require("./resume");
const { CommentRouter } = require("./comment");

router.use("/user", UserRouter);
router.use("/category", CategoryRouter);
router.use("/product", ProductRouter);
router.use("/order", OrderRouter);
router.use("/vacancy", VacancyRouter);
router.use("/resume", ResumeRouter);
router.use("/video", VideoApprovalRouter);
router.use("/comment", CommentRouter);

module.exports = router;
