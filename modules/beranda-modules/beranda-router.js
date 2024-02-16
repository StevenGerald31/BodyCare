const express = require("express");
const router = express.Router();
const dashboardController = require("./beranda-controller");
const tes = require("./tes-controller");
const controller = require("./tes-query");

// ini bagiian yang bisa dipake tanpa database
router.get("/dashboard", dashboardController.pageDashboard);
router.get("/admin", dashboardController.pageAdmin);
router.get("/login", dashboardController.pageLogin);

// ini bagian orek orek semua

router.get("/login", dashboardController.pageLogin);
router.get("/admin", dashboardController.pageAdmin);
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
    const results = await dashboardController.executeQueryByMerek(selectedMerek);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/allData", async (req, res) => {
  try {
    const allData = await controller.getAllData();
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pencarian", async (req, res) => {
  try {
    const queryFilters = req.query.queryFilters;

    const pencarian = await dashboardController.pencarian(queryFilters);
    res.json(pencarian)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get("/dataTransaksi", dashboardController.dataTransaksi)
router.get("/dataAlgoritma", dashboardController.dataAlgoritma)
router.post("/dataHasilAlgoritma", dashboardController.hasilAlgoritma)

module.exports = router;
