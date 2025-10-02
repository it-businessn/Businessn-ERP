const Contact = require("../models/Contact");
const Meeting = require("../models/Meeting");

const getMeetings = async (req, res) => {
	try {
		const meetings = await Meeting.find({}).sort({
			createdOn: -1,
		});
		return res.status(200).json(meetings);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getMeeting = async (req, res) => {
	const { contactId } = req.params;

	try {
		const meeting = await Meeting.find({ contactId }).sort({
			createdOn: -1,
		});
		return res.status(200).json(meeting);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const addMeeting = async (req, res) => {
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
		const data = {
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
		};
		const existingRecord = await Meeting.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Meeting already exists" });
		}
		const newMeeting = await Meeting.create(data);
		const contact = await Contact.findById(contactId);
		contact.meetings.push(newMeeting._id);

		await contact.save();
		return res.status(201).json(newMeeting);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateMeeting = async (req, res) => {
	const { meetingId } = req.params;

	try {
		const updatedMeeting = await Meeting.findByIdAndUpdate(
			meetingId,
			{ $set: req.body },
			{
				new: true,
			},
		);

		return res.status(201).json(updatedMeeting);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	addMeeting,
	getMeeting,
	getMeetings,
	updateMeeting,
};
