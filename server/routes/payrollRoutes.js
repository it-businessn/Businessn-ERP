const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");
const payStubController = require("../controllers/payStubController");
const { requireRole, ROLE_GROUPS } = require("../middleware/rbac");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

router.get("/payGroups/:companyName/:id", payrollController.getPayGroup);

router.post("/hoursTimesheet", payrollController.getGroupedTimesheet);

router.post("/EEContribution", payrollController.getEEContribution);

router.post("/ERContribution", payrollController.getERContribution);

router.post("/payGroups", payrollController.addPayGroup);

router.put("/payGroups/:id", payrollController.updatePayGroup);

// AUD-028: Managers run Payrun Setup in the client (process-payroll/PayrunSetup.jsx,
// reached from the Payroll Workview "Pay now" button), so Manager and above.
router.post(
	"/process",
	requireRole(ROLE_GROUPS.MANAGER_LEVEL),
	payStubController.addEmployeePayStubInfo,
);

module.exports = router;
