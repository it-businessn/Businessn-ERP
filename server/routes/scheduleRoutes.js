const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");
const { storageSpace } = require("../services/fileService");
const { requireCompanyNameParam } = require("../middleware/authorize");

// SEC-01: on these routes :name is the COMPANY (controllers filter
// companyName: name). Since F-14 ":name" is no longer guarded app-wide (it is a
// crew name on /work-emp-shift), so each company-valued :name is guarded here.
const companyFromName = requireCompanyNameParam("name");

router.get("/", scheduleController.getShifts);

router.get("/avg-headCount-totals/:companyName/:crew", scheduleController.getAvgHeadCountTotals);

router.get("/expense-overview/:companyName/:crew", scheduleController.getExpenseOverview);

router.get("/daily-stats/:companyName/:month/:crew", scheduleController.getDailyStatistics);

router.get(
	"/role-monthlyTotals/:companyName/:month/:crew",
	scheduleController.getCrewRolesMonthlyTotals,
);

router.get("/:id/:name", companyFromName, scheduleController.getShiftByDate);

router.get("/work/:date/:location/:empName/:name", companyFromName, scheduleController.getWorkShiftByDate);

router.get("/work-week/:date/:location/:empName/:name", companyFromName, scheduleController.getWorkShiftByWeek);

router.get("/email-logs/:companyName/:scheduleWeek", scheduleController.getScheduleEmailLogs);

router.get("/work-emp-shift/:date/:companyName/:name", scheduleController.getWorkWeekEmpShifts);

router.get("/work/emp/:date/:location/:empName/:name", companyFromName, scheduleController.getEmpWorkShiftByDate);

router.post("/", scheduleController.addShifts);

router.post("/work", scheduleController.addWorkShifts);

router.post("/repeat-week-schedule", scheduleController.repeatWeeklySchedule);

router.post("/send", storageSpace.single("file"), scheduleController.emailWorkShifts);

router.put("/:id", scheduleController.updateShift);

router.delete("/:id", scheduleController.deleteShift);

router.post("/dailyTotals", scheduleController.updateDailyTotals);

module.exports = router;
