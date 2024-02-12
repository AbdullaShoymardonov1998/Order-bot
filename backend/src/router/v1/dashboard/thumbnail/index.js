const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});
const { STATUS_SUCCESS } = require("../../../../states");
const { thumbnailService } = require("../../../../service/dashboard/thumbnail");
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
        message: "Thumbnail created successfully",
        data: await thumbnailService.create(req.body),
      });
    } catch (error) {
      next(error);
    }
  }
);

exports.ThumbnailRouter = router;
