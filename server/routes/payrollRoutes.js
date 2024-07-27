const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get(
	"/hours-timesheets/:companyName/:startDate/:endDate",
	payrollController.getGroupedTimesheet,
);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

module.exports = router;
