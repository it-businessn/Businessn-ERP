const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetContoller");

router.get("/:companyName", timesheetController.getTimesheets);

router.get("/:companyName/:employeeId", timesheetController.getEmployeeTimesheet);

router.get("/filtered/:companyName/:filter", timesheetController.getFilteredTimesheets);

router.get(
	"/filtered-status/:companyName/:filter",
	timesheetController.getFilteredTimesheetsByStatus,
);

router.post("/", timesheetController.createTimesheet);

router.post("/manual", timesheetController.createManualTimesheet);

router.put("/:id", timesheetController.updateTimesheet);

router.put("/delete-entry/:id", timesheetController.deleteTimesheet);

module.exports = router;
