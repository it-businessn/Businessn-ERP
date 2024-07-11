const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllEmployees());
router.get("/activity", userController.getUserActivity());
router.get("/:companyName", userController.getCompanyEmployees());
router.get("/emp-roles/:companyName", userController.groupEmployeesByRole());
router.get(
	"/groups/:memberId/:companyName",
	userController.getAllGroupMembers(),
);
router.get("/managers/:companyName", userController.getAllManagers());
router.get("/not-managers/:companyName", userController.getAllSalesAgents());
router.put("/:userId", userController.updateUser());
router.put("/assignLeads", userController.updateUserAssignedLeads);

module.exports = router;
