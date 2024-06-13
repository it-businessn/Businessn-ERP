const express = require("express");
const router = express.Router();

const payoutController = require("../controllers/payoutController");

router.get("/:id", payoutController.getAllPayouts);

router.post("/", payoutController.addPayout);

router.put("/:id", payoutController.updatePayout);

// router.delete("/:id", payoutController.deletePayout);
module.exports = router;
