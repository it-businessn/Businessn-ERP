const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
	{
		// participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		groupName: { type: String, ref: "Group" },
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
		messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Messages in one-on-one conversations
		groupMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Messages in group conversations
		conversationType: { type: String, enum: ["one-on-one", "group"] },
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
