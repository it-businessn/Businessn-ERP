const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.get("/:companyName", conversationController.getAnnouncement);

router.post("/", conversationController.createAnnouncement);

module.exports = router;
