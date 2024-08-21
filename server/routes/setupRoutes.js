const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/", setUpController.getAllSetup);

router.get("/companies", setUpController.getCompanies);

router.get(
	"/companies/employees/:employees",
	setUpController.getCompanyEmployees,
);

router.get("/companies/:name", setUpController.getCompany);

router.get("/roles/:companyName", setUpController.getRoles);

router.get("/departments/:companyName", setUpController.getDepartments);

router.get("/modules/:companyName", setUpController.getModules);

router.get("/groups/:companyName", setUpController.getGroups);

router.get("/empTypes/:companyName", setUpController.getEmpTypes);

router.post("/", setUpController.addSetUpRule);

router.put("/:id", setUpController.updateSetUp);

router.post("/roles", setUpController.addRole);

router.post("/departments", setUpController.addDepartment);

router.post("/modules", setUpController.addModule);

router.put("/modules/:id", setUpController.updateModule);

router.post("/groups", setUpController.addGroup);

router.put("/groups/:id", setUpController.updateGroup);

router.post("/empTypes", setUpController.addEmpType);

router.post("/companies", setUpController.addCompany);

module.exports = router;
