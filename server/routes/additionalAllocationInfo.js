const express = require("express");
const router = express.Router();

const additionalAllocationInfoController = require("../controllers/additionalAllocationInfoController");

router.get(
	"/:companyName/:payDate/:isExtraRun/:groupId",
	additionalAllocationInfoController.getAmountAllocation,
);

router.post(
	"/hours",
	additionalAllocationInfoController.addAdditionalHoursAllocationInfo,
);
router.post("/amount", additionalAllocationInfoController.addAmountAllocation);

module.exports = router;
