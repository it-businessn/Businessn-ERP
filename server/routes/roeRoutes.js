const express = require("express");
const router = express.Router();

const roeController = require("../controllers/roeController");

router.get("/:companyName/:empId", roeController.getEmployeeROEEmploymentInfo);

router.post("/", roeController.addEmployeeROEEmploymentInfo);

module.exports = router;
