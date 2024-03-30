const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const validator = require("./validator");
const { commentService } = require("../../../../service/bot/comment");

const router = express.Router();

router.post("/", joi.body(validator.create), async (req, res, next) => {
  try {
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment created successfully",
      data: await commentService.create(req.body),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await commentService.getAll();
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comments fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/single", async (req, res, next) => {
  try {
    const result = await commentService.getCommentById(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comments fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const result = await commentService.getCommentByUserId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment by user ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/product", async (req, res, next) => {
  try {
    const result = await commentService.getCommentByProductId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment by product ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/video", async (req, res, next) => {
  try {
    const result = await commentService.getCommentByVideoId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment by video ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/videos-comments", async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByVideoIds();
    return res.json({
      status: STATUS_SUCCESS,
      message: "Video comments fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/resume", async (req, res, next) => {
  try {
    const result = await commentService.getCommentByResumeId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment by resume ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/vacancy", async (req, res, next) => {
  try {
    const result = await commentService.getCommentByVacancyId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Comment by vacancy ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
exports.CommentRouter = router;
