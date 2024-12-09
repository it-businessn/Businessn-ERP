const express = require("express");
const router = express.Router();

const timecardController = require("../controllers/timecardController");
const { authenticateToken } = require("../middleware/auth");

router.get("/:companyName", authenticateToken, timecardController.getTimecard);

router.post("/", timecardController.createTimecard);

module.exports = router;
