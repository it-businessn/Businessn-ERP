const express = require("express");
const router = express.Router();

const employmentInfoController = require("../controllers/employmentInfoController");
const { requireAssignableEmploymentRole } = require("../middleware/rbac");

router.get("/lastBadgeID/:companyName", employmentInfoController.getCompanyLastBadgeID);
router.get("/:companyName/:empId", employmentInfoController.getEmployeeEmploymentInfo);

// AUD-028: a new employmentRole must be in ROLE_ACCESS[caller role] (client EmploymentInfo.jsx).
router.post("/", requireAssignableEmploymentRole, employmentInfoController.addEmployeeEmploymentInfo);
router.post("/details", employmentInfoController.getAllEmploymentInfo);
router.put("/:id", requireAssignableEmploymentRole, employmentInfoController.updateEmployeeEmploymentInfo);

module.exports = router;
