const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

router.get("/opportunities", async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/opportunities", async (req, res) => {
  const opportunity = new Opportunity({
    name: req.body.name,
    stage: req.body.stage,
    value: req.body.value,
  });

  try {
    const newOpportunity = await opportunity.save();
    res.status(201).json(newOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
