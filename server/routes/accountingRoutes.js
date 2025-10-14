const express = require("express");
const router = express.Router();

const accountingController = require("../controllers/accountingController");

router.get("/:companyName", accountingController.getAccounts);

router.get("/ledgers/:companyName", accountingController.getAccountLedgers);

router.get(
	"/general-journal/:companyName/:accountName",
	accountingController.getAccountJournalEntries,
);

router.post("/", accountingController.addAccount);

router.post("/general-journal", accountingController.addAccountsJournalEntry);

router.put("/:id", accountingController.updateAccount);

module.exports = router;
