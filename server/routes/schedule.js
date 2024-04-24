const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");

// router.get("/:id", scheduleController.getTaskById());

router.get("/", scheduleController.getShifts());

router.post("/", scheduleController.addShifts());

// router.put("/:id", scheduleController.updateTask());

module.exports = router;
