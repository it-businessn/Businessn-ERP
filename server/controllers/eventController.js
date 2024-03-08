const Event = require("../models/Event");

const getEvents = () => async (req, res) => {
	try {
		const events = await Event.find({}).sort({ date: -1 });
		res.status(200).json(events);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createEvent = () => async (req, res) => {
	const event = new Event({
		date: Date.now(),
		description: req.body?.description,
		eventType: req.body?.title,
		meetingAttendees: req.body?.meetingAttendees,
		meetingFromDate: req.body?.meetingFromDate,
		meetingFromTime: req.body?.meetingFromTime,
		meetingLink: req.body?.meetingLink,
		meetingLocation: req.body?.meetingLocation,
		meetingToDate: req.body?.meetingToDate,
		meetingToTime: req.body?.meetingToTime,
		phoneNo: req.body?.phoneNo,
		taskAssignee: req.body?.taskAssignee,
		taskDueDate: req.body?.taskDueDate,
		taskDuration: req.body?.taskDuration,
		taskType: req.body?.taskType,
	});

	try {
		const newEvent = await event.save();
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createEvent, getEvents };
