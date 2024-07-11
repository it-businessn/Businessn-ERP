const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");
const industryController = require("../controllers/industryController");

router.get("/", contactController.getContacts);
router.get("/comp/:id", contactController.getCompContactById);
router.get("/:id/:name", contactController.getContactById);

router.get("/industry-type", industryController.getIndustryType);

router.post("/", contactController.createContact);

router.post("/industry-type", industryController.createIndustryType);

router.put("/:id", contactController.updateContact);

module.exports = router;
