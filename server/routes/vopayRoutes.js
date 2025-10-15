const express = require("express");
const router = express.Router();

const vopayController = require("../controllers/vopayController");

router.get("/", vopayController.getPartnerAccount);

router.post("/", vopayController.createVoPayAccountPartner);

module.exports = router;
