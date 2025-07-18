const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetController");

router.get("/:companyName", timesheetController.getTimesheets);

router.get("/filtered/:companyName/:filter", timesheetController.getFilteredTimesheets);

router.get(
	"/filtered-status/:companyName/:filter",
	timesheetController.getFilteredTimesheetsByStatus,
);

router.get("/:companyName/:employeeId/:filter", timesheetController.getEmployeeTimesheet);

router.post("/", timesheetController.createTimesheet);

router.post("/action", timesheetController.actionAllTimesheets);

router.post("/manual", timesheetController.createManualTimesheet);

router.put("/:id", timesheetController.updateTimesheet);

router.put("/paytype/:id", timesheetController.updateTimesheetPayType);

router.put("/role/:id", timesheetController.updateTimesheetRole);

router.put("/delete-entry/:id", timesheetController.deleteTimesheet);

module.exports = router;
