const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");

router.get("/:id", meetingController.getMeetingById());

router.get("/", meetingController.getMeetings());

router.post("/", meetingController.addMeeting());

router.put("/:id", meetingController.updateMeeting());

module.exports = router;
