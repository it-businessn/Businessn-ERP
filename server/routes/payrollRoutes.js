const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.get(
	"/alertsReport/:companyName/:payPeriodNum/:selectedPayGroup",
	payrollController.getAlertsAndViolationsInfo,
);

router.get(
	"/total-alerts/:companyName/:payPeriodNum",
	payrollController.getTotalAlertsAndViolationsInfo,
);

router.post("/hoursTimesheet", payrollController.getGroupedTimesheet);

router.post("/EEContribution", payrollController.getEEContribution);

router.post("/ERContribution", payrollController.getERContribution);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

router.post("/generate-alerts", payrollController.addAlertsAndViolations);

module.exports = router;
