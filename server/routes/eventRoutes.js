const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents);

router.get("/:companyName", eventController.getCompanyEvents);

router.get("/:eventType/:companyName", eventController.getEvent);

router.get("/:eventType/:userName/:companyName", eventController.getUserEvent);

router.post("/", eventController.createEvent);

router.put("/:id", eventController.updateEvent);

module.exports = router;
