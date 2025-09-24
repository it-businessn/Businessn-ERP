const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");
const payStubController = require("../controllers/payStubController");

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

router.post("/process", payStubController.addEmployeePayStubInfo);

module.exports = router;
