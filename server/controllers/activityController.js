const moment = require("moment");
const mongoose = require("mongoose");
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
		console.error(error);
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
		console.error(error);
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
	const now = moment();

	const startOfDay = isToday
		? now.clone().startOf("day").toDate()
		: isWeekly
			? now.clone().startOf("week").toDate()
			: isMonthly
				? now.clone().startOf("month").toDate()
				: isAnnual
					? now.clone().startOf("year").toDate()
					: null;

	const endOfDay = isToday
		? now.clone().endOf("day").toDate()
		: isWeekly
			? now.clone().endOf("week").toDate()
			: isMonthly
				? now.clone().endOf("month").toDate()
				: isAnnual
					? now.clone().endOf("year").toDate()
					: null;
	return { startOfDay, endOfDay };
};

const getActivityRange = async (req, res) => {
	const { createdBy, companyName, filter } = req.params;

	const { startOfDay, endOfDay } = getFilterRange(filter);

	if (!startOfDay || !endOfDay) {
		return res.status(400).json({ message: "Invalid filter value" });
	}

	try {
		const result = await LogActivity.find({
			createdBy,
			companyName,
			createdOn: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		})
			.select("type")
			.lean();

		return res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching activity range:", error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const createActivity = async (req, res) => {
	const { contactId, createdBy, description, duration, type, companyName } = req.body;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const data = {
			contactId,
			createdBy,
			description,
			duration,
			type,
			companyName,
		};

		const existingRecord = await LogActivity.findOne(data).session(session);

		if (existingRecord) {
			await session.abortTransaction();
			return res.status(409).json({ message: "Log Activity already exists" });
		}

		const newActivity = await LogActivity.create([data], { session });

		await saveContactActivities(contactId, companyName, newActivity[0]._id, session);

		await session.commitTransaction();

		return res.status(201).json(newActivity[0]);
	} catch (error) {
		await session.abortTransaction();
		console.error(error);

		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	} finally {
		session.endSession();
	}
};

const saveContactActivities = async (contactId, companyName, activity, session) => {
	try {
		const contact = await Contact.findOne({
			$or: [
				{ _id: contactId, companyName },
				{ leadId: contactId, companyName },
			],
		}).session(session);

		if (!contact) {
			throw new Error("Contact not found");
		}

		contact.activities.push(activity);

		await contact.save({ session });
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createActivity,
	getActivity,
	getActivityById,
	getActivityRange,
};
