const express = require("express");
const router = express.Router();

const payStubController = require("../controllers/payStubController");

router.get(
	"/funds/totals/:companyName/:payPeriodNum/:isExtraRun",
	payStubController.getFundingPayDetailsReportInfo,
);

router.get(
	"/funds/report/:companyName/:payPeriodNum/:isExtraRun",
	payStubController.getFundPayDetailsReportInfo,
);

router.get("/:companyName/:empId", payStubController.getEmployeePayDetailsReportInfo);

router.get(
	"/:companyName/:payPeriodNum/:isExtraRun/:year",
	payStubController.getPayDetailsReportInfo,
);

router.post("/", payStubController.addEmployeePayStubInfo);

module.exports = router;
