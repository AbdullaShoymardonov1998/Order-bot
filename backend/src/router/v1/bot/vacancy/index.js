const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const validator = require("./validator");
const { vacancyService } = require("../../../../service/bot/vacancy");

const router = express.Router();

router.post("/create", joi.body(validator.create), async (req, res, next) => {
  try {
    const result = await vacancyService.create(req.body);

    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancy created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await vacancyService.getVacancyById(req.params.id);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancy fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await vacancyService.getAllVacancies();
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancies fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

exports.VacancyRouter = router;
