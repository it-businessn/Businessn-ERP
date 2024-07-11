const express = require("express");
const router = express.Router();

const timesheetController = require("../controllers/timesheetContoller");

router.get("/:id", timesheetController.getTimesheetById());

router.get("/", timesheetController.getTimesheet());

router.post("/", timesheetController.createTimesheet());

router.put("/:id", timesheetController.updateTimesheet());

module.exports = router;
