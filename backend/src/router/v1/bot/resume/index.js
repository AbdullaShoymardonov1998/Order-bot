const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const validator = require("./validator");
const { resumeService } = require("../../../../service/bot/resume");

const router = express.Router();

router.post("/create", joi.body(validator.create), async (req, res, next) => {
  try {
    const result = await resumeService.create(req.body);

    return res.status(201).json({
      status: STATUS_SUCCESS,
      message: "Resume created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/find", async (req, res, next) => {
  try {
    const result = await resumeService.find(req.body);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Resumes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/category", joi.query(validator.get), async (req, res, next) => {
  try {
    const result = await resumeService.getResumeByCategory(
      req.query.category_id
    );
    return res.json({
      status: STATUS_SUCCESS,
      message: "Resumes by category fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/single", async (req, res, next) => {
  try {
    const result = await resumeService.getResumeById(req.query.resume_id);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancy fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const result = await resumeService.getResumeByUserId(req.query);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancy by user ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

exports.ResumeRouter = router;
