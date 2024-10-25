const express = require("express");
const router = express.Router();

const additionalHoursAllocationInfoController = require("../controllers/additionalHoursAllocationInfoController");

router.post(
	"/",
	additionalHoursAllocationInfoController.addAdditionalHoursAllocationInfo,
);

module.exports = router;
