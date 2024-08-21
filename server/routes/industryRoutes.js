const express = require("express");
const router = express.Router();

const industryController = require("../controllers/industryController");

router.get("/", industryController.getIndustry);

router.post("/", industryController.createIndustry);

module.exports = router;
