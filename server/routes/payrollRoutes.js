const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get(
	"/hoursTimesheet/:companyName/:startDate/:endDate",
	payrollController.getGroupedTimesheet,
);

router.get(
	"/payDetailsReport/:companyName/:startDate/:endDate",
	payrollController.getPayDetailsReportInfo,
);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

module.exports = router;
