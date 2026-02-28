const express = require("express");
const router = express.Router();
const { analyzeFeedback } = require("../controllers/feedbackController");

router.post("/", analyzeFeedback);

module.exports = router;
