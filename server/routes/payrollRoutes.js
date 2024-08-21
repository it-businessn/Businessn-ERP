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
	"/payDetailsReport/:companyName/:payPeriodNum/:isExtraRun",
	payrollController.getPayDetailsReportInfo,
);

router.get(
	"/hoursTimesheet/:companyName/:startDate/:endDate/:payDate/:isExtraRun/:groupId",
	payrollController.getGroupedTimesheet,
);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

router.put("/amountAllocation/:id", payrollController.updateAmountAllocation);

router.post("/generate-payStub", payrollController.addEmployeePayStubInfo);

router.post("/generate-alerts", payrollController.addAlertsAndViolations);

module.exports = router;
