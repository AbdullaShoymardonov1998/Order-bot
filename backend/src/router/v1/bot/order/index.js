const express = require("express");
const joi = require("express-joi-validation").createValidator({passError: true});

const { STATUS_SUCCESS } = require("../../../../states");
const { orderService } = require("../../../../service/bot/order");
const validator = require("./validator");

const router = express.Router();

router.post("/", joi.body(validator.create), async (req, res, next) => {
    try {
        return res.json({
            status: STATUS_SUCCESS,
            message: "Order created successfully",
            data: await orderService.create(req.body)
        });
    } catch (error) {
        next(error);
    }
});

exports.OrderRouter = router;