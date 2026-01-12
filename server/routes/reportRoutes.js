const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.get(
	"/funds/totals/:companyName/:payPeriodNum/:payPeriodPayDate/:isExtraRun/:scheduleFrequency",
	reportController.getFundingReportInfo,
);

router.get(
	"/funds/report/:companyName/:payPeriodNum/:payPeriodPayDate/:isExtraRun/:scheduleFrequency",
	reportController.getFundReportInfo,
);

router.get(
	"/funds/journals/:companyName/:payPeriodNum/:payPeriodProcessingDate/:isExtraRun/:scheduleFrequency",
	reportController.getJournalEntryReportInfo,
);

router.get("/:companyName/:empId", reportController.getEmployeeReportInfo);

router.get(
	"/:companyName/:payPeriodNum/:isExtraRun/:payPeriodPayDate/:scheduleFrequency/:year",
	reportController.getReportInfo,
);

router.put("/submit/:id", reportController.updatePayrollProcess);

module.exports = router;
