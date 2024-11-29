const express = require("express");
const router = express.Router();

const t4SlipController = require("../controllers/t4SlipController");

router.get("/:companyName", t4SlipController.getT4Slips);

router.get("/emp/:companyName/:empId", t4SlipController.getEmployeeT4Slip);

module.exports = router;
