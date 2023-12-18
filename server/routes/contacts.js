const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const IndustryType = require("../models/IndustryType");

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/industry-type", async (req, res) => {
  try {
    const industry = await IndustryType.find({}).sort({ date: -1 });
    res.json(industry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const notes = (await Contact.find({ contactId: id })).sort(
      (a, b) => b.date - a.date
    );
    res.status(200).json(notes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    primaryContactAddress,
    companyName,
    industryType,
    companyAddress,
    revenue,
    employees,
  } = req.body;

  const contact = new Contact({
    firstName,
    lastName,
    email,
    phone,
    primaryContactAddress,
    companyName,
    industryType,
    companyAddress,
    revenue,
    employees,
    date: Date.now(),
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/industry-type", async (req, res) => {
  const { name } = req.body;
  const industryType = new IndustryType({
    name,
    date: Date.now(),
  });

  try {
    const newIndustryType = await industryType.save();
    res.status(201).json(newIndustryType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const contactId = req.params.id;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    res.status(201).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
