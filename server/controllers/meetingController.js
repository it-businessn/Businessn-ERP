const Meeting = require("../models/Meeting");

const getMeetings = () => async (req, res) => {
	try {
		const meetings = (await Meeting.find()).sort((a, b) => b.date - a.date);
		res.status(200).json(meetings);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getMeetingById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const meeting = (await Meeting.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(meeting);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addMeeting = () => async (req, res) => {
	const {
		attendees,
		contactId,
		description,
		fromDate,
		fromTime,
		location,
		meetingLink,
		toDate,
		toTime,
		type,
	} = req.body;

	const meeting = new Meeting({
		attendees,
		contactId,
		date: Date.now(),
		description,
		fromDate,
		fromTime,
		location,
		meetingLink,
		toDate,
		toTime,
		type,
	});

	try {
		const newMeeting = await meeting.save();
		res.status(201).json(newMeeting);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateMeeting = () => async (req, res) => {
	const meetingId = req.params.id;

	try {
		const updatedMeeting = await Meeting.findByIdAndUpdate(
			meetingId,
			req.body,
			{
				new: true,
			},
		);

		res.status(201).json(updatedMeeting);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { addMeeting, getMeetingById, getMeetings, updateMeeting };
