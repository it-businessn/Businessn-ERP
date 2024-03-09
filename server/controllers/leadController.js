const Lead = require("../models/Lead");

const getOpportunities = () => async (req, res) => {
	try {
		const leads = (await Lead.find()).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createLeadOpportunity = () => async (req, res) => {
	const {
		abbreviation,
		email,
		opportunityName,
		primaryAssignee,
		stage,
		supervisorAssignee,
	} = req.body;

	const lead = new Lead({
		abbreviation,
		email,
		opportunityName,
		primaryAssignee,
		stage,
		supervisorAssignee,
	});

	try {
		const newLeadOpportunity = await lead.save();
		res.status(201).json(newLeadOpportunity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createLeadOpportunity, getOpportunities };
