const express = require("express");
const router = express.Router();

const leadController = require("../controllers/leadController");

router.get("/disburse", leadController.getDisbursedLeads());

router.get(
	"/disburse/isConfirmed",
	leadController.getConfirmedDisbursedLeads(),
);

router.get("/not-disbursed", leadController.getNotDisbursedLeads());

router.get("/companies", leadController.getLeadCompanies());

router.get("/grouped-opportunities", leadController.getGroupedOpportunities());
router.get("/opportunities", leadController.getOpportunities());

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
