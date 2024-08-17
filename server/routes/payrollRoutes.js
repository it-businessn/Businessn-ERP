const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get(
	"/hoursTimesheet/:companyName/:startDate/:endDate",
	payrollController.getGroupedTimesheet,
);

router.get(
	"/alertsReport/:companyName/:payPeriodNum",
	payrollController.getAlertsAndViolationsInfo,
);

router.get(
	"/payDetailsReport/:companyName/:payPeriodNum",
	payrollController.getPayDetailsReportInfo,
);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

router.put("/amountAllocation/:id", payrollController.updateAmountAllocation);

router.post("/generate-payStub", payrollController.addEmployeePayStubInfo);

router.post("/generate-alerts", payrollController.addAlertsAndViolations);

module.exports = router;
