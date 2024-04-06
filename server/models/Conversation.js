const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
	// participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	groupName: { type: String, ref: "Group" },
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Messages in one-on-one conversations
	groupMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Messages in group conversations
	createdOn: { type: Date, default: Date.now },
	conversationType: { type: String, enum: ["one-on-one", "group"] },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
