const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.get(
	"/all-conversations/:id/:name",
	conversationController.getAllUserConversations(),
);

router.get(
	"/group-conversations/:id/messages",
	conversationController.getGroupConversationById(),
);
router.post(
	"/one-to-one-conversations/messages",
	conversationController.getOneToOneConversationById(),
);
router.post("/", conversationController.createConversation());

router.post("/group-messages", conversationController.createGroupMessages());
router.post("/messages", conversationController.createMessages());

router.get(
	"/group-conversations",
	conversationController.getGroupConversation(),
);
router.get("/:id/messages", conversationController.getConversationById());
router.post("/history", conversationController.getConversationMessageById());

router.post(
	"/group-conversations",
	conversationController.createGroupConversation(),
);

router.post("/two-users", conversationController.createConversationTwoUsers());

module.exports = router;
