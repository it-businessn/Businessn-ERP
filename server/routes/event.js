const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const event = new Event({
    eventType: req.body?.title,
    description: req.body?.description,
    meetingFromDate: req.body?.meetingFromDate,
    meetingToDate: req.body?.meetingToDate,
    meetingFromTime: req.body?.meetingFromTime,
    meetingToTime: req.body?.meetingToTime,
    meetingAttendees: req.body?.meetingAttendees,
    meetingLocation: req.body?.meetingLocation,
    meetingLink: req.body?.meetingLink,
    taskType: req.body?.taskType,
    taskDueDate: req.body?.taskDueDate,
    taskAssignee: req.body?.taskAssignee,
    taskDuration: req.body?.taskDuration,
    phoneNo: req.body?.phoneNo,
    date: Date.now(),
  });
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
