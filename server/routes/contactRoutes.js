const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

router.get("/", contactController.getContacts);
router.get("/:companyName", contactController.getCompanyContact);
router.get("/:id/:companyName", contactController.getContact);

router.post("/", contactController.createContact);

router.put("/:id", contactController.updateContact);

module.exports = router;
