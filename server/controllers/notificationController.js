const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({});
		return res.status(200).json(notifications);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createNotification = async (req, res) => {
	try {
		const data = {
			message: req.body.message,
			status: req.body.status,
		};

		const existingRecord = await Notification.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Notification already exists" });
		}
		const newNotification = await Notification.create(data);
		return res.status(201).json(newNotification);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = { createNotification, getNotifications };
