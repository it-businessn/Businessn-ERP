const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");

router.get("/", companyController.getCompanies);

router.post("/", companyController.addCompany);

router.put("/:id", companyController.updateCompany);

router.get("/employees/:employees", companyController.getCompanyEmployees);

router.get("/:name", companyController.getCompany);

module.exports = router;
