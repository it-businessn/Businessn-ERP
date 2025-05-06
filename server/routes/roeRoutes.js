const express = require("express");
const router = express.Router();

const roeController = require("../controllers/roeController");

router.get("/:companyName/:empId", roeController.getEmployeeROEEmploymentInfo);

router.get("/earnings/:companyName/:empId", roeController.getEmployeeEarningsInfo);

router.post("/", roeController.addEmployeeROEEmploymentInfo);

module.exports = router;
