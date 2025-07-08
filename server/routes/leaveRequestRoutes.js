const express = require("express");
const router = express.Router();

const leaveController = require("../controllers/leaveController");

router.get("/:companyName/:employeeId", leaveController.getEmployeeLeaveRequest);

router.post("/", leaveController.createLeaveRequest);

module.exports = router;
