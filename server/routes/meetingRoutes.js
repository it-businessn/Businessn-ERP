const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");

router.get("/", meetingController.getMeetings);

router.get("/:contactId", meetingController.getMeeting);

router.post("/", meetingController.addMeeting);

router.put("/:meetingId", meetingController.updateMeeting);

module.exports = router;
