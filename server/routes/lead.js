const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

router.get("/opportunities", leadController.getOpportunities());

router.post("/opportunity", leadController.createLeadOpportunity());

module.exports = router;
