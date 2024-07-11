const express = require("express");
const router = express.Router();

const opportunityController = require("../controllers/opportunityController");

router.get("/", opportunityController.getOpportunities);

router.get("/category", opportunityController.getGroupedOpportunities);

router.post("/", opportunityController.createOpportunity);

router.put("/:opportunityId", opportunityController.updateOpportunity);

module.exports = router;
