const express = require("express");
const router = express.Router();

const roeController = require("../controllers/roeController");
const { requireRole, ROLE_GROUPS } = require("../middleware/rbac");

// ROE-01: an ROE holds the SIN and pay history: administrators only (per
// route, so the company in the path is known)
const adminOnly = requireRole(ROLE_GROUPS.ADMIN_LEVEL);

router.get("/employer/:companyName", adminOnly, roeController.getEmployerInfo);

router.get("/earnings/:companyName/:empId", adminOnly, roeController.getEmployeeEarningsInfo);

router.get("/:companyName/:empId", adminOnly, roeController.getEmployeeROEEmploymentInfo);

router.post("/", adminOnly, roeController.addEmployeeROEEmploymentInfo);

module.exports = router;
