const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

router.get("/", async (req, res) => {
  try {
    const activities = (await Activity.find()).sort((a, b) => b.date - a.date);
    res.status(200).json(activities);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const notes = (await Activity.find({ contactId: id })).sort(
      (a, b) => b.date - a.date
    );
    res.status(200).json(notes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { phoneCalls, type, duration, description, contactId } = req.body;

  const activity = new Activity({
    contactId,
    phoneCalls,
    type,
    duration,
    description,
    date: Date.now(),
  });
  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
