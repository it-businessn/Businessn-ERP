const express = require("express");
const router = express.Router();

const leaveController = require("../controllers/leaveController");

router.post("/", leaveController.createLeaveRequest);

module.exports = router;
