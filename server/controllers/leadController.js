const Lead = require("../models/Lead");

const getOpportunities = () => async (req, res) => {
	try {
		const leads = (await Lead.find()).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getDisbursedLeads = () => async (req, res) => {
	try {
		const leads = (await Lead.find({ isDisbursed: true })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getConfirmedDisbursedLeads = () => async (req, res) => {
	try {
		const leads = (await Lead.find({ isDisbursedConfirmed: true })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createLeadOpportunity = () => async (req, res) => {
	const {
		abbreviation,
		address,
		email,
		industry,
		opportunityName,
		phone,
		primaryAssignee,
		productService,
		region,
		source,
		stage,
		supervisorAssignee,
	} = req.body;

	const lead = new Lead({
		abbreviation,
		address,
		email,
		industry,
		opportunityName,
		phone,
		primaryAssignee,
		productService,
		region,
		source,
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

const updateLeadDisburseStatus = async (id, salesperson) => {
	try {
		const updatedData = { isDisbursed: true, disbursedTo: salesperson };
		const updatedLead = await Lead.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		return updatedLead;
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const distributeLeadsAmongTeamMembers = (leads) => {
	const distributedLeads = {};
	const salesTeamMembers = ["Salesperson1", "Salesperson2", "Salesperson3"];

	leads.forEach((lead, index) => {
		const salesperson = salesTeamMembers[index % salesTeamMembers.length];

		if (!distributedLeads[salesperson]) {
			distributedLeads[salesperson] = [];
		}

		distributedLeads[salesperson].push(lead);
		updateLeadDisburseStatus(lead._id, salesperson);
	});

	return distributedLeads;
};

const disburseLeads = () => async (req, res) => {
	const distributedLeadIDs = req.body;

	try {
		const leads = await Lead.find({ _id: { $in: distributedLeadIDs } }).sort({
			createdOn: -1,
		});

		const distributedLeads = distributeLeadsAmongTeamMembers(leads);
		res.status(201).json(distributedLeads);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const confirmDisburseLeads = () => async (req, res) => {
	const distributedLeadIDs = req.body;

	try {
		const updatedData = { isDisbursedConfirmed: true };
		const updatedLeads = await Lead.updateMany(
			{ _id: { $in: distributedLeadIDs } },
			{ $set: updatedData },
		).sort({
			createdOn: -1,
		});

		res.status(201).json(updatedLeads);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	confirmDisburseLeads,
	createLeadOpportunity,
	disburseLeads,
	getConfirmedDisbursedLeads,
	getDisbursedLeads,
	getOpportunities,
};
