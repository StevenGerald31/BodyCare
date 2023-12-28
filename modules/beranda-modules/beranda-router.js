const express = require("express");
const router = express.Router();
const dashboardController = require("./beranda-controller");
const tes = require("./tes-controller");

const ontology = require("./beranda-controller");

router.get("/dashboard", dashboardController.pageBeranda);
// router.get("/ontology-data", ontology.getDataFromOntology);

router.get("/tes", tes.getQueryResults);
module.exports = router;
