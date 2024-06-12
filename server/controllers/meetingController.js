const Contact = require("../models/Contact");
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
		createdBy,
		companyName,
	} = req.body;

	try {
		const newMeeting = await Meeting.create({
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
			createdBy,
			companyName,
		});
		const contact = await Contact.findById(contactId);
		contact.meetings.push(newMeeting._id);

		await contact.save();
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
