const express = require("express");
const router = express.Router();

const employmentInfoController = require("../controllers/employmentInfoController");

router.get("/lastBadgeID/:companyName", employmentInfoController.getCompanyLastBadgeID);
router.get("/:companyName/:empId", employmentInfoController.getEmployeeEmploymentInfo);

router.post("/", employmentInfoController.addEmployeeEmploymentInfo);
router.post("/details", employmentInfoController.getAllEmploymentInfo);
router.put("/:id", employmentInfoController.updateEmployeeEmploymentInfo);

module.exports = router;
