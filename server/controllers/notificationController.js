const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({});
		res.json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createNotification = async (req, res) => {
	try {
		const newNotification = await Notification.create({
			message: req.body.message,
			status: req.body.status,
		});
		res.status(201).json(newNotification);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createNotification, getNotifications };
