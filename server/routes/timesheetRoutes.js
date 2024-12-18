const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetContoller");

router.get("/:companyName", timesheetController.getTimesheets);

router.get("/filtered/:companyName/:filter", timesheetController.getFilteredTimesheets);

router.get(
	"/filtered-status/:companyName/:filter",
	timesheetController.getFilteredTimesheetsByStatus,
);

router.get("/:companyName/:employeeId", timesheetController.getTimesheet);

router.post("/", timesheetController.createTimesheet);

router.put("/:id", timesheetController.updateTimesheet);

router.put("/delete-entry/:id", timesheetController.deleteTimesheet);

module.exports = router;
