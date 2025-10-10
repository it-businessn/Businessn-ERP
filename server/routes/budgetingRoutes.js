const express = require("express");
const router = express.Router();

const budgetingController = require("../controllers/budgetingController");

router.get("/:companyName", budgetingController.getAccountLedgers);

router.get("/dept/:companyName/:crew", budgetingController.getDeptAccounts);

router.get(
	"/general-journal/:companyName/:accountName",
	budgetingController.getAccountJournalEntries,
);

router.post("/", budgetingController.addAccountLedger);

router.post("/general-journal", budgetingController.addAccountsJournalEntry);

module.exports = router;
