const express = require("express");
const router = express.Router();

const alertsController = require("../controllers/alertsController");

router.get(
	"/detail/:companyName/:payPeriodNum/:selectedPayGroup",
	alertsController.getAlertsAndViolationsInfo,
);

router.get("/:companyName/:payPeriodNum", alertsController.getTotalAlertsAndViolationsInfo);

router.post("/", alertsController.addAlertsAndViolations);

module.exports = router;
