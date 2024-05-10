const Contact = require("../models/Contact");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");
const LeadCompany = require("../models/LeadCompany");

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
		const leads = (
			await Lead.find({ isDisbursed: true, isDisbursedConfirmed: false })
		).sort((a, b) => b.createdOn - a.createdOn);
		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getNotDisbursedLeads = () => async (req, res) => {
	try {
		const leads = (await Lead.find({ isDisbursed: false })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);

		res.status(200).json(leads);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getLeadCompanies = () => async (req, res) => {
	try {
		const leadCompanies = await LeadCompany.find({});

		res.status(200).json(leadCompanies);
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
	const { companyName } = req.body;

	try {
		const newLeadCompany = await LeadCompany.create({
			name: companyName,
		});

		res.status(201).json(newLeadCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createMultipleLeadOpportunity = () => async (req, res) => {
	const { newRecord } = req.body;

	let leadsCreated = 0;
	try {
		for (const rowData of newRecord) {
			const {
				abbreviation,
				address,
				companyName,
				email,
				industry,
				opportunityName,
				phone,
			} = rowData;

			const { streetNumber, city, state, postalCode, country } = address;
			await Lead.create({
				abbreviation,
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
		const { stage } = req.body;
		if (stage === "T4" && updatedLead) {
			await Contact.create({ leadId: updatedLead._id });
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
};
