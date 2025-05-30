const express = require("express");
const router = express.Router();

const additionalAllocationInfoController = require("../controllers/payrunExtraAllocationInfoController");

router.post("/", additionalAllocationInfoController.getAmountAllocation);
router.post("/hours", additionalAllocationInfoController.addAdditionalHoursAllocationInfo);
router.post("/amount", additionalAllocationInfoController.addAmountAllocation);
router.post("/ee-contr", additionalAllocationInfoController.addEmployeeContribution);
router.post("/er-contr", additionalAllocationInfoController.addEmployerContribution);

module.exports = router;
