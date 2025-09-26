const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/", setUpController.getAllSetup);

router.get("/location/:companyName", setUpController.getLocations);

router.get("/roles/:companyName", setUpController.getRoles);

router.get("/crews/:companyName", setUpController.getCrews);

router.get("/position-roles/:companyName", setUpController.getPositionRoles);

router.get("/departments/:companyName", setUpController.getDepartments);

router.get("/cost-centers/:companyName", setUpController.getCC);

router.get("/modules/:companyName", setUpController.getModules);

router.get("/groups/:companyName", setUpController.getGroups);

router.get("/empTypes/:companyName", setUpController.getEmpTypes);

router.post("/", setUpController.addSetUpRule);

router.put("/:id", setUpController.updateSetUp);

router.post("/location", setUpController.addLocation);

router.post("/crews", setUpController.addCrew);

router.put("/crews/:id", setUpController.updateCrew);

router.post("/roles", setUpController.addRole);

router.post("/position-roles", setUpController.addPositionRole);

router.post("/departments", setUpController.addDepartment);

router.post("/cost-centers", setUpController.addCC);

router.post("/modules", setUpController.addModule);

router.put("/modules/:id", setUpController.updateModule);

router.post("/groups", setUpController.addGroup);

router.put("/groups/:id", setUpController.updateGroup);

router.post("/empTypes", setUpController.addEmpType);

module.exports = router;
