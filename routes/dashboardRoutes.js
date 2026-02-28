const express = require("express");
const router = express.Router();
const {
  getOverview,
  getDepartmentRisk
} = require("../controllers/dashboardController");

router.get("/overview", getOverview);
router.get("/department-risk", getDepartmentRisk);

module.exports = router;
