const express = require("express");
const joi = require("express-joi-validation").createValidator({});
const { STATUS_SUCCESS } = require("../../../../states");
const validator = require("./validator");
const { videoApprovalService } = require("../../../../service/bot/video");

const router = express.Router();

router.post(
  "/create",
  joi.body(validator.createVideoApproval),
  async (req, res, next) => {
    try {
      const result = await videoApprovalService.create(req.body);

      return res.json({
        status: STATUS_SUCCESS,
        message: "Video approval created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-by-video-id", async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Video approval fetched successfully",
      data: await videoApprovalService.getVideoApprovalById(req.query),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/get-by-file-id", async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Video approval fetched successfully",
      data: await videoApprovalService.getVideoApprovalByFileId(req.query),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await videoApprovalService.getAllVideoApprovals();
    return res.json({
      status: STATUS_SUCCESS,
      message: "Video approvals fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const result = await videoApprovalService.getVideoApprovalsByUserId(
      req.query
    );
    return res.json({
      status: STATUS_SUCCESS,
      message: "Video approvals for user fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/delete-by-file-id", async (req, res, next) => {
  const result = await videoApprovalService.deleteVideoByFileId(req.query);
  return res.json({
    status: STATUS_SUCCESS,
    message: "Video deleted successfully",
    data: result,
  });
});

exports.VideoApprovalRouter = router;
