const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

router.get("/disburse/:id", leadController.getDisbursedLeads());

router.get(
	"/disburse/isConfirmed/:id",
	leadController.getConfirmedDisbursedLeads(),
);
router.get("/targets/:id", leadController.getTargetLeads());

router.get("/not-disbursed/:id", leadController.getNotDisbursedLeads());

router.get("/companies/:id", leadController.getLeadCompanies());

router.get("/grouped-opportunities", leadController.getGroupedOpportunities());
router.get("/comp/:id", leadController.getGroupedOpportunitiesByCompany());
router.get("/opportunities/:id", leadController.getOpportunities());

router.post("/companies", leadController.createLeadCompany());

router.post(
	"/multiple-opportunities",
	leadController.createMultipleLeadOpportunity(),
);
router.post("/confirm-disburse", leadController.confirmDisburseLeads());

router.post("/disburse", leadController.disburseLeads());

router.post("/opportunity", leadController.createLeadOpportunity());

router.put("/opportunity/:id", leadController.updateLeadInfo());

router.delete("/:id", leadController.deleteLead);

module.exports = router;
