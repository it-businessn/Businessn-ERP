const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllEmployees());

router.get("/activity", userController.getUserActivity());

router.get("/emp-roles/:companyName", userController.groupEmployeesByRole());

router.get("/not-managers/:companyName", userController.getAllSalesAgents());

router.get(
	"/not-managers-list/:companyName",
	userController.getAllSalesAgentsList(),
);

router.get("/managers/:companyName", userController.getAllManagers());

router.get(
	"/groups/:memberId/:companyName",
	userController.getAllGroupMembers(),
);

router.get(
	"/payroll-active/:companyName",
	userController.getPayrollActiveCompanyEmployees(),
);

router.get(
	"/payroll-inactive/:companyName",
	userController.getPayrollInActiveCompanyEmployees(),
);

router.get("/:companyName", userController.getCompanyEmployees());

router.put("/:userId", userController.updateUser());

router.put("/assignLeads", userController.updateUserAssignedLeads);

module.exports = router;
