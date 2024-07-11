const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents());
router.get("/comp/:id", eventController.getCompEvents());

router.get("/:id/:name", eventController.getEventsByType());

router.post("/", eventController.createEvent());

router.put("/:id", eventController.updateEvent());

module.exports = router;
