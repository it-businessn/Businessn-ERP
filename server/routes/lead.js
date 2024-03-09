const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

router.get("/disburse", leadController.getDisbursedLeads());

router.get(
	"/disburse/isConfirmed",
	leadController.getConfirmedDisbursedLeads(),
);

router.post("/disburse", leadController.disburseLeads());

router.get("/opportunities", leadController.getOpportunities());

router.post("/opportunity", leadController.createLeadOpportunity());

router.post("/confirm-disburse", leadController.confirmDisburseLeads());

module.exports = router;
