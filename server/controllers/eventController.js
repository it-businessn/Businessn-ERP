const Employee = require("../models/Employee");
const Event = require("../models/Event");

const getEvents = async (req, res) => {
	try {
		const events = await Event.find({}).sort({ createdOn: -1 });
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEvents = async (req, res) => {
	const { companyName } = req.params;

	try {
		const events = await Event.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getUserEvent = async (req, res) => {
	const { eventType, userName, companyName } = req.params;
	try {
		const user = await Employee.findOne({ fullName: userName }).select("_id");
		const events = await Event.find({
			eventType,
			companyName,
			meetingAttendees: userName,
			createdBy: user._id,
		}).sort({
			createdOn: -1,
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getEvent = async (req, res) => {
	const { eventType, companyName } = req.params;
	try {
		const events = await Event.find({ eventType, companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createEvent = async (req, res) => {
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
		companyName,
		createdBy,
	} = req.body;
	try {
		const newEvent = await Event.create({
			description,
			eventType,
			meetingAttendees,
			fromDate,
			fromTime,
			toDate,
			toTime,
			eventLink,
			location,
			companyName,
			createdBy,
		});
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEvent = async (req, res) => {
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
	getEvent,
	updateEvent,
	getCompanyEvents,
	getUserEvent,
};
