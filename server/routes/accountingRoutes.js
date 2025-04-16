const express = require("express");
const router = express.Router();

const accountingController = require("../controllers/accountingController");

router.get("/:companyName", accountingController.getAccounts);

router.post("/", accountingController.createAccount);

router.post("/general-journal", accountingController.addGeneralJournalEntry);

module.exports = router;
