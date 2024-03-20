const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/roles", setUpController.getAllRoles());

router.post("/roles", setUpController.addRole());

router.get("/departments", setUpController.getAllDepartments());

router.post("/departments", setUpController.addDepartment());

router.get("/approvers", setUpController.getAllApprovers());

router.post("/approvers", setUpController.addApprovers());

router.get("/idle-lead-config", setUpController.getIdleLeadReAssignment());

router.post("/idle-lead", setUpController.setUpIdleLeadReAssignment());

router.put("/idle-lead/:id", setUpController.updateSetUp());

module.exports = router;
