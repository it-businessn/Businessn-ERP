const express = require("express");
const router = express.Router();

const setUpController = require("../controllers/setUpController");

router.get("/idle-lead-config", setUpController.getIdleLeadReAssignment());

router.post("/idle-lead", setUpController.setUpIdleLeadReAssignment());

router.put("/idle-lead/:id", setUpController.updateSetUp());

module.exports = router;
