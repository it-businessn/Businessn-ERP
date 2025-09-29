const Announcement = require("../models/Announcement");
const Conversation = require("../models/Conversation");
const Employee = require("../models/Employee");
const Message = require("../models/Message");

const getMessage = async (req, res) => {
	const { id } = req.params;

	try {
		const conversation = await Conversation.findById(id).populate("messages");
		if (!conversation) {
			return res.status(404).json({ message: "Conversation not found" });
		}
		const messages =
			conversation.type === "one-on-one"
				? await Message.find({ conversation: id })
				: await Message.find({ groupConversation: id });

		return res.status(200).json(messages);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createConversationTwoUsers = async (req, res) => {
	const { userId1, userId2, text } = req.body;
	try {
		let existingConversation = await Conversation.findOne({
			$or: [{ participants: [userId1, userId2] }, { participants: [userId2, userId1] }],
			conversationType: "one-on-one",
		});
		if (!existingConversation) {
			// If no conversation exists, create a new one-to-one conversation
			existingConversation = new Conversation({
				participants: [userId1, userId2],
				conversationType: "one-on-one",
			});
			await existingConversation.save();
		}

		return res.status(201).json(existingConversation);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createAnnouncement = async (req, res) => {
	const { title, message, companyName } = req.body;
	try {
		const newAnnouncement = new Announcement({
			title,
			message,
			companyName,
		});
		await newAnnouncement.save();
		return res.status(201).json(newAnnouncement);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createConversation = async (req, res) => {
	const { participants, conversationType, groupName, companyName } = req.body;
	try {
		const existingConversation = await Conversation.findOne({
			conversationType,
			groupName,
			companyName,
		});
		if (existingConversation) {
			return res.status(201).json(existingConversation);
		}
		if (!existingConversation) {
			const conversation = new Conversation({
				participants,
				conversationType,
				groupName,
				companyName,
			});
			await conversation.save();
			return res.status(201).json(conversation);
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createGroupConversation = async (req, res) => {
	const { participants, groupName } = req.body;

	try {
		const conversation = new Conversation({ participants, groupName });
		await conversation.save();
		return res.status(201).json(conversation);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const getAnnouncement = async (req, res) => {
	const { companyName } = req.params;
	try {
		const announcements = await Announcement.find({
			// companyName,
		}).sort({ createdOn: -1 });

		return res.status(200).json(announcements);
	} catch (error) {
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
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getGroupMessages = async (req, res) => {
	const { groupName } = req.params;
	try {
		const conversation = await Conversation.find({
			groupName,
		})
			.populate("groupMessages")
			.select("groupMessages");
		if (!conversation) {
			return res.status(404).json({ message: "Conversation not found" });
		}
		return res.status(200).json(conversation);
	} catch (error) {
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
	const { id, type } = req.body;
	try {
		if (type === "group") {
			const groupConversations = await getConversations(id, "groupMessages", {
				path: "sender",
				model: "Employee",
				select: "fullName",
			});

			const result = groupConversations.groupMessages.sort((a, b) => a.timestamp - b.timestamp);

			return res.status(200).json(result);
		}
		const oneToOneConversations = await getConversations(id, "messages", [
			{
				path: "sender",
				model: "Employee",
				select: "fullName",
			},
			{
				path: "receiver",
				model: "Employee",
				select: "fullName",
			},
		]);
		const result = oneToOneConversations.messages.sort((a, b) => a.timestamp - b.timestamp);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getConversationByParticipants = async (
	participants,
	companyName,
	conversationType,
	path,
	populate,
) => {
	return await Conversation.find({
		$and: [{ participants: { $all: [participants] } }, { conversationType }, { companyName }],
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
		const userConversations = [];
		const groupConversations = await getConversationByParticipants(
			participants,
			companyName,
			"group",
			"groupMessages",
			{
				path: "sender",
				model: "Employee",
				select: "fullName",
			},
		);

		userConversations.push(...groupConversations);

		const oneToOneConversations = await getConversationByParticipants(
			participants,
			companyName,
			"one-on-one",
			"messages",
			[
				{
					path: "sender",
					model: "Employee",
					select: "fullName",
				},
				{
					path: "receiver",
					model: "Employee",
					select: "fullName",
				},
			],
		);

		userConversations.push(...oneToOneConversations);

		const result = userConversations.sort((a, b) => b.createdOn - a.createdOn);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getOneToOneConversation = async (req, res) => {
	const { userId1, userId2 } = req.body;

	try {
		// const conversations = await Conversation.find({}).populate(
		// 	"participants",
		// 	"groupName",
		// );
		const oneToOneConversations = await Conversation.find({
			$and: [{ participants: { $all: [userId1, userId2] } }, { conversationType: "one-on-one" }],
		})
			.populate("messages")
			.select("messages");
		return res.status(200).json(oneToOneConversations);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createOneToOneMessages = async (req, res) => {
	const { text, senderId, receiverId, companyName } = req.body;

	try {
		const sender = await Employee.findById(senderId);
		const receiver = await Employee.findById(receiverId);
		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId], $size: 2 },
			conversationType: "one-on-one",
			companyName,
		});
		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, receiverId],
				conversationType: "one-on-one",
				companyName,
			});
			await conversation.save();
		}
		const message = new Message({
			sender: senderId,
			receiver: receiverId,
			text,
			timestamp: new Date(),
			conversation: conversation._id,
			companyName,
		});
		await message.save();

		conversation.messages.push(message._id);
		await conversation.save();

		return res.status(201).json(message);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createGroupMessages = async (req, res) => {
	const { senderId, id, text, companyName } = req.body;
	try {
		const sender = await Employee.findById(senderId);
		const conversation = await Conversation.findById(id);

		if (!sender || !conversation) {
			return res.status(404).json({ message: "Sender or conversation group not found" });
		}

		if (conversation.conversationType !== "group") {
			return res.status(409).json({ message: "Conversation is not a group" });
		}

		const message = new Message({
			text,
			sender: senderId,
			timestamp: new Date(),
			groupConversation: id,
			companyName,
		});
		await message.save();

		const senderIndex = conversation.participants.findIndex((id) =>
			id.toString().includes("46436"),
		);
		if (senderIndex === -1) {
			conversation.participants.push(senderId);
		}
		conversation.groupMessages.push(message._id);
		await conversation.save();
		return res.status(201).json(message);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
