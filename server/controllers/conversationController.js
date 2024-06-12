const Conversation = require("../models/Conversation");
const Employee = require("../models/Employee");
const Message = require("../models/Message");

const getConversationById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const conversation = await Conversation.findById(id).populate("messages");
		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}
		const messages =
			conversation.type === "one-on-one"
				? await Message.find({ conversation: id })
				: await Message.find({ groupConversation: id });

		res.status(200).json(messages);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createConversationTwoUsers = () => async (req, res) => {
	const { userId1, userId2, text } = req.body;
	try {
		let existingConversation = await Conversation.findOne({
			$or: [
				{ participants: [userId1, userId2] },
				{ participants: [userId2, userId1] },
			],
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

		res.status(201).json(existingConversation);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const createConversation = (io) => async (req, res) => {
	const { participants, conversationType, groupName, companyName } = req.body;
	try {
		const existingConversation = await Conversation.findOne({
			conversationType,
			groupName,
			companyName,
		});
		if (existingConversation) {
			res.status(201).json(existingConversation);
		}
		if (!existingConversation) {
			const conversation = new Conversation({
				participants,
				conversationType,
				groupName,
				companyName,
			});
			await conversation.save();
			res.status(201).json(conversation);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const createGroupConversation = () => async (req, res) => {
	const { participants, groupName } = req.body;
	const conversation = new Conversation({ participants, groupName });

	try {
		await conversation.save();
		res.status(201).json(conversation);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const getGroupConversation = () => async (req, res) => {
	try {
		const conversations = await Conversation.find({
			conversationType: "group",
		}).populate("groupMessages");
		res.status(200).json(conversations);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllUserConversations = () => async (req, res) => {
	const { id, name } = req.params;
	try {
		const userConversations = [];
		const groupConversations = await Conversation.find({
			$and: [
				{ participants: { $all: [id] } },
				{ conversationType: "group" },
				{ companyName: name },
			],
		})
			.populate({
				path: "groupMessages",
				populate: {
					path: "sender",
					model: "Employee",
					select: "fullName",
				},
			})
			.populate({
				path: "participants",
				model: "Employee",
				select: "fullName",
			});

		userConversations.push(...groupConversations);

		const oneToOneConversations = await Conversation.find({
			$and: [
				{ participants: { $all: [id] } },
				{ conversationType: "one-on-one" },
				{ companyName: name },
			],
		})
			.populate({
				path: "messages",
				populate: [
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
			})
			.populate({
				path: "participants",
				model: "Employee",
				select: "fullName",
			});

		userConversations.push(...oneToOneConversations);

		const result = userConversations.sort((a, b) => b.createdOn - a.createdOn);

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupConversationById = () => async (req, res) => {
	const id = req.params.id;
	try {
		const conversation = await Conversation.find({
			groupName: id,
		}).populate("groupMessages");
		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}
		res.status(200).json(conversation);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getOneToOneConversationById = () => async (req, res) => {
	const { userId1, userId2 } = req.body;

	try {
		// const conversations = await Conversation.find({}).populate(
		// 	"participants",
		// 	"groupName",
		// );
		const oneToOneConversations = await Conversation.find({
			$and: [
				{ participants: { $all: [userId1, userId2] } },
				{ conversationType: "one-on-one" },
			],
		}).populate("messages");
		res.status(200).json(oneToOneConversations);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createMessages = () => async (req, res) => {
	const { text, senderId, receiverId, companyName } = req.body;

	try {
		const sender = await Employee.findById(senderId);
		const receiver = await Employee.findById(receiverId);
		if (!sender || !receiver) {
			return res.status(404).json({ error: "Sender or receiver not found" });
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

		res.status(201).json(message);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const createGroupMessages = (io) => async (req, res) => {
	const { senderId, id, text, companyName } = req.body;
	try {
		const sender = await Employee.findById(senderId);
		const conversation = await Conversation.findById(id);

		if (!sender || !conversation) {
			return res
				.status(404)
				.json({ error: "Sender or conversation group not found" });
		}

		if (conversation.conversationType !== "group") {
			return res.status(400).json({ error: "Conversation is not a group" });
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
		res.status(201).json(message);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const getConversationMessageById = () => async (req, res) => {
	const { id, type } = req.body;
	try {
		if (type === "group") {
			const groupConversations = await Conversation.findById(id)
				.populate({
					path: "groupMessages",
					populate: {
						path: "sender",
						model: "Employee",
						select: "fullName",
					},
				})
				.populate({
					path: "participants",
					model: "Employee",
					select: "fullName",
				});
			const result = groupConversations.groupMessages.sort(
				(a, b) => a.timestamp - b.timestamp,
			);

			res.status(200).json(result);
		} else {
			const oneToOneConversations = await Conversation.findById(id)
				.populate({
					path: "messages",
					populate: [
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
				})
				.populate({
					path: "participants",
					model: "Employee",
					select: "fullName",
				});

			const result = oneToOneConversations.messages.sort(
				(a, b) => a.timestamp - b.timestamp,
			);

			res.status(200).json(result);
		}
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	createConversation,
	getConversationById,
	getGroupConversationById,
	getOneToOneConversationById,
	createMessages,
	createGroupConversation,
	getGroupConversation,
	createConversationTwoUsers,
	createGroupMessages,
	getAllUserConversations,
	getConversationMessageById,
};
