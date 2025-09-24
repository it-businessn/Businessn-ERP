const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.get(
	"/funds/totals/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	reportController.getFundingReportInfo,
);

router.get(
	"/funds/report/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	reportController.getFundReportInfo,
);

router.get(
	"/funds/journals/:companyName/:payPeriodNum/:isExtraRun/:scheduleFrequency",
	reportController.getJournalEntryReportInfo,
);

router.get("/:companyName/:empId", reportController.getEmployeeReportInfo);

router.get(
	"/:companyName/:payPeriodNum/:isExtraRun/:payPeriodPayDate/:scheduleFrequency/:year",
	reportController.getReportInfo,
);

module.exports = router;
