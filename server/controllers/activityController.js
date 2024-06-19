const moment = require("moment");
const Contact = require("../models/Contact");
const LogActivity = require("../models/LogActivity");

const getActivity = () => async (req, res) => {
	const { id, name } = req.params;
	try {
		const activities = (
			await LogActivity.find({ createdBy: id, companyName: name })
		).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(activities);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getActivityById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await LogActivity.find({ contactId: id })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getActivityByUserId = () => async (req, res) => {
	const { id, name, filter } = req.params;
	const isToday = filter === "Daily";
	const isWeekly = filter === "Weekly";
	const isMonthly = filter === "Monthly";
	const isQuarterly = filter === "Quarterly";
	const isAnnual = filter === "Annual";
	const startOfDay = isToday
		? moment().startOf("day").toDate()
		: isWeekly
		? moment().startOf("week").toDate()
		: isMonthly
		? moment().startOf("month").toDate()
		: isAnnual
		? moment().startOf("year").toDate()
		: null;
	const endOfDay = isToday
		? moment().endOf("day").toDate()
		: isWeekly
		? moment().endOf("week").toDate()
		: isMonthly
		? moment().endOf("month").toDate()
		: isAnnual
		? moment().endOf("year").toDate()
		: null;

	try {
		const logs = await LogActivity.find({
			createdBy: id,
			companyName: name,
			createdOn: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});
		res.status(200).json(logs);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createActivity = () => async (req, res) => {
	const { contactId, createdBy, description, duration, type, companyName } =
		req.body;

	try {
		const newActivity = await LogActivity.create({
			contactId,
			createdBy,
			description,
			duration,
			type,
			companyName,
		});
		const contact = await Contact.findOne({
			$or: [
				{ _id: contactId, companyName },
				{ leadId: contactId, companyName },
			],
		});
		contact.activities.push(newActivity._id);

		await contact.save();

		res.status(201).json(newActivity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createActivity,
	getActivity,
	getActivityById,
	getActivityByUserId,
};
