const express = require("express");
const router = express.Router();

const vopayController = require("../controllers/vopayController");

router.get("/partner/account", vopayController.getPartnerEmployerAccounts);

router.post("/partner/account", vopayController.createPartnerEmployerAccount);

router.get("/account/submit-extended-info", vopayController.submitEmployerInfo);

router.get("/account/client-accounts", vopayController.getClientAccountWallets);

router.get(
	"/account/client-accounts/wallets/:clientAccountId",
	vopayController.getClientAccountWallet,
);

router.post("/account/client-accounts/wallets/create", vopayController.createClientAccountWallet);

router.post("/account/client-accounts/individual", vopayController.createClientAccountEmployee);
router.post("/account/fund-my-account", vopayController.fundBankAccount);

router.get("/bank-account/:accountId", vopayController.getLinkedBankAccounts);

router.get(
	"/bank-account/default-bank-account/:accountId",
	vopayController.getClientDefaultBankAccount,
);

router.post("/bank-account/set-my-bank-account", vopayController.setBankAccount);

router.get("/iq11/generate-embed-url/:clientAccountId", vopayController.getEmployeeBankEmbedUrl);

router.post("/eft/fund", vopayController.fundEmployerWallet);

router.post("/transfer-withdraw", vopayController.transferWithdraw);

router.get("/:vopayAccountId", vopayController.getVopayAccountOnboardingUrl);

module.exports = router;
