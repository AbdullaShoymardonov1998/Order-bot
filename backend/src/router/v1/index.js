const express = require("express");
const router = express.Router();
const bot = require("./bot");
const dashboard = require("./dashboard");

router.use("/bot", bot);
router.use("/dashboard", dashboard);

module.exports = router;