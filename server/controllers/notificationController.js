const Notification = require("../models/Notification");

const getNotifications = () => async (req, res) => {
	try {
		const notifications = await Notification.find();
		res.json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createNotification = () => async (req, res) => {
	const notification = new Notification({
		message: req.body.message,
		status: req.body.status,
	});

	try {
		const newNotification = await notification.save();
		res.status(201).json(newNotification);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createNotification, getNotifications };
