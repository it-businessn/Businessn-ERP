const express = require("express");
const router = express.Router();

const vopayController = require("../controllers/vopayController");

router.get("/", vopayController.getPartnerAccount);

router.get("/:accountId", vopayController.getAccountOnboardingUrl);

router.post("/", vopayController.createVoPayAccountEmployer);

router.post("/client", vopayController.createClientAccountEmployee);

module.exports = router;
