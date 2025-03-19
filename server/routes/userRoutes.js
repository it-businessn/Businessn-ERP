const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllEmployees);

router.get("/activity", userController.getUserActivity);

router.get("/emp-roles/:companyName", userController.groupEmployeesByRole);

router.get("/not-managers/:companyName", userController.getAllSalesAgents);

router.get("/not-managers-list/:companyName", userController.getAllSalesAgentsList);

router.get("/comp-managers/:companyName", userController.getAllCompManagers);

router.get("/managers/:companyName", userController.getAllManagers);

router.get("/groups/:memberId/:companyName", userController.getAllGroupMembers);

router.get(
	"/payroll-active-count/:companyName",
	userController.getPayrollActiveCompanyEmployeesCount,
);

router.get("/payroll-active/:companyName", userController.getPayrollActiveCompanyEmployees);

router.get("/payroll-inactive/:companyName", userController.getPayrollInActiveCompanyEmployees);

router.get("/:companyName", userController.getCompanyEmployees);

router.get("/count/:companyName", userController.getCompanyEmployeesCount);

router.post("/create", userController.createMasterUser);

router.put("/master/:userId", userController.updateMasterUser);

router.put("/:userId", userController.updateUser);

router.put("/assignLeads", userController.updateUserAssignedLeads);

module.exports = router;
