const express = require("express");
const router = express.Router();
const { requireCompanyIdMembership, requireCompanyNameParam } = require("../middleware/authorize");

const companyController = require("../controllers/companyController");
const { requireRole, companyFromCompanyId, ROLE_GROUPS } = require("../middleware/rbac");

router.get("/", companyController.getCompanies);

router.post("/", companyController.addCompany);

// REV-005: object-level check — only members of the company may update it.
// AUD-028: company info edit is Manager and above (client CompanyInfo.jsx isNotEnrollerOrEmployee).
router.put(
	"/:id",
	requireCompanyIdMembership("id"),
	requireRole(ROLE_GROUPS.MANAGER_LEVEL, { companyFrom: companyFromCompanyId("id") }),
	companyController.updateCompany,
);

router.get("/employees/:employees", companyController.getCompanyEmployees);

// :name is a company name here (and only here) — see F-14 in middleware/authorize.js.
router.get("/:name", requireCompanyNameParam("name"), companyController.getCompany);

module.exports = router;
