const express = require("express");
const router = express.Router();

const vopayController = require("../controllers/vopayController");
const { requireRole, ROLE_GROUPS } = require("../middleware/rbac");

// AUD-028: every VoPay write moves funds or creates accounts -> same roles as
// payroll submit (client hasPayrollSubmitAccess). GET reads are unchanged.
const canMoveFunds = requireRole(ROLE_GROUPS.PAYROLL_SUBMIT);

router.get("/partner/account", vopayController.getPartnerEmployerAccounts);

router.post("/partner/account", canMoveFunds, vopayController.createPartnerEmployerAccount);

router.post("/partner/account/transfer", canMoveFunds, vopayController.partnerAccountTransfer);

router.get("/account/submit-extended-info", vopayController.submitEmployerInfo);

router.get("/account/client-accounts", vopayController.getClientAccountWallets);

router.get(
	"/account/client-accounts/wallets/:clientAccountId",
	vopayController.getClientAccountWallet,
);

router.post("/account/client-accounts/wallets/create", canMoveFunds, vopayController.createClientAccountWallet);

router.post("/account/client-accounts/individual", canMoveFunds, vopayController.createClientAccountEmployee);
router.post("/account/fund-my-account", canMoveFunds, vopayController.fundBankAccount);
router.get("/account/transactions/:clientAccountId", vopayController.getTransactions);
router.get("/account/balance", vopayController.getAccountBalance);
router.get("/account/webhooks", vopayController.getAccountWebHooks);

router.get("/bank-account/:accountId", vopayController.getLinkedBankAccounts);

router.get(
	"/bank-account/default-bank-account/:accountId",
	vopayController.getClientDefaultBankAccount,
);

router.post("/bank-account/set-my-bank-account", canMoveFunds, vopayController.setBankAccount);

router.get("/iq11/generate-embed-url/:clientAccountId", vopayController.getEmployeeBankEmbedUrl);

router.post("/eft/fund", canMoveFunds, vopayController.fundEmployerWallet);

router.post("/transfer-withdraw", canMoveFunds, vopayController.transferWithdraw);

router.get("/:vopayAccountId", vopayController.getVopayAccountOnboardingUrl);

module.exports = router;
