const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/", setUpController.getAllSetup);

router.post("/", setUpController.addSetUpRule);

router.put("/:id", setUpController.updateSetUp);

router.get("/location/:companyName", setUpController.getLocations);

router.post("/location", setUpController.addLocation);

router.get("/crews/:companyName", setUpController.getCrews);

router.post("/crews", setUpController.addCrew);

router.put("/crews/:id", setUpController.updateCrew);

router.get("/roles/:companyName", setUpController.getRoles);

router.get("/roles-all/:companyName", setUpController.getAllRoles);

router.post("/roles", setUpController.addRole);

router.put("/roles/:id", setUpController.updateRole);

router.post("/position-roles", setUpController.addPositionRole);

router.get("/position-roles/:companyName", setUpController.getPositionRoles);

router.get("/departments/:companyName", setUpController.getDepartments);

router.post("/departments", setUpController.addDepartment);

router.get("/cost-centers/:companyName", setUpController.getCC);

router.post("/cost-centers", setUpController.addCC);

router.put("/cost-centers/remove-dept/:id", setUpController.removeCCDept);

router.put("/cost-centers/:id", setUpController.addCCDept);

router.delete("/cost-centers/:id", setUpController.deleteCC);

router.get("/modules/:companyName", setUpController.getModules);

router.post("/modules", setUpController.addModule);

router.put("/modules/:id", setUpController.updateModule);

router.delete("/modules/:id", setUpController.deleteModule);

router.get("/groups/:companyName", setUpController.getGroups);

router.post("/groups", setUpController.addGroup);

router.put("/groups/:id", setUpController.updateGroup);

router.get("/empTypes/:companyName", setUpController.getEmpTypes);

router.post("/empTypes", setUpController.addEmpType);

module.exports = router;
