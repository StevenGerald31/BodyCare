const express = require("express");
const router = express.Router();
const dashboardController = require("./beranda-controller");

router.get("/dashboard", dashboardController.pageBeranda);

module.exports = router;
