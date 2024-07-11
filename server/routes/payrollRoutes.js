const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

router.get("/paygroups/:id", payrollController.getAllPaygroups());

module.exports = router;
