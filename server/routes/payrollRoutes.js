const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/payGroups/:companyName", payrollController.getAllPayGroups);

module.exports = router;
