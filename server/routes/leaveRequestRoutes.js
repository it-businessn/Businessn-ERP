const express = require("express");
const router = express.Router();

const leaveController = require("../controllers/leaveController");

router.get("/:companyName", leaveController.getAllEmployeeLeaveRequests);

router.get("/:companyName/:employeeId", leaveController.getEmployeeLeaveRequest);

router.post("/", leaveController.createLeaveRequest);

router.put("/:id", leaveController.updateLeaveRequest);

module.exports = router;
