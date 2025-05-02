const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");

router.get("/", scheduleController.getShifts);

router.get("/:id/:name", scheduleController.getShiftByDate);

router.get("/work/:date/:location/:empName/:name", scheduleController.getWorkShiftByDate);

router.get("/work-week/:date/:location/:empName/:name", scheduleController.getWorkShiftByWeek);

router.get("/work/emp/:date/:location/:empName/:name", scheduleController.getEmpWorkShiftByDate);

router.post("/", scheduleController.addShifts);

router.post("/work", scheduleController.addWorkShifts);

router.put("/:id", scheduleController.updateShift);

module.exports = router;
