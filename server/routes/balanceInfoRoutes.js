const express = require("express");
const router = express.Router();

const balanceInfoController = require("../controllers/balanceInfoController");

router.get("/:companyName", balanceInfoController.getAllBalanceInfo);

router.get("/:companyName/:empId/:payPeriodPayDate", balanceInfoController.getEmployeeBalanceInfo);

router.post("/", balanceInfoController.addEmployeeBalanceInfo);

router.put("/:id", balanceInfoController.updateEmployeeBalanceInfo);

module.exports = router;
