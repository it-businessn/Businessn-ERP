const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetContoller");

router.get("/", timesheetController.getTimesheets);

router.get("/:employeeId", timesheetController.getTimesheet);

router.post("/", timesheetController.createTimesheet);

router.put("/:employeeId", timesheetController.updateTimesheet);

module.exports = router;
