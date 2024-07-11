const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers());
router.get("/activity", userController.getUserActivity());
router.get("/comp/:id", userController.getAllCompanyUsers());
router.get("/emp-roles/:id", userController.getAllEmployeesByRole());
router.get("/groups/:id/:name", userController.getAllMemberGroups());
router.get("/managers/:id", userController.getAllManagers());
router.get("/not-managers/:id", userController.getAllSalesAgents());
router.put("/:id", userController.updateUser());
router.put("/lead/:id", userController.updateUserAssignedLeads);

module.exports = router;
