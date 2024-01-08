const express = require("express");
const router = express.Router();
const dashboardController = require("./beranda-controller");
const tes = require("./tes-controller");
const controller = require("./tes-query");

const ontology = require("./beranda-controller");

router.get("/dashboard", dashboardController.pageBeranda);
// router.get("/ontology-data", ontology.getDataFromOntology);

router.get("/tes", tes.getQueryResults);

router.get("/page", controller.pageTes);

// Pada bagian router
router.get("/api/merek", async (req, res) => {
  try {
    const merekList = await controller.getMerekList();
    res.json(merekList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/query-by-merek", async (req, res) => {
  try {
    const selectedMerek = req.query.merek;
    const results = await controller.executeQueryByMerek(selectedMerek);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
