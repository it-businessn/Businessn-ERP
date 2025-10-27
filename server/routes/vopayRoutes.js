const express = require("express");
const router = express.Router();

const vopayController = require("../controllers/vopayController");

router.post("/partner/account", vopayController.createPartnerEmployerAccount);

router.get("/partner/account", vopayController.getPartnerEmployerAccounts);

router.get("/account/submit-extended-info", vopayController.submitEmployerInfo);

router.get("/:vopayAccountId", vopayController.getAccountOnboardingUrl);

router.get("/account/client-accounts", vopayController.getClientAccountEmployees);

router.post("/account/client-accounts/individual", vopayController.createClientAccountEmployee);

router.get("/iq11/generate-embed-url/:clientAccountId", vopayController.getEmployeeBankEmbedUrl);

router.post("/eft/fund", vopayController.fundEmployerWallet);

module.exports = router;
