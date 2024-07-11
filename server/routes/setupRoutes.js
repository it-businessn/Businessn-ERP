const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/roles/:id", setUpController.getAllRoles());

router.post("/roles", setUpController.addRole());

router.get("/departments/:id", setUpController.getAllDepartments());

router.post("/departments", setUpController.addDepartment());

router.get("/modules/:id", setUpController.getAllModules());

router.post("/modules", setUpController.addModule());

router.put("/modules-status/:id", setUpController.updateModuleActiveStatus());

router.get("/groups/:id", setUpController.getAllGroups());

router.post("/groups", setUpController.addGroup());

router.put("/groups/:id", setUpController.updateGroup());

router.get("/empTypes/:id", setUpController.getAllEmpTypes());

router.post("/empTypes", setUpController.addEmpType());

router.get("/companies", setUpController.getAllCompanies());

router.get("/companies/:id", setUpController.getCompanyByName());

router.get("/companies/user/:id", setUpController.getCompanyByUserId());

router.post("/companies", setUpController.addCompany());

router.get("/approvers", setUpController.getAllApprovers());

router.post("/approvers", setUpController.addApprovers());

router.get("/idle-lead-config", setUpController.getIdleLeadReAssignment());

router.post("/idle-lead", setUpController.setUpIdleLeadReAssignment());

router.put("/idle-lead/:id", setUpController.updateSetUp());

module.exports = router;
