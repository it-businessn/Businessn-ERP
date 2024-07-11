const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");

router.get("/", scheduleController.getShifts());

router.get("/:id/:name", scheduleController.getShiftByDate());

router.post("/", scheduleController.addShifts());

router.put("/:id", scheduleController.updateShift());

module.exports = router;
