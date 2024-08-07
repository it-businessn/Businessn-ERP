const express = require("express");
const router = express.Router();

const payInfoController = require("../controllers/payInfoController");

router.get(
	"/:companyName/:startDate/:endDate",
	payInfoController.getAllPayInfo,
);

router.get("/:companyName/:empId", payInfoController.getEmployeePayInfo);

router.post("/", payInfoController.addEmployeePayInfo);

router.put("/:id", payInfoController.updateEmployeePayInfo);

module.exports = router;
