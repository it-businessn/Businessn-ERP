const express = require("express");
const router = express.Router();

const timecardController = require("../controllers/timecardController");

router.get("/:companyName/:filter", timecardController.getTimecard);

router.get("/tad-users", timecardController.getTADUsers);

router.get("/tad-filtered-users", timecardController.getFilteredTADUsers);

router.post("/", timecardController.createTimecard);

router.post("/manual", timecardController.createTimecardManual);

module.exports = router;
