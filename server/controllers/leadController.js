const Contact = require("../models/Contact");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");
const LeadCompany = require("../models/LeadCompany");

const getGroupedOpportunities = () => async (req, res) => {
	try {
		const leadsByMonth = await Lead.aggregate([
			{
				$group: {
					_id: { $month: "$createdOn" },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);
		const pipelineLeads = await Lead.find({
			stage: { $in: ["T1", "T2", "T3", "T4"] },
		});

		const salesMade = await Lead.find({
			stage: { $in: ["T3", "T4"] },
		});
		const leadCounts = leadsByMonth.map((item) => ({
			month: item._id,
			count: item.count,
			pipeline: pipelineLeads.length,
			salesMade: salesMade.length,
		}));
		res.status(200).json(leadCounts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getGroupedOpportunitiesByCompany = () => async (req, res) => {
	const { id } = req.params;
	try {
		const leadsByMonth = await Lead.aggregate([
			{
				$match: { companyName: id },
			},
			{
				$group: {
					_id: { $month: "$createdOn" },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);
		const pipelineLeads = await Lead.find({
			stage: { $in: ["T1", "T2", "T3", "T4"] },
			companyName: id,
		});

		const salesMade = await Lead.find({
			stage: { $in: ["T3", "T4"] },
			companyName: id,
		});
		const leadCounts = leadsByMonth.map((item) => ({
			month: item._id,
			count: item.count,
			pipeline: pipelineLeads.length,
			salesMade: salesMade.length,
		}));
		res.status(200).json(leadCounts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getOpportunities = () => async (req, res) => {
	const { id } = req.params;
	// const updatedData = { companyName: "Fractional Departments Inc." };
	// const updatedLeads = await Lead.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);
	try {
		const leads = (await Lead.find({ companyName: id })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getDisbursedLeads = () => async (req, res) => {
	const { id } = req.params;
	try {
		const leads = (
			await Lead.find({
				companyName: id,
				isDisbursed: true,
				isDisbursedConfirmed: false,
			})
		).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getNotDisbursedLeads = () => async (req, res) => {
	const { id } = req.params;
	try {
		const leads = (
			await Lead.find({ isDisbursed: false, companyName: id })
		).sort((a, b) => b.createdOn - a.createdOn);

		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getLeadCompanies = () => async (req, res) => {
	const { id } = req.params;
	try {
		const leadCompanies = await LeadCompany.find({ companyName: id });

		res.status(200).json(leadCompanies);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getConfirmedDisbursedLeads = () => async (req, res) => {
	const { id } = req.params;
	try {
		// const leads = (await Lead.find({ isDisbursedConfirmed: true })).sort(
		// 	(a, b) => b.createdOn - a.createdOn,
		// );
		// const leads = (await Lead.find({ isDisbursedConfirmed: true })).sort(
		// 	(a, b) => b.createdOn - a.createdOn,
		// );
		const leads = await Lead.find({
			companyName: id,
			stage: { $in: ["L1", "L2", "L3", "L4"] },
		});
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTargetLeads = () => async (req, res) => {
	const { id } = req.params;
	try {
		const leads = await Lead.find({
			companyName: id,
			stage: { $in: ["T1", "T2", "T3", "T4"] },
		});
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getLeadInfo = () => async (req, res) => {
	const { id, name } = req.params;
	try {
		const lead = await Lead.findOne({
			_id: id,
			companyName: name,
		});
		res.status(200).json(lead);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createLeadOpportunity = () => async (req, res) => {
	const {
		abbreviation,
		address,
		name,
		companyName,
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

	const { streetNumber, city, state, postalCode, country } = address;

	try {
		const newLeadOpportunity = await Lead.create({
			abbreviation,
			name,
			companyName,
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
			address: { streetNumber, city, state, postalCode, country },
		});

		res.status(201).json(newLeadOpportunity);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const createLeadCompany = () => async (req, res) => {
	const { name, companyName } = req.body;

	try {
		const newLeadCompany = await LeadCompany.create({
			name,
			companyName,
		});

		res.status(201).json(newLeadCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createMultipleLeadOpportunity = () => async (req, res) => {
	const { newRecord, companyName } = req.body;

	let leadsCreated = 0;
	try {
		for (const rowData of newRecord) {
			const {
				abbreviation,
				address,
				name,
				email,
				industry,
				opportunityName,
				phone,
			} = rowData;

			const { streetNumber, city, state, postalCode, country } = address;
			await Lead.create({
				abbreviation,
				name,
				companyName,
				email,
				industry,
				opportunityName,
				phone,
				primaryAssignee: [],
				productService: [],
				region: "",
				source: "",
				stage: "",
				supervisorAssignee: [],
				address: { streetNumber, city, state, postalCode, country },
			});
			leadsCreated++;
		}

		const leads = (await Lead.find({ isDisbursed: false })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(leads);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateLeadDisburseStatus = async (id, salesperson) => {
	try {
		const updatedData = { isDisbursed: true, disbursedTo: salesperson };
		return await Lead.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
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
		const updatedData = { isDisbursed: true };
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

	// try {
	// 	const leads = await Lead.find({ _id: { $in: distributedLeadIDs } }).sort({
	// 		createdOn: -1,
	// 	});

	// 	// const distributedLeads = distributeLeadsAmongTeamMembers(leads);
	// 	res.status(201).json(distributedLeads);
	// } catch (error) {
	// 	res.status(400).json({ message: error.message });
	// }
};

const confirmDisburseLeads = () => async (req, res) => {
	const distributedLeadIDs = req.body;

	try {
		for (const id of distributedLeadIDs) {
			const leads = await Lead.find({
				isDisbursedConfirmed: false,
				isDisbursed: true,
			});
			const employee = await Employee.findById(id._id);
			const slicedLeads = leads.slice(0, id.assignedLeads);
			employee.leads = leads.slice(0, id.assignedLeads).map((lead) => lead._id);

			await employee.save();

			for (const id of slicedLeads) {
				const lead = await Lead.findById(id._id);
				lead.isDisbursedConfirmed = true;
				lead.stage = "L1";
				lead.primaryAssignee = employee.fullName;
				await lead.save();
			}
		}
		res.status(201).json("Disbursement confirmed successfully");
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateLeadInfo = () => async (req, res) => {
	const { id } = req.params;

	try {
		const updatedLead = await Lead.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true },
		);
		const existingContact = await Contact.find({ leadId: updatedLead._id });

		if (!existingContact.length) {
			await Contact.create({
				leadId: updatedLead._id,
				companyName: req.body.companyName,
			});
		}

		res.status(201).json(updatedLead);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const deleteLead = async (req, res) => {
	const { id } = req.params;
	try {
		const lead = await Lead.findByIdAndDelete({
			_id: id,
		});
		if (lead) {
			res.status(200).json(`lead with id ${id} deleted successfully.`);
		} else {
			res.status(200).json("lead Details not found.");
		}
	} catch (error) {
		res.status(404).json({ error: "Error deleting lead:", error });
	}
};

module.exports = {
	confirmDisburseLeads,
	createLeadOpportunity,
	disburseLeads,
	getConfirmedDisbursedLeads,
	getDisbursedLeads,
	getOpportunities,
	getNotDisbursedLeads,
	updateLeadInfo,
	createMultipleLeadOpportunity,
	deleteLead,
	getLeadCompanies,
	createLeadCompany,
	getGroupedOpportunities,
	getTargetLeads,
	getGroupedOpportunitiesByCompany,
	getLeadInfo,
};
