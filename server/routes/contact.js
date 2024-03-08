const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");
const industryController = require("../controllers/industryController");

router.get("/:id", contactController.getContactById);

router.get("/", contactController.getContacts);

router.get("/industry-type", industryController.getIndustryType);

router.post("/", contactController.createContact);

router.post("/industry-type", industryController.createIndustryType);

router.put("/:id", contactController.updateContact);

module.exports = router;
