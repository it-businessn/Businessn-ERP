const express = require("express");
const router = express.Router();

const payStubController = require("../controllers/payStubController");

router.get("/:companyName/:empId", payStubController.getEmployeePayDetailsReportInfo);

router.get("/:companyName/:payPeriodNum/:isExtraRun", payStubController.getPayDetailsReportInfo);

router.get(
	"/funding-totals/:companyName/:payPeriodNum/:isExtraRun",
	payStubController.getFundingPayDetailsReportInfo,
);

router.get(
	"/fund-totals/:companyName/:payPeriodNum/:isExtraRun",
	payStubController.getFundPayDetailsReportInfo,
);

router.post("/", payStubController.addEmployeePayStubInfo);

module.exports = router;
