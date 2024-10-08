const express = require("express");
const router = express.Router();

const payInfoController = require("../controllers/payInfoController");

router.get("/detail/:companyName/:empId", payInfoController.getEmployeePayInfo);

router.get(
	"/:companyName/:payDate/:isExtraRun/:groupId",
	payInfoController.getAllPayInfo,
);

router.post("/", payInfoController.addEmployeePayInfo);

router.put("/:id", payInfoController.updateEmployeePayInfo);

module.exports = router;
