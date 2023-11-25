const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

router.post("/", async (req, res) => {
  const activity = new Activity({
    contactId: req.body.contactId,
    description: req.body.description,
  });

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
