const express = require("express");
const router = express.Router();

const budgetingController = require("../controllers/budgetingController");

router.get("/:companyName", budgetingController.getBudgetAccounts);

router.get("/:companyName/:crew", budgetingController.getDeptAccounts);

router.get(
	"/general-journal/:companyName/:accountName",
	budgetingController.getAccountJournalEntries,
);

router.post("/", budgetingController.addBudgetAccount);

router.put("/:id", budgetingController.updateBudgetAccount);

module.exports = router;
