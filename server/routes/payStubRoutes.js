const express = require("express");
const router = express.Router();

const payStubController = require("../controllers/payStubController");

router.get(
	"/funds/totals/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	payStubController.getFundingPayDetailsReportInfo,
);

router.get(
	"/funds/report/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	payStubController.getFundPayDetailsReportInfo,
);

router.get(
	"/funds/journals/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	payStubController.getJournalEntryReportInfo,
);

router.get("/:companyName/:empId", payStubController.getEmployeePayDetailsReportInfo);

router.get(
	"/:companyName/:payPeriodNum/:isExtraRun/:payPeriodPayDate/:scheduleFrequency/:year",
	payStubController.getPayDetailsReportInfo,
);

router.post("/", payStubController.addEmployeePayStubInfo);

module.exports = router;
