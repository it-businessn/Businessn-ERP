const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	text: String, // Content of the message
	sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
	conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }, // Reference to one-on-one conversation
	groupConversation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Conversation",
	},
	companyName: { type: String, ref: "Company" },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
