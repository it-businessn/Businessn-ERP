const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

router.get("/", async (req, res) => {
  try {
    const opportunities = (await Opportunity.find()).sort();
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/category", async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    const groupedOpportunities = groupOpportunitiesByCategory(opportunities);
    res.json(groupedOpportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function groupOpportunitiesByCategory(categories) {
  const groupedOpportunities = {};

  categories.forEach((category) => {
    const group = category.stage;

    if (!groupedOpportunities[group]) {
      groupedOpportunities[group] = {
        opportunities: [],
        categoryCount: {},
      };
    }

    groupedOpportunities[group].opportunities.push(category);
  });

  return groupedOpportunities;
}

router.post("/", async (req, res) => {
  const { name, clientName, stage, probability, dealAmount } = req.body;
  const opportunity = new Opportunity({
    name,
    clientName,
    stage,
    probability,
    dealAmount,
    createdOn: Date.now(),
  });

  try {
    const newOpportunity = await opportunity.save();
    res.status(201).json(newOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const opportunityId = req.params.id;
  try {
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      opportunityId,
      req.body,
      { new: true }
    );

    res.status(201).json(updatedOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
