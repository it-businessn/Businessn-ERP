const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents());

router.get("/:id", eventController.getEventsByType());

router.post("/", eventController.createEvent());

router.put("/:id", eventController.updateEvent());

module.exports = router;
