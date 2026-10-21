const Contact = require("../models/Contact");
const Employee = require("../models/Employee");
const Lead = require("../models/Lead");
const LeadCompany = require("../models/LeadCompany");
const Company = require("../models/Company");
const mongoose = require("mongoose");
const { getScopedCompanyNames } = require("../middleware/authorize");

const getGroupedOpportunities = async (req, res) => {
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
		return res.status(200).json(leadCounts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getGroupedOpportunitiesByCompany = async (req, res) => {
	const { companyName } = req.params;
	try {
		const leadsByMonth = await Lead.aggregate([
			{
				$match: { companyName },
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
			companyName,
		});

		const salesMade = await Lead.find({
			stage: { $in: ["T3", "T4"] },
			companyName,
		});

		const leadCounts = leadsByMonth.map((item) => ({
			month: item._id,
			count: item.count,
			pipeline: pipelineLeads.length,
			salesMade: salesMade.length,
		}));
		return res.status(200).json(leadCounts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getOpportunityNames = async (req, res) => {
	const { companyName } = req.params;
	try {
		const leads = await Lead.find({ companyName })
			.select("opportunityName")
			.sort({ createdOn: -1 });
		return res.status(200).json(leads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getOpportunities = async (req, res) => {
	const { companyName, filter } = req.params;
	// const updatedData = { companyName: "Fractional Departments Inc." };
	// const updatedLeads = await Lead.updateMany({}, { $set: updatedData });
	// console.log(updatedLeads);
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;

		const skip = (page - 1) * limit;
		const leads = await Lead.find({ companyName }).skip(skip).limit(limit).sort({ createdOn: -1 });
		const totalLeads = await Lead.countDocuments({ companyName });

		return res.status(200).json({
			page,
			limit,
			total: totalLeads,
			totalPages: Math.ceil(totalLeads / limit),
			items: leads,
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getDisbursedLeads = async (req, res) => {
	const { companyName } = req.params;
	try {
		// NEW-09: .sort() was applied to the resolved array (Array.prototype.sort
		// with an object -> TypeError), so this endpoint always answered 500.
		const leads = await Lead.find({
			companyName,
			isDisbursed: true,
			isDisbursedConfirmed: false,
		})
			.select("_id")
			.sort({ createdOn: -1 });
		return res.status(200).json(leads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getLeadsNotDisbursed = async (req, res) => {
	const { companyName, filter } = req.params;
	try {
		const totalLeads = await Lead.countDocuments({ isDisbursed: false, companyName });

		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;

		const skip = (page - 1) * limit;
		const leads = await Lead.find({ isDisbursed: false, companyName })
			.skip(skip)
			.limit(limit)
			.sort({ createdOn: -1 });

		return res.status(200).json({
			page,
			limit,
			total: totalLeads,
			totalPages: Math.ceil(totalLeads / limit),
			items: leads,
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getLeadCompanies = async (req, res) => {
	const { companyName } = req.params;
	try {
		const leadCompanies = await LeadCompany.find({ companyName }).select("name");
		return res.status(200).json(leadCompanies);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getConfirmedDisbursedLeads = async (req, res) => {
	const { companyName } = req.params;
	try {
		// const leads = (await Lead.find({ isDisbursedConfirmed: true })).sort(
		// 	(a, b) => b.createdOn - a.createdOn,
		// );
		const leads = await Lead.find({
			companyName,
			stage: { $in: ["L1", "L2", "L3", "L4"] },
		});
		return res.status(200).json(leads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getTargetLeads = async (req, res) => {
	const { companyName } = req.params;
	try {
		const leads = await Lead.find({
			companyName,
			stage: { $in: ["T1", "T2", "T3", "T4"] },
		});
		return res.status(200).json(leads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getLead = async (req, res) => {
	const { id, companyName } = req.params;
	try {
		const lead = await Lead.findOne({
			_id: id,
			companyName,
		});
		return res.status(200).json(lead);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const updateLeadCompany = async (name, companyName) => {
	// NEW-16: the lookup was by name only, so another tenant's record with the same
	// name was returned (and none was created for this tenant). Without a company
	// the filter would match any tenant, so nothing is looked up or created.
	if (typeof companyName !== "string" || !companyName.trim()) return null;
	const existingRecord = await LeadCompany.findOne({
		name,
		companyName,
	});

	if (!existingRecord) {
		const newLeadCompany = await LeadCompany.create({
			name,
			companyName,
		});
		return newLeadCompany;
	}
	return existingRecord;
};
const createLeadOpportunity = async (req, res) => {
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

	try {
		const data = {
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
		};
		const existingRecord = await Lead.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Lead already exists" });
		}
		data.address = {
			streetNumber: address?.streetNumber,
			city: address?.city,
			state: address?.state,
			postalCode: address?.postalCode,
			country: address?.country,
		};
		const newLeadOpportunity = await Lead.create(data);

		updateLeadCompany(name, companyName);

		const existingContact = await Contact.findOne({
			leadId: newLeadOpportunity._id,
		});

		if (!existingContact) {
			await Contact.create({
				leadId: newLeadOpportunity._id,
				companyName,
			});
		}
		return res.status(201).json(newLeadOpportunity);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const createLeadCompany = async (req, res) => {
	const { name, companyName } = req.body;
	if (typeof companyName !== "string" || !companyName.trim()) {
		return res.status(400).json({ message: "companyName is required" });
	}

	try {
		const newLeadCompany = await updateLeadCompany(name, companyName);
		return res.status(201).json(newLeadCompany);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createMultipleLeadOpportunity = async (req, res) => {
	const { newRecord, companyName } = req.body;
	let leadsCreated = 0;
	// NEW-06: without a company the leads were created company-less and the
	// response listed every tenant's undisbursed leads.
	if (typeof companyName !== "string" || !companyName.trim() || !Array.isArray(newRecord)) {
		return res.status(400).json({ message: "companyName and newRecord[] are required" });
	}

	try {
		for (const rowData of newRecord) {
			const { abbreviation, address, name, email, industry, opportunityName, phone } = rowData;

			const data = { abbreviation, name, companyName, email, industry, opportunityName, phone };
			const existingLead = await Lead.findOne(data);

			const { streetNumber, city, state, postalCode, country } = address;
			if (!existingLead) {
				data.address = { streetNumber, city, state, postalCode, country };
				data.primaryAssignee = [];
				data.productService = [];
				data.region = "";
				data.source = "";
				data.stage = "";
				data.supervisorAssignee = [];
				await Lead.create(data);
				leadsCreated++;
			}
		}

		// NEW-06: was { isDisbursed: false } — every tenant's leads.
		const leads = await Lead.find({ isDisbursed: false, companyName }).sort({
			createdOn: -1,
		});
		return res.status(200).json(leads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const updateLeadDisburseStatus = async (id, salesperson) => {
	try {
		const updatedData = { isDisbursed: true, disbursedTo: salesperson };
		return await Lead.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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

const disburseLeads = async (req, res) => {
	const distributedLeadIDs = req.body;

	try {
		const updatedData = { isDisbursed: true };
		const updatedLeads = await Lead.updateMany(
			{ _id: { $in: distributedLeadIDs } },
			{ $set: updatedData },
		).sort({
			createdOn: -1,
		});

		return res.status(201).json(updatedLeads);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}

	// try {
	// 	const leads = await Lead.find({ _id: { $in: distributedLeadIDs } }).sort({
	// 		createdOn: -1,
	// 	});

	// 	// const distributedLeads = distributeLeadsAmongTeamMembers(leads);
	// 	res.status(201).json(distributedLeads);
	// } catch (error) {
	// return res.status(500).json({ message: "Internal Server Error", error });
	// }
};

const confirmDisburseLeads = async (req, res) => {
	const distributedLeadIDs = req.body;
	if (!Array.isArray(distributedLeadIDs)) {
		return res.status(400).json({ message: "An array of assignments is required" });
	}

	try {
		// NEW-06: leads were taken from every tenant and could be assigned to any
		// tenant's employee; a missing employee crashed (500). Validate every
		// assignment before writing anything.
		const allowed = await getScopedCompanyNames(req);
		const plan = [];
		for (const id of distributedLeadIDs) {
			const companies = typeof id?.companyName === "string" ? [id.companyName] : allowed;
			if (companies.length === 0 || companies.some((c) => !allowed.includes(c))) {
				return res.status(403).json({
					message: "You do not have access to this company",
					code: "COMPANY_ACCESS_DENIED",
				});
			}
			if (!mongoose.isValidObjectId(id?._id)) {
				return res.status(400).json({ message: "Invalid employee id" });
			}
			const employee = await Employee.findById(id._id);
			if (!employee) return res.status(404).json({ message: "Employee not found" });
			const shared = await Company.find({ name: { $in: companies }, employees: String(employee._id) })
				.select("name")
				.lean();
			if (!shared?.length) {
				return res.status(403).json({
					message: "Employee does not belong to this company",
					code: "COMPANY_ACCESS_DENIED",
				});
			}
			plan.push({ id, employee, companies: shared.map((c) => c.name) });
		}

		for (const { id, employee, companies } of plan) {
			const leads = await Lead.find({
				isDisbursedConfirmed: false,
				isDisbursed: true,
				companyName: { $in: companies },
			});
			const slicedLeads = leads.slice(0, id.assignedLeads);
			employee.leads = leads.slice(0, id.assignedLeads).map((lead) => lead._id);

			await employee.save();

			for (const id of slicedLeads) {
				const lead = await Lead.findById(id._id);
				if (!lead) continue;
				lead.isDisbursedConfirmed = true;
				lead.stage = "L1";
				lead.primaryAssignee = employee.fullName;
				await lead.save();
			}
		}
		return res.status(200).json("Disbursement confirmed successfully");
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateLead = async (req, res) => {
	const { id } = req.params;

	try {
		const { _id, ...updateData } = req.body;
		const updatedLead = await Lead.findByIdAndUpdate(id, { $set: updateData }, { new: true });
		const existingContact = await Contact.findOne({ leadId: updatedLead._id });
		if (!existingContact) {
			await Contact.create({
				leadId: updatedLead._id,
				companyName: updateData.companyName,
			});
		}

		return res.status(201).json(updatedLead);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};
const deleteLead = async (req, res) => {
	const { id } = req.params;
	try {
		const lead = await Lead.findByIdAndDelete({
			_id: id,
		});
		if (lead) {
			return res.status(200).json(`lead with id ${id} deleted successfully.`);
		} else {
			return res.status(404).json({ message: "lead Details not found." });
		}
	} catch (error) {
		return res.status(404).json({ message: "Error deleting lead:", error });
	}
};

module.exports = {
	confirmDisburseLeads,
	createLeadOpportunity,
	disburseLeads,
	getConfirmedDisbursedLeads,
	getDisbursedLeads,
	getOpportunities,
	getLeadsNotDisbursed,
	updateLead,
	createMultipleLeadOpportunity,
	deleteLead,
	getLeadCompanies,
	createLeadCompany,
	getGroupedOpportunities,
	getTargetLeads,
	getGroupedOpportunitiesByCompany,
	getLead,
	getOpportunityNames,
};
