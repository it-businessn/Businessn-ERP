const Event = require("../models/Event");

const getEvents = () => async (req, res) => {
	try {
		const events = await Event.find({}).sort({ createdOn: -1 });
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getCompEvents = () => async (req, res) => {
	const { id } = req.params;
	try {
		const events = await Event.find({ companyName: id }).sort({
			createdOn: -1,
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getEventsByType = () => async (req, res) => {
	const { id, name } = req.params;
	try {
		const events = await Event.find({ eventType: id, companyName: name }).sort({
			createdOn: -1,
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createEvent = () => async (req, res) => {
	const {
		description,
		eventType,
		meetingAttendees,
		fromDate,
		fromTime,
		toDate,
		toTime,
		eventLink,
		location,
	} = req.body;
	try {
		const event = new Event({
			description,
			eventType,
			meetingAttendees,
			fromDate,
			fromTime,
			toDate,
			toTime,
			eventLink,
			location,
		});
		const newEvent = await event.save();
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEvent = () => async (req, res) => {
	const { id } = req.params;
	try {
		const event = await Event.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true },
		);
		res.status(200).json(event);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

module.exports = {
	createEvent,
	getEvents,
	getEventsByType,
	updateEvent,
	getCompEvents,
};
