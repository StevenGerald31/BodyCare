const express = require("express");
const router = express.Router();
const berandaRouter = require("../modules/beranda-modules/beranda-router");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/web", berandaRouter);

module.exports = router;
