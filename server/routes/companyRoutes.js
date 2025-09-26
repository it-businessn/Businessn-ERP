const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");

router.get("/companies", companyController.getCompanies);

router.post("/companies", companyController.addCompany);

router.put("/companies/:id", companyController.updateCompany);

router.get("/companies/employees/:employees", companyController.getCompanyEmployees);

router.get("/companies/:name", companyController.getCompany);

module.exports = router;
