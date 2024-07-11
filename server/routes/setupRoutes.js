const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/", setUpController.getAllSetup);

router.post("/", setUpController.addSetUpRule);

router.put("/:id", setUpController.updateSetUp);

router.get("/roles/:companyName", setUpController.getRoles);

router.post("/roles", setUpController.addRole);

router.get("/departments/:companyName", setUpController.getDepartments);

router.post("/departments", setUpController.addDepartment);

router.get("/modules/:companyName", setUpController.getModules);

router.post("/modules", setUpController.addModule);

router.put("/modules/:id", setUpController.updateModule);

router.get("/groups/:companyName", setUpController.getGroups);

router.post("/groups", setUpController.addGroup);

router.put("/groups/:id", setUpController.updateGroup);

router.get("/empTypes/:companyName", setUpController.getEmpTypes);

router.post("/empTypes", setUpController.addEmpType);

router.get("/companies", setUpController.getCompanies);

router.get("/companies/:name", setUpController.getCompany);

router.get(
	"/companies/employees/:employees",
	setUpController.getCompanyEmployees,
);

router.post("/companies", setUpController.addCompany);

module.exports = router;
