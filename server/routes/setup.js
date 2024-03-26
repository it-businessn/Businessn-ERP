const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/roles", setUpController.getAllRoles());

router.post("/roles", setUpController.addRole());

router.get("/departments", setUpController.getAllDepartments());

router.post("/departments", setUpController.addDepartment());

router.get("/empTypes", setUpController.getAllEmpTypes());

router.post("/empTypes", setUpController.addEmpType());

router.get("/companies", setUpController.getAllCompanies());

router.post("/companies", setUpController.addCompany());

router.get("/approvers", setUpController.getAllApprovers());

router.post("/approvers", setUpController.addApprovers());

router.get("/idle-lead-config", setUpController.getIdleLeadReAssignment());

router.post("/idle-lead", setUpController.setUpIdleLeadReAssignment());

router.put("/idle-lead/:id", setUpController.updateSetUp());

module.exports = router;
