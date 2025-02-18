const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.get(
	"/alertsReport/:companyName/:payPeriodNum",
	payrollController.getAlertsAndViolationsInfo,
);

router.get(
	"/total-alerts/:companyName/:payPeriodNum",
	payrollController.getTotalAlertsAndViolationsInfo,
);

router.get(
	"/hoursTimesheet/:companyName/:startDate/:endDate/:payDate/:isExtraRun/:groupId/:payrunType",
	payrollController.getGroupedTimesheet,
);

router.get(
	"/EEContribution/:companyName/:startDate/:endDate/:payDate/:isExtraRun/:groupId",
	payrollController.getEEContribution,
);

router.get(
	"/ERContribution/:companyName/:startDate/:endDate/:payDate/:isExtraRun/:groupId",
	payrollController.getERContribution,
);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

router.post("/generate-alerts", payrollController.addAlertsAndViolations);

module.exports = router;
