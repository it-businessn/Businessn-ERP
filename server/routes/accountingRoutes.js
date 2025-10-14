const express = require("express");
const router = express.Router();

const accountingController = require("../controllers/accountingController");

router.get("/:companyName", accountingController.getAccounts);

router.get("/ledgers/:companyName", accountingController.getAccountLedgers);

router.get("/dept/:companyName/:crew", accountingController.getDeptAccounts);

router.get(
	"/general-journal/:companyName/:accountName",
	accountingController.getAccountJournalEntries,
);

router.post("/", accountingController.addAccountLedger);

router.post("/general-journal", accountingController.addAccountsJournalEntry);

module.exports = router;
