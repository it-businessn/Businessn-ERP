const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/notifications", async (req, res) => {
  const notification = new Notification({
    message: req.body.message,
    status: req.body.status,
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
