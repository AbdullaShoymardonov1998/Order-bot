const express = require("express");
const router = express.Router();
const v1 = require("./v1");
const { STATUS_FAILED } = require("../states");

router.use("/v1", v1);

router.use('*', (req, res) => {
    res.status(404).json({
        status: STATUS_FAILED,
        message: "Path does not exist"
    });
});

exports.router = router;