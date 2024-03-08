const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/noteController");

router.get("/notifications", notificationController.getNotifications());

router.post("/notifications", notificationController.createNotification());

module.exports = router;
