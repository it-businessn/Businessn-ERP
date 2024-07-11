const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.post("/", conversationController.createConversation);

router.get(
	"/:participants/:companyName",
	conversationController.getUserConversations,
);

router.get(
	"/group/:groupName/messages",
	conversationController.getGroupMessages,
);
router.post(
	"/one-to-one/messages",
	conversationController.getOneToOneConversation,
);
router.post("/group/messages", conversationController.createGroupMessages);
router.post("/messages", conversationController.createOneToOneMessages);

router.get("/group", conversationController.getAllGroupMessages);
router.get("/:id/messages", conversationController.getMessage);
router.post("/history", conversationController.getConversationHistory);

router.post("/group", conversationController.createGroupConversation);

router.post("/two-users", conversationController.createConversationTwoUsers);

module.exports = router;
