const express = require("express");
const router = express.Router();

const employmentInfoController = require("../controllers/employmentInfoController");

router.get(
	"/:companyName/:startDate/:endDate/:payDate/:isExtraRun/:groupId",
	employmentInfoController.getAllEmploymentInfo,
);

router.get(
	"/:companyName/:empId",
	employmentInfoController.getEmployeeEmploymentInfo,
);

router.post("/", employmentInfoController.addEmployeeEmploymentInfo);

router.put("/:id", employmentInfoController.updateEmployeeEmploymentInfo);

module.exports = router;
