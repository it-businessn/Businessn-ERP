const express = require("express");
const router = express.Router();

const opportunityController = require("../controllers/opportunityController");

router.get("/", opportunityController.getOpportunities);

router.get("/category", opportunityController.getOpportunitiesByCategory);

router.post("/", opportunityController.createOpportunity);

router.put("/:id", opportunityController.updateOpportunity);

module.exports = router;
