const express = require("express");
const router = express.Router();

const timecardController = require("../controllers/timecardController");

router.get("/:companyName", timecardController.getTimecard);

router.post("/", timecardController.createTimecard);

module.exports = router;
