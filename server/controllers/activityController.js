const moment = require("moment");
const Contact = require("../models/Contact");
const LogActivity = require("../models/LogActivity");

const getActivity = async (req, res) => {
	const { createdBy, companyName } = req.params;
	try {
		const activities = await LogActivity.find({ createdBy, companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(activities);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getActivityById = async (req, res) => {
	const { contactId } = req.params;

	try {
		// const notes = (await LogActivity.find({ contactId })).sort((a, b) => b.createdOn - a.createdOn);
		const notes = await LogActivity.find({ contactId }).sort({
			createdOn: -1,
		});
		return res.status(200).json(notes);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getFilterRange = (filter) => {
	const isToday = filter === "Daily";
	const isWeekly = filter === "Weekly";
	const isMonthly = filter === "Monthly";
	const isQuarterly = filter === "Quarterly";
	const isAnnual = filter === "Annual";

	if (isQuarterly) {
		const currentQuarter = moment().quarter(); //current quarter 1,2,3,4

		let startOfQuarter;
		let endOfQuarter;

		switch (currentQuarter) {
			case 1:
				startOfQuarter = moment().startOf("year").toDate();
				endOfQuarter = moment().month(2).endOf("month").toDate(); // March 31st
				break;
			case 2:
				startOfQuarter = moment().month(3).startOf("month").toDate(); // April 1st
				endOfQuarter = moment().month(5).endOf("month").toDate(); // June 30th
				break;
			case 3:
				startOfQuarter = moment().month(6).startOf("month").toDate(); // July 1st
				endOfQuarter = moment().month(8).endOf("month").toDate(); // September 30th
				break;
			case 4:
				startOfQuarter = moment().month(9).startOf("month").toDate(); // October 1st
				endOfQuarter = moment().month(11).endOf("month").toDate(); // December 31st
				break;
		}
		return { startOfDay: startOfQuarter, endOfDay: endOfQuarter };
	}

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
	return { startOfDay, endOfDay };
};

const getActivityRange = async (req, res) => {
	const { createdBy, companyName, filter } = req.params;

	const { startOfDay, endOfDay } = getFilterRange(filter);

	try {
		const result = await LogActivity.find({
			createdBy,
			companyName,
			createdOn: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		}).select("type");
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createActivity = async (req, res) => {
	const { contactId, createdBy, description, duration, type, companyName } = req.body;

	try {
		const data = {
			contactId,
			createdBy,
			description,
			duration,
			type,
			companyName,
		};
		const existingRecord = await LogActivity.findOne(data);

		if (existingRecord) {
			return res.status(409).json({ message: "Log Activity already exists" });
		}
		const newActivity = await LogActivity.create(data);
		saveContactActivities(contactId, companyName, newActivity._id);

		return res.status(201).json(newActivity);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const saveContactActivities = async (contactId, companyName, activity) => {
	const contact = await Contact.findOne({
		$or: [
			{ _id: contactId, companyName },
			{ leadId: contactId, companyName },
		],
	});
	contact.activities.push(activity);

	await contact.save();
};

module.exports = {
	createActivity,
	getActivity,
	getActivityById,
	getActivityRange,
};
