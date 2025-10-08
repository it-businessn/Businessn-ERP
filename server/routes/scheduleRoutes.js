const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");
const { storageSpace } = require("../services/fileService");

router.get("/", scheduleController.getShifts);

router.get("/dailyTotals/:companyName/:crew", scheduleController.getDailyTotals);

router.get(
	"/location-monthlyTotals/:companyName/:month",
	scheduleController.getLocationMonthlyTotals,
);

router.get("/:id/:name", scheduleController.getShiftByDate);

router.get("/work/:date/:location/:empName/:name", scheduleController.getWorkShiftByDate);

router.get("/work-week/:date/:location/:empName/:name", scheduleController.getWorkShiftByWeek);

router.get("/email-logs/:companyName/:scheduleWeek", scheduleController.getScheduleEmailLogs);

router.get("/work-emp-shift/:date/:companyName/:name", scheduleController.getWorkWeekEmpShifts);

router.get("/work/emp/:date/:location/:empName/:name", scheduleController.getEmpWorkShiftByDate);

router.post("/", scheduleController.addShifts);

router.post("/work", scheduleController.addWorkShifts);

router.post("/repeat-week-schedule", scheduleController.repeatWeeklySchedule);

router.post("/send", storageSpace.single("file"), scheduleController.sendWorkShifts);

router.put("/:id", scheduleController.updateShift);

router.delete("/:id", scheduleController.deleteShift);

router.post("/dailyTotals", scheduleController.updateDailyTotals);

module.exports = router;
