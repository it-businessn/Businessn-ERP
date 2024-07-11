const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.get(
	"/all-conversations/:participants/:companyName",
	conversationController.getUserConversations,
);

router.get(
	"/group-conversations/:groupName/messages",
	conversationController.getGroupMessages,
);
router.post(
	"/one-to-one-conversations/messages",
	conversationController.getOneToOneConversation,
);
router.post("/", conversationController.createConversation);

router.post("/group-messages", conversationController.createGroupMessages);
router.post("/messages", conversationController.createOneToOneMessages);

router.get("/group-conversations", conversationController.getAllGroupMessages);
router.get("/:id/messages", conversationController.getMessage);
router.post("/history", conversationController.getConversationHistory);

router.post(
	"/group-conversations",
	conversationController.createGroupConversation,
);

router.post("/two-users", conversationController.createConversationTwoUsers);

module.exports = router;
