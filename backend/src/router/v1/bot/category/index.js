const express = require("express");
const joi = require("express-joi-validation").createValidator({passError: true});

const { STATUS_SUCCESS } = require("../../../../states");
const { categoryService } = require("../../../../service/bot/category");
const validator = require("./validator");

const router = express.Router();

router.post("/find", joi.body(validator.find), async (req, res, next) => {
    try {
        return res.json({
            status: STATUS_SUCCESS,
            message: "Category obtained successfully",
            data: await categoryService.find(req.body)
        });
    } catch (error) {
        next(error);
    }
});

exports.CategoryRouter = router;