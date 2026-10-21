const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const Group = require("../models/Group");
const { requireRole, companyFromDocument, ROLE_GROUPS } = require("../middleware/rbac");

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

// AUD-028: submitting payroll moves money (VoPay transfer) -> client hasPayrollSubmitAccess.
// The company is the pay group's plus the body companyName the funds are taken for.
router.put(
	"/submit/:id",
	requireRole(ROLE_GROUPS.PAYROLL_SUBMIT, { companyFrom: companyFromDocument(Group) }),
	reportController.updatePayrollProcess,
);

module.exports = router;
