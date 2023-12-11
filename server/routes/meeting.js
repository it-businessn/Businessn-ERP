const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

router.get("/", async (req, res) => {
  try {
    const meetings = (await Meeting.find()).sort((a, b) => b.date - a.date);
    res.status(200).json(meetings);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const meeting = (await Meeting.find({ contactId: id })).sort(
      (a, b) => b.date - a.date
    );
    res.status(200).json(meeting);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const {
    type,
    description,
    attendees,
    location,
    fromDate,
    fromTime,
    toDate,
    toTime,
    meetingLink,
    contactId,
  } = req.body;

  const meeting = new Meeting({
    contactId,
    type,
    description,
    attendees,
    location,
    fromDate,
    fromTime,
    toDate,
    toTime,
    meetingLink,
    date: Date.now(),
  });
  try {
    const newMeeting = await meeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const meetingId = req.params.id;
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      req.body,
      {
        new: true,
      }
    );

    res.status(201).json(updatedMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
