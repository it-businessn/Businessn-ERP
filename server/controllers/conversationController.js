const Announcement = require("../models/Announcement");
const Conversation = require("../models/Conversation");
const Employee = require("../models/Employee");
const Message = require("../models/Message");

const getMessage = async (req, res) => {
	const { id } = req.params;

	try {
		const conversation = await Conversation.findById(id);

		if (!conversation) {
			return res.status(404).json({ message: "Conversation not found" });
		}

		const filter =
			conversation.conversationType === "one-on-one"
				? { conversation: id }
				: { groupConversation: id };

		const messages = await Message.find(filter).sort({ createdOn: 1 });

		return res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
const createConversationTwoUsers = async (req, res) => {
	const { userId1, userId2 } = req.body;

	try {
		let conversation = await Conversation.findOne({
			participants: { $all: [userId1, userId2] },
			conversationType: "one-on-one",
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [userId1, userId2],
				conversationType: "one-on-one",
			});
		}

		return res.status(201).json(conversation);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const createAnnouncement = async (req, res) => {
	const { title, message, companyName } = req.body;
	try {
		if (!title || !message || !companyName) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		const newAnnouncement = new Announcement({
			title,
			message,
			companyName,
		});
		await newAnnouncement.save();
		return res.status(201).json(newAnnouncement);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const createConversation = async (req, res) => {
	const { participants, conversationType, groupName, companyName } = req.body;

	try {
		let conversation = await Conversation.findOne({
			conversationType,
			groupName,
			companyName,
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants,
				conversationType,
				groupName,
				companyName,
			});
		}

		return res.status(201).json(conversation);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const createGroupConversation = async (req, res) => {
	const { participants, groupName } = req.body;

	try {
		const existing = await Conversation.findOne({
			groupName,
			conversationType: "group",
		});

		if (existing) {
			return res.status(409).json({ message: "Group already exists" });
		}

		const conversation = await Conversation.create({
			participants,
			groupName,
			conversationType: "group",
		});

		return res.status(201).json(conversation);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const getAnnouncement = async (req, res) => {
	const { companyName } = req.params;
	try {
		const announcements = await Announcement.find({
			// companyName,
		})
			.sort({ createdOn: -1 })
			.lean();

		return res.status(200).json(announcements);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAllGroupMessages = async (req, res) => {
	try {
		const conversations = await Conversation.find({
			conversationType: "group",
		}).populate("groupMessages");
		return res.status(200).json(conversations);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getGroupMessages = async (req, res) => {
	const { groupName } = req.params;
	try {
		const conversation = await Conversation.findOne({ groupName })
			.populate("groupMessages")
			.select("groupMessages")
			.lean();

		if (!conversation) {
			return res.status(404).json({ message: "Conversation not found" });
		}

		return res.status(200).json(conversation.groupMessages);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getConversations = async (id, path, populate) => {
	return await Conversation.findById(id)
		.populate({
			path,
			populate,
		})
		.populate({
			path: "participants",
			model: "Employee",
			select: "fullName",
		});
};

const getConversationHistory = async (req, res) => {
	const { id, type } = req.params;

	try {
		// if (type === "group") {
		// 	const groupConversations = await getConversations(id, "groupMessages", {
		// 		path: "sender",
		// 		model: "Employee",
		// 		select: "fullName",
		// 	});

		// 	const result = groupConversations.groupMessages.sort((a, b) => a.timestamp - b.timestamp);

		// 	return res.status(200).json(result);
		// }
		// const oneToOneConversations = await getConversations(id, "messages", [
		// 	{
		// 		path: "sender",
		// 		model: "Employee",
		// 		select: "fullName",
		// 	},
		// 	{
		// 		path: "receiver",
		// 		model: "Employee",
		// 		select: "fullName",
		// 	},
		// ]);
		// const result = oneToOneConversations.messages.sort((a, b) => a.timestamp - b.timestamp);
		const conversation = await getConversations(
			id,
			type === "group" ? "groupMessages" : "messages",
			{
				path: "sender",
				model: "Employee",
				select: "fullName",
			},
		);

		const messages = type === "group" ? conversation.groupMessages : conversation.messages;

		const result = (messages || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const getConversationByParticipants = async (
	participants,
	companyName,
	conversationType,
	path,
	populate,
) => {
	return Conversation.find({
		participants: { $all: participants },
		conversationType,
		companyName,
	})
		.populate({
			path,
			populate,
		})
		.populate({
			path: "participants",
			model: "Employee",
			select: "fullName",
		});
};

const getUserConversations = async (req, res) => {
	const { participants, companyName } = req.params;

	try {
		const conversations = await Conversation.find({
			participants: { $in: [participants] },
			companyName,
		})
			.populate("participants", "fullName")
			.sort({ createdOn: -1 })
			.lean();
		// const userConversations = [];
		// const groupConversations = await getConversationByParticipants(
		// 	participants,
		// 	companyName,
		// 	"group",
		// 	"groupMessages",
		// 	{
		// 		path: "sender",
		// 		model: "Employee",
		// 		select: "fullName",
		// 	},
		// );

		// userConversations.push(...groupConversations);

		// const oneToOneConversations = await getConversationByParticipants(
		// 	participants,
		// 	companyName,
		// 	"one-on-one",
		// 	"messages",
		// 	[
		// 		{
		// 			path: "sender",
		// 			model: "Employee",
		// 			select: "fullName",
		// 		},
		// 		{
		// 			path: "receiver",
		// 			model: "Employee",
		// 			select: "fullName",
		// 		},
		// 	],
		// );

		// userConversations.push(...oneToOneConversations);

		// const result = userConversations.sort((a, b) => b.createdOn - a.createdOn);
		return res.status(200).json(conversations);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const getOneToOneConversation = async (req, res) => {
	const { userId1, userId2 } = req.body;

	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [userId1, userId2], $size: 2 },
			conversationType: "one-on-one",
		}).populate({
			path: "messages",
			options: { sort: { timestamp: 1 } },
		});

		if (!conversation) {
			return res.status(404).json({ message: "Conversation not found" });
		}

		return res.status(200).json(conversation);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const createOneToOneMessages = async (req, res) => {
	const { text, senderId, receiverId, companyName } = req.body;

	try {
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId], $size: 2 },
			conversationType: "one-on-one",
			companyName,
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
				conversationType: "one-on-one",
				companyName,
				messages: [],
			});
		}

		const message = await Message.create({
			sender: senderId,
			receiver: receiverId,
			text,
			timestamp: new Date(),
			conversation: conversation._id,
			companyName,
		});

		await Conversation.findByIdAndUpdate(conversation._id, {
			$push: { messages: message._id },
		});

		return res.status(201).json(message);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const createGroupMessages = async (req, res) => {
	const { senderId, id, text, companyName } = req.body;

	try {
		const conversation = await Conversation.findById(id);

		if (!conversation) {
			return res.status(404).json({ message: "Group not found" });
		}

		if (conversation.conversationType !== "group") {
			return res.status(409).json({ message: "Not a group conversation" });
		}

		const message = await Message.create({
			text,
			sender: senderId,
			timestamp: new Date(),
			groupConversation: id,
			companyName,
		});

		// const senderIndex = conversation.participants.findIndex((id) =>
		// 	id.toString().includes("46436"),
		// );
		// if (senderIndex === -1) {
		// 	conversation.participants.push(senderId);
		// }
		// conversation.groupMessages.push(message._id);
		// await conversation.save();
		await Conversation.findByIdAndUpdate(id, {
			$push: { groupMessages: message._id },
		});

		return res.status(201).json(message);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports = {
	createConversation,
	createAnnouncement,
	getAnnouncement,
	getMessage,
	getGroupMessages,
	getOneToOneConversation,
	createOneToOneMessages,
	createGroupConversation,
	getAllGroupMessages,
	createConversationTwoUsers,
	createGroupMessages,
	getUserConversations,
	getConversationHistory,
};
