const express = require("express");
const router = express.Router();

const governmentInfoController = require("../controllers/governmentInfoController");

router.get("/:companyName", governmentInfoController.getAllGovernmentInfo);

router.get(
	"/:companyName/:empId",
	governmentInfoController.getEmployeeGovernmentInfo,
);

router.post("/", governmentInfoController.addEmployeeGovernmentInfo);

router.put("/:id", governmentInfoController.updateEmployeeGovernmentInfo);

module.exports = router;
