const express = require("express");
const router = express.Router();
const { requireCompanyIdMembership, requireCompanyNameParam } = require("../middleware/authorize");

const companyController = require("../controllers/companyController");

router.get("/", companyController.getCompanies);

router.post("/", companyController.addCompany);

// REV-005: object-level check — only members of the company may update it.
router.put("/:id", requireCompanyIdMembership("id"), companyController.updateCompany);

router.get("/employees/:employees", companyController.getCompanyEmployees);

// :name is a company name here (and only here) — see F-14 in middleware/authorize.js.
router.get("/:name", requireCompanyNameParam("name"), companyController.getCompany);

module.exports = router;
