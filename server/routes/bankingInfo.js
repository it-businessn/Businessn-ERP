const express = require("express");
const router = express.Router();

const bankingInfoController = require("../controllers/bankingInfoController");

router.get("/:companyName", bankingInfoController.getAllBankingInfo);

router.get(
	"/:companyName/:empId",
	bankingInfoController.getEmployeeBankingInfo,
);

router.post("/", bankingInfoController.addEmployeeBankingInfo);

router.put("/:id", bankingInfoController.updateEmployeeBankingInfo);

module.exports = router;
