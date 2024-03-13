const express = require("express");
const joi = require("express-joi-validation").createValidator({
  passError: true,
});

const { STATUS_SUCCESS } = require("../../../../states");
const validator = require("./validator");
const { vacancyService } = require("../../../../service/bot/vacancy");
const {
  vacancyCategoryService,
} = require("../../../../service/bot/vacancy_category");

const router = express.Router();

router.post("/create", joi.body(validator.create), async (req, res, next) => {
  try {
    const result = await vacancyService.create(req.body);

    return res.status(201).json({
      status: STATUS_SUCCESS,
      message: "Vacancy created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/find", async (req, res, next) => {
  try {
    const result = await vacancyService.find(req.body);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancies fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/category", joi.query(validator.get), async (req, res, next) => {
  try {
    const result = await vacancyService.getVacanciesByCategory(
      req.query.category_id
    );
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancies by category fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/single", async (req, res, next) => {
  try {
    const result = await vacancyService.getVacancyById(req.query.vacancy_id);
    return res.json({
      status: STATUS_SUCCESS,
      message: "Vacancy fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/category",
  joi.body(validator.categoryCreate),
  async (req, res, next) => {
    try {
      const result = await vacancyCategoryService.create(req.body);

      return res.status(201).json({
        message: "Category created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/category/all", async (req, res, next) => {
  try {
    const result = await vacancyCategoryService.getAllCategories();
    return res.json({
      status: STATUS_SUCCESS,
      message: "Categories fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

exports.VacancyRouter = router;
