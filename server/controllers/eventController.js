const Employee = require("../models/Employee");
const Event = require("../models/Event");

const getEvents = async (req, res) => {
	try {
		const events = await Event.find({}).sort({ createdOn: -1 });
		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCompanyEvents = async (req, res) => {
	const { companyName } = req.params;

	try {
		const events = await Event.find({ companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getUser = async (fullName) => await Employee.findOne({ fullName }).select("_id");

const getUserCalendarEvent = async (req, res) => {
	const { userName, companyName } = req.params;
	try {
		const user = await getUser(userName);
		const events = await Event.find({
			companyName,
			$or: [{ meetingAttendees: userName }, { createdBy: user._id }],
		}).sort({
			createdOn: -1,
		});
		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getUserEvent = async (req, res) => {
	const { eventType, userName, companyName } = req.params;
	try {
		const user = await getUser(userName);
		const events = await Event.find({
			eventType,
			companyName,
			$or: [{ meetingAttendees: userName }, { createdBy: user._id }],
		}).sort({
			createdOn: -1,
		});
		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEvent = async (req, res) => {
	const { eventType, companyName } = req.params;
	try {
		const events = await Event.find({ eventType, companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createEvent = async (req, res) => {
	try {
		const existData = await Event.findOne(req.body);
		if (existData) {
			return res.status(409).json({ message: "Event already exists" });
		}
		const newEvent = await Event.create(req.body);
		return res.status(201).json(newEvent);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateEvent = async (req, res) => {
	const { id } = req.params;
	try {
		if (req.body?._id) delete req.body._id;
		const event = await Event.findByIdAndUpdate(id, { $set: req.body }, { new: true });
		return res.status(200).json(event);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createEvent,
	getEvents,
	getEvent,
	updateEvent,
	getCompanyEvents,
	getUserEvent,
	getUserCalendarEvent,
};
