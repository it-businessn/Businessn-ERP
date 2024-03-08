const Activity = require("../models/Activity");

const getActivity = () => async (req, res) => {
	try {
		const activities = (await Activity.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(activities);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getActivityById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await Activity.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createActivity = () => async (req, res) => {
	const { contactId, description, duration, phoneCalls, type } = req.body;

	const activity = new Activity({
		contactId,
		date: Date.now(),
		description,
		duration,
		phoneCalls,
		type,
	});

	try {
		const newActivity = await activity.save();
		res.status(201).json(newActivity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createActivity, getActivity, getActivityById };
