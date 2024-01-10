const express = require("express");
const router = express.Router();
const dashboardController = require("./beranda-controller");

const ontology = require("./beranda-controller");

router.get("/dashboard", dashboardController.pageBeranda);
router.get("/ontology-data", ontology.getDataFromOntology);
router.get("/login", dashboardController.pageLogin);
router.get("/admin", dashboardController.pageAdmin);

module.exports = router;
