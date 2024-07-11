const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController");

router.get("/:contactId", activityController.getActivityById);
router.get("/:createdBy/:companyName", activityController.getActivity);
router.get(
	"/user/:createdBy/:companyName/:filter",
	activityController.getActivityRange,
);

router.post("/", activityController.createActivity);

module.exports = router;
