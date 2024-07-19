const express = require("express");
const router = express.Router();

const profileInfoController = require("../controllers/profileInfoController");

router.get("/:companyName", profileInfoController.getAllProfileInfo);

router.get(
	"/:companyName/:empId",
	profileInfoController.getEmployeeProfileInfo,
);

router.post("/", profileInfoController.addEmployeeProfileInfo);

router.put("/:id", profileInfoController.updateEmployeeProfileInfo);

module.exports = router;
