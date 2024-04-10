const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents());

router.get("/:id", eventController.getEventsByType());

router.post("/", eventController.createEvent());

module.exports = router;
