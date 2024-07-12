const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

router.get("/opportunities/:companyName", leadController.getOpportunities);

router.get("/not-disbursed/:companyName", leadController.getLeadsNotDisbursed);

router.get("/disburse/:companyName", leadController.getDisbursedLeads);

router.get("/targets/:companyName", leadController.getTargetLeads);

router.get(
	"/disburse/isConfirmed/:companyName",
	leadController.getConfirmedDisbursedLeads,
);
router.get("/:companyName", leadController.getGroupedOpportunitiesByCompany);

router.get("/:id/:companyName", leadController.getLead);

router.get("/companies/:companyName", leadController.getLeadCompanies);

router.get("/grouped-opportunities", leadController.getGroupedOpportunities);

router.post("/companies", leadController.createLeadCompany);

router.post(
	"/multiple-opportunities",
	leadController.createMultipleLeadOpportunity,
);
router.post("/confirm-disburse", leadController.confirmDisburseLeads);

router.post("/disburse", leadController.disburseLeads);

router.post("/opportunity", leadController.createLeadOpportunity);

router.put("/opportunity/:id", leadController.updateLead);

router.delete("/:id", leadController.deleteLead);

module.exports = router;
